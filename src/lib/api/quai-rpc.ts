// Quai Network JSON-RPC 2.0 API
// Base URL: https://rpc.quai.network/cyprus1/api/eth-rpc

const RPC_URL = "https://rpc.quai.network/cyprus1/api/eth-rpc";

// Types
interface JsonRpcRequest {
  jsonrpc: "2.0";
  method: string;
  params: unknown[];
  id: number;
}

interface JsonRpcResponse<T> {
  jsonrpc: "2.0";
  result: T;
  id: number;
  error?: {
    code: number;
    message: string;
  };
}

export interface BlockInfo {
  number: string;
  hash: string;
  parentHash: string;
  timestamp: string;
  gasUsed: string;
  gasLimit: string;
  transactions: string[];
  miner: string;
}

export interface GasEstimate {
  gasLimit: string;
  gasPrice: string;
  priorityFee: string;
  totalCostWei: string;
  totalCostQuai: number;
}

// Helper function for RPC calls
async function rpcCall<T>(method: string, params: unknown[] = []): Promise<T> {
  const request: JsonRpcRequest = {
    jsonrpc: "2.0",
    method,
    params,
    id: Date.now(),
  };

  const response = await fetch(RPC_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(`RPC request failed: ${response.status}`);
  }

  const data: JsonRpcResponse<T> = await response.json();
  
  if (data.error) {
    throw new Error(`RPC error: ${data.error.message}`);
  }

  return data.result;
}

/**
 * 11. quai_getBalance
 * Get native QUAI balance (core for portfolio value)
 */
export async function getBalance(address: string, block: string = "latest"): Promise<string> {
  const result = await rpcCall<string>("quai_getBalance", [address, block]);
  return result;
}

/**
 * Convert hex balance to QUAI
 */
export function hexToQuai(hexBalance: string): number {
  const wei = BigInt(hexBalance);
  return Number(wei) / 1e18;
}

/**
 * 12. quai_estimateGas
 * Estimate gas for transactions (fee calculation)
 */
export async function estimateGas(txObject: {
  from: string;
  to: string;
  value?: string;
  data?: string;
}): Promise<string> {
  return rpcCall<string>("quai_estimateGas", [txObject]);
}

/**
 * 13. quai_gasPrice
 * Get current gas price (Gwei)
 */
export async function getGasPrice(): Promise<string> {
  return rpcCall<string>("quai_gasPrice", []);
}

/**
 * Convert hex gas price to Gwei
 */
export function hexToGwei(hexPrice: string): number {
  const wei = BigInt(hexPrice);
  return Number(wei) / 1e9;
}

/**
 * 14. quai_maxPriorityFeePerGas
 * Get priority fee for fast execution
 */
export async function getMaxPriorityFeePerGas(): Promise<string> {
  return rpcCall<string>("quai_maxPriorityFeePerGas", []);
}

/**
 * 15. quai_sendRawTransaction
 * Execute buy/sell orders
 */
export async function sendRawTransaction(signedTxData: string): Promise<string> {
  return rpcCall<string>("quai_sendRawTransaction", [signedTxData]);
}

/**
 * 16. quai_blockNumber
 * Get latest block for confirmation tracking
 */
export async function getBlockNumber(): Promise<string> {
  return rpcCall<string>("quai_blockNumber", []);
}

/**
 * Convert hex block number to decimal
 */
export function hexToNumber(hex: string): number {
  return parseInt(hex, 16);
}

/**
 * 17. quai_getBlockByNumber
 * Get block details for network analysis
 */
export async function getBlockByNumber(
  blockNumber: string | "latest" | "earliest" | "pending",
  includeTransactions: boolean = false
): Promise<BlockInfo | null> {
  return rpcCall<BlockInfo | null>("quai_getBlockByNumber", [blockNumber, includeTransactions]);
}

/**
 * Get transaction receipt
 */
export async function getTransactionReceipt(txHash: string): Promise<{
  status: string;
  blockNumber: string;
  gasUsed: string;
} | null> {
  return rpcCall("quai_getTransactionReceipt", [txHash]);
}

/**
 * Get comprehensive gas estimate for UI display
 */
export async function getGasEstimate(txObject: {
  from: string;
  to: string;
  value?: string;
  data?: string;
}): Promise<GasEstimate> {
  const [gasLimit, gasPrice, priorityFee] = await Promise.all([
    estimateGas(txObject),
    getGasPrice(),
    getMaxPriorityFeePerGas().catch(() => "0x0"), // Fallback if not supported
  ]);

  const gasLimitBigInt = BigInt(gasLimit);
  const gasPriceBigInt = BigInt(gasPrice);
  const totalCostWei = gasLimitBigInt * gasPriceBigInt;

  return {
    gasLimit,
    gasPrice,
    priorityFee,
    totalCostWei: "0x" + totalCostWei.toString(16),
    totalCostQuai: Number(totalCostWei) / 1e18,
  };
}

/**
 * Get network status summary
 */
export async function getNetworkStatus(): Promise<{
  blockNumber: number;
  gasPrice: number;
  priorityFee: number;
}> {
  const [blockNumberHex, gasPriceHex, priorityFeeHex] = await Promise.all([
    getBlockNumber(),
    getGasPrice(),
    getMaxPriorityFeePerGas().catch(() => "0x0"),
  ]);

  return {
    blockNumber: hexToNumber(blockNumberHex),
    gasPrice: hexToGwei(gasPriceHex),
    priorityFee: hexToGwei(priorityFeeHex),
  };
}
