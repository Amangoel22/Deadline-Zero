import { motion } from "motion/react";
import { CheckCircle2, Flame, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  xp: number;
  streak: number;
  level: number;
  nextLevelXP: number;
  currentXP: number;
  onContinue: () => void;
};

export default function MissionComplete({
  xp,
  streak,
  level,
  nextLevelXP,
  currentXP,
  onContinue,
}: Props) {
  const progress = (currentXP / nextLevelXP) * 100;

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        initial={{ scale: .9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg rounded-3xl border border-white/10 bg-neutral-950 p-8"
      >
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="w-20 h-20 text-green-500" />
        </div>

        <h1 className="text-3xl font-bold text-center">
          Mission Complete
        </h1>

        <p className="text-center text-muted-foreground mt-2">
          Excellent work. Keep the momentum going.
        </p>

        <div className="grid grid-cols-2 gap-5 mt-8">

          <div className="rounded-2xl bg-white/5 p-5 text-center">
            <Star className="mx-auto mb-2 text-yellow-400"/>
            <p className="text-3xl font-bold">+{xp}</p>
            <p className="text-sm text-muted-foreground">XP Earned</p>
          </div>

          <div className="rounded-2xl bg-white/5 p-5 text-center">
            <Flame className="mx-auto mb-2 text-orange-500"/>
            <p className="text-3xl font-bold">{streak}</p>
            <p className="text-sm text-muted-foreground">Day Streak</p>
          </div>

        </div>

        <div className="mt-8">

          <div className="flex justify-between text-sm mb-2">
            <span>Level {level}</span>
            <span>{currentXP}/{nextLevelXP} XP</span>
          </div>

          <div className="h-3 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-primary"
              style={{ width: `${progress}%` }}
            />
          </div>

        </div>

        <Button
          className="w-full h-12 mt-8 rounded-xl"
          onClick={onContinue}
        >
          Continue
          <ArrowRight className="ml-2 w-4 h-4"/>
        </Button>

      </motion.div>
    </motion.div>
  );
}