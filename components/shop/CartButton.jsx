import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function CartButton({ count, onClick }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} className="relative">
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </Button>
  )
}
