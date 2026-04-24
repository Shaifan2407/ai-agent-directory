"use client"

import { Suspense, useEffect, useState, useRef, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { Hero } from "@/components/hero"
import { ToolCard } from "@/components/tool-card"
import InfiniteScroll from "@/components/infinite-scroll"
import Link from "next/link"
import axios from "axios"
import { SearchFilters } from "@/components/search-filters"
import { PricingFilter } from "@/components/pricing-filters"
import { AccessFilter } from "@/components/access-filters"
import { SortFilter } from "@/components/sort-filters"

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export default function Home() {
  const [categories, setCategories] = useState({})
  const [filteredCategories, setFilteredCategories] = useState(null)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)

  const fetchData = useCallback(async (pricingModel = "") => {
    setLoading(true)
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/home`
      if (pricingModel) {
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/pricingModel/${pricingModel}`
      }
      const response = await axios.get(url)
      const data = response.data.data || {}
      setCategories(data)
      setFilteredCategories(null)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  useEffect(() => {
    if (!loading) {
      animateCards()
    }
  }, [loading])

  const animateCards = useCallback(() => {
    gsap.utils.toArray(".tool-card").forEach((card) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
            end: "bottom center",
            toggleActions: "play none none reverse",
          },
        },
      )
    })
  }, [])

  const handleFilterChange = useCallback((newFilteredData) => {
    if (Array.isArray(newFilteredData)) {
      // If the data is an array, we need to group it by category
      const groupedData = newFilteredData.reduce((acc, tool) => {
        if (!acc[tool.category]) {
          acc[tool.category] = []
        }
        acc[tool.category].push(tool)
        return acc
      }, {})
      setFilteredCategories(groupedData)
    } else if (typeof newFilteredData === "object" && newFilteredData !== null) {
      // If it's already an object with categories, use it directly
      setFilteredCategories(newFilteredData)
    } else {
      console.error("Unexpected data format:", newFilteredData)
      setFilteredCategories(null)
    }
  }, [])

  const handlePricingChange = useCallback((pricingData) => {
    if (Array.isArray(pricingData)) {
      // If pricingData is an array, group it by category
      const groupedData = pricingData.reduce((acc, tool) => {
        if (!acc[tool.category]) {
          acc[tool.category] = []
        }
        acc[tool.category].push(tool)
        return acc
      }, {})
      setCategories(groupedData)
    } else {
      setCategories(pricingData)
    }
    setFilteredCategories(null)
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilteredCategories(null)
    fetchData()
  }, [fetchData])

  const dataToShow = filteredCategories || categories
  const categoryKeys = Object.keys(dataToShow).filter(
    (category) => Array.isArray(dataToShow[category]) && dataToShow[category].length > 0,
  )

  const isFiltered = filteredCategories !== null

  return (
    <div className="min-h-screen bg-black" ref={containerRef}>
      <Suspense fallback={<div className="min-h-[600px] bg-black" />}>
        <Hero />
      </Suspense>

      <div className="container mx-auto px-4 mb-20">
        <InfiniteScroll />

        {/* Filters */}
        <div className="flex justify-between gap-5 mb-5 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <SearchFilters onSearch={handleFilterChange} onClearFilters={handleClearFilters} />
          </div>
          <div className="flex-1 min-w-[200px]">
            <PricingFilter onPricingChange={handlePricingChange} />
          </div>
          <div className="flex-1 min-w-[200px]">
            <AccessFilter onAccessChange={handleFilterChange} />
          </div>
          <div className="flex-1 min-w-[200px]">
            <SortFilter onSortChange={handleFilterChange} />
          </div>
        </div>

        {/* Loader & No Results Handling */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-white"></div>
          </div>
        ) : categoryKeys.length === 0 ? (
          <div className="text-center text-white text-lg">No results found.</div>
        ) : (
          categoryKeys.map((category) => (
            <div key={category} className="mb-12 p-7 category-section mt-20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-white text-2xl font-semibold">{category}</h2>
                  <span className="px-2 py-0.5 rounded-full bg-[#2EFFD5] text-black text-sm">
                    {dataToShow[category]?.length || 0}
                  </span>
                </div>
                {!isFiltered && (
                  <Link
                    href={`/${category}`}
                    className="text-white/70 hover:text-white transition-colors border px-3 py-1.5 rounded-md"
                  >
                    View All →
                  </Link>
                )}
              </div>

              {/* Category Tools Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {dataToShow[category].map((tool) => (
                  <div key={tool._id} className="tool-card">
                    <ToolCard
                      name={tool.name}
                      category={tool.category}
                      pricingModel={tool.pricingModel}
                      websiteUrl={tool.websiteUrl}
                      tagline={tool.tagline}
                      logo={tool.logo}
                      socialTags={tool.socialTags || []}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

