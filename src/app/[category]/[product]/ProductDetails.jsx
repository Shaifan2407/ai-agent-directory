"use client"
import Link from "next/link"
import { ArrowLeft, ExternalLink, Heart } from "lucide-react"
import { ToolCard } from "@/components/tool-card"
import Image from "next/image"
import { useState, useEffect } from "react"

const glassCardStyle = "bg-white/5 backdrop-blur-xl border border-white/10"
  const categories = [
    { name: "Text", count: 150 },
    { name: "Image", count: 120 },
    { name: "Code", count: 80 },
    { name: "Audio", count: 60 },
    { name: "Business", count: 90 },
    { name: "3D", count: 40 },
  ]
export default function ProductDetails({ productData }) {
  const [similarTools, setSimilarTools] = useState([])  // State for similar tools
  const [loading, setLoading] = useState(true)  // Loading state for similar tools
  const [featuredTools, setFeaturedTools] = useState([])
  useEffect(() => {
    const fetchSimilarTools = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${productData.category}`);
        const data = await res.json();

        if (res.ok) {
          // Filter out the currently displayed product
          const filteredTools = (data.tools || []).filter(
            (tool) => tool.name !== productData.name
          );

          // Limit to 3 similar tools
          setSimilarTools(filteredTools.slice(0, 3));
        } else {
          console.error("Failed to fetch similar tools");
        }
      } catch (error) {
        console.error("Error fetching similar tools:", error);
      }
    };

    fetchSimilarTools();
  }, [productData.category, productData.name]);

  useEffect(() => {
    const fetchFeaturedTools = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tools/promotion`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setFeaturedTools(data);
        }
      } catch (error) {
        console.error("Error fetching AI tools:", error);
      }
    };
    fetchFeaturedTools();
  }, []);

  return (
    <div className="min-h-screen bg-black bg-gradient-to-br from-purple-500/5 via-black to-emerald-500/5">
      <div className="relative min-h-[300px] flex flex-col items-center justify-center text-center px-4 overflow-hidden hero3-background">
        <div className="grid-perspective">
          <div className="perspective-grid">
            <div className="horizontal-lines" />
          </div>
        </div>

        {/* Gradient sources */}
        <div className="gradient-source-left" />
        <div className="gradient-source-right" />
        {/* Gradient overlay */}
        <div className="gradient-overlay" />
      </div>

      <main className="container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 max-w-7xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-white/60 mb-8">
          <Link href="/" className="flex items-center gap-2 hover:text-[#2EFFD5] transition-colors border rounded-sm px-2 py-1">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <span>/</span>
          <Link href="/" className="hover:text-[#2EFFD5] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href={`/${productData.category}`}
            className="hover:text-[#2EFFD5] transition-colors"
          >
            {productData.category}
          </Link>
          <span>/</span>
          <span className="text-white">{productData.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="flex-1">
            {/* Product Header */}
            <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 p-5">
              <Image
                src={productData.logo || "/placeholder.svg"}
                alt={`${productData.name} logo`}
                width={75}
                height={75}
                className="rounded-2xl"
              />
              <div className="flex-1 w-full">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">{productData.name}</h1>
                    <p className="text-white/60">{productData.tagline}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <a
                      href={productData.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-white text-black font-medium flex items-center gap-2 hover:bg-[#2EFFD5] transition-all"
                    >
                      Explore Tool
                      <ExternalLink className="w-4 h-4" />
                    </a>
                    <button className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-[#2EFFD5] transition-all">
                      <Heart className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                {/* Description */}
                <div className="prose prose-invert max-w-none ml-2 mb-4 space-y-4 leading-relaxed text-white/80">
  <p>{productData.description}</p>
</div>


                {/* Product Image */}
                <div className="rounded-xl overflow-hidden mb-4 bg-gradient-to-br from-purple-500/10 to-transparent p-4 sm:p-6">
                  <Image
                    src={productData.thumbnailImage || "/placeholder.svg"}
                    alt={`${productData.name} thumbnail`}
                    width={800}
                    height={400}
                    className="w-full rounded-xl border border-white/10 shadow-2xl"
                  />
                </div>

                {/* Features */}
                <div className="mb-6 mt-10">
                  <h2 className="text-xl font-bold text-white mb-3">Key Features</h2>
                  <ul className="list-disc list-inside text-white/80 space-y-2">
                    {productData.keyFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                {/* Use Cases */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-white mb-3">Use Cases</h2>
                  <ul className="list-disc list-inside text-white/80 space-y-2">
                    {productData.useCases.map((useCase, index) => (
                      <li key={index}>{useCase}</li>
                    ))}
                  </ul>
                </div>

                {/* Video */}
                {productData.videoUrl && (
                  <div className="mb-6">
                    <h2 className="text-xl font-bold text-white mb-3">Demo Video</h2>
                    <div className="aspect-w-16 aspect-h-9">
                      <iframe
                        src={productData.videoUrl}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full rounded-lg"
                      ></iframe>
                    </div>
                  </div>
                )}
              </div>
                      {/* Sidebar */}
    <div className="w-full lg:w-80 space-y-6">
                 {/* Featured AI Tools */}
                 <div className={`${glassCardStyle} rounded-xl p-4 sm:p-6`}>
            <h2 className="text-xl font-bold text-white mb-3">Featured AI Tools</h2>
            <div className="grid gap-4">
              {featuredTools.length > 0 ? (
                featuredTools.map((tool) => (
                  <Link key={tool._id} href={tool.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 p-3 rounded-lg hover:bg-white/10 transition">
                    <Image src={tool.logo} alt={tool.name} width={40} height={40} className="rounded-lg" />
                    <span className="text-white">{tool.name}</span>
                    <ExternalLink className="w-4 h-4 text-white/60" />
                  </Link>
                ))
              ) : (
                <p className="text-white/60">No featured tools available.</p>
              )}
            </div>
          </div>

                 {/* AI Tools Category */}
                <div className={`${glassCardStyle} rounded-xl p-4 sm:p-6`}>
                   <h3 className="text-lg font-bold text-white mb-4">AI Tools Category</h3>
                  <div className="space-y-3">
                     {categories.map((category) => (
                       <div
                         key={category.name}
                         className="flex items-center justify-between group cursor-pointer p-2 -mx-2 rounded-lg hover:bg-white/10 transition-all"
                       >
                         <span className="text-white group-hover:text-[#2EFFD5] transition-colors">{category.name}</span>
                         <div className="flex items-center gap-2">
                           <span className="text-white/40">{category.count}</span>
                           <ExternalLink className="w-4 h-4 text-white/40 group-hover:text-[#2EFFD5] transition-colors" />
                        </div>
                       </div>
                     ))}
                  </div>
                 </div>
               </div>
           


        </div>
        <h2 className="text-2xl font-bold text-white mb-10 mt-10">Similar Tools</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mb-10">

{similarTools.length > 0 ? (
  similarTools.map((tool, index) => (
    <ToolCard key={`${tool.name}-${index}`} {...tool} />
  ))
) : (
  <div>No tools available for this category</div>
)}
</div>
          </div>
        </div>
      </main>
    </div>
  )
}
