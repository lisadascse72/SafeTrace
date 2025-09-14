"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, User, Clock, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"

interface ActiveAlertsProps {
  alerts: any[]
}

export function ActiveAlerts({ alerts: initialAlerts }: ActiveAlertsProps) {
  const [alerts, setAlerts] = useState(initialAlerts)
  const [loadingAlerts, setLoadingAlerts] = useState<Set<string>>(new Set())
  const supabase = createClient()

  const resolveAlert = async (alertId: string) => {
    setLoadingAlerts((prev) => new Set(prev).add(alertId))

    try {
      const { error } = await supabase
        .from("sos_alerts")
        .update({
          status: "resolved",
          resolved_at: new Date().toISOString(),
        })
        .eq("id", alertId)

      if (error) throw error

      setAlerts((prev) => prev.filter((alert) => alert.id !== alertId))
      toast({
        title: "Alert Resolved",
        description: "The emergency alert has been marked as resolved.",
      })
    } catch (error) {
      console.error("Error resolving alert:", error)
      toast({
        title: "Error",
        description: "Failed to resolve alert.",
        variant: "destructive",
      })
    } finally {
      setLoadingAlerts((prev) => {
        const newSet = new Set(prev)
        newSet.delete(alertId)
        return newSet
      })
    }
  }

  const openLocation = (latitude: number, longitude: number) => {
    const url = `https://maps.google.com/maps?q=${latitude},${longitude}`
    window.open(url, "_blank")
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
        <p className="text-green-800 font-medium">No Active Alerts</p>
        <p className="text-green-600 text-sm">All emergency situations are resolved</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {alerts.map((alert) => (
        <Card key={alert.id} className="border-red-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Badge variant="destructive">EMERGENCY</Badge>
                <span className="text-sm text-gray-600 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                </span>
              </div>
              <Button
                onClick={() => resolveAlert(alert.id)}
                disabled={loadingAlerts.has(alert.id)}
                className="bg-green-600 hover:bg-green-700"
                size="sm"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                {loadingAlerts.has(alert.id) ? "Resolving..." : "Resolve"}
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  User Information
                </h3>
                <p className="text-sm text-gray-600">Name: {alert.profiles?.full_name || "Unknown"}</p>
                <p className="text-sm text-gray-600 flex items-center mt-1">
                  <Phone className="h-3 w-3 mr-1" />
                  {alert.profiles?.phone_number || "No phone"}
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  Location
                </h3>
                <p className="text-sm text-gray-600 font-mono">
                  {alert.latitude.toFixed(6)}, {alert.longitude.toFixed(6)}
                </p>
                <Button
                  onClick={() => openLocation(alert.latitude, alert.longitude)}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  <MapPin className="h-3 w-3 mr-1" />
                  View on Map
                </Button>
              </div>
            </div>

            {alert.message && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{alert.message}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
