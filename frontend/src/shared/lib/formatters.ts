export function delay(duration = 900) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}
