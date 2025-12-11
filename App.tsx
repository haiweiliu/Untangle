import React, { useState, useEffect } from 'react';
import { Activity, ArrowRight, CheckCircle, Wind, Shield, Zap, LayoutDashboard, Plus, Sparkles, Heart, Calendar } from 'lucide-react';
import { HelloKittyIcon } from './components/HelloKittyIcon';
import { BowIcon } from './components/BowIcon';
import { AgencyTriangle } from './components/AgencyTriangle';
import { classifySituation } from './services/geminiService';
import { ALL_SUGGESTIONS } from './constants';
import { AgencyResult, ViewType } from './types';

export default function App() {
  const [view, setView] = useState<ViewType>('input');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<AgencyResult | null>(null);
  const [history, setHistory] = useState<AgencyResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  // Rotate suggestions
  useEffect(() => {
    const interval = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 3) % ALL_SUGGESTIONS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const currentSuggestions = [
    ALL_SUGGESTIONS[suggestionIndex % ALL_SUGGESTIONS.length],
    ALL_SUGGESTIONS[(suggestionIndex + 1) % ALL_SUGGESTIONS.length],
    ALL_SUGGESTIONS[(suggestionIndex + 2) % ALL_SUGGESTIONS.length]
  ];

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem('agency_os_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem('agency_os_history', JSON.stringify(history));
  }, [history]);

  const handleClassify = async (textOverride?: string) => {
    const textToProcess = typeof textOverride === 'string' ? textOverride : input;

    if (!textToProcess.trim()) return;

    if (typeof textOverride === 'string') {
        setInput(textOverride);
    }

    setLoading(true);
    setView('processing');
    setError(null);

    try {
      const parsedResult = await classifySituation(textToProcess);
      
      // Add timestamp and original input to result for history keeping
      const finalResult: AgencyResult = {
        ...parsedResult,
        timestamp: new Date().toISOString(),
        original_input: textToProcess
      };

      setResult(finalResult);
      setView('result');
    } catch (err) {
      console.error(err);
      setError("The Agency Engine encountered interference. Please try again.");
      setView('input');
    } finally {
      setLoading(false);
    }
  };

  const saveAndClose = () => {
    const isAlreadySaved = result && history.some(h => h.timestamp === result.timestamp);
    if (result && !isAlreadySaved) {
      setHistory([result, ...history]);
    }
    setInput('');
    setResult(null);
    setView('dashboard');
  };
  
  const reopenLog = (item: AgencyResult) => {
      setResult(item);
      setView('result');
  };

  const bgPattern: React.CSSProperties = {
    backgroundImage: `radial-gradient(#fbcfe8 1.5px, transparent 1.5px)`,
    backgroundSize: '24px 24px',
    backgroundColor: '#fff1f2'
  };

  // --- PROCESSING VIEW ---
  if (view === 'processing') {
    return (
        <div style={bgPattern} className="flex flex-col h-screen w-full items-center justify-center p-6 text-center animate-in zoom-in-95 duration-500 font-sans">
            <div className="relative">
                <HelloKittyIcon size={140} className="animate-bounce drop-shadow-lg" />
                <Sparkles className="absolute -top-4 -right-4 text-pink-500 w-8 h-8 animate-pulse" />
                <Sparkles className="absolute -bottom-2 -left-4 text-pink-400 w-6 h-6 animate-pulse delay-100" />
            </div>
            <h2 className="text-2xl font-black text-pink-900 mt-8 tracking-tight bg-white/80 px-6 py-2 rounded-full shadow-sm border border-pink-100">
                Thinking...
            </h2>
            <p className="mt-4 text-pink-500 font-bold max-w-xs italic text-sm">
                "99% of stress comes from misclassification."
            </p>
        </div>
    );
  }

  // --- RESULT VIEW ---
  if (view === 'result' && result) {
    const isMine = result.dominant_domain === '我的事';
    const isTheirs = result.dominant_domain === '別人的事';
    // const isLife = result.dominant_domain === '天的事';
    
    const isReviewMode = history.some(h => h.timestamp === result.timestamp);
    
    const unnecessaryLoad = result.classification.others_domain + result.classification.life_domain;
    let achievementText = "";
    let achievementColor = "";
    
    if (unnecessaryLoad > 60) {
        achievementText = "High Relief Achieved";
        achievementColor = "text-emerald-500";
    } else if (isMine) {
        achievementText = "Full Control Unlocked";
        achievementColor = "text-pink-500";
    } else {
        achievementText = "Clarity Restored";
        achievementColor = "text-blue-500";
    }

    const accentColor = isMine ? 'text-pink-600' : isTheirs ? 'text-amber-600' : 'text-purple-600';
    const bgAccent = isMine ? 'bg-pink-50' : isTheirs ? 'bg-amber-50' : 'bg-purple-50';
    const borderAccent = isMine ? 'border-pink-300' : isTheirs ? 'border-amber-300' : 'border-purple-300';

    return (
      <div style={bgPattern} className="min-h-screen w-full font-sans">
        <div className="flex flex-col h-full max-w-xl mx-auto p-4 animate-in slide-in-from-bottom-4 duration-500 overflow-y-auto">
          <div className="flex justify-between items-center mb-4 bg-white/80 p-3 rounded-2xl shadow-sm border border-pink-100 backdrop-blur-sm">
              <span className="text-xs font-bold text-pink-500 uppercase tracking-widest flex items-center gap-1">
                  <BowIcon className="w-5 h-4 text-pink-400" /> Analysis
              </span>
              <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white border border-pink-100 ${achievementColor}`}>
                  {achievementText}
              </span>
          </div>

          <AgencyTriangle scores={result.classification} dominant={result.dominant_domain} />

          <div className="text-center mb-6">
              <h2 className="text-4xl font-black tracking-tight text-pink-950 mb-1 drop-shadow-sm">
                  {result.dominant_domain}
              </h2>
              <div className="flex items-center justify-center gap-2">
                 {isMine && <Heart size={16} className="text-pink-500 fill-pink-500 animate-pulse" />}
                 <p className={`text-sm font-bold uppercase tracking-widest ${accentColor} bg-white/50 px-3 py-1 rounded-full inline-block`}>
                     {result.dominant_domain === '我的事' ? 'My Responsibility' : result.dominant_domain === '別人的事' ? 'Not Your Control' : 'Life\'s Domain'}
                 </p>
              </div>
          </div>

          {/* ANALYTIC CARD */}
          <div className="bg-white p-5 rounded-3xl border-2 border-pink-100 shadow-md mb-4 grid grid-cols-2 gap-4">
               <div className="flex flex-col justify-center items-center border-r border-gray-100">
                   <div className="text-3xl font-black text-gray-800">{unnecessaryLoad}%</div>
                   <div className="text-[10px] uppercase font-bold text-gray-400 text-center leading-tight mt-1">Unnecessary Load<br/>Detected</div>
               </div>
               <div className="flex flex-col justify-center items-center">
                   <div className="text-3xl font-black text-pink-500">{result.classification.my_domain}%</div>
                   <div className="text-[10px] uppercase font-bold text-gray-400 text-center leading-tight mt-1">Actionable<br/>Agency</div>
               </div>
          </div>

          <div className="space-y-4 pb-20">
              <div className="bg-white p-6 rounded-3xl border-2 border-pink-100 shadow-md relative overflow-visible">
                  <div className="absolute -top-3 -left-2 rotate-[-6deg] bg-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white">
                      <Sparkles size={10} /> LOGIC CHECK
                  </div>
                  <p className="text-gray-700 leading-relaxed font-bold">{result.one_sentence_reason}</p>
              </div>

              <div className={`${bgAccent} p-6 rounded-3xl border-2 ${borderAccent} shadow-md`}>
                   <div className="flex items-center gap-2 mb-3">
                      <Zap size={20} className={accentColor} />
                      <h3 className={`text-sm font-black uppercase tracking-wider ${accentColor}`}>
                          {isMine ? 'Strategic Action' : 'Release Protocol'}
                      </h3>
                   </div>
                   <p className="text-lg font-bold text-gray-800 leading-snug">{result.recommended_action}</p>
              </div>

              <div className="border-2 border-white p-6 rounded-3xl bg-white/60 backdrop-blur-sm shadow-sm">
                  <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <BowIcon className="w-4 h-3" /> Comfort Reframe
                  </h3>
                  <p className="text-gray-600 italic font-medium text-lg">"{result.optional_reframe}"</p>
              </div>

              <button 
                  onClick={saveAndClose}
                  className="w-full bg-pink-500 text-white h-16 rounded-3xl font-black text-lg flex items-center justify-center gap-2 hover:bg-pink-600 transition-all shadow-xl shadow-pink-200 hover:scale-[1.02] active:scale-95 border-4 border-white"
              >
                  {isReviewMode ? (
                      <>
                          <ArrowRight size={24} /> Back to Archive
                      </>
                  ) : (
                      <>
                          <CheckCircle size={24} /> Log Achievement
                      </>
                  )}
              </button>
          </div>
        </div>
      </div>
    );
  }

  // --- DASHBOARD VIEW ---
  if (view === 'dashboard') {
    const total = history.length;
    const mineCount = history.filter(h => h.dominant_domain === '我的事').length;
    const theirsCount = history.filter(h => h.dominant_domain === '別人的事').length;
    const lifeCount = history.filter(h => h.dominant_domain === '天的事').length;
    
    // Date Logic for Heatmap
    const today = new Date().toLocaleDateString();
    const todaysLogs = history.filter(h => h.timestamp && new Date(h.timestamp).toLocaleDateString() === today); 
    
    const energyReclaimed = total === 0 ? 0 : Math.round(
        history.reduce((acc, curr) => acc + (curr.classification.others_domain + curr.classification.life_domain), 0) / total
    );

    return (
      <div style={bgPattern} className="min-h-screen w-full font-sans">
        <div className="flex flex-col h-full max-w-xl mx-auto p-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-6">
               <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-pink-100">
                   <HelloKittyIcon size={30} />
                   <h2 className="text-xl font-black tracking-tight text-pink-900">My Archive</h2>
               </div>
               <button onClick={() => setView('input')} className="p-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 shadow-lg shadow-pink-200 transition-all border-4 border-white">
                  <Plus size={24} />
               </button>
          </div>

          {/* TODAY'S PULSE HEATMAP */}
          <div className="bg-white p-5 rounded-3xl border-2 border-pink-100 shadow-md mb-6">
               <div className="flex items-center gap-2 mb-3">
                   <Calendar size={14} className="text-pink-400" />
                   <span className="text-xs font-bold text-pink-400 uppercase tracking-wider">Today's Pulse</span>
               </div>
               {todaysLogs.length === 0 ? (
                   <div className="text-center py-4 text-xs text-gray-400 italic">No activity yet today.</div>
               ) : (
                   <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                       {todaysLogs.map((log, idx) => {
                           const colorClass = log.dominant_domain === '我的事' ? 'bg-pink-500' : log.dominant_domain === '別人的事' ? 'bg-amber-400' : 'bg-purple-400';
                           return (
                               <div key={idx} className="flex flex-col items-center gap-1 min-w-[30px]">
                                   <div className={`w-3 h-8 rounded-full ${colorClass} shadow-sm border border-white`} title={log.dominant_domain}></div>
                                   <span className="text-[9px] text-gray-300 font-mono">{log.timestamp ? new Date(log.timestamp).getHours() : 0}:00</span>
                               </div>
                           )
                       })}
                   </div>
               )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-pink-500 text-white p-5 rounded-3xl shadow-xl shadow-pink-200 relative overflow-hidden border-4 border-white">
                  <div className="relative z-10">
                      <div className="text-5xl font-black mb-1">{energyReclaimed}%</div>
                      <div className="text-xs text-pink-100 font-bold uppercase tracking-wider">Load Reduced</div>
                  </div>
                  <BowIcon className="absolute -bottom-2 -right-2 w-24 h-20 text-pink-400 opacity-50 rotate-[-12deg]" />
              </div>
              <div className="bg-white p-5 rounded-3xl flex flex-col justify-center border-2 border-pink-100 shadow-sm">
                   <div className="text-xs text-pink-400 font-bold uppercase tracking-wider mb-2">Clarity Balance</div>
                   <div className="flex h-4 w-full rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                      <div style={{ width: `${(mineCount/total)*100}%` }} className="bg-pink-500 h-full"></div>
                      <div style={{ width: `${(theirsCount/total)*100}%` }} className="bg-amber-400 h-full"></div>
                      <div style={{ width: `${(lifeCount/total)*100}%` }} className="bg-purple-400 h-full"></div>
                   </div>
                   <div className="flex justify-between mt-2 text-[10px] text-gray-400 font-bold">
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-pink-500"></div>Me</span>
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-400"></div>Theirs</span>
                      <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-400"></div>Life</span>
                   </div>
              </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-3 pb-8">
              <h3 className="text-xs font-bold text-pink-400 uppercase tracking-wider mb-2 ml-2">Recent Logs</h3>
              {history.length === 0 ? (
                  <div className="text-center text-pink-300 py-10 font-medium bg-white/50 rounded-3xl border border-pink-100">
                      <BowIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      No logs yet! Start by adding one.
                  </div>
              ) : (
                  history.map((item, idx) => (
                      <div 
                          key={idx} 
                          onClick={() => reopenLog(item)}
                          className="bg-white border-2 border-pink-100 p-5 rounded-3xl shadow-sm hover:shadow-md transition-all hover:scale-[1.01] cursor-pointer group"
                      >
                          <div className="flex justify-between items-start mb-2">
                               <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full ${
                                  item.dominant_domain === '我的事' ? 'bg-pink-100 text-pink-600' : 
                                  item.dominant_domain === '別人的事' ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'
                               }`}>
                                  {item.dominant_domain}
                               </span>
                               <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{item.timestamp ? new Date(item.timestamp).toLocaleDateString() : 'N/A'}</span>
                                  <ArrowRight size={14} className="text-pink-200 group-hover:text-pink-500 transition-colors" />
                               </div>
                          </div>
                          <p className="text-gray-800 text-sm line-clamp-2 mb-3 font-bold">"{item.original_input}"</p>
                          <p className="text-gray-500 text-xs italic border-t border-pink-50 pt-2 mt-1">
                             {item.recommended_action}
                          </p>
                      </div>
                  ))
              )}
          </div>
        </div>
      </div>
    );
  }

  // --- INPUT VIEW (DEFAULT) ---
  return (
    <div style={bgPattern} className="min-h-screen text-gray-900 font-sans selection:bg-pink-200 selection:text-pink-900 overflow-hidden">
      <div className="h-screen w-full flex flex-col max-w-xl mx-auto p-6 justify-center animate-in fade-in duration-500">
        <div className="mb-6 text-center relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-4 w-32 h-32 bg-white rounded-full blur-xl opacity-60"></div>
          <div className="inline-flex items-center justify-center mb-4 filter drop-shadow-xl relative z-10 hover:scale-105 transition-transform duration-300 cursor-pointer">
            <HelloKittyIcon size={100} />
          </div>
          <h1 className="text-4xl font-black tracking-tight text-pink-950 relative z-10 drop-shadow-sm">Whose Problem?</h1>
          <p className="text-pink-500 mt-1 text-sm font-bold uppercase tracking-widest bg-white/60 inline-block px-3 py-1 rounded-full">Untangle</p>
        </div>

        <div className="bg-white p-3 rounded-[2rem] shadow-sm border-2 border-pink-200 focus-within:ring-4 focus-within:ring-pink-100 transition-all duration-300 relative z-10">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Tell me what's bothering you..."
            className="w-full h-32 p-4 resize-none outline-none text-lg text-gray-700 placeholder-pink-200 bg-transparent font-medium"
          />
        </div>

        {/* Rotating Suggested Inputs */}
        <div className="mt-4 grid grid-cols-1 gap-2 relative z-10">
           {currentSuggestions.map((text, i) => (
             <button 
                key={i}
                onClick={() => handleClassify(text)}
                className="text-xs bg-white/80 hover:bg-white text-gray-600 px-4 py-3 rounded-2xl border border-pink-100 hover:border-pink-300 transition-all flex items-center gap-3 text-left shadow-sm group animate-in fade-in slide-in-from-bottom-2 duration-700 hover:shadow-md hover:-translate-y-0.5"
             >
                <div className="w-6 h-6 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 group-hover:bg-pink-200 transition-colors">
                    <Sparkles size={12} className="text-pink-500" />
                </div>
                <span className="truncate w-full font-bold text-gray-500 group-hover:text-pink-500 transition-colors">{text}</span>
             </button>
           ))}
        </div>

        <div className="mt-6 flex gap-4 relative z-10">
          <button
            onClick={() => handleClassify()}
            disabled={!input.trim()}
            className="flex-1 bg-pink-500 text-white h-16 rounded-3xl font-black text-xl flex items-center justify-center gap-2 hover:bg-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-pink-200 hover:shadow-2xl hover:shadow-pink-300 hover:scale-[1.02] active:scale-95 border-4 border-white"
          >
            Classify <ArrowRight size={24} />
          </button>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-2 text-center text-xs text-pink-300 font-bold uppercase tracking-widest relative z-10">
          <div className="flex flex-col items-center gap-2 bg-white/50 p-2 rounded-2xl border border-white">
            <Shield size={20} className="text-pink-400" />
            <span>我的事</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-white/50 p-2 rounded-2xl border border-white">
            <Wind size={20} className="text-pink-400" />
            <span>天的事</span>
          </div>
          <div className="flex flex-col items-center gap-2 bg-white/50 p-2 rounded-2xl border border-white">
            <Activity size={20} className="text-pink-400" />
            <span>別人的事</span>
          </div>
        </div>
        
        {history.length > 0 && (
           <button onClick={() => setView('dashboard')} className="mt-8 mx-auto text-pink-400 hover:text-pink-600 transition-colors text-sm flex items-center gap-2 font-bold bg-white/50 px-4 py-2 rounded-full relative z-10">
              <LayoutDashboard size={16} /> View Archive
           </button>
        )}
        
        {error && <div className="mt-4 text-center text-red-400 text-sm font-medium bg-red-50 py-2 rounded-lg border border-red-100">{error}</div>}
      </div>
    </div>
  );
}