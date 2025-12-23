"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, X } from "lucide-react"

export default function Attributes({ attributes, setAttributes }) {
  const [showAddAttribute, setShowAddAttribute] = useState(false)
  const [newAttribute, setNewAttribute] = useState({ name: "", value: "" })
  const [editingAttributeId, setEditingAttributeId] = useState(null)

  const handleAddAttribute = () => {
    if (!newAttribute.name || !newAttribute.value) return alert("Enter name & value")
    setAttributes(prev => [...prev, { id: Date.now(), ...newAttribute }])
    setNewAttribute({ name: "", value: "" })
    setShowAddAttribute(false)
  }

  const handleUpdateAttribute = (id, name, value) => {
    setAttributes(prev => prev.map(attr => attr.id === id ? { ...attr, name, value } : attr))
  }

  const handleDeleteAttribute = (id) => {
    setAttributes(prev => prev.filter(attr => attr.id !== id))
    setEditingAttributeId(null)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Custom Attributes</CardTitle>
          <Button type="button" size="sm" onClick={() => setShowAddAttribute(!showAddAttribute)}>
            <Plus className="w-4 h-4 mr-2" /> Add Attribute
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddAttribute && (
          <div className="p-4 border border-border rounded-lg bg-muted/50 space-y-3">
            <div>
              <label className="text-sm font-medium">Attribute Name</label>
              <Input
                value={newAttribute.name}
                onChange={e => setNewAttribute(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Attribute Value</label>
              <Input
                value={newAttribute.value}
                onChange={e => setNewAttribute(prev => ({ ...prev, value: e.target.value }))}
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="flex-1" onClick={handleAddAttribute}>Add</Button>
              <Button size="sm" variant="outline" className="flex-1" onClick={() => {
                setShowAddAttribute(false)
                setNewAttribute({ name: "", value: "" })
              }}>Cancel</Button>
            </div>
          </div>
        )}

        {attributes.length > 0 ? attributes.map(attr => (
          <div key={attr.id} className="p-3 border border-border rounded-lg flex items-center gap-3">
            {editingAttributeId === attr.id ? (
              <>
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <Input value={attr.name} onChange={e => handleUpdateAttribute(attr.id, e.target.value, attr.value)} />
                  <Input value={attr.value} onChange={e => handleUpdateAttribute(attr.id, attr.name, e.target.value)} />
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditingAttributeId(null)}>Done</Button>
              </>
            ) : (
              <>
                <div className="flex-1">
                  <p className="font-medium text-sm">{attr.name}</p>
                  <p className="text-sm text-muted-foreground">{attr.value}</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => setEditingAttributeId(attr.id)}>Edit</Button>
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleDeleteAttribute(attr.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        )) : !showAddAttribute && (
          
          <p className="text-sm text-muted-foreground text-center py-4">
            No attributes added yet. Click "Add Attribute" to get started.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
