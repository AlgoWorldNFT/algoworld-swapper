export default function formatAmount(amount?: number, decimals = 0) {
  console.log(`formatAmount`, amount, decimals);
  return amount ? amount / Math.pow(10, decimals) : amount;
}
