import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Clock, Star, CheckCircle2, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTasks } from '../context/TaskContext';
import MissionMode from '../components/mission/MissionMode';
import { startMission } from '../lib/mission.service';
import { completeMission } from '../lib/mission.service';
import { useNavigate } from 'react-router-dom';
import MissionComplete from "../components/mission/MissionComplete";
import { getAnalytics } from "../lib/analytics.service";

export default function Mission() {
  const { tasks, updateTask } = useTasks();
  const [activeMission, setActiveMission] = useState<any | null>(null);
  const [missionResult, setMissionResult] = useState<any>(null);

  const navigate = useNavigate();

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const recommendedMission = pendingTasks[0];
  const todayMissions = pendingTasks.slice(1, 3);
  const upcomingMissions = pendingTasks.slice(3);

  const handleStartMission = async (task: any) => {
    try {
      const mission = await startMission(task.id);

      setActiveMission({
        ...task,
        missionId: mission.id
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleFinishMission = async () => {
    if (!activeMission?.missionId) return;

    await completeMission(activeMission.missionId);

    updateTask(activeMission.id, {
      status: "completed",
    });

    const analytics = await getAnalytics();

    setMissionResult({
      xp: analytics.xp,
      streak: analytics.streak,
      level: analytics.level,
      nextLevelXP: analytics.nextLevelXP,
    });

    setActiveMission(null);
  };


  const handleInterruptMission = (stats: any) => {
    setActiveMission(null);
  };

  return (
    <>
      <AnimatePresence>
        {missionResult && (
          <MissionComplete
    xp={missionResult.xp}
            streak={missionResult.streak}
            level={missionResult.level}
            nextLevelXP={missionResult.nextLevelXP}
            currentXP={missionResult.xp}
            onContinue={() => {
              setMissionResult(null);
              navigate("/dashboard");
            }}
          />
        )}
        {activeMission && (
          <MissionMode
            task={activeMission}
            onClose={() => setActiveMission(null)}
            onFinish={handleFinishMission}
            onInterrupt={handleInterruptMission}
          />
        )}
      </AnimatePresence>

      <div className="space-y-10 max-w-4xl pb-20">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">Mission Center</h1>
          <p className="text-muted-foreground mt-2 text-lg">Your execution hub for deep focus and structured work.</p>
        </header>

        {recommendedMission && (
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-widest flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" /> Recommended Now
            </h2>
            <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-primary/[0.03] p-6 md:p-8 hover:bg-primary/[0.05] transition-colors group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center justify-between">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/20">
                      {recommendedMission.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-white/60 font-medium">
                      <Clock className="w-4 h-4" /> {recommendedMission.duration}
                    </span>
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight text-white mb-2 group-hover:text-primary transition-colors">
                    {recommendedMission.title}
                  </h3>
                  <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="text-amber-400 flex items-center gap-1.5">
                      <img
  src="/logo.png"
  alt="Deadline Zero"
  className="w-4 h-4 object-contain"
/>Priority: {recommendedMission.priority === 'critical' ? 'High' : 'Medium'}
                    </span>
                    <span className="text-white/40">•</span>
                    <span className="text-white/60">Scheduled: 3:00 PM</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleStartMission(recommendedMission)}
                  className="h-14 px-8 rounded-2xl bg-primary text-primary-foreground font-medium text-lg hover:bg-primary/90 hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(var(--primary),0.2)] shrink-0"
                >
                  <Play className="w-5 h-5 mr-2" fill="currentColor" /> Start Mission
                </Button>
              </div>
            </div>
          </section>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="space-y-4">
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-widest">Today's Missions</h2>
            <div className="space-y-3">
              {todayMissions.length > 0 ? todayMissions.map((task) => (
                <div key={task.id} className="p-4 rounded-2xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors flex items-center justify-between group">
                  <div>
                    <h4 className="font-medium text-white group-hover:text-primary transition-colors">{task.title}</h4>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-white/50 font-medium">
                      <span>Scheduled: 7:00 PM</span>
                      <span>•</span>
                      <span>{task.duration}</span>
                    </div>
                  </div>
                  <Button onClick={() => handleStartMission(task)} variant="ghost" className="rounded-xl hover:bg-white/10 shrink-0 h-10 px-4">
                    Start Later <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              )) : (
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] text-center text-white/40 text-sm">
                  No more missions scheduled for today.
                </div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-widest">Upcoming Missions</h2>
            <div className="space-y-3">
              {upcomingMissions.length > 0 ? upcomingMissions.map((task) => (
                <div key={task.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center justify-between opacity-70">
                  <div>
                    <h4 className="font-medium text-white/80">{task.title}</h4>
                    <div className="flex items-center gap-3 mt-1.5 text-xs text-white/40 font-medium">
                      <span>Tomorrow</span>
                      <span>•</span>
                      <span>Pending</span>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] text-center text-white/40 text-sm">
                  No upcoming missions.
                </div>
              )}
            </div>
          </section>
        </div>

        {completedTasks.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-sm font-medium text-white/50 uppercase tracking-widest">Completed Missions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {completedTasks.slice(0, 4).map((task) => (
                <div key={task.id} className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white/70 line-through">{task.title}</h4>
                    <p className="text-xs text-white/40 mt-0.5">Completed</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
