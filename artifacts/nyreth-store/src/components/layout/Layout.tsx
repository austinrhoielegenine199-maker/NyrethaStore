import * as React from "react"
import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background relative overflow-x-hidden selection:bg-primary selection:text-primary-foreground">
      {/* Global Background Effects */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] opacity-50" />
        <div className="absolute bottom-0 right-0 w-full h-[500px] bg-accent/5 blur-[150px] opacity-20" />
      </div>

      <Header />
      
      <div className="flex flex-1 max-w-[1400px] w-full mx-auto relative z-10 flex-col md:flex-row">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-8 md:pt-6 min-w-0 w-full">
          {children}
        </main>
      </div>

      <footer className="w-full border-t border-border/50 py-6 mt-auto bg-card/50 relative z-10 text-center text-sm text-muted-foreground font-sans">
        <p>Not an official Minecraft product. Not approved by or associated with Mojang or Microsoft.</p>
        <p className="mt-1">NyrethaSMP &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
