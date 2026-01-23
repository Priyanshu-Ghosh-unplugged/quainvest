// Quaiscan REST API v2 - Base URL: https://quaiscan.io/api
const BASE_URL = "https://quaiscan.io/api";

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
  coin_price: string;
  market_cap: string;
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
    quai_usd: string;
    quai_btc: string;
  };
}

// API Functions

/**
 * 1. GET /api/v2/addresses/{address}
 * Get complete account details for portfolio overview
 */
export async function getAddressInfo(address: string): Promise<AddressInfo> {
  const response = await fetch(`${BASE_URL}/v2/addresses/${address}`);
  if (!response.ok) throw new Error(`Failed to fetch address info: ${response.status}`);
  return response.json();
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
  
  const url = `${BASE_URL}/v2/addresses/${address}/tokens${params.toString() ? `?${params}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch tokens: ${response.status}`);
  return response.json();
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
  
  const url = `${BASE_URL}/v2/addresses/${address}/transactions${params.toString() ? `?${params}` : ""}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch transactions: ${response.status}`);
  return response.json();
}

/**
 * 4. GET /api/v2/addresses/{address}/token-transfers
 * Track token transfer history for detailed portfolio tracking
 */
export async function getAddressTokenTransfers(address: string): Promise<TokenTransfersResponse> {
  const response = await fetch(`${BASE_URL}/v2/addresses/${address}/token-transfers`);
  if (!response.ok) throw new Error(`Failed to fetch token transfers: ${response.status}`);
  return response.json();
}

/**
 * 5. GET /api/v2/tokens/{address}
 * Get detailed token metadata for token detail pages
 */
export async function getTokenInfo(tokenAddress: string): Promise<TokenInfo> {
  const response = await fetch(`${BASE_URL}/v2/tokens/${tokenAddress}`);
  if (!response.ok) throw new Error(`Failed to fetch token info: ${response.status}`);
  return response.json();
}

/**
 * 6. GET /api/v2/tokens/{address}/holders
 * Analyze holder distribution for risk assessment
 */
export async function getTokenHolders(tokenAddress: string): Promise<TokenHoldersResponse> {
  const response = await fetch(`${BASE_URL}/v2/tokens/${tokenAddress}/holders`);
  if (!response.ok) throw new Error(`Failed to fetch token holders: ${response.status}`);
  return response.json();
}

/**
 * 7. GET /api/v2/tokens/{address}/transfers
 * Track token trading volume and liquidity
 */
export async function getTokenTransfers(tokenAddress: string): Promise<TokenTransfersResponse> {
  const response = await fetch(`${BASE_URL}/v2/tokens/${tokenAddress}/transfers`);
  if (!response.ok) throw new Error(`Failed to fetch token transfers: ${response.status}`);
  return response.json();
}

/**
 * 8. GET /api/v2/stats
 * Get network-wide statistics for market dashboard
 */
export async function getNetworkStats(): Promise<NetworkStats> {
  const response = await fetch(`${BASE_URL}/v2/stats`);
  if (!response.ok) throw new Error(`Failed to fetch network stats: ${response.status}`);
  return response.json();
}

/**
 * 9. GET /api/v2/blocks
 * Get block data for trends and activity analysis
 */
export async function getBlocks(blockNumber?: number): Promise<BlocksResponse> {
  const params = blockNumber ? `?block_number=${blockNumber}` : "";
  const response = await fetch(`${BASE_URL}/v2/blocks${params}`);
  if (!response.ok) throw new Error(`Failed to fetch blocks: ${response.status}`);
  return response.json();
}

/**
 * 10. Legacy Stats - Coin Price
 * GET /api?module=stats&action=coinprice
 */
export async function getCoinPrice(): Promise<CoinPriceResponse> {
  const response = await fetch(`${BASE_URL}?module=stats&action=coinprice`);
  if (!response.ok) throw new Error(`Failed to fetch coin price: ${response.status}`);
  return response.json();
}

/**
 * 10. Legacy Stats - Token Supply
 * GET /api?module=stats&action=tokensupply&contractaddress=0x...
 */
export async function getTokenSupply(contractAddress: string): Promise<{ status: string; result: string }> {
  const response = await fetch(`${BASE_URL}?module=stats&action=tokensupply&contractaddress=${contractAddress}`);
  if (!response.ok) throw new Error(`Failed to fetch token supply: ${response.status}`);
  return response.json();
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
