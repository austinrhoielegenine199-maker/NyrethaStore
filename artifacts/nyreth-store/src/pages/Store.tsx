import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useListPackages, useListCategories, useAddToCart, getGetCartQueryKey } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { ShoppingCart, Tag, Filter, Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, cn } from "@/lib/utils"

export default function Store() {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null)
  const { data: categories } = useListCategories()
  
  // Use enabled correctly by checking conditions if needed. Here we list all or filter by category.
  const { data: packages, isLoading } = useListPackages(
    selectedCategory ? { category: selectedCategory } : undefined
  )
  
  const addToCart = useAddToCart()
  const queryClient = useQueryClient()

  const handleAddToCart = (packageId: number) => {
    addToCart.mutate(
      { data: { packageId, quantity: 1 } },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() })
        }
      }
    )
  }

  // Sort featured packages first
  const sortedPackages = React.useMemo(() => {
    if (!packages) return []
    return [...packages].sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return 0
    })
  }, [packages])

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-border/50 pb-6">
        <div>
          <h2 className="font-display text-2xl text-white mb-2">Store Packages</h2>
          <p className="text-muted-foreground text-sm font-sans max-w-xl">
            Browse our selection of ranks, keys, and cosmetics. Support the server and gain exclusive perks.
          </p>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={selectedCategory === null ? "default" : "secondary"}
          onClick={() => setSelectedCategory(null)}
          className="rounded-sm"
        >
          All Packages
        </Button>
        {categories?.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.slug ? "default" : "secondary"}
            onClick={() => setSelectedCategory(cat.slug)}
            className="rounded-sm"
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={`skeleton-${i}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mc-panel h-[340px] animate-pulse bg-secondary/50 border-border"
              />
            ))
          ) : sortedPackages.length === 0 ? (
            <div className="col-span-full py-12 text-center text-muted-foreground mc-panel bg-secondary/20">
              <PackagePlaceholder className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="font-display text-lg">No packages found in this category.</p>
            </div>
          ) : (
            sortedPackages.map((pkg, i) => (
              <motion.div
                key={pkg.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Card className={cn(
                  "h-full flex flex-col relative overflow-hidden group",
                  pkg.featured ? "border-accent shadow-[0_0_15px_-3px_hsl(var(--accent)/0.3)]" : ""
                )}>
                  {/* Decorative corner block */}
                  <div className="absolute top-0 right-0 w-8 h-8 bg-black/20 border-l border-b border-white/5 z-10" />

                  {pkg.featured && (
                    <div className="absolute top-3 left-3 z-10 flex gap-2">
                      <Badge variant="accent" className="shadow-lg"><Star className="w-3 h-3 mr-1" /> Featured</Badge>
                    </div>
                  )}

                  {pkg.salePricePercent && pkg.salePricePercent > 0 && (
                    <div className="absolute top-3 right-12 z-10">
                      <Badge variant="destructive" className="shadow-lg">-{pkg.salePricePercent}% OFF</Badge>
                    </div>
                  )}

                  <div className="h-40 bg-black/40 border-b border-border flex items-center justify-center p-6 relative group-hover:bg-black/60 transition-colors">
                    {/* Glow effect behind image */}
                    <div className={cn(
                      "absolute inset-0 opacity-20 blur-2xl transition-opacity group-hover:opacity-40",
                      pkg.featured ? "bg-accent" : "bg-primary"
                    )} />
                    
                    {pkg.imageUrl ? (
                      <img 
                        src={pkg.imageUrl} 
                        alt={pkg.name} 
                        className="w-full h-full object-contain pixelated relative z-10 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]"
                      />
                    ) : (
                      <PackagePlaceholder className="w-16 h-16 text-primary/50 relative z-10 group-hover:scale-110 transition-transform" />
                    )}
                  </div>

                  <CardContent className="flex-1 p-5 flex flex-col gap-2">
                    <div className="text-[10px] uppercase tracking-widest text-primary font-bold">{pkg.category}</div>
                    <h3 className="font-display text-lg text-white leading-tight">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground font-sans line-clamp-2 mt-1">
                      {pkg.description}
                    </p>
                    
                    <div className="mt-auto pt-4 flex items-end justify-between">
                      <div className="font-pixel text-2xl text-white drop-shadow-md">
                        {formatCurrency(pkg.price, pkg.currency)}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="p-5 pt-0 border-none bg-transparent">
                    <Button 
                      className="w-full gap-2" 
                      onClick={() => handleAddToCart(pkg.id)}
                      disabled={addToCart.isPending}
                    >
                      <ShoppingCart className="w-4 h-4" /> 
                      {addToCart.isPending ? "Adding..." : "Add to Cart"}
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

function PackagePlaceholder({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  )
}
