import { motion } from 'framer-motion';

export const Terminal = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="glass-card rounded-lg overflow-hidden w-full max-w-md mx-auto my-8 font-mono text-sm"
    >
      <div className="flex items-center px-4 py-2 bg-zinc-900/80 border-b border-zinc-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="mx-auto text-zinc-500 text-xs">guest@joshiminh:~</div>
      </div>
      <div className="p-4 bg-zinc-950">
        <div className="flex items-center text-zinc-300">
          <span className="text-blue-400 mr-2">❯</span>
          <span className="typing-animation">whoami</span>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-2 text-zinc-400 space-y-1"
        >
          <p>Name: Joshi Minh</p>
          <p>Role: AI Engineer & Full-Stack Builder</p>
          <p>Mission: Building intelligent, beautiful web experiences.</p>
        </motion.div>
      </div>
    </motion.div>
  );
};
