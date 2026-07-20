import * as React from "react"
import { motion } from "framer-motion"
import { useCheckGiftcard, useGetStoreInfo } from "@workspace/api-client-react"
import { useQueryClient } from "@tanstack/react-query"
import { Search, HelpCircle, FileText, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"

export default function Home() {
  const { data: storeInfo } = useGetStoreInfo()
  const checkGiftcard = useCheckGiftcard()
  const [giftcardCode, setGiftcardCode] = React.useState("")
  const [giftcardResult, setGiftcardResult] = React.useState<{ valid: boolean; balance: number; currency: string } | null>(null)
  const [giftcardError, setGiftcardError] = React.useState("")

  const handleCheckGiftcard = (e: React.FormEvent) => {
    e.preventDefault()
    if (!giftcardCode.trim()) return

    setGiftcardError("")
    setGiftcardResult(null)

    checkGiftcard.mutate(
      { data: { code: giftcardCode } },
      {
        onSuccess: (data) => {
          setGiftcardResult(data)
        },
        onError: () => {
          setGiftcardError("Invalid or expired giftcard code.")
        }
      }
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8"
    >
      {/* Hero Section */}
      <section className="relative w-full h-[300px] md:h-[400px] rounded-sm overflow-hidden border-2 border-primary/30 shadow-[0_0_30px_-5px_hsl(var(--primary)/0.3)]">
        <img 
          src="/images/hero-bg.jpg" 
          alt="NyrethaSMP World" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
          <h2 className="font-display text-3xl md:text-5xl text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] mb-4">
            WELCOME TO <span className="text-primary">NyrethaSMP</span>
          </h2>
          <p className="max-w-2xl text-lg text-gray-200 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] font-sans">
            {storeInfo?.description || "Support the server and unlock exclusive ranks, cosmetics, and perks to enhance your survival journey."}
          </p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-accent" /> Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 font-sans text-muted-foreground leading-relaxed">
              <p>
                Having trouble with a purchase? Purchases can take up to 15 minutes to process and apply in-game. 
                If you haven't received your items after this time, please contact our support team.
              </p>
              <p>
                Make sure you are logged in to the server and have inventory space if purchasing item bundles.
              </p>
              <Button variant="secondary" className="w-full sm:w-auto mt-2" asChild>
                <a href={storeInfo?.discordUrl || "#"} target="_blank" rel="noreferrer">
                  Open Support Ticket on Discord
                </a>
              </Button>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Card className="bg-secondary/20">
              <CardHeader className="pb-3 border-b-0 bg-transparent">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-primary" /> Refund Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                All purchases are final. Chargebacks or disputes will result in a permanent ban from NyrethaSMP and associated platforms.
              </CardContent>
            </Card>

            <Card className="bg-secondary/20">
              <CardHeader className="pb-3 border-b-0 bg-transparent">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-primary" /> Privacy Policy
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm text-muted-foreground">
                We take your privacy seriously. Payment information is securely processed by our payment gateways and never stored on our servers.
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Gift Card Balance</CardTitle>
              <CardDescription>Check your remaining store credit</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCheckGiftcard} className="space-y-3">
                <Input 
                  placeholder="Enter gift card code..." 
                  value={giftcardCode}
                  onChange={(e) => setGiftcardCode(e.target.value)}
                  className="font-pixel text-lg tracking-wider"
                />
                <Button type="submit" className="w-full gap-2" disabled={checkGiftcard.isPending}>
                  {checkGiftcard.isPending ? "Checking..." : "Check Balance"} <Search className="w-4 h-4" />
                </Button>
              </form>

              {giftcardResult && (
                <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-sm text-center">
                  <div className="text-sm text-green-400 font-bold uppercase mb-1">Valid Gift Card</div>
                  <div className="font-pixel text-2xl text-white">
                    {formatCurrency(giftcardResult.balance, giftcardResult.currency)}
                  </div>
                </div>
              )}
              {giftcardError && (
                <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-sm text-center text-sm text-destructive">
                  {giftcardError}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}
