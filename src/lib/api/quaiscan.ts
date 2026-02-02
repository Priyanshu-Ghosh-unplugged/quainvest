// Quaiscan REST API v2 - Proxied through Edge Function
import { supabase } from "@/integrations/supabase/client";

// Types
export interface AddressInfo {
  hash: string;
  implementation_name: string | null;
  name: string | null;
  is_contract: boolean;
  created_tx_hash: string;
  transactions_count: number;
  tokens_count: number;
}

export interface TokenBalance {
  token: {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    icon_url?: string;
  };
  balance: string;
  value: string;
}

export interface TokensResponse {
  items: TokenBalance[];
  next_page_params: Record<string, string> | null;
}

export interface Transaction {
  hash: string;
  from: { hash: string; is_contract: boolean };
  to: { hash: string; is_contract: boolean } | null;
  value: string;
  gas_used: string;
  gas_price: string;
  timestamp: string;
  result: string;
  method?: string;
  type?: number;
}

export interface TransactionsResponse {
  items: Transaction[];
  next_page_params: Record<string, string> | null;
}

export interface TokenTransfer {
  tx_hash: string;
  from: { hash: string };
  to: { hash: string };
  total: { value: string; decimals: number };
  token: { address: string; name: string; symbol: string };
  timestamp: string;
  block_number: number;
}

export interface TokenTransfersResponse {
  items: TokenTransfer[];
  next_page_params: Record<string, string> | null;
}

export interface TokenInfo {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  holders: number;
  total_supply: string;
  icon_url?: string;
  exchange_rate?: string;
}

export interface TokenHolder {
  address: { hash: string };
  value: string;
  percentage: string;
}

export interface TokenHoldersResponse {
  items: TokenHolder[];
  next_page_params: Record<string, string> | null;
}

export interface NetworkStats {
  total_blocks: string;
  total_transactions: string;
  total_addresses: string;
  transactions_today: string;
  average_block_time: number;
  coin_price: string | null;
  market_cap: string;
  gas_prices: {
    slow: number | null;
    average: number | null;
    fast: number | null;
  };
  network_utilization_percentage: number;
}

export interface Block {
  number: number;
  timestamp: string;
  gas_used: string;
  gas_limit: string;
  tx_count: number;
  miner: { hash: string };
}

export interface BlocksResponse {
  items: Block[];
  next_page_params: Record<string, string> | null;
}

export interface CoinPriceResponse {
  status: string;
  message: string;
  result: {
    coin_usd: string | null;
    coin_btc: string | null;
  };
}

// Helper function to call the edge function
async function proxyRestCall<T>(endpoint: string, defaultOnNotFound?: T): Promise<T> {
  const { data, error } = await supabase.functions.invoke("quai-proxy", {
    body: { type: "rest", endpoint },
  });

  if (error) {
    // If we have a default for 404s and this is a 404, return the default
    if (defaultOnNotFound !== undefined && error.message?.includes("404")) {
      return defaultOnNotFound;
    }
    throw new Error(`Proxy error: ${error.message}`);
  }

  if (data?.error) {
    // Handle 404 errors gracefully for address endpoints (address has no activity)
    if (defaultOnNotFound !== undefined && data.error.includes("404")) {
      return defaultOnNotFound;
    }
    throw new Error(data.error);
  }

  return data as T;
}

/**
 * 1. GET /api/v2/addresses/{address}
 * Get complete account details for portfolio overview
 */
export async function getAddressInfo(address: string): Promise<AddressInfo> {
  return proxyRestCall<AddressInfo>(`/v2/addresses/${address}`);
}

/**
 * 2. GET /api/v2/addresses/{address}/tokens
 * Get all tokens held by address (core for asset allocation)
 */
export async function getAddressTokens(
  address: string,
  options?: { filterType?: "erc20" | "erc721" | "erc1155"; itemsCount?: number }
): Promise<TokensResponse> {
  const params = new URLSearchParams();
  if (options?.filterType) params.set("filter_token_type_by", options.filterType);
  if (options?.itemsCount) params.set("items_count", options.itemsCount.toString());
  
  const queryString = params.toString() ? `?${params}` : "";
  // Return empty items array if address has no activity (404)
  return proxyRestCall<TokensResponse>(`/v2/addresses/${address}/tokens${queryString}`, { items: [], next_page_params: null });
}

/**
 * 3. GET /api/v2/addresses/{address}/transactions
 * Get transaction history for P&L calculation and tax reporting
 */
export async function getAddressTransactions(
  address: string,
  options?: { blockNumber?: number; index?: number; itemsCount?: number }
): Promise<TransactionsResponse> {
  const params = new URLSearchParams();
  if (options?.blockNumber) params.set("block_number", options.blockNumber.toString());
  if (options?.index) params.set("index", options.index.toString());
  if (options?.itemsCount) params.set("items_count", options.itemsCount.toString());
  
  const queryString = params.toString() ? `?${params}` : "";
  // Return empty items array if address has no activity (404)
  return proxyRestCall<TransactionsResponse>(`/v2/addresses/${address}/transactions${queryString}`, { items: [], next_page_params: null });
}

/**
 * 4. GET /api/v2/addresses/{address}/token-transfers
 * Track token transfer history for detailed portfolio tracking
 */
export async function getAddressTokenTransfers(address: string): Promise<TokenTransfersResponse> {
  // Return empty items array if address has no activity (404)
  return proxyRestCall<TokenTransfersResponse>(`/v2/addresses/${address}/token-transfers`, { items: [], next_page_params: null });
}

/**
 * 5. GET /api/v2/tokens/{address}
 * Get detailed token metadata for token detail pages
 */
export async function getTokenInfo(tokenAddress: string): Promise<TokenInfo> {
  return proxyRestCall<TokenInfo>(`/v2/tokens/${tokenAddress}`);
}

/**
 * 6. GET /api/v2/tokens/{address}/holders
 * Analyze holder distribution for risk assessment
 */
export async function getTokenHolders(tokenAddress: string): Promise<TokenHoldersResponse> {
  return proxyRestCall<TokenHoldersResponse>(`/v2/tokens/${tokenAddress}/holders`);
}

/**
 * 7. GET /api/v2/tokens/{address}/transfers
 * Track token trading volume and liquidity
 */
export async function getTokenTransfers(tokenAddress: string): Promise<TokenTransfersResponse> {
  return proxyRestCall<TokenTransfersResponse>(`/v2/tokens/${tokenAddress}/transfers`);
}

/**
 * 8. GET /api/v2/stats
 * Get network-wide statistics for market dashboard
 */
export async function getNetworkStats(): Promise<NetworkStats> {
  return proxyRestCall<NetworkStats>("/v2/stats");
}

/**
 * 9. GET /api/v2/blocks
 * Get block data for trends and activity analysis
 */
export async function getBlocks(blockNumber?: number): Promise<BlocksResponse> {
  const params = blockNumber ? `?block_number=${blockNumber}` : "";
  return proxyRestCall<BlocksResponse>(`/v2/blocks${params}`);
}

/**
 * 10. Legacy Stats - Coin Price
 * GET /api?module=stats&action=coinprice
 */
export async function getCoinPrice(): Promise<CoinPriceResponse> {
  return proxyRestCall<CoinPriceResponse>("?module=stats&action=coinprice");
}

/**
 * 10. Legacy Stats - Token Supply
 * GET /api?module=stats&action=tokensupply&contractaddress=0x...
 */
export async function getTokenSupply(contractAddress: string): Promise<{ status: string; result: string }> {
  return proxyRestCall<{ status: string; result: string }>(`?module=stats&action=tokensupply&contractaddress=${contractAddress}`);
}

// Utility functions
export function weiToQuai(wei: string): number {
  return parseFloat(wei) / 1e18;
}

export function formatBalance(balance: string, decimals: number = 18): string {
  const value = parseFloat(balance) / Math.pow(10, decimals);
  return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
}

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars + 2)}...${address.slice(-chars)}`;
}
