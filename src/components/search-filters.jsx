"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Search } from "lucide-react"
import debounce from "lodash/debounce"

export function SearchFilters({ onSearch, onClearFilters }) {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const dropdownRef = useRef(null)
  const inputRef = useRef(null)

  const categories = [
    { id: "Automation", label: "Automation", count: 45 },
    { id: "AI Agents", label: "AI Agents", count: 45 },
    { id: "Art Generation", label: "Art Generation", count: 45 },
    { id: "Chat", label: "Chat", count: 45 },
    { id: "E-commerce", label: "E-commerce", count: 45 },
  ]

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchCategoryData = useCallback(
    async (category = "", query = "") => {
      try {
        let url = `${process.env.NEXT_PUBLIC_API_URL}/api`
        if (category) {
          url += `/category/${encodeURIComponent(category)}`
        }
        if (query) {
          url += `?q=${encodeURIComponent(query)}`
        }
        const response = await fetch(url)
        const data = await response.json()
        onSearch(data)
      } catch (error) {
        console.error("Error fetching category data:", error)
      }
    },
    [onSearch],
  )

  const debouncedFetchCategoryData = useCallback(
    debounce((category, query) => fetchCategoryData(category, query), 300),
    [fetchCategoryData],
  )

  const handleCategoryChange = useCallback(
    (categoryId) => {
      setSelectedCategories((prev) => {
        const newSelectedCategories = prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId)
          : [...prev, categoryId]

        if (newSelectedCategories.length > 0) {
          debouncedFetchCategoryData(newSelectedCategories.join(","), searchTerm)
        } else {
          // If no categories are selected, clear filters and return to home state
          onClearFilters()
        }

        return newSelectedCategories
      })
    },
    [searchTerm, debouncedFetchCategoryData, onClearFilters],
  )

  const handleSearchChange = useCallback(
    (e) => {
      const newSearchTerm = e.target.value
      setSearchTerm(newSearchTerm)

      if (newSearchTerm === "" && selectedCategories.length === 0) {
        onClearFilters()
        return
      }

      if (selectedCategories.length > 0) {
        debouncedFetchCategoryData(selectedCategories.join(","), newSearchTerm)
      } else {
        debouncedFetchCategoryData("", newSearchTerm)
      }
    },
    [selectedCategories, debouncedFetchCategoryData, onClearFilters],
  )

  const handleKeyPress = useCallback(
    (e) => {
      if (e.key === "Enter") {
        if (searchTerm.trim() === "" && selectedCategories.length === 0) {
          onClearFilters()
          return
        }

        if (selectedCategories.length > 0) {
          fetchCategoryData(selectedCategories.join(","), searchTerm.trim())
        } else {
          fetchCategoryData("", searchTerm.trim())
        }
      }
    },
    [searchTerm, selectedCategories, fetchCategoryData, onClearFilters],
  )

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="flex relative">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          className="font-medium w-full h-12 pl-4 pr-12 bg-black/40 border border-gray-700 text-gray-300 placeholder:text-gray-500 text-lg rounded-xl focus:outline-none focus:ring-1 focus:ring-white/20"
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyPress}
          onFocus={() => setIsDropdownOpen(true)}
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
      </div>

      {isDropdownOpen && (
        <div ref={dropdownRef} className="dropdown space-y-5 mt-4 bg-black/50 p-4 rounded-lg">
          {categories.map((category) => (
            <label key={category.id} className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category.id)}
                  onChange={() => handleCategoryChange(category.id)}
                  className="w-5 h-5 border border-gray-600 rounded bg-transparent appearance-none cursor-pointer checked:bg-white checked:border-white"
                />
                <svg
                  className={`absolute w-3 h-3 pointer-events-none ${
                    selectedCategories.includes(category.id) ? "opacity-100" : "opacity-0"
                  }`}
                  viewBox="0 0 17 12"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 5.5L5.5 10L15 1" />
                </svg>
              </div>
              <div className="flex items-center justify-between flex-1">
                <span
                  className={`text-lg ${
                    selectedCategories.includes(category.id) ? "text-white" : "text-gray-400"
                  } group-hover:text-white transition-colors`}
                >
                  {category.label}
                </span>
                <span className="text-lg text-gray-500">({category.count})</span>
              </div>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

