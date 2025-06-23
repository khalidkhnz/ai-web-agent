"use client";

import React, { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Chatbot } from "@/components/chatbot";
import { ChatbotButton } from "@/components/chatbot-button";

const PrivateLayout = ({ children }: { children: React.ReactNode }) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Sidebar */}
      <AppSidebar isCollapsed={isSidebarCollapsed} onToggle={toggleSidebar} />

      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <div className="h-full overflow-auto">{children}</div>
      </main>

      {/* Chatbot Button */}
      <ChatbotButton onClick={toggleChatbot} isOpen={isChatbotOpen} />

      {/* Chatbot */}
      <Chatbot isOpen={isChatbotOpen} onToggle={toggleChatbot} />
    </div>
  );
};

export default PrivateLayout;
