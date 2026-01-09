export interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCIES: Currency[] = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'Dólar estadounidense' },
  { code: 'MXN', symbol: '$', name: 'Peso mexicano' },
  { code: 'GBP', symbol: '£', name: 'Libra esterlina' },
  { code: 'ARS', symbol: '$', name: 'Peso argentino' },
  { code: 'CLP', symbol: '$', name: 'Peso chileno' },
  { code: 'COP', symbol: '$', name: 'Peso colombiano' },
  { code: 'BRL', symbol: 'R$', name: 'Real brasileño' },
];

export const DEFAULT_CURRENCY = 'EUR';

export function getCurrencyByCode(code: string): Currency | undefined {
  return CURRENCIES.find((c) => c.code === code);
}
