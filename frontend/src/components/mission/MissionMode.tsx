import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, Circle, Ticket, Shield, Zap, Clock, X, ChevronRight, Play, Trophy, Pause, AlertTriangle, Coffee, Plus, Trash2, Bot, FileText, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { Task } from '../../context/TaskContext';

interface MissionModeProps {
  task: Task;
  onClose: () => void;
  onFinish: (stats: any) => void;
  onInterrupt: (stats: any) => void;
}

export default function MissionMode({ task, onClose, onFinish, onInterrupt }: MissionModeProps) {
  const durationMatch = task.duration.match(/(\d+)/);
  const initialMinutes = durationMatch ? parseInt(durationMatch[1]) : 45;
  const initialSeconds = initialMinutes * 60;

  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(true);
  const [isRecharging, setIsRecharging] = useState(false);
  const [showRechargeDialog, setShowRechargeDialog] = useState(false);
  const [rechargeDurationOption, setRechargeDurationOption] = useState<number>(5);
  const [rechargeReasonOption, setRechargeReasonOption] = useState<string>('Water');
  const [rechargeTimeLeft, setRechargeTimeLeft] = useState(0);
  
  const [integrity, setIntegrity] = useState(100);
  const [tokens, setTokens] = useState(2);
  const [focusTime, setFocusTime] = useState(0); // in seconds
  
  const [showInterruption, setShowInterruption] = useState(false);
  const [interruptionStep, setInterruptionStep] = useState<'ask-resources' | 'distracted'>('ask-resources');
  const [pendingPenalty, setPendingPenalty] = useState(0);
  const [timeAway, setTimeAway] = useState(0);
  const [oldIntegrity, setOldIntegrity] = useState(100);
  
  const [isBriefing, setIsBriefing] = useState(true);
  const [notes, setNotes] = useState('');
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [timeline, setTimeline] = useState<{time: Date, event: string}[]>([]);
  
  const [showCelebration, setShowCelebration] = useState(false);
  
  const defaultResources = (() => {
    if (task.category === 'Coding') return ['VS Code', 'ChatGPT', 'GitHub', 'Stack Overflow', 'MDN'];
    if (task.category === 'Study') return ['YouTube', 'PDF Notes', 'ChatGPT', 'Google'];
    if (task.category === 'Writing') return ['Google Docs', 'Grammarly', 'ChatGPT'];
    return ['ChatGPT', 'Google'];
  })();

  const [availableResources, setAvailableResources] = useState<string[]>(defaultResources);
  const [selectedResources, setSelectedResources] = useState<string[]>(defaultResources);
  const [customResource, setCustomResource] = useState('');
  const [rememberResources, setRememberResources] = useState(true);

  const [showCoach, setShowCoach] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);

  const addTimelineEvent = (event: string) => {
    setTimeline(prev => [...prev, { time: new Date(), event }]);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (!isBriefing && isActive && !isRecharging && !showInterruption && !showCelebration) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 0) return 0;
          return prev - 1;
        });
        setFocusTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isRecharging, showInterruption, showCelebration, isBriefing]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecharging) {
      interval = setInterval(() => {
        setRechargeTimeLeft((prev) => {
          const next = prev - 1;
          if (next < 0 && Math.abs(next) % 60 === 0) {
             setIntegrity(i => Math.max(0, i - 1));
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecharging]);

  const leaveTimeRef = useRef<number | null>(null);

  useEffect(() => {
    const handleLeave = () => {
      if (!isBriefing && isActive && !isRecharging && !showInterruption && !showCelebration && !leaveTimeRef.current) {
        leaveTimeRef.current = Date.now();
      }
    };

    const handleReturn = () => {
      if (!isBriefing && leaveTimeRef.current && isActive && !isRecharging && !showInterruption && !showCelebration) {
        const awayMs = Date.now() - leaveTimeRef.current;
        setTimeAway(awayMs);
        leaveTimeRef.current = null;
        
        if (awayMs > 120000) { // > 2 mins
          addTimelineEvent('Mission Interrupted');
          setOldIntegrity(integrity);
          
          let penalty = 0;
          if (awayMs < 300000) { // 2 - 5 min
            penalty = 4;
          } else if (awayMs < 600000) { // 5 - 10 min
            penalty = 12;
          } else { // > 10 min
            penalty = 25;
          }
          
          setPendingPenalty(penalty);
          setInterruptionStep('ask-resources');
          setShowInterruption(true);
        }
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        handleLeave();
      } else {
        handleReturn();
      }
    };

    window.addEventListener('blur', handleLeave);
    window.addEventListener('focus', handleReturn);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('blur', handleLeave);
      window.removeEventListener('focus', handleReturn);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isActive, isRecharging, showInterruption, showCelebration, integrity, isBriefing]);

  const toggleChecklist = (id: number) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatTimeAway = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    if (m > 0) return `${m} minute${m !== 1 ? 's' : ''} ${s} second${s !== 1 ? 's' : ''}`;
    return `${s} second${s !== 1 ? 's' : ''}`;
  };

  const handleUseToken = () => {
    if (tokens > 0) {
      setTokens(prev => prev - 1);
      setShowInterruption(false);
      setIsRecharging(false);
      addTimelineEvent('Mission Resumed');
    }
  };

  const handleResume = () => {
    if (isRecharging) addTimelineEvent('Recharge Ended');
    else addTimelineEvent('Mission Resumed');
    
    setShowInterruption(false);
    setIsRecharging(false);
    setTimeAway(0);
  };

  const handleLeave = () => {
    setShowInterruption(false);
    setIsActive(false);
    onInterrupt({ integrity, focusTime });
  };

  const handleFinish = () => {
    setIsActive(false);
    setShowCelebration(true);
  };

  const completeMission = () => {
    addTimelineEvent('Mission Completed');
    onFinish({ integrity, focusTime });
  };

  const progressPercent = ((initialSeconds - timeLeft) / initialSeconds) * 100;

  const handleBeginMission = () => {
    setIsBriefing(false);
    addTimelineEvent('Mission Started');
  };

  const toggleResource = (res: string) => {
    setSelectedResources(prev => 
      prev.includes(res) ? prev.filter(r => r !== res) : [...prev, res]
    );
  };

  const addCustomResource = () => {
    if (customResource.trim()) {
      const res = customResource.trim();
      if (!availableResources.includes(res)) setAvailableResources(prev => [...prev, res]);
      if (!selectedResources.includes(res)) setSelectedResources(prev => [...prev, res]);
      setCustomResource('');
    }
  };

  const getCoachMessage = () => {
    if (progressPercent === 100) return "Excellent work. Mission accomplished.";
    if (progressPercent >= 80) return "Almost finished. Finish strong.";
    if (progressPercent >= 50) return "You're halfway there.";
    if (focusTime >= 20 * 60) return "Great momentum. Keep going.";
    return "Let's get started. One task at a time.";
  };

  const coachMessage = getCoachMessage();

  useEffect(() => {
    if (!isBriefing) {
      setShowCoach(true);
      const timer = setTimeout(() => setShowCoach(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [coachMessage, isBriefing]);

  useEffect(() => {
    if (!isBriefing && timeline.length > 0) {
      setShowTimeline(true);
      const timer = setTimeout(() => setShowTimeline(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [timeline, isBriefing]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-50 bg-[#050505] flex flex-col font-sans overflow-hidden"
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] mix-blend-screen transition-opacity duration-1000" style={{ opacity: 0.3 + (progressPercent / 100) * 0.7 }} />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[100px] mix-blend-screen transition-opacity duration-1000" style={{ opacity: 0.3 + (progressPercent / 100) * 0.7 }} />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] opacity-30" />
      </div>

      {isBriefing ? (
        <div className="relative z-10 flex-1 flex items-center justify-center p-6 overflow-y-auto">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors z-50">
            <X className="w-6 h-6" />
          </button>
          <div className="w-full max-w-2xl bg-white/[0.02] border border-white/5 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl relative">
            <div className="flex flex-col items-center text-center space-y-6 mb-12">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <div>
                <span className="text-xs font-medium text-white/50 uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">{task.category}</span>
                <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mt-4">{task.title}</h1>
              </div>
              <div className="flex items-center gap-6 text-sm font-medium">
                <span className="flex items-center gap-2 text-amber-400">
                  <Zap className="w-4 h-4" /> {task.priority === 'critical' ? 'High Priority' : 'Medium Priority'}
                </span>
                <span className="text-white/30">•</span>
                <span className="flex items-center gap-2 text-white/70">
                  <Clock className="w-4 h-4" /> {task.duration}
                </span>
              </div>
              <div className="mt-6 p-4 rounded-xl bg-white/5 border border-white/10 max-w-lg w-full text-left">
                <p className="text-xs font-medium text-white/50 uppercase tracking-wider mb-2">Mission Goal</p>
                <p className="text-sm text-white/80">{task.notes || `Complete the selected task: ${task.title}`}</p>
              </div>
              <p className="text-white/60 font-medium text-lg italic mt-4 max-w-md">"Prepare your workspace before beginning."</p>
            </div>

            <div className="space-y-6 mb-12">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-white">Mission Resources</h3>
              </div>
              <p className="text-sm text-white/60">Select the resources you expect to use during this mission.</p>
              
              <div className="flex flex-wrap gap-2">
                {availableResources.map(res => {
                  const isSelected = selectedResources.includes(res);
                  return (
                    <button 
                      key={res}
                      onClick={() => toggleResource(res)}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border",
                        isSelected 
                          ? "bg-primary/20 border-primary/50 text-primary" 
                          : "bg-white/5 border-white/10 text-white/50 hover:text-white/80"
                      )}
                    >
                      {isSelected ? <CheckCircle2 className="w-4 h-4" /> : <Circle className="w-4 h-4" />} {res}
                    </button>
                  );
                })}
              </div>
              
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={customResource}
                  onChange={(e) => setCustomResource(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addCustomResource()}
                  placeholder="Add custom resource..."
                  className="flex-1 h-10 rounded-xl bg-white/5 border border-white/10 px-4 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-primary/50 transition-colors"
                />
                <Button onClick={addCustomResource} className="h-10 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white shrink-0">
                  Add
                </Button>
              </div>

              <label className="flex items-center gap-3 cursor-pointer mt-4" onClick={(e) => { e.preventDefault(); setRememberResources(!rememberResources); }}>
                <div className={cn("w-5 h-5 rounded border flex items-center justify-center transition-colors", rememberResources ? "bg-primary border-primary text-primary-foreground" : "border-white/30")}>
                  {rememberResources && <CheckCircle2 className="w-3.5 h-3.5" />}
                </div>
                <span className="text-sm text-white/70">Remember these resources for future similar missions.</span>
              </label>
            </div>

            <Button 
              onClick={handleBeginMission}
              className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 hover:scale-[1.02] transition-all"
            >
              🚀 Begin Mission
            </Button>
          </div>
        </div>
      ) : (
      <div className="relative z-10 flex-1 flex flex-col max-w-7xl w-full mx-auto p-6 md:p-12">
        {/* Header */}
        <header className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-white/50 uppercase tracking-widest mb-1">Current Mission</h2>
              <h1 className="text-2xl font-semibold tracking-tight text-white">{task.title}</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Integrity</span>
                <span className="text-sm font-semibold text-white">{integrity}%</span>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-amber-400" />
              <div className="flex flex-col">
                <span className="text-[10px] font-medium text-white/50 uppercase tracking-wider">Focus Passes</span>
                <div className="flex gap-1 mt-0.5">
                  {[1, 2].map(t => (
                    <div key={t} className={cn("w-2 h-2 rounded-full", t <= tokens ? "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" : "bg-white/10")} />
                  ))}
                </div>
              </div>
            </div>
            <div className="w-px h-8 bg-white/10 ml-2" />
            <Button onClick={() => setShowRechargeDialog(true)} variant="outline" className="h-10 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium ml-2 px-4 transition-colors">
              <Coffee className="w-4 h-4 mr-2 text-amber-400" /> Recharge
            </Button>
            <Button onClick={handleLeave} variant="ghost" className="rounded-full w-10 h-10 p-0 text-white/50 hover:text-white hover:bg-white/10 ml-2">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-16 items-center">
          
          {/* Left Column - Timer */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
            
            {/* Progress Ring */}
            <div className="relative w-72 h-72 md:w-96 md:h-96 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90 transform pointer-events-none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
                <motion.circle 
                  cx="50" cy="50" r="48" fill="none" 
                  stroke="currentColor" strokeWidth="1.5" 
                  className="text-primary drop-shadow-[0_0_12px_rgba(var(--primary),0.5)]"
                  strokeDasharray="301.59"
                  strokeDashoffset={301.59 - (progressPercent / 100) * 301.59}
                  transition={{ duration: 1, ease: "linear" }}
                  strokeLinecap="round"
                />
              </svg>
              
              <div className="flex flex-col items-center text-center relative z-10">
                <AnimatePresence mode="wait">
                  {isRecharging ? (
                    <motion.div key="recharging" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col items-center">
                      <Coffee className="w-12 h-12 text-amber-400/50 mb-4" />
                      <span className="text-2xl font-medium text-white/50 mb-4">Recharge in Progress</span>
                      <span className={cn("text-5xl font-light tabular-nums drop-shadow-2xl mb-6", rechargeTimeLeft < 0 ? "text-red-400" : "text-white")}>
                        {rechargeTimeLeft < 0 ? '-' : ''}{formatTime(Math.abs(rechargeTimeLeft))}
                      </span>
                      <Button onClick={handleResume} className="rounded-full bg-white text-black hover:bg-white/90 font-medium px-8 h-12">
                        <Play className="w-4 h-4 mr-2" /> Resume Early
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div key="timer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center">
                      <span className="text-7xl md:text-8xl font-light tracking-tighter text-white tabular-nums drop-shadow-2xl">
                        {formatTime(timeLeft)}
                      </span>
                      <span className="text-sm font-medium text-white/50 uppercase tracking-widest mt-4 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> Remaining Time
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            
            <div className="mt-12 w-full max-w-md space-y-2">
               <div className="flex justify-between text-xs font-medium text-white/40 uppercase tracking-wider">
                 <span>Mission Progress</span>
                 <span>{Math.round(progressPercent)}%</span>
               </div>
               <Progress value={progressPercent} className="h-1.5 bg-white/5" />
            </div>

          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Focus Streak</p>
                <p className="text-2xl font-semibold text-white">{Math.floor(focusTime / 60)} <span className="text-sm font-normal text-white/50">min</span></p>
              </div>
              <div className="p-5 rounded-2xl border border-white/5 bg-white/[0.02]">
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">Est. Finish</p>
                <p className="text-2xl font-semibold text-white">
                  {new Date(Date.now() + timeLeft * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {/* Mission Resources Panel */}
            {selectedResources.length > 0 && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-white/80">Active Resources</p>
                <div className="flex flex-wrap gap-2">
                  {selectedResources.map(res => (
                    <span key={res} className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/5 border border-white/10 text-white/70">
                      {res}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Notes Panel */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all">
              <button 
                onClick={() => setIsNotesOpen(!isNotesOpen)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
              >
                <span className="text-sm font-medium text-white/70 flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Quick Notes
                </span>
                <ChevronRight className={cn("w-4 h-4 text-white/40 transition-transform", isNotesOpen && "rotate-90")} />
              </button>
              <AnimatePresence>
                {isNotesOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-4 pt-0 border-t border-white/5 mt-2">
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Type any quick thoughts here..."
                        className="w-full h-32 bg-transparent border-none resize-none text-sm text-white/80 placeholder:text-white/30 focus:ring-0 focus:outline-none"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button 
              onClick={handleFinish}
              className="w-full h-14 rounded-2xl bg-white text-black font-medium text-lg hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              Finish Mission
            </Button>
            
          </div>
        </div>
      </div>
      )}

      {/* Floating AI Coach & Timeline */}
      {!isBriefing && (
        <div className="fixed bottom-8 left-8 flex flex-col gap-4 z-40 pointer-events-none">
          <AnimatePresence>
            {showCoach && (
              <motion.div 
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className="w-80 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md shadow-2xl pointer-events-auto"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                     <Bot className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider mb-0.5">AI Coach</p>
                    <p className="text-sm text-white/90 font-medium leading-tight">{coachMessage}</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence>
            {showTimeline && timeline.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: -20, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className="w-80 bg-white/5 border border-white/10 p-4 rounded-2xl backdrop-blur-md shadow-2xl max-h-48 overflow-y-auto pointer-events-auto"
              >
                <p className="text-[10px] text-white/50 font-medium uppercase tracking-wider mb-3 sticky top-0 bg-[#0a0a0a]/80 backdrop-blur pb-2">Mission Timeline</p>
                <div className="space-y-3">
                  {timeline.slice().reverse().map((event, i) => (
                    <div key={i} className="flex gap-3 text-sm">
                      <span className="text-white/40 font-mono shrink-0">{event.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      <span className="text-white/80">{event.event}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Recharge Dialog */}
      <AnimatePresence>
        {showRechargeDialog && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50" />
              
              <div className="flex flex-col items-center text-center space-y-2 mb-8">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center mb-4">
                  <Coffee className="w-8 h-8 text-amber-500" />
                </div>
                <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">Need a Recharge?</h2>
                <p className="text-white/60 font-light">
                  You have <span className="text-white font-medium">{tokens} Focus Pass{tokens !== 1 ? 'es' : ''}</span> remaining.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-white/80 mb-3">Choose Recharge Duration</p>
                  <div className="grid grid-cols-3 gap-3">
                    {[5, 10, 15].map(min => (
                      <button 
                        key={min}
                        onClick={() => setRechargeDurationOption(min)}
                        className={cn("h-12 rounded-xl text-sm font-medium transition-all border", rechargeDurationOption === min ? "bg-primary/20 border-primary text-primary" : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10")}
                      >
                        {min} Minutes
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-white/80 mb-3">Reason (optional)</p>
                  <div className="flex flex-wrap gap-2">
                    {['Water', 'Washroom', 'Stretch', 'Phone Call', 'Refresh', 'Custom'].map(r => (
                      <button 
                        key={r}
                        onClick={() => setRechargeReasonOption(r)}
                        className={cn("px-4 py-2 rounded-full text-xs font-medium transition-all border", rechargeReasonOption === r ? "bg-amber-500/20 border-amber-500/50 text-amber-400" : "bg-white/5 border-white/10 text-white/60 hover:bg-white/10")}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button onClick={() => setShowRechargeDialog(false)} variant="ghost" className="flex-1 h-12 rounded-xl hover:bg-white/10 text-white/70 font-medium">
                    Cancel
                  </Button>
                  <Button 
                    onClick={() => {
                      if (tokens > 0) {
                        setTokens(t => t - 1);
                        setRechargeTimeLeft(rechargeDurationOption * 60);
                        setIsRecharging(true);
                        setShowRechargeDialog(false);
                        addTimelineEvent('Recharge Started');
                      }
                    }} 
                    disabled={tokens === 0}
                    className="flex-1 h-12 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-medium transition-colors disabled:opacity-50"
                  >
                    Start Recharge
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interruption Modal */}
      <AnimatePresence>
        {showInterruption && (
          <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-amber-500/50" />
              
              <div className="flex flex-col items-center text-center space-y-4 mb-8">
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-2", interruptionStep === 'ask-resources' ? "bg-blue-500/10" : "bg-amber-500/10")}>
                  {interruptionStep === 'ask-resources' ? (
                    <span className="text-3xl">👋</span>
                  ) : (
                    <AlertTriangle className="w-8 h-8 text-amber-500" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-white mb-2">
                    {interruptionStep === 'ask-resources' ? 'Welcome Back' : 'Mission Interrupted'}
                  </h2>
                  <p className="text-white/60 font-light">You were away for <span className="text-white font-medium">{formatTimeAway(timeAway)}</span>.</p>
                </div>
              </div>

              {interruptionStep === 'distracted' ? (
                <div className="space-y-3">
                  <Button 
                    onClick={handleUseToken}
                    disabled={tokens === 0}
                    variant="outline"
                    className="w-full h-12 rounded-xl border-blue-500/30 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-medium transition-colors"
                  >
                    <Ticket className="w-4 h-4 mr-2" /> Use Focus Pass {tokens > 0 ? `(${tokens} left)` : '(0 left)'}
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button onClick={() => { setIntegrity(Math.max(0, oldIntegrity - pendingPenalty)); handleLeave(); }} variant="outline" className="flex-1 h-12 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium">
                      Leave Mission
                    </Button>
                    <Button onClick={() => { setIntegrity(Math.max(0, oldIntegrity - pendingPenalty)); handleResume(); }} className="flex-1 h-12 rounded-xl bg-white text-black hover:bg-white/90 font-medium">
                      <Play className="w-4 h-4 mr-2" /> Resume Mission
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  <p className="text-sm font-medium text-white/80 text-center">Were you using one of your selected Mission Resources?</p>
                  <div className="flex flex-col gap-2">
                    <Button onClick={() => { handleResume(); }} className="h-12 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium border border-white/10">
                      Yes, I was still working
                    </Button>
                    <Button onClick={() => setInterruptionStep('distracted')} className="h-12 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white font-medium border border-transparent">
                      No, I got distracted
                    </Button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Celebration Screen */}
      <AnimatePresence>
        {showCelebration && (
          <div className="absolute inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-[#050505]" />
            
            <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
              <motion.div 
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 2, 2.5], opacity: [1, 0.8, 0] }}
                transition={{ duration: 2, ease: "easeOut" }}
                className="w-96 h-96 bg-primary/20 rounded-full blur-[100px]"
              />
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="relative z-10 w-full max-w-md flex flex-col items-center text-center"
            >
              <div className="w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/50 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(var(--primary),0.3)]">
                <Trophy className="w-12 h-12 text-primary" />
              </div>
              
              <h2 className="text-4xl font-semibold tracking-tight text-white mb-2">Mission Complete 🎉</h2>
              <div className="mb-12">
                <p className="text-xl text-white font-medium mb-1">{task.title}</p>
                <p className="text-sm font-medium text-emerald-400 uppercase tracking-widest">Completed</p>
              </div>
              
              <div className="w-full space-y-4 mb-12">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wider">Focus Integrity</span>
                  <span className="text-2xl font-semibold text-emerald-400">{integrity}%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wider">Success Prob.</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white/40 line-through text-sm">81%</span>
                    <span className="text-2xl font-semibold text-primary">90%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wider">Focus Streak</span>
                  <span className="text-xl font-semibold text-white">{Math.floor(focusTime / 60)} min</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-sm font-medium text-white/60 uppercase tracking-wider">Current Streak</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-white/40 line-through text-sm">12</span>
                    <span className="text-xl font-semibold text-white">13</span>
                  </div>
                </div>
              </div>

              <Button onClick={completeMission} className="w-full h-14 rounded-2xl bg-white text-black font-medium text-lg hover:bg-white/90 hover:scale-[1.02] transition-all">
                Return to Dashboard
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </motion.div>
  );
}
