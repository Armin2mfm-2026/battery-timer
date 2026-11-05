import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Zap, BatteryCharging, AlertTriangle, ShieldCheck, Plus, Trash2, Edit3, 
  Play, Pause, RefreshCw, Volume2, VolumeX, Settings, Bell, Info, Save, 
  CheckCircle2, Clock, Battery, BatteryFull, Layers, HelpCircle, ChevronRight,
  Flame, Award, Sparkles, Moon, Sun, ArrowUpRight, Globe, DollarSign, 
  ShieldAlert, ChevronLeft, Video, Image as ImageIcon, X, ExternalLink, CreditCard, Mail, Key
} from 'lucide-react';

// --- i18n TRANSLATION DICTIONARY (10 Languages + Persian & Arabic RTL) ---
const TRANSLATIONS = {
  en: {
    title: "VoltGuard Pro",
    subtitle: "Smart Battery Charging & Thermal Manager",
    dashboard: "Dashboard",
    batteryProfiles: "Battery Profiles",
    chargers: "Charger Profiles",
    safety: "Safety & Physics",
    history: "Log History",
    settings: "Settings",
    noAds: "Ad-Free Status",
    activeCharger: "Active Charger:",
    addSlot: "Add Battery Slot",
    noSlotsTitle: "No Active Battery Charging Slots",
    noSlotsDesc: "Add an AA or AAA rechargeable battery slot to calculate exact charging times, monitor chemical heat dissipation, and receive notifications.",
    insertFirst: "Insert First Battery Slot",
    timeRemaining: "Time Remaining",
    timeExceeded: "Time Exceeded",
    targetTime: "Target Charge Time",
    progress: "Progress",
    pause: "Pause",
    resume: "Resume",
    unplug: "Unplug",
    overcharging: "OVERCHARGING",
    done: "DONE",
    removeAdsTitle: "Remove All Ads for 1 Year ($1 / €1)",
    removeAdsDesc: "Upgrade to VoltGuard Pro Premium instantly via PayPal or Revolut and enjoy an entirely ad-free experience for 365 days.",
    buyButton: "Unlock Ad-Free Now ($1 / €1)",
    adActiveUntil: "Ad-Free active until:",
    nextAd: "Next",
    prevAd: "Prev",
    closeAdIn: "Fullscreen ad close available in",
    seconds: "s",
    adNotice: "Mandatory Fullscreen Sponsor Ad",
    appSerial: "App Serial / User ID:",
    emailLabel: "Your Email Address (for Receipt & License):",
    payWithPaypal: "Pay with PayPal ($1 / €1)",
    payWithRevolut: "Pay with Revolut ($1 / €1)",
    secureCheckout: "Secure Multi-Provider Payment Gateway",
    paymentSuccess: "✨ Payment & License Verified Successfully!"
  },
  fa: {
    title: "ولتشیلد پرو",
    subtitle: "مدیریت هوشمند شارژ و ایمنی حرارتی باتری",
    dashboard: "داشبورد",
    batteryProfiles: "پروفایل‌های باتری",
    chargers: "پروفایل‌های شارژر",
    safety: "ایمنی و فیزیک",
    history: "تاریخچه شارژ",
    settings: "تنظیمات",
    noAds: "وضعیت بدون تبلیغات",
    activeCharger: "شارژر فعال:",
    addSlot: "افزودن اسلات باتری",
    noSlotsTitle: "هیچ اسلات شارژ فعالی وجود ندارد",
    noSlotsDesc: "برای محاسبه زمان دقیق شارژ، پایش حرارت و دریافت هشدار، یک باتری AA یا AAA اضافه کنید.",
    insertFirst: "افزودن اولین باتری",
    timeRemaining: "زمان باقی‌مانده",
    timeExceeded: "زمان اضافه شارژ",
    targetTime: "زمان شارژ هدف",
    progress: "پیشرفت",
    pause: "توقف موقت",
    resume: "ادامه شارژ",
    unplug: "قطع شارژر",
    overcharging: "شارژ بیش از حد (خطر حرارت)",
    done: "تکمیل شد",
    removeAdsTitle: "حذف کامل تبلیغات به مدت ۱ سال (۱ دلار/یورو)",
    removeAdsDesc: "با ارتقا به نسخه پرمیوم از طریق پی‌پال یا ریولوت، ۳۶۵ روز از تجربه بدون تبلیغ لذت ببرید.",
    buyButton: "خرید اشتراک بدون تبلیغ ($1 / €1)",
    adActiveUntil: "اشتراک بدون تبلیغات فعال تا:",
    nextAd: "بعدی",
    prevAd: "قبلی",
    closeAdIn: "امکان بستن تبلیغ تمام‌صفحه در",
    seconds: "ثانیه",
    adNotice: "تبلیغ اجباری تمام‌صفحه",
    appSerial: "شماره سریال برنامه / شناسه کاربر:",
    emailLabel: "آدرس ایمیل شما (برای رسید و لایسنس):",
    payWithPaypal: "پرداخت با PayPal ($1 / €1)",
    payWithRevolut: "پرداخت با Revolut ($1 / €1)",
    secureCheckout: "درگاه پرداخت امن چندگانه",
    paymentSuccess: "✨ پرداخت و لایسنس با موفقیت تایید شد!"
  },
  es: {
    title: "VoltGuard Pro",
    subtitle: "Gestor Inteligente de Carga y Temperatura",
    dashboard: "Panel",
    batteryProfiles: "Perfiles de Batería",
    chargers: "Cargadores",
    safety: "Seguridad",
    history: "Historial",
    settings: "Ajustes",
    noAds: "Sin Anuncios",
    activeCharger: "Cargador Activo:",
    addSlot: "Añadir Ranura",
    noSlotsTitle: "No hay ranuras activas",
    noSlotsDesc: "Añade una batería AA o AAA para calcular tiempos de carga precisos.",
    insertFirst: "Insertar Primera Batería",
    timeRemaining: "Tiempo Restante",
    timeExceeded: "Tiempo Excedido",
    targetTime: "Tiempo Objetivo",
    progress: "Progreso",
    pause: "Pausar",
    resume: "Reanudar",
    unplug: "Desconectar",
    overcharging: "SOBRECARGANDO",
    done: "LISTO",
    removeAdsTitle: "Eliminar Anuncios por 1 Año",
    removeAdsDesc: "Actualiza a Pro por solo $1 / €1 mediante PayPal o Revolut.",
    buyButton: "Desbloquear sin anuncios ($1 / €1)",
    adActiveUntil: "Sin anuncios activo hasta:",
    nextAd: "Siguiente",
    prevAd: "Anterior",
    closeAdIn: "Cerrar anuncio en",
    seconds: "s",
    adNotice: "Anuncio Patrocinado de Pantalla Completa",
    appSerial: "Número de Serie / ID de Usuario:",
    emailLabel: "Correo Electrónico:",
    payWithPaypal: "Pagar con PayPal",
    payWithRevolut: "Pagar con Revolut",
    secureCheckout: "Pasarela de Pago Segura",
    paymentSuccess: "✨ ¡Pago verificado con éxito!"
  },
  zh: {
    title: "VoltGuard Pro",
    subtitle: "智能电池充电与安全管理器",
    dashboard: "仪表盘",
    batteryProfiles: "电池配置",
    chargers: "充电器配置",
    safety: "安全指南",
    history: "历史记录",
    settings: "设置",
    noAds: "免广告",
    activeCharger: "当前充电器：",
    addSlot: "添加电池槽",
    noSlotsTitle: "暂无激活的充电槽",
    noSlotsDesc: "添加AA或AAA电池槽以计算精确充电时间。",
    insertFirst: "添加第一个电池槽",
    timeRemaining: "剩余时间",
    timeExceeded: "超出时间",
    targetTime: "目标充电时间",
    progress: "进度",
    pause: "暂停",
    resume: "恢复",
    unplug: "拔出",
    overcharging: "过度充电",
    done: "完成",
    removeAdsTitle: "去除广告 1 年",
    removeAdsDesc: "通过 PayPal 或 Revolut 升级至专业版，享受 365 天无广告体验。",
    buyButton: "解锁免广告 ($1 / €1)",
    adActiveUntil: "免广告有效期至：",
    nextAd: "下一个",
    prevAd: "上一个",
    closeAdIn: "关闭倒计时",
    seconds: "秒",
    adNotice: "全屏赞助广告",
    appSerial: "应用序列号 / 用户ID：",
    emailLabel: "电子邮件地址：",
    payWithPaypal: "使用 PayPal 支付",
    payWithRevolut: "使用 Revolut 支付",
    secureCheckout: "安全支付网关",
    paymentSuccess: "✨ 支付与许可证验证成功！"
  },
  fr: {
    title: "VoltGuard Pro",
    subtitle: "Gestionnaire Intelligent de Charge et de Batterie",
    dashboard: "Tableau de bord",
    batteryProfiles: "Profils de piles",
    chargers: "Chargeurs",
    safety: "Sécurité",
    history: "Historique",
    settings: "Paramètres",
    noAds: "Sans Publicité",
    activeCharger: "Chargeur Actif:",
    addSlot: "Ajouter un emplacement",
    noSlotsTitle: "Aucun emplacement actif",
    noSlotsDesc: "Ajoutez une pile AA ou AAA pour calculer les temps de charge précis.",
    insertFirst: "Insérer une pile",
    timeRemaining: "Temps Restant",
    timeExceeded: "Temps Dépassé",
    targetTime: "Temps Cible",
    progress: "Progrès",
    pause: "Pause",
    resume: "Reprendre",
    unplug: "Débrancher",
    overcharging: "SURCHARGE",
    done: "TERMINÉ",
    removeAdsTitle: "Supprimer les pubs pendant 1 an",
    removeAdsDesc: "Passez à Pro via PayPal ou Revolut pour seulement $1 / €1.",
    buyButton: "Débloquer sans pub ($1 / €1)",
    adActiveUntil: "Sans publicité actif jusqu'au :",
    nextAd: "Suivant",
    prevAd: "Précédent",
    closeAdIn: "Fermeture dans",
    seconds: "s",
    adNotice: "Annonce Plein Écran",
    appSerial: "Numéro de Série / ID:",
    emailLabel: "Adresse Email:",
    payWithPaypal: "Payer avec PayPal",
    payWithRevolut: "Payer avec Revolut",
    secureCheckout: "Passerelle de Paiement Sécurisée",
    paymentSuccess: "✨ Paiement vérifié avec succès !"
  },
  de: {
    title: "VoltGuard Pro",
    subtitle: "Intelligenter Lade- und Thermikmanager",
    dashboard: "Übersicht",
    batteryProfiles: "Batterieprofile",
    chargers: "Ladegeräte",
    safety: "Sicherheit",
    history: "Verlauf",
    settings: "Einstellungen",
    noAds: "Werbefrei",
    activeCharger: "Aktives Ladegerät:",
    addSlot: "Slot Hinzufügen",
    noSlotsTitle: "Keine aktiven Ladeslots",
    noSlotsDesc: "Fügen Sie AA- oder AAA-Akkus hinzu, um Ladezeiten zu berechnen.",
    insertFirst: "Ersten Slot einfügen",
    timeRemaining: "Verbleibende Zeit",
    timeExceeded: "Zeit überschritten",
    targetTime: "Ziel-Ladezeit",
    progress: "Fortschritt",
    pause: "Pause",
    resume: "Fortsetzen",
    unplug: "Abziehen",
    overcharging: "ÜBERLADUNG",
    done: "FERTIG",
    removeAdsTitle: "Werbung für 1 Jahr entfernen",
    removeAdsDesc: "Wechseln Sie für $1 / €1 über PayPal oder Revolut zu Pro.",
    buyButton: "Werbefrei freischalten ($1 / €1)",
    adActiveUntil: "Werbefrei aktiv bis:",
    nextAd: "Nächste",
    prevAd: "Vorherige",
    closeAdIn: "Schließen in",
    seconds: "s",
    adNotice: "Vollbild-Sponsor-Anzeige",
    appSerial: "App-Seriennummer / Benutzer-ID:",
    emailLabel: "E-Mail-Adresse:",
    payWithPaypal: "Mit PayPal bezahlen",
    payWithRevolut: "Mit Revolut bezahlen",
    secureCheckout: "Sicheres Zahlungs-Gateway",
    paymentSuccess: "✨ Zahlung erfolgreich verifiziert!"
  },
  ar: {
    title: "VoltGuard Pro",
    subtitle: "مدير شحن البطارية والأمان الذكي",
    dashboard: "لوحة التحكم",
    batteryProfiles: "ملفات البطارية",
    chargers: "الشواحن",
    safety: "الأمان",
    history: "السجل",
    settings: "الإعدادات",
    noAds: "بدون إعلانات",
    activeCharger: "الشاحن النشط:",
    addSlot: "إضافة فتحة",
    noSlotsTitle: "لا توجد فتحات شحن نشطة",
    noSlotsDesc: "أضف بطارية AA أو AAA لحساب أوقات الشحن بدقة.",
    insertFirst: "إضافة أول بطارية",
    timeRemaining: "الوقت المتبقي",
    timeExceeded: "الوقت المنقضي",
    targetTime: "وقت الشحن المستهدف",
    progress: "التقدم",
    pause: "إيقاف مؤقت",
    resume: "استئناف",
    unplug: "فصل",
    overcharging: "الشحن الزائد",
    done: "تم",
    removeAdsTitle: "إزالة الإعلانات لمدة سنة",
    removeAdsDesc: "الترقية عبر PayPal أو Revolut مقابل $1 / €1 لمدة 365 يوماً.",
    buyButton: "فتح بدون إعلانات ($1 / €1)",
    adActiveUntil: "بدون إعلانات حتى:",
    nextAd: "التالي",
    prevAd: "السابق",
    closeAdIn: "إغلاق خلال",
    seconds: "ث",
    adNotice: "إعلان ملء الشاشة",
    appSerial: "الرقم التسلسلي / معرف المستخدم:",
    emailLabel: "عنوان البريد الإلكتروني:",
    payWithPaypal: "الدفع عبر PayPal",
    payWithRevolut: "الدفع عبر Revolut",
    secureCheckout: "بوابة دفع آمنة",
    paymentSuccess: "✨ تم التحقق من الدفع بنجاح!"
  },
  ja: {
    title: "VoltGuard Pro",
    subtitle: "スマートバッテリー充電＆安全マネージャー",
    dashboard: "ダッシュボード",
    batteryProfiles: "バッテリープロファイル",
    chargers: "充電器プロファイル",
    safety: "安全性",
    history: "履歴",
    settings: "設定",
    noAds: "広告なし",
    activeCharger: "アクティブ充電器：",
    addSlot: "スロット追加",
    noSlotsTitle: "アクティブなスロットがありません",
    noSlotsDesc: "AAまたはAAAバッテリーを追加して充電時間を計算します。",
    insertFirst: "最初のバッテリーを追加",
    timeRemaining: "残り時間",
    timeExceeded: "超過時間",
    targetTime: "目標時間",
    progress: "進捗",
    pause: "一時停止",
    resume: "再開",
    unplug: "取り外し",
    overcharging: "過充電",
    done: "完了",
    removeAdsTitle: "1年間広告を非表示",
    removeAdsDesc: "PayPalまたはRevolutで $1 / €1 のプロ版にアップグレード。",
    buyButton: "広告なしをアンロック ($1 / €1)",
    adActiveUntil: "広告なし有効期限：",
    nextAd: "次へ",
    prevAd: "前へ",
    closeAdIn: "閉じるまで",
    seconds: "秒",
    adNotice: "全画面スポンサー広告",
    appSerial: "アプリシリアル / ユーザーID：",
    emailLabel: "メールアドレス：",
    payWithPaypal: "PayPalで支払う",
    payWithRevolut: "Revolutで支払う",
    secureCheckout: "セキュア決済ゲートウェイ",
    paymentSuccess: "✨ 支払いとライセンスの認証が成功しました！"
  },
  pt: {
    title: "VoltGuard Pro",
    subtitle: "Gerenciador Inteligente de Carga e Bateria",
    dashboard: "Painel",
    batteryProfiles: "Perfis de Bateria",
    chargers: "Carregadores",
    safety: "Segurança",
    history: "Histórico",
    settings: "Configurações",
    noAds: "Sem Anúncios",
    activeCharger: "Carregador Ativo:",
    addSlot: "Adicionar Slot",
    noSlotsTitle: "Nenhum slot de carga ativo",
    noSlotsDesc: "Adicione uma bateria AA ou AAA para calcular o tempo de carga.",
    insertFirst: "Inserir primeira bateria",
    timeRemaining: "Tempo Restante",
    timeExceeded: "Tempo Excedido",
    targetTime: "Tempo Alvo",
    progress: "Progresso",
    pause: "Pausar",
    resume: "Retomar",
    unplug: "Desconectar",
    overcharging: "SOBRECARREGANDO",
    done: "CONCLUÍDO",
    removeAdsTitle: "Remover Anúncios por 1 Ano",
    removeAdsDesc: "Atualize para Pro via PayPal ou Revolut por apenas $1 / €1.",
    buyButton: "Desbloquear sem anúncios ($1 / €1)",
    adActiveUntil: "Sem anúncios ativo até:",
    nextAd: "Próximo",
    prevAd: "Anterior",
    closeAdIn: "Fechar em",
    seconds: "s",
    adNotice: "Anúncio Intersticial de Tela Cheia",
    appSerial: "Número de Série / ID do Usuário:",
    emailLabel: "Endereço de E-mail:",
    payWithPaypal: "Pagar com PayPal",
    payWithRevolut: "Pagar com Revolut",
    secureCheckout: "Gateway de Pagamento Seguro",
    paymentSuccess: "✨ Pagamento verificado com sucesso!"
  },
  ru: {
    title: "VoltGuard Pro",
    subtitle: "Умный менеджер зарядки и безопасности",
    dashboard: "Главная",
    batteryProfiles: "Профили батарей",
    chargers: "ЗУ",
    safety: "Безопасность",
    history: "История",
    settings: "Настройки",
    noAds: "Без рекламы",
    activeCharger: "Активное ЗУ:",
    addSlot: "Добавить слот",
    noSlotsTitle: "Нет активных слотов зарядки",
    noSlotsDesc: "Добавьте батарейку AA или AAA для расчета времени.",
    insertFirst: "Добавить батарею",
    timeRemaining: "Осталось времени",
    timeExceeded: "Время превышено",
    targetTime: "Целевое время",
    progress: "Прогресс",
    pause: "Пауза",
    resume: "Продолжить",
    unplug: "Выключить",
    overcharging: "ПЕРЕЗАРЯД",
    done: "ГОТОВО",
    removeAdsTitle: "Удалить рекламу на 1 год",
    removeAdsDesc: "Перейдите на Pro через PayPal or Revolut всего за $1 / €1.",
    buyButton: "Купить без рекламы ($1 / €1)",
    adActiveUntil: "Без рекламы активно до:",
    nextAd: "След.",
    prevAd: "Пред.",
    closeAdIn: "Закрыть рекламу через",
    seconds: "с",
    adNotice: "Полноэкранная реклама",
    appSerial: "Серийный номер / ID пользователя:",
    emailLabel: "Адрес электронной почты:",
    payWithPaypal: "Оплатить через PayPal",
    payWithRevolut: "Оплатить через Revolut",
    secureCheckout: "Безопасный платежный шлюз",
    paymentSuccess: "✨ Оплата успешно подтверждена!"
  }
};

// --- DEFAULT INITIAL PROFILES & FALLBACK ADS ---
const INITIAL_CHARGERS = [
  {
    id: 'ch-1',
    name: 'Panasonic BQ-CC55 (Smart Fast Charger)',
    inputV: 100, inputVMax: 240, inputA: 0.3, inputHz: '50/60Hz',
    outputV: 1.5, aaCurrentMa: 750, aaaCurrentMa: 375, isPaired: false,
    notes: 'Smart individual slot charging with peak detection'
  },
  {
    id: 'ch-2',
    name: 'Basic 4-Slot Paired NiMH Charger',
    inputV: 120, inputVMax: 240, inputA: 0.15, inputHz: '60Hz',
    outputV: 2.8, aaCurrentMa: 300, aaaCurrentMa: 150, isPaired: true,
    notes: 'Shares current across slot pairs (1&2, 3&4)'
  },
  {
    id: 'ch-3',
    name: 'Nitecore D4 Digital Super Charger',
    inputV: 100, inputVMax: 240, inputA: 0.5, inputHz: '50/60Hz',
    outputV: 4.2, aaCurrentMa: 500, aaaCurrentMa: 250, isPaired: false,
    notes: 'Multi-chemistry universal charger'
  }
];

const INITIAL_BATTERY_PROFILES = [
  { id: 'bp-1', name: 'Eneloop AA NiMH Standard', size: 'AA', type: 'NiMH', capacity: 1900, voltage: 1.2, maxCurrentMa: 1900, thermalLimitC: 50 },
  { id: 'bp-2', name: 'Eneloop Pro AA High Capacity', size: 'AA', type: 'NiMH', capacity: 2500, voltage: 1.2, maxCurrentMa: 2500, thermalLimitC: 55 },
  { id: 'bp-3', name: 'AmazonBasics AA High-Drain', size: 'AA', type: 'NiMH', capacity: 2400, voltage: 1.2, maxCurrentMa: 2400, thermalLimitC: 50 },
  { id: 'bp-4', name: 'Eneloop AAA NiMH Standard', size: 'AAA', type: 'NiMH', capacity: 800, voltage: 1.2, maxCurrentMa: 800, thermalLimitC: 50 },
  { id: 'bp-5', name: 'Eneloop Pro AAA NiMH', size: 'AAA', type: 'NiMH', capacity: 950, voltage: 1.2, maxCurrentMa: 950, thermalLimitC: 50 },
  { id: 'bp-6', name: '14500 Li-ion AA Size (3.7V)', size: 'AA', type: 'Li-ion', capacity: 800, voltage: 3.7, maxCurrentMa: 800, thermalLimitC: 60 }
];

const FALLBACK_ADS = [
  {
    id: 'ad-1',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1616469829941-c7200edec809?w=800&auto=format&fit=crop&q=60',
    title: '⚡ Fast Charger Pro Sale - 50% Off Today!',
    cta: 'Learn More',
    target_url: 'https://github.com/voltguard'
  },
  {
    id: 'ad-2',
    type: 'video',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-42995-large.mp4',
    title: '🔋 Eneloop Pro Max Batteries - Extreme Life',
    cta: 'Buy Now',
    target_url: 'https://github.com/voltguard'
  },
  {
    id: 'ad-3',
    type: 'image',
    url: 'https://images.unsplash.com/photo-1595246140625-573b715d11dc?w=800&auto=format&fit=crop&q=60',
    title: '🛡️ VoltGuard Power Bank Station - Protect Devices',
    cta: 'Explore',
    target_url: 'https://github.com/voltguard'
  }
];

export default function App() {
  // --- Persistent Core States ---
  const [chargers, setChargers] = useState(() => JSON.parse(localStorage.getItem('batt_chargers')) || INITIAL_CHARGERS);
  const [batteryProfiles, setBatteryProfiles] = useState(() => JSON.parse(localStorage.getItem('batt_profiles')) || INITIAL_BATTERY_PROFILES);
  const [activeChargerId, setActiveChargerId] = useState(() => localStorage.getItem('batt_active_charger_id') || INITIAL_CHARGERS[0].id);
  const [activeSlots, setActiveSlots] = useState(() => JSON.parse(localStorage.getItem('batt_active_slots')) || []);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('batt_history')) || []);
  
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('batt_settings')) || {
    audioAlerts: true,
    pushNotifications: true,
    defaultEfficiency: 1.3,
    language: 'en',
    autoArchiveFinished: false
  });

  // --- App Serial Number / User ID (Persisted in localStorage) ---
  const [appSerialNo] = useState(() => {
    let serial = localStorage.getItem('batt_app_serial');
    if (!serial) {
      serial = 'VG-PRO-' + Math.random().toString(36).substring(2, 8).toUpperCase() + '-' + Date.now().toString(36).toUpperCase();
      localStorage.setItem('batt_app_serial', serial);
    }
    return serial;
  });

  // --- Subscription & Payment Modal State ---
  const [subscription, setSubscription] = useState(() => JSON.parse(localStorage.getItem('batt_subscription')) || {
    isAdFree: false,
    expiresAt: null
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState(() => localStorage.getItem('batt_user_email') || '');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState(false);

  // --- Full-Screen Interstitial Ad Engine State ---
  const [adminAds, setAdminAds] = useState(FALLBACK_ADS);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [adsSeenCount, setAdsSeenCount] = useState(0);
  const [isFullscreenAdDismissed, setIsFullscreenAdDismissed] = useState(false);
  const [adTimerSeconds, setAdTimerSeconds] = useState(5);
  const [canCloseAd, setCanCloseAd] = useState(false);

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChargerModalOpen, setIsChargerModalOpen] = useState(false);
  const [isBatteryProfileModalOpen, setIsBatteryProfileModalOpen] = useState(false);
  
  const [editingCharger, setEditingCharger] = useState(null);
  const [editingBatteryProfile, setEditingBatteryProfile] = useState(null);
  const [selectedBatteryProfileId, setSelectedBatteryProfileId] = useState('');

  const [newSlotForm, setNewSlotForm] = useState({
    slotLabel: '',
    size: 'AA',
    type: 'NiMH',
    capacity: 2000,
    voltage: 1.2,
    initialCharge: 0,
    efficiency: settings.defaultEfficiency
  });

  const audioCtxRef = useRef(null);

  // RTL Direction check for Persian & Arabic
  const isRTL = useMemo(() => settings.language === 'fa' || settings.language === 'ar', [settings.language]);
  const t = (key) => TRANSLATIONS[settings.language]?.[key] || TRANSLATIONS['en'][key] || key;
  
  const currentCharger = useMemo(() => chargers.find(c => c.id === activeChargerId) || chargers[0], [chargers, activeChargerId]);

  // Sync LocalStorage
  useEffect(() => { localStorage.setItem('batt_chargers', JSON.stringify(chargers)); }, [chargers]);
  useEffect(() => { localStorage.setItem('batt_profiles', JSON.stringify(batteryProfiles)); }, [batteryProfiles]);
  useEffect(() => { localStorage.setItem('batt_active_charger_id', activeChargerId); }, [activeChargerId]);
  useEffect(() => { localStorage.setItem('batt_active_slots', JSON.stringify(activeSlots)); }, [activeSlots]);
  useEffect(() => { localStorage.setItem('batt_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { localStorage.setItem('batt_settings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('batt_subscription', JSON.stringify(subscription)); }, [subscription]);
  useEffect(() => { if (checkoutEmail) localStorage.setItem('batt_user_email', checkoutEmail); }, [checkoutEmail]);

  // Check Subscription Validity
  const isSubscriberValid = useMemo(() => {
    if (!subscription.isAdFree || !subscription.expiresAt) return false;
    return new Date().getTime() < subscription.expiresAt;
  }, [subscription]);

  // --- Dynamic `ads.json` Async Fetcher & Error Handling ---
  useEffect(() => {
    if (isSubscriberValid) return;

    const fetchAdsConfig = async () => {
      try {
        const response = await fetch('/ads.json').catch(() => null);
        let data = null;
        if (response && response.ok) {
          data = await response.json();
        } else {
          const githubFallbackRes = await fetch('https://raw.githubusercontent.com/voltguard/ads-config/main/ads.json');
          if (githubFallbackRes.ok) {
            data = await githubFallbackRes.json();
          }
        }

        if (data && Array.isArray(data.ads) && data.ads.length > 0) {
          setAdminAds(data.ads);
        }
      } catch (err) {
        console.error("Failed to fetch ads.json, activating offline fallback ad queue:", err);
        setAdminAds(FALLBACK_ADS);
      }
    };

    fetchAdsConfig();
  }, [isSubscriberValid]);

  // Full-Screen Ad 5-Second Mandatory Lockout Timer
  useEffect(() => {
    if (isSubscriberValid || isFullscreenAdDismissed) return;
    setAdTimerSeconds(5);
    setCanCloseAd(false);

    const timer = setInterval(() => {
      setAdTimerSeconds(prev => {
        if (prev <= 1) {
          setCanCloseAd(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentAdIndex, isSubscriberValid, isFullscreenAdDismissed]);

  const handleNextAd = () => {
    setCurrentAdIndex(prev => (prev + 1) % adminAds.length);
    setAdsSeenCount(c => c + 1);
  };

  const handlePrevAd = () => {
    setCurrentAdIndex(prev => (prev - 1 + adminAds.length) % adminAds.length);
  };

  const handleCloseFullscreenAd = () => {
    if (adsSeenCount < 2) {
      alert(settings.language === 'fa' ? `لطفاً حداقل ۳ تبلیغ در این نشست مشاهده کنید (${adsSeenCount + 1}/3).` : `Please browse through at least 3 interstitial ads (${adsSeenCount + 1}/3).`);
      handleNextAd();
      return;
    }
    setIsFullscreenAdDismissed(true);
  };

  // --- Payment Gateway Redirection (PayPal & Revolut) ---
  const handlePaymentRedirect = (provider) => {
    if (!checkoutEmail || !checkoutEmail.includes('@')) {
      alert(settings.language === 'fa' ? 'لطفاً یک آدرس ایمیل معتبر وارد کنید.' : 'Please enter a valid email address before proceeding to payment.');
      return;
    }

    const transactionLog = {
      appSerialNo,
      email: checkoutEmail,
      provider,
      amount: '$1 / €1',
      timestamp: new Date().toISOString()
    };
    const existingLogs = JSON.parse(localStorage.getItem('batt_transaction_logs') || '[]');
    localStorage.setItem('batt_transaction_logs', JSON.stringify([transactionLog, ...existingLogs]));

    let paymentLink = '';
    if (provider === 'paypal') {
      paymentLink = `https://www.paypal.com/ncp/payment/YOUR_PAYPAL_BUSINESS_ID?custom_id=${appSerialNo}&email=${encodeURIComponent(checkoutEmail)}`;
    } else if (provider === 'revolut') {
      paymentLink = `https://revolut.me/voltguard?amount=1&currency=USD&reference=${appSerialNo}`;
    }

    window.open(paymentLink, '_blank');

    setTimeout(() => {
      const expiresAt = new Date().getTime() + (365 * 24 * 60 * 60 * 1000);
      setSubscription({ isAdFree: true, expiresAt });
      setPaymentSuccessMsg(true);

      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setPaymentSuccessMsg(false);
      }, 3000);
    }, 1500);
  };

  // Global Timer Tick for Active Slots
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setActiveSlots(prevSlots => {
        let changed = false;
        const updated = prevSlots.map(slot => {
          if (slot.status !== 'charging') return slot;

          const elapsedSec = Math.floor((now - slot.startTime) / 1000);
          const totalDurationSec = slot.totalSec;
          const remainingSec = Math.max(0, totalDurationSec - elapsedSec);
          const overchargeSec = Math.max(0, elapsedSec - totalDurationSec);
          
          let newStatus = slot.status;
          let alertTriggered = slot.alertTriggered;

          if (elapsedSec >= totalDurationSec && !slot.alertTriggered) {
            alertTriggered = true;
            newStatus = 'completed';
            triggerAlarmSound();
            if (settings.pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('🔋 Battery Fully Charged!', {
                body: `${slot.size} battery (${slot.capacity}mAh) has reached 100% target time.`
              });
            }
          }

          if (elapsedSec !== slot.elapsedSec || newStatus !== slot.status) {
            changed = true;
            return { ...slot, elapsedSec, remainingSec, overchargeSec, status: newStatus, alertTriggered };
          }
          return slot;
        });

        return changed ? updated : prevSlots;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.pushNotifications]);

  const triggerAlarmSound = () => {
    if (!settings.audioAlerts) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + (idx * 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
        osc.start(startTime);
        osc.stop(startTime + 0.4);
      });
    } catch (e) { console.error('Audio playback error:', e); }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setSettings(s => ({ ...s, pushNotifications: true }));
        }
      });
    }
  };

  const calculateChargeTime = (size, capacity, initialCharge, efficiency) => {
    const baseCurrent = size === 'AA' ? currentCharger.aaCurrentMa : currentCharger.aaaCurrentMa;
    const netCapacityNeeded = capacity * (1 - (initialCharge / 100));
    if (baseCurrent <= 0) return { totalSec: 3600, effectiveCurrentMa: baseCurrent };
    const decimalHours = (netCapacityNeeded / baseCurrent) * efficiency;
    return { totalSec: Math.round(decimalHours * 3600), effectiveCurrentMa: baseCurrent };
  };

  const handleBatteryProfileSelect = (e) => {
    const pId = e.target.value;
    setSelectedBatteryProfileId(pId);
    if (!pId) return;
    const p = batteryProfiles.find(item => item.id === pId);
    if (p) {
      setNewSlotForm(prev => ({
        ...prev,
        slotLabel: p.name,
        size: p.size,
        type: p.type,
        capacity: p.capacity,
        voltage: p.voltage
      }));
    }
  };

  const handleAddSlotSubmit = (e) => {
    e.preventDefault();
    const { slotLabel, size, type, capacity, voltage, initialCharge, efficiency } = newSlotForm;
    const calc = calculateChargeTime(size, capacity, initialCharge, efficiency);

    const newSlot = {
      id: 'slot-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      label: slotLabel || `${size} - ${capacity}mAh`,
      size, type, capacity: Number(capacity), voltage: Number(voltage),
      initialCharge: Number(initialCharge), efficiency: Number(efficiency),
      chargerCurrentMa: calc.effectiveCurrentMa, totalSec: calc.totalSec,
      elapsedSec: 0, remainingSec: calc.totalSec, overchargeSec: 0,
      startTime: Date.now(), status: 'charging', alertTriggered: false
    };

    setActiveSlots(prev => [...prev, newSlot]);
    setIsAddModalOpen(false);
    setSelectedBatteryProfileId('');
  };

  const handleTogglePause = (id) => {
    setActiveSlots(prev => prev.map(slot => {
      if (slot.id !== id) return slot;
      if (slot.status === 'charging') return { ...slot, status: 'paused' };
      if (slot.status === 'paused') {
        return { ...slot, startTime: Date.now() - (slot.elapsedSec * 1000), status: 'charging' };
      }
      return slot;
    }));
  };

  const handleRemoveSlot = (id, saveToHistory = false) => {
    const targetSlot = activeSlots.find(s => s.id === id);
    if (saveToHistory && targetSlot) {
      const historyItem = { ...targetSlot, finishedAt: new Date().toISOString(), actualChargeSec: targetSlot.elapsedSec };
      setHistory(h => [historyItem, ...h]);
    }
    setActiveSlots(prev => prev.filter(s => s.id !== id));
  };

  const handleResetSlot = (id) => {
    setActiveSlots(prev => prev.map(slot => {
      if (slot.id !== id) return slot;
      return { ...slot, startTime: Date.now(), elapsedSec: 0, remainingSec: slot.totalSec, overchargeSec: 0, status: 'charging', alertTriggered: false };
    }));
  };

  const handleSaveBatteryProfile = (e) => {
    e.preventDefault();
    if (!editingBatteryProfile) return;
    if (editingBatteryProfile.id) {
      setBatteryProfiles(prev => prev.map(p => p.id === editingBatteryProfile.id ? editingBatteryProfile : p));
    } else {
      const created = { ...editingBatteryProfile, id: 'bp-' + Date.now() };
      setBatteryProfiles(prev => [...prev, created]);
    }
    setIsBatteryProfileModalOpen(false);
    setEditingBatteryProfile(null);
  };

  const handleSaveCharger = (e) => {
    e.preventDefault();
    if (!editingCharger) return;
    if (editingCharger.id) {
      setChargers(prev => prev.map(c => c.id === editingCharger.id ? editingCharger : c));
    } else {
      const created = { ...editingCharger, id: 'ch-' + Date.now() };
      setChargers(prev => [...prev, created]);
      setActiveChargerId(created.id);
    }
    setIsChargerModalOpen(false);
    setEditingCharger(null);
  };

  const formatTime = (totalSeconds) => {
    if (totalSeconds < 0) totalSeconds = 0;
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`;
  };

  const currentActiveAd = adminAds[currentAdIndex] || adminAds[0];

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-36 selection:bg-blue-500 selection:text-white pt-[env(safe-area-inset-top)]">
      
      {/* --- 1. FULL-SCREEN INTERSTITIAL AD OVERLAY --- */}
      {!isSubscriberValid && !isFullscreenAdDismissed && (
        <div className="fixed inset-0 z-50 bg-slate-950/98 backdrop-blur-2xl flex flex-col items-center justify-between p-6 sm:p-10 animate-fade-in pt-[env(safe-area-inset-top)]">
          
          <div className="w-full max-w-4xl flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-red-400 font-bold">{t('adNotice')}</span>
            </div>
            <div className="text-xs font-mono text-slate-400">
              Ad <span className="text-blue-400 font-bold">{adsSeenCount + 1}</span> of queue
            </div>
          </div>

          <div className="w-full max-w-4xl flex-1 flex flex-col items-center justify-center my-4">
            <div className="w-full aspect-video max-h-[55vh] bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 relative shadow-2xl flex items-center justify-center">
              {currentActiveAd.type === 'video' ? (
                <video src={currentActiveAd.url} autoPlay muted loop className="w-full h-full object-cover" />
              ) : (
                <img src={currentActiveAd.url} alt="Interstitial Banner" className="w-full h-full object-cover" />
              )}
            </div>

            <div className="mt-4 text-center">
              <h2 className="text-base sm:text-lg font-bold text-slate-100">{currentActiveAd.title}</h2>
              <a 
                href={currentActiveAd.target_url || "https://github.com/voltguard"} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1 text-xs text-blue-400 mt-1 hover:underline"
              >
                <span>{currentActiveAd.cta || 'Learn More'}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-800 pt-6">
            <button 
              onClick={() => setIsPaymentModalOpen(true)}
              className="w-full sm:w-auto bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-xs px-6 py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2 rtl:space-x-reverse"
            >
              <DollarSign className="w-4 h-4" />
              <span>{t('removeAdsTitle')}</span>
            </button>

            <div className="flex items-center space-x-3 rtl:space-x-reverse w-full sm:w-auto justify-end">
              <button onClick={handlePrevAd} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl">
                {t('prevAd')}
              </button>
              <button onClick={handleNextAd} className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs px-3.5 py-2.5 rounded-xl">
                {t('nextAd')}
              </button>

              {canCloseAd ? (
                <button 
                  onClick={handleCloseFullscreenAd}
                  className="bg-red-600 hover:bg-red-500 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-lg flex items-center space-x-1 animate-bounce"
                >
                  <X className="w-4 h-4" /> <span>Close Ad</span>
                </button>
              ) : (
                <span className="text-xs font-mono text-amber-400 bg-amber-950/60 border border-amber-800/60 px-4 py-2.5 rounded-xl">
                  {t('closeAdIn')} {adTimerSeconds}{t('seconds')}
                </span>
              )}
            </div>
          </div>

        </div>
      )}

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-400 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                {t('title')}
              </h1>
              <p className="text-xs text-slate-400">{t('subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {/* LANGUAGE SELECTOR */}
            <div className="flex items-center space-x-1 rtl:space-x-reverse bg-slate-800 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <Globe className="w-4 h-4 text-cyan-400" />
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="bg-transparent text-xs text-cyan-300 font-bold border-0 focus:ring-0 cursor-pointer uppercase"
              >
                <option value="en" className="bg-slate-900">EN (English)</option>
                <option value="fa" className="bg-slate-900">FA (فارسی)</option>
                <option value="es" className="bg-slate-900">ES (Español)</option>
                <option value="zh" className="bg-slate-900">ZH (中文)</option>
                <option value="fr" className="bg-slate-900">FR (Français)</option>
                <option value="de" className="bg-slate-900">DE (Deutsch)</option>
                <option value="ar" className="bg-slate-900">AR (العربية)</option>
                <option value="ja" className="bg-slate-900">JA (日本語)</option>
                <option value="pt" className="bg-slate-900">PT (Português)</option>
                <option value="ru" className="bg-slate-900">RU (Русский)</option>
              </select>
            </div>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addSlot')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* TABS NAVIGATION */}
        <div className="flex items-center space-x-2 rtl:space-x-reverse border-b border-slate-800 pb-3 mb-6 overflow-x-auto scrollbar-none">
          {[
            { id: 'dashboard', label: t('dashboard'), icon: BatteryCharging, count: activeSlots.length },
            { id: 'battery-profiles', label: t('batteryProfiles'), icon: Battery, count: batteryProfiles.length },
            { id: 'chargers', label: t('chargers'), icon: Layers, count: chargers.length },
            { id: 'safety', label: t('safety'), icon: ShieldCheck },
            { id: 'history', label: t('history'), icon: Clock },
            { id: 'settings', label: t('settings'), icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  isActive ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-inner' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-blue-500 text-slate-950">{tab.count}</span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                <div className="p-3 bg-slate-800 rounded-xl text-blue-400 border border-slate-700">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <h2 className="font-semibold text-slate-100 text-base">{currentCharger.name}</h2>
                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${currentCharger.isPaired ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                      {currentCharger.isPaired ? 'Paired' : 'Independent'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t('activeCharger')} <span className="text-blue-400 font-medium">AA: {currentCharger.aaCurrentMa}mA</span> | <span className="text-amber-400 font-medium">AAA: {currentCharger.aaaCurrentMa}mA</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse w-full sm:w-auto">
                <select 
                  value={activeChargerId}
                  onChange={(e) => setActiveChargerId(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-xs text-blue-300 rounded-xl p-2.5 w-full sm:w-auto"
                >
                  {chargers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {activeSlots.length === 0 && (
              <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-900/30">
                <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500">
                  <BatteryCharging className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-300">{t('noSlotsTitle')}</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">{t('noSlotsDesc')}</p>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow transition">
                  {t('insertFirst')}
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {activeSlots.map((slot) => {
                const isAA = slot.size === 'AA';
                const pct = Math.min(100, Math.floor((slot.elapsedSec / slot.totalSec) * 100));
                const isOvercharging = slot.elapsedSec > slot.totalSec;
                const isCompleted = slot.status === 'completed' || pct >= 100;

                return (
                  <div key={slot.id} className={`rounded-2xl bg-slate-900 border ${isOvercharging ? 'border-red-500/60 ring-1 ring-red-500/40' : isAA ? 'border-blue-500/30' : 'border-amber-500/30'} shadow-lg p-5 flex flex-col justify-between`}>
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3 rtl:space-x-reverse">
                          
                          {/* REALISTIC BATTERY ICON WITH DYNAMIC FLOWING LIQUID FILL */}
                          <div className={`relative flex items-center justify-center rounded-lg overflow-hidden mt-1.5 ${isAA ? 'w-10 h-16 bg-blue-950/80 border-2 border-blue-500/80 text-blue-200' : 'w-8 h-14 bg-amber-950/80 border-2 border-amber-500/80 text-amber-200'}`}>
                            {/* Battery Top Terminal Nub */}
                            <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3.5 h-1.5 rounded-t-sm ${isAA ? 'bg-blue-500' : 'bg-amber-500'}`} />
                            
                            {/* Dynamically Rising Liquid Fill based on charging progress time */}
                            <div 
                              className={`absolute bottom-0 left-0 right-0 transition-all duration-700 ease-linear ${isOvercharging ? 'bg-red-500 animate-pulse' : isAA ? 'bg-gradient-to-t from-blue-600 via-cyan-500 to-cyan-300' : 'bg-gradient-to-t from-amber-600 via-yellow-500 to-yellow-300'}`}
                              style={{ height: `${pct}%` }}
                            >
                              {/* Liquid flow wave / shine reflection effect */}
                              <div className="absolute inset-0 bg-white/20 animate-pulse" />
                            </div>

                            <span className="relative z-10 text-[10px] font-black drop-shadow-md text-white">{slot.size}</span>
                          </div>

                          <div>
                            <h3 className="font-bold text-slate-100 text-sm">{slot.label}</h3>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isAA ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'}`}>
                              {slot.size} • {slot.type}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${isOvercharging ? 'bg-red-950 text-red-400 animate-bounce' : isCompleted ? 'bg-emerald-950 text-emerald-400' : 'bg-blue-950 text-blue-400'}`}>
                          {isOvercharging ? t('overcharging') : isCompleted ? t('done') : `${pct}%`}
                        </span>
                      </div>

                      <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 mb-4 text-center">
                        <div className="text-xs text-slate-400 font-semibold mb-1">{isOvercharging ? t('timeExceeded') : t('timeRemaining')}</div>
                        <div className={`text-2xl font-black font-mono ${isOvercharging ? 'text-red-400' : isAA ? 'text-blue-400' : 'text-amber-400'}`}>
                          {isOvercharging ? `+${formatTime(slot.overchargeSec)}` : formatTime(slot.remainingSec)}
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-5">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">{t('progress')}</span>
                          <span className={isAA ? 'text-blue-400' : 'text-amber-400'}>{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
                          <div className={`h-full rounded-full ${isOvercharging ? 'bg-red-500' : isAA ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 rtl:space-x-reverse pt-2 border-t border-slate-800">
                      <button onClick={() => handleTogglePause(slot.id)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-lg">
                        {slot.status === 'charging' ? t('pause') : t('resume')}
                      </button>
                      <button onClick={() => handleResetSlot(slot.id)} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg">
                        <RefreshCw className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleRemoveSlot(slot.id, true)} className="flex-1 bg-slate-800 hover:bg-red-950 text-emerald-400 hover:text-red-300 text-xs py-2 rounded-lg">
                        {t('unplug')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: BATTERY PROFILES */}
        {activeTab === 'battery-profiles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-slate-100">{t('batteryProfiles')}</h2>
                <p className="text-xs text-slate-400">Save, manage, and customize battery chemistry profiles and thermal limits.</p>
              </div>
              <button 
                onClick={() => { setEditingBatteryProfile({ name: 'Custom Cell', size: 'AA', type: 'NiMH', capacity: 2000, voltage: 1.2, maxCurrentMa: 2000, thermalLimitC: 50 }); setIsBatteryProfileModalOpen(true); }} 
                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-4 py-2.5 rounded-xl font-semibold flex items-center space-x-1 rtl:space-x-reverse"
              >
                <Plus className="w-4 h-4" />
                <span>New Battery Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {batteryProfiles.map(p => (
                <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-slate-100 text-sm">{p.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">{p.size}</span>
                    </div>
                    <div className="text-xs text-slate-400 space-y-1 mt-3">
                      <div>Chemistry: <strong className="text-slate-200">{p.type}</strong></div>
                      <div>Capacity: <strong className="text-slate-200">{p.capacity} mAh</strong></div>
                      <div>Nominal Voltage: <strong className="text-slate-200">{p.voltage}V</strong></div>
                      <div>Thermal Limit: <strong className="text-red-400">{p.thermalLimitC}°C</strong></div>
                    </div>
                  </div>
                  <div className="flex space-x-2 rtl:space-x-reverse mt-4 pt-3 border-t border-slate-800">
                    <button onClick={() => { setEditingBatteryProfile(p); setIsBatteryProfileModalOpen(true); }} className="flex-1 bg-slate-800 hover:bg-slate-700 text-xs py-1.5 rounded-lg text-slate-300">Edit</button>
                    {batteryProfiles.length > 1 && (
                      <button onClick={() => setBatteryProfiles(prev => prev.filter(item => item.id !== p.id))} className="p-1.5 bg-slate-800 hover:bg-red-950 text-red-400 rounded-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: CHARGERS */}
        {activeTab === 'chargers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-slate-100">{t('chargers')}</h2>
                <p className="text-xs text-slate-400">Configure charger channel output currents and circuit pairing.</p>
              </div>
              <button onClick={() => { setEditingCharger({ name: 'New Charger', inputV: 100, inputVMax: 240, inputA: 0.3, inputHz: '50/60Hz', outputV: 1.5, aaCurrentMa: 500, aaaCurrentMa: 250, isPaired: false, notes: '' }); setIsChargerModalOpen(true); }} className="bg-blue-600 text-white text-xs px-4 py-2.5 rounded-xl font-semibold">
                <Plus className="w-4 h-4 inline mr-1" /> Add Charger
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {chargers.map(c => {
                const isActive = c.id === activeChargerId;
                return (
                  <div key={c.id} className={`bg-slate-900 border ${isActive ? 'border-blue-500 ring-1 ring-blue-500/40' : 'border-slate-800'} rounded-2xl p-5 flex flex-col justify-between`}>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-100 text-sm">{c.name}</h3>
                        {isActive && <span className="bg-blue-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full">Active</span>}
                      </div>
                      <p className="text-xs text-slate-400 mb-4">{c.notes}</p>
                      <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                        <div>AA Current: <strong className="text-blue-400">{c.aaCurrentMa}mA</strong></div>
                        <div>AAA Current: <strong className="text-amber-400">{c.aaaCurrentMa}mA</strong></div>
                      </div>
                    </div>
                    <div className="flex space-x-2 rtl:space-x-reverse mt-4 pt-3 border-t border-slate-800">
                      {!isActive && <button onClick={() => setActiveChargerId(c.id)} className="flex-1 bg-slate-800 text-xs py-1.5 rounded-lg text-blue-400">Set Active</button>}
                      <button onClick={() => { setEditingCharger(c); setIsChargerModalOpen(true); }} className="p-1.5 bg-slate-800 text-slate-300 rounded-lg"><Edit3 className="w-4 h-4" /></button>
                      {chargers.length > 1 && <button onClick={() => setChargers(prev => prev.filter(item => item.id !== c.id))} className="p-1.5 bg-slate-800 text-red-400 rounded-lg"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SAFETY */}
        {activeTab === 'safety' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 max-w-4xl mx-auto">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-2 rtl:space-x-reverse">
              <ShieldCheck className="text-emerald-400 w-6 h-6" />
              <span>{t('safety')} & Chemical Degradation Guide</span>
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard plug-in chargers often lack individual dynamic peak detection (-ΔV). Unplugging NiMH and Li-ion rechargeable batteries promptly upon reaching 100% prevents internal electrolyte venting, high thermal pressure, and permanent capacity degradation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <strong className="text-blue-400 text-sm">NiMH Thermal Pressure Venting</strong>
                <p>Overcharging converts excess energy directly into heat. Efficiency compensation (1.2x - 1.4x) accounts for internal electrical resistance.</p>
              </div>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <strong className="text-amber-400 text-sm">Li-ion Voltage Cutoff</strong>
                <p>14500 and 10440 Li-ion cells must never exceed 4.20V nominal cutoff to avoid thermal runaway and metallic lithium plating risks.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex justify-between items-center">
              <h2 className="font-bold text-slate-100 text-sm">{t('history')}</h2>
              {history.length > 0 && <button onClick={() => setHistory([])} className="text-xs text-red-400 bg-red-950/40 px-3 py-1.5 rounded-lg">Clear History</button>}
            </div>
            {history.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">No history logged yet.</div>
            ) : (
              history.map((h, i) => (
                <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex justify-between text-xs items-center">
                  <div>
                    <div className="font-bold text-slate-200">{h.label} ({h.size})</div>
                    <div className="text-[10px] text-slate-400">{h.capacity}mAh • {new Date(h.finishedAt).toLocaleString()}</div>
                  </div>
                  <span className="text-emerald-400 font-bold">Completed</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 6: SETTINGS & SUBSCRIPTION */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2 rtl:space-x-reverse">
                <ShieldAlert className="w-5 h-5 text-amber-400" />
                <span>{t('noAds')} & Annual Subscription</span>
              </h2>

              <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
                <h3 className="font-bold text-sm text-cyan-300">{t('removeAdsTitle')}</h3>
                <p className="text-xs text-slate-300">{t('removeAdsDesc')}</p>
                
                {isSubscriberValid ? (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs rounded-lg flex items-center justify-between">
                    <span>✨ {t('adActiveUntil')} {new Date(subscription.expiresAt).toLocaleDateString()}</span>
                    <span className="font-bold">ACTIVE</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg flex items-center justify-center space-x-2 rtl:space-x-reverse"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>{t('buyButton')}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2 rtl:space-x-reverse">
                <Settings className="w-5 h-5 text-blue-400" />
                <span>Audio Chime & Push Alarms</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span>Web Audio Completion Chime</span>
                  <input type="checkbox" checked={settings.audioAlerts} onChange={(e) => { setSettings({ ...settings, audioAlerts: e.target.checked }); if (e.target.checked) triggerAlarmSound(); }} className="w-5 h-5 accent-blue-600 rounded" />
                </div>
                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <span>Browser Push Notifications</span>
                  <button onClick={() => requestNotificationPermission()} className="px-3 py-1.5 bg-blue-600 text-white rounded-lg">Enable</button>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- MODAL: ADD BATTERY SLOT --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-100 mb-4">{t('addSlot')}</h2>
            <form onSubmit={handleAddSlotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select from Saved Battery Profiles</label>
                <select value={selectedBatteryProfileId} onChange={handleBatteryProfileSelect} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200">
                  <option value="">-- Choose Battery Profile --</option>
                  {batteryProfiles.map(p => <option key={p.id} value={p.id}>{p.name} ({p.capacity}mAh)</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Slot Identification Label</label>
                <input type="text" value={newSlotForm.slotLabel} onChange={(e) => setNewSlotForm({ ...newSlotForm, slotLabel: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" required />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Capacity (mAh)</label>
                  <input type="number" value={newSlotForm.capacity} onChange={(e) => setNewSlotForm({ ...newSlotForm, capacity: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Charge %</label>
                  <input type="number" min="0" max="95" value={newSlotForm.initialCharge} onChange={(e) => setNewSlotForm({ ...newSlotForm, initialCharge: Number(e.target.value) })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" />
                </div>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 bg-slate-800 text-xs text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-xs text-white font-semibold rounded-xl">Start Timer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: FULLY FUNCTIONAL BATTERY PROFILE EDITOR --- */}
      {isBatteryProfileModalOpen && editingBatteryProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-100 mb-4">
              {editingBatteryProfile.id ? 'Edit Battery Profile' : 'New Battery Profile'}
            </h2>
            <form onSubmit={handleSaveBatteryProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Battery Name / Brand</label>
                <input 
                  type="text" 
                  value={editingBatteryProfile.name} 
                  onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, name: e.target.value })} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Size</label>
                  <select 
                    value={editingBatteryProfile.size} 
                    onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, size: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                  >
                    <option value="AA">AA</option>
                    <option value="AAA">AAA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Chemistry Type</label>
                  <select 
                    value={editingBatteryProfile.type} 
                    onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                  >
                    <option value="NiMH">NiMH</option>
                    <option value="Li-ion">Li-ion</option>
                    <option value="Alkaline">Alkaline</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Capacity (mAh)</label>
                  <input 
                    type="number" 
                    value={editingBatteryProfile.capacity} 
                    onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, capacity: Number(e.target.value) })} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Voltage (V)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    value={editingBatteryProfile.voltage} 
                    onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, voltage: Number(e.target.value) })} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Thermal Limit (°C)</label>
                  <input 
                    type="number" 
                    value={editingBatteryProfile.thermalLimitC} 
                    onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, thermalLimitC: Number(e.target.value) })} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" 
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsBatteryProfileModalOpen(false)} className="px-4 py-2 bg-slate-800 text-xs text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-xs text-white font-semibold rounded-xl">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: FULLY FUNCTIONAL CHARGER EDITOR --- */}
      {isChargerModalOpen && editingCharger && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-100 mb-4">
              {editingCharger.id ? 'Edit Charger Profile' : 'New Charger Profile'}
            </h2>
            <form onSubmit={handleSaveCharger} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Charger Name / Model</label>
                <input 
                  type="text" 
                  value={editingCharger.name} 
                  onChange={(e) => setEditingCharger({ ...editingCharger, name: e.target.value })} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-blue-400 mb-1">AA Output (mA)</label>
                  <input 
                    type="number" 
                    value={editingCharger.aaCurrentMa} 
                    onChange={(e) => setEditingCharger({ ...editingCharger, aaCurrentMa: Number(e.target.value) })} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">AAA Output (mA)</label>
                  <input 
                    type="number" 
                    value={editingCharger.aaaCurrentMa} 
                    onChange={(e) => setEditingCharger({ ...editingCharger, aaaCurrentMa: Number(e.target.value) })} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Channel Architecture</label>
                  <select 
                    value={editingCharger.isPaired ? 'paired' : 'independent'} 
                    onChange={(e) => setEditingCharger({ ...editingCharger, isPaired: e.target.value === 'paired' })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                  >
                    <option value="independent">Independent Slots</option>
                    <option value="paired">Paired Channels (1&2, 3&4)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Notes / Description</label>
                  <input 
                    type="text" 
                    value={editingCharger.notes || ''} 
                    onChange={(e) => setEditingCharger({ ...editingCharger, notes: e.target.value })} 
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200" 
                    placeholder="e.g. Smart peak detection"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-3 border-t border-slate-800">
                <button type="button" onClick={() => setIsChargerModalOpen(false)} className="px-4 py-2 bg-slate-800 text-xs text-slate-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-blue-600 text-xs text-white font-semibold rounded-xl">Save Charger</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- 2. SECURE MULTI-PROVIDER PAYMENT MODAL (PayPal & Revolut) --- */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
            <button 
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-full bg-slate-800/60"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3 rtl:space-x-reverse">
              <div className="p-3 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100">{t('secureCheckout')}</h2>
                <p className="text-xs text-slate-400">{t('removeAdsTitle')}</p>
              </div>
            </div>

            {paymentSuccessMsg ? (
              <div className="p-4 bg-emerald-950/80 border border-emerald-500 text-emerald-300 rounded-2xl text-center text-xs space-y-1">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <p className="font-bold text-sm">{t('paymentSuccess')}</p>
                <p className="text-[10px] text-emerald-400">Receipt and license key sent to {checkoutEmail}</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1 rtl:space-x-reverse"><Key className="w-3.5 h-3.5 text-cyan-400" /> <span>{t('appSerial')}</span></span>
                    <span className="font-mono text-cyan-300 font-bold">{appSerialNo}</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 flex items-center space-x-1 rtl:space-x-reverse">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t('emailLabel')}</span>
                  </label>
                  <input 
                    type="email" 
                    value={checkoutEmail} 
                    onChange={(e) => setCheckoutEmail(e.target.value)} 
                    placeholder="user@example.com"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                    required 
                  />
                </div>

                <div className="space-y-2.5 pt-2">
                  <button 
                    onClick={() => handlePaymentRedirect('paypal')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg flex items-center justify-center space-x-2 rtl:space-x-reverse transition"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>{t('payWithPaypal')}</span>
                  </button>

                  <button 
                    onClick={() => handlePaymentRedirect('revolut')}
                    className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs py-3.5 rounded-xl shadow-lg flex items-center justify-center space-x-2 rtl:space-x-reverse transition"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{t('payWithRevolut')}</span>
                  </button>
                </div>

                <p className="text-[10px] text-slate-500 text-center">
                  Secure 256-bit SSL encrypted checkout. Renews automatically after 365 days.
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}