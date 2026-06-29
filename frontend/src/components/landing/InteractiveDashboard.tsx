import { motion, AnimatePresence, LayoutGroup } from 'motion/react';
import { Target, Zap, Clock, Calendar, CheckCircle2, AlertTriangle, BarChart3, Activity, Focus, Smartphone } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '../../lib/utils';

export default function InteractiveDashboard({ section }: { section: number }) {
  const [prob, setProb] = useState(84);
  const [tasks, setTasks] = useState([
    { id: 't1', title: 'College', time: '8:00 AM', status: 'done', type: 'routine' },
    { id: 't2', title: 'Assignment', time: '2:00 PM', status: 'pending', type: 'work' },
    { id: 't3', title: 'Gym', time: '5:00 PM', status: 'pending', type: 'health' },
    { id: 't4', title: 'Interview Preparation', time: '8:00 PM', status: 'pending', type: 'critical' },
  ]);

  useEffect(() => {
    if (section === 1) {
      setProb(84);
      setTasks([
        { id: 't1', title: 'College', time: '8:00 AM', status: 'done', type: 'routine' },
        { id: 't2', title: 'Assignment', time: '2:00 PM', status: 'pending', type: 'work' },
        { id: 't3', title: 'Gym', time: '5:00 PM', status: 'pending', type: 'health' },
        { id: 't4', title: 'Interview Preparation', time: '8:00 PM', status: 'pending', type: 'critical' },
      ]);
    } else if (section === 2) {
      setProb(42);
      const t1 = setTimeout(() => setProb(61), 600);
      const t2 = setTimeout(() => setProb(84), 1200);
      return () => { clearTimeout(t1); clearTimeout(t2); };
    } else if (section === 3) {
      setTasks([
        { id: 't1', title: 'College', time: '8:00 AM', status: 'done', type: 'routine' },
        { id: 't4', title: 'Interview Preparation', time: '1:00 PM', status: 'pending', type: 'critical' },
        { id: 't2', title: 'Assignment', time: '4:00 PM', status: 'pending', type: 'work' },
        { id: 't3', title: 'Gym', time: '7:00 PM', status: 'pending', type: 'health' },
      ]);
    } else if (section === 4) {
      setProb(84);
    } else if (section === 5) {
      setProb(61); // Distraction lowers prob
    } else if (section === 6) {
      setProb(75);
      setTasks([
        { id: 't4', title: 'Interview Preparation', time: 'Now', status: 'active', type: 'critical' },
        { id: 't2', title: 'Assignment', time: 'Tonight', status: 'pending', type: 'work' },
        { id: 't3', title: 'Gym', time: 'Tomorrow', status: 'moved', type: 'health' },
      ]);
    } else if (section >= 7) {
      setProb(100);
    }
  }, [section]);

  const isMission = section === 4 || section === 5;
  const isDistraction = section === 5;
  const isRescue = section === 6;
  const isComplete = section === 7;
  const isAnalytics = section >= 8;

  return (
    <LayoutGroup>
      <div className={cn(
         "w-full h-full text-white flex relative overflow-hidden font-sans transition-colors duration-700",
         isRescue ? "bg-[#1a0f00]" : isComplete ? "bg-[#001a0a]" : "bg-[#0a0a0a]"
      )}>
        {/* Sidebar */}
        <motion.div 
          layout
          initial={false}
          animate={{ 
            width: isMission || isComplete ? 0 : 220, 
            opacity: isMission || isComplete ? 0 : 1 
          }}
          className="border-r border-white/5 bg-[#0f0f0f] flex-shrink-0 flex flex-col p-4 overflow-hidden"
        >
          <div className="flex items-center gap-2 mb-8 px-2 whitespace-nowrap">
            <div className="w-6 h-6 rounded bg-white flex items-center justify-center flex-shrink-0">
              <Zap className="w-3 h-3 text-black" />
            </div>
            <span className="font-semibold text-sm">Deadline Zero</span>
          </div>
          <div className="space-y-1 w-full whitespace-nowrap">
            {[
              { icon: Calendar, label: "Dashboard", active: section < 8 },
              { icon: Target, label: "Mission Mode", active: section >= 4 && section <= 7 },
              { icon: BarChart3, label: "Analytics", active: section >= 8 },
            ].map((nav, i) => (
              <div key={i} className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                nav.active ? "bg-white/10 text-white" : "text-white/50"
              )}>
                <nav.icon className="w-4 h-4 flex-shrink-0" />
                {nav.label}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Main Area */}
        <motion.div layout className="flex-1 p-6 relative flex flex-col gap-4 overflow-hidden">
          
          {/* Top Row Widgets */}
          <motion.div layout className={cn("flex gap-4 transition-all duration-700", isMission || isComplete ? "h-0 opacity-0 overflow-hidden" : "h-32 opacity-100")}>
            {/* Prob Widget */}
            <motion.div layout className="w-1/3 border border-white/5 bg-white/[0.02] rounded-2xl p-4 flex flex-col justify-center">
               <div className="text-xs text-white/50 mb-2 flex items-center gap-2">
                 <Target className={cn("w-4 h-4", isRescue ? "text-amber-500" : "text-green-400")} /> Success Prob
               </div>
               <div className="text-3xl font-bold flex items-end gap-2">
                 <motion.span layout>{prob}%</motion.span>
                 {section === 5 && <span className="text-sm text-red-400 mb-1 font-medium">-23%</span>}
               </div>
               <div className="w-full h-1 bg-white/10 mt-3 rounded-full overflow-hidden">
                 <motion.div 
                   animate={{ width: `${prob}%` }} 
                   transition={{ type: 'spring', damping: 20 }}
                   className={cn("h-full", isRescue ? "bg-amber-500" : isDistraction ? "bg-red-500" : "bg-green-400")} 
                 />
               </div>
            </motion.div>

            {/* AI / Analytics Widget */}
            <motion.div layout className="w-2/3 border border-white/5 bg-white/[0.02] rounded-2xl p-4 relative overflow-hidden flex flex-col justify-center">
               {isAnalytics ? (
                 <div className="flex justify-between items-center h-full">
                    <div>
                      <div className="text-xs text-white/50 mb-1">Focus Score</div>
                      <div className="text-3xl font-bold">92<span className="text-lg text-white/30">/100</span></div>
                    </div>
                    <div>
                      <div className="text-xs text-white/50 mb-1">Reliability</div>
                      <div className="text-3xl font-bold">Top 5%</div>
                    </div>
                 </div>
               ) : (
                 <>
                   <div className="text-xs text-white/50 mb-2 flex items-center gap-2">
                     <Activity className="w-4 h-4" /> AI Analysis
                   </div>
                   <div className="flex items-end gap-2 h-10">
                     {[40, 25, 60, 45, 80, 50, 75, 60, 90, 85].map((h, i) => (
                       <motion.div 
                         key={i} 
                         animate={{ height: section === 2 ? `${Math.random() * 100}%` : `${h}%` }}
                         transition={{ duration: 0.5, repeat: section === 2 ? Infinity : 0, repeatType: 'reverse' }}
                         className={cn("flex-1 rounded-t-sm opacity-50", section === 2 ? "bg-white" : "bg-white/30")} 
                       />
                     ))}
                   </div>
                 </>
               )}
            </motion.div>
          </motion.div>

          {/* Bottom Row / Main Content */}
          <motion.div layout className="flex-1 border border-white/5 bg-white/[0.02] rounded-2xl p-5 relative overflow-hidden flex flex-col">
             
             <AnimatePresence mode="popLayout">
               {isMission && (
                 <motion.div 
                   key="mission"
                   initial={{ opacity: 0, scale: 0.95 }}
                   animate={{ opacity: 1, scale: 1 }}
                   exit={{ opacity: 0, scale: 0.95 }}
                   transition={{ duration: 0.5 }}
                   className="absolute inset-0 flex flex-col items-center justify-center p-8"
                 >
                   <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs mb-6 text-white/70">
                      <Focus className="w-3 h-3" /> Mission Active
                   </div>
                   <div className="text-7xl font-light tracking-tighter mb-2 tabular-nums">01:44:59</div>
                   <div className="text-lg font-medium text-white/80 mb-8">Interview Preparation</div>
                   
                   <div className="w-full max-w-sm space-y-2">
                     <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                       <CheckCircle2 className="w-4 h-4 text-green-400" /> <span className="text-sm text-white/70">Review Data Structures</span>
                     </div>
                     <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                       <div className="w-4 h-4 rounded-full border-2 border-white/20" /> <span className="text-sm text-white/70">Practice System Design</span>
                     </div>
                   </div>
                 </motion.div>
               )}

               {isAnalytics && (
                 <motion.div 
                   key="analytics"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                   className="absolute inset-0 p-6 flex flex-col"
                 >
                   <div className="text-sm text-white/50 mb-6 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-white" /> AI Recommendation
                   </div>
                   <div className="text-2xl font-light leading-relaxed text-white/90">
                      You perform best with <span className="text-white font-semibold underline decoration-white/30 underline-offset-4">30-minute focus sessions</span>. We have automatically adjusted your defaults to match this rhythm.
                   </div>
                   <div className="mt-auto grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <div className="text-xs text-white/50 mb-1">Most Common Distraction</div>
                        <div className="text-lg font-medium">Social Media (Instagram)</div>
                      </div>
                      <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                        <div className="text-xs text-white/50 mb-1">Weekly Success Rate</div>
                        <div className="text-lg font-medium text-green-400">+14% vs last week</div>
                      </div>
                   </div>
                 </motion.div>
               )}

               {!isMission && !isAnalytics && !isComplete && (
                 <motion.div 
                   key="schedule"
                   initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                   className="flex flex-col h-full"
                 >
                   <h3 className="text-sm text-white/50 mb-4 flex items-center gap-2">
                     <Clock className="w-4 h-4" /> Schedule
                   </h3>
                   <div className="space-y-2 relative flex-1">
                      {tasks.map((item) => (
                         <motion.div
                           layoutId={`task-${item.id}`}
                           key={item.id}
                           transition={{ type: "spring", stiffness: 60, damping: 15 }}
                           className={cn(
                             "flex items-center justify-between p-3 rounded-xl border",
                             item.type === 'critical' ? "border-white/20 bg-white/5" : "border-white/5 bg-white/[0.01]",
                             item.status === 'active' ? "border-amber-500/30 bg-amber-500/10" : ""
                           )}
                         >
                           <div className="flex items-center gap-3">
                             <div className={cn("w-3 h-3 rounded-full border-2", 
                               item.status === 'done' ? "border-green-400 bg-green-400/20" : 
                               item.status === 'active' ? "border-amber-500 bg-amber-500/20" : "border-white/20"
                             )} />
                             <span className={item.status === 'done' || item.status === 'moved' ? "line-through text-white/30" : "text-sm font-medium"}>
                               {item.title}
                             </span>
                           </div>
                           <span className={cn("text-xs font-medium", 
                              item.status === 'active' ? "text-amber-500" : "text-white/50"
                           )}>{item.time}</span>
                         </motion.div>
                      ))}
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </motion.div>
          
          {/* Overlays */}
          <AnimatePresence>
             {isDistraction && (
               <motion.div 
                 initial={{ x: 300, opacity: 0 }}
                 animate={{ x: 0, opacity: 1 }}
                 exit={{ x: 300, opacity: 0, transition: { duration: 0.2 } }}
                 transition={{ type: "spring", stiffness: 80, damping: 20 }}
                 className="absolute top-1/2 right-6 -translate-y-1/2 w-64 bg-[#121212] border border-white/10 p-5 rounded-2xl shadow-2xl z-20"
               >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-500 flex items-center justify-center">
                      <Smartphone className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-white">Instagram</h4>
                      <p className="text-xs text-white/50">Interception</p>
                    </div>
                  </div>
                  <p className="text-xs text-white/70 mb-4">Using Instagram now reduces completion probability by 23%.</p>
                  <div className="flex flex-col gap-2">
                    <div className="py-2 rounded-lg bg-white text-black text-xs font-medium text-center cursor-pointer">Stay Focused</div>
                    <div className="py-2 rounded-lg bg-white/5 text-white/50 text-xs font-medium text-center border border-white/10 cursor-pointer">Ignore</div>
                  </div>
               </motion.div>
             )}
             
             {isRescue && (
               <motion.div 
                 initial={{ y: -50, opacity: 0 }}
                 animate={{ y: 0, opacity: 1 }}
                 exit={{ y: -50, opacity: 0 }}
                 className="absolute top-6 left-1/2 -translate-x-1/2 bg-amber-500/10 border border-amber-500/20 text-amber-500 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 z-20 backdrop-blur-md"
               >
                 <AlertTriangle className="w-4 h-4" /> Rescue Mode Activated
               </motion.div>
             )}
             
             {isComplete && (
               <motion.div 
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 exit={{ opacity: 0 }}
                 className="absolute inset-0 z-30 flex items-center justify-center p-6 bg-[#001a0a]/50"
               >
                 <div className="bg-[#0a0a0a] border border-green-500/30 rounded-3xl p-8 flex flex-col items-center text-center w-full max-w-sm shadow-2xl shadow-green-500/10 relative overflow-hidden">
                   <motion.div 
                     initial={{ scale: 0 }}
                     animate={{ scale: [0, 1.2, 1] }}
                     transition={{ duration: 0.5 }}
                     className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 relative z-10"
                   >
                     <Target className="w-8 h-8 text-green-400" />
                   </motion.div>
                   <h2 className="text-2xl font-bold mb-1 relative z-10">Mission Complete</h2>
                   <div className="text-green-400 font-medium mb-6 text-sm relative z-10">+120 XP</div>
                   <div className="w-full grid grid-cols-2 gap-3 relative z-10">
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                         <div className="text-2xl font-bold mb-0.5">17</div>
                         <div className="text-[10px] text-white/50 uppercase">Day Streak</div>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                         <div className="text-2xl font-bold mb-0.5">14</div>
                         <div className="text-[10px] text-white/50 uppercase">Saved</div>
                      </div>
                   </div>
                 </div>
               </motion.div>
             )}
          </AnimatePresence>

        </motion.div>
      </div>
    </LayoutGroup>
  );
}
