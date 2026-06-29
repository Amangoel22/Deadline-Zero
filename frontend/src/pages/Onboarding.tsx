import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, Sun, Moon, Clock, ArrowRight, ArrowLeft, Plus, X, CheckCircle2, Target, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRoutine } from '../context/RoutineContext';

type OnboardingData = {
  wakeTime: string;
  sleepTime: string;
  commitments: { id: string; title: string; start: string; end: string; color: string }[];
  productivityPeak: string;
  focusLength: string;
  goals: string[];
};

const COLORS = ['bg-blue-500', 'bg-purple-500', 'bg-amber-500', 'bg-pink-500', 'bg-green-500'];

export default function Onboarding() {
  const navigate = useNavigate();
  const { saveRoutine } = useRoutine();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    wakeTime: '07:00',
    sleepTime: '23:00',
    commitments: [],
    productivityPeak: 'Morning',
    focusLength: '45 min',
    goals: [],
  });

  const nextStep = () => setStep((s) => Math.min(s + 1, 5));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const updateData = (updates: Partial<OnboardingData>) => {
    setData((prev) => ({ ...prev, ...updates }));
  };

  const steps = [
    { title: "Welcome", component: <Step0Welcome /> },
    { title: "Wake Up", component: <Step1WakeUp data={data} updateData={updateData} /> },
    { title: "Commitments", component: <Step2Commitments data={data} updateData={updateData} /> },
    { title: "Productivity", component: <Step3Productivity data={data} updateData={updateData} /> },
    { title: "Goals", component: <Step4Goals data={data} updateData={updateData} /> },
    { title: "Preview", component: <Step5Preview data={data} /> },
  ];

  const handleFinish = async () => {
  try {
    await saveRoutine({
      wakeTime: data.wakeTime,
      sleepTime: data.sleepTime,
      preferredWorkStart: data.wakeTime,
      preferredWorkEnd: data.sleepTime,
      timezone: 'Asia/Kolkata',
      commitments: data.commitments.map((c) => ({
        title: c.title,
        startTime: c.start,
        endTime: c.end,
        daysOfWeek: [1, 2, 3, 4, 5], // Temporary default
      })),
    });

    navigate('/dashboard');
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="min-h-screen bg-[#09090B] text-white flex overflow-hidden font-sans relative selection:bg-white/20">
      {/* Background Texture & Lighting */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Radial spotlight */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[80vh] bg-white/[0.03] rounded-full blur-[120px]" />
        
        {/* Dot grid */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] opacity-50" />
        
        {/* Noise overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]" />
      </div>

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 z-50 bg-white/5">
        <motion.div 
          className="h-full bg-white/40"
          initial={{ width: 0 }}
          animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      <div className="flex w-full h-screen relative z-10">
        {/* Left Visual Panel (Desktop only) */}
        <div className="hidden lg:flex w-[40%] border-r border-white/5 bg-white/[0.01] items-center justify-center p-12 relative overflow-hidden backdrop-blur-sm">
           <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.9, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: 0.6, ease: "circOut" }}
                className="w-full max-w-md aspect-square relative flex items-center justify-center"
              >
                 {step === 0 && <VisualWelcome />}
                 {step === 1 && <VisualWakeUp wake={data.wakeTime} sleep={data.sleepTime} />}
                 {step === 2 && <VisualCommitments commitments={data.commitments} />}
                 {step === 3 && <VisualProductivity peak={data.productivityPeak} />}
                 {step === 4 && <VisualGoals goals={data.goals} />}
                 {step === 5 && <VisualPreview data={data} />}
              </motion.div>
           </AnimatePresence>
        </div>

        {/* Right Content Panel */}
        <div className="w-full lg:w-[60%] flex flex-col justify-center px-8 md:px-20 relative">
          
          <div className="absolute top-8 left-8 lg:left-12 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              <Zap className="w-4 h-4 text-black" />
            </div>
            <span className="font-medium tracking-tight text-white/80">Deadline Zero</span>
          </div>

          <div className="w-full max-w-xl mx-auto min-h-[400px] flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                {steps[step].component}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="w-full max-w-xl mx-auto mt-12 flex items-center justify-between">
            {step > 0 ? (
              <Button 
                variant="ghost" 
                onClick={prevStep}
                className="text-white/60 hover:text-white hover:bg-white/5 h-12 px-6 rounded-xl"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Back
              </Button>
            ) : (
              <div />
            )}
            
            {step < steps.length - 1 ? (
              <Button 
                onClick={nextStep}
                className="h-12 px-8 rounded-xl bg-white text-black hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] font-medium"
              >
                Continue <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleFinish}
                className="h-12 px-8 rounded-xl bg-white text-black hover:bg-white/90 hover:scale-105 transition-all shadow-[0_0_30px_rgba(255,255,255,0.15)] font-medium"
              >
                Enter Deadline Zero
              </Button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// --- STEP COMPONENTS ---

function Step0Welcome() {
  return (
    <div className="space-y-4">
      <h1 className="text-4xl md:text-5xl font-semibold tracking-tighter">Let's understand your day.</h1>
      <p className="text-lg text-white/60 font-light leading-relaxed">
        Deadline Zero works best when it understands your daily routine. We'll use this to build personalized schedules that protect your focus.
      </p>
    </div>
  );
}

function Step1WakeUp({ data, updateData }: { data: OnboardingData, updateData: any }) {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">When do you usually sleep?</h1>
        <p className="text-white/60 font-light">Your energy levels define your productivity.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-medium text-white/80 flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-400" /> Wake up
          </label>
          <Input 
            type="time" 
            value={data.wakeTime}
            onChange={(e) => updateData({ wakeTime: e.target.value })}
            className="h-14 bg-white/5 border-white/10 text-lg focus-visible:ring-1 focus-visible:ring-white/30 rounded-xl"
          />
        </div>
        <div className="space-y-3">
          <label className="text-sm font-medium text-white/80 flex items-center gap-2">
            <Moon className="w-4 h-4 text-blue-400" /> Sleep
          </label>
          <Input 
            type="time" 
            value={data.sleepTime}
            onChange={(e) => updateData({ sleepTime: e.target.value })}
            className="h-14 bg-white/5 border-white/10 text-lg focus-visible:ring-1 focus-visible:ring-white/30 rounded-xl"
          />
        </div>
      </div>
    </div>
  );
}

function Step2Commitments({ data, updateData }: { data: OnboardingData, updateData: any }) {
  const [title, setTitle] = useState('');
  const [start, setStart] = useState('09:00');
  const [end, setEnd] = useState('17:00');
  const [colorIdx, setColorIdx] = useState(0);

  const addCommitment = () => {
    if (!title) return;
    const newCommitment = {
      id: Math.random().toString(),
      title,
      start,
      end,
      color: COLORS[colorIdx]
    };
    updateData({ commitments: [...data.commitments, newCommitment] });
    setTitle('');
    setColorIdx((c) => (c + 1) % COLORS.length);
  };

  const remove = (id: string) => {
    updateData({ commitments: data.commitments.filter(c => c.id !== id) });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">Fixed commitments</h1>
        <p className="text-white/60 font-light">Classes, gym, work blocks. We schedule around these.</p>
      </div>
      
      <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-md space-y-4 shadow-xl">
        <div className="grid grid-cols-12 gap-3">
          <div className="col-span-12 md:col-span-6 space-y-1.5">
            <label className="text-xs text-white/50 px-1">Name</label>
            <Input 
              placeholder="e.g. College" 
              value={title} onChange={(e) => setTitle(e.target.value)}
              className="h-10 bg-white/5 border-white/10 rounded-lg text-sm"
              onKeyDown={(e) => e.key === 'Enter' && addCommitment()}
            />
          </div>
          <div className="col-span-6 md:col-span-3 space-y-1.5">
            <label className="text-xs text-white/50 px-1">Start</label>
            <Input 
              type="time" 
              value={start} onChange={(e) => setStart(e.target.value)}
              className="h-10 bg-white/5 border-white/10 rounded-lg text-sm"
            />
          </div>
          <div className="col-span-6 md:col-span-3 space-y-1.5">
            <label className="text-xs text-white/50 px-1">End</label>
            <Input 
              type="time" 
              value={end} onChange={(e) => setEnd(e.target.value)}
              className="h-10 bg-white/5 border-white/10 rounded-lg text-sm"
            />
          </div>
        </div>
        <Button onClick={addCommitment} className="w-full h-10 rounded-lg bg-white/10 text-white hover:bg-white/20 border border-white/5">
          <Plus className="w-4 h-4 mr-2" /> Add Block
        </Button>
      </div>

      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
        <AnimatePresence>
          {data.commitments.map((c) => (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01]"
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-3 h-3 rounded-full", c.color)} />
                <span className="font-medium text-sm">{c.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/50">{c.start} - {c.end}</span>
                <button onClick={() => remove(c.id)} className="text-white/30 hover:text-red-400 transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Step3Productivity({ data, updateData }: { data: OnboardingData, updateData: any }) {
  const peaks = ['Morning', 'Afternoon', 'Evening', 'Night'];
  const lengths = ['25 min', '45 min', '60 min', '90 min'];

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">When do you work best?</h1>
        <p className="text-white/60 font-light">We'll schedule your deep work during these hours.</p>
      </div>
      
      <div className="space-y-4">
        <label className="text-sm font-medium text-white/80">Peak Energy</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {peaks.map(p => (
            <div 
              key={p}
              onClick={() => updateData({ productivityPeak: p })}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all text-center text-sm font-medium",
                data.productivityPeak === p 
                  ? "bg-white/10 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                  : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.04]"
              )}
            >
              {p}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <label className="text-sm font-medium text-white/80">Ideal Focus Session</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {lengths.map(l => (
            <div 
              key={l}
              onClick={() => updateData({ focusLength: l })}
              className={cn(
                "p-4 rounded-xl border cursor-pointer transition-all text-center text-sm font-medium",
                data.focusLength === l 
                  ? "bg-white/10 border-white/30 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                  : "bg-white/[0.02] border-white/5 text-white/50 hover:bg-white/[0.04]"
              )}
            >
              {l}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step4Goals({ data, updateData }: { data: OnboardingData, updateData: any }) {
  const [goal, setGoal] = useState('');

  const addGoal = () => {
    if (!goal || data.goals.includes(goal)) return;
    updateData({ goals: [...data.goals, goal] });
    setGoal('');
  };

  const remove = (g: string) => {
    updateData({ goals: data.goals.filter(x => x !== g) });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight mb-2">What are your missions?</h1>
        <p className="text-white/60 font-light">Set your high-level goals. We'll help you hit them.</p>
      </div>
      
      <div className="relative">
        <Input 
          placeholder="e.g. Crack Internship, Finish Course..." 
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGoal()}
          className="h-14 bg-white/5 border-white/10 text-base pr-14 focus-visible:ring-1 focus-visible:ring-white/30 rounded-xl"
        />
        <button 
          onClick={addGoal}
          className="absolute right-2 top-2 bottom-2 w-10 flex items-center justify-center bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <AnimatePresence>
          {data.goals.map((g) => (
            <motion.div
              key={g}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 flex items-center gap-2 text-sm backdrop-blur-md"
            >
              <Target className="w-3.5 h-3.5 text-primary/70" />
              <span>{g}</span>
              <button onClick={() => remove(g)} className="ml-1 text-white/30 hover:text-white transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Step5Preview({ data }: { data: OnboardingData }) {
  return (
    <div className="space-y-6">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tighter mb-2">You're all set.</h1>
        <p className="text-lg text-white/60 font-light leading-relaxed">
          AI has built your initial profile. Your workspace is ready for deep focus.
        </p>
      </div>
      
      <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden">
        {/* Subtle glow in preview */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-white/10 rounded-full blur-[50px]" />
        
        <div className="flex items-center justify-between mb-8">
           <div>
             <div className="text-sm text-white/50">Good Evening</div>
             <div className="text-xl font-medium">Commander</div>
           </div>
           <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
             <Zap className="w-5 h-5" />
           </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
           <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="text-xs text-white/50 mb-1">Wake Up</div>
              <div className="text-lg font-medium">{data.wakeTime || '07:00 AM'}</div>
           </div>
           <div className="bg-white/5 rounded-xl p-4 border border-white/5">
              <div className="text-xs text-white/50 mb-1">Goals</div>
              <div className="text-lg font-medium">{data.goals.length || 0} Active</div>
           </div>
        </div>
      </div>
    </div>
  );
}


// --- VISUAL COMPONENTS FOR LEFT PANEL ---

function VisualWelcome() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="w-[80%] h-[80%] rounded-full border border-white/10 border-dashed flex items-center justify-center relative"
      >
        <div className="absolute top-0 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.8)]" />
        <div className="w-[60%] h-[60%] rounded-full border border-white/5 flex items-center justify-center">
           <Zap className="w-12 h-12 text-white/20" />
        </div>
      </motion.div>
    </div>
  );
}

function VisualWakeUp({ wake, sleep }: { wake: string, sleep: string }) {
  const wakeHour = parseInt(wake.split(':')[0] || '7');
  const isDay = wakeHour >= 6 && wakeHour < 18;
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-8">
      <motion.div 
        key={isDay ? 'sun' : 'moon'}
        initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="w-32 h-32 rounded-full flex items-center justify-center relative"
      >
        <div className={cn("absolute inset-0 rounded-full blur-[40px] opacity-30", isDay ? "bg-amber-400" : "bg-blue-400")} />
        {isDay ? <Sun className="w-16 h-16 text-amber-400" /> : <Moon className="w-16 h-16 text-blue-400" />}
      </motion.div>
      <div className="flex items-center gap-4 text-white/40 font-medium">
         <span>{wake}</span>
         <div className="w-12 h-[1px] bg-white/20" />
         <span>{sleep}</span>
      </div>
    </div>
  );
}

function VisualCommitments({ commitments }: { commitments: OnboardingData['commitments'] }) {
  return (
    <div className="w-full h-[80%] border-l border-white/10 ml-8 relative py-4">
      {commitments.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm">
          Timeline preview
        </div>
      ) : (
        commitments.map((c, i) => (
          <motion.div 
            key={c.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="mb-6 relative pl-6"
          >
            <div className={cn("absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-[#09090B]", c.color)} />
            <div className="text-xs text-white/40 mb-1">{c.start}</div>
            <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-sm font-medium">
              {c.title}
            </div>
          </motion.div>
        ))
      )}
    </div>
  );
}

function VisualProductivity({ peak }: { peak: string }) {
  const getCurve = () => {
    switch(peak) {
      case 'Morning': return "M 0,100 C 30,20 60,80 100,90";
      case 'Afternoon': return "M 0,100 C 40,90 50,20 100,90";
      case 'Evening': return "M 0,100 C 50,90 80,20 100,60";
      case 'Night': return "M 0,90 C 40,80 70,90 100,20";
      default: return "M 0,100 C 30,20 60,80 100,90";
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
       <svg viewBox="0 0 100 100" className="w-full max-w-[250px] overflow-visible">
          <motion.path 
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1, d: getCurve() }}
            transition={{ duration: 1, ease: "easeInOut" }}
            fill="none" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round"
            className="opacity-50"
          />
       </svg>
       <div className="mt-8 text-white/40 font-medium text-sm flex justify-between w-full max-w-[250px]">
          <span>6 AM</span>
          <span>12 PM</span>
          <span>6 PM</span>
          <span>12 AM</span>
       </div>
    </div>
  );
}

function VisualGoals({ goals }: { goals: string[] }) {
  return (
    <div className="relative w-full h-full">
      {goals.length === 0 ? (
        <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm">
           Missions
        </div>
      ) : (
        goals.map((g, i) => (
          <motion.div
            key={g}
            initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              x: Math.sin(i * 1.5) * 80, 
              y: Math.cos(i * 1.5) * 80 
            }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-white/10 border border-white/20 shadow-xl backdrop-blur-md whitespace-nowrap text-sm font-medium"
          >
            {g}
          </motion.div>
        ))
      )}
    </div>
  );
}

function VisualPreview({ data }: { data: OnboardingData }) {
  return (
    <div className="w-full h-full flex flex-col pt-12 items-center">
      <div className="w-[85%] h-full bg-[#0a0a0a] rounded-t-3xl border border-white/10 border-b-0 p-6 flex flex-col relative overflow-hidden shadow-[0_-20px_50px_rgba(255,255,255,0.05)]">
         {/* Top nav */}
         <div className="flex justify-between items-center mb-8">
            <div className="w-24 h-4 bg-white/10 rounded-full" />
            <div className="w-6 h-6 bg-white/10 rounded-full" />
         </div>
         {/* Prob widget */}
         <div className="w-full h-24 bg-white/5 rounded-xl border border-white/10 mb-4 flex items-center justify-center relative overflow-hidden">
            <div className="absolute bottom-0 left-0 h-1 bg-green-400/50 w-[84%]" />
            <span className="text-3xl font-bold text-white/30">84%</span>
         </div>
         {/* Schedule */}
         <div className="flex-1 space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="w-full h-12 bg-white/5 rounded-lg border border-white/10 flex items-center px-4">
                 <div className="w-4 h-4 rounded bg-white/10 mr-3" />
                 <div className="w-32 h-3 bg-white/10 rounded-full" />
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}
