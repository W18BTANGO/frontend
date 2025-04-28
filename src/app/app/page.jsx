"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { BarChart3, Map, Settings, Home, LogOut, Menu, X, House } from "lucide-react"
import Dashboard from "@/components/Dashboard"

export default function AppPage() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div
                className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform 
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 transition-transform duration-300 ease-in-out md:static md:z-0
      `}
            >
                <div className="flex items-center justify-between h-16 px-4 border-b">
                    <Link href="/">
                        <div className="flex items-center gap-2">
                            <House className="h-6 w-6 text-green-600" />
                            <span className="font-bold text-xl">Haven</span>
                        </div>
                        <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
                            <X className="h-6 w-6" />
                        </button>
                    </Link>
                </div>

                <nav className="px-2 py-4">
                    <ul className="space-y-1">
                        <li>
                            <Link href="/app" className="flex items-center px-4 py-2 text-gray-700 rounded-md bg-gray-100">
                                <Home className="h-5 w-5 mr-3" />
                                Dashboard
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/app/settings"
                                className="flex items-center px-4 py-2 text-gray-600 rounded-md hover:bg-gray-100"
                            >
                                <Settings className="h-5 w-5 mr-3" />
                                Settings
                            </Link>
                        </li>
                    </ul>
                </nav>

            </div>

            {/* Main content */}
            <Dashboard />

        </div>
    )
}
