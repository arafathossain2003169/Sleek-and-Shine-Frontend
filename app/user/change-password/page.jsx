"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Lock, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { authApi } from "@/lib/api/auth"

export default function ChangePasswordPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">Please sign in to change your password</p>
          <Button asChild className="w-full">
            <Link href="/auth/login">Sign In</Link>
          </Button>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError("")
      setSuccess(false)

      // Validate input
      if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
        setError("All fields are required")
        return
      }

      if (formData.newPassword.length < 6) {
        setError("New password must be at least 6 characters long")
        return
      }

      if (formData.newPassword !== formData.confirmPassword) {
        setError("New passwords do not match")
        return
      }

      if (formData.currentPassword === formData.newPassword) {
        setError("New password must be different from current password")
        return
      }

      const token = localStorage.getItem('token')
      if (!token) {
        setError("No authentication token found")
        router.push('/auth/login')
        return
      }

      const response = await authApi.changePassword(token, {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      })

      if (response.success) {
        setSuccess(true)
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: ""
        })
        
        // Redirect to profile after 2 seconds
        setTimeout(() => {
          router.push('/user/profile')
        }, 2000)
      } else {
        setError(response.message || "Failed to change password")
      }
    } catch (err) {
      console.error("Error changing password:", err)
      setError("Failed to change password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({
      ...prev,
      [id]: value
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Password Changed!</h1>
          <p className="text-muted-foreground mb-6">
            Your password has been successfully updated. Redirecting to profile...
          </p>
          <Loader2 className="w-6 h-6 animate-spin mx-auto" />
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/user/profile" className="text-primary hover:underline mb-4 inline-block">
            ← Back to Profile
          </Link>
          <h1 className="text-3xl font-bold">Change Password</h1>
          <p className="text-muted-foreground mt-2">
            Update your password to keep your account secure
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Current Password */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                <Label htmlFor="currentPassword">Current Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter current password"
                  disabled={loading}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                <Label htmlFor="newPassword">New Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password"
                  disabled={loading}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Must be at least 6 characters long
              </p>
            </div>

            {/* Confirm New Password */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4" />
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
              </div>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                  disabled={loading}
                  required
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Changing Password...
                  </>
                ) : (
                  "Change Password"
                )}
              </Button>
            </div>
          </form>

          {/* Security Tips */}
          <div className="mt-6 pt-6 border-t border-border">
            <h3 className="text-sm font-semibold mb-2">Password Security Tips</h3>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Use a mix of letters, numbers, and symbols</li>
              <li>• Avoid using personal information</li>
              <li>• Don't reuse passwords from other accounts</li>
              <li>• Change your password regularly</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  )
}