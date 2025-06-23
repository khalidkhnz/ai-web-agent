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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  PieChart,
  Calendar,
  Bell,
} from "lucide-react";

// Dummy data for dashboard
const dashboardStats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    trend: "up",
    icon: DollarSign,
    description: "from last month",
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+180.1%",
    trend: "up",
    icon: Users,
    description: "from last month",
  },
  {
    title: "Conversion Rate",
    value: "12.5%",
    change: "-4.3%",
    trend: "down",
    icon: TrendingUp,
    description: "from last month",
  },
  {
    title: "Active Sessions",
    value: "573",
    change: "+201",
    trend: "up",
    icon: Activity,
    description: "from last hour",
  },
];

const recentActivity = [
  {
    id: 1,
    user: "John Doe",
    action: "Created new project",
    time: "2 minutes ago",
    status: "success",
  },
  {
    id: 2,
    user: "Sarah Wilson",
    action: "Updated client profile",
    time: "5 minutes ago",
    status: "info",
  },
  {
    id: 3,
    user: "Mike Johnson",
    action: "Deleted old files",
    time: "10 minutes ago",
    status: "warning",
  },
  {
    id: 4,
    user: "Emily Davis",
    action: "Completed task #247",
    time: "15 minutes ago",
    status: "success",
  },
  {
    id: 5,
    user: "Alex Brown",
    action: "Started new campaign",
    time: "20 minutes ago",
    status: "info",
  },
];

const projectProgress = [
  {
    name: "Website Redesign",
    progress: 75,
    status: "In Progress",
    dueDate: "Dec 15, 2024",
  },
  {
    name: "Mobile App",
    progress: 45,
    status: "In Progress",
    dueDate: "Jan 30, 2025",
  },
  {
    name: "API Integration",
    progress: 90,
    status: "Almost Done",
    dueDate: "Dec 5, 2024",
  },
  {
    name: "Database Migration",
    progress: 30,
    status: "Planning",
    dueDate: "Feb 15, 2025",
  },
];

const Dashboard = () => {
  return (
    <div className="p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Dashboard
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Welcome back! Here's what's happening with your projects.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Calendar className="w-4 h-4 mr-2" />
              This Month
            </Button>
            <Button size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dashboardStats.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {stat.value}
                  </div>
                  <div className="flex items-center text-xs text-slate-600 dark:text-slate-400 mt-1">
                    {stat.trend === "up" ? (
                      <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span
                      className={
                        stat.trend === "up" ? "text-green-500" : "text-red-500"
                      }
                    >
                      {stat.change}
                    </span>
                    <span className="ml-1">{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest updates from your team and projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={activity.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
                          {activity.user
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {activity.user}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {activity.action}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            activity.status === "success"
                              ? "default"
                              : activity.status === "warning"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {activity.status}
                        </Badge>
                        <span className="text-xs text-slate-500">
                          {activity.time}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Project Progress */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Project Progress
                </CardTitle>
                <CardDescription>
                  Current status of ongoing projects
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectProgress.map((project, index) => (
                    <motion.div
                      key={project.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {project.name}
                        </h4>
                        <Badge variant="outline" className="text-xs">
                          {project.status}
                        </Badge>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                      <div className="flex justify-between text-xs text-slate-600 dark:text-slate-400">
                        <span>{project.progress}% complete</span>
                        <span>Due: {project.dueDate}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Analytics Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="reports">Reports</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                  <CardDescription>
                    Your performance summary for this month
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <PieChart className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                      <div className="text-2xl font-bold text-blue-600">
                        85%
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Task Completion
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <TrendingUp className="w-8 h-8 mx-auto mb-2 text-green-600" />
                      <div className="text-2xl font-bold text-green-600">
                        12.3%
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Growth Rate
                      </div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                      <div className="text-2xl font-bold text-purple-600">
                        1,234
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Active Users
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                  <CardDescription>
                    Detailed analytics and insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Analytics dashboard would be displayed here with charts
                      and graphs.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardHeader>
                  <CardTitle>Reports</CardTitle>
                  <CardDescription>Generate and view reports</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <PieChart className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Reports section would contain downloadable reports and
                      data exports.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
