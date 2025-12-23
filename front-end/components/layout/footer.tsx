import Link from "next/link"
import { Github, LinkedinIcon, Activity } from "lucide-react"
import "@xyflow/react/dist/style.css"

export function Footer() {

  return (
    <footer className="relative border-t border-white/10 bg-black/80 backdrop-blur-xl py-12 px-6">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#00B8E6]/80 to-[#6B4ACF]/80 flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <Link href="/">
                <span className="text-lg font-bold text-white select-none">StrategyFlow</span>
              </Link>
            </div>
            <p className="text-sm text-gray-500">Build, test, and deploy crypto trading strategies visually.</p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/templates" className="text-gray-400 hover:text-[#00B8E6] transition-colors">
                  Templates
                </Link>
              </li>
              <li>
                <Link href="/strategies" className="text-gray-400 hover:text-[#00B8E6] transition-colors">
                  Strategies
                </Link>
              </li>
              <li>
                <Link href="/simulator" className="text-gray-400 hover:text-[#00B8E6] transition-colors">
                  Simulator
                </Link>
              </li>
              <li>
                <Link href="/version-history" className="text-gray-400 hover:text-[#00B8E6] transition-colors">
                  Version history
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/docs" className="text-gray-400 hover:text-[#00B8E6] transition-colors">
                  Docs
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-[#00B8E6] transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="https://github.com/MauriceBoendermaker/kraken_forge_hackathon_2025?tab=MIT-1-ov-file#readme" className="text-gray-400 hover:text-[#00B8E6] transition-colors">
                  License
                </Link>
              </li>
              <li>
                <Link href="https://github.com/MauriceBoendermaker/kraken_forge_hackathon_2025?tab=readme-ov-file#readme" className="text-gray-400 hover:text-[#00B8E6] transition-colors">
                  Readme
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Connect</h4>
            <div className="flex gap-3">
              <a
                href="https://github.com/MauriceBoendermaker/kraken_forge_hackathon_2025"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-[#00B8E6] transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/mauriceboendermaker/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-[#00B8E6] transition-all"
              >
                <LinkedinIcon className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 text-center text-sm text-gray-500">
          <p>&copy; 2025 StrategyFlow. Built with precision for traders.</p>
        </div>
      </div>
    </footer>
  )
}
