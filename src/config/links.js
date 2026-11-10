const env = import.meta.env;

const getEnvValue = (key, fallback = '') => env[key]?.trim() || fallback;

export const APP_LINKS = Object.freeze({
  contact: Object.freeze({
    email: getEnvValue('VITE_SUPPORT_EMAIL', 'info@aralpars.com'),
    telegramHandle: getEnvValue('VITE_TELEGRAM_HANDLE', 'VOLTGuardPro_Aralparspaya').replace(/^@/, ''),
    whatsappUsername: getEnvValue('VITE_WHATSAPP_USERNAME', '@VoltGuardPro_A.P.P').replace(/^@/, '')
  }),
  stores: Object.freeze({
    ios: getEnvValue('VITE_IOS_APP_STORE_URL', 'https://apps.apple.com/search?term=VoltGuard%20Pro'),
    android: getEnvValue('VITE_ANDROID_PLAY_STORE_URL', 'https://play.google.com/store/search?q=VoltGuard%20Pro&c=apps')
  }),
  payments: Object.freeze({
    paypal: getEnvValue('VITE_PAYPAL_PAYMENT_URL', 'https://www.paypal.com/donate/?hosted_button_id=YOUR_PAYPAL_BUTTON_ID'),
    revolut: getEnvValue('VITE_REVOLUT_PAYMENT_URL', 'https://revolut.me/voltguard')
  }),
  wallets: Object.freeze({
    bitcoin: getEnvValue('VITE_BITCOIN_WALLET', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh'),
    usdtTrc20: getEnvValue('VITE_USDT_TRC20_WALLET', 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t')
  }),
  ocrScript: getEnvValue('VITE_OCR_SCRIPT_URL', 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js')
});

export const getPaymentUrl = (provider, email = '') => {
  const paymentUrl = APP_LINKS.payments[provider];
  if (!paymentUrl) return null;

  const url = new URL(paymentUrl);
  if (url.protocol !== 'https:') {
    throw new Error(`The ${provider} payment URL must use HTTPS.`);
  }
  if (email) url.searchParams.set(provider === 'paypal' ? 'email' : 'reference', email);
  return url.toString();
};

export const getContactUrl = (channel) => {
  switch (channel) {
    case 'email':
      return `mailto:${APP_LINKS.contact.email}`;
    case 'telegram':
      return `https://t.me/${APP_LINKS.contact.telegramHandle}`;
    case 'whatsapp':
      return `https://wa.me/${APP_LINKS.contact.whatsappUsername}`;
    default:
      return null;
  }
};
