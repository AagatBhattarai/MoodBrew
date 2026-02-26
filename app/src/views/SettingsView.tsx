import React from 'react';
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Moon,
  Sun,
  Globe,
  HelpCircle,
  Info,
  ChevronRight,
  Share2,
  Star,
  FileText,
} from "lucide-react";
import { useStore } from "@/store";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { version } from "../../package.json";

type SettingsItem = {
  icon: React.ElementType;
  label: string;
  type: "toggle" | "select" | "link" | "button" | "info";
  value?: string | boolean;
  action?: () => void;
};

export function SettingsView() {
  const { setView } = useStore();
  const isDarkMode = true; // Hardcoded for now since app is dark themed

  const settingsGroups: { title: string; items: SettingsItem[] }[] = [
    {
      title: "Preferences",
      items: [
        {
          icon: isDarkMode ? Moon : Sun,
          label: "Dark Mode",
          type: "toggle",
          value: isDarkMode,
          action: () => {}, // Theme is currently mood-based
        },
        {
          icon: Globe,
          label: "Language",
          type: "select",
          value: "English",
          action: () => {},
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          type: "link",
          action: () => window.open("https://moodbrew.com/help", "_blank"),
        },
        {
          icon: Share2,
          label: "Share App",
          type: "button",
          action: () => {
            if (navigator.share) {
              navigator.share({ title: "MoodBrew", url: window.location.href });
            }
          },
        },
        {
          icon: Star,
          label: "Rate Us",
          type: "button",
          action: () => {},
        },
      ],
    },
    {
      title: "About",
      items: [
        {
          icon: Info,
          label: "Version",
          type: "info",
          value: version,
        },
        {
          icon: FileText,
          label: "Terms of Service",
          type: "link",
          action: () => {},
        },
      ],
    },
  ];

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
          className="glass-card p-6 md:p-8"
        >
          <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

          <div className="space-y-8">
            {settingsGroups.map((group) => (
              <div key={group.title}>
                <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-3 px-2">
                  {group.title}
                </h2>
                <div className="bg-white/5 rounded-xl overflow-hidden border border-white/5">
                  {group.items.map((item, index) => (
                    <motion.div
                      key={item.label}
                      whileHover={{ backgroundColor: "rgba(255,255,255,0.05)" }}
                      onClick={
                        item.type !== "toggle" && item.type !== "info"
                          ? item.action
                          : undefined
                      }
                      className={`flex items-center justify-between p-4 cursor-pointer ${
                        index !== group.items.length - 1
                          ? "border-b border-white/5"
                          : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-white/5 text-white/80">
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="text-white font-medium">
                          {item.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {item.type === "toggle" && (
                          <Switch checked={item.value as boolean} />
                        )}
                        {item.type === "select" && (
                          <div className="flex items-center gap-2 text-white/50 text-sm">
                            {item.value} <ChevronRight className="w-4 h-4" />
                          </div>
                        )}
                        {item.type === "info" && (
                          <span className="text-white/50 text-sm">
                            {item.value}
                          </span>
                        )}
                        {(item.type === "link" || item.type === "button") && (
                          <ChevronRight className="w-4 h-4 text-white/30" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center text-white/30 text-xs">
            <p>Made with ❤️ in Nepal</p>
            <p className="mt-1">MoodBrew © 2024</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}


