import { motion } from 'framer-motion';
import { Card } from './ui/card';

export const Terminal = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="w-full max-w-xl mx-auto my-12"
    >
      <Card className="overflow-hidden bg-[#050505] border-[#222] shadow-[0_0_50px_rgba(37,99,235,0.05)]">
        <div className="flex items-center px-4 py-3 border-b border-[#222] bg-[#0a0a0a]">
          <div className="flex gap-2 mr-4">
            <div className="w-2.5 h-2.5 rounded-full bg-[#333] hover:bg-red-500 transition-colors" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#333] hover:bg-yellow-500 transition-colors" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#333] hover:bg-green-500 transition-colors" />
          </div>
          <div className="text-[#666] text-xs font-mono tracking-wider flex-grow text-center pr-10">~ / joshiminh / profile</div>
        </div>
        <div className="p-6 font-mono text-sm leading-relaxed">
          <div className="flex items-center text-[#ddd]">
            <span className="text-accent mr-3 font-bold">❯</span>
            <span className="typing-animation text-[#fff]">cat profile.json</span>
          </div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-4 space-y-2 pl-5 border-l border-[#222]"
          >
            <p className="text-[#888]"><span className="text-accent/80">"name"</span><span className="text-[#666]">:</span> <span className="text-[#ddd]">"Joshi Minh"</span>,</p>
            <p className="text-[#888]"><span className="text-accent/80">"role"</span><span className="text-[#666]">:</span> <span className="text-[#ddd]">"AI Engineer & Full-Stack Builder"</span>,</p>
            <p className="text-[#888]"><span className="text-accent/80">"mission"</span><span className="text-[#666]">:</span> <span className="text-[#ddd]">"Building intelligent, beautiful web experiences."</span></p>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );
};
