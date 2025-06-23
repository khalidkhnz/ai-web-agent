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
import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";

const Analytics = () => {
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
            Analytics
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            Detailed insights and performance metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Page Views",
              value: "125,430",
              icon: BarChart3,
              change: "+12%",
            },
            {
              title: "Conversions",
              value: "3,240",
              icon: TrendingUp,
              change: "+8%",
            },
            {
              title: "Active Users",
              value: "8,910",
              icon: Users,
              change: "+15%",
            },
            {
              title: "Revenue",
              value: "$45,230",
              icon: DollarSign,
              change: "+23%",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-green-600 mt-1">
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
            <CardDescription>
              Comprehensive analytics and reporting coming soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-400" />
              <p className="text-slate-600 dark:text-slate-400">
                Advanced analytics dashboard is under development
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Analytics;
