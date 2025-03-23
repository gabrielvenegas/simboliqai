"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ZoomIn, ArrowLeft, ArrowRight, X } from "lucide-react";
import { Button } from "./ui/button";
import Image from "next/image";

interface LogoArtwork {
  id: number;
  brand_name: string;
  created_at: Date;
  font_family: string;
  font_style: string;
  prompt: string;
  url: string;
  user_id: string;
  public_url: string;
}

export default function SVGLogoGallery({ logos }: { logos: LogoArtwork[] }) {
  const [selectedLogo, setSelectedLogo] = useState<LogoArtwork | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);

  const handleLogoClick = (logo: LogoArtwork, index: number) => {
    setSelectedLogo(logo);
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setSelectedLogo(null);
  };

  const handlePrevious = () => {
    if (!logos) return;
    const newIndex = (currentIndex - 1 + logos.length) % logos.length;
    setSelectedLogo(logos[newIndex]);
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    if (!logos) return;

    const newIndex = (currentIndex + 1) % logos.length;
    setSelectedLogo(logos[newIndex]);
    setCurrentIndex(newIndex);
  };

  const downloadSVG = async (logo: LogoArtwork) => {
    if (!logo?.public_url) {
      console.error("Missing logo URL");
      return;
    }

    try {
      const response = await fetch(logo.public_url);
      const blob = await response.blob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${logo.brand_name.toLowerCase().replace(/\s+/g, "-")}.svg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download SVG:", err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedLogo) return;

      if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrevious();
      } else if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedLogo, currentIndex]);

  return (
    <div className="relative mx-auto max-w-7xl py-16 px-4 sm:px-8 lg:px-0">
      {/* Title */}
      <header className="text-center mb-20">
        <h1 className="text-5xl font-semibold text-neutral-800 mb-4">
          Gallery
        </h1>
        <p className="text-xl text-neutral-500">
          A curated display of your uniquely crafted logos
        </p>
      </header>

      {/* Floating Logos */}
      <div className="flex flex-wrap justify-center gap-16">
        {logos?.map((logo, index) => (
          <motion.div
            key={logo.id}
            className="relative group cursor-pointer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
            onClick={() => handleLogoClick(logo, index)}
          >
            <div className="aspect-square rounded-lg overflow-hidden transition-transform duration-500 group-hover:scale-110 shadow-xl flex items-center justify-center bg-white">
              <div className="p-6">
                <Image
                  src={logo.public_url || "/fallback-image.png"}
                  alt={logo.brand_name}
                  width={200}
                  height={100}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            <div className="mt-6 text-center">
              <h2 className="text-lg text-neutral-700 group-hover:text-neutral-900 transition-colors">
                {logo.brand_name}
              </h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal Showcase */}
      <AnimatePresence>
        {selectedLogo && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="relative bg-white rounded-2xl p-10 flex flex-col justify-between shadow-2xl min-h-8/12 h-8/12 lg:min-w-3xl w-3xl mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-3 text-neutral-400 hover:text-neutral-700"
                onClick={handleClose}
              >
                <X className="h-6 w-6" />
              </button>

              <div className="relative h-50 w-full mx-auto">
                <Image
                  src={selectedLogo.public_url || "/fallback-image.png"}
                  alt={selectedLogo.brand_name}
                  fill
                  className="object-contain p-4"
                  priority
                />
              </div>

              <div className="mt-8 text-center">
                <h2 className="text-2xl font-semibold text-neutral-800">
                  {selectedLogo.brand_name}
                </h2>
                <p className="mt-3 text-neutral-500 italic">
                  "{selectedLogo.prompt}"
                </p>

                <Button
                  onClick={() => downloadSVG(selectedLogo)}
                  className="mt-6 bg-gradient-to-r from-primary to-secondary text-white shadow hover:opacity-90 transition"
                >
                  <Download className="mr-2 h-4 w-4" /> Download Your Artwork
                </Button>
              </div>

              <div className="mt-10 flex justify-between">
                <Button variant="ghost" onClick={handlePrevious}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                </Button>
                <Button variant="ghost" onClick={handleNext}>
                  Next <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
