export function formatPrice(price: number | string) {
  let priceNumber = price;
  if (typeof price === "string") {
    priceNumber = Number(price);
  }

  return priceNumber.toLocaleString("es-AR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}