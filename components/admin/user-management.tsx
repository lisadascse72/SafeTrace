import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User, Phone, Calendar } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface UserManagementProps {
  users: any[]
}

export function UserManagement({ users }: UserManagementProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {users.slice(0, 15).map((user) => (
              <div key={user.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="font-medium">{user.full_name || "Unknown"}</span>
                  </div>
                  {user.full_name?.toLowerCase().includes("admin") && <Badge variant="secondary">Admin</Badge>}
                </div>

                <div className="space-y-1 text-sm text-gray-600">
                  {user.phone_number && (
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-2" />
                      {user.phone_number}
                    </div>
                  )}

                  <div className="flex items-center">
                    <Calendar className="h-3 w-3 mr-2" />
                    Joined {formatDistanceToNow(new Date(user.created_at), { addSuffix: true })}
                  </div>
                </div>

                {user.emergency_contact_name && (
                  <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                    <span className="text-gray-500">Emergency Contact: </span>
                    <span>{user.emergency_contact_name}</span>
                    {user.emergency_contact_phone && <span> ({user.emergency_contact_phone})</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
