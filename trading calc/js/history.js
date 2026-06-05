import { HISTORY_LIMIT, STORAGE_KEY } from "./config.js";

function createId() {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return window.crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function loadHistory() {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

function writeHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, HISTORY_LIMIT)));
}

export function saveTrade(calculation) {
  const trade = {
    id: createId(),
    date: new Date().toISOString(),
    instrument: calculation.instrument.symbol,
    accountBalance: calculation.accountBalance,
    riskType: calculation.riskType,
    riskValue: calculation.riskValue,
    entryPrice: calculation.entryPrice,
    stopLoss: calculation.stopLoss,
    takeProfit: calculation.takeProfit,
    lotSize: calculation.lotSize,
    riskAmount: calculation.targetRiskAmount,
    potentialProfit: calculation.potentialProfit,
    potentialLoss: calculation.potentialLoss,
    riskRewardRatio: calculation.riskRewardRatio,
  };

  const history = [trade, ...loadHistory()].slice(0, HISTORY_LIMIT);
  writeHistory(history);
  return history;
}

export function deleteTrade(id) {
  const history = loadHistory().filter((trade) => trade.id !== id);
  writeHistory(history);
  return history;
}

export function clearAllHistory() {
  writeHistory([]);
  return [];
}
