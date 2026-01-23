import { useQuery, useMutation } from "@tanstack/react-query";
import * as quaiscan from "@/lib/api/quaiscan";
import * as quaiRpc from "@/lib/api/quai-rpc";

// Query keys for cache management
export const queryKeys = {
  addressInfo: (address: string) => ["address", address],
  addressTokens: (address: string) => ["address", address, "tokens"],
  addressTransactions: (address: string) => ["address", address, "transactions"],
  addressTokenTransfers: (address: string) => ["address", address, "tokenTransfers"],
  tokenInfo: (tokenAddress: string) => ["token", tokenAddress],
  tokenHolders: (tokenAddress: string) => ["token", tokenAddress, "holders"],
  tokenTransfers: (tokenAddress: string) => ["token", tokenAddress, "transfers"],
  networkStats: ["network", "stats"],
  blocks: ["network", "blocks"],
  coinPrice: ["market", "coinPrice"],
  balance: (address: string) => ["rpc", "balance", address],
  gasPrice: ["rpc", "gasPrice"],
  networkStatus: ["rpc", "networkStatus"],
};

// ============= REST API Hooks =============

/**
 * Get complete account details
 */
export function useAddressInfo(address: string | undefined) {
  return useQuery({
    queryKey: queryKeys.addressInfo(address || ""),
    queryFn: () => quaiscan.getAddressInfo(address!),
    enabled: !!address,
    staleTime: 10 * 1000, // 10 seconds cache
  });
}

/**
 * Get all tokens held by address
 */
export function useAddressTokens(address: string | undefined) {
  return useQuery({
    queryKey: queryKeys.addressTokens(address || ""),
    queryFn: () => quaiscan.getAddressTokens(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

/**
 * Get transaction history
 */
export function useAddressTransactions(address: string | undefined) {
  return useQuery({
    queryKey: queryKeys.addressTransactions(address || ""),
    queryFn: () => quaiscan.getAddressTransactions(address!),
    enabled: !!address,
    staleTime: 60 * 1000, // 1 minute cache
  });
}

/**
 * Get token transfer history
 */
export function useAddressTokenTransfers(address: string | undefined) {
  return useQuery({
    queryKey: queryKeys.addressTokenTransfers(address || ""),
    queryFn: () => quaiscan.getAddressTokenTransfers(address!),
    enabled: !!address,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

/**
 * Get token information
 */
export function useTokenInfo(tokenAddress: string | undefined) {
  return useQuery({
    queryKey: queryKeys.tokenInfo(tokenAddress || ""),
    queryFn: () => quaiscan.getTokenInfo(tokenAddress!),
    enabled: !!tokenAddress,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
}

/**
 * Get token holders for risk analysis
 */
export function useTokenHolders(tokenAddress: string | undefined) {
  return useQuery({
    queryKey: queryKeys.tokenHolders(tokenAddress || ""),
    queryFn: () => quaiscan.getTokenHolders(tokenAddress!),
    enabled: !!tokenAddress,
    staleTime: 10 * 60 * 1000, // 10 minutes cache
  });
}

/**
 * Get token transfers for volume analysis
 */
export function useTokenTransfers(tokenAddress: string | undefined) {
  return useQuery({
    queryKey: queryKeys.tokenTransfers(tokenAddress || ""),
    queryFn: () => quaiscan.getTokenTransfers(tokenAddress!),
    enabled: !!tokenAddress,
    staleTime: 5 * 60 * 1000, // 5 minutes cache
  });
}

/**
 * Get network-wide statistics
 */
export function useNetworkStats() {
  return useQuery({
    queryKey: queryKeys.networkStats,
    queryFn: quaiscan.getNetworkStats,
    staleTime: 60 * 1000, // 1 minute cache
    refetchInterval: 60 * 1000, // Auto-refresh every minute
  });
}

/**
 * Get recent blocks
 */
export function useBlocks() {
  return useQuery({
    queryKey: queryKeys.blocks,
    queryFn: () => quaiscan.getBlocks(),
    staleTime: 30 * 1000, // 30 seconds cache
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
}

/**
 * Get QUAI coin price
 */
export function useCoinPrice() {
  return useQuery({
    queryKey: queryKeys.coinPrice,
    queryFn: quaiscan.getCoinPrice,
    staleTime: 30 * 1000, // 30 seconds cache
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
}

// ============= RPC Hooks =============

/**
 * Get native QUAI balance
 */
export function useBalance(address: string | undefined) {
  return useQuery({
    queryKey: queryKeys.balance(address || ""),
    queryFn: async () => {
      const hexBalance = await quaiRpc.getBalance(address!);
      return {
        hex: hexBalance,
        quai: quaiRpc.hexToQuai(hexBalance),
      };
    },
    enabled: !!address,
    staleTime: 10 * 1000, // 10 seconds cache
    refetchInterval: 30 * 1000, // Auto-refresh every 30 seconds
  });
}

/**
 * Get current gas prices
 */
export function useGasPrice() {
  return useQuery({
    queryKey: queryKeys.gasPrice,
    queryFn: async () => {
      const hexPrice = await quaiRpc.getGasPrice();
      return {
        hex: hexPrice,
        gwei: quaiRpc.hexToGwei(hexPrice),
      };
    },
    staleTime: 5 * 1000, // 5 seconds cache
    refetchInterval: 10 * 1000, // Auto-refresh every 10 seconds
  });
}

/**
 * Get network status (block number, gas price, priority fee)
 */
export function useNetworkStatus() {
  return useQuery({
    queryKey: queryKeys.networkStatus,
    queryFn: quaiRpc.getNetworkStatus,
    staleTime: 5 * 1000, // 5 seconds cache
    refetchInterval: 10 * 1000, // Auto-refresh every 10 seconds
  });
}

/**
 * Estimate gas for a transaction
 */
export function useGasEstimate(txObject: {
  from: string;
  to: string;
  value?: string;
  data?: string;
} | undefined) {
  return useQuery({
    queryKey: ["rpc", "gasEstimate", txObject],
    queryFn: () => quaiRpc.getGasEstimate(txObject!),
    enabled: !!txObject?.from && !!txObject?.to,
    staleTime: 10 * 1000, // 10 seconds cache
  });
}

/**
 * Send raw transaction mutation
 */
export function useSendTransaction() {
  return useMutation({
    mutationFn: (signedTxData: string) => quaiRpc.sendRawTransaction(signedTxData),
  });
}

/**
 * Combined hook for portfolio data
 */
export function usePortfolioData(address: string | undefined) {
  const balance = useBalance(address);
  const tokens = useAddressTokens(address);
  const transactions = useAddressTransactions(address);
  const coinPrice = useCoinPrice();

  const isLoading = balance.isLoading || tokens.isLoading || coinPrice.isLoading;
  const isError = balance.isError || tokens.isError || coinPrice.isError;

  // Calculate total portfolio value
  const quaiBalance = balance.data?.quai || 0;
  const quaiPrice = coinPrice.data?.result?.quai_usd ? parseFloat(coinPrice.data.result.quai_usd) : 0;
  const quaiValue = quaiBalance * quaiPrice;

  // Token values
  const tokenValues = tokens.data?.items?.reduce((sum, item) => {
    return sum + (parseFloat(item.value) || 0);
  }, 0) || 0;

  const totalValue = quaiValue + tokenValues;

  return {
    balance,
    tokens,
    transactions,
    coinPrice,
    isLoading,
    isError,
    quaiBalance,
    quaiPrice,
    quaiValue,
    tokenValues,
    totalValue,
  };
}

/**
 * Combined hook for market data
 */
export function useMarketData() {
  const networkStats = useNetworkStats();
  const coinPrice = useCoinPrice();
  const networkStatus = useNetworkStatus();
  const blocks = useBlocks();

  return {
    networkStats,
    coinPrice,
    networkStatus,
    blocks,
    isLoading: networkStats.isLoading || coinPrice.isLoading,
    isError: networkStats.isError || coinPrice.isError,
  };
}
