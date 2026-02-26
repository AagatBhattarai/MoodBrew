import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";

interface PlaceholderViewProps {
  title: string;
}

export function PlaceholderView({ title }: PlaceholderViewProps) {
  const { setView } = useStore();

  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          className="text-white/60 hover:text-white hover:bg-white/10 mb-6 pl-0"
          onClick={() => setView("profile")}
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back to Profile
        </Button>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 text-center"
        >
          <h1 className="text-2xl font-bold text-white mb-4">{title}</h1>
          <p className="text-white/60">This feature is coming soon!</p>
        </motion.div>
      </div>
    </div>
  );
}
