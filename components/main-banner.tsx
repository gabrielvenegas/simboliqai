import { Sparkles } from "lucide-react";

export default function MainBanner() {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative overflow-hidden rounded-lg shadow-md border border-white/20">
        {/* Background with the provided colors */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary"></div>

        {/* Diagonal ribbon in corner */}
        <div className="absolute -top-1 -right-12 bg-yellow-300 w-40 transform rotate-45 py-1 text-center shadow-md">
          <span className="text-xs font-bold text-primary">LAUNCH SPECIAL</span>
        </div>

        <div className="relative p-2 sm:p-2 flex items-center justify-between">
          {/* Left side with main offer */}
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-yellow-300 mr-2 hidden sm:block" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                <span className="text-yellow-300">Simboliq</span> Launch Offer:{" "}
                <span className="text-yellow-300">85% OFF</span>
              </h3>
              <p className="text-white/80 text-xs">
                First month only: All credits at special pricing
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
