"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    shopName: "Sleek & Shine",
    email: "contact@sleekandshine.com",
    phone: "+1 (555) 123-4567",
    address: "123 Beauty Lane, Cosmetics City",
    currency: "USD",
    taxRate: 10,
  })

  const handleChange = (field, value) => {
    setSettings((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">Manage your shop configuration and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Shop Information */}
        <Card>
          <CardHeader>
            <CardTitle>Shop Information</CardTitle>
            <CardDescription>Basic details about your store</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Shop Name</label>
              <Input
                value={settings.shopName}
                onChange={(e) => handleChange("shopName", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                value={settings.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <Input value={settings.phone} onChange={(e) => handleChange("phone", e.target.value)} className="mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Address</label>
              <Input
                value={settings.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="mt-1"
              />
            </div>
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>

        {/* Business Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Business Settings</CardTitle>
            <CardDescription>Configure business parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Currency</label>
              <select
                value={settings.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full mt-1 px-3 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Tax Rate (%)</label>
              <Input
                type="number"
                value={settings.taxRate}
                onChange={(e) => handleChange("taxRate", Number.parseFloat(e.target.value))}
                className="mt-1"
              />
            </div>
            <Button className="w-full">Save Changes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
