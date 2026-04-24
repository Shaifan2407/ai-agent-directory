"use client";

import { motion } from "framer-motion";
import { Users, Lightbulb, Target } from "lucide-react";

export default function AboutPage() {
  const features = [
    {
      icon: <Users className="h-8 w-8 text-[#2EFFD5]" />,
      title: "Community Driven",
      description:
        "Our platform is built by and for AI enthusiasts, developers, and professionals who believe in the power of artificial intelligence.",
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-[#2EFFD5]" />,
      title: "Curated Collection",
      description:
        "We carefully select and verify each AI tool to ensure you have access to the best and most reliable resources available.",
    },
    {
      icon: <Target className="h-8 w-8 text-[#2EFFD5]" />,
      title: "Always Up-to-Date",
      description:
        "Our team constantly updates the directory to bring you the latest and most innovative AI tools as they emerge.",
    },
  ];

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            About Agent AI Lab
          </h1>
          <p className="text-white/70 text-lg max-w-3xl mx-auto">
            We are dedicated to bringing you the most comprehensive and
            up-to-date directory of AI tools. Our mission is to make artificial
            intelligence accessible and useful for everyone.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl text-white font-medium mb-3">
                {feature.title}
              </h3>
              <p className="text-white/70">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="bg-gradient-to-r from-[#2EFFD5]/10 to-transparent border border-[#2EFFD5]/20 rounded-xl p-8 mb-20">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Our Mission
          </h2>
          <p className="text-white/70 text-lg">
            At Agent AI Lab, we believe in the transformative power of
            artificial intelligence. Our goal is to create a centralized hub
            where individuals and businesses can discover the perfect AI tools
            to enhance their work and creativity. We strive to maintain the most
            comprehensive, accurate, and user-friendly directory of AI tools
            available on the internet.
          </p>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            Join Our Community
          </h2>
          <p className="text-white/70 text-lg max-w-2xl mx-auto">
            Be part of our growing community of AI enthusiasts. Submit your
            favorite AI tools, share your experiences, and help us build the
            ultimate AI tool directory.
          </p>
        </div>
      </div>
    </div>
  );
}
