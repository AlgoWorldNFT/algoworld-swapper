export default function formatAmount(amount?: number, decimals = 0) {
  return amount ? amount / Math.pow(10, decimals) : amount;
}
