// Quai Network JSON-RPC 2.0 API - Proxied through Edge Function
import { supabase } from "@/integrations/supabase/client";
import { getAddress, isQuaiAddress } from "quais";

// Types
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

// RPC response type
interface RpcResponse<T> {
  result: T | null;
  methodNotAvailable?: boolean;
  error?: string;
}

// Helper function for RPC calls via edge function
async function rpcCall<T>(method: string, params: unknown[] = []): Promise<T> {
  const { data, error } = await supabase.functions.invoke("quai-proxy", {
    body: { type: "rpc", rpcMethod: method, rpcParams: params },
  });

  if (error) {
    throw new Error(`RPC proxy error: ${error.message}`);
  }

  const response = data as RpcResponse<T>;
  
  if (response?.error) {
    throw new Error(response.error);
  }

  // Handle method not available
  if (response?.methodNotAvailable) {
    throw new Error(`Method ${method} not available`);
  }

  return response.result as T;
}

/**
 * Convert address to proper Quai checksummed format
 */
export function toChecksumAddress(address: string): string {
  if (!address) return address;
  
  try {
    // Use quais getAddress for proper Quai checksum
    return getAddress(address);
  } catch {
    // If checksum fails, return as-is
    return address;
  }
}

/**
 * Validate if an address is a valid Quai address
 */
export function isValidQuaiAddress(address: string): boolean {
  if (!address) return false;
  try {
    return isQuaiAddress(address);
  } catch {
    return false;
  }
}

/**
 * 11. quai_getBalance
 * Get native QUAI balance (core for portfolio value)
 */
export async function getBalance(address: string, block: string = "latest"): Promise<string> {
  // Use proper EIP-55 checksummed address
  const checksummedAddress = toChecksumAddress(address);
  return rpcCall<string>("quai_getBalance", [checksummedAddress, block]);
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
  // Use proper EIP-55 checksummed addresses
  const normalizedTx = {
    ...txObject,
    from: toChecksumAddress(txObject.from),
    to: toChecksumAddress(txObject.to),
  };
  return rpcCall<string>("quai_estimateGas", [normalizedTx]);
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
 * Note: This method may not be available on all Quai RPC endpoints
 */
export async function getMaxPriorityFeePerGas(): Promise<string> {
  try {
    return await rpcCall<string>("quai_maxPriorityFeePerGas", []);
  } catch {
    // Method not available on this RPC endpoint, return zero
    return "0x0";
  }
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
    getMaxPriorityFeePerGas().catch(() => "0x0"),
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
  const [blockNumberHex, gasPriceHex] = await Promise.all([
    getBlockNumber(),
    getGasPrice(),
  ]);
  
  // Priority fee may not be available, handle gracefully
  let priorityFeeHex = "0x0";
  try {
    priorityFeeHex = await getMaxPriorityFeePerGas();
  } catch {
    // Silently use default
  }

  return {
    blockNumber: hexToNumber(blockNumberHex),
    gasPrice: hexToGwei(gasPriceHex),
    priorityFee: hexToGwei(priorityFeeHex),
  };
}
