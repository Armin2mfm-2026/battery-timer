import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Zap, BatteryCharging, AlertTriangle, ShieldCheck, Plus, Trash2, Edit3, 
  Play, Pause, RefreshCw, Volume2, VolumeX, Settings, Bell, Info, Save, 
  CheckCircle2, Clock, Battery, BatteryFull, Layers, HelpCircle, ChevronRight,
  Flame, Award, Sparkles, Moon, Sun, ArrowUpRight, Globe, DollarSign, 
  ShieldAlert, ChevronLeft, Video, Image as ImageIcon, X, ExternalLink, CreditCard, Mail, Key, Heart, MessageSquare, Send, Copy, Check, TrendingUp
} from 'lucide-react';

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
    noSlotsDesc: "Add an AA or AAA rechargeable battery slot to calculate exact charging times, monitor chemical heat dissipation, and receive notifications.",
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
    errorValidation: "Please fix all validation errors before submitting."
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
    noSlotsDesc: "برای محاسبه زمان دقیق شارژ، پایش حرارت و دریافت هشدار، یک باتری AA یا AAA اضافه کنید.",
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
    errorValidation: "لطفاً خطاهای فرم را برطرف کنید."
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
    noSlotsDesc: "Aggiungi una batteria AA o AAA per calcolare i tempi di carica.",
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
    errorValidation: "Correggere gli errori prima di inviare."
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
    noSlotsDesc: "Añade una batería AA o AAA para calcular tiempos de carga precisos.",
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
    errorValidation: "Corrija los errores antes de continuar."
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
    noSlotsDesc: "添加AA或AAA电池槽以计算精确充电时间。",
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
    errorValidation: "请修正表单错误后提交。"
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
    noSlotsDesc: "Ajoutez une pile AA ou AAA pour calculer les temps de charge précis.",
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
    errorValidation: "Veuillez corriger les erreurs avant de soumettre."
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
    noSlotsDesc: "Fügen Sie AA- oder AAA-Akkus hinzu, um Ladezeiten zu berechnen.",
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
    heatLoss: "Wärmeverlust- und Effizienzindex",
    healthTrend: "Degradations-Trendanalyse",
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
    errorValidation: "Bitte korrigieren Sie die Fehler."
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
    noSlotsDesc: "أضف بطارية AA أو AAA لحساب أوقات الشحن بدقة.",
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
    errorValidation: "يرجى تصحيح أخطاء النموذج."
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
    noSlotsDesc: "AAまたはAAAバッテリーを追加して充電時間を計算します。",
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
    errorValidation: "エラーを修正してください。"
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
    noSlotsDesc: "Adicione uma bateria AA ou AAA para calcular o tempo de carga.",
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
    heatLoss: "Índice de Perda Térmica e Eficiência",
    healthTrend: "Análise de Tendência de Degradação",
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
    errorProfileRequired: "Erro: selecione um perfil de bateria ou preencha os campos obrigatórios.",
    errorBatteryExists: "Erro: Já existe uma bateria com o mesmo nome e especificações.",
    errorChargerExists: "Erro: Já existe um carregador com o mesmo nome e especificações.",
    errorValidation: "Corrija os erros antes de enviar."
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
    noSlotsDesc: "Добавьте батарейку AA или AAA для расчета времени.",
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
    errorValidation: "Пожалуйста, исправьте ошибки валидации."
  }
};

// --- ALARM SOUND LIST OPTIONS ---
const ALARM_SOUND_OPTIONS = [
  { id: 'chime', name: '✨ Classic Synth Chime', frequencies: [523.25, 659.25, 783.99, 1046.50] },
  { id: 'radar', name: '📡 Digital Radar Pulse', frequencies: [880, 440, 880, 440] },
  { id: 'bell', name: '🔔 Gentle Battery Bell', frequencies: [659.25, 523.25, 783.99, 1318.51] },
  { id: 'urgent', name: '⚡ Urgent Voltage Alert', frequencies: [987.77, 932.33, 880, 830.61] }
];

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
  { name: 'Panasonic BQ-CC55 Smart Fast Charger (4 Slots)', aaCurrentMa: 750, aaaCurrentMa: 375, slotCount: 4, isPaired: false, notes: 'Smart individual slot peak detection' },
  { name: 'Nitecore D4 Digital Super Charger (4 Slots)', aaCurrentMa: 500, aaaCurrentMa: 250, slotCount: 4, isPaired: false, notes: 'Multi-chemistry universal charger' },
  { name: 'Xtar VC4SL USB-C Charger (4 Slots)', aaCurrentMa: 1000, aaaCurrentMa: 500, slotCount: 4, isPaired: false, notes: 'Quick charge support with capacity test' },
  { name: 'Basic 4-Slot Paired NiMH Charger', aaCurrentMa: 300, aaaCurrentMa: 150, slotCount: 4, isPaired: true, notes: 'Shares current across slot pairs (1&2, 3&4)' },
  { name: 'EBL 8-Bay Universal Rapid Charger (8 Slots)', aaCurrentMa: 500, aaaCurrentMa: 250, slotCount: 8, isPaired: false, notes: 'Independent 8-bay multi-size charger' }
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
    notes: 'Smart individual slot charging with peak detection'
  },
  {
    id: 'ch-2',
    name: 'Basic 4-Slot Paired NiMH Charger',
    inputV: 120, inputVMax: 240, inputA: 0.15, inputHz: '60Hz',
    outputV: 2.8, aaCurrentMa: 300, aaaCurrentMa: 150, slotCount: 4, isPaired: true,
    notes: 'Shares current across slot pairs (1&2, 3&4)'
  },
  {
    id: 'ch-3',
    name: 'Nitecore D4 Digital Super Charger',
    inputV: 100, inputVMax: 240, inputA: 0.5, inputHz: '50/60Hz',
    outputV: 4.2, aaCurrentMa: 500, aaaCurrentMa: 250, slotCount: 4, isPaired: false,
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

export default function App() {
  // --- Persistent Core States ---
  const [chargers, setChargers] = useState(() => JSON.parse(localStorage.getItem('batt_chargers')) || INITIAL_CHARGERS);
  const [batteryProfiles, setBatteryProfiles] = useState(() => JSON.parse(localStorage.getItem('batt_profiles')) || INITIAL_BATTERY_PROFILES);
  const [activeChargerId, setActiveChargerId] = useState(() => localStorage.getItem('batt_active_charger_id') || INITIAL_CHARGERS[0].id);
  
  // FIX: Ensure slotIndex is correctly mapped and persistent
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
    pushNotifications: true,
    selectedAlarmId: 'chime',
    defaultEfficiency: 1.3,
    language: 'en',
    autoArchiveFinished: false
  });

  // --- Supporter / Donation State ---
  const [subscription, setSubscription] = useState(() => JSON.parse(localStorage.getItem('batt_subscription')) || {
    isSupporter: false,
    expiresAt: null
  });

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [checkoutEmail, setCheckoutEmail] = useState(() => localStorage.getItem('batt_user_email') || '');
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState(false);
  
  // Crypto copy state
  const [copiedCrypto, setCopiedCrypto] = useState(null);
  const [selectedJiggleLogo, setSelectedJiggleLogo] = useState(null);

  // UI Navigation & Modals
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChargerModalOpen, setIsChargerModalOpen] = useState(false);
  const [isBatteryProfileModalOpen, setIsBatteryProfileModalOpen] = useState(false);
  
  const [editingCharger, setEditingCharger] = useState(null);
  const [editingBatteryProfile, setEditingBatteryProfile] = useState(null);
  const [selectedBatteryProfileId, setSelectedBatteryProfileId] = useState('');

  // Form error states
  const [addSlotError, setAddSlotError] = useState('');
  const [batteryProfileErrors, setBatteryProfileErrors] = useState({});
  const [chargerErrors, setChargerErrors] = useState({});
  const [globalErrorMsg, setGlobalErrorMsg] = useState('');

  const [newSlotForm, setNewSlotForm] = useState({
    slotLabel: '',
    size: 'AA',
    type: 'NiMH',
    capacity: '',
    voltage: '',
    initialCharge: 0,
    efficiency: settings.defaultEfficiency,
    targetMode: 'full' // 'full' (100%) or 'half' (50%)
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

  // Check Supporter Validity
  const isSupporterValid = useMemo(() => {
    if (!subscription.isSupporter || !subscription.expiresAt) return false;
    return new Date().getTime() < subscription.expiresAt;
  }, [subscription]);

  // --- Charger Change Validation ---
  const handleAttemptChangeCharger = (newChargerId) => {
    if (activeSlots.length > 0) {
      setGlobalErrorMsg(t('errorChargerInUse'));
      setTimeout(() => setGlobalErrorMsg(''), 4000);
      return;
    }
    setActiveChargerId(newChargerId);
  };

  // --- Charger Edit & Delete Validation (Active vs Inactive Check) ---
  const handleAttemptEditCharger = (charger) => {
    if (activeSlots.length > 0 && charger.id === activeChargerId) {
      setGlobalErrorMsg(t('errorChargerInUse'));
      setTimeout(() => setGlobalErrorMsg(''), 4000);
      return;
    }
    setEditingCharger(charger);
    setChargerErrors({});
    setIsChargerModalOpen(true);
  };

  const handleAttemptDeleteCharger = (chargerId) => {
    if (activeSlots.length > 0 && chargerId === activeChargerId) {
      setGlobalErrorMsg(t('errorChargerInUse'));
      setTimeout(() => setGlobalErrorMsg(''), 4000);
      return;
    }
    setChargers(prev => prev.filter(item => item.id !== chargerId));
  };

  // --- Battery Profile Edit & Delete Validation (Per-Profile Check) ---
  const handleAttemptEditProfile = (profile) => {
    const isCharging = activeSlots.some(slot => 
      (slot.profileId === profile.id || slot.label === profile.name) && slot.status !== 'completed'
    );
    if (isCharging) {
      setGlobalErrorMsg(t('errorProfileInUse'));
      setTimeout(() => setGlobalErrorMsg(''), 4000);
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
      setGlobalErrorMsg(t('errorProfileInUse'));
      setTimeout(() => setGlobalErrorMsg(''), 4000);
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
            triggerAlarmSound(settings.selectedAlarmId);
            if (settings.pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('🔋 Battery Fully Charged!', {
                body: `${slot.size} battery (${slot.capacity}mAh) has reached target charge time.`
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
  }, [settings.pushNotifications, settings.selectedAlarmId]);

  // Alarm Sound Generator
  const triggerAlarmSound = (alarmId = 'chime') => {
    if (!settings.audioAlerts) return;
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

  const requestNotificationPermission = (enableState) => {
    if (enableState) {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            setSettings(s => ({ ...s, pushNotifications: true }));
          }
        });
      } else {
        setSettings(s => ({ ...s, pushNotifications: true }));
      }
    } else {
      setSettings(s => ({ ...s, pushNotifications: false }));
    }
  };

  const calculateChargeTime = (size, capacity, initialCharge, efficiency, targetMode) => {
    const baseCurrent = size === 'AA' ? currentCharger.aaCurrentMa : currentCharger.aaaCurrentMa;
    const targetPct = targetMode === 'half' ? 50 : 100;
    const netCapacityNeeded = capacity * Math.max(0.05, (targetPct / 100) - (initialCharge / 100));
    if (baseCurrent <= 0) return { totalSec: 3600, effectiveCurrentMa: baseCurrent };
    const decimalHours = (netCapacityNeeded / baseCurrent) * efficiency;
    return { totalSec: Math.round(decimalHours * 3600), effectiveCurrentMa: baseCurrent };
  };

  // --- Add Battery Slot Profile Selection & Two-Way Sync ---
  const handleOpenAddSlotModal = () => {
    setSelectedBatteryProfileId('');
    setNewSlotForm({
      slotLabel: '',
      size: 'AA',
      type: 'NiMH',
      capacity: '',
      voltage: '',
      initialCharge: 0,
      efficiency: settings.defaultEfficiency,
      targetMode: 'full'
    });
    setAddSlotError('');
    setIsAddModalOpen(true);
  };

  const handleBatteryProfileSelect = (e) => {
    const pId = e.target.value;
    setSelectedBatteryProfileId(pId);
    setAddSlotError('');
    if (!pId) {
      setNewSlotForm(prev => ({ ...prev, slotLabel: '', capacity: '', voltage: '' }));
      return;
    }
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

  const handleSlotFormChange = (field, val) => {
    setNewSlotForm(prev => {
      const updated = { ...prev, [field]: val };
      if (selectedBatteryProfileId) {
        setBatteryProfiles(profiles => profiles.map(p => {
          if (p.id === selectedBatteryProfileId) {
            return {
              ...p,
              name: field === 'slotLabel' ? val : p.name,
              size: field === 'size' ? val : p.size,
              type: field === 'type' ? val : p.type,
              capacity: field === 'capacity' ? Number(val) || 0 : p.capacity,
              voltage: field === 'voltage' ? Number(val) || 0 : p.voltage
            };
          }
          return p;
        }));
      }
      return updated;
    });
  };

  const handleAddSlotSubmit = (e) => {
    e.preventDefault();
    if (!selectedBatteryProfileId && (!newSlotForm.capacity || !newSlotForm.voltage || !newSlotForm.slotLabel)) {
      setAddSlotError(t('errorProfileRequired'));
      return;
    }
    if (!newSlotForm.capacity || newSlotForm.capacity <= 0) {
      setAddSlotError('Capacity must be greater than 0 mAh.');
      return;
    }
    if (!newSlotForm.voltage || newSlotForm.voltage <= 0) {
      setAddSlotError('Voltage must be a valid number.');
      return;
    }

    // FIX: Find the first available slotIndex (0 to slotCount - 1)
    const slotCount = currentCharger.slotCount || 4;
    const occupiedIndices = activeSlots.map(s => s.slotIndex);
    let assignedIndex = -1;
    for (let i = 0; i < slotCount; i++) {
      if (!occupiedIndices.includes(i)) {
        assignedIndex = i;
        break;
      }
    }
    if (assignedIndex === -1) {
      setAddSlotError('All charging slots are currently full.');
      return;
    }

    const { slotLabel, size, type, capacity, voltage, initialCharge, efficiency, targetMode } = newSlotForm;

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
    setIsAddModalOpen(false);
    setSelectedBatteryProfileId('');
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
    const targetSlot = activeSlots.find(s => s.id === id);
    if (saveToHistory && targetSlot) {
      const historyItem = { 
        ...targetSlot, 
        finishedAt: new Date().toISOString(), 
        actualChargeSec: targetSlot.elapsedSec,
        overcharged: targetSlot.overchargeSec > 0
      };
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

  // --- Battery Profile Editor & Duplicate Validation ---
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

  // --- Charger Profile New, Edit & Duplicate Validation ---
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
      slotCount: 4,
      isPaired: false,
      notes: ''
    });
    setChargerErrors({});
    setIsChargerModalOpen(true);
  };

  const handleSaveCharger = (e) => {
    e.preventDefault();
    if (!editingCharger) return;
    let errors = {};
    if (!editingCharger.name || editingCharger.name.trim() === '') errors.name = 'Charger name is required.';
    if (!editingCharger.aaCurrentMa || editingCharger.aaCurrentMa <= 0) errors.aaCurrentMa = 'AA output current must be > 0 mA.';
    if (!editingCharger.aaaCurrentMa || editingCharger.aaaCurrentMa <= 0) errors.aaaCurrentMa = 'AAA output current must be > 0 mA.';
    if (!editingCharger.slotCount || editingCharger.slotCount <= 0) errors.slotCount = 'Slot count must be at least 1.';

    if (Object.keys(errors).length === 0) {
      const isDuplicate = chargers.some(c => {
        if (editingCharger.id && c.id === editingCharger.id) return false;
        return (
          c.name.trim().toLowerCase() === editingCharger.name.trim().toLowerCase() &&
          Number(c.aaCurrentMa) === Number(editingCharger.aaCurrentMa) &&
          Number(c.aaaCurrentMa) === Number(editingCharger.aaaCurrentMa) &&
          Number(c.outputV) === Number(editingCharger.outputV) &&
          Boolean(c.isPaired) === Boolean(editingCharger.isPaired)
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

  // --- Statistics & Battery Health Analytics calculations ---
  const statisticsAnalytics = useMemo(() => {
    const totalCycles = history.length;
    const overchargeCount = history.filter(h => h.overchargeSec > 0 || h.overcharged).length;

    const profileStats = batteryProfiles.map(p => {
      const priorMonths = p.condition === 'Used' 
        ? (p.priorUsageUnit === 'Years' ? (Number(p.priorUsageValue) || 0) * 12 : (Number(p.priorUsageValue) || 0)) 
        : 0;
      const pCycles = history.filter(h => h.profileId === p.id || h.label === p.name).length;
      // SoH estimation algorithm: Base 100% minus aging months and charge cycles degradation
      const soh = Math.max(15, Math.round(100 - (priorMonths * 0.65) - (pCycles * 0.18)));
      const currentCapacity = Math.round(p.capacity * (soh / 100));
      const fullRuntimeHours = ((currentCapacity / 500)).toFixed(1); // assuming 500mA discharge load
      const halfRuntimeHours = ((currentCapacity * 0.5 / 500)).toFixed(1);
      const heatLossIndex = Math.round(12 + (100 - soh) * 0.45); // % efficiency heat loss

      return {
        ...p,
        priorMonths,
        cycles: pCycles,
        soh,
        currentCapacity,
        fullRuntimeHours,
        halfRuntimeHours,
        heatLossIndex
      };
    });

    const avgSoH = profileStats.length > 0 
      ? Math.round(profileStats.reduce((acc, curr) => acc + curr.soh, 0) / profileStats.length) 
      : 100;

    return {
      totalCycles,
      overchargeCount,
      profileStats,
      avgSoH
    };
  }, [batteryProfiles, history]);

  return (
    <div dir={isRTL ? 'rtl' : 'ltr'} className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-36 selection:bg-blue-500 selection:text-white pt-[env(safe-area-inset-top)]">
      
      {/* Custom Jiggle & Wavey Liquid Keyframe Animation Styles */}
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
      `}</style>

      {/* GLOBAL ERROR BANNER FOR CHARGER & PROFILE LOCK */}
      {globalErrorMsg && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-red-600 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-2xl flex items-center space-x-2 animate-bounce border border-red-400">
          <ShieldAlert className="w-5 h-5 shrink-0" />
          <span>{globalErrorMsg}</span>
        </div>
      )}

      {/* HEADER BAR */}
      <header className="sticky top-0 z-40 bg-slate-900/40 backdrop-blur-2xl border-b border-slate-800/60 px-4 py-3.5 sm:px-8 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3.5 rtl:space-x-reverse">
            <div className="bg-gradient-to-tr from-blue-600/80 to-cyan-400/80 p-3 rounded-3xl shadow-lg shadow-blue-500/30 transform hover:scale-105 transition-all duration-300 backdrop-blur-md border border-cyan-400/30">
              <Zap className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400 tracking-tight">
                {t('title')}
              </h1>
              <p className="text-xs text-slate-400 font-medium">{t('subtitle')}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="flex items-center space-x-1.5 rtl:space-x-reverse bg-slate-900/60 backdrop-blur-xl px-3 py-2 rounded-full border border-slate-700/60 shadow-lg hover:border-cyan-500/50 transition-colors">
              <Globe className="w-4 h-4 text-cyan-400" />
              <select
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                className="bg-transparent text-xs text-cyan-300 font-bold border-0 focus:ring-0 cursor-pointer"
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
              onClick={handleOpenAddSlotModal}
              className="hidden sm:flex items-center space-x-2 rtl:space-x-reverse bg-gradient-to-r from-blue-600/80 to-cyan-500/80 hover:from-blue-500 hover:to-cyan-400 text-white text-xs font-semibold px-5 py-2.5 rounded-full shadow-lg shadow-blue-500/25 backdrop-blur-xl border border-blue-400/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
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
        <div className="sticky top-[73px] z-30 bg-slate-950/70 backdrop-blur-2xl py-3 mb-6 border-b border-slate-800/60 shadow-xl overflow-x-auto scrollbar-none">
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
                  className={`flex items-center space-x-2 rtl:space-x-reverse px-5 py-3 rounded-full font-medium text-sm transition-all duration-300 whitespace-nowrap cursor-pointer backdrop-blur-xl ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600/30 to-cyan-500/20 text-blue-300 border border-blue-500/40 shadow-xl shadow-blue-500/10 transform scale-[1.03]' 
                      : 'bg-slate-900/40 text-slate-400 border border-slate-800/40 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'text-blue-400 scale-110' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && tab.count > 0 && (
                    <span className="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-blue-500 text-slate-950 animate-pulse">{tab.count}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-2xl">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <div className="p-3.5 bg-slate-800/70 backdrop-blur-xl rounded-2xl text-blue-400 border border-slate-700/60 shadow-inner">
                  <Zap className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <h2 className="font-bold text-slate-100 text-base">{currentCharger.name}</h2>
                    <span className={`text-[10px] uppercase font-extrabold px-3 py-0.5 rounded-full ${currentCharger.isPaired ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'}`}>
                      {currentCharger.isPaired ? 'Paired' : 'Independent'} ({currentCharger.slotCount || 4} Slots)
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {t('activeCharger')} <span className="text-blue-400 font-semibold">AA: {currentCharger.aaCurrentMa}mA</span> | <span className="text-amber-400 font-semibold">AAA: {currentCharger.aaaCurrentMa}mA</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 rtl:space-x-reverse w-full sm:w-auto">
                <select 
                  value={activeChargerId}
                  onChange={(e) => handleAttemptChangeCharger(e.target.value)}
                  className="bg-slate-950/70 backdrop-blur-xl border border-slate-700/60 text-xs text-blue-300 font-medium rounded-2xl p-3 w-full sm:w-auto focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer"
                >
                  {chargers.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.name} ({c.slotCount || 4} Slots)</option>)}
                </select>
              </div>
            </div>

            {/* FIXED SLOT INDEX RENDERING */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: currentCharger.slotCount || 4 }).map((_, index) => {
                const slot = activeSlots.find(s => s.slotIndex === index);
                const slotColor = SLOT_COLORS[index % SLOT_COLORS.length];

                if (!slot) {
                  return (
                    <div key={`empty-slot-${index}`} className={`rounded-3xl bg-slate-900/40 backdrop-blur-2xl border-2 border-dashed ${slotColor.border} shadow-2xl p-6 flex flex-col items-center justify-between min-h-[380px] transform hover:scale-[1.02] transition-all duration-300`}>
                      <div className="flex items-center justify-between w-full">
                        <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${slotColor.badge}`}>
                          Slot {index + 1} (Empty)
                        </span>
                      </div>

                      <div className={`relative flex flex-col items-center justify-center rounded-3xl border-2 border-dashed ${slotColor.border} ${slotColor.bg} w-24 h-40 shadow-inner my-auto p-4 text-center`}>
                        <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-3 rounded-t-md ${slotColor.border.replace('border-', 'bg-').split('/')[0]}`} />
                        <Battery className={`w-8 h-8 ${slotColor.text} mb-2 opacity-60`} />
                        <span className={`text-[11px] font-bold ${slotColor.text}`}>Ready</span>
                      </div>

                      <button 
                        onClick={handleOpenAddSlotModal}
                        className={`w-full py-3 px-4 rounded-2xl font-bold text-xs bg-gradient-to-r ${slotColor.bar} text-slate-950 shadow-lg shadow-cyan-500/20 hover:opacity-90 transition flex items-center justify-center space-x-2 cursor-pointer`}
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

                return (
                  <div key={slot.id} className={`rounded-3xl bg-slate-900/50 backdrop-blur-2xl border-2 ${slotColor.border} ${slotColor.ring} shadow-2xl p-6 flex flex-col justify-between transform hover:-translate-y-1 transition-all duration-300 relative overflow-hidden`}>
                    
                    {isCompleted && (
                      <div className="absolute inset-0 z-20 bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in space-y-3">
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
                            Target Charge Reached
                          </span>
                          <button 
                            onClick={() => handleRemoveSlot(slot.id, true)} 
                            className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg transition transform hover:scale-105 active:scale-95 cursor-pointer border border-red-400/50"
                          >
                            {t('stopCharge')}
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
                              className={`absolute bottom-0 left-0 right-0 overflow-hidden transition-all duration-700 ease-linear ${isOvercharging ? 'bg-red-500 animate-pulse' : slotColor.bar.includes('blue') ? 'bg-blue-500/80' : slotColor.bar.includes('emerald') ? 'bg-emerald-500/80' : slotColor.bar.includes('purple') ? 'bg-purple-500/80' : slotColor.bar.includes('amber') ? 'bg-amber-500/80' : 'bg-cyan-500/80'}`}
                              style={{ height: `${pct}%` }}
                            >
                              <div className="absolute w-[200%] h-3 -top-1.5 left-0 bg-white/30 rounded-full animate-wave" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                            </div>

                            <span className="relative z-10 text-[10px] font-black drop-shadow-md text-white">{slot.size}</span>
                          </div>

                          <div>
                            <div className="flex items-center space-x-1.5">
                              <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${slotColor.badge}`}>Slot {index + 1}</span>
                              <h3 className="font-extrabold text-slate-100 text-sm tracking-tight">{slot.label}</h3>
                            </div>
                            <span className={`inline-block mt-1 text-[10px] font-bold px-3 py-0.5 rounded-full ${slotColor.badge}`}>
                              {slot.size} • {slot.type} • {slot.targetMode === 'half' ? '50% Mode' : '100% Mode'}
                            </span>
                          </div>
                        </div>

                        <span className={`text-[11px] font-extrabold px-3.5 py-1 rounded-full shadow-sm ${isOvercharging ? 'bg-red-950/80 text-red-400 border border-red-500/50 animate-bounce' : isCompleted ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/50' : 'bg-blue-950/80 text-blue-400 border border-blue-500/50'}`}>
                          {isOvercharging ? t('overcharging') : isCompleted ? t('done') : `${pct}%`}
                        </span>
                      </div>

                      <div className="relative w-full bg-slate-950/80 backdrop-blur-2xl rounded-3xl p-6 border-2 border-slate-700/80 mb-5 overflow-hidden shadow-2xl flex flex-col items-center justify-center min-h-[140px]">
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
                        <div className="flex justify-between text-xs font-medium">
                          <span className="text-slate-400">{t('progress')}</span>
                          <span className={slotColor.text + ' font-bold'}>{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-950/60 rounded-full h-3 overflow-hidden border border-slate-800/60 p-0.5 shadow-inner backdrop-blur-md">
                          <div className={`h-full rounded-full transition-all duration-500 bg-gradient-to-r ${slotColor.bar} shadow-lg`} style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2.5 rtl:space-x-reverse pt-3 border-t border-slate-800/60">
                      <button onClick={() => handleTogglePause(slot.id)} className="flex-1 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-xl text-slate-200 font-semibold text-xs py-2.5 rounded-2xl transition-all hover:scale-[1.02] active:scale-98 cursor-pointer shadow border border-slate-700/40">
                        {slot.status === 'charging' ? t('pause') : t('resume')}
                      </button>
                      <button onClick={() => handleResetSlot(slot.id)} title="Reset Timer" className="p-2.5 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-xl text-slate-300 rounded-2xl transition-all hover:rotate-45 cursor-pointer shadow border border-slate-700/40">
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleRemoveSlot(slot.id, true)} className="flex-1 bg-slate-800/60 hover:bg-red-950/80 backdrop-blur-xl text-emerald-400 hover:text-red-300 font-semibold text-xs py-2.5 rounded-2xl transition-all hover:scale-[1.02] active:scale-98 cursor-pointer shadow border border-slate-700/40">
                        {t('stopCharge')}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB: STATISTICS & BATTERY HEALTH ANALYTICS */}
        {activeTab === 'statistics' && (
          <div className="space-y-6 animate-fade-in max-w-6xl mx-auto">
            <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-slate-100 flex items-center space-x-2.5 rtl:space-x-reverse">
                  <TrendingUp className="text-cyan-400 w-6 h-6 animate-pulse" />
                  <span>Battery Health Analytics & Statistics</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">Real-world electrochemistry degradation tracking, SoH estimation, and RUL runtime projections.</p>
              </div>
              <div className="px-5 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/60 shadow-inner flex items-center space-x-3">
                <span className="text-xs text-slate-400 font-semibold">Average Fleet SoH:</span>
                <span className={`text-lg font-black ${statisticsAnalytics.avgSoH >= 80 ? 'text-emerald-400' : statisticsAnalytics.avgSoH >= 50 ? 'text-amber-400' : 'text-red-400'}`}>
                  {statisticsAnalytics.avgSoH}%
                </span>
              </div>
            </div>

            {/* RUL NOTIFICATION POPUP ALERTS IF FLEET OR PROFILES DROP <= 50% OR <= 30% */}
            {statisticsAnalytics.profileStats.some(p => p.soh <= 50) && (
              <div className={`p-5 rounded-3xl border shadow-2xl flex items-start space-x-4 rtl:space-x-reverse ${statisticsAnalytics.profileStats.some(p => p.soh <= 30) ? 'bg-red-950/80 border-red-500/80 text-red-200 animate-pulse' : 'bg-amber-950/80 border-amber-500/80 text-amber-200'}`}>
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

            {/* METRICS CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 shadow-2xl space-y-2">
                <span className="text-xs text-slate-400 font-semibold uppercase">{t('chargeCycles')}</span>
                <div className="text-3xl font-black text-cyan-400 font-mono">{statisticsAnalytics.totalCycles}</div>
                <p className="text-[11px] text-slate-500">Cumulative completed charge cycles recorded across history logs.</p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 shadow-2xl space-y-2">
                <span className="text-xs text-slate-400 font-semibold uppercase">{t('overchargeInstances')}</span>
                <div className="text-3xl font-black text-rose-400 font-mono">{statisticsAnalytics.overchargeCount}</div>
                <p className="text-[11px] text-slate-500">Instances where batteries remained connected past 100% completion.</p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 shadow-2xl space-y-2">
                <span className="text-xs text-slate-400 font-semibold uppercase">{t('sohTitle')}</span>
                <div className="text-3xl font-black text-emerald-400 font-mono">{statisticsAnalytics.avgSoH}%</div>
                <p className="text-[11px] text-slate-500">Calculated state of health based on electrochemical wear models.</p>
              </div>

              <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 shadow-2xl space-y-2">
                <span className="text-xs text-slate-400 font-semibold uppercase">{t('heatLoss')}</span>
                <div className="text-3xl font-black text-amber-400 font-mono">
                  {statisticsAnalytics.profileStats.length > 0 ? Math.round(statisticsAnalytics.profileStats.reduce((a, b) => a + b.heatLossIndex, 0) / statisticsAnalytics.profileStats.length) : 12}%
                </div>
                <p className="text-[11px] text-slate-500">Internal resistance heat dissipation loss factor.</p>
              </div>
            </div>

            {/* PROFILE HEALTH & RUNTIME PROJECTIONS TABLE */}
            <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
                <BatteryFull className="w-5 h-5 text-blue-400" />
                <span>Profile-Specific Health & Estimated Runtime Projections</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-bold border-b border-slate-800">
                    <tr>
                      <th className="p-4">Profile Name / Size</th>
                      <th className="p-4">Condition</th>
                      <th className="p-4">{t('sohTitle')}</th>
                      <th className="p-4">Current Capacity</th>
                      <th className="p-4">Full Charge Runtime (100%)</th>
                      <th className="p-4">Half Charge Runtime (50%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {statisticsAnalytics.profileStats.map(p => (
                      <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
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

            {/* HEALTH TREND GRAPH & DEGRADATION VISUALIZATION */}
            <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <h3 className="font-bold text-slate-100 text-base flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>{t('healthTrend')}</span>
              </h3>
              <p className="text-xs text-slate-400">Comparing expected theoretical capacity retention curve vs. actual battery fleet utilization wear.</p>

              <div className="bg-slate-950/80 rounded-2xl p-6 border border-slate-800/80 space-y-4 shadow-inner">
                {statisticsAnalytics.profileStats.map(p => (
                  <div key={p.id} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-300">{p.name}</span>
                      <span className={p.soh >= 80 ? 'text-emerald-400' : p.soh >= 50 ? 'text-amber-400' : 'text-red-400'}>{p.soh}% Capacity Retention</span>
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 p-6 rounded-3xl shadow-2xl gap-4">
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
                className="bg-gradient-to-r from-blue-600/80 to-cyan-500/80 hover:from-blue-500 hover:to-cyan-400 text-white text-xs px-6 py-3 rounded-full font-bold shadow-lg shadow-blue-500/25 flex items-center space-x-2 rtl:space-x-reverse transform hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xl border border-cyan-400/30"
              >
                <Plus className="w-4 h-4" />
                <span>New Battery Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {batteryProfiles.map(p => (
                <div key={p.id} className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 flex flex-col justify-between shadow-2xl hover:border-blue-500/40 transition-all duration-300">
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-slate-100 text-sm tracking-tight">{p.name}</h3>
                      <span className="text-[10px] font-extrabold px-3 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">{p.size}</span>
                    </div>
                    <div className="text-xs text-slate-400 space-y-2 mt-4 bg-slate-950/40 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/40">
                      <div className="flex justify-between"><span>Chemistry:</span> <strong className="text-slate-200">{p.type}</strong></div>
                      <div className="flex justify-between"><span>Capacity:</span> <strong className="text-slate-200">{p.capacity} mAh</strong></div>
                      <div className="flex justify-between"><span>Nominal Voltage:</span> <strong className="text-slate-200">{p.voltage}V</strong></div>
                      <div className="flex justify-between"><span>Condition:</span> <strong className={p.condition === 'Used' ? 'text-amber-400' : 'text-emerald-400'}>{p.condition} {p.condition === 'Used' ? `(${p.priorUsageValue || 0} ${p.priorUsageUnit || 'Months'})` : ''}</strong></div>
                      <div className="flex justify-between"><span>Thermal Limit:</span> <strong className="text-red-400">{p.thermalLimitC}°C</strong></div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2.5 rtl:space-x-reverse mt-5 pt-4 border-t border-slate-800/60">
                    <button 
                      onClick={() => handleAttemptEditProfile(p)} 
                      className="flex-1 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-xl font-semibold text-xs py-2.5 rounded-2xl text-slate-200 transition-all hover:scale-[1.02] cursor-pointer shadow border border-slate-700/40"
                    >
                      Edit
                    </button>
                    {batteryProfiles.length > 1 && (
                      <button 
                        onClick={() => handleAttemptDeleteProfile(p.id)} 
                        className="p-2.5 bg-slate-800/60 hover:bg-red-950/80 backdrop-blur-xl text-red-400 rounded-2xl transition-all hover:scale-105 cursor-pointer shadow border border-slate-700/40"
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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 p-6 rounded-3xl shadow-2xl gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-100">{t('chargers')}</h2>
                <p className="text-xs text-slate-400 mt-0.5">Configure charger channel output currents, slot count capacity, and circuit pairing.</p>
              </div>
              <button 
                onClick={handleOpenNewCharger} 
                className="bg-gradient-to-r from-blue-600/80 to-cyan-500/80 hover:from-blue-500 hover:to-cyan-400 text-white text-xs px-6 py-3 rounded-full font-bold shadow-lg shadow-blue-500/25 transform hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-xl border border-cyan-400/30"
              >
                <Plus className="w-4 h-4 inline mr-1" /> Add Charger
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {chargers.map(c => {
                const isActive = c.id === activeChargerId;
                return (
                  <div key={c.id} className={`bg-slate-900/50 backdrop-blur-2xl border ${isActive ? 'border-blue-500 ring-2 ring-blue-500/30' : 'border-slate-800/60'} rounded-3xl p-6 flex flex-col justify-between shadow-2xl`}>
                    <div>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-slate-100 text-sm tracking-tight">{c.name}</h3>
                        {isActive && <span className="bg-blue-500/80 text-slate-950 font-black text-[10px] px-3 py-0.5 rounded-full shadow backdrop-blur-md">Active</span>}
                      </div>
                      <p className="text-xs text-slate-400 mb-4">{c.notes}</p>
                      <div className="bg-slate-950/50 backdrop-blur-xl p-4 rounded-2xl border border-slate-800/60 text-xs text-slate-300 space-y-2 shadow-inner">
                        <div className="flex justify-between"><span>Slot Capacity:</span> <strong className="text-cyan-400">{c.slotCount || 4} Slots</strong></div>
                        <div className="flex justify-between"><span>AA Current:</span> <strong className="text-blue-400">{c.aaCurrentMa}mA</strong></div>
                        <div className="flex justify-between"><span>AAA Current:</span> <strong className="text-amber-400">{c.aaaCurrentMa}mA</strong></div>
                      </div>
                    </div>
                    <div className="flex space-x-2.5 rtl:space-x-reverse mt-5 pt-4 border-t border-slate-800/60">
                      {!isActive && <button onClick={() => handleAttemptChangeCharger(c.id)} className="flex-1 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-xl text-xs py-2.5 rounded-2xl text-blue-400 font-semibold transition hover:scale-[1.02] cursor-pointer shadow border border-slate-700/40">Set Active</button>}
                      <button onClick={() => handleAttemptEditCharger(c)} className="p-2.5 bg-slate-800/60 hover:bg-slate-700/80 backdrop-blur-xl text-slate-200 rounded-2xl transition hover:scale-105 cursor-pointer shadow border border-slate-700/40"><Edit3 className="w-4 h-4" /></button>
                      {chargers.length > 1 && <button onClick={() => handleAttemptDeleteCharger(c.id)} className="p-2.5 bg-slate-800/60 hover:bg-red-950/80 backdrop-blur-xl text-red-400 rounded-2xl transition hover:scale-105 cursor-pointer shadow border border-slate-700/40"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: SAFETY */}
        {activeTab === 'safety' && (
          <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 space-y-6 max-w-4xl mx-auto shadow-2xl animate-fade-in">
            <h2 className="text-lg font-bold text-slate-100 flex items-center space-x-3 rtl:space-x-reverse">
              <ShieldCheck className="text-emerald-400 w-6 h-6 animate-pulse" />
              <span>{t('safety')} & Chemical Degradation Guide</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed bg-slate-950/40 backdrop-blur-xl p-5 rounded-2xl border border-slate-800/50 shadow-inner">
              Standard plug-in chargers often lack individual dynamic peak detection (-ΔV). Unplugging NiMH and Li-ion rechargeable batteries promptly upon reaching 100% prevents internal electrolyte venting, high thermal pressure, and permanent capacity degradation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
              <div className="p-6 bg-slate-950/60 backdrop-blur-xl rounded-3xl border border-slate-800/60 space-y-3 shadow-xl">
                <strong className="text-blue-400 text-sm block">NiMH Thermal Pressure Venting</strong>
                <p className="leading-relaxed text-slate-400">Overcharging converts excess electrical energy directly into heat. Efficiency compensation (1.2x - 1.4x) accounts for internal electrical resistance and ambient dissipation.</p>
              </div>
              <div className="p-6 bg-slate-950/60 backdrop-blur-xl rounded-3xl border border-slate-800/60 space-y-3 shadow-xl">
                <strong className="text-amber-400 text-sm block">Li-ion Voltage Cutoff</strong>
                <p className="leading-relaxed text-slate-400">14500 and 10440 Li-ion cells must never exceed 4.20V nominal cutoff voltage to avoid severe thermal runaway and metallic lithium plating risks.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4 max-w-4xl mx-auto animate-fade-in">
            <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 p-5 rounded-3xl flex justify-between items-center shadow-2xl">
              <h2 className="font-bold text-slate-100 text-sm">{t('history')}</h2>
              {history.length > 0 && <button onClick={() => setHistory([])} className="text-xs font-semibold text-red-400 bg-red-950/60 hover:bg-red-900/80 backdrop-blur-xl px-4 py-2 rounded-2xl transition cursor-pointer shadow border border-red-500/30">Clear History</button>}
            </div>
            {history.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-500 bg-slate-900/20 backdrop-blur-xl border-2 border-dashed border-slate-800/80 rounded-3xl">No history logged yet.</div>
            ) : (
              history.map((h, i) => (
                <div key={i} className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 rounded-2xl p-5 flex justify-between text-xs items-center shadow-xl hover:border-slate-700 transition">
                  <div>
                    <div className="font-bold text-slate-200 text-sm">{h.label} ({h.size})</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{h.capacity}mAh • Mode: {h.targetMode === 'half' ? '50%' : '100%'} • {new Date(h.finishedAt).toLocaleString()}</div>
                  </div>
                  <span className="text-emerald-400 font-extrabold bg-emerald-950/60 backdrop-blur-xl px-3.5 py-1 rounded-full border border-emerald-500/30 shadow">Completed</span>
                </div>
              ))
            )}
          </div>
        )}

        {/* NEW TAB: CONTACT US */}
        {activeTab === 'contact' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
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
                  className="p-5 bg-slate-950/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 flex items-center justify-between shadow-lg hover:border-blue-500/50 transition cursor-pointer group"
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
                  className="p-5 bg-slate-950/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 flex items-center justify-between shadow-lg hover:border-emerald-500/50 transition cursor-pointer group"
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
                  className="p-5 bg-slate-950/60 backdrop-blur-xl rounded-2xl border border-slate-800/80 flex items-center justify-between shadow-lg hover:border-purple-500/50 transition cursor-pointer group"
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

        {/* TAB 6: SETTINGS, DONATION & ALARMS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
            
            <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 space-y-5 shadow-2xl">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-3 rtl:space-x-reverse">
                <Heart className="w-5 h-5 text-rose-500 animate-pulse" />
                <span>{t('donateTitle')}</span>
              </h2>

              <div className="bg-slate-950/60 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-800/70 space-y-4 shadow-inner">
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{t('donateDesc')}</p>
                
                {isSupporterValid ? (
                  <div className="p-4 bg-emerald-950/80 backdrop-blur-xl border border-emerald-500/60 text-emerald-300 text-xs rounded-2xl flex items-center justify-between shadow-lg">
                    <span className="flex items-center space-x-2 rtl:space-x-reverse font-semibold">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>{t('supportActiveUntil')} {new Date(subscription.expiresAt).toLocaleDateString()}</span>
                    </span>
                    <span className="font-black bg-emerald-500 text-slate-950 px-3 py-1 rounded-full text-[10px]">SUPPORTER</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-extrabold text-xs sm:text-sm py-4 rounded-full shadow-xl shadow-rose-500/25 transform hover:scale-[1.02] active:scale-98 transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer backdrop-blur-xl border border-rose-400/30"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                    <span>{t('donateButton')}</span>
                  </button>
                )}
              </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-2xl border border-slate-800/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <h2 className="text-base font-bold text-slate-100 flex items-center space-x-3 rtl:space-x-reverse">
                <Bell className="w-5 h-5 text-blue-400" />
                <span>Audio Alarm & Push Notifications</span>
              </h2>

              <div className="space-y-5 text-xs">
                
                <div className="flex items-center justify-between p-4 sm:p-5 bg-slate-950/60 backdrop-blur-xl rounded-2xl border border-slate-800/70 shadow-inner">
                  <div>
                    <span className="font-semibold text-slate-200 text-sm block">Web Audio Completion Chime</span>
                    <span className="text-[11px] text-slate-400">Play synthetic tone when battery finishes charging.</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={settings.audioAlerts} 
                    onChange={(e) => { 
                      const val = e.target.checked;
                      setSettings({ ...settings, audioAlerts: val }); 
                      if (val) triggerAlarmSound(settings.selectedAlarmId); 
                    }} 
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer" 
                  />
                </div>

                <div className="p-4 sm:p-5 bg-slate-950/60 backdrop-blur-xl rounded-2xl border border-slate-800/70 space-y-3 shadow-inner">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="font-semibold text-slate-200 text-sm block">{t('alarmSoundLabel')}</span>
                      <span className="text-[11px] text-slate-400">Choose which alarm sound plays when the timer hits target.</span>
                    </div>
                    <button 
                      onClick={() => triggerAlarmSound(settings.selectedAlarmId)}
                      className="bg-blue-600/80 hover:bg-blue-500 backdrop-blur-xl text-white font-semibold text-[11px] px-4 py-2 rounded-full shadow transition flex items-center space-x-1 rtl:space-x-reverse cursor-pointer border border-blue-400/30"
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
                            triggerAlarmSound(alarm.id);
                          }}
                          className={`p-4 rounded-2xl border text-left rtl:text-right font-medium transition-all duration-200 flex items-center justify-between cursor-pointer backdrop-blur-xl ${
                            isSelected 
                              ? 'bg-blue-600/25 border-blue-500 text-blue-200 shadow-lg shadow-blue-500/20' 
                              : 'bg-slate-900/60 border-slate-800/60 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span>{alarm.name}</span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-400" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-4 sm:p-5 bg-slate-950/60 backdrop-blur-xl rounded-2xl border border-slate-800/70 space-y-3 shadow-inner">
                  <div>
                    <span className="font-semibold text-slate-200 text-sm block">{t('notificationsLabel')}</span>
                    <span className="text-[11px] text-slate-400">Receive alerts and push notifications when charging completes.</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => {
                        setSettings({ ...settings, pushNotifications: true });
                        requestNotificationPermission(true);
                      }}
                      className={`py-3 px-4 rounded-2xl font-bold text-xs transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer shadow-lg backdrop-blur-xl ${
                        settings.pushNotifications 
                          ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white ring-2 ring-cyan-400/50 shadow-blue-500/30 scale-[1.02] border border-cyan-300/40' 
                          : 'bg-slate-900/80 text-slate-400 border border-slate-800/80 hover:text-slate-200'
                      }`}
                    >
                      <Bell className="w-4 h-4" />
                      <span>{t('enable')}</span>
                      {settings.pushNotifications && <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-white" />}
                    </button>

                    <button
                      onClick={() => {
                        setSettings({ ...settings, pushNotifications: false });
                        requestNotificationPermission(false);
                      }}
                      className={`py-3 px-4 rounded-2xl font-bold text-xs transition-all duration-200 flex items-center justify-center space-x-2 rtl:space-x-reverse cursor-pointer shadow-lg backdrop-blur-xl ${
                        !settings.pushNotifications 
                          ? 'bg-gradient-to-r from-slate-700 to-slate-800 text-white ring-2 ring-slate-500/50 shadow-slate-900/50 scale-[1.02] border border-slate-500/40' 
                          : 'bg-slate-900/80 text-slate-400 border border-slate-800/80 hover:text-slate-200'
                      }`}
                    >
                      <X className="w-4 h-4" />
                      <span>{t('disable')}</span>
                      {!settings.pushNotifications && <CheckCircle2 className="w-3.5 h-3.5 ml-1 text-white" />}
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

      </main>

      {/* --- MODAL: ADD BATTERY SLOT & TARGET CHARGE SELECTOR --- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900/90 backdrop-blur-3xl border border-slate-800/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-100 mb-5">{t('addSlot')}</h2>
            
            {addSlotError && (
              <div className="mb-4 p-3 bg-red-950/80 border border-red-500 text-red-300 text-xs rounded-2xl flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{addSlotError}</span>
              </div>
            )}

            <form onSubmit={handleAddSlotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select from Saved Battery Profiles</label>
                <select value={selectedBatteryProfileId} onChange={handleBatteryProfileSelect} className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-3 text-xs text-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                  <option value="">-- Choose Battery Profile --</option>
                  {batteryProfiles.map(p => <option key={p.id} value={p.id}>{p.name} ({p.capacity}mAh)</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Slot Identification Label *</label>
                <input 
                  type="text" 
                  value={newSlotForm.slotLabel} 
                  onChange={(e) => handleSlotFormChange('slotLabel', e.target.value)} 
                  className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-3 text-xs text-slate-200 focus:border-blue-500" 
                  placeholder="e.g. Living Room Remote Battery"
                  required 
                />
              </div>

              {/* TARGET CHARGE SELECTOR (FULL VS HALF CHARGE MODE) */}
              <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-2xl space-y-2">
                <label className="block text-xs font-bold text-cyan-400">{t('targetChargeMode')}</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNewSlotForm({ ...newSlotForm, targetMode: 'full' })}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 ${newSlotForm.targetMode === 'full' ? 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
                  >
                    <span>{t('fullCharge100')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewSlotForm({ ...newSlotForm, targetMode: 'half' })}
                    className={`p-3 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-2 ${newSlotForm.targetMode === 'half' ? 'bg-amber-600/30 border-amber-500 text-amber-200 shadow-lg' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'}`}
                  >
                    <span>{t('halfCharge50')}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Capacity (mAh) *</label>
                  <input 
                    type="number" 
                    min="100" 
                    max="50000" 
                    value={newSlotForm.capacity} 
                    onChange={(e) => handleSlotFormChange('capacity', e.target.value)} 
                    className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-3 text-xs text-slate-200 focus:border-blue-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Initial Charge %</label>
                  <input 
                    type="number" 
                    min="0" 
                    max="95" 
                    value={newSlotForm.initialCharge} 
                    onChange={(e) => handleSlotFormChange('initialCharge', Number(e.target.value))} 
                    className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-3 text-xs text-slate-200 focus:border-blue-500" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Voltage (V) *</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    min="0.5" 
                    max="5.0" 
                    value={newSlotForm.voltage} 
                    onChange={(e) => handleSlotFormChange('voltage', e.target.value)} 
                    className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-3 text-xs text-slate-200 focus:border-blue-500" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Size</label>
                  <select 
                    value={newSlotForm.size} 
                    onChange={(e) => handleSlotFormChange('size', e.target.value)}
                    className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-3 text-xs text-slate-200"
                  >
                    <option value="AA">AA</option>
                    <option value="AAA">AAA</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-slate-800/80">
                <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 bg-slate-800/60 backdrop-blur-xl text-xs text-slate-300 font-semibold rounded-2xl hover:bg-slate-700 transition cursor-pointer border border-slate-700/40">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-xs text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-400 transition cursor-pointer backdrop-blur-xl">Start Timer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: BATTERY PROFILE EDITOR WITH CONDITION & USAGE METADATA --- */}
      {isBatteryProfileModalOpen && editingBatteryProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900/80 backdrop-blur-3xl border border-slate-800/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-100 mb-5">
              {editingBatteryProfile.id ? 'Edit Battery Profile' : 'New Battery Profile'}
            </h2>
            
            <form onSubmit={handleSaveBatteryProfile} className="space-y-4">
              
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
                  className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-cyan-300 focus:border-blue-500"
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
                  className={`w-full bg-slate-950/80 backdrop-blur-xl border ${batteryProfileErrors.name ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200 focus:border-blue-500`} 
                  placeholder="e.g. Panasonic Eneloop"
                />
                {batteryProfileErrors.name && <span className="text-[10px] text-red-400 mt-1 block">{batteryProfileErrors.name}</span>}
              </div>

              {/* MANDATORY BATTERY CONDITION & PRIOR USAGE METADATA */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">{t('condition')} *</label>
                  <select 
                    value={editingBatteryProfile.condition || 'New'} 
                    onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, condition: e.target.value })}
                    className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-slate-200"
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
                        className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-slate-200" 
                        placeholder="e.g. 12"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-amber-400 mb-1.5">Unit</label>
                      <select 
                        value={editingBatteryProfile.priorUsageUnit || 'Months'} 
                        onChange={(e) => setEditingBatteryProfile({ ...editingBatteryProfile, priorUsageUnit: e.target.value })}
                        className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-slate-200"
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
                    className={`w-full bg-slate-950/80 backdrop-blur-xl border ${batteryProfileErrors.size ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200`}
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
                    className={`w-full bg-slate-950/80 backdrop-blur-xl border ${batteryProfileErrors.type ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200`}
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
                    className={`w-full bg-slate-950/80 backdrop-blur-xl border ${batteryProfileErrors.capacity ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200`} 
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
                    className={`w-full bg-slate-950/80 backdrop-blur-xl border ${batteryProfileErrors.voltage ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200`} 
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
                    className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-slate-200" 
                    placeholder="e.g. 50"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-slate-800/80">
                <button type="button" onClick={() => setIsBatteryProfileModalOpen(false)} className="px-5 py-2.5 bg-slate-800/60 backdrop-blur-xl text-xs text-slate-300 font-semibold rounded-2xl hover:bg-slate-700 transition cursor-pointer border border-slate-700/40">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-xs text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-400 transition cursor-pointer backdrop-blur-xl">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CHARGER EDITOR --- */}
      {isChargerModalOpen && editingCharger && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900/80 backdrop-blur-3xl border border-slate-800/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <h2 className="text-base font-bold text-slate-100 mb-5">
              {editingCharger.id ? 'Edit Charger Profile' : 'New Charger Profile'}
            </h2>
            
            <form onSubmit={handleSaveCharger} className="space-y-4">
              
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
                        slotCount: preset.slotCount,
                        isPaired: preset.isPaired,
                        notes: preset.notes
                      });
                    }
                  }}
                  className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-cyan-300 focus:border-blue-500"
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
                  className={`w-full bg-slate-950/80 backdrop-blur-xl border ${chargerErrors.name ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200`} 
                  placeholder="e.g. Universal Smart Charger"
                  required 
                />
                {chargerErrors.name && <span className="text-[10px] text-red-400 mt-1 block">{chargerErrors.name}</span>}
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
                    className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-slate-200" 
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
                    className={`w-full bg-slate-950/80 backdrop-blur-xl border ${chargerErrors.aaCurrentMa ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200`} 
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
                    className={`w-full bg-slate-950/80 backdrop-blur-xl border ${chargerErrors.aaaCurrentMa ? 'border-red-500' : 'border-slate-800'} rounded-2xl p-3 text-xs text-slate-200`} 
                    placeholder="e.g. 250"
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Channel Architecture</label>
                  <select 
                    value={editingCharger.isPaired ? 'paired' : 'independent'} 
                    onChange={(e) => setEditingCharger({ ...editingCharger, isPaired: e.target.value === 'paired' })}
                    className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-slate-200"
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
                    className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-3 text-xs text-slate-200" 
                    placeholder="e.g. Smart peak detection"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 rtl:space-x-reverse pt-4 border-t border-slate-800/80">
                <button type="button" onClick={() => setIsChargerModalOpen(false)} className="px-5 py-2.5 bg-slate-800/60 backdrop-blur-xl text-xs text-slate-300 font-semibold rounded-2xl hover:bg-slate-700 transition cursor-pointer border border-slate-700/40">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-xs text-white font-bold rounded-2xl shadow-lg shadow-blue-500/25 hover:from-blue-500 hover:to-cyan-400 transition cursor-pointer backdrop-blur-xl">Save Charger</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- SECURE DONATION PAYMENT MODAL --- */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-slate-900/90 backdrop-blur-3xl border border-slate-800/80 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setIsPaymentModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-full bg-slate-800/60 backdrop-blur-xl cursor-pointer transition border border-slate-700/40"
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
              <div className="p-5 bg-emerald-950/80 backdrop-blur-xl border border-emerald-500 text-emerald-300 rounded-2xl text-center text-xs space-y-2 shadow-lg">
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
                    className="w-full bg-slate-950/80 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-3 text-xs text-slate-200 focus:outline-none focus:border-blue-500 shadow-inner"
                    required 
                  />
                </div>

                <div className="space-y-2.5 pt-2">
                  <button 
                    onClick={() => handlePaymentRedirect('paypal')}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs py-3.5 rounded-full shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 rtl:space-x-reverse transition cursor-pointer transform hover:scale-[1.02] backdrop-blur-xl border border-blue-400/30"
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>{t('payWithPaypal')}</span>
                  </button>

                  <button 
                    onClick={() => handlePaymentRedirect('revolut')}
                    className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-white font-bold text-xs py-3.5 rounded-full shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 rtl:space-x-reverse transition cursor-pointer transform hover:scale-[1.02] backdrop-blur-xl border border-cyan-400/30"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{t('payWithRevolut')}</span>
                  </button>
                </div>

                <div className="pt-2 space-y-3 border-t border-slate-800/80">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Cryptocurrency Donation</div>
                  
                  <div 
                    onClick={() => triggerJiggle('btc')}
                    className="p-3.5 bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-slate-800 flex items-center justify-between text-xs shadow-inner"
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
                    className="p-3.5 bg-slate-950/80 backdrop-blur-xl rounded-2xl border border-slate-800 flex items-center justify-between text-xs shadow-inner"
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