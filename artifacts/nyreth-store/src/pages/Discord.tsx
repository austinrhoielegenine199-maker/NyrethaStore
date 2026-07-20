import * as React from "react"
import { motion } from "framer-motion"
import { useGetStoreInfo } from "@workspace/api-client-react"
import { MessageSquare, Users, Shield, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Discord() {
  const { data: storeInfo } = useGetStoreInfo()

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto py-12 flex flex-col items-center text-center space-y-8"
    >
      <div className="w-24 h-24 rounded-2xl bg-[#5865F2] flex items-center justify-center shadow-[0_0_40px_-5px_#5865F2] mb-4">
        <img 
          src="https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png" 
          alt="Discord" 
          className="w-14 h-14 brightness-0 invert" 
        />
      </div>

      <h1 className="font-display text-4xl md:text-5xl text-white uppercase tracking-wider">
        Join the <span className="text-[#5865F2]">Community</span>
      </h1>
      
      <p className="text-lg text-muted-foreground font-sans max-w-2xl">
        Connect with other players, get real-time support, participate in exclusive events, and stay up to date with the latest server news.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full py-8">
        <FeatureCard 
          icon={Users} 
          title="Find Players" 
          desc="Team up with others or find a town to join." 
        />
        <FeatureCard 
          icon={Shield} 
          title="Fast Support" 
          desc="Open tickets and get help from staff quickly." 
        />
        <FeatureCard 
          icon={Zap} 
          title="Live Updates" 
          desc="Be the first to know about sales and resets." 
        />
      </div>

      <Button 
        size="lg" 
        className="bg-[#5865F2] hover:bg-[#4752C4] text-white border-2 border-[#5865F2]/50 shadow-[0_0_20px_-5px_#5865F2] gap-3 text-lg h-16 px-10"
        asChild
      >
        <a href={storeInfo?.discordUrl || "#"} target="_blank" rel="noreferrer">
          <MessageSquare className="w-5 h-5" />
          Join Official Discord
        </a>
      </Button>
    </motion.div>
  )
}

function FeatureCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="mc-panel p-6 flex flex-col items-center bg-secondary/40 border-border/50">
      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4 text-primary">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-display text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground font-sans">{desc}</p>
    </div>
  )
}
