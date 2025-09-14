import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface LocationHistoryProps {
  locationUpdates: any[]
}

export function LocationHistory({ locationUpdates }: LocationHistoryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Location History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {locationUpdates.length === 0 ? (
          <div className="text-center py-8">
            <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No location history</p>
            <p className="text-sm text-gray-400 mt-1">Your location updates will appear here</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {locationUpdates.map((update, index) => (
              <div key={update.id} className="p-3 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    Update #{locationUpdates.length - index}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(update.created_at), { addSuffix: true })}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <MapPin className="h-3 w-3 mr-1 text-red-600" />
                    <span className="font-mono">
                      {update.latitude.toFixed(6)}, {update.longitude.toFixed(6)}
                    </span>
                  </div>

                  {update.accuracy && <p className="text-xs text-gray-500">Accuracy: {Math.round(update.accuracy)}m</p>}

                  {update.sos_alert_id && (
                    <Badge variant="destructive" className="text-xs">
                      Emergency Alert
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
