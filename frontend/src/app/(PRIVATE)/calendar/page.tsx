"use client";

import React from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar as CalendarIcon, Clock, Users, MapPin } from "lucide-react";

const Calendar = () => {
  const upcomingEvents = [
    {
      title: "Team Standup",
      time: "9:00 AM",
      attendees: 8,
      location: "Conference Room A",
    },
    {
      title: "Client Meeting",
      time: "2:00 PM",
      attendees: 4,
      location: "Zoom",
    },
    {
      title: "Project Review",
      time: "4:30 PM",
      attendees: 6,
      location: "Conference Room B",
    },
  ];

  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            Calendar
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Manage your schedule and upcoming events
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Calendar View</CardTitle>
                <CardDescription>
                  Full calendar interface coming soon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-16">
                  <CalendarIcon className="w-24 h-24 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Interactive calendar view is under development
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Today's Events</CardTitle>
                <CardDescription>Your schedule for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 space-y-2"
                    >
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                        {event.title}
                      </h4>
                      <div className="flex items-center gap-4 text-xs text-slate-600 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {event.attendees}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Calendar;
