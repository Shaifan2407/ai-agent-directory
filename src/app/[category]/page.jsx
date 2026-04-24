"use client"
import { Search } from "lucide-react"
import { ToolCard } from "@/components/tool-card"
import { useEffect, useState } from 'react'
import { SearchFilters } from "@/components/search-filters"
import { PricingFilter } from "@/components/pricing-filters"
import { AccessFilter } from "@/components/access-filters"
import { SortFilter } from "@/components/sort-filters"


export default function MarketingPage({ params }) {
  // State for tools data and loading state
  const [tools, setTools] = useState([])
  const [filteredTools, setFilteredTools] = useState([])
  const [loading, setLoading] = useState(true)

  // Fetch data from API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { category } = await params // Destructure category from params
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/category/${category}`)
        const data = await res.json()

        if (res.ok) {
          setTools(data.tools || []) // Adjust according to actual API structure
          setFilteredTools(data.tools || [])
        } else {
          console.error("Failed to fetch tools")
        }
      } catch (error) {
        console.error("Error fetching tools:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params]) // Add params as a dependency

  // Handle filtering (if needed)
  const handleFilter = (type) => {
    if (type === "all") {
      setFilteredTools(tools)
    } else {
      setFilteredTools(tools.filter((tool) => tool.pricingModel.toLowerCase() === type)) // Adjust filter condition if necessary
    }
  }

  if (loading) {
    return <div>Loading...</div> // Show loading state while fetching data
  }

  if (tools.length === 0) {
    return <div>No tools available for this category</div>
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero section with smaller height */}
      <div className="relative min-h-[300px] flex flex-col items-center justify-center text-center px-4 overflow-hidden hero2-background">
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

        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-suisse-bold text-white mb-4"> {`${params.category.replace("%20"," ")} AI Tools`}</h1>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 sm:py-12">
           <div className="flex flex-wrap justify-between items-center gap-5 mb-10 p-10">
                <div className="flex-1 min-w-[200px]">
                  <SearchFilters  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <PricingFilter  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <AccessFilter  />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <SortFilter  />
                </div>
              </div>
      

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredTools.length > 0 ? (
            filteredTools.map((tool, index) => (
              <ToolCard key={`${tool.name}-${index}`} {...tool} />
            ))
          ) : (
            <div>No tools available for this category</div>
          )}
        </div>
      </main>
    </div>
  )
}
