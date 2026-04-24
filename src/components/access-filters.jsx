"use client"

import { useState, useEffect, useRef, useCallback } from "react"

const sourceOptions = [
  {
    id: "Close Source",
    label: "Closed Source",
    count: 45,
  },
  {
    id: "API",
    label: "API",
    count: 45,
  },
  {
    id: "Open Source",
    label: "Open Source",
    count: 45,
  },
]

export function AccessFilter({ onAccessChange }) {
  const [selectedSource, setSelectedSource] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const buttonRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchAccessData = useCallback(
    async (source) => {
      try {
        if (!source) {
          onAccessChange([])
          return
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/accessModel/${source.replace("%20", " ")}`)
        const data = await response.json()
        onAccessChange(data)
      } catch (error) {
        console.error("Error fetching access data:", error)
      }
    },
    [onAccessChange],
  )

  const handleSourceChange = (sourceId) => {
    const newSource = sourceId === selectedSource ? "" : sourceId
    setSelectedSource(newSource)
    fetchAccessData(newSource)
    setIsDropdownOpen(false)
  }

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <div className="relative w-full max-w-xs" ref={dropdownRef}>
      <button
        ref={buttonRef}
        className="w-full flex items-center justify-between bg-black text-white border border-gray-700 py-2 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-600 transition-all duration-300"
        onClick={toggleDropdown}
      >
        <span className="text-lg font-medium">{selectedSource || "Access Model"}</span>
        <span className="ml-4 text-sm transform transition-transform duration-300">{isDropdownOpen ? "▲" : "▼"}</span>
      </button>

      {isDropdownOpen && (
        <div className="absolute z-10 mt-2 w-full bg-black border border-gray-700 rounded-lg shadow-lg">
          {sourceOptions.map((option) => (
            <button
              key={option.id}
              className={`w-full flex items-center justify-between px-5 py-2 text-left transition-colors hover:bg-gray-800 ${
                selectedSource === option.id ? "bg-gray-800" : ""
              }`}
              onClick={() => handleSourceChange(option.id)}
            >
              <span className={`text-lg ${selectedSource === option.id ? "text-white" : "text-gray-300"}`}>
                {option.label}
              </span>
              <span className="text-lg text-gray-500">({option.count})</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

