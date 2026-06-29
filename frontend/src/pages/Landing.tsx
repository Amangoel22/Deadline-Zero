import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Zap } from 'lucide-react';
import InteractiveDashboard from '../components/landing/InteractiveDashboard';
import { cn } from '../lib/utils';

const SECTIONS = [
  { id: 1, title: "Never Miss\nWhat Matters.", desc: "Your AI predicts missed deadlines, creates an optimized plan, keeps you focused, and learns how you work." },
  { id: 2, title: "Predict Before\nYou Miss.", desc: "AI analyzes your calendar, routine, deadlines, and available time to calculate completion probability." },
  { id: 3, title: "Every Day Starts\nWith A Plan.", desc: "Intelligent scheduling automatically organizes your tasks based on priority and energy levels." },
  { id: 4, title: "Mission Mode.", desc: "A distraction-free environment for your most critical work. Blocks out the noise so you can execute." },
  { id: 5, title: "Distraction\nInterception.", desc: "Deadline Zero detects when you're drifting off task and gently guides you back to your mission." },
  { id: 6, title: "You're Running\nOut Of Time.", desc: "When deadlines are at risk, Rescue Mode automatically reorganizes your week to save your critical tasks." },
  { id: 7, title: "Mission\nComplete.", desc: "Build momentum. Every completed mission adds to your streak and improves your AI's understanding of your work." },
  { id: 8, title: "Tomorrow\nIs Smarter.", desc: "Deep analytics on your focus, reliability, and distractions. Understand how you work best." },
];

export default function Landing() {
  const [activeSection, setActiveSection] = useState(1);
  
  return (
    <div className="bg-[#050505] text-white min-h-screen font-sans selection:bg-white/20">
       <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 mix-blend-difference pointer-events-none">
         <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
             <Zap className="w-4 h-4 text-black" />
           </div>
           <span className="text-xl font-medium tracking-tight">Deadline Zero</span>
         </div>
         <div className="flex items-center gap-4 pointer-events-auto">
           <Link to="/login" className="text-sm font-medium hover:opacity-70 transition-opacity">Log in</Link>
           <Button asChild className="rounded-full h-9 px-4 text-xs font-medium bg-white text-black hover:bg-white/90">
             <Link to="/signup">Get Started</Link>
           </Button>
         </div>
       </nav>

       <div className="max-w-[1400px] mx-auto px-6 md:px-12 flex flex-col md:flex-row relative">
          
          {/* Text Content (Left) */}
          <div className="w-full md:w-5/12 pt-[25vh] pb-[25vh] relative z-10">
             {SECTIONS.map((section) => (
                <motion.div 
                   key={section.id} 
                   onViewportEnter={() => setActiveSection(section.id)}
                   viewport={{ margin: "-40% 0px -40% 0px" }}
                   className="min-h-[75vh] flex flex-col justify-center"
                >
                   <div className={cn(
                      "transition-all duration-700 max-w-md",
                      activeSection === section.id ? "opacity-100 translate-y-0" : "opacity-20 translate-y-4"
                   )}>
                      <h2 className={cn(
                        "font-semibold tracking-tighter mb-6 text-balance leading-[1.05]",
                        section.id === 1 ? "text-5xl md:text-7xl" : "text-4xl md:text-5xl"
                      )}>
                        {section.title.split('\n').map((line, i) => <span key={i} className="block">{line}</span>)}
                      </h2>
                      <p className="text-lg text-white/60 font-light leading-relaxed mb-8">
                        {section.desc}
                      </p>
                      {section.id === 1 && (
                        <div className="flex items-center gap-4 pointer-events-auto">
                          <Button asChild size="lg" className="rounded-full h-12 px-8 text-base bg-white text-black hover:bg-white/90">
                            <Link to="/signup">Start Your Mission</Link>
                          </Button>
                        </div>
                      )}
                   </div>
                </motion.div>
             ))}
             
             {/* Final CTA */}
             <motion.div 
                onViewportEnter={() => setActiveSection(9)}
                viewport={{ margin: "-40% 0px -40% 0px" }}
                className="h-[75vh] flex flex-col justify-center pointer-events-auto"
             >
                <div className={cn(
                   "transition-all duration-700",
                   activeSection === 9 ? "opacity-100 translate-y-0" : "opacity-20 translate-y-4"
                )}>
                   <h2 className="text-5xl md:text-6xl font-semibold tracking-tighter mb-6 leading-[1.05]">
                     Ready to Stop<br/>Missing Deadlines?
                   </h2>
                   <Button asChild size="lg" className="rounded-full h-14 px-10 text-lg bg-white text-black hover:bg-white/90 hover:scale-105 transition-transform">
                     <Link to="/signup">Start Your Mission</Link>
                   </Button>
                </div>
             </motion.div>
          </div>

          {/* Sticky Dashboard (Right) */}
          <div className="hidden md:flex w-7/12 sticky top-0 h-screen items-center justify-end pl-8 lg:pl-16 py-12 [perspective:1000px]">
             <motion.div
               animate={{ 
                  scale: activeSection === 9 ? 0.9 : 1, 
                  opacity: activeSection === 9 ? 0.5 : 1,
                  rotateY: activeSection === 9 ? 10 : 0
               }}
               transition={{ type: "spring", stiffness: 50, damping: 20 }}
               className="w-full h-full max-h-[700px] max-w-[850px] bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)]"
             >
               <InteractiveDashboard section={activeSection > 8 ? 8 : activeSection} />
             </motion.div>
          </div>
       </div>
    </div>
  );
}
