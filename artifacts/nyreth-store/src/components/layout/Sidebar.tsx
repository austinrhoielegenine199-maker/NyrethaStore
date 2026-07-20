import * as React from "react"
import { Link, useLocation } from "wouter"
import { Home, ShoppingBag, MessageSquare } from "lucide-react"
import { useGetTopDonator, useGetRecentPayments } from "@workspace/api-client-react"
import { formatCurrency, cn } from "@/lib/utils"

export function Sidebar() {
  const [location] = useLocation()
  const { data: topDonator } = useGetTopDonator()
  const { data: recentPayments } = useGetRecentPayments({ limit: 5 })

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/store", label: "Store", icon: ShoppingBag },
    { href: "/discord", label: "Discord", icon: MessageSquare },
  ]

  return (
    <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6 p-4">
      {/* Logo Area */}
      <div className="flex flex-col items-center justify-center p-4 mc-panel bg-card/80">
        <img src="/images/logo.png" alt="NyrethaSMP Logo" className="w-24 h-24 pixelated mb-3 drop-shadow-2xl" />
        <h1 className="font-display text-xl text-primary text-center leading-tight">
          Nyretha<br/><span className="text-white">Store</span>
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="w-full">
            <div className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-sm font-display text-sm tracking-widest transition-all mc-button w-full border-2",
              location === item.href 
                ? "bg-primary text-primary-foreground border-primary-foreground/20 shadow-[4px_4px_0_0_rgba(0,0,0,0.5)]" 
                : "bg-secondary text-secondary-foreground border-white/5 hover:bg-secondary/80 shadow-[2px_2px_0_0_rgba(0,0,0,0.3)]"
            )}>
              <item.icon className="w-4 h-4" />
              {item.label}
            </div>
          </Link>
        ))}
      </nav>

      {/* Top Donator */}
      {topDonator && (
        <div className="mc-panel p-4 flex flex-col items-center text-center gap-2 mt-4 relative overflow-hidden group">
          <div className="absolute inset-0 bg-primary/10 blur-xl group-hover:bg-primary/20 transition-all" />
          <h3 className="font-display text-xs text-accent uppercase w-full pb-2 border-b border-white/10 relative z-10">Top Supporter</h3>
          <img 
            src={topDonator.avatarUrl || `https://mc-heads.net/avatar/${topDonator.username}/64`} 
            alt={topDonator.username}
            className="w-12 h-12 pixelated rounded-sm border-2 border-primary mt-2 relative z-10"
          />
          <div className="relative z-10">
            <div className="font-bold text-sm text-white">{topDonator.username}</div>
            <div className="font-pixel text-lg text-primary mt-1">{formatCurrency(topDonator.totalAmount, topDonator.currency)}</div>
          </div>
        </div>
      )}

      {/* Recent Payments */}
      {recentPayments && recentPayments.length > 0 && (
        <div className="mc-panel p-4 flex flex-col gap-3">
          <h3 className="font-display text-xs text-muted-foreground uppercase w-full pb-2 border-b border-white/10">Recent Purchases</h3>
          <div className="flex flex-col gap-3">
            {recentPayments.map((payment) => (
              <div key={payment.id} className="flex items-center gap-3 group">
                <img 
                  src={payment.avatarUrl || `https://mc-heads.net/avatar/${payment.username}/32`}
                  alt={payment.username}
                  className="w-8 h-8 pixelated rounded-sm border border-white/10 group-hover:border-primary/50 transition-colors"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-white truncate">{payment.username}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{payment.packageName}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  )
}
