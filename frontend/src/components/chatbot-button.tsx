"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Sparkles } from "lucide-react";

interface ChatbotButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

export function ChatbotButton({ onClick, isOpen }: ChatbotButtonProps) {
  if (isOpen) return null;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "spring",
        damping: 15,
        stiffness: 300,
        delay: 1,
      }}
      className="fixed bottom-6 right-6 z-40"
    >
      <div className="relative group">
        {/* Pulsing ring effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur opacity-30 group-hover:opacity-50 animate-pulse" />

        {/* Main button */}
        <Button
          onClick={onClick}
          size="lg"
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 border-0 group"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center justify-center"
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </motion.div>
        </Button>

        {/* Notification badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute -top-2 -right-2"
        >
          <Badge className="bg-red-500 text-white border-2 border-white text-xs px-1.5 py-0.5 rounded-full">
            AI
          </Badge>
        </motion.div>

        {/* Tooltip */}
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          whileHover={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2 }}
          className="absolute right-full mr-3 top-1/2 -translate-y-1/2 pointer-events-none"
        >
          <div className="bg-slate-900 dark:bg-slate-700 text-white text-sm px-3 py-2 rounded-lg shadow-lg whitespace-nowrap">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Ask AI Assistant
            </div>
            <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-900 dark:border-l-slate-700" />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
