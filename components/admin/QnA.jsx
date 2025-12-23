"use client"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { qnaApi } from "@/lib/api/qna"

export default function QnA({ product, setProduct }) {
  const handleDelete = async (id) => {
    try {
      await qnaApi.delete(id)
      setProduct(prev => ({
        ...prev,
        qna: prev.qna.filter(q => q.id !== id)
      }))
    } catch (err) {
      console.error("Failed to delete Q&A", err)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Q&A</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {product.qna?.map(q => (
          <div key={q.id} className="flex justify-between border p-3 rounded">
            <div>
              <p className="font-medium">Q: {q.question}</p>
              <p className="text-muted-foreground">A: {q.answer}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => handleDelete(q.id)}>
              <Trash2 className="w-4 h-4 text-destructive" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
