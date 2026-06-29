import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { getAchievements } from "../lib/achievement.service";
import {
  CheckCircle2,
  Clock,
  FolderKanban,
  Target,
  TrendingUp,
  Flag,
  Brain,
  BarChart3,
  Flame,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalytics } from "../lib/analytics.service";
import { getMissionHistory } from "../lib/history.service";
import ContributionHeatmap from "../components/analytics/ContributionHeatmap";

const DashboardCard = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
  >
    <Card className="bg-white/[0.02] border-white/5 backdrop-blur-sm h-full">
      {children}
    </Card>
  </motion.div>
);

export default function Analytics() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAnalytics();
        setAnalytics(data);
        const historyData = await getMissionHistory();
        setHistory(historyData);

        const achievementData = await getAchievements();
        setAchievements(achievementData);
      } catch (err) {
        console.error(err);
      }
    };


    load();
  }, []);

  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-white/60">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8">

      <header>
        <h1 className="text-3xl font-semibold tracking-tight">
          Analytics
        </h1>

        <p className="text-muted-foreground mt-1">
          Understand how you work and where you can improve.
        </p>
      </header>

      {/* Top Stats */}

      <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-5">

        <DashboardCard delay={0}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <FolderKanban className="w-4 h-4" />
              Total Tasks
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">
              {analytics.totalTasks}
            </p>
          </CardContent>
        </DashboardCard>

        <DashboardCard delay={0.1}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              Completed
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">
              {analytics.completedTasks}
            </p>
          </CardContent>
        </DashboardCard>

        <DashboardCard delay={0.2}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Target className="w-4 h-4 text-blue-500" />
              Completion
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">
              {analytics.completionRate}%
            </p>
          </CardContent>
        </DashboardCard>

        <DashboardCard delay={0.3}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-yellow-500" />
              Focus Hours
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">
              {analytics.totalFocusHours}h
            </p>
          </CardContent>
        </DashboardCard>

        <DashboardCard delay={0.4}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Flame className="w-4 h-4 text-orange-500" />
              Current Streak
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-4xl font-bold">
              {analytics.streak}
            </p>

            <p className="text-sm text-muted-foreground mt-2">
              {analytics.streak} Day{analytics.streak === 1 ? "" : "s"}
            </p>
          </CardContent>
        </DashboardCard>
        <DashboardCard delay={0.5}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Star className="w-4 h-4 text-yellow-400" />
              Level {analytics.level}
            </CardTitle>
          </CardHeader>

          <CardContent>

            <p className="text-4xl font-bold">
              {analytics.xp} XP
            </p>

            <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full bg-yellow-400"
                style={{
                  width: `${Math.min(
                    (analytics.xp / analytics.nextLevelXP) * 100,
                    100
                  )}%`,
                }}
              />
            </div>

            <p className="text-sm text-muted-foreground mt-3">
              {analytics.xp} / {analytics.nextLevelXP} XP
            </p>

          </CardContent>
        </DashboardCard>
        <DashboardCard delay={0.6}>
          <CardHeader>
            <CardTitle>
              🎯 Today's Goal
            </CardTitle>
          </CardHeader>

          <CardContent>

            <div className="text-4xl font-bold">
              {analytics.todayCompleted}/{analytics.todayGoal}
            </div>

            <div className="mt-4 h-2 rounded-full bg-white/10 overflow-hidden">

              <div
                className="h-full bg-green-500"
                style={{
                  width: `${analytics.todayGoal === 0
                    ? 0
                    : (analytics.todayCompleted /
                      analytics.todayGoal) *
                    100
                    }%`,
                }}
              />

            </div>

            <p className="text-sm text-muted-foreground mt-3">
              {Math.round(
                (analytics.todayCompleted /
                  analytics.todayGoal) *
                100
              )}
              % Complete
            </p>

          </CardContent>
        </DashboardCard>

      </div>

      {/* Second Row */}

      <div className="grid lg:grid-cols-2 gap-6">

        <DashboardCard delay={0.4}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Category Breakdown
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {Object.keys(analytics.categoryBreakdown).length === 0 ? (

              <p className="text-sm text-muted-foreground">
                No task data available.
              </p>

            ) : (

              Object.entries(analytics.categoryBreakdown).map(
                ([category, count]: any) => (

                  <div key={category}>

                    <div className="flex justify-between mb-1 text-sm">

                      <span>{category}</span>

                      <span>
                        {count} (
                        {Math.round(
                          (count / analytics.totalTasks) * 100
                        )}
                        %)
                      </span>

                    </div>

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">

                      <div
                        className="h-full bg-white"
                        style={{
                          width: `${analytics.totalTasks === 0
                            ? 0
                            : (count / analytics.totalTasks) * 100
                            }%`,
                        }}
                      />

                    </div>

                  </div>

                )
              )

            )}

          </CardContent>
        </DashboardCard>

        <DashboardCard delay={0.5}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5" />
              Priority Breakdown
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">

            {Object.keys(analytics.priorityBreakdown).length === 0 ? (

              <p className="text-sm text-muted-foreground">
                No task data available.
              </p>

            ) : (

              Object.entries(analytics.priorityBreakdown).map(
                ([priority, count]: any) => (

                  <div key={priority}>

                    <div className="flex justify-between mb-1 text-sm">

                      <span>{priority}</span>

                      <span>
                        {count} (
                        {Math.round(
                          (count / analytics.totalTasks) * 100
                        )}
                        %)
                      </span>

                    </div>

                    <div className="h-2 rounded-full bg-white/10 overflow-hidden">

                      <div
                        className="h-full bg-white"
                        style={{
                          width: `${analytics.totalTasks === 0
                            ? 0
                            : (count / analytics.totalTasks) * 100
                            }%`,
                        }}
                      />

                    </div>

                  </div>

                )
              )

            )}

          </CardContent>
        </DashboardCard>

      </div>

      {/* Bottom */}
      <ContributionHeatmap />
      <DashboardCard delay={0.6}>

        <CardHeader>

          <CardTitle className="flex items-center gap-2">

            <Brain className="w-5 h-5" />

            AI Productivity Insights

          </CardTitle>

        </CardHeader>

        <CardContent className="space-y-5">

          <div className="flex gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-500 mt-1" />

            <div>
              <p className="font-medium">
                {analytics.completedTasks} of {analytics.totalTasks} tasks completed
              </p>

              <p className="text-sm text-muted-foreground">
                Completion rate: {analytics.completionRate}%
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Target className="w-5 h-5 text-blue-500 mt-1" />

            <div>
              <p className="font-medium">
                Mission Success
              </p>

              <p className="text-sm text-muted-foreground">
                {analytics.missionSuccessRate}% successful missions
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Clock className="w-5 h-5 text-yellow-500 mt-1" />

            <div>
              <p className="font-medium">
                Focus Time
              </p>

              <p className="text-sm text-muted-foreground">
                {analytics.totalFocusHours} hours completed
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <TrendingUp className="w-5 h-5 text-purple-500 mt-1" />

            <div>
              <p className="font-medium">
                Overall Progress
              </p>

              <p className="text-sm text-muted-foreground">
                🔥 {analytics.streak} day streak • ⭐ {analytics.xp} XP
              </p>
            </div>
          </div>

        </CardContent>

      </DashboardCard>
      <DashboardCard delay={0.7}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏆 Achievements
          </CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-4">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`rounded-xl border p-4 transition-all ${achievement.unlocked
                ? "border-yellow-500/20 bg-yellow-500/5"
                : "border-white/5 opacity-50"
                }`}
            >
              <div className="text-3xl mb-3">
                {achievement.unlocked ? achievement.icon : "🔒"}
              </div>

              <div className="font-medium">
                {achievement.title}
              </div>

              <div className="text-sm text-muted-foreground mt-1">
                {achievement.unlocked
                  ? "Unlocked"
                  : "Keep working to unlock"}
              </div>
            </div>
          ))}
        </CardContent>
      </DashboardCard>
      <DashboardCard delay={0.8}>
        <CardHeader>
          <CardTitle>
            📜 Recent Missions
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">

          {history.length === 0 ? (

            <p className="text-muted-foreground">
              No completed missions yet.
            </p>

          ) : (

            history.map((mission) => (

              <div
                key={mission.id}
                className="flex justify-between items-center rounded-xl border border-white/5 p-4"
              >
                <div>

                  <p className="font-medium">
                    {mission.task.title}
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {new Date(mission.endedAt).toLocaleDateString()}
                  </p>

                </div>

                <div className="text-green-400 font-semibold">
                  ✓
                </div>

              </div>

            ))

          )}

        </CardContent>
      </DashboardCard>

    </div>
  );
}