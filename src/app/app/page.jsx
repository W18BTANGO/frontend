"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    Undo,
    LayoutDashboard,
    Home,
    X,
    ChevronLeft,
    ChevronRight,
} from "lucide-react"
import { useTheme } from "next-themes"
import Dashboard from "@/components/Dashboard"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { useMediaQuery } from "@/hooks/use-mobile"


export default function AppPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [collapsed, setCollapsed] = useState(false)
    const [activeTab, setActiveTab] = useState("dashboard")
    const isMobile = useMediaQuery("(max-width: 768px)")

    // Reset sidebar state when screen size changes
    useEffect(() => {
        if (isMobile) {
            setCollapsed(false)
        }
    }, [isMobile])

    // Store collapsed state in localStorage
    useEffect(() => {
        if (!isMobile) {
            localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed))
        }
    }, [collapsed, isMobile])

    // Get collapsed state from localStorage on initial load
    useEffect(() => {
        if (!isMobile) {
            const savedState = localStorage.getItem("sidebarCollapsed")
            if (savedState) {
                setCollapsed(JSON.parse(savedState))
            }
        }
    }, [isMobile])

    const toggleCollapse = () => {
        setCollapsed(!collapsed)
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={cn(
                    "fixed inset-y-0 left-0 z-50 bg-white dark:bg-gray-800 shadow-right-only transform transition-all duration-300 ease-in-out",
                    collapsed ? "w-[70px]" : "w-64",
                    isMobile ? (sidebarOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0",
                    "md:relative md:z-0",
                )}
            >
                {/* Sidebar Header */}
                <div className="flex items-center justify-between h-16 px-4 border-b dark:border-gray-700">
                    {!collapsed && (
                        <Link href="/">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <Home className="h-6 w-6 flex-shrink-0 text-green-600 dark:text-green-500" />
                                <span className="font-bold text-xl truncate transition-opacity duration-300 dark:text-white">Haven</span>
                            </div>
                        </Link>
                    )}
                    {collapsed && (
                        <Link href="/">
                            <div className="flex justify-center w-full">
                                <Home className="h-6 w-6 text-green-600 dark:text-green-500" />
                            </div>
                        </Link>
                    )}
                    <div className="flex items-center">
                        {!isMobile && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={toggleCollapse}
                                className="hidden md:flex"
                                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                            >
                                {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                            </Button>
                        )}
                        {isMobile && (
                            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="md:hidden">
                                <X className="h-6 w-6 dark:text-gray-300" />
                            </Button>
                        )}
                    </div>
                </div>

                {/* Sidebar Navigation */}
                <nav className="px-2 py-4">
                    <ul className="space-y-1">
                        <TooltipProvider delayDuration={0}>
                            <li>
                                {collapsed ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href="#"
                                                className={cn(
                                                    "flex items-center justify-center h-10 w-10 rounded-md mx-auto",
                                                    activeTab === "dashboard"
                                                        ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white"
                                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                                                )}
                                                onClick={() => setActiveTab("dashboard")}
                                            >
                                                <LayoutDashboard className="h-5 w-5" />
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">Dashboard</TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <Link
                                        href="#"
                                        className={cn(
                                            "flex items-center px-4 py-2 rounded-md",
                                            activeTab === "dashboard"
                                                ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                                        )}
                                        onClick={() => setActiveTab("dashboard")}
                                    >
                                        <LayoutDashboard className="h-5 w-5 mr-3" />
                                        <span className="transition-opacity duration-200">Dashboard</span>
                                    </Link>
                                )}
                            </li>
                            <li>
                                {collapsed ? (
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Link
                                                href="/"
                                                className={cn(
                                                    "flex items-center justify-center h-10 w-10 rounded-md mx-auto",
                                                    activeTab === "landing"
                                                        ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white"
                                                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                                                )}
                                                onClick={() => setActiveTab("landing")}
                                            >
                                                <Undo className="h-5 w-5" />
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right">Landing Page</TooltipContent>
                                    </Tooltip>
                                ) : (
                                    <Link
                                        href="/"
                                        className={cn(
                                            "flex items-center px-4 py-2 rounded-md",
                                            activeTab === "landing"
                                                ? "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white"
                                                : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700",
                                        )}
                                        onClick={() => setActiveTab("landing")}
                                    >
                                        <Undo className="h-5 w-5 mr-3" />
                                        <span className="transition-opacity duration-200">Landing Page</span>
                                    </Link>
                                )}
                            </li>




                        </TooltipProvider>
                    </ul>
                </nav>
            </div>
            {/* Main content */}
            {<Dashboard />}


        </div>
    )
}
