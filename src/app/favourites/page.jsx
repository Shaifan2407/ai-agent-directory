"use client"

import { useState, useEffect } from "react";
import { ToolCard } from "@/components/tool-card";

export default function FavouritesPage() {
  const [favorites, setFavorites] = useState([]);
  
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(storedFavorites);

    const handleFavoritesUpdated = () => {
      const updatedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      setFavorites(updatedFavorites);
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdated);

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
    };
  }, []);
    
  return (
    <div className="min-h-screen bg-black">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Your Favorites</h1>
        {favorites.length === 0 ? (
          <p className="text-white text-center">You haven't added any favorites yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((tool) => (
              <ToolCard key={tool._id} {...tool} setFavorites={setFavorites} />
            ))}
          </div>
        )}
      </main>
    
    </div>
  );
}
