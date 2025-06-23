"use client";

import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Users,
  UserCheck,
  UserX,
  Shield,
  Crown,
  Eye,
  Edit,
  Trash2,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dummy data for users
const usersData = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@company.com",
    phone: "+1 (555) 123-4567",
    role: "Admin",
    department: "Engineering",
    status: "Active",
    lastLogin: "2 hours ago",
    joinDate: "Jan 15, 2024",
    avatar: "/api/placeholder/40/40",
    location: "San Francisco, CA",
    projects: 8,
    tasksCompleted: 127,
    isOnline: true,
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@company.com",
    phone: "+1 (555) 987-6543",
    role: "Manager",
    department: "Marketing",
    status: "Active",
    lastLogin: "1 day ago",
    joinDate: "Mar 22, 2024",
    avatar: "/api/placeholder/40/40",
    location: "New York, NY",
    projects: 5,
    tasksCompleted: 89,
    isOnline: false,
  },
  {
    id: 3,
    name: "Carol Davis",
    email: "carol.davis@company.com",
    phone: "+1 (555) 456-7890",
    role: "Developer",
    department: "Engineering",
    status: "Active",
    lastLogin: "30 minutes ago",
    joinDate: "Nov 10, 2024",
    avatar: "/api/placeholder/40/40",
    location: "Austin, TX",
    projects: 12,
    tasksCompleted: 203,
    isOnline: true,
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@company.com",
    phone: "+1 (555) 321-0987",
    role: "Designer",
    department: "Design",
    status: "Inactive",
    lastLogin: "1 week ago",
    joinDate: "Feb 8, 2024",
    avatar: "/api/placeholder/40/40",
    location: "Los Angeles, CA",
    projects: 3,
    tasksCompleted: 45,
    isOnline: false,
  },
  {
    id: 5,
    name: "Eva Brown",
    email: "eva.brown@company.com",
    phone: "+1 (555) 654-3210",
    role: "Manager",
    department: "Sales",
    status: "Active",
    lastLogin: "5 hours ago",
    joinDate: "Dec 3, 2023",
    avatar: "/api/placeholder/40/40",
    location: "Chicago, IL",
    projects: 6,
    tasksCompleted: 156,
    isOnline: false,
  },
  {
    id: 6,
    name: "Frank Miller",
    email: "frank.miller@company.com",
    phone: "+1 (555) 789-0123",
    role: "Developer",
    department: "Engineering",
    status: "Pending",
    lastLogin: "Never",
    joinDate: "Dec 1, 2024",
    avatar: "/api/placeholder/40/40",
    location: "Seattle, WA",
    projects: 0,
    tasksCompleted: 0,
    isOnline: false,
  },
];

const userStats = [
  { title: "Total Users", value: "248", change: "+12", icon: Users },
  { title: "Active Users", value: "186", change: "+8", icon: UserCheck },
  { title: "Pending Users", value: "12", change: "+3", icon: Clock },
  { title: "Admin Users", value: "15", change: "+1", icon: Shield },
];

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredUsers = usersData.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedTab === "all") return matchesSearch;
    if (selectedTab === "active")
      return matchesSearch && user.status === "Active";
    if (selectedTab === "pending")
      return matchesSearch && user.status === "Pending";
    if (selectedTab === "inactive")
      return matchesSearch && user.status === "Inactive";

    return matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "Pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "Inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "Admin":
        return Crown;
      case "Manager":
        return Shield;
      default:
        return Users;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "text-purple-600 dark:text-purple-400";
      case "Manager":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-slate-600 dark:text-slate-400";
    }
  };

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
              Users
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage user accounts, roles, and permissions
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {userStats.map((stat, index) => (
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
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {stat.change} this month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Users Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>User Directory</CardTitle>
              <CardDescription>
                Manage all users in your organization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="space-y-4"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Users</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTab} className="space-y-4">
                  <div className="grid gap-4">
                    {filteredUsers.map((user, index) => (
                      <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {user.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-slate-800 rounded-full" />
                            )}
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                {user.name}
                              </h3>
                              <Badge
                                className={`text-xs ${getStatusColor(
                                  user.status
                                )}`}
                              >
                                {user.status}
                              </Badge>
                              {user.isOnline && (
                                <Badge
                                  variant="outline"
                                  className="text-xs bg-green-50 text-green-700 border-green-200"
                                >
                                  Online
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              {React.createElement(getRoleIcon(user.role), {
                                className: `w-3 h-3 ${getRoleColor(user.role)}`,
                              })}
                              <span className="text-sm text-slate-600 dark:text-slate-400">
                                {user.role} • {user.department}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {user.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {user.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {user.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right space-y-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {user.projects} projects
                            </div>
                            <div className="text-xs text-slate-500">
                              {user.tasksCompleted} tasks done
                            </div>
                          </div>

                          <div className="text-right space-y-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              Last login
                            </div>
                            <div className="text-xs text-slate-500">
                              {user.lastLogin}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Switch
                              checked={user.status === "Active"}
                              disabled={user.status === "Pending"}
                            />
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="w-4 h-4 mr-2" />
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Edit className="w-4 h-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Settings className="w-4 h-4 mr-2" />
                                  Permissions
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Mail className="w-4 h-4 mr-2" />
                                  Send Email
                                </DropdownMenuItem>
                                {user.status === "Active" ? (
                                  <DropdownMenuItem className="text-orange-600">
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Deactivate
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem className="text-green-600">
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Activate
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredUsers.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                      <p className="text-slate-600 dark:text-slate-400">
                        No users found matching your criteria
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Activity & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent User Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
                <CardDescription>
                  Latest user actions and system events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      user: "Alice Johnson",
                      action: "Updated project settings",
                      time: "5 minutes ago",
                      type: "update",
                    },
                    {
                      user: "Carol Davis",
                      action: "Completed 3 tasks",
                      time: "15 minutes ago",
                      type: "success",
                    },
                    {
                      user: "Bob Smith",
                      action: "Created new report",
                      time: "1 hour ago",
                      type: "create",
                    },
                    {
                      user: "Eva Brown",
                      action: "Joined team meeting",
                      time: "2 hours ago",
                      type: "info",
                    },
                    {
                      user: "Frank Miller",
                      action: "Account activated",
                      time: "3 hours ago",
                      type: "success",
                    },
                  ].map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            activity.type === "success"
                              ? "bg-green-500"
                              : activity.type === "update"
                              ? "bg-blue-500"
                              : activity.type === "create"
                              ? "bg-purple-500"
                              : "bg-slate-500"
                          }`}
                        />
                        <div>
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {activity.user}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400">
                            {activity.action}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-slate-500">
                        {activity.time}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* User Analytics */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  User Analytics
                </CardTitle>
                <CardDescription>
                  Insights into user engagement and activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        75%
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Active Rate
                      </div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        4.2
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">
                        Avg Projects
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        Engineering
                      </span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "45%" }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        Marketing
                      </span>
                      <span className="font-medium">25%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: "25%" }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        Design
                      </span>
                      <span className="font-medium">20%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: "20%" }}
                      />
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">
                        Sales
                      </span>
                      <span className="font-medium">10%</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: "10%" }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UsersPage;
