"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authApi } from "@/lib/api/auth"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      // Optionally verify token with backend
      verifyToken(storedToken)
    }
    
    setLoading(false)
  }, [])

  const verifyToken = async (token) => {
    try {
      const response = await authApi.getProfile(token)
      if (response.success) {
        setUser(response.data)
        localStorage.setItem("user", JSON.stringify(response.data))
      } else {
        logout()
      }
    } catch (error) {
      console.error("Token verification failed:", error)
      logout()
    }
  }

  const register = async (userData) => {
    try {
      const response = await authApi.register(userData)
      
      if (response.success) {
        const { user, token } = response.data
        setUser(user)
        setToken(token)
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        return { success: true, data: response.data }
      }
      
      return { success: false, error: response.message }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const login = async (email, password) => {
    try {
      const response = await authApi.login({ email, password })
      
      if (response.success) {
        const { user, token } = response.data
        setUser(user)
        setToken(token)
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(user))
        return { success: true, data: response.data }
      }
      
      return { success: false, error: response.message }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  const updateProfile = async (userData) => {
    try {
      const response = await authApi.updateProfile(token, userData)
      
      if (response.success) {
        setUser(response.data)
        localStorage.setItem("user", JSON.stringify(response.data))
        return { success: true }
      }
      
      return { success: false, error: response.message }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await authApi.changePassword(token, {
        currentPassword,
        newPassword
      })
      
      if (response.success) {
        return { success: true }
      }
      
      return { success: false, error: response.message }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const isAdmin = () => {
    return user?.role === 'admin'
  }

  const isAuthenticated = () => {
    return !!user && !!token
  }

  const value = {
    user,
    token,
    loading,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    isAdmin,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}