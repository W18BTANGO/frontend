"use client"

import { Button } from "@/components/ui/button"
import { Menu, Map, Bell, User } from "lucide-react"

export default function Header({ toggleSidePopup }) {
    return (
        <header className="border-b bg-background sticky top-0 z-10">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={toggleSidePopup}>
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                    <div className="flex items-center gap-2">
                        <Map className="h-6 w-6" />
                        <h1 className="text-xl font-bold">Safe Haven</h1>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                        <Bell className="h-5 w-5" />
                        <span className="sr-only">Notifications</span>
                    </Button>
                    <Button variant="ghost" size="icon">
                        <User className="h-5 w-5" />
                        <span className="sr-only">User profile</span>
                    </Button>
                </div>
            </div>
        </header>
    )
}
