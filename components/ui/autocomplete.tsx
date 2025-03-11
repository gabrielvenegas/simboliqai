"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Label } from "./label";

// Color palette data
const colorPalettes = [
  {
    id: "sunset",
    name: "Sunset",
    colors: ["#FF7B89", "#FFB26B", "#FFD16B", "#FACF5A", "#FF5959"],
  },
  {
    id: "ocean",
    name: "Ocean",
    colors: ["#01295F", "#013A63", "#01497C", "#014F86", "#2A6F97"],
  },
  {
    id: "forest",
    name: "Forest",
    colors: ["#606C38", "#283618", "#DDA15E", "#BC6C25", "#FEFAE0"],
  },
  {
    id: "pastel",
    name: "Pastel",
    colors: ["#FFADAD", "#FFD6A5", "#FDFFB6", "#CAFFBF", "#9BF6FF"],
  },
  {
    id: "neon",
    name: "Neon",
    colors: ["#FF00FF", "#00FFFF", "#FF0000", "#00FF00", "#FFFF00"],
  },
  {
    id: "monochrome",
    name: "Monochrome",
    colors: ["#000000", "#333333", "#666666", "#999999", "#CCCCCC"],
  },
  {
    id: "autumn",
    name: "Autumn",
    colors: ["#582F0E", "#7F4F24", "#936639", "#A68A64", "#B6AD90"],
  },
  {
    id: "winter",
    name: "Winter",
    colors: ["#CAF0F8", "#ADE8F4", "#90E0EF", "#48CAE4", "#0077B6"],
  },
  {
    id: "spring",
    name: "Spring",
    colors: ["#606C38", "#DDA15E", "#BC6C25", "#FEFAE0", "#D4A373"],
  },
  {
    id: "summer",
    name: "Summer",
    colors: ["#FF7D00", "#FF8800", "#FF9500", "#FFA200", "#FFAA00"],
  },
  {
    id: "retro",
    name: "Retro",
    colors: ["#E63946", "#F1FAEE", "#A8DADC", "#457B9D", "#1D3557"],
  },
  {
    id: "candy",
    name: "Candy",
    colors: ["#FFBE0B", "#FB5607", "#FF006E", "#8338EC", "#3A86FF"],
  },
];

export default function Autocomplete() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedPalette, setSelectedPalette] = useState(colorPalettes[0]);
  const [filteredPalettes, setFilteredPalettes] = useState(colorPalettes);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const commandRef = useRef<HTMLDivElement>(null);

  // Filter palettes based on search input
  useEffect(() => {
    if (searchValue) {
      const filtered = colorPalettes.filter((palette) =>
        palette.name.toLowerCase().includes(searchValue.toLowerCase()),
      );
      setFilteredPalettes(filtered);
      setActiveIndex(0);
    } else {
      setFilteredPalettes(colorPalettes);
    }
  }, [searchValue]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        commandRef.current &&
        !commandRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((prev) =>
          prev < filteredPalettes.length - 1 ? prev + 1 : prev,
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;
      case "Enter":
        e.preventDefault();
        if (filteredPalettes[activeIndex]) {
          selectPalette(filteredPalettes[activeIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        break;
    }
  };

  // Scroll active item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const activeItem = listRef.current.querySelector(
        `[data-index="${activeIndex}"]`,
      );
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [activeIndex, isOpen]);

  // Select a palette
  const selectPalette = (palette: (typeof colorPalettes)[0]) => {
    setSelectedPalette(palette);
    setIsOpen(false);
  };

  // Focus input when dropdown opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  return (
    <div>
      {/* Custom Command Component */}
      <div className="space-y-2 relative" ref={commandRef}>
        <Label>Color Palette</Label>
        <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className="flex items-center justify-between w-full px-4 py-2 text-left bg-white border border-[#ECF0F1] rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {selectedPalette.colors.map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-sm">{selectedPalette.name}</span>
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="opacity-50"
          >
            <path d="m7 15 5 5 5-5" />
            <path d="m7 9 5-5 5 5" />
          </svg>
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg">
            <div className="p-2">
              <input
                ref={inputRef}
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search palettes..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="off"
              />
            </div>

            <div className="max-h-60 overflow-y-auto p-1" ref={listRef}>
              {filteredPalettes.length === 0 ? (
                <div className="px-3 py-2 text-sm text-gray-500">
                  No palette found.
                </div>
              ) : (
                filteredPalettes.map((palette, index) => (
                  <div
                    key={palette.id}
                    data-index={index}
                    onClick={() => selectPalette(palette)}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={`flex items-center justify-between px-3 py-2 cursor-pointer rounded-md ${
                      activeIndex === index
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {palette.colors.map((color, colorIndex) => (
                          <div
                            key={colorIndex}
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <span>{palette.name}</span>
                    </div>
                    {selectedPalette.id === palette.id && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
