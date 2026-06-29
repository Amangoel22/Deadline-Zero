import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Flame, Star, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MissionCompleteModal({
  open,
  task,
  xp,
  streak,
  onClose,
}: {
  open: boolean;
  task: any;
  xp: number;
  streak: number;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180 }}
            className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0b0b0d] p-8"
          >
            <div className="flex justify-center mb-5">
              <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            </div>

            <h2 className="text-3xl font-bold text-center">
              Mission Complete
            </h2>

            <p className="text-center text-white/60 mt-2">
              {task?.title}
            </p>

            <div className="grid grid-cols-2 gap-4 my-8">

              <motion.div
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl bg-white/[0.03] p-5 text-center"
              >
                <Star className="mx-auto mb-2 text-yellow-400" />
                <div className="text-3xl font-bold">
                  +{xp}
                </div>
                <div className="text-sm text-white/50">
                  XP Earned
                </div>
              </motion.div>

              <motion.div
                initial={{ y: 25, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="rounded-2xl bg-white/[0.03] p-5 text-center"
              >
                <Flame className="mx-auto mb-2 text-orange-500" />
                <div className="text-3xl font-bold">
                  {streak}
                </div>
                <div className="text-sm text-white/50">
                  Day Streak
                </div>
              </motion.div>

            </div>

            <div className="space-y-3 mb-8">

              <div className="flex gap-3 items-center">
                <Trophy className="text-primary w-5 h-5" />
                Task marked as completed
              </div>

              <div className="flex gap-3 items-center">
                <Star className="text-yellow-400 w-5 h-5" />
                Experience added
              </div>

              <div className="flex gap-3 items-center">
                <Flame className="text-orange-500 w-5 h-5" />
                Daily streak updated
              </div>

            </div>

            <Button
              onClick={onClose}
              className="w-full h-12 rounded-xl"
            >
              Continue
            </Button>

          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}