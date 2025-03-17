"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ZoomIn, ArrowLeft, ArrowRight, X } from "lucide-react";

interface LogoArtwork {
  id: number;
  title: string;
  svgContent: string;
  artist: string;
  year: string;
  description: string;
}

export default function SVGLogoGallery() {
  const [selectedLogo, setSelectedLogo] = useState<LogoArtwork | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Sample SVG logos - replace with your generated logos
  const logos: LogoArtwork[] = [
    {
      id: 1,
      title: "Geometric Harmony",
      svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="30" fill="currentColor" />
        <rect x="20" y="20" width="60" height="60" fill="none" stroke="currentColor" strokeWidth="2" />
      </svg>`,
      artist: "AI Generator",
      year: "2023",
      description:
        "A minimalist logo exploring the harmony between circular and rectangular forms.",
    },
    {
      id: 2,
      title: "Flowing Waves",
      svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M10,50 Q30,30 50,50 T90,50" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M10,70 Q30,50 50,70 T90,70" fill="none" stroke="currentColor" strokeWidth="3" />
      </svg>`,
      artist: "AI Generator",
      year: "2023",
      description:
        "Inspired by natural wave patterns, this logo represents flow and continuity.",
    },
    {
      id: 3,
      title: "Triangular Ascent",
      svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <polygon points="50,10 90,90 10,90" fill="currentColor" />
        <polygon points="50,20 80,80 20,80" fill="none" stroke="currentColor" strokeWidth="1" />
      </svg>`,
      artist: "AI Generator",
      year: "2023",
      description:
        "A study in triangular forms suggesting upward movement and aspiration.",
    },
    {
      id: 4,
      title: "Concentric",
      svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="2" />
        <circle cx="50" cy="50" r="10" fill="currentColor" />
      </svg>`,
      artist: "AI Generator",
      year: "2023",
      description:
        "Exploring depth and focus through concentric circular patterns.",
    },
    {
      id: 5,
      title: "Grid System",
      svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <line x1="25" y1="10" x2="25" y2="90" stroke="currentColor" strokeWidth="2" />
        <line x1="50" y1="10" x2="50" y2="90" stroke="currentColor" strokeWidth="2" />
        <line x1="75" y1="10" x2="75" y2="90" stroke="currentColor" strokeWidth="2" />
        <line x1="10" y1="25" x2="90" y2="25" stroke="currentColor" strokeWidth="2" />
        <line x1="10" y1="50" x2="90" y2="50" stroke="currentColor" strokeWidth="2" />
        <line x1="10" y1="75" x2="90" y2="75" stroke="currentColor" strokeWidth="2" />
      </svg>`,
      artist: "AI Generator",
      year: "2023",
      description:
        "A structured grid system representing order and organization.",
    },
    {
      id: 6,
      title: "Spiral Motion",
      svgContent: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50,50 L50,20 A30,30 0 0,1 80,50 L50,50" fill="currentColor" />
        <path d="M50,50 L80,50 A30,30 0 0,1 50,80 L50,50" fill="currentColor" opacity="0.8" />
        <path d="M50,50 L50,80 A30,30 0 0,1 20,50 L50,50" fill="currentColor" opacity="0.6" />
        <path d="M50,50 L20,50 A30,30 0 0,1 50,20 L50,50" fill="currentColor" opacity="0.4" />
      </svg>`,
      artist: "AI Generator",
      year: "2023",
      description: "A dynamic spiral form suggesting growth and evolution.",
    },
  ];

  const handleLogoClick = (logo: LogoArtwork, index: number) => {
    setSelectedLogo(logo);
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setSelectedLogo(null);
  };

  const handlePrevious = () => {
    const newIndex = (currentIndex - 1 + logos.length) % logos.length;
    setSelectedLogo(logos[newIndex]);
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % logos.length;
    setSelectedLogo(logos[newIndex]);
    setCurrentIndex(newIndex);
  };

  const downloadSVG = (logo: LogoArtwork) => {
    const blob = new Blob([logo.svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${logo.title.toLowerCase().replace(/\s+/g, "-")}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
    <div className="min-h-screen w-full bg-gradient-to-br from-primary to-secondary p-6 md:p-12">
      <div className="mx-auto max-w-7xl">
        <header className="mb-16">
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            Gallery
          </h1>
          <p className="text-lg text-white/80">
            A collection of your generated logos
          </p>
        </header>

        <div
          ref={galleryRef}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {logos.map((logo, index) => (
            <motion.div
              key={logo.id}
              className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl bg-white/10 p-8 backdrop-blur-sm will-change-transform"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1], // Custom cubic-bezier for smooth animation
              }}
              whileHover={{
                y: -8,
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 15,
                },
              }}
              onClick={() => handleLogoClick(logo, index)}
            >
              <div className="relative flex h-full w-full items-center justify-center transform-gpu transition-transform duration-500 ease-out group-hover:scale-110">
                <div
                  className="h-full w-full text-white"
                  dangerouslySetInnerHTML={{ __html: logo.svgContent }}
                />
              </div>

              <motion.div
                className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                initial={false}
                exit={false}
              />

              <motion.div
                className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100"
                initial={false}
                exit={false}
              >
                <h3 className="text-lg font-medium">{logo.title}</h3>
                <p className="text-sm text-white/80">{logo.year}</p>
              </motion.div>

              <motion.div
                className="absolute right-4 top-4 rounded-full bg-white/20 p-2 opacity-0 scale-90 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ZoomIn className="h-5 w-5 text-white" />
              </motion.div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selectedLogo && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              onClick={handleClose}
            >
              <motion.div
                className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-[#121212] p-8 shadow-xl"
                initial={{ scale: 0.95, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.95, y: 20, opacity: 0 }}
                transition={{
                  duration: 0.4,
                  ease: [0.23, 1, 0.32, 1],
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={handleClose}
                  className="absolute right-4 top-4 rounded-full bg-black/30 p-2 text-white/70 transition-colors hover:bg-black/50 hover:text-white"
                  aria-label="Close"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col items-center lg:flex-row lg:items-start lg:gap-12">
                  {/* 3D floating logo display with white logos */}
                  <div className="relative mb-8 flex h-64 w-64 shrink-0 items-center justify-center sm:h-80 sm:w-80 lg:mb-0">
                    {/* Reflection/shadow on the "floor" */}
                    <div className="absolute bottom-0 left-1/2 h-[1px] w-4/5 -translate-x-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-sm"></div>

                    {/* 3D floating container with animation */}
                    <motion.div
                      className="relative flex h-4/5 w-4/5 items-center justify-center"
                      style={{ perspective: "1000px" }}
                      animate={{
                        y: [0, -8, 0],
                        rotateX: [0, 2, 0],
                        rotateY: [0, -2, 0],
                      }}
                      transition={{
                        duration: 6,
                        ease: "easeInOut",
                        repeat: Number.POSITIVE_INFINITY,
                        repeatType: "reverse",
                      }}
                    >
                      {/* Black base with 3D rotation */}
                      <div
                        className="absolute inset-0 rounded-lg bg-black shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform-gpu"
                        style={{ transform: "rotate3d(1, 1, 0, 10deg)" }}
                      ></div>

                      {/* Gradient border with shine effect */}
                      <div
                        className="absolute inset-0 rounded-lg border border-transparent bg-gradient-to-br from-primary to-secondary opacity-50 transform-gpu"
                        style={{ transform: "rotate3d(1, 1, 0, 10deg)" }}
                      ></div>

                      {/* Shine overlay */}
                      <div
                        className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 via-transparent to-transparent transform-gpu"
                        style={{ transform: "rotate3d(1, 1, 0, 10deg)" }}
                      ></div>

                      {/* SVG container */}
                      <div
                        className="relative z-10 flex h-full w-full items-center justify-center transform-gpu"
                        style={{ transform: "rotate3d(1, 1, 0, 10deg)" }}
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={selectedLogo.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="h-4/5 w-4/5 flex items-center justify-center"
                          >
                            {/* Glow behind the SVG */}
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-full blur-xl glow-pulse"></div>

                            {/* The SVG itself - keeping it white */}
                            <div
                              className="h-full w-full text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                              dangerouslySetInnerHTML={{
                                __html: selectedLogo.svgContent,
                              }}
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex-1 text-white/90">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={selectedLogo.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.3 }}
                        className="w-full"
                      >
                        <div className="mb-6 border-b border-white/10 pb-4">
                          <h2 className="mb-2 text-3xl font-medium text-white">
                            {selectedLogo.title}
                          </h2>
                          <div className="flex items-center gap-4 text-sm text-white/60">
                            <span>{selectedLogo.artist}</span>
                            <span className="text-white/30">•</span>
                            <span>{selectedLogo.year}</span>
                          </div>
                        </div>

                        <div className="mb-8">
                          <h3 className="mb-2 text-lg font-medium text-white/80">
                            Description
                          </h3>
                          <p className="text-white/60">
                            {selectedLogo.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                          <button
                            onClick={() => downloadSVG(selectedLogo)}
                            className="flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2 font-medium text-white transition-all hover:bg-white/15"
                          >
                            <Download className="h-4 w-4" />
                            Download SVG
                          </button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={handlePrevious}
                    className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </button>

                  <button
                    onClick={handleNext}
                    className="flex items-center gap-2 rounded-lg bg-white/5 px-4 py-2 font-medium text-white/70 transition-colors hover:bg-white/10 hover:text-white"
                  >
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
