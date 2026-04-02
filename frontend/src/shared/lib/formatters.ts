export function delay(duration = 900) {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, duration);
  });
}

export function formatCurrency(value: number, locale = 'ru-KZ') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'KZT',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, locale = 'ru-KZ', digits = 1) {
  return new Intl.NumberFormat(locale, {
    style: 'percent',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value / 100);
}
