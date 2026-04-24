"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { ToolCard } from "@/components/tool-card";

export default function CategoryPage() {
  const params = useParams();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryName = params.slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  useEffect(() => {
    const fetchCategoryTools = async () => {
      try {
        const response = await axios.get(`/api/tools/${params.slug}`);
        setTools(response.data.data || []);
      } catch (error) {
        console.error("Error fetching category tools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryTools();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {categoryName}
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Discover the best AI tools for {categoryName.toLowerCase()}
          </p>
        </div>

        {/* Tools Grid */}
        {tools.length === 0 ? (
          <div className="text-center text-white/70 text-lg">
            No tools found in this category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
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
        )}
      </div>
    </div>
  );
}
