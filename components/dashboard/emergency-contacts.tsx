"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Phone, Trash2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "@/hooks/use-toast"

interface EmergencyContactsProps {
  contacts: any[]
  userId: string
}

export function EmergencyContacts({ contacts: initialContacts, userId }: EmergencyContactsProps) {
  const [contacts, setContacts] = useState(initialContacts)
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    phone_number: "",
    relationship: "",
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase
        .from("emergency_contacts")
        .insert({
          user_id: userId,
          name: formData.name,
          phone_number: formData.phone_number,
          relationship: formData.relationship,
          priority: contacts.length + 1,
        })
        .select()
        .single()

      if (error) throw error

      setContacts([...contacts, data])
      setFormData({ name: "", phone_number: "", relationship: "" })
      setIsOpen(false)
      toast({
        title: "Contact Added",
        description: "Emergency contact has been added successfully.",
      })
    } catch (error) {
      console.error("Error adding contact:", error)
      toast({
        title: "Error",
        description: "Failed to add emergency contact.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (contactId: string) => {
    try {
      const { error } = await supabase.from("emergency_contacts").delete().eq("id", contactId)

      if (error) throw error

      setContacts(contacts.filter((contact) => contact.id !== contactId))
      toast({
        title: "Contact Removed",
        description: "Emergency contact has been removed.",
      })
    } catch (error) {
      console.error("Error deleting contact:", error)
      toast({
        title: "Error",
        description: "Failed to remove emergency contact.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Emergency Contacts</CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Emergency Contact</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone_number}
                    onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="relationship">Relationship</Label>
                  <Input
                    id="relationship"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                    placeholder="e.g., Spouse, Parent, Friend"
                  />
                </div>
                <Button type="submit" className="w-full bg-red-600 hover:bg-red-700" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Contact"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {contacts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No emergency contacts</p>
            <p className="text-sm text-gray-400 mt-1">Add contacts to notify in emergencies</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{contact.name}</p>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Phone className="h-3 w-3 mr-1" />
                    {contact.phone_number}
                  </div>
                  {contact.relationship && <p className="text-xs text-gray-500 mt-1">{contact.relationship}</p>}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(contact.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
