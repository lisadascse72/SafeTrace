import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface AllAlertsProps {
  alerts: any[]
}

export function AllAlerts({ alerts }: AllAlertsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-red-100 text-red-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No alerts found</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {alerts.slice(0, 20).map((alert) => (
              <div key={alert.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(alert.status)}>{alert.status}</Badge>
                    <span className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {formatDistanceToNow(new Date(alert.created_at), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <User className="h-3 w-3 mr-2 text-gray-400" />
                    <span>{alert.profiles?.full_name || "Unknown User"}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-2 text-gray-400" />
                    <span className="font-mono">
                      {alert.latitude.toFixed(4)}, {alert.longitude.toFixed(4)}
                    </span>
                  </div>

                  {alert.message && <p className="text-sm text-gray-700 mt-2">{alert.message}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
