import { ReactNode, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  Target,
  Clock,
  Activity,
  Flag,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight
} from 'lucide-react'; import { useTasks } from '../context/TaskContext';
import { generatePlan } from '../lib/plan.service';
import { useRoutine } from '../context/RoutineContext';
import { getActiveMission } from '../lib/mission.service';
import { calculateDecision } from '../utils/decisionEngine';
import { calculateFocusTime } from "../utils/focusCalculator";
import { startMission } from "../lib/mission.service";

const DashboardCard = ({ children, className, delay = 0 }: { children: ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay, ease: "easeOut" }}
    className={className}
  >
    <Card className="h-full bg-white/[0.02] border-white/5 shadow-none overflow-hidden backdrop-blur-sm hover:bg-white/[0.03] transition-colors">
      {children}
    </Card>
  </motion.div>
);

const NumberCounter = ({ value, duration = 1, prefix = "", suffix = "" }: { value: number, duration?: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / (duration * 1000), 1);

      // Easing function (easeOutQuart)
      const easeOut = 1 - Math.pow(1 - percentage, 4);
      setCount(Math.floor(easeOut * value));

      if (percentage < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration]);

  return <span>{prefix}{count}{suffix}</span>;
};

export default function Dashboard() {
  const { tasks } = useTasks();
  const { routine } = useRoutine();
  const focusTime = calculateFocusTime(routine);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [activeMission, setActiveMission] = useState<any>(null);
  const [isPlanning, setIsPlanning] = useState(false);
  const [planCompleted, setPlanCompleted] = useState(false);
  const [planningStep, setPlanningStep] = useState(0);
  const planningMessages = [
    "Reading your routine",
    "Checking deadlines",
    "Calculating available hours",
    "Prioritizing tasks",
    "Optimizing schedule",
    "Finalizing plan"
  ];
  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');
  const [decision, setDecision] = useState<any>(null);
  const [missionTask, setMissionTask] = useState<any>(null);
  useEffect(() => {
    const loadMission = async () => {
      try {
        const mission = await getActiveMission();
        setActiveMission(mission);
      } catch (err) {
        console.error(err);
      }
    };

    loadMission();
  }, []);
  useEffect(() => {
    if (!isPlanning) {
      setPlanningStep(0);
      return;
    }

    let current = 0;

    const interval = setInterval(() => {
      current++;

      setPlanningStep(current);

      if (current >= planningMessages.length) {
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isPlanning]);

  const priorityTasks = tasks
    .filter(t => t.status !== 'completed' && (t.priority === 'critical' || t.priority === 'high'))
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);


  const upcomingDeadlines = tasks
    .filter(t => t.status !== 'completed' && new Date(t.deadline) >= new Date())
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
    .slice(0, 3);

  const formatDue = (dateString: string) => {
    const d = new Date(dateString);
    const today = new Date();
    const diff = d.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 3600 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days < 0) return 'Overdue';
    return `In ${days} days`;
  };

  const handleBuildPlan = async () => {
    console.log("1");

    if (!routine) {
      console.log("Routine is null");
      return;
    }

    console.log("2");

    setIsPlanning(true);

    try {
      console.log("3");

      const plan = await generatePlan(tasks, routine);
      setSchedule(plan.schedule);
      setDecision(plan.decision);

      if (plan.missionTask) {
        setMissionTask(plan.missionTask);
      }

      console.log("4", plan);


      console.log("5");

      setPlanCompleted(true);

      console.log("6");

      // Temporarily comment these
      // const mission = await getActiveMission();
      // setActiveMission(mission);

      console.log("7");
    } catch (err) {
      console.error("ERROR:", err);
    } finally {
      console.log("8");
      setIsPlanning(false);
    }
  };

  const navigate = useNavigate();

  const handleStartMission = async () => {
    if (!missionTask) return;

    try {
      await startMission(missionTask.id);
      navigate("/mission");
    } catch (err) {
      console.error(err);
    }
  };



  return (
    <div className="space-y-6 pb-20">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.05] to-transparent p-8 md:p-10 shadow-2xl backdrop-blur-md"
      >
        <div className="absolute top-0 right-0 p-32 opacity-20 pointer-events-none mix-blend-screen">
          <div className="w-64 h-64 bg-primary/30 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between">
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-white mb-2">
                Good Evening, {localStorage.getItem("userName") || "Commander"}
              </h1>
              <p className="text-lg text-white/60 font-light">
                {planCompleted ? "Here is the best plan for today." : "Welcome back! Let's build the best plan for today."}
              </p>
            </div>

            {isPlanning ? (
              <div className="py-6 space-y-4">
                <div className="flex items-center gap-3 text-lg font-medium text-white/90">
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
                    <Sparkles className="w-5 h-5 text-primary" />
                  </motion.div>
                  Building Today's Plan...
                </div>
                <div className="space-y-2.5 ml-8 text-sm text-white/70">
                  {planningMessages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: planningStep > idx ? 1 : 0, x: planningStep > idx ? 0 : -10 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary" /> {msg}
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-2">
                <div>
                  <p className="text-sm font-medium text-white/50 uppercase tracking-wider mb-2">Today's Success Probability</p>
                  <p className="text-2xl font-semibold tracking-tight text-white">
                    {planCompleted && decision ? `${decision.successNow}%` : "--"}
                  </p>

                  {planCompleted && decision && (
                    <div className="mt-3 space-y-1 text-sm text-white/70">
                      <div>⚡ Start Now: {decision.successNow}%</div>
                      <div>🏫 After College: {decision.afterCollege}%</div>
                      <div>🌙 Tonight: {decision.tonight}%</div>
                      <div>📅 Tomorrow: {decision.tomorrow}%</div>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-white/50 uppercase tracking-wider mb-2">Available Focus Time</p>
                  <p className="text-2xl font-semibold tracking-tight text-white">
                    {planCompleted ? focusTime : "--"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-white/50 uppercase tracking-wider mb-2">Today's Mission</p>
                  {planCompleted ? (
                    <div className="space-y-3">
                      <p className="text-xl font-medium text-white">
                        {missionTask ? missionTask.title : "No recommended mission"}
                      </p>
                      <div className="space-y-2 mt-3">
                        {decision?.reasoning.map((r: string, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-sm text-white/70">
                            <CheckCircle2 className="w-4 h-4 text-primary" />
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-lg text-white/40 italic">Waiting for today's AI plan.</p>
                  )}
                </div>
              </div>
            )}

            {!isPlanning && (
              <div className="pt-4">
                <button
                  onClick={() => {
                    if (planCompleted) {
                      handleStartMission();
                    } else {
                      handleBuildPlan();
                    }
                  }}
                  className="group relative inline-flex items-center justify-center h-14 px-8 rounded-full bg-white text-black font-medium text-lg hover:bg-white/90 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                >
                  {planCompleted ? (
                    <>
                      Start Mission
                      <ChevronRight className="ml-2 w-5 h-5" />
                    </>
                  ) : (
                    <>Build Today's Plan</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Top row: High-level metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <DashboardCard delay={0}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Success Probability</CardTitle>
            <Target className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              {decision ? (
                <NumberCounter value={decision.successNow} suffix="%" />
              ) : (
                "--"
              )}
            </div>
            <div className="relative h-1 mt-3 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-white"
                initial={{ width: 0 }}
                animate={{
                  width: decision ? `${decision.successNow}%` : "0%"
                }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <div className="mt-3">
              <AnimatePresence mode="wait">
                {planCompleted && decision && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-1 text-xs text-green-500 font-medium"
                  >
                    <div>Now: {decision.successNow}%</div>
                    <div>After College: {decision.afterCollege}%</div>
                    <div>Tonight: {decision.tonight}%</div>
                    <div>Tomorrow: {decision.tomorrow}%</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </CardContent>
        </DashboardCard>

        <DashboardCard delay={0.1}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Productivity Streak</CardTitle>
            <img
              src="/logo.png"
              alt="Deadline Zero"
              className="w-4 h-4 object-contain"
            />          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              <NumberCounter value={12} suffix=" Days" />
            </div>
            <div className="flex gap-1 mt-4">
              {[1, 1, 1, 1, 1, 1, 0].map((active, i) => (
                <div key={i} className={`flex-1 h-1.5 rounded-full ${active ? 'bg-amber-500' : 'bg-white/10'}`} />
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">You are on fire. Keep it up.</p>
          </CardContent>
        </DashboardCard>

        <DashboardCard delay={0.2}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Weekly Progress</CardTitle>
            <Activity className="w-4 h-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold tracking-tight">
              <NumberCounter value={completedTasks.length} />/{tasks.length}
            </div>
            <div className="relative h-1 mt-3 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 h-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${tasks.length === 0 ? 0 : (completedTasks.length / tasks.length) * 100}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-3">Tasks completed this week</p>
          </CardContent>
        </DashboardCard>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">

        {/* Left Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard delay={0.3}>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-400" /> Priority Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {priorityTasks.length > 0 ? priorityTasks.map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.04] transition-colors group cursor-pointer relative overflow-hidden">
                    {planCompleted && missionTask?.id === task.id && (
                      <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
                    )}
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full border-2 ${task.priority === 'critical' ? 'border-red-500' :
                        task.priority === 'high' ? 'border-amber-500' : 'border-blue-500'
                        }`} />
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium group-hover:text-primary transition-colors">{task.title}</p>
                          {planCompleted && missionTask?.id === task.id && (
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary border-none">
                              <Sparkles className="w-2.5 h-2.5 mr-1" /> Mission
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{task.category}</p>
                      </div>
                    </div>
                    <div className="text-xs font-medium text-muted-foreground bg-white/5 px-2 py-1 rounded-md">
                      {task.duration}
                    </div>
                  </div>
                )) : (
                  <div className="text-sm text-white/40 italic py-2">No priority tasks right now.</div>
                )}
              </div>
            </CardContent>
          </DashboardCard>

          <DashboardCard delay={0.4}>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-400" /> Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative border-l border-white/10 ml-2 space-y-6 pb-2">
                <AnimatePresence mode="wait">
                  {!planCompleted ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-white/40 italic py-2 pl-4">
                      Run the AI planner to get your optimized daily schedule.
                    </motion.div>
                  ) : (
                    <motion.div key="schedule" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                      {schedule.map((event, i) => (
                        <div key={i} className="relative pl-6">
                          <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-background ${event.type === 'focus' ? 'bg-primary' :
                            event.type === 'meeting' ? 'bg-blue-500' : 'bg-muted-foreground'
                            }`} />
                          <div className="text-xs font-medium text-muted-foreground mb-0.5">{event.startTime}</div>
                          <div className="text-sm font-medium text-white/90">{event.title}</div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </DashboardCard>
        </div>

        {/* Right Column (1/3 width) */}
        <div className="space-y-6">
          <DashboardCard delay={0.5}>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="Deadline Zero"
                  className="w-4 h-4 object-contain"
                /> Why this mission?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {!planCompleted ? (
                  <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-white/40 italic py-2">
                    Click "Build Today's Plan" to get personalized AI coaching and scheduling recommendations.
                  </motion.div>
                ) : (
                  <motion.div key="rec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 rounded-xl border border-purple-500/10 bg-purple-500/[0.02] space-y-3">
                    <div className="space-y-2">
                      {decision?.reasoning.map((r: string, i: number) => (
                        <div key={i} className="flex gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5" />
                          {r}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </DashboardCard>

          <DashboardCard delay={0.6}>
            <CardHeader>
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-500" /> Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingDeadlines.length > 0 ? upcomingDeadlines.map((deadline, i) => {
                  const isHighRisk =
                    planCompleted &&
                    missionTask?.id === deadline.id; // Just mock first as high risk if planned
                  return (
                    <div key={i} className={`flex flex-col gap-1.5 p-3 rounded-xl border transition-colors ${isHighRisk ? 'border-amber-500/30 bg-amber-500/5' : 'border-white/5 bg-white/[0.01]'
                      }`}>
                      <div className="flex justify-between items-start">
                        <span className="text-sm font-medium line-clamp-1 mr-2 flex items-center gap-1.5">
                          {isHighRisk && <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />}
                          {deadline.title}
                        </span>
                        {deadline.priority === 'critical' && (
                          <span className="flex h-2 w-2 rounded-full bg-red-500 mt-1 flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium">{formatDue(deadline.deadline)}</span>
                        {isHighRisk && (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-amber-500">Risk: High</span>
                        )}
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-sm text-white/40 italic py-2">No upcoming deadlines.</div>
                )}
              </div>
            </CardContent>
          </DashboardCard>
        </div>

      </div>
    </div>
  );
}

