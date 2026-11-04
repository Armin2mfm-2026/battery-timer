import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Zap, BatteryCharging, AlertTriangle, ShieldCheck, Plus, Trash2, Edit3, 
  Play, Pause, RefreshCw, Volume2, VolumeX, Settings, Bell, Info, Save, 
  CheckCircle2, Clock, Battery, BatteryFull, Layers, HelpCircle, ChevronRight,
  Flame, Award, Sparkles, Moon, Sun, ArrowUpRight
} from 'lucide-react';

// Default Charger Profiles
const INITIAL_CHARGERS = [
  {
    id: 'ch-1',
    name: 'Panasonic BQ-CC55 (Smart Fast Charger)',
    inputV: 100,
    inputVMax: 240,
    inputA: 0.3,
    inputHz: '50/60Hz',
    outputV: 1.5,
    aaCurrentMa: 750, // per slot (1-2 slots high speed)
    aaaCurrentMa: 375,
    isPaired: false, // Independent channel monitoring
    notes: 'Smart individual slot charging with peak detection'
  },
  {
    id: 'ch-2',
    name: 'Basic 4-Slot Paired NiMH Charger',
    inputV: 120,
    inputVMax: 240,
    inputA: 0.15,
    inputHz: '60Hz',
    outputV: 2.8, // total for 2 series slots
    aaCurrentMa: 300,
    aaaCurrentMa: 150,
    isPaired: true, // Slots charge in pairs (Ch1+2, Ch3+4 share current)
    notes: 'Shares current across slot pairs (1&2, 3&4)'
  },
  {
    id: 'ch-3',
    name: 'Nitecore D4 Digital Super Charger',
    inputV: 100,
    inputVMax: 240,
    inputA: 0.5,
    inputHz: '50/60Hz',
    outputV: 4.2,
    aaCurrentMa: 500,
    aaaCurrentMa: 250,
    isPaired: false,
    notes: 'Multi-chemistry universal charger'
  }
];

// Standard Battery Presets
const BATTERY_PRESETS = [
  { id: 'p1', name: 'Eneloop AA NiMH Standard', size: 'AA', type: 'NiMH', capacity: 1900, voltage: 1.2 },
  { id: 'p2', name: 'Eneloop Pro AA High Capacity', size: 'AA', type: 'NiMH', capacity: 2500, voltage: 1.2 },
  { id: 'p3', name: 'AmazonBasics AA High-Drain', size: 'AA', type: 'NiMH', capacity: 2400, voltage: 1.2 },
  { id: 'p4', name: 'Eneloop AAA NiMH Standard', size: 'AAA', type: 'NiMH', capacity: 800, voltage: 1.2 },
  { id: 'p5', name: 'Eneloop Pro AAA NiMH', size: 'AAA', type: 'NiMH', capacity: 950, voltage: 1.2 },
  { id: 'p6', name: '14500 Li-ion AA Size (3.7V)', size: 'AA', type: 'Li-ion', capacity: 800, voltage: 3.7 },
  { id: 'p7', name: '10440 Li-ion AAA Size (3.7V)', size: 'AAA', type: 'Li-ion', capacity: 350, voltage: 3.7 },
];

export default function App() {
  // --- Persistent & Core States ---
  const [chargers, setChargers] = useState(() => {
    const saved = localStorage.getItem('batt_chargers');
    return saved ? JSON.parse(saved) : INITIAL_CHARGERS;
  });
  
  const [activeChargerId, setActiveChargerId] = useState(() => {
    return localStorage.getItem('batt_active_charger_id') || INITIAL_CHARGERS[0].id;
  });

  const [activeSlots, setActiveSlots] = useState(() => {
    const saved = localStorage.getItem('batt_active_slots');
    return saved ? JSON.parse(saved) : [];
  });

  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('batt_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('batt_settings');
    return saved ? JSON.parse(saved) : {
      audioAlerts: true,
      pushNotifications: true,
      defaultEfficiency: 1.3, // 1.3 = 130% energy compensation for heat/resistance
      autoArchiveFinished: false
    };
  });

  // UI Navigation Tabs: 'dashboard' | 'chargers' | 'safety' | 'history' | 'settings'
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Modal & Edit States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChargerModalOpen, setIsChargerModalOpen] = useState(false);
  const [editingCharger, setEditingCharger] = useState(null);
  const [selectedPresetId, setSelectedPresetId] = useState('');

  // Form State for Adding Battery Slot
  const [newSlotForm, setNewSlotForm] = useState({
    slotLabel: '',
    size: 'AA',
    type: 'NiMH',
    capacity: 2000,
    voltage: 1.2,
    initialCharge: 0,
    efficiency: settings.defaultEfficiency
  });

  // Audio Context reference for completion chime synthesizer
  const audioCtxRef = useRef(null);

  // Active Charger Lookup
  const currentCharger = useMemo(() => {
    return chargers.find(c => c.id === activeChargerId) || chargers[0];
  }, [chargers, activeChargerId]);

  // Sync LocalStorage
  useEffect(() => {
    localStorage.setItem('batt_chargers', JSON.stringify(chargers));
  }, [chargers]);

  useEffect(() => {
    localStorage.setItem('batt_active_charger_id', activeChargerId);
  }, [activeChargerId]);

  useEffect(() => {
    localStorage.setItem('batt_active_slots', JSON.stringify(activeSlots));
  }, [activeSlots]);

  useEffect(() => {
    localStorage.setItem('batt_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('batt_settings', JSON.stringify(settings));
  }, [settings]);

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

          // 100% completion check
          if (elapsedSec >= totalDurationSec && !slot.alertTriggered) {
            alertTriggered = true;
            newStatus = 'completed';
            triggerAlarmSound(slot.label || `${slot.size} Slot`);
            if (settings.pushNotifications && 'Notification' in window && Notification.permission === 'granted') {
              new Notification('🔋 Battery Fully Charged!', {
                body: `${slot.size} battery (${slot.capacity}mAh) has reached 100% target time.`
              });
            }
          }

          if (elapsedSec !== slot.elapsedSec || newStatus !== slot.status) {
            changed = true;
            return {
              ...slot,
              elapsedSec,
              remainingSec,
              overchargeSec,
              status: newStatus,
              alertTriggered
            };
          }
          return slot;
        });

        return changed ? updated : prevSlots;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [settings]);

  // Audio Synthesizer Alarm Sound using Web Audio API
  const triggerAlarmSound = (slotName) => {
    if (!settings.audioAlerts) return;
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Play pleasant multi-tone sequence
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
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
    } catch (e) {
      console.error('Audio playback error:', e);
    }
  };

  // Request Notification Permission
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setSettings(s => ({ ...s, pushNotifications: true }));
        }
      });
    }
  };

  // --- Dynamic Charging Engine Calculations ---
  const calculateChargeTime = (size, capacity, initialCharge, efficiency, customCharger = null) => {
    const charger = customCharger || currentCharger;
    let baseCurrent = size === 'AA' ? charger.aaCurrentMa : charger.aaaCurrentMa;

    const netCapacityNeeded = capacity * (1 - (initialCharge / 100));
    if (baseCurrent <= 0) return 0;
    
    const decimalHours = (netCapacityNeeded / baseCurrent) * efficiency;
    const totalSec = Math.round(decimalHours * 3600);
    return {
      hours: decimalHours,
      totalSec,
      effectiveCurrentMa: baseCurrent
    };
  };

  // Handle Preset Battery Selection in Add Form
  const handlePresetSelect = (e) => {
    const pId = e.target.value;
    setSelectedPresetId(pId);
    if (!pId) return;
    const p = BATTERY_PRESETS.find(item => item.id === pId);
    if (p) {
      setNewSlotForm(prev => ({
        ...prev,
        size: p.size,
        type: p.type,
        capacity: p.capacity,
        voltage: p.voltage,
        slotLabel: `${p.name}`
      }));
    }
  };

  // Dynamic Add Battery to Active Queue mid-cycle
  const handleAddSlotSubmit = (e) => {
    e.preventDefault();
    const { slotLabel, size, type, capacity, voltage, initialCharge, efficiency } = newSlotForm;

    const calc = calculateChargeTime(size, capacity, initialCharge, efficiency);

    const newSlot = {
      id: 'slot-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      label: slotLabel || `${size} - ${capacity}mAh`,
      size,
      type,
      capacity: Number(capacity),
      voltage: Number(voltage),
      initialCharge: Number(initialCharge),
      efficiency: Number(efficiency),
      chargerCurrentMa: calc.effectiveCurrentMa,
      totalSec: calc.totalSec,
      elapsedSec: 0,
      remainingSec: calc.totalSec,
      overchargeSec: 0,
      startTime: Date.now(),
      status: 'charging',
      alertTriggered: false
    };

    setActiveSlots(prev => [...prev, newSlot]);
    setIsAddModalOpen(false);

    // Reset Form
    setNewSlotForm({
      slotLabel: '',
      size: 'AA',
      type: 'NiMH',
      capacity: 2000,
      voltage: 1.2,
      initialCharge: 0,
      efficiency: settings.defaultEfficiency
    });
    setSelectedPresetId('');
  };

  // Controls for individual slots
  const handleTogglePause = (id) => {
    setActiveSlots(prev => prev.map(slot => {
      if (slot.id !== id) return slot;
      if (slot.status === 'charging') {
        return { ...slot, status: 'paused' };
      } else if (slot.status === 'paused') {
        const pausedDurationSec = slot.elapsedSec;
        return {
          ...slot,
          startTime: Date.now() - (pausedDurationSec * 1000),
          status: 'charging'
        };
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
        actualChargeSec: targetSlot.elapsedSec
      };
      setHistory(h => [historyItem, ...h]);
    }
    setActiveSlots(prev => prev.filter(s => s.id !== id));
  };

  const handleResetSlot = (id) => {
    setActiveSlots(prev => prev.map(slot => {
      if (slot.id !== id) return slot;
      return {
        ...slot,
        startTime: Date.now(),
        elapsedSec: 0,
        remainingSec: slot.totalSec,
        overchargeSec: 0,
        status: 'charging',
        alertTriggered: false
      };
    }));
  };

  // Save / Edit Charger Profile
  const handleSaveCharger = (e) => {
    e.preventDefault();
    if (!editingCharger) return;

    if (editingCharger.id) {
      setChargers(prev => prev.map(c => c.id === editingCharger.id ? editingCharger : c));
    } else {
      const created = {
        ...editingCharger,
        id: 'ch-' + Date.now()
      };
      setChargers(prev => [...prev, created]);
      setActiveChargerId(created.id);
    }
    setIsChargerModalOpen(false);
    setEditingCharger(null);
  };

  // Helper time formatter
  const formatTime = (totalSeconds) => {
    if (totalSeconds < 0) totalSeconds = 0;
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const pad = (num) => String(num).padStart(2, '0');
    return `${pad(hrs)}h ${pad(mins)}m ${pad(secs)}s`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-20 selection:bg-blue-500 selection:text-white">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-400 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-slate-400">
                VoltGuard Pro
              </h1>
              <p className="text-xs text-slate-400">Smart Battery Charging & Thermal Protection</p>
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-300">Active Charger:</span>
              <select 
                value={activeChargerId}
                onChange={(e) => setActiveChargerId(e.target.value)}
                className="bg-slate-900 text-xs text-blue-300 font-medium border-0 focus:ring-1 focus:ring-blue-500 rounded px-2 py-1"
              >
                {chargers.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Battery Slot</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto scrollbar-none">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BatteryCharging, count: activeSlots.length },
            { id: 'chargers', label: 'Charger Profiles', icon: Layers },
            { id: 'safety', label: 'Safety & Physics', icon: ShieldCheck },
            { id: 'history', label: 'Log History', icon: Clock },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all whitespace-nowrap ${
                  isActive 
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-inner' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && tab.count > 0 && (
                  <span className="ml-1.5 px-2 py-0.5 text-xs font-bold rounded-full bg-blue-500 text-slate-950">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Dynamic Mobile Top Action Bar */}
        <div className="md:hidden mb-6 flex items-center justify-between gap-2">
          <select 
            value={activeChargerId}
            onChange={(e) => setActiveChargerId(e.target.value)}
            className="flex-1 bg-slate-900 border border-slate-700 text-xs text-blue-300 rounded-lg p-2.5"
          >
            {chargers.map(c => (
              <option key={c.id} value={c.id}>🔌 {c.name}</option>
            ))}
          </select>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1 bg-blue-600 text-white text-xs font-semibold px-3 py-2.5 rounded-lg shadow"
          >
            <Plus className="w-4 h-4" />
            <span>Add Slot</span>
          </button>
        </div>

        {/* TAB 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
              <div className="flex items-center space-x-3.5">
                <div className="p-3 bg-slate-800 rounded-xl text-blue-400 border border-slate-700">
                  <Zap className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h2 className="font-semibold text-slate-100 text-base">{currentCharger.name}</h2>
                    {currentCharger.isPaired ? (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        Paired Channels
                      </span>
                    ) : (
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Independent Channels
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Input: {currentCharger.inputV}-{currentCharger.inputVMax}V ({currentCharger.inputHz}) • Output Rate: <span className="text-blue-400 font-medium">AA: {currentCharger.aaCurrentMa}mA</span> | <span className="text-amber-400 font-medium">AAA: {currentCharger.aaaCurrentMa}mA</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert Battery to Queue</span>
                </button>
              </div>
            </div>

            {activeSlots.length === 0 && (
              <div className="border border-dashed border-slate-800 rounded-2xl p-12 text-center bg-slate-900/30">
                <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-500">
                  <BatteryCharging className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-300">No Active Battery Charging Slots</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
                  Add an AA or AAA rechargeable battery slot to calculate exact charging times, monitor chemical heat dissipation, and get completion alarms.
                </p>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-5 py-2.5 rounded-xl shadow transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Insert First Battery Slot</span>
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
                  <div 
                    key={slot.id}
                    className={`relative rounded-2xl bg-slate-900/90 border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg ${
                      isOvercharging 
                        ? 'border-red-500/60 shadow-red-950/40 ring-1 ring-red-500/40' 
                        : isAA 
                          ? 'border-blue-500/30 hover:border-blue-500/50 shadow-blue-950/20' 
                          : 'border-amber-500/30 hover:border-amber-500/50 shadow-amber-950/20'
                    }`}
                  >
                    <div className={`h-1.5 w-full ${isOvercharging ? 'bg-red-500 animate-pulse' : isAA ? 'bg-blue-500' : 'bg-amber-500'}`} />

                    <div className="p-5 flex-1 flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`relative flex items-center justify-center rounded-lg ${isAA ? 'w-10 h-16 bg-blue-950/80 border-2 border-blue-500/80 text-blue-400' : 'w-8 h-14 bg-amber-950/80 border-2 border-amber-500/80 text-amber-400'}`}>
                            <div className={`absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-1.5 rounded-t-sm ${isAA ? 'bg-blue-400' : 'bg-amber-400'}`} />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{slot.size}</span>
                          </div>

                          <div>
                            <div className="flex items-center space-x-2">
                              <h3 className="font-bold text-slate-100 text-sm">{slot.label}</h3>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                                isAA ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              }`}>
                                {slot.size} • {slot.type}
                              </span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">
                              {slot.capacity} mAh | {slot.voltage}V | Eff: {slot.efficiency}x
                            </p>
                          </div>
                        </div>

                        <div>
                          {isOvercharging ? (
                            <span className="flex items-center space-x-1 text-[11px] font-bold text-red-400 bg-red-950/80 border border-red-800 px-2.5 py-1 rounded-full animate-bounce">
                              <Flame className="w-3.5 h-3.5 text-red-500" />
                              <span>OVERCHARGING</span>
                            </span>
                          ) : isCompleted ? (
                            <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-1 rounded-full">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>DONE</span>
                            </span>
                          ) : slot.status === 'paused' ? (
                            <span className="text-[11px] font-bold text-amber-400 bg-amber-950/80 border border-amber-800 px-2 py-1 rounded-full">
                              PAUSED
                            </span>
                          ) : (
                            <span className="flex items-center space-x-1 text-[11px] font-semibold text-blue-400 bg-blue-950/80 border border-blue-800 px-2.5 py-1 rounded-full">
                              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                              <span>CHARGING</span>
                            </span>
                          )}
                        </div>
                      </div>

                      {isOvercharging && (
                        <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-800/80 text-red-200 text-xs space-y-1">
                          <div className="flex items-center space-x-2 font-bold text-red-400">
                            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                            <span>Overcharge Risk: Chemical Degradation</span>
                          </div>
                          <p className="text-[11px] leading-relaxed text-red-300/90">
                            Battery is past 100% by <strong className="text-white">{formatTime(slot.overchargeSec)}</strong>. Unplug now to avoid electrolyte venting & permanent capacity loss.
                          </p>
                        </div>
                      )}

                      <div className="bg-slate-950/80 rounded-xl p-4 border border-slate-800 mb-4 text-center">
                        <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">
                          {isOvercharging ? 'Time Exceeded' : 'Time Remaining'}
                        </div>
                        <div className={`text-2xl font-black font-mono tracking-tight ${
                          isOvercharging 
                            ? 'text-red-400' 
                            : isAA 
                              ? 'text-blue-400' 
                              : 'text-amber-400'
                        }`}>
                          {isOvercharging ? `+${formatTime(slot.overchargeSec)}` : formatTime(slot.remainingSec)}
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">
                          Target Charge Time: {formatTime(slot.totalSec)} @ {slot.chargerCurrentMa}mA
                        </div>
                      </div>

                      <div className="space-y-1.5 mb-5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-400">Progress</span>
                          <span className={isAA ? 'text-blue-400' : 'text-amber-400'}>{pct}%</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-3 p-0.5 overflow-hidden border border-slate-800">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 relative ${
                              isOvercharging 
                                ? 'bg-gradient-to-r from-red-600 to-amber-500' 
                                : isAA 
                                  ? 'bg-gradient-to-r from-blue-600 to-cyan-400' 
                                  : 'bg-gradient-to-r from-amber-600 to-orange-400'
                            }`} 
                            style={{ width: `${pct}%` }}
                          >
                            {slot.status === 'charging' && !isCompleted && (
                              <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 pt-2 border-t border-slate-800/80">
                        <button
                          onClick={() => handleTogglePause(slot.id)}
                          className="flex-1 flex items-center justify-center space-x-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium py-2 rounded-lg transition"
                        >
                          {slot.status === 'charging' ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span>Pause</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Resume</span>
                            </>
                          )}
                        </button>

                        <button
                          onClick={() => handleResetSlot(slot.id)}
                          title="Restart Timer"
                          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 rounded-lg transition"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleRemoveSlot(slot.id, true)}
                          title="Finish & Save to History"
                          className="flex-1 flex items-center justify-center space-x-1 bg-slate-800 hover:bg-red-950/80 text-slate-300 hover:text-red-300 border border-transparent hover:border-red-800/60 text-xs font-medium py-2 rounded-lg transition"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Unplug</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: CHARGER PROFILES */}
        {activeTab === 'chargers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
              <div>
                <h2 className="text-lg font-bold text-slate-100">Saved Charger Specs & Profiles</h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure output current ratings (mA) for AA & AAA channels to calculate precise charging rates.
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingCharger({
                    name: 'New Custom Charger',
                    inputV: 100,
                    inputVMax: 240,
                    inputA: 0.5,
                    inputHz: '50/60Hz',
                    outputV: 1.5,
                    aaCurrentMa: 500,
                    aaaCurrentMa: 250,
                    isPaired: false,
                    notes: ''
                  });
                  setIsChargerModalOpen(true);
                }}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2.5 rounded-xl shadow transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create Charger Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {chargers.map(charger => {
                const isActive = charger.id === activeChargerId;
                return (
                  <div 
                    key={charger.id}
                    className={`rounded-2xl bg-slate-900 p-5 border transition-all flex flex-col justify-between ${
                      isActive ? 'border-blue-500 ring-1 ring-blue-500/40 shadow-lg shadow-blue-950/30' : 'border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-bold text-slate-100 text-base">{charger.name}</h3>
                          <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded mt-1 ${
                            charger.isPaired ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          }`}>
                            {charger.isPaired ? 'Paired Channel Circuitry' : 'Independent Channel Circuitry'}
                          </span>
                        </div>
                        {isActive && (
                          <span className="bg-blue-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="space-y-2 text-xs text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/80 mb-4">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Input Rating:</span>
                          <span className="font-mono">{charger.inputV}-{charger.inputVMax}V AC | {charger.inputA}A ({charger.inputHz})</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Output Voltage:</span>
                          <span className="font-mono">{charger.outputV}V DC</span>
                        </div>
                        <div className="flex justify-between text-blue-400 font-semibold">
                          <span>AA Charging Current:</span>
                          <span className="font-mono">{charger.aaCurrentMa} mA</span>
                        </div>
                        <div className="flex justify-between text-amber-400 font-semibold">
                          <span>AAA Charging Current:</span>
                          <span className="font-mono">{charger.aaaCurrentMa} mA</span>
                        </div>
                      </div>

                      {charger.notes && (
                        <p className="text-xs text-slate-400 italic mb-4">"{charger.notes}"</p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 pt-3 border-t border-slate-800">
                      {!isActive ? (
                        <button
                          onClick={() => setActiveChargerId(charger.id)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-blue-400 font-medium text-xs py-2 rounded-lg transition"
                        >
                          Set Active
                        </button>
                      ) : (
                        <span className="flex-1 text-center text-xs text-slate-500 py-2 font-medium">Selected Charger</span>
                      )}

                      <button
                        onClick={() => {
                          setEditingCharger({ ...charger });
                          setIsChargerModalOpen(true);
                        }}
                        className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                        title="Edit Profile"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {chargers.length > 1 && (
                        <button
                          onClick={() => {
                            setChargers(prev => prev.filter(c => c.id !== charger.id));
                            if (isActive) setActiveChargerId(chargers.find(c => c.id !== charger.id).id);
                          }}
                          className="p-2 bg-slate-800 hover:bg-red-950 text-red-400 rounded-lg transition"
                          title="Delete Charger"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: SAFETY & PHYSICS GUIDE */}
        {activeTab === 'safety' && (
          <div className="space-y-6 max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-red-950/40 via-slate-900 to-slate-900 border border-red-900/40 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-3 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-100">Chemical Degradation & Thermal Safety Guide</h2>
                  <p className="text-xs text-slate-400">Understanding why precise timers protect rechargeable NiMH & Li-ion cells</p>
                </div>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unlike simple smart devices, standard plug-in battery chargers often lack individual dynamic peak detection (-ΔV) on budget models. Leaving NiMH or Li-ion batteries plugged in past 100% capacity converts excess current directly into internal chemical heat.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-2 text-blue-400 font-bold">
                  <Info className="w-5 h-5" />
                  <span>NiMH (Nickel-Metal Hydride) Risk Profile</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2.5 list-disc list-inside leading-relaxed">
                  <li><strong className="text-slate-100">Thermal Pressure Venting:</strong> Overcharging generates high internal oxygen gas pressure, triggering the safety valve to vent gas and dry out internal electrolyte permanently.</li>
                  <li><strong className="text-slate-100">Efficiency Compensation (1.2x - 1.4x):</strong> Charging is not 100% efficient; ~20-30% of input energy is lost to internal chemical resistance as heat.</li>
                  <li><strong className="text-slate-100">Capacity Loss:</strong> Prolonged over-warming accelerates internal separator breakdown, causing rapid self-discharge.</li>
                </ul>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center space-x-2 text-amber-400 font-bold">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Li-ion (14500 / 10440) Safety</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2.5 list-disc list-inside leading-relaxed">
                  <li><strong className="text-slate-100">Strict Voltage Limits:</strong> Li-ion batteries must never exceed 4.20V nominal cutoff. Overcharging causes metallic lithium plating.</li>
                  <li><strong className="text-slate-100">Thermal Runaway:</strong> Sustained overcharging can trigger irreversible exothermic breakdown leading to fire risks.</li>
                  <li><strong className="text-slate-100">Paired Channel Risks:</strong> Charging unevenly depleted Li-ion batteries in paired slots forces excess voltage onto the weaker cell.</li>
                </ul>
              </div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
              <h3 className="font-bold text-slate-200 text-sm mb-3 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>The Mathematical Charging Engine Formula</span>
              </h3>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto">
                Time (Hours) = [ ( Battery Capacity mAh * (1 - Initial Charge % / 100) ) / Charger Current mA ] * Efficiency Factor
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                VoltGuard Pro applies this continuous integration formula dynamically when you insert or adjust batteries mid-cycle.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: HISTORY */}
        {activeTab === 'history' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="flex justify-between items-center bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <div>
                <h2 className="font-bold text-slate-100 text-sm">Battery Charge Log History</h2>
                <p className="text-xs text-slate-400">Past completed and unplugged charging cycles</p>
              </div>
              {history.length > 0 && (
                <button
                  onClick={() => setHistory([])}
                  className="text-xs text-red-400 hover:text-red-300 bg-red-950/40 border border-red-900/60 px-3 py-1.5 rounded-lg transition"
                >
                  Clear History
                </button>
              )}
            </div>

            {history.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-500 bg-slate-900/40 border border-dashed border-slate-800 rounded-2xl">
                No past charging history logged yet.
              </div>
            ) : (
              <div className="space-y-3">
                {history.map((item, idx) => (
                  <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        item.size === 'AA' ? 'bg-blue-500/20 text-blue-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {item.size}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200 text-xs">{item.label}</div>
                        <div className="text-[11px] text-slate-400">
                          {item.capacity}mAh • {item.type} • {new Date(item.finishedAt).toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono font-bold text-slate-300">{formatTime(item.actualChargeSec)}</div>
                      <div className="text-[10px] text-emerald-400 font-semibold">Completed</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: SETTINGS */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <Settings className="w-5 h-5 text-blue-400" />
              <span>Application Preferences & Alarms</span>
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200 flex items-center space-x-2">
                    {settings.audioAlerts ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
                    <span>Web Audio Completion Chime</span>
                  </div>
                  <p className="text-slate-400">Play synthesize multi-tone audio alarm when a battery reaches target timer.</p>
                </div>
                <input 
                  type="checkbox"
                  checked={settings.audioAlerts}
                  onChange={(e) => {
                    setSettings(s => ({ ...s, audioAlerts: e.target.checked }));
                    if (e.target.checked) triggerAlarmSound('Test');
                  }}
                  className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
                <div className="space-y-0.5">
                  <div className="font-semibold text-slate-200 flex items-center space-x-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <span>Browser Push Notifications</span>
                  </div>
                  <p className="text-slate-400">Receive background alarms even if switching browser tabs.</p>
                </div>
                <button
                  onClick={() => {
                    if (!settings.pushNotifications) requestNotificationPermission();
                    else setSettings(s => ({ ...s, pushNotifications: false }));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                    settings.pushNotifications ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {settings.pushNotifications ? 'Enabled' : 'Enable'}
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                <div className="flex justify-between font-semibold text-slate-200">
                  <span>Default Efficiency Loss Factor</span>
                  <span className="text-blue-400 font-mono font-bold">{settings.defaultEfficiency}x</span>
                </div>
                <input 
                  type="range"
                  min="1.0"
                  max="1.5"
                  step="0.05"
                  value={settings.defaultEfficiency}
                  onChange={(e) => setSettings(s => ({ ...s, defaultEfficiency: parseFloat(e.target.value) }))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <p className="text-slate-400 text-[11px]">
                  Standard NiMH efficiency is ~1.2x - 1.4x (accounting for 20-30% thermal resistance loss).
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* MODAL 1: ADD BATTERY TO QUEUE (Fully Responsive with max-h and scroll) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <h2 className="text-base font-bold text-slate-100 mb-4 flex items-center space-x-2">
              <BatteryCharging className="w-5 h-5 text-blue-400" />
              <span>Insert Battery Slot (Mid-Cycle Ready)</span>
            </h2>

            <form onSubmit={handleAddSlotSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Quick Battery Presets</label>
                <select
                  value={selectedPresetId}
                  onChange={handlePresetSelect}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                >
                  <option value="">-- Choose Preset or Customize Below --</option>
                  {BATTERY_PRESETS.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.capacity}mAh - {p.type})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Slot Identification Label</label>
                <input 
                  type="text"
                  placeholder="e.g. Camera Flash Battery #1"
                  value={newSlotForm.slotLabel}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, slotLabel: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Battery Size</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['AA', 'AAA'].map(s => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => setNewSlotForm({ ...newSlotForm, size: s })}
                        className={`py-2 rounded-xl text-xs font-bold transition border ${
                          newSlotForm.size === s 
                            ? s === 'AA' 
                              ? 'bg-blue-600 text-white border-blue-500' 
                              : 'bg-amber-600 text-white border-amber-500'
                            : 'bg-slate-950 text-slate-400 border-slate-800'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Chemistry Type</label>
                  <select
                    value={newSlotForm.type}
                    onChange={(e) => setNewSlotForm({ ...newSlotForm, type: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                  >
                    <option value="NiMH">NiMH (1.2V Standard)</option>
                    <option value="Li-ion">Li-ion (1.5V / 3.7V)</option>
                    <option value="NiCd">NiCd (Legacy 1.2V)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Capacity (mAh)</label>
                  <input 
                    type="number"
                    min="100"
                    max="10000"
                    step="50"
                    value={newSlotForm.capacity}
                    onChange={(e) => setNewSlotForm({ ...newSlotForm, capacity: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Initial Charge %</label>
                  <input 
                    type="number"
                    min="0"
                    max="95"
                    value={newSlotForm.initialCharge}
                    onChange={(e) => setNewSlotForm({ ...newSlotForm, initialCharge: parseInt(e.target.value) || 0 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1">
                  <span>Thermal Loss Efficiency Factor</span>
                  <span className="text-blue-400">{newSlotForm.efficiency}x</span>
                </div>
                <input 
                  type="range"
                  min="1.1"
                  max="1.5"
                  step="0.05"
                  value={newSlotForm.efficiency}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, efficiency: parseFloat(e.target.value) })}
                  className="w-full accent-blue-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                  <span>1.1x (Fast / Low Resistance)</span>
                  <span>1.4x (High Resistance / Standard)</span>
                </div>
              </div>

              {newSlotForm.capacity > 0 && (
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex justify-between items-center">
                  <span>Calculated Time:</span>
                  <span className="font-mono font-bold text-blue-400">
                    {formatTime(calculateChargeTime(newSlotForm.size, newSlotForm.capacity, newSlotForm.initialCharge, newSlotForm.efficiency).totalSec)}
                  </span>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition"
                >
                  Start Charging Timer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: CHARGER EDITOR (Fully Responsive with max-h, scroll, and stacking grids) */}
      {isChargerModalOpen && editingCharger && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200">
            <h2 className="text-base font-bold text-slate-100 mb-4 flex items-center space-x-2">
              <Zap className="w-5 h-5 text-blue-400" />
              <span>{editingCharger.id ? 'Edit Charger Profile' : 'New Charger Profile'}</span>
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

              {/* Responsive grid: stacks vertically on mobile, 3-columns on small+ screens */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Input V (Min)</label>
                  <input 
                    type="number"
                    value={editingCharger.inputV}
                    onChange={(e) => setEditingCharger({ ...editingCharger, inputV: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Input V (Max)</label>
                  <input 
                    type="number"
                    value={editingCharger.inputVMax}
                    onChange={(e) => setEditingCharger({ ...editingCharger, inputVMax: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Input Amps (A)</label>
                  <input 
                    type="number"
                    step="0.05"
                    value={editingCharger.inputA}
                    onChange={(e) => setEditingCharger({ ...editingCharger, inputA: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-blue-400 mb-1">AA Output Current (mA)</label>
                  <input 
                    type="number"
                    value={editingCharger.aaCurrentMa}
                    onChange={(e) => setEditingCharger({ ...editingCharger, aaCurrentMa: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-400 mb-1">AAA Output Current (mA)</label>
                  <input 
                    type="number"
                    value={editingCharger.aaaCurrentMa}
                    onChange={(e) => setEditingCharger({ ...editingCharger, aaaCurrentMa: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <input 
                  type="checkbox"
                  id="pairedCheck"
                  checked={editingCharger.isPaired}
                  onChange={(e) => setEditingCharger({ ...editingCharger, isPaired: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
                <label htmlFor="pairedCheck" className="text-xs text-slate-300 cursor-pointer">
                  Slots charge in <strong>Pairs</strong> (Ch 1+2 share output circuit)
                </label>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsChargerModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-xl shadow transition"
                >
                  Save Charger Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}