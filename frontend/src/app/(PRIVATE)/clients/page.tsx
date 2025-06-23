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
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Building,
  Users,
  TrendingUp,
  Star,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Dummy data for clients
const clientsData = [
  {
    id: 1,
    name: "Acme Corporation",
    contact: "John Smith",
    email: "john@acme.com",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    status: "Active",
    projects: 3,
    revenue: "$45,000",
    joinDate: "Jan 15, 2024",
    rating: 4.8,
    avatar: "/api/placeholder/40/40",
    industry: "Technology",
    lastContact: "2 days ago",
  },
  {
    id: 2,
    name: "Global Solutions Inc",
    contact: "Sarah Johnson",
    email: "sarah@globalsolutions.com",
    phone: "+1 (555) 987-6543",
    location: "Los Angeles, CA",
    status: "Active",
    projects: 5,
    revenue: "$78,500",
    joinDate: "Mar 22, 2024",
    rating: 4.9,
    avatar: "/api/placeholder/40/40",
    industry: "Consulting",
    lastContact: "1 week ago",
  },
  {
    id: 3,
    name: "Tech Innovators",
    contact: "Mike Wilson",
    email: "mike@techinnovators.com",
    phone: "+1 (555) 456-7890",
    location: "Austin, TX",
    status: "Pending",
    projects: 1,
    revenue: "$12,000",
    joinDate: "Nov 10, 2024",
    rating: 4.5,
    avatar: "/api/placeholder/40/40",
    industry: "Software",
    lastContact: "3 days ago",
  },
  {
    id: 4,
    name: "Creative Agency",
    contact: "Emily Davis",
    email: "emily@creativeagency.com",
    phone: "+1 (555) 321-0987",
    location: "San Francisco, CA",
    status: "Active",
    projects: 7,
    revenue: "$95,200",
    joinDate: "Feb 8, 2024",
    rating: 4.7,
    avatar: "/api/placeholder/40/40",
    industry: "Design",
    lastContact: "5 days ago",
  },
  {
    id: 5,
    name: "Retail Masters",
    contact: "David Brown",
    email: "david@retailmasters.com",
    phone: "+1 (555) 654-3210",
    location: "Chicago, IL",
    status: "Inactive",
    projects: 2,
    revenue: "$23,800",
    joinDate: "Dec 3, 2023",
    rating: 4.2,
    avatar: "/api/placeholder/40/40",
    industry: "Retail",
    lastContact: "2 months ago",
  },
  {
    id: 6,
    name: "Healthcare Plus",
    contact: "Lisa Anderson",
    email: "lisa@healthcareplus.com",
    phone: "+1 (555) 789-0123",
    location: "Miami, FL",
    status: "Active",
    projects: 4,
    revenue: "$67,300",
    joinDate: "May 18, 2024",
    rating: 4.6,
    avatar: "/api/placeholder/40/40",
    industry: "Healthcare",
    lastContact: "1 day ago",
  },
];

const clientStats = [
  { title: "Total Clients", value: "156", change: "+12%", icon: Users },
  { title: "Active Projects", value: "42", change: "+8%", icon: Building },
  {
    title: "Monthly Revenue",
    value: "$125,400",
    change: "+23%",
    icon: TrendingUp,
  },
  { title: "Avg. Rating", value: "4.7", change: "+0.2", icon: Star },
];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");

  const filteredClients = clientsData.filter((client) => {
    const matchesSearch =
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.contact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());

    if (selectedTab === "all") return matchesSearch;
    if (selectedTab === "active")
      return matchesSearch && client.status === "Active";
    if (selectedTab === "pending")
      return matchesSearch && client.status === "Pending";
    if (selectedTab === "inactive")
      return matchesSearch && client.status === "Inactive";

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
              Clients
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Manage your client relationships and track their progress
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {clientStats.map((stat, index) => (
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
                    {stat.change} from last month
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
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </motion.div>

        {/* Clients Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Client Directory</CardTitle>
              <CardDescription>
                A comprehensive list of all your clients and their information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={selectedTab}
                onValueChange={setSelectedTab}
                className="space-y-4"
              >
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all">All Clients</TabsTrigger>
                  <TabsTrigger value="active">Active</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="inactive">Inactive</TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTab} className="space-y-4">
                  <div className="grid gap-4">
                    {filteredClients.map((client, index) => (
                      <motion.div
                        key={client.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="flex items-center justify-between p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage
                              src={client.avatar}
                              alt={client.name}
                            />
                            <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                              {client.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-slate-900 dark:text-slate-100">
                                {client.name}
                              </h3>
                              <Badge
                                className={`text-xs ${getStatusColor(
                                  client.status
                                )}`}
                              >
                                {client.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                              {client.contact} • {client.industry}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {client.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {client.phone}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                {client.location}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-6">
                          <div className="text-right space-y-1">
                            <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                              {client.revenue}
                            </div>
                            <div className="text-xs text-slate-500">
                              {client.projects} projects
                            </div>
                          </div>

                          <div className="text-right space-y-1">
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                                {client.rating}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500">
                              Last: {client.lastContact}
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="w-4 h-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Client
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Mail className="w-4 h-4 mr-2" />
                                Send Email
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete Client
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredClients.length === 0 && (
                    <div className="text-center py-8">
                      <Users className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                      <p className="text-slate-600 dark:text-slate-400">
                        No clients found matching your criteria
                      </p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Recent Client Activity
              </CardTitle>
              <CardDescription>
                Latest interactions and updates with your clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    client: "Acme Corporation",
                    action: "Project milestone completed",
                    time: "2 hours ago",
                    type: "success",
                  },
                  {
                    client: "Global Solutions Inc",
                    action: "New project proposal sent",
                    time: "4 hours ago",
                    type: "info",
                  },
                  {
                    client: "Creative Agency",
                    action: "Payment received",
                    time: "1 day ago",
                    type: "success",
                  },
                  {
                    client: "Healthcare Plus",
                    action: "Meeting scheduled",
                    time: "2 days ago",
                    type: "info",
                  },
                  {
                    client: "Tech Innovators",
                    action: "Contract signed",
                    time: "3 days ago",
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
                            : "bg-blue-500"
                        }`}
                      />
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {activity.client}
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
      </motion.div>
    </div>
  );
};

export default Clients;
