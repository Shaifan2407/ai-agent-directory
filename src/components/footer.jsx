import Link from "next/link";
import { Instagram } from "lucide-react";
import imgLogo from "../../public/AGV2.jpg";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto px-4 py-12 flex flex-col items-center text-center space-y-12">
        {/* Top Section */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12">
          <Link href="/" className="flex items-center gap-2.5 text-sm">
            <Image
              src={imgLogo || "/placeholder.svg"}
              alt="Agent AI Lab Logo"
              width={180}
              height={180}
              className="mx-auto md:mx-0"
            />
          </Link>

          <nav className="flex flex-wrap justify-center md:justify-end gap-8">
            <Link
              href="/"
              className="text-white/70 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-white/70 hover:text-white transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/contact"
              className="text-white/70 hover:text-white transition-colors"
            >
              Contact Us
            </Link>
          </nav>

          <div className="flex items-center justify-center gap-6">
            <Link
              href="https://instagram.com"
              className="text-white/70 hover:text-white transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </Link>
            <Link
              href="https://x.com"
              className="text-white/70 hover:text-white transition-colors"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-white/10">
          <div className="flex flex-wrap justify-center md:justify-start gap-6">
            <Link
              href="/privacy"
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-white/40 hover:text-white/60 transition-colors"
            >
              Terms of Conditions
            </Link>
          </div>

          <p className="text-white/40 text-center">©2025 Agent AI Lab</p>
        </div>
      </div>
    </footer>
  );
}
