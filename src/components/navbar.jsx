import Link from "next/link";
import { CircleArrowLeft, Sparkles } from "lucide-react";
import Image from "next/image";
import imgLogo from "../../public/AGV2.jpg";

export function Navbar() {
  return (
    <header className=" bg-transparent border-white/10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-sm">
          <Image
            src={imgLogo || "/placeholder.svg"}
            alt="Agent AI Lab Logo"
            width={180}
            height={180}
          />
        </Link>

        <nav className="hidden md:flex ml-5 items-center gap-8">
          <Link
            href="/"
            className="text-white/90 hover:text-white transition-colors"
          >
            Home
          </Link>
          <Link
            href="/categories"
            className="text-white/90 hover:text-white transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/favourites"
            className="text-white/90 hover:text-white transition-colors"
          >
            Favourites
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
            <CircleArrowLeft className="h-4 w-4 text-white" />
            <span className="text-white text-sm">Sign In</span>
          </button> */}
          <Link href="/submit">
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-black hover:bg-white/5 transition-colors mr-5">
              <Sparkles className="h-4 w-4 text-white" />
              <span className="text-white text-md ">Submit AI Tool</span>
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
