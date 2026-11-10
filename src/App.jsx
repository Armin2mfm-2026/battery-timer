import React, { useState, useEffect, useRef, useMemo } from 'react';
import packageJson from '../package.json';
import { 
  Zap, BatteryCharging, AlertTriangle, ShieldCheck, Plus, Trash2, Edit3, 
  Play, Pause, RefreshCw, Volume2, VolumeX, Settings, Bell, Info, Save, 
  CheckCircle2, Clock, Battery, BatteryFull, Layers, HelpCircle, ChevronRight,
  Flame, Award, Sparkles, Moon, Sun, ArrowUpRight, Globe, DollarSign, 
  ShieldAlert, ChevronLeft, Video, Image as ImageIcon, X, ExternalLink, CreditCard, Mail, Key, Heart, MessageSquare, Send, Copy, Check, TrendingUp,
  Download, Upload, Cloud, CloudRain, CloudUpload, CloudDownload, RefreshCw as SyncIcon
} from 'lucide-react';

// Increment this when the displayed terms change so prior users must review them again.
const TERMS_VERSION = '1.0.0';
const TERMS_EFFECTIVE_DATE = '2026-11-10';
const TERMS_STORAGE_KEY = 'voltguard_terms_acceptance';
const APP_VERSION = packageJson.version;
const APP_VERSION_STORAGE_KEY = 'voltguard_app_version_seen';
// For each release, bump package.json and add its notes here while retaining older entries.
const APP_RELEASES = [
  {
    version: '1.1.0',
    summary: 'Added app version history and a one-time update notice, with PWA reload and mobile store links.'
  },
  {
    version: '1.0.0',
    summary: 'Initial release with battery and charger profiles, charge-time estimates, history, safety guidance, and PWA support.'
  }
];
const CURRENT_RELEASE = APP_RELEASES.find(release => release.version === APP_VERSION) || {
  version: APP_VERSION,
  summary: 'Open Settings to review the latest release information.'
};
const APP_RELEASE_HISTORY = [
  CURRENT_RELEASE,
  ...APP_RELEASES.filter(release => release.version !== APP_VERSION)
];

const TERMS_SECTIONS = [
  {
    heading: '1. Agreement and eligibility',
    text: 'These Terms govern your use of VoltGuard Pro and its website, PWA, and any official mobile app. You accept by selecting “I agree” after reviewing these Terms. If you do not agree, do not use the app. If you are not old enough to enter a binding agreement where you live, use the app only with the involvement and permission of a parent or legal guardian.'
  },
  {
    heading: '2. What the app does—and does not do',
    text: 'The app provides user-entered battery profiles, calculations, reminders, and time estimates for convenience only. It does not measure battery state of charge, temperature, capacity, condition, or charger output; it does not connect to, control, stop, or disconnect a battery or charger. Estimates can be inaccurate or interrupted, and alarms or notifications may be delayed, unavailable, or prevented by device, browser, operating-system, or power settings. The app is not a safety system, professional engineering advice, or a substitute for manufacturer instructions.'
  },
  {
    heading: '3. Battery and charging safety',
    text: 'You are responsible for confirming the exact battery chemistry, size, condition, polarity, charger compatibility, settings, and environment using the manufacturers’ instructions. Use only a charger designed for that battery. Never rely on this app as the sole means of monitoring charging, and do not leave charging batteries unattended or charge damaged, leaking, hot, or otherwise suspect batteries. Stop charging and follow the manufacturers’ safety guidance if you notice unusual heat, odor, noise, swelling, leakage, or smoke. The app cannot prevent fire, injury, property damage, overcharging, or equipment failure.'
  },
  {
    heading: '4. Your responsibilities and acceptable use',
    text: 'Use the app lawfully and at your own discretion. Check any entered data and estimates before relying on them, keep your device and backups secure, and do not use the app where an inaccurate, delayed, or unavailable estimate could cause injury or damage. You remain responsible for your batteries, chargers, decisions, and compliance with local laws. Accepting these Terms does not authorize a payment. Any optional donation or paid offer is subject to its own price, payment, renewal, cancellation, refund, and withdrawal disclosures shown before you proceed.'
  },
  {
    heading: '5. Data and privacy',
    text: 'Profiles, settings, and history may be stored on your device or browser and can be lost when app or browser data is cleared. You control any backups you export or share. Optional features may involve third-party software or services. Read the applicable Privacy Notice and platform disclosures for details about data handling; these Terms are not a substitute for a legally required privacy notice. Do not enter information you do not want processed by the features you choose to use.'
  },
  {
    heading: '6. Third-party products and services',
    text: 'Battery, charger, platform, and service names are provided for identification or convenience and do not imply endorsement or a guarantee of compatibility. Third-party products and services are governed by their own instructions and terms. We do not control third-party services, and their availability or behavior may change.'
  },
  {
    heading: '7. Intellectual property and feedback',
    text: 'The app and its original content are owned by their respective rights holders and are protected by applicable intellectual-property laws. You may use the app for personal, lawful purposes, subject to these Terms and any applicable open-source licenses. If you send feedback, you allow us to use it to improve the app without an obligation to you, to the extent permitted by law.'
  },
  {
    heading: '8. Availability and changes',
    text: 'We may update, suspend, or discontinue features or the app, and we do not promise uninterrupted or error-free operation. We may revise these Terms. The current version and effective date are shown here. When a new version is released, the app will display a notice at your next launch and require your affirmative acceptance before further use. If you decline, you cannot use the app; close the app or browser. Acceptance is recorded on this device, so clearing its storage may cause the notice to appear again.'
  },
  {
    heading: '9. Disclaimers and liability',
    text: 'To the maximum extent the law permits, the app is provided “as is” and “as available,” without promises that estimates are accurate, that the app is suitable for a particular purpose, or that it will be uninterrupted or secure. To the maximum extent permitted by applicable law, the publisher is not liable for indirect or consequential loss arising from use of the app. Nothing in these Terms excludes or limits liability, warranty, remedy, or consumer rights that applicable law does not allow to be excluded or limited, including rights concerning death or personal injury caused by negligence, fraud, or intentional misconduct where such exclusion is prohibited.'
  },
  {
    heading: '10. Governing law and consumer rights',
    text: 'These general Terms do not claim to satisfy every country’s laws and do not select a governing law, court, arbitration process, or waive your right to bring a claim. Before distribution in a jurisdiction, the publisher must obtain local legal review and provide any required localized terms, privacy notice, publisher identity, address, and consumer disclosures. Mandatory protections and rights available to you under the laws that apply in your country or state remain unaffected. You may have additional rights that cannot be waived by contract.'
  },
  {
    heading: '11. Contact',
    text: 'For questions about these Terms, contact support@voltguard.pro. The app publisher should provide its complete legal identity, geographic address, and any required local disclosures in the applicable store listing and legal notices.'
  }
];

// --- i18n TRANSLATION DICTIONARY WITH FULL LANGUAGE NAMES ---
const TRANSLATIONS = {
  en: {
    title: "VoltGuard Pro",
    subtitle: "Smart Battery Charging & Thermal Manager",
    dashboard: "Dashboard",
    statistics: "Statistics",
    batteryProfiles: "Battery Profiles",
    chargers: "Charger Profiles",
    safety: "Safety & Physics",
    history: "Log History",
    contactUs: "Contact Us",
    settings: "Settings",
    activeCharger: "Active Charger:",
    addSlot: "Add Battery Slot",
    noSlotsTitle: "No Active Battery Charging Slots",
    noSlotsDesc: "Add a battery profile to estimate charge time. The app does not directly monitor or control batteries or chargers; supervise charging and follow manufacturer guidance.",
    insertFirst: "Insert First Battery Slot",
    timeRemaining: "Time Remaining",
    timeExceeded: "Time Exceeded",
    targetTime: "Target Charge Time",
    progress: "Progress",
    pause: "Pause",
    resume: "Resume",
    stopCharge: "Stop Charge",
    terminateTimer: "Stop Charge",
    overcharging: "OVERCHARGING",
    done: "DONE",
    condition: "Battery Condition",
    newBattery: "New",
    usedBattery: "Used",
    priorUsage: "Prior Usage Duration",
    months: "Months",
    years: "Years",
    targetChargeMode: "Target Charge Mode",
    fullCharge100: "Full Charge (100% Target)",
    halfCharge50: "Half Charge (50% Storage Mode)",
    sohTitle: "State of Health (SoH)",
    rulTitle: "Remaining Useful Life (RUL)",
    chargeCycles: "Total Charge Cycles",
    overchargeInstances: "Overcharge Events",
    estRuntime: "Estimated Operating Runtime",
    heatLoss: "Efficiency & Heat Loss Index",
    healthTrend: "Degradation Trend Analysis",
    backupRestoreTitle: "Data Backup & Restore",
    backupRestoreDesc: "Export or import your complete battery profiles, chargers, and statistical logs securely.",
    includeStats: "Include Statistics & Log History in Backup",
    exportLocal: "Export Local Backup (.json)",
    importLocal: "Import Local Backup",
    exportGDrive: "Export to Google Drive",
    importGDrive: "Restore from Google Drive",
    exportICloud: "Export to Apple iCloud",
    importICloud: "Restore from Apple iCloud",
    backupSuccess: "✨ Backup successfully exported!",
    restoreSuccess: "✨ Data successfully restored from backup!",
    backupError: "Error: Invalid backup schema or corrupted file format.",
    alert50Title: "⚠️ Battery Health Alert (50% Capacity)",
    alert50Desc: "Battery has reached ~50% of original factory capacity due to wear.",
    alert30Title: "🚨 Critical Battery Warning (30% Capacity)",
    alert30Desc: "Battery capacity is critically low (~30%). Immediate replacement recommended.",
    donateTitle: "Keep VoltGuard Pro Running & Online",
    donateDesc: "Your voluntary contribution directly supports server maintenance, continuous battery profile updates, and keeps this tool free. Donate whatever you want!",
    donateButton: "Support via PayPal, Revolut or Crypto",
    supportActiveUntil: "Supporter Status Active Until:",
    emailLabel: "Your Email Address (for Receipt & Supporter Badge):",
    payWithPaypal: "Donate with PayPal",
    payWithRevolut: "Donate with Revolut",
    secureCheckout: "Secure Supporter Contribution Gateway",
    paymentSuccess: "✨ Thank you! Supporter Status Verified Successfully!",
    alarmSoundLabel: "Completion Alarm Sound",
    notificationsLabel: "Push Notifications",
    enable: "Enable",
    disable: "Disable",
    btcWalletTitle: "Bitcoin (BTC) Wallet Donation",
    usdtWalletTitle: "Tether (USDT TRC20) Wallet Donation",
    copied: "Copied!",
    errorChargerInUse: "Error: Cannot change, edit, or delete the active charger while battery slots are actively charging!",
    errorProfileInUse: "Error: Cannot modify or delete this battery profile while its battery is actively charging!",
    errorProfileRequired: "Error: Please select a battery profile or fill in all required fields before starting.",
    errorBatteryExists: "Error: A battery with the same name and specifications already exists.",
    errorChargerExists: "Error: A charger with the same name and specifications already exists.",
    errorValidation: "Please fix all validation errors before submitting.",
    errorIncompatibleBattery: "Error: Selected battery chemistry, size, or voltage is incompatible with this charger slot.",
    errorChargerCurrentMissing: "Add the per-slot charging current from the charger's manual to this charger profile before estimating this battery.",
    termsTitle: "Terms and Conditions",
    termsVersion: "Version",
    termsEffective: "Effective",
    termsFirstUseNotice: "Please review and accept these Terms and Conditions to use the app.",
    termsUpdateNotice: "Our Terms have been updated since the version previously accepted on this device. Review and accept the current version to continue.",
    termsAgreeCheckbox: "I have read and agree to these Terms and Conditions.",
    termsAccept: "Agree and continue",
    termsDecline: "Decline",
    termsDeclinedTitle: "Terms not accepted",
    termsDeclinedMessage: "You cannot use the app without accepting the current Terms. Close this app or browser window, or review the Terms and choose again.",
    termsReview: "Review Terms",
    termsStorageError: "Your acceptance could not be saved. You can continue this session, but these Terms will be shown again next time. Enable browser storage to remember your acceptance.",
    termsSettingsDescription: "Review the current terms and the version accepted on this device.",
    appUpdateTitle: "App updates",
    appUpdateDescription: "See the installed version, release notes, and get the latest update.",
    appUpdateCurrentVersion: "Current version",
    appUpdateHistory: "Version history",
    appUpdateAvailable: "A new version is available.",
    appUpdateNow: "Update app",
    appUpdateLater: "Later",
    appUpdateSettings: "View in Settings",
    appUpdateChecking: "Checking for updates…",
    appUpdateFailed: "Could not check for the update. Please try again.",
    appUpdatePwaHint: "The PWA will reload and fetch the latest deployed version.",
    appUpdateNativeHint: "Continue to your device’s app store to update."
  },
  fa: {
    title: "ولتشیلد پرو",
    subtitle: "مدیریت هوشمند شارژ و ایمنی حرارتی باتری",
    dashboard: "داشبورد",
    statistics: "آمار و سلامت",
    batteryProfiles: "پروفایل‌های باتری",
    chargers: "پروفایل‌های شارژر",
    safety: "ایمنی و فیزیک",
    history: "تاریخچه شارژ",
    contactUs: "تماس با ما",
    settings: "تنظیمات",
    activeCharger: "شارژر فعال:",
    addSlot: "افزودن اسلات باتری",
    noSlotsTitle: "هیچ اسلات شارژ فعالی وجود ندارد",
    noSlotsDesc: "برای تخمین زمان شارژ، یک پروفایل باتری اضافه کنید. برنامه باتری یا شارژر را مستقیماً پایش یا کنترل نمی‌کند؛ هنگام شارژ نظارت کنید و دستورالعمل سازنده را دنبال کنید.",
    insertFirst: "افزودن اولین باتری",
    timeRemaining: "زمان باقی‌مانده",
    timeExceeded: "زمان اضافه شارژ",
    targetTime: "زمان شارژ هدف",
    progress: "پیشرفت",
    pause: "توقف موقت",
    resume: "ادامه شارژ",
    stopCharge: "توقف شارژ",
    terminateTimer: "توقف شارژ",
    overcharging: "شارژ بیش از حد (خطر حرارت)",
    done: "تکمیل شد",
    condition: "وضعیت باتری",
    newBattery: "نو",
    usedBattery: "کارکرده",
    priorUsage: "مدت کارکرد قبلی",
    months: "ماه",
    years: "سال",
    targetChargeMode: "حالت هدف شارژ",
    fullCharge100: "شارژ کامل (هدف ۱۰۰٪)",
    halfCharge50: "نیمه شارژ (حالت ذخیره‌سازی ۵۰٪)",
    sohTitle: "شاخص سلامت (SoH)",
    rulTitle: "عکرم مفید باقی‌مانده (RUL)",
    chargeCycles: "تعداد چرخه شارژ",
    overchargeInstances: "موارد شارژ بیش از حد",
    estRuntime: "زمان تقریبی شارژدهی",
    heatLoss: "شاخص تلفات حرارتی و راندمان",
    healthTrend: "تحلیل روند افت سلامت",
    backupRestoreTitle: "پشتیبان‌گیری و بازیابی داده‌ها",
    backupRestoreDesc: "پروفایل‌های باتری، شارژرها و گزارش‌های آماری خود را به صورت ایمن صادر یا وارد کنید.",
    includeStats: "لحاظ کردن آمار و تاریخچه در فایل پشتیبان",
    exportLocal: "صدور پشتیبان محلی (.json)",
    importLocal: "وارد کردن پشتیبان محلی",
    exportGDrive: "ارسال به گوگل درایو",
    importGDrive: "بازیابی از گوگل درایو",
    exportICloud: "ارسال به اپل کلود (iCloud)",
    importICloud: "بازیابی از اپل کلود (iCloud)",
    backupSuccess: "✨ پشتیبان با موفقیت صادر شد!",
    restoreSuccess: "✨ اطلاعات با موفقیت از فایل پشتیبان بازیابی شد!",
    backupError: "خطا: ساختار فایل پشتیبان نامعتبر یا آسیب‌دیده است.",
    alert50Title: "⚠️ هشدار سلامت باتری (ظرفیت ۵۰٪)",
    alert50Desc: "ظرفیت باتری به دلیل استهلاک به حدود ۵۰٪ کاهش یافته است.",
    alert30Title: "🚨 هشدار بحرانی باتری (ظرفیت ۳۰٪)",
    alert30Desc: "ظرفیت باتری به شدت کاهش یافته (~۳۰٪). تعویض فوری توصیه می‌شود.",
    donateTitle: "کمک به بقا و توسعه ولتشیلد پرو",
    donateDesc: "کمک داوطلبانه شما مستقیماً صرف نگهداری سرورها می‌شود. هر مبلغی که تمایل دارید اهدا کنید.",
    donateButton: "حمایت مالی از طریق پی‌پال، ریولوت یا ارز دیجیتال",
    supportActiveUntil: "وضعیت حامی فعال تا:",
    emailLabel: "آدرس ایمیل شما:",
    payWithPaypal: "پرداخت با PayPal",
    payWithRevolut: "پرداخت با Revolut",
    secureCheckout: "درگاه امن حمایت مالی",
    paymentSuccess: "✨ از حمایت شما سپاسگزاریم!",
    alarmSoundLabel: "صدای زنگ هشدار اتمام شارژ",
    notificationsLabel: "اعلان‌های پوش",
    enable: "فعال",
    disable: "غیرفعال",
    btcWalletTitle: "کیف پول بیت‌کوین (BTC)",
    usdtWalletTitle: "کیف پول تتر (USDT)",
    copied: "کپی شد!",
    errorChargerInUse: "خطا: امکان تغییر، ویرایش یا حذف شارژر فعال در هنگام شارژ باتری‌ها وجود ندارد!",
    errorProfileInUse: "خطا: در حال حاضر این باتری در حال شارژ است، امکان ویرایش یا حذف پروفایل آن وجود ندارد!",
    errorProfileRequired: "خطا: لطفاً یک پروفایل باتری انتخاب کنید یا فیلدهای الزامی را پر کنید.",
    errorBatteryExists: "خطا: باتری با همین نام و مشخصات قبلاً وجود دارد.",
    errorChargerExists: "خطا: شارژر با همین نام و مشخصات قبلاً وجود دارد.",
    errorValidation: "لطفاً خطاهای فرم را برطرف کنید.",
    errorIncompatibleBattery: "خطا: شیمی، اندازه یا ولتاژ باتری انتخابی با این اسلات شارژر سازگار نیست."
  },
  it: {
    title: "VoltGuard Pro",
    subtitle: "Gestore Intelligente di Carica e Sicurezza",
    dashboard: "Dashboard",
    statistics: "Statistiche",
    batteryProfiles: "Profili Batterie",
    chargers: "Caricabatterie",
    safety: "Sicurezza",
    history: "Cronologia",
    contactUs: "Contattaci",
    settings: "Impostazioni",
    activeCharger: "Caricatore Attivo:",
    addSlot: "Aggiungi Slot",
    noSlotsTitle: "Nessuno slot di ricarica attivo",
    noSlotsDesc: "Aggiungi un profilo per stimare il tempo di ricarica. L’app non monitora né controlla direttamente batteria o caricatore; sorveglia la ricarica e segui le istruzioni del produttore.",
    insertFirst: "Inserisci prima batteria",
    timeRemaining: "Tempo Rimanente",
    timeExceeded: "Tempo Superato",
    targetTime: "Tempo Target",
    progress: "Progresso",
    pause: "Pausa",
    resume: "Riprendi",
    stopCharge: "Interrompi Carica",
    terminateTimer: "Interrompi Carica",
    overcharging: "SOVRACCARICA",
    done: "FATTO",
    condition: "Condizione Batteria",
    newBattery: "Nuova",
    usedBattery: "Usata",
    priorUsage: "Durata Utilizzo Precedente",
    months: "Mesi",
    years: "Anni",
    targetChargeMode: "Modalità Target Carica",
    fullCharge100: "Carica Completa (Target 100%)",
    halfCharge50: "Mezza Carica (Modalità Storage 50%)",
    sohTitle: "Stato di Salute (SoH)",
    rulTitle: "Vita Utile Rimanente (RUL)",
    chargeCycles: "Cicli di Carica Totali",
    overchargeInstances: "Eventi di Sovraccarica",
    estRuntime: "Autonomia Operativa Stimata",
    heatLoss: "Indice di Perdita Termica ed Efficienza",
    healthTrend: "Analisi Trend di Degrado",
    backupRestoreTitle: "Backup e Ripristino Dati",
    backupRestoreDesc: "Esporta o importa in modo sicuro i tuoi profili di batterie, caricabatterie e statistiche.",
    includeStats: "Includi statistiche e cronologia nel backup",
    exportLocal: "Esporta Backup Locale (.json)",
    importLocal: "Importa Backup Locale",
    exportGDrive: "Esporta su Google Drive",
    importGDrive: "Ripristina da Google Drive",
    exportICloud: "Esporta su Apple iCloud",
    importICloud: "Ripristina da Apple iCloud",
    backupSuccess: "✨ Backup esportato con successo!",
    restoreSuccess: "✨ Dati ripristinati con successo dal backup!",
    backupError: "Errore: schema di backup non valido o file corrotto.",
    alert50Title: "⚠️ Avviso Salute Batteria (Capacità 50%)",
    alert50Desc: "La batteria ha raggiunto circa il 50% della capacità originale.",
    alert30Title: "🚨 Avviso Critico Batteria (Capacità 30%)",
    alert30Desc: "Capacità della batteria criticamente bassa (~30%). Si consiglia la sostituzione.",
    donateTitle: "Aiutaci a mantenere VoltGuard Pro attivo e online",
    donateDesc: "Il tuo contributo volontario sostiene i costi dei server. Dona quanto desideri!",
    donateButton: "Dona via PayPal, Revolut o Crypto",
    supportActiveUntil: "Stato sostenitore attivo fino al:",
    emailLabel: "Indirizzo Email:",
    payWithPaypal: "Dona con PayPal",
    payWithRevolut: "Dona con Revolut",
    secureCheckout: "Gateway Donazioni Sicuro",
    paymentSuccess: "✨ Grazie! Donazione verificata con successo!",
    alarmSoundLabel: "Suono Allarme Completamento",
    notificationsLabel: "Notifiche Push",
    enable: "Abilita",
    disable: "Disabilita",
    btcWalletTitle: "Indirizzo Bitcoin (BTC)",
    usdtWalletTitle: "Indirizzo USDT (TRC20)",
    copied: "Copiato!",
    errorChargerInUse: "Errore: impossibile cambiare, modificare o eliminare il caricatore attivo mentre ci sono slot in carica!",
    errorProfileInUse: "Errore: impossibile modificare o eliminare questo profilo mentre la batteria è in carica!",
    errorProfileRequired: "Errore: selezionare un profilo batteria o compilare i campi richiesti.",
    errorBatteryExists: "Errore: esiste già una batteria con lo stesso nome e le stesse specifiche.",
    errorChargerExists: "Errore: esiste già un caricabatterie con lo stesso nome e le stesse specifiche.",
    errorValidation: "Correggere gli errori prima di inviare.",
    errorIncompatibleBattery: "Errore: chimica, dimensione o tensione della batteria selezionata non compatibile con questo slot."
  },
  es: {
    title: "VoltGuard Pro",
    subtitle: "Gestor Inteligente de Carga y Temperatura",
    dashboard: "Panel",
    statistics: "Estadísticas",
    batteryProfiles: "Perfiles de Batería",
    chargers: "Cargadores",
    safety: "Seguridad",
    history: "Historial",
    contactUs: "Contacto",
    settings: "Ajustes",
    activeCharger: "Cargador Activo:",
    addSlot: "Añadir Ranura",
    noSlotsTitle: "No hay ranuras activas",
    noSlotsDesc: "Añade un perfil para estimar el tiempo de carga. La aplicación no supervisa ni controla directamente la batería o el cargador; vigila la carga y sigue las instrucciones del fabricante.",
    insertFirst: "Insertar Primera Batería",
    timeRemaining: "Tiempo Restante",
    timeExceeded: "Tiempo Excedido",
    targetTime: "Tiempo Objetivo",
    progress: "Progreso",
    pause: "Pausar",
    resume: "Reanudar",
    stopCharge: "Detener Carga",
    terminateTimer: "Detener Carga",
    overcharging: "SOBRECARGANDO",
    done: "LISTO",
    condition: "Condición de Batería",
    newBattery: "Nueva",
    usedBattery: "Usada",
    priorUsage: "Duración de Uso Previsto",
    months: "Meses",
    years: "Años",
    targetChargeMode: "Modo de Carga Objetivo",
    fullCharge100: "Carga Completa (Objetivo 100%)",
    halfCharge50: "Media Carga (Modo Almacenamiento 50%)",
    sohTitle: "Estado de Salud (SoH)",
    rulTitle: "Vida Útil Restante (RUL)",
    chargeCycles: "Ciclos de Carga Totales",
    overchargeInstances: "Eventos de Sobrecarga",
    estRuntime: "Autonomía Operativa Estimada",
    heatLoss: "Índice de Pérdida Térmica y Eficiencia",
    healthTrend: "Análisis de Tendencia de Degradación",
    backupRestoreTitle: "Copia de Seguridad y Restauración",
    backupRestoreDesc: "Exporte o importe de forma segura sus perfiles de batería, cargadores y registros estadísticos.",
    includeStats: "Incluir estadísticas e historial en la copia",
    exportLocal: "Exportar Copia Local (.json)",
    importLocal: "Importar Copia Local",
    exportGDrive: "Exportar a Google Drive",
    importGDrive: "Restaurar desde Google Drive",
    exportICloud: "Exportar a Apple iCloud",
    importICloud: "Restaurar desde Apple iCloud",
    backupSuccess: "✨ ¡Copia de seguridad exportada con éxito!",
    restoreSuccess: "✨ ¡Datos restaurados con éxito desde la copia!",
    backupError: "Error: Esquema de copia no válido o archivo dañado.",
    alert50Title: "⚠️ Alerta de Salud de Batería (Capacidad 50%)",
    alert50Desc: "La batería ha alcanzado ~50% de su capacidad original por desgaste.",
    alert30Title: "🚨 Advertencia Crítica de Batería (Capacidad 30%)",
    alert30Desc: "Capacidad críticamente baja (~30%). Se recomienda reemplazo inmediato.",
    donateTitle: "Ayúdanos a mantener VoltGuard Pro en funcionamiento",
    donateDesc: "Tu contribución voluntaria apoya el mantenimiento. ¡Dona lo que quieras!",
    donateButton: "Donar vía PayPal, Revolut o Cripto",
    supportActiveUntil: "Estado de mecenas activo hasta:",
    emailLabel: "Correo Electrónico:",
    payWithPaypal: "Donar con PayPal",
    payWithRevolut: "Donar con Revolut",
    secureCheckout: "Pasarela de Donaciones Segura",
    paymentSuccess: "✨ ¡Gracias! Donación verificada con éxito.",
    alarmSoundLabel: "Sonido de Alarma de Carga",
    notificationsLabel: "Notificaciones Push",
    enable: "Habilitar",
    disable: "Deshabilitar",
    btcWalletTitle: "Billetera Bitcoin (BTC)",
    usdtWalletTitle: "Billetera USDT (TRC20)",
    copied: "¡Copiado!",
    errorChargerInUse: "Error: No se puede cambiar, editar o eliminar el cargador activo mientras hay baterías cargando.",
    errorProfileInUse: "Error: No se puede modificar este perfil mientras su batería está cargando.",
    errorProfileRequired: "Error: Seleccione un perfil o complete los campos obligatorios.",
    errorBatteryExists: "Error: Ya existe una batería con el mismo nombre y especificaciones.",
    errorChargerExists: "Error: Ya existe un cargador con el mismo nombre y especificaciones.",
    errorValidation: "Corrija los errores antes de continuar.",
    errorIncompatibleBattery: "Error: la química, el tamaño o el voltaje de la batería seleccionada no son compatibles con esta ranura."
  },
  zh: {
    title: "VoltGuard Pro",
    subtitle: "智能电池充电与安全管理器",
    dashboard: "仪表盘",
    statistics: "统计与健康",
    batteryProfiles: "电池配置",
    chargers: "充电器配置",
    safety: "安全指南",
    history: "历史记录",
    contactUs: "联系我们",
    settings: "设置",
    activeCharger: "当前充电器：",
    addSlot: "添加电池槽",
    noSlotsTitle: "暂无激活的充电槽",
    noSlotsDesc: "添加电池配置以估算充电时间。本应用不会直接监测或控制电池或充电器；请监督充电并遵循制造商说明。",
    insertFirst: "添加第一个电池槽",
    timeRemaining: "剩余时间",
    timeExceeded: "超出时间",
    targetTime: "目标充电时间",
    progress: "进度",
    pause: "暂停",
    resume: "恢复",
    stopCharge: "停止充电",
    terminateTimer: "停止充电",
    overcharging: "过度充电",
    done: "完成",
    condition: "电池状况",
    newBattery: "全新",
    usedBattery: "二手/已用",
    priorUsage: "先前使用时长",
    months: "个月",
    years: "年",
    targetChargeMode: "目标充电模式",
    fullCharge100: "充满电（100% 目标）",
    halfCharge50: "半电存储（50% 目标）",
    sohTitle: "健康度 (SoH)",
    rulTitle: "剩余寿命 (RUL)",
    chargeCycles: "总充电循环次数",
    overchargeInstances: "过充事件次数",
    estRuntime: "预计续航运行时间",
    heatLoss: "效率与热损耗指数",
    healthTrend: "容量衰减趋势分析",
    backupRestoreTitle: "数据备份与恢复",
    backupRestoreDesc: "安全导出或导入您的完整电池配置、充电器和统计日志文件。",
    includeStats: "在备份中包含统计与历史日志",
    exportLocal: "导出本地备份 (.json)",
    importLocal: "导入本地备份",
    exportGDrive: "导出至谷歌云端硬盘",
    importGDrive: "从谷歌云端硬盘恢复",
    exportICloud: "导出至苹果 iCloud",
    importICloud: "从苹果 iCloud 恢复",
    backupSuccess: "✨ 备份导出成功！",
    restoreSuccess: "✨ 已成功从备份中恢复数据！",
    backupError: "错误：备份架构无效或文件已损坏。",
    alert50Title: "⚠️ 电池健康警告（50% 容量）",
    alert50Desc: "由于正常老化，电池容量已降至原始容量的 ~50%。",
    alert30Title: "🚨 电池严重警告（30% 容量）",
    alert30Desc: "电池容量极低 (~30%)，强烈建议更换新电池。",
    donateTitle: "支持 VoltGuard Pro 保持在线运营",
    donateDesc: "您的自愿捐助直接用于服务器维护。金额随意，感谢支持！",
    donateButton: "通过 PayPal、Revolut 或加密货币捐赠",
    supportActiveUntil: "支持者状态有效期至：",
    emailLabel: "电子邮箱：",
    payWithPaypal: "通过 PayPal 捐赠",
    payWithRevolut: "通过 Revolut 捐赠",
    secureCheckout: "安全捐赠网关",
    paymentSuccess: "✨ 感谢您的支持！",
    alarmSoundLabel: "充电完成提示音",
    notificationsLabel: "推送通知",
    enable: "开启",
    disable: "关闭",
    btcWalletTitle: "比特币 (BTC) 钱包地址",
    usdtWalletTitle: "泰达币 (USDT) 钱包地址",
    copied: "已复制！",
    errorChargerInUse: "错误：电池充电中时，无法更改、编辑或删除当前使用的充电器！",
    errorProfileInUse: "错误：该电池正在充电中，无法编辑或删除此电池配置！",
    errorProfileRequired: "错误：请选择电池配置或填写所有必填字段。",
    errorBatteryExists: "错误：已存在具有相同名称和规格的电池。",
    errorChargerExists: "错误：已存在具有相同名称和规格的充电器。",
    errorValidation: "请修正表单错误后提交。",
    errorIncompatibleBattery: "错误：所选电池的化学体系、尺寸或电压与此充电槽不兼容。"
  },
  fr: {
    title: "VoltGuard Pro",
    subtitle: "Gestionnaire Intelligent de Charge et de Batterie",
    dashboard: "Tableau de bord",
    statistics: "Statistiques",
    batteryProfiles: "Profils de piles",
    chargers: "Chargeurs",
    safety: "Sécurité",
    history: "Historique",
    contactUs: "Contact",
    settings: "Paramètres",
    activeCharger: "Chargeur Actif:",
    addSlot: "Ajouter un emplacement",
    noSlotsTitle: "Aucun emplacement actif",
    noSlotsDesc: "Ajoutez un profil pour estimer le temps de charge. L’application ne surveille ni ne contrôle directement la batterie ou le chargeur ; surveillez la charge et suivez les consignes du fabricant.",
    insertFirst: "Insérer une pile",
    timeRemaining: "Temps Restant",
    timeExceeded: "Temps Dépassé",
    targetTime: "Temps Cible",
    progress: "Progrès",
    pause: "Pause",
    resume: "Reprendre",
    stopCharge: "Arrêter la charge",
    terminateTimer: "Arrêter la charge",
    overcharging: "SURCHARGE",
    done: "TERMINÉ",
    condition: "État de la pile",
    newBattery: "Neuve",
    usedBattery: "Usagée",
    priorUsage: "Durée d'utilisation antérieure",
    months: "Mois",
    years: "Ans",
    targetChargeMode: "Mode de charge cible",
    fullCharge100: "Charge complète (Cible 100%)",
    halfCharge50: "Demi-charge (Mode stockage 50%)",
    sohTitle: "État de santé (SoH)",
    rulTitle: "Durée de vie utile restante (RUL)",
    chargeCycles: "Cycles de charge totaux",
    overchargeInstances: "Événements de surcharge",
    estRuntime: "Autonomie de fonctionnement estimée",
    heatLoss: "Indice de perte thermique et d'efficacité",
    healthTrend: "Analyse de la tendance de dégradation",
    backupRestoreTitle: "Sauvegarde et Restauration",
    backupRestoreDesc: "Exportez ou importez en toute sécurité vos profils, chargeurs et statistiques.",
    includeStats: "Inclure les statistiques et l'historique dans la sauvegarde",
    exportLocal: "Exporter la sauvegarde locale (.json)",
    importLocal: "Importer une sauvegarde locale",
    exportGDrive: "Exporter vers Google Drive",
    importGDrive: "Restaurer depuis Google Drive",
    exportICloud: "Exporter vers Apple iCloud",
    importICloud: "Restaurer depuis Apple iCloud",
    backupSuccess: "✨ Sauvegarde exportée avec succès !",
    restoreSuccess: "✨ Données restaurées avec succès depuis la sauvegarde !",
    backupError: "Erreur : schéma de sauvegarde invalide ou fichier corrompu.",
    alert50Title: "⚠️ Alerte santé de la pile (Capacité 50%)",
    alert50Desc: "La pile a atteint ~50% de sa capacité d'usine d'origine.",
    alert30Title: "🚨 Avertissement critique de pile (Capacité 30%)",
    alert30Desc: "Capacité de la pile critique (~30%). Remplacement recommandé.",
    donateTitle: "Aidez-nous à maintenir VoltGuard Pro en ligne",
    donateDesc: "Votre contribution volontaire soutient les frais de serveur. Donnez ce que vous voulez !",
    donateButton: "Soutenir via PayPal, Revolut ou Crypto",
    supportActiveUntil: "Statut de soutien actif jusqu'au :",
    emailLabel: "Adresse Email:",
    payWithPaypal: "Donner avec PayPal",
    payWithRevolut: "Donner avec Revolut",
    secureCheckout: "Passerelle de Don Sécurisée",
    paymentSuccess: "✨ Merci ! Don vérifié avec succès !",
    alarmSoundLabel: "Son de l'alarme de fin",
    notificationsLabel: "Notifications Push",
    enable: "Activer",
    disable: "Désactiver",
    btcWalletTitle: "Adresse Bitcoin (BTC)",
    usdtWalletTitle: "Adresse USDT (TRC20)",
    copied: "Copié !",
    errorChargerInUse: "Erreur : impossible de changer, modifier ou supprimer le chargeur actif lorsque des emplacements sont en charge.",
    errorProfileInUse: "Erreur : impossible de modifier ce profil pendant que sa pile est en charge.",
    errorProfileRequired: "Erreur : veuillez sélectionner un profil de pile ou remplir les champs.",
    errorBatteryExists: "Erreur : Une pile avec le même nom et les mêmes spécifications existe déjà.",
    errorChargerExists: "Erreur : Un chargeur avec le même nom et les mêmes spécifications existe déjà.",
    errorValidation: "Veuillez corriger les erreurs avant de soumettre.",
    errorIncompatibleBattery: "Erreur : la chimie, la taille ou la tension de la pile sélectionnée n’est pas compatible avec cet emplacement."
  },
  de: {
    title: "VoltGuard Pro",
    subtitle: "Intelligenter Lade- und Thermikmanager",
    dashboard: "Übersicht",
    statistics: "Statistiken",
    batteryProfiles: "Batterieprofile",
    chargers: "Ladegeräte",
    safety: "Sicherheit",
    history: "Verlauf",
    contactUs: "Kontakt",
    settings: "Einstellungen",
    activeCharger: "Aktives Ladegerät:",
    addSlot: "Slot Hinzufügen",
    noSlotsTitle: "Keine aktiven Ladeslots",
    noSlotsDesc: "Fügen Sie ein Profil hinzu, um die Ladezeit zu schätzen. Die App überwacht oder steuert weder Akku noch Ladegerät direkt; beaufsichtigen Sie den Ladevorgang und beachten Sie die Herstellerangaben.",
    insertFirst: "Ersten Slot einfügen",
    timeRemaining: "Verbleibende Zeit",
    timeExceeded: "Zeit überschritten",
    targetTime: "Ziel-Ladezeit",
    progress: "Fortschritt",
    pause: "Pause",
    resume: "Fortsetzen",
    stopCharge: "Ladevorgang stoppen",
    terminateTimer: "Ladevorgang stoppen",
    overcharging: "ÜBERLADUNG",
    done: "FERTIG",
    condition: "Batteriezustand",
    newBattery: "Neu",
    usedBattery: "Gebraucht",
    priorUsage: "Bisherige Nutzungsdauer",
    months: "Monate",
    years: "Jahre",
    targetChargeMode: "Ladeziel-Modus",
    fullCharge100: "Vollladung (100% Ziel)",
    halfCharge50: "Teilladung (50% Storage-Modus)",
    sohTitle: "Gesundheitszustand (SoH)",
    rulTitle: "Verbleibende Lebensdauer (RUL)",
    chargeCycles: "Ladezyklen gesamt",
    overchargeInstances: "Überladungsereignisse",
    estRuntime: "Geschätzte Betriebslaufzeit",
    healthTrend: "Degradations-Trendanalyse",
    backupRestoreTitle: "Datensicherung & Wiederherstellung",
    backupRestoreDesc: "Exportieren oder importieren Sie Ihre Batterieprofile, Ladegeräte und Statistiken sicher.",
    includeStats: "Statistiken & Verlauf in Backup einbeziehen",
    exportLocal: "Lokales Backup exportieren (.json)",
    importLocal: "Lokales Backup importieren",
    exportGDrive: "In Google Drive exportieren",
    importGDrive: "Aus Google Drive wiederherstellen",
    exportICloud: "In Apple iCloud exportieren",
    importICloud: "Aus Apple iCloud wiederherstellen",
    backupSuccess: "✨ Backup erfolgreich exportiert!",
    restoreSuccess: "✨ Daten erfolgreich aus Backup wiederhergestellt!",
    backupError: "Fehler: Ungültiges Backup-Schema oder beschädigte Datei.",
    alert50Title: "⚠️ Batteriezustand-Warnung (50% Kapazität)",
    alert50Desc: "Der Akku hat durch Verschleiß ~50% der Ursprungskapazität erreicht.",
    alert30Title: "🚨 Kritische Batteriewarnung (30% Kapazität)",
    alert30Desc: "Akkukapazität kritisch niedrig (~30%). Sofortiger Austausch empfohlen.",
    donateTitle: "Helfen Sie uns, VoltGuard Pro online zu halten",
    donateDesc: "Ihr freiwilliger Beitrag unterstützt die Serverwartung. Spenden Sie nach Wunsch!",
    donateButton: "Spenden via PayPal, Revolut oder Crypto",
    supportActiveUntil: "Unterstützer-Status aktiv bis:",
    emailLabel: "E-Mail-Adresse:",
    payWithPaypal: "Mit PayPal spenden",
    payWithRevolut: "Mit Revolut spenden",
    secureCheckout: "Sicheres Spenden-Gateway",
    paymentSuccess: "✨ Vielen Dank! Spende erfolgreich verifiziert!",
    alarmSoundLabel: "Alarmton bei Ladeende",
    notificationsLabel: "Push-Benachrichtigungen",
    enable: "Aktivieren",
    disable: "Deaktivieren",
    btcWalletTitle: "Bitcoin (BTC) Wallet-Adresse",
    usdtWalletTitle: "USDT (TRC20) Wallet-Adresse",
    copied: "Kopiert!",
    errorChargerInUse: "Fehler: Das aktive Ladegerät kann während des aktiven Ladevorgangs nicht gewechselt, bearbeitet oder gelöscht werden.",
    errorProfileInUse: "Fehler: Dieses Profil kann während des aktiven Ladevorgangs nicht bearbeitet oder gelöscht werden.",
    errorProfileRequired: "Fehler: Bitte wählen Sie ein Batterieprofil oder füllen Sie die Pflichtfelder aus.",
    errorBatteryExists: "Fehler: Ein Akku mit demselben Namen und denselben Spezifikationen existiert bereits.",
    errorChargerExists: "Fehler: Ein Ladegerät mit demselben Namen und denselben Spezifikationen existiert bereits.",
    errorValidation: "Bitte korrigieren Sie die Fehler.",
    errorIncompatibleBattery: "Fehler: Chemie, Größe oder Spannung des ausgewählten Akkus sind mit diesem Ladeslot nicht kompatibel."
  },
  ar: {
    title: "VoltGuard Pro",
    subtitle: "مدير شحن البطارية والأمان الذكي",
    dashboard: "لوحة التحكم",
    statistics: "الإحصائيات والصحة",
    batteryProfiles: "ملفات البطارية",
    chargers: "الشواحن",
    safety: "الأمان",
    history: "السجل",
    contactUs: "اتصل بنا",
    settings: "الإعدادات",
    activeCharger: "الشاحن النشط:",
    addSlot: "إضافة فتحة",
    noSlotsTitle: "لا توجد فتحات شحن نشطة",
    noSlotsDesc: "أضف ملفاً لتقدير وقت الشحن. لا يراقب التطبيق البطارية أو الشاحن أو يتحكم بهما مباشرة؛ راقب الشحن واتبع تعليمات الشركة المصنّعة.",
    insertFirst: "إضافة أول بطارية",
    timeRemaining: "الوقت المتبقي",
    timeExceeded: "الوقت المنقضي",
    targetTime: "وقت الشحن المستهدف",
    progress: "التقدم",
    pause: "إيقاف مؤقت",
    resume: "استئناف",
    stopCharge: "إيقاف الشحن",
    terminateTimer: "إيقاف الشحن",
    overcharging: "الشحن الزائد",
    done: "تم",
    condition: "حالة البطارية",
    newBattery: "جديدة",
    usedBattery: "مستعملة",
    priorUsage: "مدة الاستخدام السابقة",
    months: "أشهر",
    years: "سنوات",
    targetChargeMode: "وضع هدف الشحن",
    fullCharge100: "شحن كامل (هدف 100%)",
    halfCharge50: "نصف شحن (وضع تخزين 50%)",
    sohTitle: "حالة الصحة (SoH)",
    rulTitle: "العمر المتبقي (RUL)",
    chargeCycles: "دورات الشحن الإجمالية",
    overchargeInstances: "حالات الشحن الزائد",
    estRuntime: "وقت التشغيل المقدر",
    heatLoss: "مؤشر الفقد الحراري والكفاءة",
    healthTrend: "تحليل اتجاه تدهور السعة",
    backupRestoreTitle: "النسخ الاحتياطي والاستعادة",
    backupRestoreDesc: "تصدير أو استيراد ملفات تعريف البطارية والشواحن والإحصائيات الخاصة بك بأمان.",
    includeStats: "تضمين الإحصائيات وسجل السجل في النسخة الاحتياطية",
    exportLocal: "تصدير نسخة احتياطية محلية (.json)",
    importLocal: "استيراد نسخة احتياطية محلية",
    exportGDrive: "التصدير إلى Google Drive",
    importGDrive: "الاستعادة من Google Drive",
    exportICloud: "التصدير إلى Apple iCloud",
    importICloud: "الاستعادة من Apple iCloud",
    backupSuccess: "✨ تم تصدير النسخة الاحتياطية بنجاح!",
    restoreSuccess: "✨ تمت استعادة البيانات بنجاح من النسخة الاحتياطية!",
    backupError: "خطأ: مخطط النسخ الاحتياطي غير صالح أو الملف التالف.",
    alert50Title: "⚠️ تنبيه صحة البطارية (سعة 50%)",
    alert50Desc: "وصلت سعة البطارية إلى ~50% من السعة الأصلية للمصنع بسبب الاستهلاك.",
    alert30Title: "🚨 تحذير حرج للبطارية (سعة 30%)",
    alert30Desc: "سعة البطارية منخفضة جداً (~30%). يوصى بالاستبدال الفوري.",
    donateTitle: "ساهم في استمرار تشغيل وتطوير VoltGuard Pro",
    donateDesc: "مساهمتك الطوعية تدعم صيانة الخوادم. تبرع بالمبلغ الذي تناسبك!",
    donateButton: "الدعم عبر PayPal أو Revolut أو العملات الرقمية",
    supportActiveUntil: "حالة الداعم نشطة حتى:",
    emailLabel: "البريد الإلكتروني:",
    payWithPaypal: "التبرع عبر PayPal",
    payWithRevolut: "التبرع عبر Revolut",
    secureCheckout: "بوابة التبرع الآمنة",
    paymentSuccess: "✨ شكراً لك! تم التحقق بنجاح!",
    alarmSoundLabel: "صوت تنبيه اكتمال الشحن",
    notificationsLabel: "إشعارات الدفع",
    enable: "تمكين",
    disable: "تعطيل",
    btcWalletTitle: "عنوان محفظة بيتكوين (BTC)",
    usdtWalletTitle: "عنوان محفظة تتر (USDT)",
    copied: "تم النسخ!",
    errorChargerInUse: "خطأ: لا يمكن تغيير أو تعديل أو حذف الشاحن النشط أثناء شحن البطاريات.",
    errorProfileInUse: "خطأ: لا يمكن تعديل أو حذف هذا الملف الشخصي أثناء شحن بطاريته.",
    errorProfileRequired: "خطأ: يرجى اختيار ملف بطارية أو ملء حقول المطلوبة.",
    errorBatteryExists: "خطأ: توجد بطارية بنفس الاسم والمواصفات بالفعل.",
    errorChargerExists: "خطأ: يوجد شاحن بنفس الاسم والمواصفات بالفعل.",
    errorValidation: "يرجى تصحيح أخطاء النموذج.",
    errorIncompatibleBattery: "خطأ: كيمياء البطارية المحددة أو حجمها أو جهدها غير متوافق مع فتحة الشاحن هذه."
  },
  ja: {
    title: "VoltGuard Pro",
    subtitle: "スマートバッテリー充電＆安全マネージャー",
    dashboard: "ダッシュボード",
    statistics: "統計・健康状態",
    batteryProfiles: "バッテリープロファイル",
    chargers: "充電器プロファイル",
    safety: "安全性",
    history: "履歴",
    contactUs: "お問い合わせ",
    settings: "設定",
    activeCharger: "アクティブ充電器：",
    addSlot: "スロット追加",
    noSlotsTitle: "アクティブなスロットがありません",
    noSlotsDesc: "充電時間を推定するには電池プロファイルを追加してください。アプリは電池や充電器を直接監視・制御しません。充電を監視し、メーカーの指示に従ってください。",
    insertFirst: "最初のバッテリーを追加",
    timeRemaining: "残り時間",
    timeExceeded: "超過時間",
    targetTime: "目標時間",
    progress: "進捗",
    pause: "一時停止",
    resume: "再開",
    stopCharge: "充電停止",
    terminateTimer: "充電停止",
    overcharging: "過充電",
    done: "完了",
    condition: "バッテリー状態",
    newBattery: "新品",
    usedBattery: "中古",
    priorUsage: "使用期間",
    months: "ヶ月",
    years: "年",
    targetChargeMode: "目標充電モード",
    fullCharge100: "フル充電 (100% 目標)",
    halfCharge50: "ハーフ充電 (50% ストレージモード)",
    sohTitle: "健康度 (SoH)",
    rulTitle: "残存寿命 (RUL)",
    chargeCycles: "総充電サイクル数",
    overchargeInstances: "過充電回数",
    estRuntime: "推定稼働時間",
    heatLoss: "効率・熱損失インデックス",
    healthTrend: "劣化傾向分析",
    backupRestoreTitle: "データのバックアップと復元",
    backupRestoreDesc: "バッテリープロファイル、充電器、および統計ログを安全にエクスポートまたはインポートします。",
    includeStats: "バックアップに統計と履歴ログを含める",
    exportLocal: "ローカルバックアップのエクスポート (.json)",
    importLocal: "ローカルバックアップのインポート",
    exportGDrive: "Google ドライブへエクスポート",
    importGDrive: "Google ドライブから復元",
    exportICloud: "Apple iCloudへエクスポート",
    importICloud: "Apple iCloudから復元",
    backupSuccess: "✨ バックアップのエクスポートに成功しました！",
    restoreSuccess: "✨ バックアップからデータを正常に復元しました！",
    backupError: "エラー: バックアップのスキーマが無効であるか、ファイルが破損しています。",
    alert50Title: "⚠️ バッテリー健康警告 (容量50%)",
    alert50Desc: "経年劣化により、バッテリー容量が工場出荷時の ~50% に低下しました。",
    alert30Title: "🚨 バッテリー重大警告 (容量30%)",
    alert30Desc: "バッテリー容量が非常に低下しています (~30%)。速やかな交換をお勧めします。",
    donateTitle: "VoltGuard Pro の運営継続をご支援ください",
    donateDesc: "皆様からの自発的なご寄付がサーバー維持を支えます。お好きな金額をご寄付ください！",
    donateButton: "PayPal・Revolut・暗号資産で支援する",
    supportActiveUntil: "サポーター有効期限：",
    emailLabel: "メールアドレス：",
    payWithPaypal: "PayPalで寄付",
    payWithRevolut: "Revolutで寄付",
    secureCheckout: "安全な支援決済ゲートウェイ",
    paymentSuccess: "✨ ありがとうございます！",
    alarmSoundLabel: "完了アラーム音",
    notificationsLabel: "プッシュ通知",
    enable: "有効",
    disable: "無効",
    btcWalletTitle: "ビットコイン (BTC) ウォレット",
    usdtWalletTitle: "テザー (USDT) ウォレット",
    copied: "コピーしました！",
    errorChargerInUse: "エラー: 充電中のスロットがあるため、アクティブな充電器の変更、編集、削除はできません。",
    errorProfileInUse: "エラー: このバッテリーの充電中はプロファイルの編集や削除を行えません。",
    errorProfileRequired: "エラー: バッテリープロファイルを選択するか、必須項目を入力してください。",
    errorBatteryExists: "エラー: 同じ名前と仕様のバッテリーが既に存在します。",
    errorChargerExists: "エラー: 同じ名前と仕様の充電器が既に存在します。",
    errorValidation: "エラーを修正してください。",
    errorIncompatibleBattery: "エラー: 選択した電池の化学組成、サイズ、または電圧はこの充電スロットと互換性がありません。"
  },
  pt: {
    title: "VoltGuard Pro",
    subtitle: "Gerenciador Inteligente de Carga e Bateria",
    dashboard: "Painel",
    statistics: "Estatísticas",
    batteryProfiles: "Perfis de Bateria",
    chargers: "Carregadores",
    safety: "Segurança",
    history: "Histórico",
    contactUs: "Contato",
    settings: "Configurações",
    activeCharger: "Carregador Ativo:",
    addSlot: "Adicionar Slot",
    noSlotsTitle: "Nenhum slot de carga ativo",
    noSlotsDesc: "Adicione um perfil para estimar o tempo de carga. O aplicativo não monitora nem controla diretamente a bateria ou o carregador; supervisione a carga e siga as instruções do fabricante.",
    insertFirst: "Inserir primeira bateria",
    timeRemaining: "Tempo Restante",
    timeExceeded: "Tempo Excedido",
    targetTime: "Tempo Alvo",
    progress: "Progresso",
    pause: "Pausar",
    resume: "Retomar",
    stopCharge: "Parar Carga",
    terminateTimer: "Parar Carga",
    overcharging: "SOBRECARREGANDO",
    done: "CONCLUÍDO",
    condition: "Condição da Bateria",
    newBattery: "Nova",
    usedBattery: "Usada",
    priorUsage: "Tempo de Uso Anterior",
    months: "Meses",
    years: "Anos",
    targetChargeMode: "Modo de Carga Alvo",
    fullCharge100: "Carga Completa (Alvo 100%)",
    halfCharge50: "Meia Carga (Modo Armazenamento 50%)",
    sohTitle: "Estado de Saúde (SoH)",
    rulTitle: "Vida Útil Restante (RUL)",
    chargeCycles: "Ciclos de Carga Totais",
    overchargeInstances: "Eventos de Sobrecarga",
    estRuntime: "Autonomia de Operação Estimada",
    heatLoss: "Índice de Perda Térmica e Eficiencia",
    healthTrend: "Análise de Tendência de Degradação",
    backupRestoreTitle: "Backup e Restauração de Dados",
    backupRestoreDesc: "Exporte ou importe com segurança seus perfis de bateria, carregadores e registros estatísticos.",
    includeStats: "Incluir estatísticas e histórico no backup",
    exportLocal: "Exportar Backup Local (.json)",
    importLocal: "Importar Backup Local",
    exportGDrive: "Exportar para o Google Drive",
    importGDrive: "Restaurar do Google Drive",
    exportICloud: "Exportar para o Apple iCloud",
    importICloud: "Restaurar do Apple iCloud",
    backupSuccess: "✨ Backup exportado com sucesso!",
    restoreSuccess: "✨ Dados restaurados com sucesso do backup!",
    backupError: "Erro: Esquema de backup inválido ou arquivo corrompido.",
    alert50Title: "⚠️ Alerta de Saúde da Bateria (Capacidade 50%)",
    alert50Desc: "A bateria atingiu ~50% da capacidade original de fábrica devido ao desgaste.",
    alert30Title: "🚨 Aviso Crítico da Bateria (Capacidade 30%)",
    alert30Desc: "Capacidade criticamente baixa (~30%). Substituição imediata recomendada.",
    donateTitle: "Ajude-nos a manter o VoltGuard Pro online",
    donateDesc: "Sua contribuição voluntária apoia a manutenção de servidores. Doe quanto quiser!",
    donateButton: "Apoiar via PayPal, Revolut ou Cripto",
    supportActiveUntil: "Status de apoiador ativo até:",
    emailLabel: "Endereço de E-mail:",
    payWithPaypal: "Doar com PayPal",
    payWithRevolut: "Doar com Revolut",
    secureCheckout: "Gateway de Doação Seguro",
    paymentSuccess: "✨ Obrigado! Doação verificada com sucesso!",
    alarmSoundLabel: "Som de Alarme de Conclusão",
    notificationsLabel: "Notificações Push",
    enable: "Ativar",
    disable: "Desativar",
    btcWalletTitle: "Endereço da Carteira Bitcoin (BTC)",
    usdtWalletTitle: "Endereço da Carteira USDT (TRC20)",
    copied: "Copiado!",
    errorChargerInUse: "Erro: não é possível alterar, editar ou excluir o carregador ativo enquanto houver slots carregando.",
    errorProfileInUse: "Erro: não é possível editar ou excluir este perfil enquanto sua bateria estiver carregando.",
    errorProfileRequired: "Erro: selecione un perfil de bateria ou preencha os campos obrigatórios.",
    errorBatteryExists: "Erro: Já existe uma bateria com o mesmo nome e especificações.",
    errorChargerExists: "Erro: Já existe um carregador com o mesmo nome e especificações.",
    errorValidation: "Corrija os erros antes de enviar.",
    errorIncompatibleBattery: "Erro: a química, o tamanho ou a tensão da bateria selecionada não são compatíveis com este slot."
  },
  ru: {
    title: "VoltGuard Pro",
    subtitle: "Умный менеджер зарядки и безопасности",
    dashboard: "Главная",
    statistics: "Статистика и здоровье",
    batteryProfiles: "Профили батарей",
    chargers: "ЗУ",
    safety: "Безопасность",
    history: "История",
    contactUs: "Контакты",
    settings: "Настройки",
    activeCharger: "Активное ЗУ:",
    addSlot: "Добавить слот",
    noSlotsTitle: "Нет активных слотов зарядки",
    noSlotsDesc: "Добавьте профиль батареи для оценки времени зарядки. Приложение не контролирует батарею или зарядное устройство напрямую; следите за зарядкой и соблюдайте инструкции производителя.",
    insertFirst: "Добавить батарею",
    timeRemaining: "Осталось времени",
    timeExceeded: "Время превышено",
    targetTime: "Целевое время",
    progress: "Прогресс",
    pause: "Пауза",
    resume: "Продолжить",
    stopCharge: "Остановить зарядку",
    terminateTimer: "Остановить зарядку",
    overcharging: "ПЕРЕЗАРЯД",
    done: "ГОТОВО",
    condition: "Состояние батареи",
    newBattery: "Новая",
    usedBattery: "Б/У",
    priorUsage: "Срок прежнего использования",
    months: "Месяцев",
    years: "Лет",
    targetChargeMode: "Целевой режим заряда",
    fullCharge100: "Полный заряд (Цель 100%)",
    halfCharge50: "Полузаряд (Режим хранения 50%)",
    sohTitle: "Состояние здоровья (SoH)",
    rulTitle: "Оставшийся срок службы (RUL)",
    chargeCycles: "Всего циклов заряда",
    overchargeInstances: "Случаи перезаряда",
    estRuntime: "Расчетное время работы",
    heatLoss: "Индекс тепловых потерь и КПД",
    healthTrend: "Анализ динамики износа",
    backupRestoreTitle: "Резервное копирование и восстановление",
    backupRestoreDesc: "Экспортируйте или импортируйте профили батарей, зарядные устройства и статистику.",
    includeStats: "Включить статистику и историю в резервную копию",
    exportLocal: "Экспорт локального бэкапа (.json)",
    importLocal: "Импорт локального бэкапа",
    exportGDrive: "Экспорт в Google Диск",
    importGDrive: "Восстановление из Google Диска",
    exportICloud: "Экспорт в Apple iCloud",
    importICloud: "Восстановление из Apple iCloud",
    backupSuccess: "✨ Резервная копия успешно экспортирована!",
    restoreSuccess: "✨ Данные успешно восстановлены из резервной копии!",
    backupError: "Ошибка: неверная схема бэкапа или поврежденный файл.",
    alert50Title: "⚠️ Предупреждение о здоровье (50% емкости)",
    alert50Desc: "Емкость батареи снизилась примерно до 50% от заводской из-за износа.",
    alert30Title: "🚨 Критическое предупреждение (30% емкости)",
    alert30Desc: "Емкость батареи критически мала (~30%). Рекомендуется немедленная замена.",
    donateTitle: "Помогите нам поддерживать VoltGuard Pro онлайн",
    donateDesc: "Ваш добровольный вклад идет на оплату серверов. Пожертвуйте любую сумму!",
    donateButton: "Поддержать через PayPal, Revolut или Крипто",
    supportActiveUntil: "Статус спонсора активен до:",
    emailLabel: "Электронная почта:",
    payWithPaypal: "Через PayPal",
    payWithRevolut: "Через Revolut",
    secureCheckout: "Безопасный шлюз пожертвований",
    paymentSuccess: "✨ Спасибо! Статус спонсора подтвержден!",
    alarmSoundLabel: "Звук сигнала завершения",
    notificationsLabel: "Push-уведомления",
    enable: "Вкл",
    disable: "Выкл",
    btcWalletTitle: "Адрес Bitcoin (BTC) кошелька",
    usdtWalletTitle: "Адрес USDT (TRC20) кошелька",
    copied: "Скопировано!",
    errorChargerInUse: "Ошибка: нельзя менять, изменять или удалять активное ЗУ, пока слоты находятся в процессе зарядки.",
    errorProfileInUse: "Ошибка: нельзя изменять или удалять этот профиль, пока его батарея заряжается.",
    errorProfileRequired: "Ошибка: выберите профиль батареи или заполните обязательные поля.",
    errorBatteryExists: "Ошибка: Батарея с таким же именем и характеристиками уже существует.",
    errorChargerExists: "Ошибка: Зарядное устройство с таким же именем и характеристиками уже существует.",
    errorValidation: "Пожалуйста, исправьте ошибки валидации.",
    errorIncompatibleBattery: "Ошибка: химический состав, размер или напряжение выбранного аккумулятора несовместимы с этим слотом."
  }
};

// --- ALARM SOUND LIST OPTIONS ---
const ALARM_SOUND_OPTIONS = [
  { id: 'chime', name: '✨ Classic Synth Chime', frequencies: [523.25, 659.25, 783.99, 1046.50] },
  { id: 'radar', name: '📡 Digital Radar Pulse', frequencies: [880, 440, 880, 440] },
  { id: 'bell', name: '🔔 Gentle Battery Bell', frequencies: [659.25, 523.25, 783.99, 1318.51] },
  { id: 'urgent', name: '⚡ Urgent Voltage Alert', frequencies: [987.77, 932.33, 880, 830.61] }
];

const APP_COPY = {
  en: {
    chargerCompatible: 'Compatible with this charger',
    selectProfile: 'Select a saved battery profile',
    chooseProfile: '-- Choose a compatible battery profile --',
    slotLabel: 'Battery label',
    chemistry: 'Battery chemistry',
    capacity: 'Capacity (mAh)',
    initialCharge: 'Initial charge (%)',
    voltage: 'Nominal voltage (V)',
    batterySize: 'Battery size',
    cancel: 'Cancel',
    startTimer: 'Start estimate',
    safetyNotice: 'This app only estimates charge time. It cannot measure battery charge or temperature, control or disconnect a charger, or guarantee an alarm. The timer may pause when this app is backgrounded or the device sleeps. Follow the battery and charger manufacturers’ instructions and supervise charging.',
    stopTimer: 'Stop timer',
    dismiss: 'Dismiss',
    completed: 'Estimate reached',
    stopped: 'Stopped',
    notificationHeading: 'Completion notifications',
    notificationDescription: 'Optional device notifications when an estimated timer reaches its target. This is not remote push delivery, and background timers may be paused by your device.',
    notificationUnavailable: 'Notifications are not available in this browser or app. The timer and sound alert can still be used while this screen is open.',
    completedTimerEstimates: 'Completed timer estimates',
    stoppedTimerEstimates: 'Stopped timer sessions',
    modeledHealth: 'Modeled battery health',
    modeledHealthDescription: 'Rough estimate based on entered battery age and completed timer estimates; not measured by the device.',
    runtimeEstimateDescription: 'Rough runtime assumes a 500mA load; actual runtime varies with device use and battery condition. It is not measured.',
    profilesStoredDescription: 'Saved profile count only; this app receives no live battery telemetry.'
  },
  fa: {
    chargerCompatible: 'سازگار با این شارژر', selectProfile: 'انتخاب پروفایل باتری ذخیره‌شده', chooseProfile: '-- انتخاب پروفایل سازگار --',
    slotLabel: 'نام باتری', chemistry: 'شیمی باتری', capacity: 'ظرفیت (mAh)', initialCharge: 'شارژ اولیه (%)', voltage: 'ولتاژ اسمی (V)', batterySize: 'اندازه باتری',
    cancel: 'لغو', startTimer: 'شروع برآورد', stopTimer: 'توقف زمان‌سنج', dismiss: 'بستن', completed: 'رسیدن به زمان تخمینی', stopped: 'متوقف‌شده',
    safetyNotice: 'این برنامه فقط زمان شارژ را تخمین می‌زند. میزان شارژ یا دمای باتری را اندازه‌گیری نمی‌کند، شارژر را کنترل یا قطع نمی‌کند و عملکرد هشدار را تضمین نمی‌کند. هنگام رفتن برنامه به پس‌زمینه یا خواب دستگاه، زمان‌سنج ممکن است متوقف شود. دستورالعمل سازنده باتری و شارژر را دنبال کنید و شارژ را زیر نظر داشته باشید.',
    notificationHeading: 'اعلان‌های پایان زمان‌سنج', notificationDescription: 'اعلان اختیاری دستگاه هنگام رسیدن زمان‌سنج تخمینی به هدف. این اعلان پوش از راه دور نیست و دستگاه ممکن است زمان‌سنج پس‌زمینه را متوقف کند.',
    notificationUnavailable: 'اعلان در این مرورگر یا برنامه در دسترس نیست. تا زمانی که این صفحه باز است، زمان‌سنج و هشدار صوتی قابل استفاده‌اند.',
    completedTimerEstimates: 'برآوردهای تکمیل‌شده زمان‌سنج', stoppedTimerEstimates: 'جلسه‌های متوقف‌شده زمان‌سنج',
    modeledHealth: 'سلامت مدل‌سازی‌شده باتری', modeledHealthDescription: 'برآورد تقریبی بر اساس عمر واردشده باتری و زمان‌سنج‌های تکمیل‌شده؛ دستگاه آن را اندازه‌گیری نمی‌کند.',
    runtimeEstimateDescription: 'برآورد زمان کار بر پایه بار ۵۰۰ میلی‌آمپر است؛ زمان واقعی به مصرف دستگاه و وضعیت باتری بستگی دارد و اندازه‌گیری نمی‌شود.',
    profilesStoredDescription: 'فقط تعداد پروفایل‌های ذخیره‌شده است؛ برنامه داده زنده‌ای از باتری دریافت نمی‌کند.'
  },
  it: {
    chargerCompatible: 'Compatibile con questo caricatore', selectProfile: 'Seleziona un profilo batteria salvato', chooseProfile: '-- Scegli un profilo compatibile --',
    slotLabel: 'Nome batteria', chemistry: 'Chimica della batteria', capacity: 'Capacità (mAh)', initialCharge: 'Carica iniziale (%)', voltage: 'Tensione nominale (V)', batterySize: 'Formato batteria',
    cancel: 'Annulla', startTimer: 'Avvia stima', stopTimer: 'Ferma timer', dismiss: 'Chiudi', completed: 'Stima raggiunta', stopped: 'Interrotto',
    safetyNotice: 'Questa app stima solo il tempo di ricarica. Non misura carica o temperatura, non controlla né scollega il caricatore e non garantisce un allarme. Il timer può fermarsi se l’app è in background o il dispositivo è in sospensione. Segui le istruzioni dei produttori e sorveglia la ricarica.',
    notificationHeading: 'Notifiche di completamento', notificationDescription: 'Notifiche facoltative del dispositivo al raggiungimento del tempo stimato. Non è un servizio push remoto; il dispositivo può sospendere i timer in background.',
    notificationUnavailable: 'Le notifiche non sono disponibili in questo browser o app. Timer e avviso audio funzionano mentre questa schermata è aperta.',
    completedTimerEstimates: 'Stime timer completate', stoppedTimerEstimates: 'Sessioni timer interrotte',
    modeledHealth: 'Salute batteria modellata', modeledHealthDescription: 'Stima approssimativa basata sull’età inserita e sulle stime completate; non è misurata dal dispositivo.',
    runtimeEstimateDescription: 'La stima presume un carico di 500 mA; l’autonomia reale varia in base all’uso e alla batteria e non viene misurata.',
    profilesStoredDescription: 'Solo il numero di profili salvati; l’app non riceve dati in tempo reale dalla batteria.'
  },
  es: {
    chargerCompatible: 'Compatible con este cargador', selectProfile: 'Seleccionar perfil de batería guardado', chooseProfile: '-- Elegir perfil compatible --',
    slotLabel: 'Nombre de la batería', chemistry: 'Química de la batería', capacity: 'Capacidad (mAh)', initialCharge: 'Carga inicial (%)', voltage: 'Voltaje nominal (V)', batterySize: 'Tamaño de batería',
    cancel: 'Cancelar', startTimer: 'Iniciar estimación', stopTimer: 'Detener temporizador', dismiss: 'Cerrar', completed: 'Estimación alcanzada', stopped: 'Detenido',
    safetyNotice: 'Esta aplicación solo estima el tiempo de carga. No mide la carga ni la temperatura, no controla ni desconecta el cargador y no garantiza una alarma. El temporizador puede pausarse si la aplicación pasa a segundo plano o el dispositivo duerme. Sigue las instrucciones del fabricante y supervisa la carga.',
    notificationHeading: 'Notificaciones de finalización', notificationDescription: 'Notificaciones opcionales del dispositivo al alcanzar el objetivo estimado. No son notificaciones push remotas y el dispositivo puede pausar temporizadores en segundo plano.',
    notificationUnavailable: 'Las notificaciones no están disponibles en este navegador o aplicación. El temporizador y la alarma de sonido funcionan con esta pantalla abierta.',
    completedTimerEstimates: 'Estimaciones de temporizador completadas', stoppedTimerEstimates: 'Sesiones de temporizador detenidas',
    modeledHealth: 'Salud estimada por modelo', modeledHealthDescription: 'Estimación aproximada basada en la antigüedad indicada y las estimaciones completadas; el dispositivo no la mide.',
    runtimeEstimateDescription: 'La estimación supone una carga de 500 mA; la autonomía real varía según el uso y la batería y no se mide.',
    profilesStoredDescription: 'Solo cuenta perfiles guardados; la aplicación no recibe datos de batería en tiempo real.'
  },
  zh: {
    chargerCompatible: '与此充电器兼容', selectProfile: '选择已保存的电池配置', chooseProfile: '-- 选择兼容的电池配置 --',
    slotLabel: '电池名称', chemistry: '电池化学类型', capacity: '容量 (mAh)', initialCharge: '初始电量 (%)', voltage: '标称电压 (V)', batterySize: '电池尺寸',
    cancel: '取消', startTimer: '开始估算', stopTimer: '停止计时器', dismiss: '关闭', completed: '已达到估算时间', stopped: '已停止',
    safetyNotice: '此应用仅估算充电时间，不会测量电池电量或温度，也不能控制或断开充电器，且不保证闹钟一定响起。应用进入后台或设备休眠时，计时器可能暂停。请遵循电池和充电器制造商的说明并监护充电过程。',
    notificationHeading: '完成通知', notificationDescription: '估算计时达到目标时发送可选的设备通知。这不是远程推送，设备可能会暂停后台计时器。',
    notificationUnavailable: '此浏览器或应用不支持通知。保持此页面打开时仍可使用计时器和声音提醒。',
    completedTimerEstimates: '已完成的计时估算', stoppedTimerEstimates: '已停止的计时会话',
    modeledHealth: '模型估算的电池健康度', modeledHealthDescription: '根据输入的电池使用时间和已完成计时估算得出，并非设备测量值。',
    runtimeEstimateDescription: '续航估算按 500mA 负载计算；实际续航因设备使用和电池状况而异，且不会被测量。',
    profilesStoredDescription: '仅显示已保存的配置数量；应用不会接收实时电池数据。'
  },
  fr: {
    chargerCompatible: 'Compatible avec ce chargeur', selectProfile: 'Sélectionner un profil de batterie enregistré', chooseProfile: '-- Choisir un profil compatible --',
    slotLabel: 'Nom de la batterie', chemistry: 'Chimie de la batterie', capacity: 'Capacité (mAh)', initialCharge: 'Charge initiale (%)', voltage: 'Tension nominale (V)', batterySize: 'Format de la batterie',
    cancel: 'Annuler', startTimer: 'Lancer l’estimation', stopTimer: 'Arrêter le minuteur', dismiss: 'Fermer', completed: 'Estimation atteinte', stopped: 'Arrêté',
    safetyNotice: 'Cette application estime uniquement le temps de charge. Elle ne mesure ni la charge ni la température, ne contrôle ni ne débranche le chargeur et ne garantit pas une alarme. Le minuteur peut s’interrompre en arrière-plan ou lorsque l’appareil se met en veille. Suivez les instructions du fabricant et surveillez la charge.',
    notificationHeading: 'Notifications de fin', notificationDescription: 'Notifications facultatives lorsque le minuteur estimé atteint son objectif. Il ne s’agit pas de notifications push à distance ; l’appareil peut suspendre les minuteurs en arrière-plan.',
    notificationUnavailable: 'Les notifications ne sont pas disponibles dans ce navigateur ou cette application. Le minuteur et l’alarme audio restent utilisables lorsque cet écran est ouvert.',
    completedTimerEstimates: 'Estimations de minuterie terminées', stoppedTimerEstimates: 'Sessions de minuterie arrêtées',
    modeledHealth: 'État de santé modélisé', modeledHealthDescription: 'Estimation approximative fondée sur l’âge saisi et les estimations terminées ; elle n’est pas mesurée par l’appareil.',
    runtimeEstimateDescription: 'L’estimation suppose une charge de 500 mA ; l’autonomie réelle varie selon l’utilisation et la batterie et n’est pas mesurée.',
    profilesStoredDescription: 'Nombre de profils enregistrés uniquement ; l’application ne reçoit aucune télémétrie de batterie.'
  },
  de: {
    chargerCompatible: 'Mit diesem Ladegerät kompatibel', selectProfile: 'Gespeichertes Batterieprofil auswählen', chooseProfile: '-- Kompatibles Profil auswählen --',
    slotLabel: 'Batteriebezeichnung', chemistry: 'Batteriechemie', capacity: 'Kapazität (mAh)', initialCharge: 'Anfangsladung (%)', voltage: 'Nennspannung (V)', batterySize: 'Batteriegröße',
    cancel: 'Abbrechen', startTimer: 'Schätzung starten', stopTimer: 'Timer stoppen', dismiss: 'Schließen', completed: 'Schätzwert erreicht', stopped: 'Gestoppt',
    safetyNotice: 'Diese App schätzt nur die Ladezeit. Sie misst weder Ladestand noch Temperatur, steuert oder trennt kein Ladegerät und garantiert keinen Alarm. Im Hintergrund oder im Ruhezustand kann der Timer pausieren. Beachten Sie die Herstellerangaben und beaufsichtigen Sie den Ladevorgang.',
    notificationHeading: 'Abschlussbenachrichtigungen', notificationDescription: 'Optionale Gerätebenachrichtigung beim Erreichen des geschätzten Ziels. Dies ist kein Remote-Push; das Gerät kann Hintergrund-Timer anhalten.',
    notificationUnavailable: 'Benachrichtigungen sind in diesem Browser oder dieser App nicht verfügbar. Timer und Signalton funktionieren bei geöffnetem Bildschirm.',
    completedTimerEstimates: 'Abgeschlossene Timer-Schätzungen', stoppedTimerEstimates: 'Gestoppte Timer-Sitzungen',
    modeledHealth: 'Modellierter Batteriezustand', modeledHealthDescription: 'Grobe Schätzung anhand des eingegebenen Batteriealters und abgeschlossener Timer-Schätzungen; nicht vom Gerät gemessen.',
    runtimeEstimateDescription: 'Die Schätzung nimmt eine Last von 500 mA an; die tatsächliche Laufzeit hängt von Nutzung und Akku ab und wird nicht gemessen.',
    profilesStoredDescription: 'Nur die Anzahl gespeicherter Profile; die App erhält keine Live-Batteriedaten.'
  },
  ar: {
    chargerCompatible: 'متوافق مع هذا الشاحن', selectProfile: 'اختر ملف بطارية محفوظاً', chooseProfile: '-- اختر ملفاً متوافقاً --',
    slotLabel: 'اسم البطارية', chemistry: 'تركيب البطارية الكيميائي', capacity: 'السعة (mAh)', initialCharge: 'الشحن الأولي (%)', voltage: 'الجهد الاسمي (V)', batterySize: 'حجم البطارية',
    cancel: 'إلغاء', startTimer: 'بدء التقدير', stopTimer: 'إيقاف المؤقت', dismiss: 'إغلاق', completed: 'تم بلوغ الوقت التقديري', stopped: 'متوقف',
    safetyNotice: 'يقدّر هذا التطبيق وقت الشحن فقط. لا يقيس شحن البطارية أو حرارتها، ولا يتحكم بالشاحن أو يفصله، ولا يضمن صدور التنبيه. قد يتوقف المؤقت عند تشغيل التطبيق في الخلفية أو دخول الجهاز في وضع السكون. اتبع تعليمات الشركة المصنّعة وراقب الشحن.',
    notificationHeading: 'إشعارات اكتمال المؤقت', notificationDescription: 'إشعارات اختيارية من الجهاز عند بلوغ المؤقت التقديري هدفه. هذه ليست إشعارات دفع عن بُعد، وقد يوقف الجهاز المؤقت في الخلفية.',
    notificationUnavailable: 'الإشعارات غير متاحة في هذا المتصفح أو التطبيق. يمكن استخدام المؤقت والتنبيه الصوتي عند بقاء هذه الشاشة مفتوحة.',
    completedTimerEstimates: 'تقديرات المؤقت المكتملة', stoppedTimerEstimates: 'جلسات المؤقت المتوقفة',
    modeledHealth: 'صحة البطارية المقدّرة بالنموذج', modeledHealthDescription: 'تقدير تقريبي حسب عمر البطارية المدخل وتقديرات المؤقت المكتملة؛ لا يقيسه الجهاز.',
    runtimeEstimateDescription: 'يفترض تقدير وقت التشغيل حملاً قدره ٥٠٠ mA؛ يختلف الوقت الفعلي حسب استخدام الجهاز وحالة البطارية ولا يتم قياسه.',
    profilesStoredDescription: 'عدد الملفات المحفوظة فقط؛ لا يتلقى التطبيق بيانات حية من البطارية.'
  },
  ja: {
    chargerCompatible: 'この充電器に対応', selectProfile: '保存済みの電池プロファイルを選択', chooseProfile: '-- 対応プロファイルを選択 --',
    slotLabel: '電池ラベル', chemistry: '電池の化学系', capacity: '容量 (mAh)', initialCharge: '初期充電率 (%)', voltage: '公称電圧 (V)', batterySize: '電池サイズ',
    cancel: 'キャンセル', startTimer: '時間を推定', stopTimer: 'タイマーを停止', dismiss: '閉じる', completed: '推定時間に到達', stopped: '停止',
    safetyNotice: 'このアプリは充電時間を推定するだけです。電池残量や温度の測定、充電器の制御・切断、アラームの保証はできません。アプリがバックグラウンドにある場合や端末がスリープすると、タイマーが停止することがあります。メーカーの指示に従い、充電中は監視してください。',
    notificationHeading: '完了通知', notificationDescription: '推定タイマーが目標に達した際の任意の端末通知です。リモートプッシュではなく、バックグラウンドタイマーは端末により停止される場合があります。',
    notificationUnavailable: 'このブラウザーまたはアプリでは通知を利用できません。この画面を開いている間はタイマーと音声アラームを使用できます。',
    completedTimerEstimates: '完了したタイマー推定', stoppedTimerEstimates: '停止したタイマーセッション',
    modeledHealth: 'モデルによる電池の健康度', modeledHealthDescription: '入力された使用期間と完了したタイマー推定に基づく概算であり、端末による測定値ではありません。',
    runtimeEstimateDescription: '500mA の負荷を想定した概算です。実際の稼働時間は端末の使用状況と電池の状態により異なり、測定値ではありません。',
    profilesStoredDescription: '保存済みプロファイル数のみです。アプリは電池のリアルタイムデータを受信しません。'
  },
  pt: {
    chargerCompatible: 'Compatível com este carregador', selectProfile: 'Selecionar perfil de bateria salvo', chooseProfile: '-- Escolha um perfil compatível --',
    slotLabel: 'Identificação da bateria', chemistry: 'Química da bateria', capacity: 'Capacidade (mAh)', initialCharge: 'Carga inicial (%)', voltage: 'Tensão nominal (V)', batterySize: 'Tamanho da bateria',
    cancel: 'Cancelar', startTimer: 'Iniciar estimativa', stopTimer: 'Parar temporizador', dismiss: 'Fechar', completed: 'Estimativa atingida', stopped: 'Parado',
    safetyNotice: 'Este aplicativo apenas estima o tempo de carga. Não mede carga ou temperatura, não controla nem desconecta o carregador e não garante um alarme. O temporizador pode pausar quando o aplicativo fica em segundo plano ou o dispositivo entra em repouso. Siga as instruções do fabricante e supervisione a carga.',
    notificationHeading: 'Notificações de conclusão', notificationDescription: 'Notificações opcionais do dispositivo quando o temporizador estimado atinge o objetivo. Não é envio push remoto e o dispositivo pode pausar temporizadores em segundo plano.',
    notificationUnavailable: 'As notificações não estão disponíveis neste navegador ou aplicativo. O temporizador e o alerta sonoro funcionam com esta tela aberta.',
    completedTimerEstimates: 'Estimativas de temporizador concluídas', stoppedTimerEstimates: 'Sessões de temporizador interrompidas',
    modeledHealth: 'Saúde estimada por modelo', modeledHealthDescription: 'Estimativa aproximada com base na idade informada e nas estimativas concluídas; não é medida pelo dispositivo.',
    runtimeEstimateDescription: 'A estimativa considera uma carga de 500 mA; a autonomia real varia conforme o uso e a bateria e não é medida.',
    profilesStoredDescription: 'Apenas a quantidade de perfis salvos; o aplicativo não recebe dados da bateria em tempo real.'
  },
  ru: {
    chargerCompatible: 'Совместимо с этим зарядным устройством', selectProfile: 'Выбрать сохранённый профиль батареи', chooseProfile: '-- Выберите совместимый профиль --',
    slotLabel: 'Название батареи', chemistry: 'Химический тип батареи', capacity: 'Ёмкость (мА·ч)', initialCharge: 'Начальный заряд (%)', voltage: 'Номинальное напряжение (В)', batterySize: 'Размер батареи',
    cancel: 'Отмена', startTimer: 'Начать оценку', stopTimer: 'Остановить таймер', dismiss: 'Закрыть', completed: 'Расчётное время достигнуто', stopped: 'Остановлено',
    safetyNotice: 'Приложение только оценивает время зарядки. Оно не измеряет заряд или температуру батареи, не управляет зарядным устройством и не отключает его, а также не гарантирует срабатывание сигнала. Таймер может приостановиться в фоне или во время сна устройства. Следуйте инструкциям производителей и контролируйте зарядку.',
    notificationHeading: 'Уведомления о завершении', notificationDescription: 'Необязательные уведомления устройства при достижении расчётной цели. Это не удалённые push-уведомления; устройство может приостанавливать фоновые таймеры.',
    notificationUnavailable: 'Уведомления недоступны в этом браузере или приложении. Таймер и звуковой сигнал работают, пока экран открыт.',
    completedTimerEstimates: 'Завершённые расчёты таймера', stoppedTimerEstimates: 'Остановленные сеансы таймера',
    modeledHealth: 'Расчётное состояние батареи', modeledHealthDescription: 'Приблизительная оценка по введённому сроку использования и завершённым расчётам; устройство её не измеряет.',
    runtimeEstimateDescription: 'Оценка рассчитана для нагрузки 500 мА; фактическое время зависит от использования и состояния батареи и не измеряется.',
    profilesStoredDescription: 'Только количество сохранённых профилей; приложение не получает данные батареи в реальном времени.'
  }
};

// --- SUPPORTED SLOT COMPATIBILITY TYPES ---
const AVAILABLE_SLOT_TYPES = ['AA', 'AAA', '18650', 'C', 'D', 'AA/AAA Combined'];
const AVAILABLE_BATTERY_CHEMISTRIES = ['NiMH', 'NiCd', 'Li-ion'];

const getSupportedBatteryChemistries = (charger) => {
  if (Array.isArray(charger?.supported_battery_types)) return charger.supported_battery_types;
  if (charger?.id === 'ch-3' || charger?.name?.includes('Nitecore D4')) return ['NiMH', 'NiCd', 'Li-ion'];
  return ['NiMH'];
};

const getChargerCurrentMa = (charger, battery) => {
  const configuredCurrent = Number(charger?.slotCurrentsMa?.[`${battery.type}:${battery.size}`]);
  if (Number.isFinite(configuredCurrent) && configuredCurrent > 0) return configuredCurrent;
  if (['NiMH', 'NiCd'].includes(battery.type)) {
    if (battery.size === 'AA') return Number(charger.aaCurrentMa);
    if (battery.size === 'AAA') return Number(charger.aaaCurrentMa);
  }
  return null;
};

const getNominalVoltageRange = (chemistry) =>
  chemistry === 'Li-ion' ? { min: 2.5, max: 4.25, defaultValue: 3.7 } : { min: 0.8, max: 2, defaultValue: 1.2 };

const getAppAssetUrl = (assetPath) =>
  new URL(assetPath, new URL(import.meta.env.BASE_URL, window.location.origin)).href;

const isBatteryCompatibleWithCharger = (battery, charger) => {
  if (!battery || !charger || typeof battery.type !== 'string' || ['alkaline', 'primary'].includes(battery.type.toLowerCase())) return false;
  const voltage = Number(battery.voltage);
  const voltageRange = getNominalVoltageRange(battery.type);
  if (!Number.isFinite(voltage) || voltage < voltageRange.min || voltage > voltageRange.max) return false;
  const supportedSlotTypes = charger.supported_slot_types;
  const supportedSize = !supportedSlotTypes || supportedSlotTypes.length === 0 || supportedSlotTypes.some(type => {
    if (type === 'AA/AAA Combined') {
      return battery.size === 'AA' || battery.size === 'AAA';
    }
    return type === battery.size;
  });
  return supportedSize && getSupportedBatteryChemistries(charger).includes(battery.type);
};

// --- GLOBAL PRESET DATABASES ---
const GLOBAL_BATTERY_PRESETS = [
  { name: 'Panasonic Eneloop AA NiMH (1900mAh)', size: 'AA', type: 'NiMH', capacity: 1900, voltage: 1.2, thermalLimitC: 50, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' },
  { name: 'Panasonic Eneloop Pro AA (2500mAh)', size: 'AA', type: 'NiMH', capacity: 2500, voltage: 1.2, thermalLimitC: 55, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' },
  { name: 'AmazonBasics AA High-Drain (2400mAh)', size: 'AA', type: 'NiMH', capacity: 2400, voltage: 1.2, thermalLimitC: 50, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' },
  { name: 'Panasonic Eneloop AAA NiMH (800mAh)', size: 'AAA', type: 'NiMH', capacity: 800, voltage: 1.2, thermalLimitC: 50, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' },
  { name: 'Panasonic Eneloop Pro AAA (950mAh)', size: 'AAA', type: 'NiMH', capacity: 950, voltage: 1.2, thermalLimitC: 50, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' },
  { name: 'Samsung 18650 30Q Li-ion (3000mAh)', size: '18650', type: 'Li-ion', capacity: 3000, voltage: 3.7, thermalLimitC: 60, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' },
  { name: 'Panasonic NCR18650B Li-ion (3400mAh)', size: '18650', type: 'Li-ion', capacity: 3400, voltage: 3.6, thermalLimitC: 60, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' },
  { name: 'Duracell C Alkaline (8000mAh)', size: 'C', type: 'Alkaline', capacity: 8000, voltage: 1.5, thermalLimitC: 45, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' },
  { name: 'Duracell D Alkaline (12000mAh)', size: 'D', type: 'Alkaline', capacity: 12000, voltage: 1.5, thermalLimitC: 45, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' },
  { name: 'Vapcell 14500 Li-ion AA Size (1000mAh)', size: 'AA', type: 'Li-ion', capacity: 1000, voltage: 3.7, thermalLimitC: 60, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' }
];

const GLOBAL_CHARGER_PRESETS = [
  { name: 'Panasonic BQ-CC55 Smart Fast Charger (4 Slots)', aaCurrentMa: 750, aaaCurrentMa: 375, slotCount: 4, isPaired: false, supported_slot_types: ['AA/AAA Combined'], supported_battery_types: ['NiMH'], notes: 'Smart individual slot peak detection' },
  { name: 'Nitecore D4 Digital Super Charger (4 Slots)', aaCurrentMa: 500, aaaCurrentMa: 250, slotCount: 4, isPaired: false, supported_slot_types: ['AA', 'AAA', '18650', 'C', 'D'], supported_battery_types: ['NiMH', 'NiCd', 'Li-ion'], notes: 'Multi-chemistry universal charger' },
  { name: 'Xtar VC4SL USB-C Charger (4 Slots)', aaCurrentMa: 1000, aaaCurrentMa: 500, slotCount: 4, isPaired: false, supported_slot_types: ['AA', 'AAA', '18650'], supported_battery_types: ['NiMH', 'Li-ion'], notes: 'Quick charge support with capacity test' },
  { name: 'Basic 4-Slot Paired NiMH Charger', aaCurrentMa: 300, aaaCurrentMa: 150, slotCount: 4, isPaired: true, supported_slot_types: ['AA/AAA Combined'], supported_battery_types: ['NiMH'], notes: 'Shares current across slot pairs (1&2, 3&4)' },
  { name: 'EBL 8-Bay Universal Rapid Charger (8 Slots)', aaCurrentMa: 500, aaaCurrentMa: 250, slotCount: 8, isPaired: false, supported_slot_types: ['AA', 'AAA', 'C', 'D'], supported_battery_types: ['NiMH'], notes: 'Independent 8-bay multi-size charger' }
];

// --- SLOT DISTINCT COLOR THEMES ---
const SLOT_COLORS = [
  { border: 'border-blue-500/80', ring: 'ring-blue-500/30', bg: 'bg-blue-950/30', text: 'text-blue-400', badge: 'bg-blue-500/15 text-blue-300 border-blue-500/30', bar: 'from-blue-600 to-cyan-400' },
  { border: 'border-emerald-500/80', ring: 'ring-emerald-500/30', bg: 'bg-emerald-950/30', text: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', bar: 'from-emerald-600 to-teal-400' },
  { border: 'border-purple-500/80', ring: 'ring-purple-500/30', bg: 'bg-purple-950/30', text: 'text-purple-400', badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30', bar: 'from-purple-600 to-indigo-400' },
  { border: 'border-amber-500/80', ring: 'ring-amber-500/30', bg: 'bg-amber-950/30', text: 'text-amber-400', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30', bar: 'from-amber-600 to-yellow-400' },
  { border: 'border-rose-500/80', ring: 'ring-rose-500/30', bg: 'bg-rose-950/30', text: 'text-rose-400', badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30', bar: 'from-rose-600 to-pink-400' },
  { border: 'border-cyan-500/80', ring: 'ring-cyan-500/30', bg: 'bg-cyan-950/30', text: 'text-cyan-400', badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30', bar: 'from-cyan-600 to-blue-400' },
  { border: 'border-indigo-500/80', ring: 'ring-indigo-500/30', bg: 'bg-indigo-950/30', text: 'text-indigo-400', badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30', bar: 'from-indigo-600 to-violet-400' },
  { border: 'border-teal-500/80', ring: 'ring-teal-500/30', bg: 'bg-teal-950/30', text: 'text-teal-400', badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30', bar: 'from-teal-600 to-emerald-400' }
];

const INITIAL_CHARGERS = [
  {
    id: 'ch-1',
    name: 'Panasonic BQ-CC55 (Smart Fast Charger)',
    inputV: 100, inputVMax: 240, inputA: 0.3, inputHz: '50/60Hz',
    outputV: 1.5, aaCurrentMa: 750, aaaCurrentMa: 375, slotCount: 4, isPaired: false,
    supported_slot_types: ['AA/AAA Combined'], supported_battery_types: ['NiMH'],
    notes: 'Smart individual slot charging with peak detection'
  },
  {
    id: 'ch-2',
    name: 'Basic 4-Slot Paired NiMH Charger',
    inputV: 120, inputVMax: 240, inputA: 0.15, inputHz: '60Hz',
    outputV: 2.8, aaCurrentMa: 300, aaaCurrentMa: 150, slotCount: 4, isPaired: true,
    supported_slot_types: ['AA/AAA Combined'], supported_battery_types: ['NiMH'],
    notes: 'Shares current across slot pairs (1&2, 3&4)'
  },
  {
    id: 'ch-3',
    name: 'Nitecore D4 Digital Super Charger',
    inputV: 100, inputVMax: 240, inputA: 0.5, inputHz: '50/60Hz',
    outputV: 4.2, aaCurrentMa: 500, aaaCurrentMa: 250, slotCount: 4, isPaired: false,
    supported_slot_types: ['AA', 'AAA', '18650', 'C', 'D'], supported_battery_types: ['NiMH', 'NiCd', 'Li-ion'],
    notes: 'Multi-chemistry universal charger'
  }
];

const INITIAL_BATTERY_PROFILES = [
  { id: 'bp-1', name: 'Eneloop AA NiMH Standard', size: 'AA', type: 'NiMH', capacity: 1900, voltage: 1.2, maxCurrentMa: 1900, thermalLimitC: 50, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' },
  { id: 'bp-2', name: 'Eneloop Pro AA High Capacity', size: 'AA', type: 'NiMH', capacity: 2500, voltage: 1.2, maxCurrentMa: 2500, thermalLimitC: 55, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' },
  { id: 'bp-3', name: 'AmazonBasics AA High-Drain', size: 'AA', type: 'NiMH', capacity: 2400, voltage: 1.2, maxCurrentMa: 2400, thermalLimitC: 50, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' },
  { id: 'bp-4', name: 'Eneloop AAA NiMH Standard', size: 'AAA', type: 'NiMH', capacity: 800, voltage: 1.2, maxCurrentMa: 800, thermalLimitC: 50, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' },
  { id: 'bp-5', name: 'Eneloop Pro AAA NiMH', size: 'AAA', type: 'NiMH', capacity: 950, voltage: 1.2, maxCurrentMa: 950, thermalLimitC: 50, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' },
  { id: 'bp-6', name: '14500 Li-ion AA Size (3.7V)', size: 'AA', type: 'Li-ion', capacity: 800, voltage: 3.7, maxCurrentMa: 800, thermalLimitC: 60, condition: 'New', priorUsageValue: 0, priorUsageUnit: 'Months' }
];

// --- Offline-first persistence adapter (IndexedDB with localStorage startup fallback) ---
const VOLTGUARD_DB_NAME = 'VoltGuardProDB';
const VOLTGUARD_DB_VERSION = 1;
const VOLTGUARD_STORE_NAME = 'appState';

const openVoltGuardDatabase = () => new Promise((resolve, reject) => {
  if (!('indexedDB' in window)) {
    reject(new Error('IndexedDB is not available in this browser.'));
    return;
  }
  const request = window.indexedDB.open(VOLTGUARD_DB_NAME, VOLTGUARD_DB_VERSION);
  request.onupgradeneeded = () => {
    const db = request.result;
    if (!db.objectStoreNames.contains(VOLTGUARD_STORE_NAME)) {
      db.createObjectStore(VOLTGUARD_STORE_NAME, { keyPath: 'id' });
    }
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error('Could not open local database.'));
});

const readVoltGuardSnapshot = async () => {
  const db = await openVoltGuardDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VOLTGUARD_STORE_NAME, 'readonly');
    const request = tx.objectStore(VOLTGUARD_STORE_NAME).get('main');
    request.onsuccess = () => { db.close(); resolve(request.result?.data || null); };
    request.onerror = () => { db.close(); reject(request.error); };
  });
};

const writeVoltGuardSnapshot = async (data) => {
  const db = await openVoltGuardDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(VOLTGUARD_STORE_NAME, 'readwrite');
    tx.objectStore(VOLTGUARD_STORE_NAME).put({ id: 'main', data, updatedAt: new Date().toISOString() });
    tx.oncomplete = () => { db.close(); resolve(true); };
    tx.onerror = () => { db.close(); reject(tx.error); };
    tx.onabort = () => { db.close(); reject(tx.error || new Error('Local database write was aborted.')); };
  });
};

export default function App() {
  // --- Persistent Core States ---
  const [chargers, setChargers] = useState(() => JSON.parse(localStorage.getItem('batt_chargers')) || INITIAL_CHARGERS);
  const [batteryProfiles, setBatteryProfiles] = useState(() => JSON.parse(localStorage.getItem('batt_profiles')) || INITIAL_BATTERY_PROFILES);
  const [activeChargerId, setActiveChargerId] = useState(() => localStorage.getItem('batt_active_charger_id') || INITIAL_CHARGERS[0].id);
  
  const [activeSlots, setActiveSlots] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('batt_active_slots'));
      if (Array.isArray(saved)) {
        return saved.map((s, idx) => ({ ...s, slotIndex: s.slotIndex !== undefined ? s.slotIndex : idx }));
      }
    } catch (e) {}
    return [];
  });

  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('batt_history')) || []);
  
  const [settings, setSettings] = useState(() => JSON.parse(localStorage.getItem('batt_settings')) || {
    audioAlerts: true,
    pushNotifications: false,
    selectedAlarmId: 'chime',
    defaultEfficiency: 1.3,
    language: 'en',
    autoArchiveFinished: false
  });
  const [termsAcceptance, setTermsAcceptance] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(TERMS_STORAGE_KEY));
      return saved && typeof saved.version === 'string' ? saved : null;
    } catch {
      return null;
    }
  });
  const [appUpdateNotice, setAppUpdateNotice] = useState(() => {
    try {
      const previousVersion = localStorage.getItem(APP_VERSION_STORAGE_KEY);
      const hasExistingInstall = [
        'batt_settings',
        'batt_profiles',
        'batt_chargers',
        TERMS_STORAGE_KEY
      ].some(key => localStorage.getItem(key) !== null);
      const shouldNotify = previousVersion
        ? previousVersion !== APP_VERSION
        : hasExistingInstall;
      localStorage.setItem(APP_VERSION_STORAGE_KEY, APP_VERSION);
      return shouldNotify ? CURRENT_RELEASE : null;
    } catch (error) {
      console.error('Could not read or save the app version:', error);
      return CURRENT_RELEASE;
    }
  });
  const [appUpdateChecking, setAppUpdateChecking] = useState(false);
  const [appUpdateFeedback, setAppUpdateFeedback] = useState('');
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [termsDeclined, setTermsDeclined] = useState(false);
  const [termsStorageError, setTermsStorageError] = useState(false);
  const [termsExpanded, setTermsExpanded] = useState(false);
  const [updateHistoryExpanded, setUpdateHistoryExpanded] = useState(false);
  const termsAccepted = termsAcceptance?.version === TERMS_VERSION;
  const termsCheckboxRef = useRef(null);
  const termsReviewButtonRef = useRef(null);
  const termsSectionRef = useRef(null);
  const updateHistoryRef = useRef(null);

  // --- Backup & Restore UI States ---
  const [includeStatsInBackup, setIncludeStatsInBackup] = useState(true);
  const [backupFeedbackMsg, setBackupFeedbackMsg] = useState({ type: '', text: '' });
  const fileInputRef = useRef(null);

  // --- Supporter / Donation State ---
  const [subscription, setSubscription] = useState(() => JSON.parse(localStorage.getItem('batt_subscription')) || {
    isSupporter: false,
    expiresAt: null
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState(() => localStorage.getItem('batt_user_email') || '');
  const [storageReady, setStorageReady] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState(false);
  
  const [copiedCrypto, setCopiedCrypto] = useState(null);
  const [selectedJiggleLogo, setSelectedJiggleLogo] = useState(null);

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState('dashboard');
  const isNativeApp = window.Capacitor?.isNativePlatform?.() === true;
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [targetSlotIndex, setTargetSlotIndex] = useState(null);
  const [isChargerModalOpen, setIsChargerModalOpen] = useState(false);
  const [isBatteryProfileModalOpen, setIsBatteryProfileModalOpen] = useState(false);
  
  const [editingCharger, setEditingCharger] = useState(null);
  const [editingBatteryProfile, setEditingBatteryProfile] = useState(null);

  // Camera-assisted profile scanning (web/PWA and Capacitor-compatible file capture).
  const batteryScanInputRef = useRef(null);
  const chargerScanInputRef = useRef(null);
  const [profileScanStatus, setProfileScanStatus] = useState({ type: '', message: '' });

  const loadTesseract = async () => {
    if (window.Tesseract) return window.Tesseract;
    if (!window.__voltGuardTesseractPromise) {
      window.__voltGuardTesseractPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
        script.async = true;
        script.onload = () => window.Tesseract ? resolve(window.Tesseract) : reject(new Error('OCR engine could not be initialized.'));
        script.onerror = () => reject(new Error('Could not load the OCR engine. Check your internet connection.'));
        document.head.appendChild(script);
      });
    }
    return window.__voltGuardTesseractPromise;
  };

  const estimateVisibleChargerBays = async (file) => {
    // Lightweight browser-side shape analysis: estimate dark, elongated bay cavities.
    // This is a visual hint only; reflections, shadows and perspective can affect the count.
    const bitmap = await createImageBitmap(file);
    const canvas = document.createElement('canvas');
    const width = 320;
    const height = Math.max(120, Math.round(bitmap.height * width / bitmap.width));
    canvas.width = width;
    canvas.height = Math.min(320, height);
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const w = canvas.width, h = canvas.height;
    const dark = new Uint8Array(w * h);
    for (let i = 0; i < w * h; i++) {
      const brightness = (data[i * 4] * 0.299) + (data[i * 4 + 1] * 0.587) + (data[i * 4 + 2] * 0.114);
      dark[i] = brightness < 62 ? 1 : 0;
    }
    const visited = new Uint8Array(w * h);
    const queue = new Int32Array(w * h);
    const candidates = [];
    for (let start = 0; start < w * h; start++) {
      if (!dark[start] || visited[start]) continue;
      let head = 0, tail = 0, minX = w, maxX = 0, minY = h, maxY = 0, area = 0;
      queue[tail++] = start;
      visited[start] = 1;
      while (head < tail) {
        const index = queue[head++], x = index % w, y = (index / w) | 0;
        area++; minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y);
        const neighbors = [x > 0 ? index - 1 : -1, x < w - 1 ? index + 1 : -1, y > 0 ? index - w : -1, y < h - 1 ? index + w : -1];
        for (const next of neighbors) if (next >= 0 && dark[next] && !visited[next]) { visited[next] = 1; queue[tail++] = next; }
      }
      const boxW = maxX - minX + 1, boxH = maxY - minY + 1;
      if (area >= 45 && area <= 2600 && boxW >= 7 && boxW <= 90 && boxH >= 16 && boxH <= 170 && boxH / boxW >= 1.15 && boxH / boxW <= 6) candidates.push({ area, x: minX, y: minY, w: boxW, h: boxH });
    }
    // Merge nested/overlapping dark components so a single bay is not counted twice.
    const unique = candidates.filter((candidate, index) => !candidates.some((other, otherIndex) =>
      otherIndex !== index && other.area > candidate.area &&
      Math.abs(other.x - candidate.x) < Math.max(5, candidate.w * 0.35) &&
      Math.abs(other.y - candidate.y) < Math.max(8, candidate.h * 0.25)
    ));
    return unique.length >= 1 && unique.length <= 16 ? unique.length : null;
  };

  const handleProfileCameraScan = async (file, profileType) => {
    if (!file) return;
    setProfileScanStatus({ type: 'loading', message: 'Reading image and extracting profile details…' });
    try {
      const Tesseract = await loadTesseract();
      const result = await Tesseract.recognize(file, 'eng');
      const rawText = (result?.data?.text || '').replace(/\s+/g, ' ').trim();
      if (!rawText) throw new Error('No readable text was found. Try a clearer, closer photo.');

      if (profileType === 'battery') {
        const patch = {};
        const capacity = rawText.match(/(?:capacity|cap\.?|typ(?:ical)?)?\s*[:=]?\s*(\d{3,5})\s*m\s*a\s*h/i) || rawText.match(/(\d{3,5})\s*m\s*a\s*h/i);
        const voltage = rawText.match(/(\d+(?:[.,]\d+)?)\s*v(?:olt)?\b/i);
        const size = rawText.match(/\b(AA\/AAA|AAA|AA|18650|14500|C|D)\b/i);
        const chemistry = rawText.match(/\b(NiMH|Ni-MH|Li[- ]?ion|Lithium[- ]?ion|Alkaline)\b/i);
        const thermal = rawText.match(/(?:max(?:imum)?\s*)?(\d{2})\s*°?\s*C\b/i);
        const modelLine = rawText.split(/[.!?]/).map(x => x.trim()).find(x => x.length >= 3);
        if (capacity) patch.capacity = Number(capacity[1]);
        if (voltage) patch.voltage = Number(voltage[1].replace(',', '.'));
        if (size) patch.size = size[1].toUpperCase().replace('AA/AAA', 'AA');
        if (chemistry) patch.type = /nimh|ni-mh/i.test(chemistry[1]) ? 'NiMH' : /alkaline/i.test(chemistry[1]) ? 'Alkaline' : 'Li-ion';
        if (thermal) patch.thermalLimitC = Number(thermal[1]);
        if (!editingBatteryProfile.name && modelLine) patch.name = modelLine.slice(0, 70);
        setEditingBatteryProfile(prev => ({ ...prev, ...patch }));
        const found = Object.keys(patch);
        setProfileScanStatus({ type: 'success', message: found.length ? `Detected: ${found.join(', ')}. Please verify the values before saving.` : 'Text was read, but no supported battery fields were confidently identified. Please enter the values manually.' });
      } else {
        const patch = {};
        const slotMatch = rawText.match(/\b(\d{1,2})\s*[- ]?(?:slot|bay|channel)s?\b/i) || rawText.match(/\b(?:slots?|bays?)\s*[:=]?\s*(\d{1,2})\b/i);
        let visualBayCount = null;
        try { visualBayCount = await estimateVisibleChargerBays(file); } catch (visionError) { /* OCR can still populate the form when visual analysis is unavailable. */ }
        const aaCurrent = rawText.match(/AA[^\d]{0,20}(\d{2,4})\s*mA/i) || rawText.match(/(\d{2,4})\s*mA[^\n]{0,12}AA/i);
        const aaaCurrent = rawText.match(/AAA[^\d]{0,20}(\d{2,4})\s*mA/i) || rawText.match(/(\d{2,4})\s*mA[^\n]{0,12}AAA/i);
        const detectedTypes = [];
        if (/AA\s*\/\s*AAA|AA\s*\+\s*AAA|AA\s*&\s*AAA|AA\s+AAA/i.test(rawText)) detectedTypes.push('AA/AAA Combined');
        else {
          if (/\bAA\b/i.test(rawText)) detectedTypes.push('AA');
          if (/\bAAA\b/i.test(rawText)) detectedTypes.push('AAA');
        }
        if (/18650/i.test(rawText)) detectedTypes.push('18650');
        if (/\btype\s*[- ]?C\b|\bC\s*size\b/i.test(rawText)) detectedTypes.push('C');
        if (/\btype\s*[- ]?D\b|\bD\s*size\b/i.test(rawText)) detectedTypes.push('D');
        if (slotMatch) patch.slotCount = Math.min(16, Math.max(1, Number(slotMatch[1])));
        else if (visualBayCount) patch.slotCount = visualBayCount;
        if (aaCurrent) patch.aaCurrentMa = Number(aaCurrent[1]);
        if (aaaCurrent) patch.aaaCurrentMa = Number(aaaCurrent[1]);
        if (detectedTypes.length) patch.supported_slot_types = [...new Set(detectedTypes)];
        const modelLine = rawText.split(/[.!?]/).map(x => x.trim()).find(x => x.length >= 3);
        if (!editingCharger.name && modelLine) patch.name = modelLine.slice(0, 70);
        setEditingCharger(prev => ({ ...prev, ...patch }));
        const found = Object.keys(patch);
        setProfileScanStatus({ type: 'success', message: found.length ? `Detected: ${found.join(', ')}${!slotMatch && visualBayCount ? `; estimated ${visualBayCount} physical bay(s) from the image` : ''}. Slot type classification is based on visible label text; verify the bay layout and all suggestions before saving.` : 'Text was read, but charger details were not confidently identified. Please configure the fields manually.' });
      }
    } catch (error) {
      setProfileScanStatus({ type: 'error', message: error.message || 'Image scanning failed. Please try again.' });
    }
  };
  const [selectedBatteryProfileId, setSelectedBatteryProfileId] = useState('');

  // Form error states
  const [addSlotError, setAddSlotError] = useState('');
  const [batteryProfileErrors, setBatteryProfileErrors] = useState({});
  const [chargerErrors, setChargerErrors] = useState({});
  const [globalErrorMsg, setGlobalErrorMsg] = useState('');
  const globalErrorTimeoutRef = useRef(null);
  const addSlotModalRef = useRef(null);
  const addSlotTriggerRef = useRef(null);
  const notificationsAvailable = typeof window !== 'undefined' && 'Notification' in window;

  const showGlobalError = (message) => {
    setGlobalErrorMsg(message);
    if (globalErrorTimeoutRef.current) window.clearTimeout(globalErrorTimeoutRef.current);
    globalErrorTimeoutRef.current = window.setTimeout(() => {
      setGlobalErrorMsg('');
      globalErrorTimeoutRef.current = null;
    }, 4000);
  };

  const [newSlotForm, setNewSlotForm] = useState({
    slotLabel: '',
    size: 'AA',
    type: 'NiMH',
    capacity: '',
    voltage: '',
    initialCharge: 0,
    efficiency: settings.defaultEfficiency,
    targetMode: 'full'
  });

  const audioCtxRef = useRef(null);
  const alarmAudioRef = useRef(null);
  const alarmShouldBePlayingRef = useRef(false);
  const activeAlarmLoopIntervalRef = useRef(null);
  const wakeLockRef = useRef(null);

  useEffect(() => () => {
    if (globalErrorTimeoutRef.current) window.clearTimeout(globalErrorTimeoutRef.current);
  }, []);

  // Keep the display awake while charging where supported; this does not guarantee background execution.
  useEffect(() => {
    const hasChargingSlots = activeSlots.some(s => s.status === 'charging');
    if (hasChargingSlots && 'wakeLock' in navigator) {
      navigator.wakeLock.request('screen').then(lock => {
        wakeLockRef.current = lock;
      }).catch(err => console.log('Wake Lock request info:', err));
    } else if (!hasChargingSlots && wakeLockRef.current) {
      wakeLockRef.current.release().then(() => {
        wakeLockRef.current = null;
      }).catch(() => {});
    }
  }, [activeSlots]);

  // RTL Direction check for Persian & Arabic
  const isRTL = useMemo(() => settings.language === 'fa' || settings.language === 'ar', [settings.language]);
  const t = (key) => TRANSLATIONS[settings.language]?.[key] || TRANSLATIONS['en'][key] || key;
  const copy = APP_COPY[settings.language] || APP_COPY.en;

  useEffect(() => {
    setTermsExpanded(false);
    setUpdateHistoryExpanded(false);
  }, [activeTab]);

  useEffect(() => {
    if (!termsExpanded) return undefined;
    const collapseWhenClickingElsewhere = event => {
      if (!termsSectionRef.current?.contains(event.target)) setTermsExpanded(false);
    };
    document.addEventListener('click', collapseWhenClickingElsewhere);
    return () => document.removeEventListener('click', collapseWhenClickingElsewhere);
  }, [termsExpanded]);

  useEffect(() => {
    if (!updateHistoryExpanded) return undefined;
    const collapseWhenClickingElsewhere = event => {
      if (!updateHistoryRef.current?.contains(event.target)) setUpdateHistoryExpanded(false);
    };
    document.addEventListener('click', collapseWhenClickingElsewhere);
    return () => document.removeEventListener('click', collapseWhenClickingElsewhere);
  }, [updateHistoryExpanded]);

  useEffect(() => {
    if (!termsAccepted) {
      if (termsDeclined) termsReviewButtonRef.current?.focus();
      else termsCheckboxRef.current?.focus();
    }
  }, [termsAccepted, termsDeclined]);

  const acceptCurrentTerms = () => {
    if (!termsAgreed) return;
    const acceptance = { version: TERMS_VERSION, acceptedAt: new Date().toISOString() };
    try {
      localStorage.setItem(TERMS_STORAGE_KEY, JSON.stringify(acceptance));
      setTermsAcceptance(acceptance);
      setTermsStorageError(false);
    } catch (error) {
      console.error('Could not save Terms acceptance:', error);
      setTermsAcceptance(acceptance);
      setTermsStorageError(true);
    }
  };

  const handleAppUpdate = async () => {
    if (isNativeApp) {
      const platform = window.Capacitor?.getPlatform?.();
      const storeUrl = platform === 'ios'
        ? (import.meta.env.VITE_IOS_APP_STORE_URL || 'https://apps.apple.com/search?term=VoltGuard%20Pro')
        : (import.meta.env.VITE_ANDROID_PLAY_STORE_URL || 'https://play.google.com/store/search?q=VoltGuard%20Pro&c=apps');
      window.open(storeUrl, '_system');
      return;
    }

    setAppUpdateChecking(true);
    setAppUpdateFeedback('');
    try {
      const registration = 'serviceWorker' in navigator
        ? await navigator.serviceWorker.getRegistration()
        : null;
      if (registration) await registration.update();
      window.location.reload();
    } catch (error) {
      console.error('Could not check for an app update:', error);
      setAppUpdateFeedback(t('appUpdateFailed'));
      setAppUpdateChecking(false);
    }
  };

  const renderTermsDocument = () => (
    <div className="space-y-5 text-xs sm:text-sm leading-relaxed text-slate-300">
      {TERMS_SECTIONS.map(section => (
        <section key={section.heading} className="space-y-1.5">
          <h3 className="font-bold text-slate-100">{section.heading}</h3>
          <p>{section.text}</p>
        </section>
      ))}
    </div>
  );
  
  const currentCharger = useMemo(() => chargers.find(c => c.id === activeChargerId) || chargers[0], [chargers, activeChargerId]);
  const chargerCurrentConfigs = useMemo(() => {
    if (!editingCharger) return [];
    return (editingCharger.supported_battery_types || []).flatMap(chemistry =>
      (editingCharger.supported_slot_types || []).flatMap(slotType => {
        const sizes = slotType === 'AA/AAA Combined' ? ['AA', 'AAA'] : [slotType];
        return sizes
          .filter(size => !(['NiMH', 'NiCd'].includes(chemistry) && ['AA', 'AAA'].includes(size)))
          .map(size => ({ chemistry, size, key: `${chemistry}:${size}` }));
      })
    );
  }, [editingCharger]);

  useEffect(() => {
    document.documentElement.lang = settings.language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [settings.language, isRTL]);

  // Hydrate the IndexedDB snapshot once. Existing localStorage values remain the
  // synchronous fallback for first launch, private browsing, or unavailable IndexedDB.
  useEffect(() => {
    let cancelled = false;
    const hydrate = async () => {
      try {
        const snapshot = await readVoltGuardSnapshot();
        if (!cancelled && snapshot) {
          if (Array.isArray(snapshot.chargers) && snapshot.chargers.length) setChargers(snapshot.chargers);
          if (Array.isArray(snapshot.batteryProfiles)) setBatteryProfiles(snapshot.batteryProfiles);
          if (typeof snapshot.activeChargerId === 'string') setActiveChargerId(snapshot.activeChargerId);
          if (Array.isArray(snapshot.activeSlots)) {
            setActiveSlots(snapshot.activeSlots.map((slot, index) => ({
              ...slot, slotIndex: slot.slotIndex !== undefined ? slot.slotIndex : index
            })));
          }
          if (Array.isArray(snapshot.history)) setHistory(snapshot.history);
          if (snapshot.settings && typeof snapshot.settings === 'object') setSettings(prev => ({ ...prev, ...snapshot.settings }));
          if (snapshot.subscription && typeof snapshot.subscription === 'object') setSubscription(prev => ({ ...prev, ...snapshot.subscription }));
          if (typeof snapshot.checkoutEmail === 'string') setCheckoutEmail(snapshot.checkoutEmail);
        }
      } catch (error) {
        console.info('IndexedDB unavailable; continuing with localStorage persistence.', error);
      } finally {
        if (!cancelled) setStorageReady(true);
      }
    };
    hydrate();
    return () => { cancelled = true; };
  }, []);

  // Persist a single coherent offline-first snapshot to IndexedDB and retain
  // localStorage keys for compatibility with earlier VoltGuard versions.
  useEffect(() => {
    if (!storageReady) return;
    const snapshot = {
      chargers, batteryProfiles, activeChargerId, activeSlots, history,
      settings, subscription, checkoutEmail
    };
    try {
      localStorage.setItem('batt_chargers', JSON.stringify(chargers));
      localStorage.setItem('batt_profiles', JSON.stringify(batteryProfiles));
      localStorage.setItem('batt_active_charger_id', activeChargerId);
      localStorage.setItem('batt_active_slots', JSON.stringify(activeSlots));
      localStorage.setItem('batt_history', JSON.stringify(history));
      localStorage.setItem('batt_settings', JSON.stringify(settings));
      localStorage.setItem('batt_subscription', JSON.stringify(subscription));
      if (checkoutEmail) localStorage.setItem('batt_user_email', checkoutEmail);
      else localStorage.removeItem('batt_user_email');
    } catch (error) {
      console.warn('localStorage persistence failed:', error);
    }
    writeVoltGuardSnapshot(snapshot).catch(error => {
      console.warn('IndexedDB persistence failed; localStorage remains available:', error);
    });
  }, [storageReady, chargers, batteryProfiles, activeChargerId, activeSlots, history, settings, subscription, checkoutEmail]);

  const isSupporterValid = useMemo(() => {
    if (!subscription.isSupporter || !subscription.expiresAt) return false;
    return new Date().getTime() < subscription.expiresAt;
  }, [subscription]);

  // --- Backup & Restore Implementation Handlers ---
  const handleExportLocalBackup = (cloudProviderName = null) => {
    try {
      const backupPayload = {
        version: "1.1",
        app: "VoltGuard Pro",
        timestamp: new Date().toISOString(),
        payload: {
          batteryProfiles,
          chargers,
          activeChargerId,
          settings,
          subscription,
          checkoutEmail,
          activeSlots,
          history: includeStatsInBackup ? history : []
        }
      };

      const backupBlob = new Blob([JSON.stringify(backupPayload, null, 2)], { type: 'application/json' });
      const objectUrl = URL.createObjectURL(backupBlob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.href = objectUrl;
      downloadAnchor.download = `voltguard_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);

      setBackupFeedbackMsg({
        type: 'success',
        text: cloudProviderName
          ? `A JSON backup was downloaded. Upload it to ${cloudProviderName} using its official app or file picker. Direct account sync is not configured in this build.`
          : t('backupSuccess')
      });
      setTimeout(() => setBackupFeedbackMsg({ type: '', text: '' }), cloudProviderName ? 7000 : 4000);
    } catch (err) {
      setBackupFeedbackMsg({ type: 'error', text: t('backupError') });
      setTimeout(() => setBackupFeedbackMsg({ type: '', text: '' }), 4000);
    }
  };

  const handleCloudExportSync = (providerName) => {
    // Direct provider APIs require OAuth configuration and a backend/native
    // provider plugin. Download a real backup instead of simulating an upload.
    handleExportLocalBackup(providerName);
  };

  const handleCloudImportRestore = (providerName) => {
    setBackupFeedbackMsg({
      type: 'success',
      text: `Choose a VoltGuard JSON backup downloaded from ${providerName}. Direct account browsing requires provider OAuth integration.`
    });
    fileInputRef.current?.click();
  };

  const validateAndRestoreBackupData = (parsedData) => {
    if (!parsedData || typeof parsedData !== 'object') {
      throw new Error("Invalid root object structure");
    }

    const payload = parsedData.payload || parsedData; // Support both wrapped & direct raw backups
    
    if (!payload.batteryProfiles || !Array.isArray(payload.batteryProfiles)) {
      throw new Error("Missing or invalid batteryProfiles array");
    }
    if (!payload.chargers || !Array.isArray(payload.chargers)) {
      throw new Error("Missing or invalid chargers array");
    }

    // Safely apply state updates with fallback defaults
    setBatteryProfiles(payload.batteryProfiles);
    setChargers(payload.chargers);
    if (payload.settings && typeof payload.settings === 'object') {
      setSettings(prev => ({ ...prev, ...payload.settings }));
    }
    if (payload.history && Array.isArray(payload.history)) {
      setHistory(payload.history);
    }
    if (typeof payload.activeChargerId === 'string') setActiveChargerId(payload.activeChargerId);
    if (Array.isArray(payload.activeSlots)) setActiveSlots(payload.activeSlots);
    if (payload.subscription && typeof payload.subscription === 'object') setSubscription(prev => ({ ...prev, ...payload.subscription }));
    if (typeof payload.checkoutEmail === 'string') setCheckoutEmail(payload.checkoutEmail);

    setBackupFeedbackMsg({ type: 'success', text: t('restoreSuccess') });
    setTimeout(() => setBackupFeedbackMsg({ type: '', text: '' }), 4000);
  };

  const handleFileImportUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonContent = JSON.parse(event.target.result);
        validateAndRestoreBackupData(jsonContent);
      } catch (err) {
        setBackupFeedbackMsg({ type: 'error', text: t('backupError') });
        setTimeout(() => setBackupFeedbackMsg({ type: '', text: '' }), 4000);
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  // --- Charger Change Validation ---
  const handleAttemptChangeCharger = (newChargerId) => {
    if (activeSlots.length > 0) {
      showGlobalError(t('errorChargerInUse'));
      return;
    }
    setActiveChargerId(newChargerId);
  };

  // --- Charger Edit & Delete Validation ---
  const handleAttemptEditCharger = (charger) => {
    if (activeSlots.length > 0 && charger.id === activeChargerId) {
      showGlobalError(t('errorChargerInUse'));
      return;
    }
    setEditingCharger({
      ...charger,
      supported_slot_types: charger.supported_slot_types || ['AA/AAA Combined'],
      supported_battery_types: getSupportedBatteryChemistries(charger)
    });
    setChargerErrors({});
    setIsChargerModalOpen(true);
  };

  const handleAttemptDeleteCharger = (chargerId) => {
    if (activeSlots.length > 0 && chargerId === activeChargerId) {
      showGlobalError(t('errorChargerInUse'));
      return;
    }
    setChargers(prev => prev.filter(item => item.id !== chargerId));
  };

  // --- Battery Profile Edit & Delete Validation ---
  const handleAttemptEditProfile = (profile) => {
    const isCharging = activeSlots.some(slot => 
      (slot.profileId === profile.id || slot.label === profile.name) && slot.status !== 'completed'
    );
    if (isCharging) {
      showGlobalError(t('errorProfileInUse'));
      return;
    }
    setEditingBatteryProfile(profile);
    setBatteryProfileErrors({});
    setIsBatteryProfileModalOpen(true);
  };

  const handleAttemptDeleteProfile = (profileId) => {
    const profile = batteryProfiles.find(p => p.id === profileId);
    const isCharging = profile && activeSlots.some(slot => 
      (slot.profileId === profileId || slot.label === profile.name) && slot.status !== 'completed'
    );
    if (isCharging) {
      showGlobalError(t('errorProfileInUse'));
      return;
    }
    setBatteryProfiles(prev => prev.filter(item => item.id !== profileId));
  };

  // --- Payment / Donation Gateway Redirection ---
  const handlePaymentRedirect = (provider) => {
    if (!checkoutEmail || !checkoutEmail.includes('@')) {
      alert(settings.language === 'fa' ? 'لطفاً یک آدرس ایمیل معتبر وارد کنید.' : 'Please enter a valid email address before proceeding.');
      return;
    }

    const transactionLog = {
      email: checkoutEmail,
      provider,
      amount: 'Custom Voluntary Donation',
      timestamp: new Date().toISOString()
    };
    const existingLogs = JSON.parse(localStorage.getItem('batt_transaction_logs') || '[]');
    localStorage.setItem('batt_transaction_logs', JSON.stringify([transactionLog, ...existingLogs]));

    let paymentLink = '';
    if (provider === 'paypal') {
      paymentLink = `https://www.paypal.com/ncp/payment/YOUR_PAYPAL_BUSINESS_ID?email=${encodeURIComponent(checkoutEmail)}`;
    } else if (provider === 'revolut') {
      paymentLink = `https://revolut.me/voltguard?reference=${encodeURIComponent(checkoutEmail)}`;
    }

    window.open(paymentLink, '_blank');

    setTimeout(() => {
      const expiresAt = new Date().getTime() + (365 * 24 * 60 * 60 * 1000);
      setSubscription({ isSupporter: true, expiresAt });
      setPaymentSuccessMsg(true);

      setTimeout(() => {
        setIsPaymentModalOpen(false);
        setPaymentSuccessMsg(false);
      }, 3000);
    }, 1500);
  };

  const handleCopyCrypto = (address, key) => {
    navigator.clipboard.writeText(address);
    setCopiedCrypto(key);
    setTimeout(() => setCopiedCrypto(null), 2000);
  };

  const triggerJiggle = (logoKey) => {
    setSelectedJiggleLogo(logoKey);
    setTimeout(() => setSelectedJiggleLogo(null), 800);
  };

  // Continuous Audio Looping Alarm Controller
  const stopContinuousAlarmSound = () => {
    alarmShouldBePlayingRef.current = false;
    if (activeAlarmLoopIntervalRef.current) {
      clearInterval(activeAlarmLoopIntervalRef.current);
      activeAlarmLoopIntervalRef.current = null;
    }
    if (alarmAudioRef.current) {
      alarmAudioRef.current.pause();
      try { alarmAudioRef.current.currentTime = 0; } catch (error) {}
    }
  };

  const triggerContinuousAlarmSound = (alarmId = 'chime') => {
    if (!settings.audioAlerts) return;
    stopContinuousAlarmSound();
    alarmShouldBePlayingRef.current = true;

    const startFallbackTone = () => {
      if (!alarmShouldBePlayingRef.current || activeAlarmLoopIntervalRef.current) return;
      playSingleAlarmBurst(alarmId);
      activeAlarmLoopIntervalRef.current = setInterval(() => {
        if (alarmShouldBePlayingRef.current) playSingleAlarmBurst(alarmId);
      }, 1500);
    };

    // Use the bundled alarm audio first, with Web Audio as a fallback.
    const alarmAudio = alarmAudioRef.current;
    if (alarmAudio) {
      alarmAudio.loop = true;
      try { alarmAudio.currentTime = 0; } catch (error) {}
      const playback = alarmAudio.play();
      if (playback && typeof playback.catch === 'function') {
        playback.catch(() => startFallbackTone());
      }
    } else {
      startFallbackTone();
    }
  };

  const playSingleAlarmBurst = (alarmId = 'chime') => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const selectedProfile = ALARM_SOUND_OPTIONS.find(a => a.id === alarmId) || ALARM_SOUND_OPTIONS[0];
      const notes = selectedProfile.frequencies;

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = alarmId === 'radar' ? 'sawtooth' : 'sine';
        osc.frequency.value = freq;
        const startTime = ctx.currentTime + (idx * 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        gain.gain.setValueAtTime(0.35, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
        osc.start(startTime);
        osc.stop(startTime + 0.35);
      });
    } catch (e) { 
      console.error('Audio playback error:', e); 
    }
  };

  // Global Timer Tick for Active Slots
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      setActiveSlots(prevSlots => {
        let changed = false;
        let alarmNeeded = false;

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
            alarmNeeded = true;

            if (settings.pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
              const notificationOptions = {
                body: `${slot.size} battery timer estimate reached its target. Check the battery and charger; this app cannot detect actual charge.`,
                icon: getAppAssetUrl('icons/icon-192.png'),
                badge: getAppAssetUrl('icons/icon-192.png'),
                vibrate: [200, 100, 200, 100, 200],
                tag: 'charge-complete-' + slot.id,
                renotify: true,
                data: { url: getAppAssetUrl('') }
              };
              const title = '🔋 Battery Timer Estimate Reached';
              if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistration()
                  .then(registration => registration
                    ? registration.showNotification(title, notificationOptions)
                    : new Notification(title, notificationOptions))
                  .catch(error => {
                    console.warn('Service worker notification failed:', error);
                    if (settings.pushNotifications && Notification.permission === 'granted') {
                      new Notification(title, notificationOptions);
                    }
                  });
              } else {
                new Notification(title, notificationOptions);
              }
            }
          }

          if (elapsedSec !== slot.elapsedSec || newStatus !== slot.status) {
            changed = true;
            return { ...slot, elapsedSec, remainingSec, overchargeSec, status: newStatus, alertTriggered };
          }
          return slot;
        });

        if (alarmNeeded) {
          triggerContinuousAlarmSound(settings.selectedAlarmId);
        }

        return changed ? updated : prevSlots;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [settings.pushNotifications, settings.selectedAlarmId, settings.audioAlerts]);

  const requestNotificationPermission = (enableState) => {
    if (enableState) {
      if (notificationsAvailable) {
        Notification.requestPermission().then(permission => {
          setSettings(s => ({ ...s, pushNotifications: permission === 'granted' }));
        }).catch(error => {
          console.error('Notification permission request failed:', error);
          setSettings(s => ({ ...s, pushNotifications: false }));
        });
      } else {
        setSettings(s => ({ ...s, pushNotifications: false }));
      }
    } else {
      setSettings(s => ({ ...s, pushNotifications: false }));
    }
  };

  const calculateChargeTime = (size, capacity, initialCharge, efficiency, targetMode) => {
    const baseCurrent = getChargerCurrentMa(currentCharger, { size, type: newSlotForm.type });
    const targetPct = targetMode === 'half' ? 50 : 100;
    const netCapacityNeeded = capacity * Math.max(0.05, (targetPct / 100) - (initialCharge / 100));
    if (!baseCurrent) return null;
    const decimalHours = (netCapacityNeeded / baseCurrent) * efficiency;
    return { totalSec: Math.round(decimalHours * 3600), effectiveCurrentMa: baseCurrent };
  };

  const handleOpenAddSlotModal = (slotIndex = null) => {
    addSlotTriggerRef.current = document.activeElement;
    setSelectedBatteryProfileId('');
    setTargetSlotIndex(typeof slotIndex === 'number' ? slotIndex : null);
    
    const compatibleSizes = currentCharger.supported_slot_types || ['AA/AAA Combined'];
    const supportedChemistries = getSupportedBatteryChemistries(currentCharger);
    let initialSize = 'AA';
    if (compatibleSizes.length > 0) {
      const types = compatibleSizes;
      if (types.includes('AA/AAA Combined') || types.includes('AA')) {
        initialSize = 'AA';
      } else if (types.includes('AAA')) {
        initialSize = 'AAA';
      } else if (types.includes('18650')) {
        initialSize = '18650';
      } else if (types.includes('C')) {
        initialSize = 'C';
      } else if (types.includes('D')) {
        initialSize = 'D';
      }
    }

    setNewSlotForm({
      slotLabel: '',
      size: initialSize,
      type: supportedChemistries[0] || 'NiMH',
      capacity: '',
      voltage: '',
      initialCharge: 0,
      efficiency: settings.defaultEfficiency,
      targetMode: 'full'
    });
    setAddSlotError('');
    setIsAddModalOpen(true);
  };

  const handleCloseAddSlotModal = () => {
    setIsAddModalOpen(false);
    window.requestAnimationFrame(() => addSlotTriggerRef.current?.focus());
  };

  useEffect(() => {
    if (!isAddModalOpen) return undefined;
    const dialog = addSlotModalRef.current;
    const focusable = dialog?.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
    focusable?.[0]?.focus();
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        handleCloseAddSlotModal();
        return;
      }
      if (event.key !== 'Tab' || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isAddModalOpen]);

  const compatibleBatteryProfiles = useMemo(() => {
    return batteryProfiles.filter(profile => isBatteryCompatibleWithCharger(profile, currentCharger));
  }, [batteryProfiles, currentCharger]);

  const handleBatteryProfileSelect = (e) => {
    const pId = e.target.value;
    setSelectedBatteryProfileId(pId);
    setAddSlotError('');
    if (!pId) {
      return;
    }
    const p = batteryProfiles.find(item => item.id === pId);
    if (p) {
      if (!isBatteryCompatibleWithCharger(p, currentCharger)) {
        setAddSlotError(t('errorIncompatibleBattery'));
        return;
      }
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

  const handleSlotFormChange = (field, val) => {
    setNewSlotForm(prev => {
      const updated = { ...prev, [field]: val };
      if (field === 'type' && !isBatteryCompatibleWithCharger(updated, currentCharger)) {
        const nextCompatibleSize = AVAILABLE_SLOT_TYPES.find(size =>
          size !== 'AA/AAA Combined' &&
          isBatteryCompatibleWithCharger({ ...updated, size }, currentCharger)
        );
        if (nextCompatibleSize) updated.size = nextCompatibleSize;
      }
      if (field === 'size' || field === 'type' || field === 'voltage') {
        if (!isBatteryCompatibleWithCharger(updated, currentCharger)) {
          setAddSlotError(t('errorIncompatibleBattery'));
        } else {
          setAddSlotError('');
        }
      }
      return updated;
    });
  };

  const handleAddSlotSubmit = (e) => {
    e.preventDefault();
    const selectedProfile = selectedBatteryProfileId
      ? batteryProfiles.find(profile => profile.id === selectedBatteryProfileId)
      : null;
    if (selectedBatteryProfileId && !selectedProfile) {
      setAddSlotError(t('errorIncompatibleBattery'));
      return;
    }
    const batteryToUse = selectedProfile
      ? {
        ...newSlotForm,
        slotLabel: selectedProfile.name,
        size: selectedProfile.size,
        type: selectedProfile.type,
        capacity: selectedProfile.capacity,
        voltage: selectedProfile.voltage
      }
      : newSlotForm;

    if (!selectedProfile && (!batteryToUse.capacity || !batteryToUse.voltage || !batteryToUse.slotLabel)) {
      setAddSlotError(t('errorProfileRequired'));
      return;
    }
    if (!batteryToUse.capacity || batteryToUse.capacity <= 0) {
      setAddSlotError('Capacity must be greater than 0 mAh.');
      return;
    }
    if (!batteryToUse.voltage || batteryToUse.voltage <= 0) {
      setAddSlotError('Voltage must be a valid number.');
      return;
    }

    if (!isBatteryCompatibleWithCharger(batteryToUse, currentCharger)) {
      setAddSlotError(t('errorIncompatibleBattery'));
      return;
    }
    if (!getChargerCurrentMa(currentCharger, batteryToUse)) {
      setAddSlotError(t('errorChargerCurrentMissing'));
      return;
    }

    const slotCount = currentCharger.slotCount || 4;
    const occupiedIndices = activeSlots.map(s => s.slotIndex);
    let assignedIndex = targetSlotIndex;
    
    if (assignedIndex === null || occupiedIndices.includes(assignedIndex)) {
      assignedIndex = -1;
      for (let i = 0; i < slotCount; i++) {
        if (!occupiedIndices.includes(i)) {
          assignedIndex = i;
          break;
        }
      }
    }

    if (assignedIndex === -1 || assignedIndex >= slotCount) {
      setAddSlotError('All charging slots are currently full.');
      return;
    }

    const { slotLabel, size, type, capacity, voltage, initialCharge, efficiency, targetMode } = batteryToUse;

    let profileIdToUse = selectedBatteryProfileId;

    if (!selectedBatteryProfileId && slotLabel) {
      const trimmedLabel = slotLabel.trim();
      const existingProfile = batteryProfiles.find(p => 
        p.name.trim().toLowerCase() === trimmedLabel.toLowerCase() &&
        p.size === size &&
        p.type === (type || 'NiMH') &&
        Number(p.capacity) === Number(capacity) &&
        Number(p.voltage) === Number(voltage)
      );
      if (existingProfile) {
        setAddSlotError(t('errorBatteryExists'));
        return;
      }
      const newProfile = {
        id: 'bp-' + Date.now(),
        name: trimmedLabel,
        size,
        type: type || 'NiMH',
        capacity: Number(capacity),
        voltage: Number(voltage),
        maxCurrentMa: Number(capacity),
        thermalLimitC: 50,
        condition: 'New',
        priorUsageValue: 0,
        priorUsageUnit: 'Months'
      };
      setBatteryProfiles(prev => [...prev, newProfile]);
      profileIdToUse = newProfile.id;
    }

    const calc = calculateChargeTime(size, Number(capacity), initialCharge, efficiency, targetMode);
    if (!calc) {
      setAddSlotError(t('errorChargerCurrentMissing'));
      return;
    }

    const newSlot = {
      id: 'slot-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      slotIndex: assignedIndex,
      profileId: profileIdToUse || null,
      label: slotLabel || `${size} - ${capacity}mAh`,
      size, type, capacity: Number(capacity), voltage: Number(voltage),
      initialCharge: Number(initialCharge), efficiency: Number(efficiency),
      targetMode,
      chargerCurrentMa: calc.effectiveCurrentMa, totalSec: calc.totalSec,
      elapsedSec: 0, remainingSec: calc.totalSec, overchargeSec: 0,
      startTime: Date.now(), status: 'charging', alertTriggered: false
    };

    setActiveSlots(prev => [...prev, newSlot]);
    handleCloseAddSlotModal();
    setSelectedBatteryProfileId('');
    setTargetSlotIndex(null);
    setAddSlotError('');
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
    const remainingCompletedSlots = activeSlots.filter(slot => slot.id !== id && slot.status === 'completed');
    if (remainingCompletedSlots.length === 0) stopContinuousAlarmSound();
    const targetSlot = activeSlots.find(s => s.id === id);
    if (saveToHistory && targetSlot) {
      const completed = targetSlot.status === 'completed';
      const historyItem = { 
        ...targetSlot, 
        status: completed ? 'completed' : 'stopped',
        finishedAt: new Date().toISOString(), 
        actualChargeSec: targetSlot.elapsedSec,
        overcharged: completed && targetSlot.overchargeSec > 0
      };
      setHistory(h => [historyItem, ...h]);
    }
    setActiveSlots(prev => prev.filter(s => s.id !== id));
  };

  const handleResetSlot = (id) => {
    const otherCompletedSlots = activeSlots.some(slot => slot.id !== id && slot.status === 'completed');
    if (!otherCompletedSlots) stopContinuousAlarmSound();
    setActiveSlots(prev => prev.map(slot => {
      if (slot.id !== id) return slot;
      return { ...slot, startTime: Date.now(), elapsedSec: 0, remainingSec: slot.totalSec, overchargeSec: 0, status: 'charging', alertTriggered: false };
    }));
  };

  const handleSaveBatteryProfile = (e) => {
    e.preventDefault();
    if (!editingBatteryProfile) return;
    let errors = {};
    if (!editingBatteryProfile.name || editingBatteryProfile.name.trim() === '') errors.name = 'Battery profile name is required.';
    if (!editingBatteryProfile.size) errors.size = 'Battery size selection is required.';
    if (!editingBatteryProfile.type) errors.type = 'Chemistry type selection is required.';
    if (!editingBatteryProfile.capacity || editingBatteryProfile.capacity <= 0) errors.capacity = 'Capacity must be greater than 0 mAh.';
    if (!editingBatteryProfile.voltage || editingBatteryProfile.voltage <= 0) errors.voltage = 'Voltage must be a valid positive number.';
    if (!editingBatteryProfile.condition) errors.condition = 'Battery condition is required.';
    if (editingBatteryProfile.condition === 'Used' && (editingBatteryProfile.priorUsageValue === undefined || editingBatteryProfile.priorUsageValue < 0)) {
      errors.priorUsageValue = 'Prior usage duration is required for used batteries.';
    }

    if (Object.keys(errors).length === 0) {
      const isDuplicate = batteryProfiles.some(p => {
        if (editingBatteryProfile.id && p.id === editingBatteryProfile.id) return false;
        return (
          p.name.trim().toLowerCase() === editingBatteryProfile.name.trim().toLowerCase() &&
          p.size === editingBatteryProfile.size &&
          p.type === editingBatteryProfile.type &&
          Number(p.capacity) === Number(editingBatteryProfile.capacity) &&
          Number(p.voltage) === Number(editingBatteryProfile.voltage)
        );
      });
      if (isDuplicate) {
        errors.name = t('errorBatteryExists');
      }
    }

    if (Object.keys(errors).length > 0) {
      setBatteryProfileErrors(errors);
      return;
    }
    setBatteryProfileErrors({});

    if (editingBatteryProfile.id) {
      setBatteryProfiles(prev => prev.map(p => p.id === editingBatteryProfile.id ? editingBatteryProfile : p));
    } else {
      const created = { ...editingBatteryProfile, id: 'bp-' + Date.now() };
      setBatteryProfiles(prev => [...prev, created]);
    }
    setIsBatteryProfileModalOpen(false);
    setEditingBatteryProfile(null);
  };

  const handleOpenNewCharger = () => {
    setEditingCharger({
      name: '',
      inputV: 100,
      inputVMax: 240,
      inputA: 0.3,
      inputHz: '50/60Hz',
      outputV: 1.5,
      aaCurrentMa: '',
      aaaCurrentMa: '',
      slotCurrentsMa: {},
      slotCount: 4,
      isPaired: false,
      supported_slot_types: ['AA/AAA Combined'],
      supported_battery_types: ['NiMH'],
      notes: ''
    });
    setChargerErrors({});
    setIsChargerModalOpen(true);
  };

  const handleToggleChargerSlotType = (slotType) => {
    setEditingCharger(prev => {
      const currentTypes = prev.supported_slot_types || [];
      let updatedTypes;
      if (currentTypes.includes(slotType)) {
        updatedTypes = currentTypes.filter(t => t !== slotType);
      } else {
        updatedTypes = [...currentTypes, slotType];
      }
      return { ...prev, supported_slot_types: updatedTypes };
    });
  };

  const handleToggleChargerChemistry = (chemistry) => {
    setEditingCharger(prev => {
      const currentTypes = prev.supported_battery_types || [];
      const supportedTypes = currentTypes.includes(chemistry)
        ? currentTypes.filter(type => type !== chemistry)
        : [...currentTypes, chemistry];
      return { ...prev, supported_battery_types: supportedTypes };
    });
  };

  const handleSaveCharger = (e) => {
    e.preventDefault();
    if (!editingCharger) return;
    let errors = {};
    if (!editingCharger.name || editingCharger.name.trim() === '') errors.name = 'Charger name is required.';
    if (!editingCharger.aaCurrentMa || editingCharger.aaCurrentMa <= 0) errors.aaCurrentMa = 'AA output current must be > 0 mA.';
    if (!editingCharger.aaaCurrentMa || editingCharger.aaaCurrentMa <= 0) errors.aaaCurrentMa = 'AAA output current must be > 0 mA.';
    if (!editingCharger.slotCount || editingCharger.slotCount <= 0) errors.slotCount = 'Slot count must be at least 1.';
    if (!editingCharger.supported_slot_types || editingCharger.supported_slot_types.length === 0) {
      errors.supported_slot_types = 'At least one supported slot type must be selected.';
    }
    if (!editingCharger.supported_battery_types || editingCharger.supported_battery_types.length === 0) {
      errors.supported_battery_types = 'At least one rechargeable battery chemistry must be selected.';
    }

    if (Object.keys(errors).length === 0) {
      const isDuplicate = chargers.some(c => {
        if (editingCharger.id && c.id === editingCharger.id) return false;
        return (
          c.name.trim().toLowerCase() === editingCharger.name.trim().toLowerCase() &&
          Number(c.aaCurrentMa) === Number(editingCharger.aaCurrentMa) &&
          Number(c.aaaCurrentMa) === Number(editingCharger.aaaCurrentMa) &&
          Number(c.outputV) === Number(editingCharger.outputV) &&
          Number(c.inputV) === Number(editingCharger.inputV) &&
          Number(c.inputVMax) === Number(editingCharger.inputVMax) &&
          Number(c.inputA) === Number(editingCharger.inputA) &&
          c.inputHz === editingCharger.inputHz &&
          Number(c.slotCount) === Number(editingCharger.slotCount) &&
          Boolean(c.isPaired) === Boolean(editingCharger.isPaired) &&
          JSON.stringify([...(c.supported_slot_types || [])].sort()) ===
            JSON.stringify([...(editingCharger.supported_slot_types || [])].sort()) &&
          JSON.stringify([...getSupportedBatteryChemistries(c)].sort()) ===
            JSON.stringify([...getSupportedBatteryChemistries(editingCharger)].sort()) &&
          JSON.stringify(Object.entries(c.slotCurrentsMa || {}).sort()) ===
            JSON.stringify(Object.entries(editingCharger.slotCurrentsMa || {}).sort())
        );
      });
      if (isDuplicate) {
        errors.name = t('errorChargerExists');
      }
    }

    if (Object.keys(errors).length > 0) {
      setChargerErrors(errors);
      return;
    }
    setChargerErrors({});

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

  const statisticsAnalytics = useMemo(() => {
    const completedHistory = history.filter(item => item.status === 'completed');
    const stoppedHistory = history.filter(item => item.status === 'stopped');
    const totalCycles = completedHistory.length;

    const profileStats = batteryProfiles.map(p => {
      const priorMonths = p.condition === 'Used' 
        ? (p.priorUsageUnit === 'Years' ? (Number(p.priorUsageValue) || 0) * 12 : (Number(p.priorUsageValue) || 0)) 
        : 0;
      const pCycles = completedHistory.filter(h => h.profileId === p.id || h.label === p.name).length;
      const soh = Math.max(15, Math.round(100 - (priorMonths * 0.65) - (pCycles * 0.18)));
      const currentCapacity = Math.round(p.capacity * (soh / 100));
      const fullRuntimeHours = ((currentCapacity / 500)).toFixed(1);
      const halfRuntimeHours = ((currentCapacity * 0.5 / 500)).toFixed(1);

      return {
        ...p,
        priorMonths,
        cycles: pCycles,
        soh,
        currentCapacity,
        fullRuntimeHours,
        halfRuntimeHours
      };
    });

    const avgSoH = profileStats.length > 0 
      ? Math.round(profileStats.reduce((acc, curr) => acc + curr.soh, 0) / profileStats.length) 
      : 100;

    return {
      totalCycles,
      stoppedTimerCount: stoppedHistory.length,
      profileStats,
      avgSoH
    };
  }, [batteryProfiles, history]);

  if (!termsAccepted) {
    const termsWereUpdated = Boolean(termsAcceptance?.version);
    return (
      <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased p-4 sm:p-8">
        <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-3xl items-center justify-center">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="terms-dialog-title"
            aria-describedby="terms-gate-notice"
            className="flex max-h-[calc(100vh-2rem)] w-full flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl"
          >
            <header className="space-y-3 border-b border-slate-700 p-5 sm:p-7">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 shrink-0 text-cyan-400" />
                <h1 id="terms-dialog-title" className="text-xl font-extrabold">{t('termsTitle')}</h1>
              </div>
              <p id="terms-gate-notice" className="text-sm leading-relaxed text-slate-300">
                {termsWereUpdated ? t('termsUpdateNotice') : t('termsFirstUseNotice')}
              </p>
              <p className="text-xs text-slate-400">
                {t('termsVersion')} {TERMS_VERSION} · {t('termsEffective')} {TERMS_EFFECTIVE_DATE}
              </p>
            </header>

            {termsDeclined ? (
              <div className="space-y-5 p-5 sm:p-7">
                <div role="alert" className="rounded-2xl border border-amber-500/40 bg-amber-950/40 p-4 text-sm leading-relaxed text-amber-100">
                  <h2 className="mb-2 font-bold">{t('termsDeclinedTitle')}</h2>
                  <p>{t('termsDeclinedMessage')}</p>
                </div>
                <button
                  ref={termsReviewButtonRef}
                  type="button"
                  onClick={() => {
                    setTermsDeclined(false);
                    setTermsAgreed(false);
                  }}
                  className="w-full rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-bold text-slate-100 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
                >
                  {t('termsReview')}
                </button>
              </div>
            ) : (
              <>
                <div
                  className="overflow-y-auto p-5 sm:p-7"
                  role="region"
                  aria-label={t('termsTitle')}
                  tabIndex={0}
                >
                  {renderTermsDocument()}
                </div>
                <footer className="space-y-4 border-t border-slate-700 bg-slate-900 p-5 sm:p-7">
                  <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-slate-200">
                    <input
                      ref={termsCheckboxRef}
                      type="checkbox"
                      checked={termsAgreed}
                      onChange={event => setTermsAgreed(event.target.checked)}
                      className="mt-1 h-4 w-4 shrink-0 accent-cyan-500"
                    />
                    <span>{t('termsAgreeCheckbox')}</span>
                  </label>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => {
                        setTermsDeclined(true);
                        setTermsAgreed(false);
                      }}
                      className="rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
                    >
                      {t('termsDecline')}
                    </button>
                    <button
                      type="button"
                      disabled={!termsAgreed}
                      onClick={acceptCurrentTerms}
                      className="rounded-xl bg-cyan-600 px-4 py-3 text-sm font-extrabold text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                    >
                      {t('termsAccept')}
                    </button>
                  </div>
                </footer>
              </>
            )}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-36 selection:bg-blue-500 selection:text-white pt-[env(safe-area-inset-top)]">
      <audio ref={alarmAudioRef} src={getAppAssetUrl('alarm.mp3')} preload="auto" loop playsInline />
      
      <style>{`
        @keyframes jiggle {
          0% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-14deg) scale(1.15); }
          50% { transform: rotate(14deg) scale(1.15); }
          75% { transform: rotate(-7deg) scale(1.08); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .animate-jiggle {
          animation: jiggle 0.5s ease-in-out infinite;
        }
        @keyframes wave {
          0% { transform: translateX(0); }
          50% { transform: translateX(-25%); }
          100% { transform: translateX(-50%); }
        }
        .animate-wave {
          animation: wave 3s linear infinite;
        }
        @keyframes pulse-blue {
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.35); }
          50% { box-shadow: 0 0 35px rgba(59, 130, 246, 0.7); }
        }
        .timer-active-glow {
          animation: pulse-blue 2s infinite;
        }
      `}</style>

      {termsStorageError && (
        <p role="status" className="mx-auto mt-4 max-w-4xl rounded-xl border border-amber-500/40 bg-amber-950/50 p-3 text-xs leading-relaxed text-amber-100">
          {t('termsStorageError')}
        </p>
      )}

      {globalErrorMsg && (
        <div role="alert" aria-live="assertive" className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] bg-red-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 rtl:space-x-reverse animate-bounce border border-red-400">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{globalErrorMsg}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-slate-900/60 backdrop-blur-2xl border-b border-slate-800/80 px-4 py-3.5 sm:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 border border-cyan-400/30">
              <Zap className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <h1 className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
                  {t('title')}
                </h1>
                <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">PRO</span>
              </div>
              <p className="text-xs text-slate-400 font-medium">{t('subtitle')}</p>
            </div>
          </div>

          <div className="flex min-w-0 items-center justify-end space-x-3 rtl:space-x-reverse">
            <div className="flex min-w-0 max-w-full items-center space-x-1.5 rtl:space-x-reverse bg-slate-900/80 backdrop-blur-xl px-3 py-2 rounded-2xl border border-slate-700/80 shadow-lg hover:border-cyan-500/50 transition-colors">
              <Globe className="w-4 h-4 text-cyan-400" />
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="min-w-0 max-w-full bg-transparent text-xs text-cyan-300 font-bold border-0 focus:ring-0 cursor-pointer outline-none"
              >
                <option value="en" className="bg-slate-900">EN (English)</option>
                <option value="fa" className="bg-slate-900">FA (فارسی)</option>
                <option value="it" className="bg-slate-900">IT (Italiano)</option>
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
              onClick={() => handleOpenAddSlotModal(null)}
              className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-bold px-5 py-2.5 rounded-2xl shadow-lg shadow-blue-500/30 backdrop-blur-xl border border-blue-400/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t('addSlot')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-6">
        
        {/* FLOATING MAIN TAB NAVIGATION */}
        <div className="sticky top-[73px] z-30 bg-slate-950/80 backdrop-blur-2xl py-3 mb-6 border-b border-slate-800/80 shadow-xl overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-2.5 rtl:space-x-reverse">
            {[
              { id: 'dashboard', label: t('dashboard'), icon: BatteryCharging, count: activeSlots.length },
              { id: 'statistics', label: t('statistics'), icon: TrendingUp },
              { id: 'battery-profiles', label: t('batteryProfiles'), icon: Battery, count: batteryProfiles.length },
              { id: 'chargers', label: t('chargers'), icon: Layers, count: chargers.length },
              { id: 'safety', label: t('safety'), icon: ShieldCheck },
              { id: 'history', label: t('history'), icon: Clock },
              { id: 'contact', label: t('contactUs'), icon: MessageSquare },
              { id: 'settings', label: t('settings'), icon: Settings }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-4 py-2.5 rounded-2xl font-semibold text-xs transition-all duration-300 whitespace-nowrap cursor-pointer backdrop-blur-xl ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600/40 to-cyan-500/30 text-blue-200 border border-blue-500/50 shadow-xl shadow-blue-500/20 transform scale-[1.02]' 
                      : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:text-slate-200 hover:bg-slate-900/90'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-cyan-400 scale-110' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-1.5 px-2 py-0.5 text-[10px] font-black rounded-full bg-blue-500 text-slate-950 animate-pulse">{tab.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="p-3.5 bg-slate-800/90 backdrop-blur-xl rounded-2xl text-blue-400 border border-slate-700/80 shadow-inner">
                  <Zap className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <h2 className="font-extrabold text-slate-100 text-sm sm:text-base">{currentCharger.name}</h2>
                    <span className={`text-[10px] uppercase font-extrabold px-3 py-0.5 rounded-full ${currentCharger.isPaired ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'}`}>
                      {currentCharger.isPaired ? 'Paired' : 'Independent'} ({currentCharger.slotCount || 4} Slots)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-1.5">
                    <span>{t('activeCharger')} <strong className="text-blue-400">AA: {currentCharger.aaCurrentMa}mA</strong> | <strong className="text-amber-400">AAA: {currentCharger.aaaCurrentMa}mA</strong></span>
                    <span className="text-slate-600">•</span>
                    <span className="text-cyan-400 font-semibold">
                      Supported: {(currentCharger.supported_slot_types || ['AA/AAA Combined']).join(', ')}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse w-full sm:w-auto">
                <select 
                  value={activeChargerId}
                  onChange={(e) => handleAttemptChangeCharger(e.target.value)}
                  className="bg-slate-950/90 backdrop-blur-xl border border-slate-700/80 text-xs text-cyan-300 font-bold rounded-2xl p-3 w-full sm:w-auto focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer outline-none"
                >
                  {chargers.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name} ({c.slotCount || 4} Slots)</option>)}
                </select>
              </div>
            </div>

            <div role="note" className="rounded-2xl border border-amber-500/40 bg-amber-950/40 p-4 text-xs leading-relaxed text-amber-100">
              <ShieldAlert className="mr-2 inline h-4 w-4 align-text-bottom text-amber-300" />
              {copy.safetyNotice}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: currentCharger.slotCount || 4 }).map((_, index) => {
                const slot = activeSlots.find(s => s.slotIndex === index);
                const slotColor = SLOT_COLORS[index % SLOT_COLORS.length];

                if (!slot) {
                  return (
                    <div key={`empty-slot-${index}`} className={`rounded-3xl bg-slate-900/40 backdrop-blur-2xl border-2 border-dashed ${slotColor.border} shadow-2xl p-6 flex flex-col items-center justify-between min-h-[380px] transform hover:scale-[1.01] transition-all duration-300`}>
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${slotColor.badge}`}>
                          Slot {index + 1} (Empty)
                        </span>
                        <span className="text-[10px] font-semibold text-cyan-400/80 bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-500/20">
                          {(currentCharger.supported_slot_types || ['AA/AAA Combined']).join(', ')}
                        </span>
                      </div>

                      <div className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed ${slotColor.border} ${slotColor.bg} w-24 h-40 shadow-inner my-auto p-4 text-center`}>
                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 rounded-t-md ${slotColor.border.replace('border-', 'bg-').split('/')[0]}`} />
                        <Battery className={`w-8 h-8 ${slotColor.text} mb-2 opacity-60`} />
                        <span className={`text-[11px] font-bold ${slotColor.text}`}>Ready</span>
                      </div>

                      <button 
                        onClick={() => handleOpenAddSlotModal(index)}
                        className={`w-full py-3 px-4 rounded-2xl font-bold text-xs bg-gradient-to-r ${slotColor.bar} text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer`}
                      >
                        <Plus className="w-4 h-4" />
                        <span>{t('addSlot')}</span>
                      </button>
                    </div>
                  );
                }

                const isAA = slot.size === 'AA';
                const pct = Math.min(100, Math.floor((slot.elapsedSec / slot.totalSec) * 100));
                const isOvercharging = slot.elapsedSec > slot.totalSec;
                const isCompleted = slot.status === 'completed' || pct >= 100;
                const isRunning = slot.status === 'charging';

                return (
                  <div key={slot.id} className={`rounded-3xl bg-slate-900/70 backdrop-blur-2xl border-2 ${slotColor.border} ${isRunning ? 'timer-active-glow' : slotColor.ring} shadow-2xl p-6 flex flex-col justify-between transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}>
                    
                    {isCompleted && (
                      <div className="absolute inset-0 z-20 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in space-y-3">
                        <div className="w-14 h-24 bg-red-600/90 border-4 border-red-400 rounded-2xl flex flex-col items-center justify-center shadow-2xl animate-pulse ring-8 ring-red-500/40">
                          <div className="w-3 h-2 bg-red-400 rounded-t-sm -mt-2 mb-1" />
                          <Zap className="w-6 h-6 text-white animate-bounce" />
                        </div>
                        
                        <div>
                          <h4 className="font-extrabold text-white text-sm tracking-tight">{slot.label}</h4>
                          <p className="text-[11px] text-red-300 font-medium mt-0.5">
                            Slot {index + 1}: {slot.size} • {slot.type} • {slot.capacity}mAh • {slot.voltage}V ({slot.targetMode === 'half' ? '50% Target' : '100% Target'})
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                          <span className="text-[10px] font-black uppercase bg-red-500/20 text-red-400 px-3 py-1 rounded-full border border-red-500/40 animate-pulse">
                            {copy.completed}
                          </span>
                          <button 
                            onClick={() => handleRemoveSlot(slot.id, true)} 
                            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer border border-red-400/50"
                          >
                            {copy.dismiss}
                          </button>
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between items-start mb-5">
                        <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                          <div className={`relative flex items-center justify-center rounded-2xl overflow-hidden mt-1.5 shadow-xl ${isAA ? 'w-11 h-18 bg-blue-950/70 backdrop-blur-md border-2 border-blue-500/80 text-blue-200' : 'w-9 h-15 bg-amber-950/70 backdrop-blur-md border-2 border-amber-500/80 text-amber-200'}`}>
                            <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-2 rounded-t-full ${isAA ? 'bg-blue-500' : 'bg-amber-500'}`} />
                            
                            <div 
                              className={`absolute bottom-0 left-0 right-0 overflow-hidden transition-all duration-700 ease-linear ${isOvercharging ? 'bg-red-500 animate-pulse' : slotColor.bar.includes('blue') ? 'bg-blue-500/90' : slotColor.bar.includes('emerald') ? 'bg-emerald-500/90' : slotColor.bar.includes('purple') ? 'bg-purple-500/90' : slotColor.bar.includes('amber') ? 'bg-amber-500/90' : 'bg-cyan-500/90'}`}
                              style={{ height: `${pct}%` }}
                            >
                              <div className="absolute w-[200%] h-3 -top-1.5 left-0 bg-white/40 rounded-full animate-wave" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            <span className="relative z-10 text-[10px] font-black drop-shadow-md text-white">{slot.size}</span>
                          </div>

                          <div>
                            <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${slotColor.badge}`}>Slot {index + 1}</span>
                              <h3 className="font-extrabold text-slate-100 text-sm tracking-tight">{slot.label}</h3>
                            </div>
                            <span className={`inline-block mt-1 text-[10px] font-bold px-3 py-0.5 rounded-full ${slotColor.badge}`}>
                              {slot.size} • {slot.type} • {slot.targetMode === 'half' ? '50% Mode' : '100% Mode'}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-sm ${isOvercharging ? 'bg-red-950/90 text-red-400 border border-red-500/60 animate-bounce' : isCompleted ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/60' : 'bg-blue-950/90 text-blue-400 border border-blue-500/60'}`}>
                          {isOvercharging ? t('overcharging') : isCompleted ? t('done') : `${pct}%`}
                        </span>
                      </div>

                      <div className="relative w-full bg-slate-950/90 backdrop-blur-2xl rounded-3xl p-6 border-2 border-slate-700/80 mb-5 overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[140px]">
                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-12 h-3.5 rounded-t-lg ${isOvercharging ? 'bg-red-500' : slotColor.border.replace('border-', 'bg-').split('/')[0]}`} />
                        
                        <div 
                          className={`absolute bottom-0 left-0 right-0 transition-all duration-700 ease-linear opacity-25 ${isOvercharging ? 'bg-red-500 animate-pulse' : slotColor.bar.includes('blue') ? 'bg-blue-500' : slotColor.bar.includes('emerald') ? 'bg-emerald-500' : slotColor.bar.includes('purple') ? 'bg-purple-500' : slotColor.bar.includes('amber') ? 'bg-amber-500' : 'bg-cyan-500'}`}
                          style={{ height: `${pct}%` }}
                        >
                          <div className="absolute w-[200%] h-4 -top-2 left-0 bg-white/40 rounded-full animate-wave" />
                        </div>

                        <div className="relative z-10 text-center">
                          <div className="text-xs text-slate-300 font-extrabold mb-1.5 tracking-wider uppercase drop-shadow">
                            {isOvercharging ? t('timeExceeded') : t('timeRemaining')}
                          </div>
                          <div className={`text-2xl sm:text-3xl font-black font-mono tracking-tight drop-shadow-md ${isOvercharging ? 'text-red-300 animate-pulse' : 'text-white'}`}>
                            {isOvercharging ? `+${formatTime(slot.overchargeSec)}` : formatTime(slot.remainingSec)}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-400">{t('progress')}</span>
                          <span className={slotColor.text + ' font-bold font-mono'}>{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-950/80 rounded-full h-3 overflow-hidden border border-slate-800/80 p-0.5 shadow-inner backdrop-blur-md">
                          <div className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${slotColor.bar} shadow-lg`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse pt-3 border-t border-slate-800/80">
                      <button onClick={() => handleTogglePause(slot.id)} className="flex-1 bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-xl text-slate-200 font-semibold text-xs py-2.5 rounded-2xl transition-all hover:scale-[1.02] active:scale-98 cursor-pointer shadow border border-slate-700/50">
                        {slot.status === 'charging' ? t('pause') : t('resume')}
                      </button>
                      <button onClick={() => handleResetSlot(slot.id)} title="Reset Timer" className="p-2.5 bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-xl text-slate-300 rounded-2xl transition-all hover:rotate-45 cursor-pointer shadow border border-slate-700/50">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleRemoveSlot(slot.id, true)} className="flex-1 bg-slate-800/80 hover:bg-red-950/90 backdrop-blur-xl text-emerald-400 hover:text-red-300 font-semibold text-xs py-2.5 rounded-2xl transition-all hover:scale-[1.02] active:scale-98 cursor-pointer shadow border border-slate-700/50">
                        {copy.stopTimer}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: STATISTICS */}
        {activeTab === 'statistics' && (
          <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2.5 rtl:space-x-reverse">
                  <TrendingUp className="text-cyan-400 w-6 h-6 animate-pulse" />
                  <span>Battery Profile Estimates & Statistics</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">{copy.modeledHealthDescription} {copy.runtimeEstimateDescription}</p>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-slate-950/90 border border-slate-700/80 shadow-inner flex items-center space-x-3 rtl:space-x-reverse">
                <span className="text-xs text-slate-400 font-semibold">{copy.modeledHealth}:</span>
                <span className={`text-lg font-black font-mono ${statisticsAnalytics.avgSoH >= 80 ? 'text-emerald-400' : statisticsAnalytics.avgSoH >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  {statisticsAnalytics.avgSoH}%
                </span>
              </div>
            </div>

            {statisticsAnalytics.profileStats.some(p => p.soh <= 50) && (
              <div className={`p-5 rounded-3xl border shadow-2xl flex items-start space-x-4 rtl:space-x-reverse ${statisticsAnalytics.profileStats.some(p => p.soh <= 30) ? 'bg-red-950/90 border-red-500/80 text-red-200 animate-pulse' : 'bg-amber-950/90 border-amber-500/80 text-amber-200'}`}>
                {statisticsAnalytics.profileStats.some(p => p.soh <= 30) ? (
                  <ShieldAlert className="w-7 h-7 text-red-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-7 h-7 text-amber-400 shrink-0 mt-0.5" />
                )}
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base">
                    {statisticsAnalytics.profileStats.some(p => p.soh <= 30) ? t('alert30Title') : t('alert50Title')}
                  </h4>
                  <p className="text-xs mt-1 leading-relaxed opacity-90">
                    {statisticsAnalytics.profileStats.some(p => p.soh <= 30) ? t('alert30Desc') : t('alert50Desc')}
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{copy.completedTimerEstimates}</span>
                <div className="text-3xl font-black text-cyan-400 font-mono">{statisticsAnalytics.totalCycles}</div>
                <p className="text-[11px] text-slate-500">{copy.modeledHealthDescription}</p>
              </div>

              <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{copy.stoppedTimerEstimates}</span>
                <div className="text-3xl font-black text-slate-300 font-mono">{statisticsAnalytics.stoppedTimerCount}</div>
                <p className="text-[11px] text-slate-500">Stopped or cancelled before the estimated target; not counted as completed.</p>
              </div>

              <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{copy.modeledHealth}</span>
                <div className="text-3xl font-black text-emerald-400 font-mono">{statisticsAnalytics.avgSoH}%</div>
                <p className="text-[11px] text-slate-500">{copy.modeledHealthDescription}</p>
              </div>

              <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 shadow-2xl space-y-2">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t('batteryProfiles')}</span>
                <div className="text-3xl font-black text-amber-400 font-mono">{statisticsAnalytics.profileStats.length}</div>
                <p className="text-[11px] text-slate-500">{copy.profilesStoredDescription}</p>
              </div>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2 rtl:space-x-reverse">
                <BatteryFull className="w-5 h-5 text-blue-400" />
                <span>Profile-Specific Health & Estimated Runtime Projections</span>
              </h3>
              <p className="text-[11px] leading-relaxed text-amber-100">{copy.modeledHealthDescription} {copy.runtimeEstimateDescription}</p>

              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right text-xs">
                  <thead className="bg-slate-950/90 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Profile Name / Size</th>
                      <th className="p-4">Condition</th>
                      <th className="p-4">{t('sohTitle')}</th>
                      <th className="p-4">Current Capacity</th>
                      <th className="p-4">Full Charge Runtime (100%)</th>
                      <th className="p-4">Half Charge Runtime (50%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {statisticsAnalytics.profileStats.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="p-4 font-bold text-slate-200">
                          {p.name} <span className="text-[10px] text-cyan-400 font-normal">({p.size})</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${p.condition === 'Used' ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'}`}>
                            {p.condition} ({p.priorMonths}m)
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`font-black font-mono ${p.soh >= 80 ? 'text-emerald-400' : p.soh >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                            {p.soh}%
                          </span>
                        </td>
                        <td className="p-4 font-mono text-cyan-300 font-bold">{p.currentCapacity} mAh</td>
                        <td className="p-4 font-mono text-slate-300">{p.fullRuntimeHours} hrs</td>
                        <td className="p-4 font-mono text-slate-300">{p.halfRuntimeHours} hrs</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2 rtl:space-x-reverse">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>{t('healthTrend')}</span>
              </h3>
              <p className="text-xs text-slate-400">Comparing expected theoretical capacity retention curve vs. actual battery fleet utilization wear.</p>

              <div className="bg-slate-950/90 rounded-3xl p-6 border border-slate-800/90 space-y-4 shadow-inner">
                {statisticsAnalytics.profileStats.map(p => (
                  <div key={p.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{p.name}</span>
                      <span className={`font-mono font-bold ${p.soh >= 80 ? 'text-emerald-400' : p.soh >= 50 ? 'text-amber-400' : 'text-red-400'}`}>{p.soh}% Capacity Retention</span>
                    </div>
                    <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5 shadow-inner">
                      <div 
                        className={`h-full rounded-full transition-all duration-700 ${p.soh >= 80 ? 'bg-gradient-to-r from-emerald-600 to-teal-400' : p.soh >= 50 ? 'bg-gradient-to-r from-amber-600 to-yellow-400' : 'bg-gradient-to-r from-red-600 to-rose-400'}`}
                        style={{ width: `${p.soh}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: BATTERY PROFILES */}
        {activeTab === 'battery-profiles' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 p-6 rounded-3xl shadow-2xl gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100">{t('batteryProfiles')}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Save, manage, and customize battery chemistry profiles, age condition, and thermal limits.</p>
              </div>
              <button 
                onClick={() => { 
                  setEditingBatteryProfile({ 
                    name: '', 
                    size: '', 
                    type: '', 
                    capacity: '', 
                    voltage: '', 
                    maxCurrentMa: '', 
                    thermalLimitC: '',
                    condition: 'New',
                    priorUsageValue: 0,
                    priorUsageUnit: 'Months'
                  }); 
                  setBatteryProfileErrors({}); 
                  setIsBatteryProfileModalOpen(true); 
                }} 
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/30 flex items-center space-x-2 rtl:space-x-reverse transform hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xl border border-cyan-400/30"
              >
                <Plus className="w-4 h-4" />
                <span>New Battery Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batteryProfiles.map(p => (
                <div key={p.id} className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between shadow-2xl hover:border-blue-500/50 transition-all duration-300">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-extrabold text-slate-100 text-sm tracking-tight">{p.name}</h3>
                      <span className="text-[10px] font-extrabold px-3 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">{p.size}</span>
                    </div>
                    <div className="text-xs text-slate-400 space-y-2 mt-4 bg-slate-950/60 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/80">
                      <div className="flex justify-between"><span>Chemistry:</span> <strong className="text-slate-200">{p.type}</strong></div>
                      <div className="flex justify-between"><span>Capacity:</span> <strong className="text-cyan-300 font-mono">{p.capacity} mAh</strong></div>
                      <div className="flex justify-between"><span>Nominal Voltage:</span> <strong className="text-slate-200 font-mono">{p.voltage}V</strong></div>
                      <div className="flex justify-between"><span>Condition:</span> <strong className={p.condition === 'Used' ? 'text-amber-400' : 'text-emerald-400'}>{p.condition} {p.condition === 'Used' ? `(${p.priorUsageValue || 0} ${p.priorUsageUnit || 'Months'})` : ''}</strong></div>
                      <div className="flex justify-between"><span>Thermal Limit:</span> <strong className="text-red-400 font-mono">{p.thermalLimitC}°C</strong></div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2.5 rtl:space-x-reverse mt-5 pt-4 border-t border-slate-800/80">
                    <button 
                      onClick={() => handleAttemptEditProfile(p)} 
                      className="flex-1 bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-xl font-semibold text-xs py-2.5 rounded-2xl text-slate-200 transition-all hover:scale-[1.02] cursor-pointer shadow border border-slate-700/50"
                    >
                      Edit
                    </button>
                    {batteryProfiles.length > 1 && (
                      <button 
                        onClick={() => handleAttemptDeleteProfile(p.id)} 
                        className="p-2.5 bg-slate-800/80 hover:bg-red-950/90 backdrop-blur-xl text-red-400 rounded-2xl transition-all hover:scale-105 cursor-pointer shadow border border-slate-700/50"
                      >
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
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 p-6 rounded-3xl shadow-2xl gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100">{t('chargers')}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Configure charger channel output currents, slot count capacity, dynamic slot types, and circuit pairing.</p>
              </div>
              <button 
                onClick={handleOpenNewCharger} 
                className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-xs px-6 py-3 rounded-2xl font-bold shadow-lg shadow-blue-500/30 transform hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xl border border-cyan-400/30"
              >
                <Plus className="w-4 h-4 inline mr-1" /> Add Charger
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chargers.map(c => {
                const isActive = c.id === activeChargerId;
                const slotTypes = c.supported_slot_types || ['AA/AAA Combined'];
                return (
                  <div key={c.id} className={`bg-slate-900/70 backdrop-blur-2xl border ${isActive ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-800/80'} rounded-3xl p-6 flex flex-col justify-between shadow-2xl`}>
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-extrabold text-slate-100 text-sm tracking-tight">{c.name}</h3>
                        {isActive && <span className="bg-blue-500 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full shadow backdrop-blur-md">Active</span>}
                      </div>
                      <p className="text-xs text-slate-400 mb-4">{c.notes}</p>
                      
                      <div className="bg-slate-950/80 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/80 text-xs text-slate-300 space-y-2.5 shadow-inner">
                        <div className="flex justify-between"><span>Slot Capacity:</span> <strong className="text-cyan-400 font-mono">{c.slotCount || 4} Slots</strong></div>
                        <div className="flex justify-between"><span>AA Current:</span> <strong className="text-blue-400 font-mono">{c.aaCurrentMa}mA</strong></div>
                        <div className="flex justify-between"><span>AAA Current:</span> <strong className="text-amber-400 font-mono">{c.aaaCurrentMa}mA</strong></div>
                        
                        <div className="pt-2 border-t border-slate-800/80">
                          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Supported Slot Compatibility:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {slotTypes.map((type, idx) => (
                              <span key={idx} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-500/15 text-cyan-300 border border-cyan-500/30">
                                {type}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Supported rechargeable chemistries:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {getSupportedBatteryChemistries(c).map(chemistry => (
                              <span key={chemistry} className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                                {chemistry}
                              </span>
                            ))}
                          </div>
                        </div>

                      </div>
                    </div>
                    <div className="flex space-x-2.5 rtl:space-x-reverse mt-5 pt-4 border-t border-slate-800/80">
                      {!isActive && <button onClick={() => handleAttemptChangeCharger(c.id)} className="flex-1 bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-xl text-xs py-2.5 rounded-2xl text-blue-400 font-semibold transition hover:scale-[1.02] cursor-pointer shadow border border-slate-700/50">Set Active</button>}
                      <button onClick={() => handleAttemptEditCharger(c)} className="p-2.5 bg-slate-800/80 hover:bg-slate-700/90 backdrop-blur-xl text-slate-200 rounded-2xl transition hover:scale-105 cursor-pointer shadow border border-slate-700/50"><Edit3 className="w-4 h-4" /></button>
                      {chargers.length > 1 && <button onClick={() => handleAttemptDeleteCharger(c.id)} className="p-2.5 bg-slate-800/80 hover:bg-red-950/90 backdrop-blur-xl text-red-400 rounded-2xl transition hover:scale-105 cursor-pointer shadow border border-slate-700/50"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SAFETY */}
        {activeTab === 'safety' && (
          <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-2xl animate-fade-in">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-3 rtl:space-x-reverse">
              <ShieldCheck className="text-emerald-400 w-6 h-6 animate-pulse" />
              <span>{t('safety')} & Chemical Degradation Guide</span>
            </h2>
            <p role="note" className="text-xs sm:text-sm text-amber-100 leading-relaxed bg-amber-950/50 p-5 rounded-2xl border border-amber-500/40 shadow-inner">{copy.safetyNotice}</p>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/60 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/80 shadow-inner">
              Standard plug-in chargers often lack individual dynamic peak detection (-ΔV). Unplugging NiMH and Li-ion rechargeable batteries promptly upon reaching 100% prevents internal electrolyte venting, high thermal pressure, and permanent capacity degradation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
              <div className="p-6 bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 space-y-3 shadow-xl">
                <strong className="text-blue-400 text-sm block">NiMH Thermal Pressure Venting</strong>
                <p className="leading-relaxed text-slate-400">Overcharging converts excess electrical energy directly into heat. Efficiency compensation (1.2x - 1.4x) accounts for internal electrical resistance and ambient dissipation.</p>
              </div>
              <div className="p-6 bg-slate-950/80 backdrop-blur-xl rounded-3xl border border-slate-800/80 space-y-3 shadow-xl">
                <strong className="text-amber-400 text-sm block">Li-ion Voltage Cutoff</strong>
                <p className="leading-relaxed text-slate-400">14500 and 10440 Li-ion cells must never exceed 4.20V nominal cutoff voltage to avoid severe thermal runaway and metallic lithium plating risks.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4 max-w-4xl mx-auto animate-fade-in">
            <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 p-5 rounded-3xl flex justify-between items-center shadow-2xl">
              <h2 className="font-bold text-slate-100 text-sm">{t('history')}</h2>
              {history.length > 0 && <button onClick={() => setHistory([])} className="text-xs font-semibold text-red-400 bg-red-950/80 hover:bg-red-900/90 backdrop-blur-xl px-4 py-2 rounded-2xl transition cursor-pointer shadow border border-red-500/40">Clear History</button>}
            </div>
            {history.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-500 bg-slate-900/30 backdrop-blur-xl border-2 border-dashed border-slate-800/80 rounded-3xl">No history logged yet.</div>
            ) : (
              history.map((h, i) => (
                <div key={i} className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-2xl p-5 flex justify-between text-xs items-center shadow-xl hover:border-slate-700 transition">
                  <div>
                    <div className="font-extrabold text-slate-200 text-sm">{h.label} ({h.size})</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{h.capacity}mAh • Mode: {h.targetMode === 'half' ? '50%' : '100%'} • {new Date(h.finishedAt).toLocaleString()}</div>
                  </div>
                  <span className={`font-extrabold px-3.5 py-1 rounded-full border shadow ${h.status === 'stopped' ? 'text-slate-300 bg-slate-800/80 border-slate-600/50' : 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40'}`}>
                    {h.status === 'completed' ? copy.completed : copy.stopped}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 6: CONTACT US */}
        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                <div className="p-3.5 bg-blue-600/20 text-blue-400 rounded-2xl border border-blue-500/30 backdrop-blur-xl shadow-inner">
                  <MessageSquare className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100">{t('contactUs')}</h2>
                  <p className="text-xs text-slate-400">Reach out to our developer team or support channels anytime.</p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                
                <div 
                  onClick={() => triggerJiggle('telegram')}
                  className="p-5 bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-slate-800/90 flex items-center justify-between shadow-lg hover:border-blue-500/50 transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                    <div className={`w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 transition-transform ${selectedJiggleLogo === 'telegram' ? 'animate-jiggle' : 'group-hover:scale-110'}`}>
                      <Send className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 text-sm block">Telegram ID</span>
                      <span className="text-slate-400 font-mono">@VoltGuardSupport</span>
                    </div>
                  </div>
                  <span className="text-xs bg-sky-500/20 text-sky-300 px-3 py-1.5 rounded-full border border-sky-500/30 font-semibold">Connect</span>
                </div>

                <div 
                  onClick={() => triggerJiggle('whatsapp')}
                  className="p-5 bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-slate-800/90 flex items-center justify-between shadow-lg hover:border-emerald-500/50 transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                    <div className={`w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 transition-transform ${selectedJiggleLogo === 'whatsapp' ? 'animate-jiggle' : 'group-hover:scale-110'}`}>
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 text-sm block">WhatsApp ID</span>
                      <span className="text-slate-400 font-mono">+1 (555) 019-2834</span>
                    </div>
                  </div>
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full border border-emerald-500/30 font-semibold">Chat Now</span>
                </div>

                <div 
                  onClick={() => triggerJiggle('email')}
                  className="p-5 bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-slate-800/90 flex items-center justify-between shadow-lg hover:border-purple-500/50 transition cursor-pointer group"
                >
                  <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
                    <div className={`w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 transition-transform ${selectedJiggleLogo === 'email' ? 'animate-jiggle' : 'group-hover:scale-110'}`}>
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 text-sm block">Email Address</span>
                      <span className="text-slate-400 font-mono">support@voltguard.pro</span>
                    </div>
                  </div>
                  <span className="text-xs bg-purple-500/20 text-purple-300 px-3 py-1.5 rounded-full border border-purple-500/30 font-semibold">Send Mail</span>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SETTINGS (INCLUDING BACKUP & RESTORE SECTION) */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            
            {/* DONATION SECTION */}
            <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-3 rtl:space-x-reverse">
                <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
                <span>{t('donateTitle')}</span>
              </h2>

              <div className="bg-slate-950/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-800/80 space-y-4 shadow-inner">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{t('donateDesc')}</p>
                
                {isSupporterValid ? (
                  <div className="p-4 bg-emerald-950/90 backdrop-blur-xl border border-emerald-500/70 text-emerald-300 text-xs rounded-2xl flex items-center justify-between shadow-lg">
                    <span className="flex items-center space-x-2 rtl:space-x-reverse font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{t('supportActiveUntil')} {new Date(subscription.expiresAt).toLocaleDateString()}</span>
                    </span>
                    <span className="font-black bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[10px]">SUPPORTER</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-xs sm:text-sm py-4 rounded-2xl shadow-xl shadow-rose-500/30 transform hover:scale-[1.02] active:scale-98 transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer backdrop-blur-xl border border-rose-400/30"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>{t('donateButton')}</span>
                  </button>
                )}
              </div>
            </div>

            {/* NOTIFICATIONS & ALARM SECTION */}
            <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-3 rtl:space-x-reverse">
                <Bell className="w-5 h-5 text-blue-400" />
                <span>{copy.notificationHeading}</span>
              </h2>

              <div className="space-y-5 text-xs">
                
                <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 shadow-inner">
                  <div>
                    <span className="font-semibold text-slate-200 text-sm block">Web Audio Completion Chime</span>
                    <span className="text-[11px] text-slate-400">Play a synthetic tone when the timer estimate reaches its target.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.audioAlerts} 
                    onChange={(e) => { 
                      const val = e.target.checked;
                      setSettings({ ...settings, audioAlerts: val }); 
                      if (val) triggerContinuousAlarmSound(settings.selectedAlarmId); 
                    }} 
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer" 
                  />
                </div>

                <div className="p-4 sm:p-5 bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 space-y-3 shadow-inner">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-200 text-sm block">{t('alarmSoundLabel')}</span>
                      <span className="text-[11px] text-slate-400">Choose which alarm sound plays when the timer hits target.</span>
                    </div>
                    <button 
                      onClick={() => playSingleAlarmBurst(settings.selectedAlarmId)}
                      className="bg-blue-600/90 hover:bg-blue-500 backdrop-blur-xl text-white font-semibold text-[11px] px-4 py-2 rounded-xl shadow transition flex items-center space-x-1 rtl:space-x-reverse cursor-pointer border border-blue-400/30"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Test Sound</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {ALARM_SOUND_OPTIONS.map(alarm => {
                      const isSelected = settings.selectedAlarmId === alarm.id;
                      return (
                        <button
                          key={alarm.id}
                          onClick={() => {
                            setSettings({ ...settings, selectedAlarmId: alarm.id });
                            playSingleAlarmBurst(alarm.id);
                          }}
                          className={`p-4 rounded-2xl border text-left rtl:text-right font-medium transition-all duration-200 flex items-center justify-between cursor-pointer backdrop-blur-xl ${
                            isSelected 
                              ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-lg shadow-blue-500/20' 
                              : 'bg-slate-900/80 border-slate-800/80 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{alarm.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-slate-800/80 space-y-3 shadow-inner">
                  <div>
                    <span className="font-semibold text-slate-200 text-sm block">{t('notificationsLabel')}</span>
                    <span className="text-[11px] text-slate-400">{copy.notificationDescription}</span>
                  </div>

                  {!notificationsAvailable && (
                    <p role="status" className="rounded-xl border border-amber-500/30 bg-amber-950/30 p-3 text-[11px] text-amber-100">{copy.notificationUnavailable}</p>
                  )}

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      disabled={!notificationsAvailable}
                      onClick={() => requestNotificationPermission(true)}
                      className={`py-3 px-4 rounded-2xl font-bold text-xs transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer shadow-lg backdrop-blur-xl ${
                        settings.pushNotifications && notificationsAvailable && Notification.permission === 'granted'
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white ring-2 ring-cyan-400/50 shadow-blue-500/30 scale-[1.02] border border-cyan-300/40' 
                          : 'bg-slate-900/90 text-slate-400 border border-slate-800/90 hover:text-slate-200 disabled:cursor-not-allowed disabled:opacity-50'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                      <span>{t('enable')}</span>
                      {settings.pushNotifications && notificationsAvailable && Notification.permission === 'granted' && <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-white" />}
                    </button>

                    <button
                      onClick={() => requestNotificationPermission(false)}
                      className={`py-3 px-4 rounded-2xl font-bold text-xs transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer shadow-lg backdrop-blur-xl ${
                        !(settings.pushNotifications && notificationsAvailable && Notification.permission === 'granted')
                          ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white ring-2 ring-slate-500/50 shadow-slate-900/50 scale-[1.02] border border-slate-500/40' 
                          : 'bg-slate-900/90 text-slate-400 border border-slate-800/90 hover:text-slate-200'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span>{t('disable')}</span>
                      {!(settings.pushNotifications && notificationsAvailable && Notification.permission === 'granted') && <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-white" />}
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* APP VERSION AND RELEASE NOTES */}
            <section className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl" aria-labelledby="settings-app-updates-title">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 id="settings-app-updates-title" className="flex items-center gap-3 text-base font-bold text-slate-100">
                    <Info className="h-5 w-5 shrink-0 text-cyan-400" />
                    <span>{t('appUpdateTitle')}</span>
                  </h2>
                  <p className="mt-2 text-xs text-slate-400 leading-relaxed">{t('appUpdateDescription')}</p>
                  <p className="mt-3 text-sm font-bold text-slate-100">
                    {t('appUpdateCurrentVersion')}: <span className="text-cyan-300">{APP_VERSION}</span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAppUpdate}
                  disabled={appUpdateChecking}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-xs font-bold text-white hover:bg-cyan-500 disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
                >
                  <RefreshCw className={`h-4 w-4 ${appUpdateChecking ? 'animate-spin' : ''}`} />
                  <span>{appUpdateChecking ? t('appUpdateChecking') : t('appUpdateNow')}</span>
                </button>
              </div>
              <p className="mt-3 text-[11px] leading-relaxed text-slate-500">
                {isNativeApp ? t('appUpdateNativeHint') : t('appUpdatePwaHint')}
              </p>
              {appUpdateFeedback && (
                <p role="alert" className="mt-3 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-200">
                  {appUpdateFeedback}
                </p>
              )}
              <div ref={updateHistoryRef} className="mt-5 border-t border-slate-800 pt-4">
                <button
                  type="button"
                  aria-expanded={updateHistoryExpanded}
                  aria-controls="app-update-history-content"
                  onClick={() => setUpdateHistoryExpanded(expanded => !expanded)}
                  className="flex w-full items-center justify-between gap-4 rounded-xl text-left rtl:text-right focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
                >
                  <span className="text-xs font-bold uppercase tracking-wide text-slate-300">{t('appUpdateHistory')}</span>
                  <ChevronRight className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${updateHistoryExpanded ? 'rotate-90' : 'rtl:rotate-180'}`} />
                </button>
                <div id="app-update-history-content" hidden={!updateHistoryExpanded}>
                  <ol className="mt-3 space-y-3">
                    {APP_RELEASE_HISTORY.map(release => (
                      <li key={release.version} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3">
                        <p className="text-xs font-bold text-cyan-300">{release.version}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-400">{release.summary}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </section>

            {/* TERMS AND CONDITIONS */}
            <section ref={termsSectionRef} className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-5 sm:p-6 shadow-2xl" aria-labelledby="settings-terms-title">
              <button
                type="button"
                id="settings-terms-title"
                aria-expanded={termsExpanded}
                aria-controls="settings-terms-content"
                onClick={() => setTermsExpanded(expanded => !expanded)}
                className="flex w-full items-center justify-between gap-4 rounded-xl text-left rtl:text-right focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400"
              >
                <span className="flex items-center gap-3 text-base font-bold text-slate-100">
                  <ShieldCheck className="h-5 w-5 shrink-0 text-cyan-400" />
                  <span>{t('termsTitle')}</span>
                </span>
                <ChevronRight className={`h-5 w-5 shrink-0 text-slate-400 transition-transform ${termsExpanded ? 'rotate-90' : 'rtl:rotate-180'}`} />
              </button>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">{t('termsSettingsDescription')}</p>
              <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-xs text-slate-300">
                <span className="font-bold text-slate-100">{t('termsVersion')} {TERMS_VERSION}</span>
                <span className="mx-2 text-slate-600">·</span>
                <span>{t('termsEffective')} {TERMS_EFFECTIVE_DATE}</span>
                {termsAcceptance?.acceptedAt && (
                  <p className="mt-2 text-slate-400">
                    Accepted on this device: {new Date(termsAcceptance.acceptedAt).toLocaleString(settings.language)}
                  </p>
                )}
              </div>
              <div id="settings-terms-content" hidden={!termsExpanded} className="mt-6 border-t border-slate-800 pt-6">
                {renderTermsDocument()}
              </div>
            </section>

            {/* BACKUP & RESTORE SECTION */}
            <div className="bg-slate-900/70 backdrop-blur-2xl border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-3 rtl:space-x-reverse">
                <Cloud className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span>{t('backupRestoreTitle')}</span>
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">{t('backupRestoreDesc')}</p>

              {backupFeedbackMsg.text && (
                <div className={`p-4 rounded-2xl text-xs font-bold border flex items-center space-x-2 ${backupFeedbackMsg.type === 'error' ? 'bg-red-950/90 border-red-500 text-red-200' : 'bg-emerald-950/90 border-emerald-500 text-emerald-200'}`}>
                  {backupFeedbackMsg.type === 'error' ? <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" /> : <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />}
                  <span>{backupFeedbackMsg.text}</span>
                </div>
              )}

              <div className="bg-slate-950/80 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-800/80 space-y-4 shadow-inner">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
                  <span className="text-xs font-semibold text-slate-300">{t('includeStats')}</span>
                  <input 
                    type="checkbox" 
                    checked={includeStatsInBackup} 
                    onChange={(e) => setIncludeStatsInBackup(e.target.checked)} 
                    className="w-4 h-4 accent-blue-600 rounded cursor-pointer" 
                  />
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileImportUpload} 
                  accept=".json" 
                  className="hidden" 
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button 
                    onClick={handleExportLocalBackup}
                    className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs py-3 px-4 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer transition transform hover:scale-[1.02]"
                  >
                    <Download className="w-4 h-4" />
                    <span>{t('exportLocal')}</span>
                  </button>

                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs py-3 px-4 rounded-2xl shadow-lg border border-slate-700 flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer transition transform hover:scale-[1.02]"
                  >
                    <Upload className="w-4 h-4" />
                    <span>{t('importLocal')}</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider block">Cloud Sync (Google Drive & iCloud)</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleCloudExportSync('Google Drive')}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer shadow"
                    >
                      <CloudUpload className="w-3.5 h-3.5 text-blue-400" />
                      <span>{t('exportGDrive')}</span>
                    </button>

                    <button 
                      onClick={() => handleCloudImportRestore('Google Drive')}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer shadow"
                    >
                      <CloudDownload className="w-3.5 h-3.5 text-blue-400" />
                      <span>{t('importGDrive')}</span>
                    </button>

                    <button 
                      onClick={() => handleCloudExportSync('Apple iCloud')}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer shadow"
                    >
                      <CloudUpload className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{t('exportICloud')}</span>
                    </button>

                    <button 
                      onClick={() => handleCloudImportRestore('Apple iCloud')}
                      className="bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-cyan-300 font-semibold text-xs py-2.5 px-3 rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer shadow"
                    >
                      <CloudDownload className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{t('importICloud')}</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>


          </div>
        )}

      </main>

      {appUpdateNotice && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-xl">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="app-update-dialog-title"
            aria-describedby="app-update-dialog-description"
            className="w-full max-w-lg space-y-5 rounded-3xl border border-cyan-500/30 bg-slate-900 p-6 shadow-2xl sm:p-8"
          >
            <div className="flex items-start gap-3">
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-cyan-300">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 id="app-update-dialog-title" className="text-lg font-extrabold text-slate-100">{t('appUpdateTitle')}</h2>
                <p id="app-update-dialog-description" className="mt-1 text-sm leading-relaxed text-slate-300">
                  {t('appUpdateAvailable')} {t('appUpdateCurrentVersion')}: {APP_VERSION}
                </p>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
              <p className="text-xs font-bold text-cyan-300">{appUpdateNotice.version}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-300">{appUpdateNotice.summary}</p>
            </div>
            {appUpdateFeedback && <p role="alert" className="text-xs text-red-300">{appUpdateFeedback}</p>}
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                autoFocus
                onClick={handleAppUpdate}
                disabled={appUpdateChecking}
                className="rounded-xl bg-cyan-600 px-4 py-3 text-sm font-bold text-white hover:bg-cyan-500 disabled:cursor-wait disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
              >
                {appUpdateChecking ? t('appUpdateChecking') : t('appUpdateNow')}
              </button>
              <button
                type="button"
                onClick={() => {
                  setAppUpdateNotice(null);
                  setActiveTab('settings');
                }}
                className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-bold text-slate-200 hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300"
              >
                {t('appUpdateSettings')}
              </button>
              <button
                type="button"
                onClick={() => setAppUpdateNotice(null)}
                className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-400 hover:text-slate-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300 sm:col-span-2"
              >
                {t('appUpdateLater')}
              </button>
            </div>
          </section>
        </div>
      )}

      {/* --- MODAL: ADD BATTERY SLOT --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div
            ref={addSlotModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-battery-dialog-title"
            aria-describedby="battery-safety-notice"
            className="bg-slate-900/90 backdrop-blur-3xl border border-slate-800/90 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 id="add-battery-dialog-title" className="text-base font-bold text-slate-100 mb-1">{t('addSlot')}</h2>
              <button type="button" onClick={handleCloseAddSlotModal} aria-label={copy.cancel} className="rounded-xl p-2 text-slate-300 hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-400">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-cyan-400 font-medium mb-5">
              {copy.chargerCompatible}: {(currentCharger.supported_slot_types || ['AA/AAA Combined']).join(', ')} · {getSupportedBatteryChemistries(currentCharger).join(', ')}
            </p>
            <p id="battery-safety-notice" role="note" className="mb-4 rounded-xl border border-amber-500/40 bg-amber-950/40 p-3 text-[11px] leading-relaxed text-amber-100">{copy.safetyNotice}</p>
            {!getChargerCurrentMa(currentCharger, newSlotForm) && (
              <p role="status" className="mb-4 rounded-xl border border-amber-500/40 bg-amber-950/40 p-3 text-[11px] leading-relaxed text-amber-100">
                {t('errorChargerCurrentMissing')}
              </p>
            )}
            
            {addSlotError && (
              <div role="alert" className="mb-4 p-3 bg-red-950/90 border border-red-500 text-red-300 text-xs rounded-2xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{addSlotError}</span>
              </div>
            )}

            <form onSubmit={handleAddSlotSubmit} className="space-y-4">
              <div>
                <label htmlFor="saved-battery-profile" className="block text-xs font-semibold text-slate-300 mb-1.5">{copy.selectProfile}</label>
                <select id="saved-battery-profile" value={selectedBatteryProfileId} onChange={handleBatteryProfileSelect} className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-3 text-xs text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
                  <option value="">{copy.chooseProfile}</option>
                  {compatibleBatteryProfiles.map(p => <option key={p.id} value={p.id}>{p.name} ({p.size}, {p.capacity}mAh)</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="battery-slot-label" className="block text-xs font-semibold text-slate-300 mb-1.5">{copy.slotLabel} *</label>
                <input 
                  id="battery-slot-label"
                  type="text" 
                  value={newSlotForm.slotLabel} 
                  onChange={(e) => handleSlotFormChange('slotLabel', e.target.value)} 
                  className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-3 text-xs text-slate-200 focus:border-blue-500 outline-none" 
                  placeholder="e.g. Living Room Remote Battery"
                  readOnly={Boolean(selectedBatteryProfileId)}
                  required 
                />
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-cyan-400">{t('targetChargeMode')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    disabled={Boolean(selectedBatteryProfileId)}
                    onClick={() => setNewSlotForm({ ...newSlotForm, targetMode: 'full' })}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 disabled:cursor-not-allowed disabled:opacity-60 ${newSlotForm.targetMode === 'full' ? 'bg-blue-600/35 border-blue-500 text-blue-200 shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
                  >
                    <span>{t('fullCharge100')}</span>
                  </button>
                  <button
                    type="button"
                    disabled={Boolean(selectedBatteryProfileId)}
                    onClick={() => setNewSlotForm({ ...newSlotForm, targetMode: 'half' })}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 disabled:cursor-not-allowed disabled:opacity-60 ${newSlotForm.targetMode === 'half' ? 'bg-amber-600/35 border-amber-500 text-amber-200 shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
                  >
                    <span>{t('halfCharge50')}</span>
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="battery-chemistry" className="block text-xs font-semibold text-slate-300 mb-1.5">{copy.chemistry} *</label>
                <select
                  id="battery-chemistry"
                  value={newSlotForm.type}
                  onChange={(e) => handleSlotFormChange('type', e.target.value)}
                  disabled={Boolean(selectedBatteryProfileId)}
                  className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-3 text-xs text-slate-200 outline-none disabled:opacity-60"
                >
                  {getSupportedBatteryChemistries(currentCharger).map(chemistry => <option key={chemistry} value={chemistry}>{chemistry}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="battery-capacity" className="block text-xs font-semibold text-slate-300 mb-1.5">{copy.capacity} *</label>
                  <input 
                    id="battery-capacity"
                    type="number" 
                    min="100" 
                    max="50000" 
                    value={newSlotForm.capacity} 
                    onChange={(e) => handleSlotFormChange('capacity', e.target.value)} 
                    className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-3 text-xs text-slate-200 focus:border-blue-500 outline-none" 
                    readOnly={Boolean(selectedBatteryProfileId)}
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="battery-initial-charge" className="block text-xs font-semibold text-slate-300 mb-1.5">{copy.initialCharge}</label>
                  <input 
                    id="battery-initial-charge"
                    type="number" 
                    min="0" 
                    max="95" 
                    value={newSlotForm.initialCharge} 
                    onChange={(e) => handleSlotFormChange('initialCharge', Number(e.target.value))} 
                    className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-3 text-xs text-slate-200 focus:border-blue-500 outline-none" 
                    disabled={Boolean(selectedBatteryProfileId)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="battery-voltage" className="block text-xs font-semibold text-slate-300 mb-1.5">{copy.voltage} *</label>
                  <input 
                    id="battery-voltage"
                    type="number" 
                    step="0.1" 
                    min={getNominalVoltageRange(newSlotForm.type).min}
                    max={getNominalVoltageRange(newSlotForm.type).max}
                    value={newSlotForm.voltage} 
                    onChange={(e) => handleSlotFormChange('voltage', e.target.value)} 
                    className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-3 text-xs text-slate-200 focus:border-blue-500 outline-none" 
                    readOnly={Boolean(selectedBatteryProfileId)}
                    required 
                  />
                </div>
                <div>
                  <label htmlFor="battery-size" className="block text-xs font-semibold text-slate-300 mb-1.5">{copy.batterySize} *</label>
                  <select 
                    id="battery-size"
                    value={newSlotForm.size} 
                    onChange={(e) => handleSlotFormChange('size', e.target.value)}
                    disabled={Boolean(selectedBatteryProfileId)}
                    className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800/90 rounded-2xl p-3 text-xs text-slate-200 outline-none"
                  >
                    {AVAILABLE_SLOT_TYPES
                      .filter(size => size !== 'AA/AAA Combined' && isBatteryCompatibleWithCharger({ size, type: newSlotForm.type, voltage: newSlotForm.voltage }, currentCharger))
                      .map(size => <option key={size} value={size}>{size}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-slate-800/90">
                <button type="button" onClick={handleCloseAddSlotModal} className="px-5 py-2.5 bg-slate-800/80 backdrop-blur-xl text-xs text-slate-300 font-semibold rounded-2xl hover:bg-slate-700 transition cursor-pointer border border-slate-700/50">{copy.cancel}</button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-xs text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:to-cyan-400 transition cursor-pointer backdrop-blur-xl">{copy.startTimer}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: BATTERY PROFILE EDITOR --- */}
      {isBatteryProfileModalOpen && editingBatteryProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900/90 backdrop-blur-3xl border border-slate-800/90 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-100 mb-5">
              {editingBatteryProfile.id ? 'Edit Battery Profile' : 'New Battery Profile'}
            </h2>
            
            <form onSubmit={handleSaveBatteryProfile} className="space-y-4">
              <input ref={batteryScanInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { handleProfileCameraScan(e.target.files?.[0], 'battery'); e.target.value = ''; }} />
              <button type="button" onClick={() => { setProfileScanStatus({ type: '', message: '' }); batteryScanInputRef.current?.click(); }} className="w-full flex items-center justify-center gap-2 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition">
                <ImageIcon className="w-4 h-4" /> Scan Battery Label with Camera
              </button>
              {profileScanStatus.message && <p role="status" className={`text-[11px] rounded-xl p-3 ${profileScanStatus.type === 'error' ? 'bg-red-950/50 text-red-300' : profileScanStatus.type === 'success' ? 'bg-emerald-950/50 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>{profileScanStatus.message}</p>}
              <div>
                <label className="block text-xs font-semibold text-cyan-400 mb-1.5">Global Battery Preset Database (Searchable)</label>
                <select 
                  onChange={(e) => {
                    const preset = GLOBAL_BATTERY_PRESETS.find(p => p.name === e.target.value);
                    if (preset) {
                      setEditingBatteryProfile({
                        ...editingBatteryProfile,
                        name: preset.name,
                        size: preset.size,
                        type: preset.type,
                        capacity: preset.capacity,
                        voltage: preset.voltage,
                        thermalLimitC: preset.thermalLimitC,
                        condition: preset.condition || 'New',
                        priorUsageValue: preset.priorUsageValue || 0,
                        priorUsageUnit: preset.priorUsageUnit || 'Months'
                      });
                    }
                  }}
                  className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-cyan-300 focus:border-blue-500 outline-none"
                >
                  <option value="">-- Select from Global Standard Battery Database --</option>
                  {GLOBAL_BATTERY_PRESETS.map((p, idx) => (
                    <option key={idx} value={p.name}>{p.name} ({p.size}, {p.capacity}mAh)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Battery Name / Brand *</label>
                <input 
                  type="text" 
                  value={editingBatteryProfile.name} 
                  onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, name: e.target.value })} 
                  className={`w-full bg-slate-950/90 backdrop-blur-xl border ${batteryProfileErrors.name ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200 focus:border-blue-500 outline-none`} 
                  placeholder="e.g. Panasonic Eneloop"
                />
                {batteryProfileErrors.name && <span className="text-[10px] text-red-400 mt-1 block">{batteryProfileErrors.name}</span>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('condition')} *</label>
                  <select 
                    value={editingBatteryProfile.condition || 'New'} 
                    onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, condition: e.target.value })}
                    className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 outline-none"
                  >
                    <option value="New">{t('newBattery')}</option>
                    <option value="Used">{t('usedBattery')}</option>
                  </select>
                </div>

                {editingBatteryProfile.condition === 'Used' && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-amber-400 mb-1.5">Prior Duration *</label>
                      <input 
                        type="number" 
                        min="1" 
                        max="120"
                        value={editingBatteryProfile.priorUsageValue || ''} 
                        onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, priorUsageValue: Number(e.target.value) })} 
                        className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 outline-none" 
                        placeholder="e.g. 12"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-400 mb-1.5">Unit</label>
                      <select 
                        value={editingBatteryProfile.priorUsageUnit || 'Months'} 
                        onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, priorUsageUnit: e.target.value })}
                        className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 outline-none"
                      >
                        <option value="Months">{t('months')}</option>
                        <option value="Years">{t('years')}</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Size *</label>
                  <select 
                    value={editingBatteryProfile.size} 
                    onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, size: e.target.value })}
                    className={`w-full bg-slate-950/90 backdrop-blur-xl border ${batteryProfileErrors.size ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200 outline-none`}
                  >
                    <option value="">-- Select Size --</option>
                    <option value="AA">AA</option>
                    <option value="AAA">AAA</option>
                    <option value="18650">18650</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                  {batteryProfileErrors.size && <span className="text-[10px] text-red-400 mt-1 block">{batteryProfileErrors.size}</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Chemistry Type *</label>
                  <select 
                    value={editingBatteryProfile.type} 
                    onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, type: e.target.value })}
                    className={`w-full bg-slate-950/90 backdrop-blur-xl border ${batteryProfileErrors.type ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200 outline-none`}
                  >
                    <option value="">-- Select Chemistry --</option>
                    <option value="NiMH">NiMH</option>
                    <option value="Li-ion">Li-ion</option>
                    <option value="Alkaline">Alkaline</option>
                  </select>
                  {batteryProfileErrors.type && <span className="text-[10px] text-red-400 mt-1 block">{batteryProfileErrors.type}</span>}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Capacity (mAh) *</label>
                  <input 
                    type="number" 
                    min="100" 
                    max="50000"
                    value={editingBatteryProfile.capacity} 
                    onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, capacity: Number(e.target.value) })} 
                    className={`w-full bg-slate-950/90 backdrop-blur-xl border ${batteryProfileErrors.capacity ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200 outline-none`} 
                    placeholder="e.g. 2000"
                  />
                  {batteryProfileErrors.capacity && <span className="text-[10px] text-red-400 mt-1 block">{batteryProfileErrors.capacity}</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Voltage (V) *</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0.5"
                    max="5.0"
                    value={editingBatteryProfile.voltage} 
                    onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, voltage: Number(e.target.value) })} 
                    className={`w-full bg-slate-950/90 backdrop-blur-xl border ${batteryProfileErrors.voltage ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200 outline-none`} 
                    placeholder="e.g. 1.2"
                  />
                  {batteryProfileErrors.voltage && <span className="text-[10px] text-red-400 mt-1 block">{batteryProfileErrors.voltage}</span>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Thermal Limit (°C)</label>
                  <input 
                    type="number" 
                    min="30"
                    max="80"
                    value={editingBatteryProfile.thermalLimitC} 
                    onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, thermalLimitC: Number(e.target.value) })} 
                    className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 outline-none" 
                    placeholder="e.g. 50"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-slate-800/90">
                <button type="button" onClick={() => setIsBatteryProfileModalOpen(false)} className="px-5 py-2.5 bg-slate-800/80 backdrop-blur-xl text-xs text-slate-300 font-semibold rounded-2xl hover:bg-slate-700 transition cursor-pointer border border-slate-700/50">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-xs text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:to-cyan-400 transition cursor-pointer backdrop-blur-xl">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CHARGER EDITOR --- */}
      {isChargerModalOpen && editingCharger && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900/90 backdrop-blur-3xl border border-slate-800/90 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-100 mb-5">
              {editingCharger.id ? 'Edit Charger Profile' : 'New Charger Profile'}
            </h2>
            
            <form onSubmit={handleSaveCharger} className="space-y-4">
              <input ref={chargerScanInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { handleProfileCameraScan(e.target.files?.[0], 'charger'); e.target.value = ''; }} />
              <button type="button" onClick={() => { setProfileScanStatus({ type: '', message: '' }); chargerScanInputRef.current?.click(); }} className="w-full flex items-center justify-center gap-2 rounded-2xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-3 text-xs font-bold text-cyan-300 hover:bg-cyan-500/20 transition">
                <ImageIcon className="w-4 h-4" /> Scan Charger Label / Bay Layout with Camera
              </button>
              {profileScanStatus.message && <p role="status" className={`text-[11px] rounded-xl p-3 ${profileScanStatus.type === 'error' ? 'bg-red-950/50 text-red-300' : profileScanStatus.type === 'success' ? 'bg-emerald-950/50 text-emerald-300' : 'bg-slate-800 text-slate-300'}`}>{profileScanStatus.message}</p>}
              <div>
                <label className="block text-xs font-semibold text-cyan-400 mb-1.5">Global Charger Preset Database (Searchable)</label>
                <select 
                  onChange={(e) => {
                    const preset = GLOBAL_CHARGER_PRESETS.find(c => c.name === e.target.value);
                    if (preset) {
                      setEditingCharger({
                        ...editingCharger,
                        name: preset.name,
                        aaCurrentMa: preset.aaCurrentMa,
                        aaaCurrentMa: preset.aaaCurrentMa,
                        slotCurrentsMa: preset.slotCurrentsMa || {},
                        slotCount: preset.slotCount,
                        isPaired: preset.isPaired,
                        supported_slot_types: preset.supported_slot_types || ['AA/AAA Combined'],
                        supported_battery_types: preset.supported_battery_types || ['NiMH'],
                        notes: preset.notes
                      });
                    }
                  }}
                  className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-cyan-300 focus:border-blue-500 outline-none"
                >
                  <option value="">-- Select from Global Standard Charger Database --</option>
                  {GLOBAL_CHARGER_PRESETS.map((c, idx) => (
                    <option key={idx} value={c.name}>{c.name} ({c.slotCount} Slots, AA: {c.aaCurrentMa}mA)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Charger Name / Model *</label>
                <input 
                  type="text" 
                  value={editingCharger.name} 
                  onChange={(e) => setEditingCharger({ ...editingCharger, name: e.target.value })} 
                  className={`w-full bg-slate-950/90 backdrop-blur-xl border ${chargerErrors.name ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200 outline-none`} 
                  placeholder="e.g. Universal Smart Charger"
                  required 
                />
                {chargerErrors.name && <span className="text-[10px] text-red-400 mt-1 block">{chargerErrors.name}</span>}
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-2.5">
                <label className="block text-xs font-bold text-cyan-400">Supported Slot Compatibility Types *</label>
                <p className="text-[11px] text-slate-400">Select supported battery form factors (dedicated sizes or hybrid AA/AAA combined).</p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {AVAILABLE_SLOT_TYPES.map((slotType) => {
                    const isSelected = (editingCharger.supported_slot_types || []).includes(slotType);
                    return (
                      <button
                        type="button"
                        key={slotType}
                        onClick={() => handleToggleChargerSlotType(slotType)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                          isSelected 
                            ? 'bg-blue-600/35 border-blue-500 text-cyan-200 shadow-md' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <span className="truncate">{slotType}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 ml-1" />}
                      </button>
                    );
                  })}
                </div>
                {chargerErrors.supported_slot_types && <span className="text-[10px] text-red-400 mt-1 block">{chargerErrors.supported_slot_types}</span>}
              </div>

              <div className="p-4 bg-slate-950/80 border border-slate-800/90 rounded-2xl space-y-2.5">
                <label className="block text-xs font-bold text-cyan-400">Supported rechargeable chemistries *</label>
                <p className="text-[11px] text-slate-400">Select only chemistries explicitly supported by the charger manufacturer. Primary/alkaline cells are never offered for charging.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                  {AVAILABLE_BATTERY_CHEMISTRIES.map(chemistry => {
                    const isSelected = (editingCharger.supported_battery_types || []).includes(chemistry);
                    return (
                      <button
                        type="button"
                        key={chemistry}
                        onClick={() => handleToggleChargerChemistry(chemistry)}
                        aria-pressed={isSelected}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-between cursor-pointer ${
                          isSelected
                            ? 'bg-blue-600/35 border-blue-500 text-cyan-200 shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <span>{chemistry}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
                {chargerErrors.supported_battery_types && <span className="text-[10px] text-red-400 mt-1 block">{chargerErrors.supported_battery_types}</span>}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-cyan-400 mb-1.5">Slot Number / Capacity *</label>
                  <input 
                    type="number" 
                    min="1"
                    max="16"
                    value={editingCharger.slotCount || 4} 
                    onChange={(e) => setEditingCharger({ ...editingCharger, slotCount: Number(e.target.value) })} 
                    className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 outline-none" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-400 mb-1.5">AA Output (mA) *</label>
                  <input 
                    type="number" 
                    min="50"
                    max="3000"
                    value={editingCharger.aaCurrentMa} 
                    onChange={(e) => setEditingCharger({ ...editingCharger, aaCurrentMa: Number(e.target.value) })} 
                    className={`w-full bg-slate-950/90 backdrop-blur-xl border ${chargerErrors.aaCurrentMa ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200 outline-none`} 
                    placeholder="e.g. 500"
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1.5">AAA Output (mA) *</label>
                  <input 
                    type="number" 
                    min="50"
                    max="2000"
                    value={editingCharger.aaaCurrentMa} 
                    onChange={(e) => setEditingCharger({ ...editingCharger, aaaCurrentMa: Number(e.target.value) })} 
                    className={`w-full bg-slate-950/90 backdrop-blur-xl border ${chargerErrors.aaaCurrentMa ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200 outline-none`} 
                    placeholder="e.g. 250"
                    required 
                  />
                </div>
              </div>

              {chargerCurrentConfigs.length > 0 && (
                <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-4 space-y-3">
                  <div>
                    <h3 className="text-xs font-bold text-cyan-300">Other per-slot charging currents</h3>
                    <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                      Enter only the per-slot output current specified by the charger manufacturer for each chemistry and size. Leave a field blank to disable time estimates for that combination.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {chargerCurrentConfigs.map(({ chemistry, size, key }) => (
                      <label key={key} className="block text-xs font-semibold text-slate-300">
                        {chemistry} {size} output (mA)
                        <input
                          type="number"
                          min="1"
                          max="5000"
                          step="1"
                          value={editingCharger.slotCurrentsMa?.[key] ?? ''}
                          onChange={event => setEditingCharger({
                            ...editingCharger,
                            slotCurrentsMa: {
                              ...editingCharger.slotCurrentsMa,
                              [key]: event.target.value === '' ? '' : Number(event.target.value)
                            }
                          })}
                          className="mt-1.5 w-full rounded-2xl border border-slate-800 bg-slate-950/90 p-3 text-xs text-slate-200 outline-none"
                          placeholder="From charger manual"
                        />
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Channel Architecture</label>
                  <select 
                    value={editingCharger.isPaired ? 'paired' : 'independent'} 
                    onChange={(e) => setEditingCharger({ ...editingCharger, isPaired: e.target.value === 'paired' })}
                    className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 outline-none"
                  >
                    <option value="independent">Independent Slots</option>
                    <option value="paired">Paired Channels (1&2, 3&4)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Notes / Description</label>
                  <input 
                    type="text" 
                    value={editingCharger.notes || ''} 
                    onChange={(e) => setEditingCharger({ ...editingCharger, notes: e.target.value })} 
                    className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-slate-200 outline-none" 
                    placeholder="e.g. Smart peak detection"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-slate-800/90">
                <button type="button" onClick={() => setIsChargerModalOpen(false)} className="px-5 py-2.5 bg-slate-800/80 backdrop-blur-xl text-xs text-slate-300 font-semibold rounded-2xl hover:bg-slate-700 transition cursor-pointer border border-slate-700/50">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-xs text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:from-blue-500 hover:to-cyan-400 transition cursor-pointer backdrop-blur-xl">Save Charger</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SECURE DONATION PAYMENT MODAL --- */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900/95 backdrop-blur-3xl border border-slate-800/90 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full bg-slate-800/80 backdrop-blur-xl cursor-pointer transition border border-slate-700/50"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
              <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30 backdrop-blur-xl shadow-inner">
                <Heart className="w-6 h-6 fill-current animate-pulse" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-100">{t('secureCheckout')}</h2>
                <p className="text-xs text-slate-400">{t('donateTitle')}</p>
              </div>
            </div>

            {paymentSuccessMsg ? (
              <div className="p-5 bg-emerald-950/90 backdrop-blur-xl border border-emerald-500 text-emerald-300 rounded-2xl text-center text-xs space-y-2 shadow-lg">
                <CheckCircle2 className="w-9 h-9 text-emerald-400 mx-auto animate-bounce" />
                <p className="font-bold text-sm">{t('paymentSuccess')}</p>
                <p className="text-[10px] text-emerald-400">Receipt sent to {checkoutEmail}</p>
              </div>
            ) : (
              <div className="space-y-4">
                
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300 flex items-center space-x-1.5 rtl:space-x-reverse">
                    <Mail className="w-3.5 h-3.5 text-blue-400" />
                    <span>{t('emailLabel')}</span>
                  </label>
                  <input 
                    type="email" 
                    value={checkoutEmail} 
                    onChange={(e) => setCheckoutEmail(e.target.value)} 
                    placeholder="user@example.com"
                    className="w-full bg-slate-950/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 shadow-inner"
                    required 
                  />
                </div>

                <div className="space-y-2.5 pt-2">
                  <button 
                    onClick={() => handlePaymentRedirect('paypal')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg shadow-blue-500/30 flex items-center justify-center space-x-2 rtl:space-x-reverse transition cursor-pointer transform hover:scale-[1.02] backdrop-blur-xl border border-blue-400/30"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>{t('payWithPaypal')}</span>
                  </button>

                  <button 
                    onClick={() => handlePaymentRedirect('revolut')}
                    className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs py-3.5 rounded-2xl shadow-lg shadow-cyan-500/30 flex items-center justify-center space-x-2 rtl:space-x-reverse transition cursor-pointer transform hover:scale-[1.02] backdrop-blur-xl border border-cyan-400/30"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{t('payWithRevolut')}</span>
                  </button>
                </div>

                <div className="pt-2 space-y-3 border-t border-slate-800/90">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cryptocurrency Donation</div>
                  
                  <div 
                    onClick={() => triggerJiggle('btc')}
                    className="p-3.5 bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800 flex items-center justify-between text-xs shadow-inner"
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse overflow-hidden">
                      <div className={`w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black shrink-0 ${selectedJiggleLogo === 'btc' ? 'animate-jiggle' : ''}`}>
                        ₿
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-slate-200 block text-[11px]">BTC (Bitcoin)</span>
                        <span className="text-[10px] text-slate-400 font-mono truncate">bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCopyCrypto('bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'btc'); }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer shrink-0 ml-2 flex items-center space-x-1"
                    >
                      {copiedCrypto === 'btc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  <div 
                    onClick={() => triggerJiggle('usdt')}
                    className="p-3.5 bg-slate-950/90 backdrop-blur-xl rounded-2xl border border-slate-800 flex items-center justify-between text-xs shadow-inner"
                  >
                    <div className="flex items-center space-x-3 rtl:space-x-reverse overflow-hidden">
                      <div className={`w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black shrink-0 ${selectedJiggleLogo === 'usdt' ? 'animate-jiggle' : ''}`}>
                        ₮
                      </div>
                      <div className="truncate">
                        <span className="font-bold text-slate-200 block text-[11px]">USDT (TRC20)</span>
                        <span className="text-[10px] text-slate-400 font-mono truncate">TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t</span>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCopyCrypto('TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t', 'usdt'); }}
                      className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition cursor-pointer shrink-0 ml-2 flex items-center space-x-1"
                    >
                      {copiedCrypto === 'usdt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                </div>

                <p className="text-[10px] text-slate-500 text-center leading-relaxed">
                  Secure SSL encrypted contribution gateway. Thank you for supporting open developer tools!
                </p>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}