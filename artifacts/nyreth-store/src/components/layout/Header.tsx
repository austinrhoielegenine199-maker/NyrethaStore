import * as React from "react"
import { Link, useLocation } from "wouter"
import { useGetStoreInfo, useGetServerStatus, useGetCart } from "@workspace/api-client-react"
import { ShoppingCart, LogIn, Gamepad2, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "./CartDrawer"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { data: storeInfo } = useGetStoreInfo()
  const { data: serverStatus } = useGetServerStatus({ query: { refetchInterval: 60000 } })
  const { data: cart } = useGetCart()
  const [copied, setCopied] = React.useState(false)

  const handleCopyIp = () => {
    if (storeInfo?.serverIp) {
      navigator.clipboard.writeText(storeInfo.serverIp)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b-2 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-8">
        
        {/* Left: Server IP & Status */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="hidden md:flex gap-2 font-pixel text-lg tracking-wider border-dashed border-primary/50 text-primary-foreground bg-primary/10"
            onClick={handleCopyIp}
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-primary" />}
            {storeInfo?.serverIp || "play.nyrethasmp.xyz"}
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${serverStatus?.online ? 'bg-green-400' : 'bg-destructive'}`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${serverStatus?.online ? 'bg-green-500' : 'bg-destructive'}`}></span>
            </span>
            <span className="font-sans text-sm text-muted-foreground font-medium hidden sm:inline-block">
              {serverStatus?.online ? (
                <><strong className="text-white">{serverStatus.playerCount}</strong> players online</>
              ) : (
                "Server Offline"
              )}
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4">
          <Button variant="secondary" className="hidden sm:flex gap-2" asChild>
            <a href={storeInfo?.discordUrl || "#"} target="_blank" rel="noreferrer">
              <img src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" alt="Discord" className="w-5 h-5 grayscale opacity-70 hover:grayscale-0 transition-all" />
              <span className="hidden lg:inline-block">Join Discord</span>
            </a>
          </Button>

          <CartDrawer>
            <Button variant="accent" size="icon" className="relative shrink-0">
              <ShoppingCart className="h-5 w-5" />
              {cart && cart.itemCount > 0 && (
                <Badge variant="destructive" className="absolute -top-2 -right-2 px-1.5 min-w-[20px] h-[20px] flex items-center justify-center rounded-full animate-in zoom-in">
                  {cart.itemCount}
                </Badge>
              )}
            </Button>
          </CartDrawer>

          <Button variant="default" className="gap-2 shrink-0">
            <img src="https://mc-heads.net/avatar/Steve/16" alt="Login" className="w-4 h-4 pixelated rounded-sm" />
            <span className="hidden sm:inline-block">Login</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
