import * as React from "react"
import { useGetCart, useRemoveFromCart, useClearCart, getGetCartQueryKey } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { ShoppingCart, Trash2, ArrowRight } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/lib/utils"

export function CartDrawer({ children }: { children: React.ReactNode }) {
  const { data: cart } = useGetCart()
  const removeFromCart = useRemoveFromCart()
  const clearCart = useClearCart()
  const queryClient = useQueryClient()

  const handleRemove = (packageId: number) => {
    removeFromCart.mutate({ packageId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
      }
    })
  }

  const handleClear = () => {
    clearCart.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
      }
    })
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="flex flex-col w-full sm:max-w-md bg-card/95 backdrop-blur-xl border-l-2 border-primary/30">
        <SheetHeader className="border-b border-border/50 pb-4">
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary" />
            Your Cart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {!cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-4">
              <ShoppingCart className="w-12 h-12 opacity-20" />
              <p className="font-sans text-sm">Your cart is as empty as the void.</p>
            </div>
          ) : (
            cart.items.map((item) => (
              <div key={item.packageId} className="flex items-center gap-4 bg-secondary/40 border border-white/5 p-3 rounded-sm shadow-inner relative group">
                <div className="w-12 h-12 bg-black/40 border border-primary/20 rounded-sm flex items-center justify-center shrink-0">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.packageName} className="w-8 h-8 pixelated object-contain" />
                  ) : (
                    <div className="w-6 h-6 bg-primary/40 rounded-sm" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm truncate text-white">{item.packageName}</h4>
                  <p className="text-xs text-primary font-pixel text-lg tracking-wider">
                    {formatCurrency(item.price, item.currency)} <span className="text-muted-foreground text-sm font-sans tracking-normal">x{item.quantity}</span>
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => handleRemove(item.packageId)}
                  disabled={removeFromCart.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        {cart && cart.items.length > 0 && (
          <div className="border-t border-border/50 pt-4 space-y-4 mt-auto">
            <div className="flex items-center justify-between font-display text-lg">
              <span className="text-muted-foreground">Total</span>
              <span className="text-accent">{formatCurrency(cart.total, cart.currency)}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="secondary" onClick={handleClear} disabled={clearCart.isPending}>
                Clear Cart
              </Button>
              <Button variant="accent" className="gap-2 w-full shadow-[4px_4px_0_0_hsl(var(--primary))] border-primary hover:bg-accent hover:text-accent-foreground">
                Checkout <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
