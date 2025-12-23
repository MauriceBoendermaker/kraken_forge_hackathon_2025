import Link from "next/link"
import { Activity, Settings } from "lucide-react"
import "@xyflow/react/dist/style.css"
import {Button} from "@/components/ui/button";

export function Navbar() {

  return (
    <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00B8E6]/80 to-[#6B4ACF]/80 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <Link href="/">
                <span className="text-lg font-bold text-white select-none">StrategyFlow</span>
              </Link>
            </div>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/templates" className="text-sm text-gray-400 hover:text-white transition-colors">
                Templates
              </Link>
              <Link href="/strategies" className="text-sm text-gray-400 hover:text-white transition-colors">
                Strategies
              </Link>
              <Link href="/simulator" className="text-sm text-gray-400 hover:text-white transition-colors">
                Simulator
              </Link>
              <Link href="/version-history" className="text-sm text-gray-400 hover:text-white transition-colors">
                Version history
              </Link>
              <Link href="/docs" className="text-sm text-gray-400 hover:text-white transition-colors">
                Docs
              </Link>
              <Link href="/about" className="text-sm text-gray-400 hover:text-white transition-colors">
                About
              </Link>
            </div>
          </div>
          <div>
            <Link href="/settings" className="text-sm text-gray-400 hover:text-white transition-colors pe-5">
              <Settings className="w-5 h-5 inline" />
            </Link>
            <Link href="/editor">
              <Button className="bg-[#00B8E6] hover:bg-[#009FCC] text-black font-semibold shadow-[0_0_15px_rgba(0,184,230,0.2)] transition-all hover:shadow-[0_0_20px_rgba(0,184,230,0.3)]">
                Launch App
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
