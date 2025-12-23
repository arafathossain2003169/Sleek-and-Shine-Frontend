"use client"

import { useState } from "react"
import { Upload, X } from "lucide-react"
import { uploadApi } from "@/lib/api/upload"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Images({ images, setImages }) {
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files)
    if (!files.length) return

    try {
      setUploading(true)
      const res = await uploadApi.uploadImages(files)
      const urls = res.data?.urls || []
      setImages(prev => [...prev, ...urls])
    } catch (err) {
      console.error("Image upload failed", err)
      alert("Image upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (idx) => {
    setImages(prev => prev.filter((_, i) => i !== idx))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <label className="flex items-center justify-center w-full h-48 bg-muted rounded-lg border-2 border-dashed cursor-pointer hover:bg-muted/80 transition-colors">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            disabled={uploading}
          />
          <div className="text-center">
            <Upload className={`w-8 h-8 mx-auto mb-2 ${uploading ? 'animate-pulse' : ''} text-muted-foreground`} />
            <p className="text-sm text-muted-foreground">{uploading ? "Uploading..." : "Click to upload images"}</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
          </div>
        </label>

        {images.length > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-full aspect-square rounded border bg-muted group">
                <img src={img.url || "/placeholder.svg"} alt={`Product ${idx + 1}`} className="w-full h-full object-cover rounded" />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(idx)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
                {idx === 0 && <div className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">Primary</div>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center">No images uploaded yet</p>
        )}
      </CardContent>
    </Card>
  )
}
