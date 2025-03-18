"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, ZoomIn, ArrowLeft, ArrowRight, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";

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

export default function SVGLogoGallery() {
  const [selectedLogo, setSelectedLogo] = useState<LogoArtwork | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const galleryRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  const { data } = useQuery<LogoArtwork[]>({
    queryKey: ["my-logos"],
    queryFn: async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError || !userData?.user?.id) {
        console.error("Error fetching user:", userError);
        return [];
      }

      const { data, error } = await supabase
        .from("logo_history")
        .select("*")
        .eq("user_id", userData.user.id);

      if (error) {
        console.error("Error fetching logo history:", error);
        return [];
      }

      return await Promise.all(
        data.map(async (logo) => {
          console.log("object: ", logo.url.split("/").pop());

          const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
              .from("logos")
              .createSignedUrl(logo.url.split("/").pop(), 60);

          console.log("signedUrlData: ", signedUrlData);
          console.log("signedUrlError: ", signedUrlError);

          if (signedUrlError) {
            console.error("Error generating signed URL:", signedUrlError);
            return { ...logo, public_url: null };
          }

          return { ...logo, public_url: signedUrlData?.signedUrl };
        }),
      );
    },
  });

  const handleLogoClick = (logo: LogoArtwork, index: number) => {
    setSelectedLogo(logo);
    setCurrentIndex(index);
  };

  const handleClose = () => {
    setSelectedLogo(null);
  };

  const handlePrevious = () => {
    if (!data) return;
    const newIndex = (currentIndex - 1 + data.length) % data.length;
    setSelectedLogo(data[newIndex]);
    setCurrentIndex(newIndex);
  };

  const handleNext = () => {
    if (!data) return;

    const newIndex = (currentIndex + 1) % data.length;
    setSelectedLogo(data[newIndex]);
    setCurrentIndex(newIndex);
  };

  const downloadSVG = (logo: LogoArtwork) => {
    // const blob = new Blob([logo.svgContent], { type: "image/svg+xml" });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = `${logo.title.toLowerCase().replace(/\s+/g, "-")}.svg`;
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);
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
    <>
      <div className="mx-auto max-w-7xl">
        <header className="mb-16">
          <h1 className="mb-4 text-4xl font-bold text-neutral-950 md:text-5xl lg:text-6xl">
            Gallery
          </h1>
          <p className="text-lg text-neutral-950/80">
            A collection of your generated logos
          </p>
        </header>

        <div
          ref={galleryRef}
          className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {data?.map((logo, index) => (
            <motion.div
              key={logo.id}
              className="group relative flex aspect-square flex-col items-center justify-center overflow-hidden rounded-xl bg-white shadow-md p-8 backdrop-blur-sm transition-shadow"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.23, 1, 0.32, 1],
              }}
              whileHover={{
                y: -4,
                boxShadow: "0px 12px 24px rgba(0, 0, 0, 0.15)",
                transition: {
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                },
              }}
              onClick={() => handleLogoClick(logo, index)}
            >
              <div className="relative flex h-full w-full items-center justify-center transform-gpu transition-transform duration-500 ease-out group-hover:scale-105">
                <img
                  key={logo.id}
                  src={logo.public_url || "/fallback-image.png"}
                  alt="Logo"
                  className="h-auto min-w-min object-contain" // Ensures logos are well-contained
                />
              </div>

              {/* Gradient Overlay */}
              <motion.div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              {/* Text Information */}
              <motion.div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-4 opacity-0 transition-all duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <h3 className="text-lg font-semibold">{logo.brand_name}</h3>
                <p className="text-sm text-white/80">
                  {/* {logo.created_at.getFullYear()} */}
                </p>
              </motion.div>

              {/* Zoom Button */}
              <motion.div
                className="absolute right-4 top-4 rounded-full bg-neutral-500/30 p-2 opacity-0 scale-90 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100"
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.85 }}
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
                className="relative max-h-[90vh] w-full max-w-4xl overflow-auto rounded-2xl bg-white p-8 shadow-xl"
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
                  <div className="relative mb-8 flex h-64 w-64 shrink-0 items-center justify-center sm:h-80 sm:w-80 lg:mb-0">
                    <div className="absolute bottom-0 left-1/2 h-[1px] w-4/5 -translate-x-1/2 blur-sm"></div>

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
                        className="absolute inset-0 rounded-lg bg-black shadow-md transform-gpu"
                        style={{ transform: "rotate3d(1, 1, 0, 10deg)" }}
                      ></div>

                      {/* Gradient border with shine effect */}
                      <div
                        className="absolute inset-0 rounded-lg border border-transparent bg-[#ECF0F1] transform-gpu"
                        style={{ transform: "rotate3d(1, 1, 0, 10deg)" }}
                      ></div>

                      {/* Shine overlay */}
                      {/* <div
                        className="absolute inset-0 rounded-lg bg-gradient-to-br from-white/20 via-transparent to-transparent transform-gpu"
                        style={{ transform: "rotate3d(1, 1, 0, 10deg)" }}
                      ></div> */}

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
                            <img
                              key={selectedLogo.id}
                              src={
                                selectedLogo.public_url || "/fallback-image.png"
                              }
                              alt="Logo"
                              className="h-auto min-w-min object-contain" // Ensures logos are well-contained
                            />
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </div>

                  <div className="flex-1 text-neutral-800/90">
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
                          <h2 className="mb-2 text-3xl font-medium text-neutral-800">
                            {selectedLogo.brand_name}
                          </h2>
                          <div className="flex items-center gap-4 text-sm text-neutral-800/60">
                            {/* <span>{selectedLogo.artist}</span> */}
                            <span className="text-neutral-800/30">•</span>
                            {/* <span>{selectedLogo.created_at.getFullYear()}</span> */}
                          </div>
                        </div>

                        <div className="mb-8">
                          <h3 className="mb-2 text-lg font-medium text-neutral-800/80">
                            Prompt
                          </h3>
                          <p className="text-neutral-800/60">
                            {selectedLogo.prompt}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                          <Button
                            onClick={() => downloadSVG(selectedLogo)}
                            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-lg hover:shadow-primary/20"
                          >
                            <Download className="h-4 w-4" />
                            Download SVG
                          </Button>
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button onClick={handlePrevious} variant="ghost">
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  <Button onClick={handleNext} variant="ghost">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
