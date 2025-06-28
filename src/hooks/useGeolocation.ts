
import { useState, useEffect } from 'react';
import { countryToCurrency, countryToLanguage } from '../config/checkout-config';

interface GeolocationData {
  country: string;
  currency: string;
  language: string;
  exchangeRate: number;
  loading: boolean;
  error: string | null;
}

interface ExchangeRateResponse {
  rates: Record<string, number>;
  base: string;
}

export const useGeolocation = (baseCurrency: string = 'USD') => {
  const [geoData, setGeoData] = useState<GeolocationData>({
    country: 'US',
    currency: 'USD',
    language: 'en',
    exchangeRate: 1,
    loading: true,
    error: null
  });

  useEffect(() => {
    const detectLocationAndCurrency = async () => {
      try {
        console.log('[GEOLOCATION] Starting location detection...');
        
        // Try to get user's country via IP geolocation
        let userCountry = 'US';
        let detectedLanguage = 'en';

        try {
          // Using a free IP geolocation service
          const geoResponse = await fetch('https://ipapi.co/json/');
          const geoJson = await geoResponse.json();
          
          if (geoJson.country_code) {
            userCountry = geoJson.country_code;
            console.log('[GEOLOCATION] Detected country:', userCountry);
          }
        } catch (error) {
          console.log('[GEOLOCATION] IP detection failed, trying browser language...');
          // Fallback to browser language
          const browserLang = navigator.language.split('-')[0];
          const langToCountry: Record<string, string> = {
            'pt': 'BR', 'es': 'ES', 'fr': 'FR', 'de': 'DE', 'it': 'IT',
            'ja': 'JP', 'zh': 'CN', 'ar': 'SA', 'ru': 'RU', 'hi': 'IN',
            'ko': 'KR', 'th': 'TH', 'vi': 'VN', 'tr': 'TR'
          };
          userCountry = langToCountry[browserLang] || 'US';
        }

        // Determine currency and language based on country
        const userCurrency = countryToCurrency[userCountry] || 'USD';
        detectedLanguage = countryToLanguage[userCountry] || 'en';
        
        console.log('[GEOLOCATION] Final detection:', { userCountry, userCurrency, detectedLanguage });

        // Get exchange rate if different from base currency
        let exchangeRate = 1;
        if (userCurrency !== baseCurrency) {
          try {
            console.log('[GEOLOCATION] Fetching exchange rate...');
            const exchangeResponse = await fetch(
              `https://api.exchangerate-api.com/v4/latest/${baseCurrency}`
            );
            const exchangeData: ExchangeRateResponse = await exchangeResponse.json();
            exchangeRate = exchangeData.rates[userCurrency] || 1;
            console.log('[GEOLOCATION] Exchange rate:', exchangeRate);
          } catch (error) {
            console.log('[GEOLOCATION] Exchange rate fetch failed, using default rates');
            // Fallback exchange rates (approximate)
            const fallbackRates: Record<string, number> = {
              'BRL': 5.2, 'EUR': 0.85, 'GBP': 0.73, 'JPY': 110, 'CAD': 1.25,
              'AUD': 1.35, 'CHF': 0.92, 'CNY': 6.4, 'INR': 74, 'KRW': 1180,
              'SGD': 1.35, 'HKD': 7.8, 'THB': 33, 'MYR': 4.1, 'IDR': 14200,
              'PHP': 50, 'VND': 23000, 'TWD': 28, 'AED': 3.67, 'SAR': 3.75,
              'ILS': 3.2, 'EGP': 15.7, 'ZAR': 14.5, 'NGN': 411, 'RUB': 74,
              'TRY': 8.5, 'MXN': 20, 'ARS': 98, 'CLP': 800
            };
            exchangeRate = fallbackRates[userCurrency] || 1;
          }
        }

        setGeoData({
          country: userCountry,
          currency: userCurrency,
          language: detectedLanguage,
          exchangeRate,
          loading: false,
          error: null
        });

      } catch (error) {
        console.error('[GEOLOCATION] Error:', error);
        setGeoData(prev => ({
          ...prev,
          loading: false,
          error: 'Failed to detect location'
        }));
      }
    };

    detectLocationAndCurrency();
  }, [baseCurrency]);

  const convertPrice = (price: number): number => {
    return Math.round(price * geoData.exchangeRate * 100) / 100;
  };

  return {
    ...geoData,
    convertPrice
  };
};
