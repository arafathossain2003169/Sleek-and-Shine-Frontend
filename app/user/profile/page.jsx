"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Mail, Phone, Calendar, LogOut, Edit2, Save, X, Loader2 } from "lucide-react"
import Link from "next/link"
import { authApi } from "@/lib/api/auth"

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [editMode, setEditMode] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
  })

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/auth/login')
    }
  }, [user, router])

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
      })
    }
  }, [user])

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </Card>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const handleSaveChanges = async () => {
    try {
      setLoading(true)
      setError("")
      setSuccess("")

      const token = localStorage.getItem('token')
      if (!token) {
        setError("No authentication token found. Please log in again.")
        setTimeout(() => {
          logout()
          router.push('/auth/login')
        }, 2000)
        return
      }

      // Validate input
      if (!formData.firstName?.trim() || !formData.lastName?.trim()) {
        setError("First name and last name are required")
        setLoading(false)
        return
      }

      const response = await authApi.updateProfile(token, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phone: formData.phone?.trim() || ""
      })

      if (response.success) {
        // Update user in localStorage
        const updatedUser = {
          ...user,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phone: response.data.phone
        }
        localStorage.setItem('user', JSON.stringify(updatedUser))
        
        // Update form data to reflect saved changes
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phone: response.data.phone || ""
        })
        
        setSuccess("Profile updated successfully!")
        setEditMode(false)
        
        // Auto-clear success message after 3 seconds
        setTimeout(() => {
          setSuccess("")
        }, 3000)
      } else {
        setError(response.message || "Failed to update profile")
      }
    } catch (err) {
      console.error("Error updating profile:", err)
      setError("Failed to update profile. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      phone: user.phone || "",
    })
    setEditMode(false)
    setError("")
    setSuccess("")
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">My Profile</h1>
            {!editMode && (
              <Button
                variant="default"
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profile
              </Button>
            )}
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-lg">
            <p className="text-green-800 dark:text-green-200">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <div className="grid gap-6">
          {/* Profile Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="mb-2">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    disabled={!editMode || loading}
                    required
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    disabled={!editMode || loading}
                    required
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  <Label htmlFor="email">Email Address</Label>
                </div>
                <Input id="email" value={user.email} type="email" readOnly disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4" />
                  <Label htmlFor="phone">Phone Number</Label>
                </div>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="Enter phone number"
                  disabled={!editMode || loading}
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4" />
                  <Label htmlFor="createdAt">Member Since</Label>
                </div>
                <Input 
                  id="createdAt" 
                  value={new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })} 
                  readOnly 
                  disabled 
                  className="bg-muted"
                />
              </div>
            </div>

            {editMode && (
              <div className="flex gap-4 mt-6 pt-6 border-t border-border">
                <Button 
                  onClick={handleSaveChanges} 
                  className="flex-1 flex items-center justify-center gap-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button 
                  onClick={handleCancel} 
                  variant="outline" 
                  className="flex-1"
                  disabled={loading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </Card>

          {/* Account Status */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Account Status</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Account Type</p>
                <p className="text-lg font-semibold capitalize mt-1">{user.role}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <p className="text-lg font-semibold mt-1 text-green-600">Active</p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/user/orders">
                  <Calendar className="w-4 h-4 mr-2" />
                  View My Orders
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href="/user/change-password">
                  <Lock className="w-4 h-4 mr-2" />
                  Change Password
                </Link>
              </Button>
            </div>
          </Card>

          {/* Logout */}
          <Button 
            variant="destructive" 
            className="w-full" 
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  )
}

// Import Lock icon that was missing
import { Lock } from "lucide-react"