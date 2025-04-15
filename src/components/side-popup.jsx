"use client"

import { X, MapPin, Info, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "./ui/separator"

export default function SidePopup({ isOpen, onClose, location }) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-background shadow-lg z-20 border-l transform transition-transform duration-200 ease-in-out">
            <div className="flex items-center justify-between p-4 border-b">
                <h2 className="text-lg font-semibold">Location Details</h2>
                <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Close</span>
                </Button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100vh-8rem-56px)]">
                {location ? (
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-red-500" />
                                <CardTitle>{location.name}</CardTitle>
                            </div>
                            <CardDescription>
                                Coordinates: {location.coordinates[1].toFixed(4)}, {location.coordinates[0].toFixed(4)}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-video bg-muted rounded-md mb-4 overflow-hidden">
                                <img
                                    src={`/placeholder.svg?height=200&width=400&text=${encodeURIComponent(location.name)}`}
                                    alt={location.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="font-semibold flex items-center gap-2 mb-2">
                                <Info className="h-4 w-4" /> About this location
                            </h3>
                            <p className="text-muted-foreground">{location.description}</p>

                            <Separator className="my-4" />

                            <div className="space-y-2">
                                <h3 className="font-semibold">Additional Information</h3>
                                <ul className="space-y-1 text-sm">
                                    <li>• Best time to visit: Morning</li>
                                    <li>• Estimated visit duration: 2 hours</li>
                                    <li>• Accessibility: Wheelchair accessible</li>
                                </ul>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline">Save Location</Button>
                            <Button className="gap-2">
                                <Navigation className="h-4 w-4" />
                                Directions
                            </Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold">No Location Selected</h3>
                        <p className="text-muted-foreground mt-2">Click on a marker on the map to view location details.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
