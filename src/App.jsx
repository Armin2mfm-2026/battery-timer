import React, { useState, useEffect } from 'react';
import { Battery, Zap, AlertTriangle, Settings, Play, Plus, Trash2, CheckCircle2 } from 'lucide-react';

export default function App() {
  // Simple starter core to render the app successfully
  const [activeTab, setActiveTab] = useState('dashboard');
  const [batteries, setBatteries] = useState([
    { id: 1, type: 'AA', capacity: 2000, currentCharge: 20, currentOutput: 500, efficiency: 1.3, timeLeft: 3120 }
  ]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 max-w-md mx-auto">
      <header className="flex justify-between items-center mb-6 pt-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Zap className="text-amber-400" /> Smart Battery Timer
          </h1>
          <p className="text-xs text-slate-400">NiMH & Li-ion Safety Manager</p>
        </div>
        <button 
          onClick={() => setActiveTab(activeTab === 'dashboard' ? 'settings' : 'dashboard')}
          className="p-2 bg-slate-900 border border-slate-700 rounded-xl hover:bg-slate-800"
        >
          {activeTab === 'dashboard' ? <Settings size={20} /> : <Zap size={20} />}
        </button>
      </header>

      {activeTab === 'dashboard' ? (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-aaBlue/20 text-aaBlue border border-aaBlue/30">
                AA Slot #1
              </span>
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 size={14} /> Active Charging
              </span>
            </div>
            <div className="text-3xl font-mono font-bold tracking-wider mb-2 text-aaBlue">
              00:52:00
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 mb-2 overflow-hidden">
              <div className="bg-aaBlue h-2.5 rounded-full" style={{ width: '45%' }}></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>Capacity: 2000 mAh</span>
              <span>Output: 500 mA</span>
            </div>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl flex items-start gap-3">
            <AlertTriangle className="text-amber-400 shrink-0 mt-0.5" size={20} />
            <div className="text-xs text-amber-200">
              <strong className="block font-semibold mb-1">Overheat Safety Warning</strong>
              Leaving NiMH/Li-ion batteries in the charger past 100% can cause electrolyte leakage and capacity degradation.
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-4">
          <h2 className="font-semibold text-sm">Charger & Default Settings</h2>
          <div className="space-y-2 text-xs">
            <label className="block text-slate-400">Charger Output Current (mA)</label>
            <input type="number" defaultValue="500" className="w-full bg-slate-950 border border-slate-800 p-2.5 rounded-xl text-white" />
          </div>
        </div>
      )}
    </div>
  );
}