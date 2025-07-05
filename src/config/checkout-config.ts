
export interface CheckoutConfig {
  productName: string;
  productDescription: string;
  originalPrice: number;
  salePrice: number;
  currency: string;
  stripePublishableKey: string;
  supportedCurrencies: string[];
  supportedLanguages: string[];
  securityFeatures: {
    antiRightClick: boolean;
    antiCopy: boolean;
    antiDevTools: boolean;
    antiDebug: boolean;
  };
  adminPassword: string;
}

export const defaultConfig: CheckoutConfig = {
  productName: "Premium Product",
  productDescription: "Advanced digital solution for professionals",
  originalPrice: 297.00,
  salePrice: 97.00,
  currency: "USD",
  stripePublishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "pk_test_placeholder",
  supportedCurrencies: [
    "USD", "EUR", "BRL", "JPY", "GBP", "CAD", "AUD", "CHF", "CNY", "INR",
    "KRW", "SGD", "HKD", "THB", "MYR", "IDR", "PHP", "VND", "TWD", "AED",
    "SAR", "ILS", "EGP", "ZAR", "NGN", "RUB", "TRY", "MXN", "ARS", "CLP"
  ],
  supportedLanguages: [
    "pt", "en", "es", "fr", "de", "it", "ja", "zh", "ar", "ru",
    "hi", "ko", "th", "vi", "tr"
  ],
  securityFeatures: {
    antiRightClick: false, // Melhorado para não interferir na UX
    antiCopy: false,       // Melhorado para não interferir na UX
    antiDevTools: false,   // Melhorado para desenvolvimento
    antiDebug: false       // Melhorado para desenvolvimento
  },
  adminPassword: "admin123" // TODO: Implementar hash de senha
};

export const currencySymbols: Record<string, string> = {
  USD: "$", EUR: "€", BRL: "R$", JPY: "¥", GBP: "£", CAD: "C$",
  AUD: "A$", CHF: "CHF", CNY: "¥", INR: "₹", KRW: "₩", SGD: "S$",
  HKD: "HK$", THB: "฿", MYR: "RM", IDR: "Rp", PHP: "₱", VND: "₫",
  TWD: "NT$", AED: "د.إ", SAR: "﷼", ILS: "₪", EGP: "£", ZAR: "R",
  NGN: "₦", RUB: "₽", TRY: "₺", MXN: "$", ARS: "$", CLP: "$"
};

export const countryToCurrency: Record<string, string> = {
  US: "USD", BR: "BRL", JP: "JPY", DE: "EUR", GB: "GBP", CA: "CAD",
  AU: "AUD", CH: "CHF", CN: "CNY", IN: "INR", KR: "KRW", SG: "SGD",
  HK: "HKD", TH: "THB", MY: "MYR", ID: "IDR", PH: "PHP", VN: "VND",
  TW: "TWD", AE: "AED", SA: "SAR", IL: "ILS", EG: "EGP", ZA: "ZAR",
  NG: "NGN", RU: "RUB", TR: "TRY", MX: "MXN", AR: "ARS", CL: "CLP"
};

export const countryToLanguage: Record<string, string> = {
  BR: "pt", US: "en", GB: "en", ES: "es", MX: "es", AR: "es",
  FR: "fr", CA: "fr", DE: "de", AT: "de", IT: "it", JP: "ja",
  CN: "zh", TW: "zh", SA: "ar", AE: "ar", RU: "ru", IN: "hi",
  KR: "ko", TH: "th", VN: "vi", TR: "tr"
};
