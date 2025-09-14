"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Play, Square, Share2, Navigation } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface LocationTrackerProps {
  userId: string
}

interface LocationData {
  latitude: number
  longitude: number
  accuracy: number
  timestamp: number
}

export function LocationTracker({ userId }: LocationTrackerProps) {
  const [isTracking, setIsTracking] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null)
  const [locationHistory, setLocationHistory] = useState<LocationData[]>([])
  const [watchId, setWatchId] = useState<number | null>(null)
  const mapRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  const startTracking = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      })
      return
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000,
    }

    const id = navigator.geolocation.watchPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        }

        setCurrentLocation(locationData)
        setLocationHistory((prev) => [...prev.slice(-49), locationData])

        // Save to database
        saveLocationUpdate(locationData)
      },
      (error) => {
        console.error("Geolocation error:", error)
        toast({
          title: "Location Error",
          description: "Unable to get your location. Please check your permissions.",
          variant: "destructive",
        })
        setIsTracking(false)
      },
      options,
    )

    setWatchId(id)
    setIsTracking(true)
    toast({
      title: "Location Tracking Started",
      description: "Your location is now being tracked and updated.",
    })
  }

  const stopTracking = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId)
      setWatchId(null)
    }
    setIsTracking(false)
    toast({
      title: "Location Tracking Stopped",
      description: "Location tracking has been disabled.",
    })
  }

  const saveLocationUpdate = async (location: LocationData) => {
    try {
      await supabase.from("location_updates").insert({
        user_id: userId,
        latitude: location.latitude,
        longitude: location.longitude,
        accuracy: location.accuracy,
      })
    } catch (error) {
      console.error("Error saving location:", error)
    }
  }

  const shareLocation = async () => {
    if (!currentLocation) {
      toast({
        title: "No Location Available",
        description: "Please start location tracking first.",
        variant: "destructive",
      })
      return
    }

    const locationUrl = `https://maps.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Current Location - SafeTrace",
          text: "Here's my current location from SafeTrace",
          url: locationUrl,
        })
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(locationUrl)
        toast({
          title: "Location Copied",
          description: "Location link copied to clipboard.",
        })
      }
    } else {
      await navigator.clipboard.writeText(locationUrl)
      toast({
        title: "Location Copied",
        description: "Location link copied to clipboard.",
      })
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const locationData: LocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        }
        setCurrentLocation(locationData)
        saveLocationUpdate(locationData)
        toast({
          title: "Location Updated",
          description: "Your current location has been captured.",
        })
      },
      (error) => {
        console.error("Geolocation error:", error)
        toast({
          title: "Location Error",
          description: "Unable to get your location.",
          variant: "destructive",
        })
      },
    )
  }

  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [watchId])

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-red-600" />
              Location Tracking
            </CardTitle>
            <Badge variant={isTracking ? "default" : "secondary"} className={isTracking ? "bg-green-600" : ""}>
              {isTracking ? "Active" : "Inactive"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {!isTracking ? (
              <Button onClick={startTracking} className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Start Tracking
              </Button>
            ) : (
              <Button onClick={stopTracking} variant="destructive">
                <Square className="h-4 w-4 mr-2" />
                Stop Tracking
              </Button>
            )}

            <Button onClick={getCurrentLocation} variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              Get Current Location
            </Button>

            <Button onClick={shareLocation} variant="outline" disabled={!currentLocation}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Location
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Current Location Display */}
      {currentLocation && (
        <Card>
          <CardHeader>
            <CardTitle>Current Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Latitude</p>
                <p className="font-mono text-lg">{currentLocation.latitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Longitude</p>
                <p className="font-mono text-lg">{currentLocation.longitude.toFixed(6)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-lg">{Math.round(currentLocation.accuracy)} meters</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Updated</p>
                <p className="text-lg">{new Date(currentLocation.timestamp).toLocaleTimeString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle>Location Map</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            ref={mapRef}
            className="h-96 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300"
          >
            {currentLocation ? (
              <div className="text-center">
                <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
                <p className="text-lg font-semibold text-gray-900">Location Tracked</p>
                <p className="text-sm text-gray-600">
                  {currentLocation.latitude.toFixed(4)}, {currentLocation.longitude.toFixed(4)}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Interactive map integration can be added with Google Maps or Mapbox
                </p>
              </div>
            ) : (
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg text-gray-600">No Location Data</p>
                <p className="text-sm text-gray-500">Start tracking to see your location on the map</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
