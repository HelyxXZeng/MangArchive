import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import vi from './vi.json';
import I18nextBrowserLanguageDetector from 'i18next-browser-languagedetector';

i18n.use(I18nextBrowserLanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      vi: { translation: vi },
    },
    fallbackLng: 'vi',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage', 'cookie'],
      lookupLocalStorage: 'lang', // Key lưu trữ
      lookupCookie: 'i18next', // Key cookie
    },
    supportedLngs: ['en', 'vi'], // Chỉ hỗ trợ hai ngôn ngữ này
    nonExplicitSupportedLngs: true, // Giúp loại bỏ hậu tố như `-US` hay `-VN`
  });

export default i18n;
