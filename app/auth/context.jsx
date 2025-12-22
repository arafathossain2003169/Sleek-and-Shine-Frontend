"use client"

import { createContext, useContext, useState, useEffect } from "react"

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
  }, [])

  const register = (userData) => {
    const storedUsers = localStorage.getItem("users")
    const users = storedUsers ? JSON.parse(storedUsers) : []

    const newUser = {
      id: Date.now(),
      role: "customer",
      ...userData,
      createdAt: new Date().toISOString(),
      orders: [],
    }

    users.push(newUser)
    localStorage.setItem("users", JSON.stringify(users))
    localStorage.setItem("currentUser", JSON.stringify(newUser))
    setUser(newUser)
    return newUser
  }

  const login = (email, password) => {
    const storedUsers = localStorage.getItem("users")
    const users = storedUsers ? JSON.parse(storedUsers) : []

    const user = users.find((u) => u.email === email && u.password === password)
    if (user) {
      setUser(user)
      localStorage.setItem("currentUser", JSON.stringify(user))
      return user
    }
    return null
  }

  const logout = () => {
    localStorage.removeItem("currentUser")
    setUser(null)
  }

  const updateUser = (updatedData) => {
    if (user) {
      const updatedUser = {
        ...user,
        ...updatedData,
      }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      const storedUsers = localStorage.getItem("users")
      const users = storedUsers ? JSON.parse(storedUsers) : []
      const userIndex = users.findIndex((u) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem("users", JSON.stringify(users))
      }

      setUser(updatedUser)
    }
  }

  const addOrder = (order) => {
    if (user) {
      const updatedUser = {
        ...user,
        orders: [...(user.orders || []), order],
      }
      localStorage.setItem("currentUser", JSON.stringify(updatedUser))

      const storedUsers = localStorage.getItem("users")
      const users = storedUsers ? JSON.parse(storedUsers) : []
      const userIndex = users.findIndex((u) => u.id === user.id)
      if (userIndex !== -1) {
        users[userIndex] = updatedUser
        localStorage.setItem("users", JSON.stringify(users))
      }

      setUser(updatedUser)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, register, login, logout, updateUser, addOrder }}>
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
