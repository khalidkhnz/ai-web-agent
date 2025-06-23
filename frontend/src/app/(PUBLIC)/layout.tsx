"use client";

import React, { useState } from "react";
import { Chatbot } from "@/components/chatbot";
import { ChatbotButton } from "@/components/chatbot-button";

const PublicLayout = ({ children }: { children: React.ReactNode }) => {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
  };

  return (
    <div className="relative">
      {children}

      {/* Chatbot Button */}
      <ChatbotButton onClick={toggleChatbot} isOpen={isChatbotOpen} />

      {/* Chatbot */}
      <Chatbot isOpen={isChatbotOpen} onToggle={toggleChatbot} />
    </div>
  );
};

export default PublicLayout;
