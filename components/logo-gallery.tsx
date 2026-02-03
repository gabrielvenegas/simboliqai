"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Download, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

export default function SVGLogoGallery({ logos }: { logos: LogoArtwork[] }) {
  const { back } = useRouter();
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
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto py-8 gap-8 space-y-6 px-4">
        <div className="flex flex-col items-start">
          <Button
            variant="link"
            className="text-left p-0"
            style={{
              textAlign: "left",
              padding: 0,
            }}
            onClick={back}
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Button>

          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-bold">Minha galeria</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {logos?.map((logo, index) => (
            <motion.div
              key={logo.id}
              className="cursor-pointer group"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: index * 0.08,
              }}
              onClick={() => handleLogoClick(logo, index)}
            >
              <motion.div
                className="w-full overflow-hidden rounded-xl"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
              >
                <Image
                  src={logo.public_url || "/fallback-image.png"}
                  alt={logo.brand_name}
                  width={320}
                  height={160}
                  className="object-cover w-full h-full transition-transform duration-200 ease-out group-hover:scale-105"
                  priority
                />
              </motion.div>

              <div className="mt-4 text-center">
                <h2 className="text-lg font-medium transition-colors">
                  {logo.brand_name}
                </h2>
              </div>
            </motion.div>
          ))}
        </div>
        <AnimatePresence>
          {selectedLogo && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 text-foreground p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            >
              <motion.div
                className="relative rounded-2xl p-6 sm:p-8 flex flex-col shadow-2xl w-full max-w-6xl h-[90vh]"
                initial={{ scale: 1.05, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.4 }}
                onClick={(e) => e.stopPropagation()}
              >
                <Button
                  className="absolute top-3 right-3 z-10"
                  onClick={handleClose}
                  variant="ghost"
                >
                  <X className="h-6 w-6" />
                </Button>

                <div className="relative flex-1 w-full mb-4">
                  <Image
                    src={selectedLogo.public_url || "/fallback-image.png"}
                    alt={selectedLogo.brand_name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>

                <div className="text-center space-y-3 flex-shrink-0">
                  <h2 className="text-2xl sm:text-3xl font-semibold">
                    {selectedLogo.brand_name}
                  </h2>
                  <p className="text-neutral-500 italic text-sm sm:text-base line-clamp-2">
                    "{selectedLogo.prompt}"
                  </p>

                  <Button
                    onClick={() => downloadSVG(selectedLogo)}
                    className="mt-2"
                  >
                    <Download className="mr-2 h-4 w-4" /> Download Your Artwork
                  </Button>
                </div>

                <div className="mt-4 flex justify-between flex-shrink-0">
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
    </div>
  );
}
