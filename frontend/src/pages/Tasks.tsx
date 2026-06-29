import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTasks, Task, TaskCategory, TaskPriority, TaskDifficulty } from '../context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Calendar, Clock, Target, MoreVertical, X, CheckCircle2, Circle, GraduationCap, Code2, User, Activity, Briefcase } from 'lucide-react';
import { cn } from '../lib/utils';

type FilterType = 'All' | 'Today' | 'Upcoming' | 'Completed' | 'High Priority' | TaskCategory;

const FILTERS: FilterType[] = [
  'All', 'Today', 'Upcoming', 'Completed', 'High Priority', 
  'College', 'Coding', 'Personal', 'Health', 'Work'
];

const CATEGORY_ICONS: Record<TaskCategory, any> = {
  College: GraduationCap,
  Coding: Code2,
  Personal: User,
  Health: Activity,
  Work: Briefcase
};

export default function Tasks() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('All');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Search
    if (search) {
      filtered = filtered.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || t.notes?.toLowerCase().includes(search.toLowerCase()));
    }

    // Filter
    if (activeFilter === 'Completed') {
      filtered = filtered.filter(t => t.status === 'completed');
    } else {
      // For all other filters, hide completed unless they specifically search for completed
      filtered = filtered.filter(t => t.status !== 'completed');

      if (activeFilter === 'Today') {
        const today = new Date().toDateString();
        filtered = filtered.filter(t => new Date(t.deadline).toDateString() === today);
      } else if (activeFilter === 'Upcoming') {
        const today = new Date();
        filtered = filtered.filter(t => new Date(t.deadline) > today);
      } else if (activeFilter === 'High Priority') {
        filtered = filtered.filter(t => t.priority === 'high' || t.priority === 'critical');
      } else if (activeFilter !== 'All') {
        filtered = filtered.filter(t => t.category === activeFilter);
      }
    }

    // Sort by priority and deadline
    return filtered.sort((a, b) => {
      const pMap = { critical: 4, high: 3, medium: 2, low: 1 };
      if (pMap[a.priority] !== pMap[b.priority]) return pMap[b.priority] - pMap[a.priority];
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [tasks, search, activeFilter]);

  return (
    <div className="flex flex-col h-full font-sans">
      <header className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
          <p className="text-sm text-white/60 mt-1 font-light">Everything you're working on.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <Input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..." 
              className="pl-9 bg-white/5 border-white/10 h-10 rounded-full focus-visible:ring-1 focus-visible:ring-white/30"
            />
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="rounded-full h-10 px-5 bg-white text-black hover:bg-white/90 font-medium whitespace-nowrap">
            <Plus className="w-4 h-4 mr-2" /> New Task
          </Button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={cn(
              "px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
              activeFilter === f 
                ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.15)]" 
                : "bg-white/[0.03] text-white/60 hover:bg-white/10 border border-white/5"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="flex-1 relative">
        <AnimatePresence mode="wait">
          {filteredTasks.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center mt-12"
            >
              <div className="w-32 h-32 rounded-full border border-dashed border-white/10 flex items-center justify-center mb-6 relative">
                 <div className="absolute inset-0 rounded-full bg-white/[0.01] blur-md" />
                 <Target className="w-10 h-10 text-white/20" />
              </div>
              <h3 className="text-xl font-medium tracking-tight mb-2">Nothing on your plate yet.</h3>
              <p className="text-white/50 text-sm font-light mb-6">Create a new task to get started.</p>
              <Button onClick={() => setIsModalOpen(true)} variant="outline" className="rounded-full border-white/10 bg-white/5 hover:bg-white/10">
                Create First Task
              </Button>
            </motion.div>
          ) : (
            <motion.div key="list" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <TaskModal 
            onClose={() => setIsModalOpen(false)} 
            onSave={(t) => { addTask(t); setIsModalOpen(false); }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TaskCard({ task, onUpdate, onDelete }: { task: Task, onUpdate: any, onDelete: any, key?: string }) {
  const Icon = CATEGORY_ICONS[task.category] || Briefcase;
  const isCompleted = task.status === 'completed';

  const toggleComplete = () => {
    onUpdate(task.id, { status: isCompleted ? 'pending' : 'completed' });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -2 }}
      className={cn(
        "group relative p-5 rounded-2xl border backdrop-blur-md transition-all duration-300",
        isCompleted ? "bg-white/[0.01] border-white/5 opacity-60" : "bg-white/[0.02] border-white/10 shadow-lg shadow-black/20 hover:bg-white/[0.04]"
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <button 
            onClick={toggleComplete}
            className={cn(
              "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
              isCompleted ? "bg-green-500/20 border-green-500 text-green-500" : "border-white/30 hover:border-white/60"
            )}
          >
            {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
          </button>
          <div className="flex items-center gap-2 px-2 py-1 rounded-md bg-white/5 text-xs font-medium text-white/70">
            <Icon className="w-3 h-3" />
            {task.category}
          </div>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onDelete(task.id)} className="p-1.5 rounded-md text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className={cn(
        "text-lg font-medium tracking-tight mb-2 transition-colors",
        isCompleted ? "line-through text-white/50" : "text-white/90"
      )}>
        {task.title}
      </h3>
      
      {task.notes && (
        <p className="text-sm text-white/50 mb-4 line-clamp-2 font-light">
          {task.notes}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3 mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-white/60">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </div>
        <div className="flex items-center gap-1.5 text-xs font-medium text-white/60">
          <Clock className="w-3.5 h-3.5" />
          {task.duration}
        </div>
        
        <div className="flex-1" />
        
        <div className={cn(
          "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
          task.priority === 'critical' ? "bg-red-500/20 text-red-400" :
          task.priority === 'high' ? "bg-amber-500/20 text-amber-400" :
          task.priority === 'medium' ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-white/60"
        )}>
          {task.priority}
        </div>
      </div>
    </motion.div>
  );
}

function TaskModal({ onClose, onSave }: { onClose: () => void, onSave: (t: Omit<Task, 'id' | 'createdAt'>) => void }) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState(new Date().toISOString().split('T')[0]);
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [duration, setDuration] = useState('45 min');
  const [difficulty, setDifficulty] = useState<TaskDifficulty>('medium');
  const [category, setCategory] = useState<TaskCategory>('Work');
  const [isSplit, setIsSplit] = useState(false);
  const [notes, setNotes] = useState('');

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({
      title, deadline, priority, duration, difficulty, category, status: 'pending', isSplit, notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-medium tracking-tight">New Task</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-medium text-white/60">Task Name</label>
            <Input 
              value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?" 
              className="h-12 bg-white/5 border-white/10 text-base rounded-xl"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/60">Deadline</label>
              <Input 
                type="date"
                value={deadline} onChange={(e) => setDeadline(e.target.value)}
                className="h-12 bg-white/5 border-white/10 rounded-xl"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-white/60">Category</label>
              <div className="flex bg-white/5 border border-white/10 rounded-xl h-12 overflow-hidden">
                <select 
                  value={category} 
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full bg-transparent text-sm font-medium px-4 outline-none appearance-none cursor-pointer"
                >
                  {Object.keys(CATEGORY_ICONS).map(c => (
                    <option key={c} value={c} className="bg-[#0a0a0a]">{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/60">Priority</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high', 'critical'] as TaskPriority[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border",
                    priority === p 
                      ? p === 'critical' ? "bg-red-500/20 text-red-400 border-red-500/30" 
                        : p === 'high' ? "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        : p === 'medium' ? "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        : "bg-white/20 text-white border-white/30"
                      : "bg-white/5 text-white/40 border-transparent hover:bg-white/10"
                  )}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/60">Difficulty</label>
            <div className="flex p-1 bg-white/5 border border-white/10 rounded-xl">
              {(['easy', 'medium', 'hard'] as TaskDifficulty[]).map(d => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-xs font-medium capitalize transition-all",
                    difficulty === d ? "bg-white/10 text-white shadow-sm" : "text-white/40 hover:text-white/80"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/60 flex items-center justify-between">
              Estimated Duration
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-white/40">Split task</span>
                <button 
                  onClick={() => setIsSplit(!isSplit)}
                  className={cn(
                    "w-8 h-4 rounded-full transition-colors relative",
                    isSplit ? "bg-white" : "bg-white/20"
                  )}
                >
                  <motion.div 
                    animate={{ x: isSplit ? 16 : 2 }}
                    className={cn(
                      "w-3 h-3 rounded-full absolute top-0.5 shadow-sm",
                      isSplit ? "bg-black" : "bg-white"
                    )}
                  />
                </button>
              </div>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {['15 min', '30 min', '45 min', '60 min', '90 min', '2 hrs'].map(d => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
                    duration === d ? "bg-white/10 border-white/30 text-white" : "bg-white/5 border-transparent text-white/50 hover:bg-white/10 hover:text-white"
                  )}
                >
                  {d}
                </button>
              ))}
            </div>
            <Input 
              value={duration} onChange={(e) => setDuration(e.target.value)}
              placeholder="Custom duration (e.g. 3 hrs)" 
              className="h-10 bg-white/[0.02] border-white/5 rounded-lg text-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-white/60">Notes (Optional)</label>
            <textarea 
              value={notes} onChange={(e) => setNotes(e.target.value)}
              placeholder="Add details, links, or instructions..."
              className="w-full h-24 bg-white/5 border border-white/10 rounded-xl p-3 text-sm focus:outline-none focus:ring-1 focus:ring-white/30 resize-none custom-scrollbar"
            />
          </div>

        </div>

        <div className="p-6 border-t border-white/5 bg-[#050505]">
          <Button 
            onClick={handleSave}
            disabled={!title.trim()}
            className="w-full h-12 rounded-xl bg-white text-black font-medium hover:bg-white/90 disabled:opacity-50 transition-all"
          >
            Create Task
          </Button>
        </div>

      </motion.div>
    </div>
  );
}
