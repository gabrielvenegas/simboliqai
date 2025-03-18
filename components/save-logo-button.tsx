"use client";

import { cn } from "@/lib/utils";
import { Loader, Save, CheckIcon } from "lucide-react";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";

type SaveLogoButtonProps = {
  onSave: () => void;
  isLoading?: boolean;
  saved: boolean;
};

export default function SaveLogoButton({
  onSave,
  isLoading,
  saved,
}: SaveLogoButtonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex"
    >
      <Button
        onClick={onSave}
        disabled={isLoading || saved}
        variant="ghost"
        className={cn(
          "flex-1 text-primary hover:text-primary",
          isLoading && "cursor-wait",
        )}
      >
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loading-icon"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="h-4 w-4"
            >
              <Loader className="animate-spin" />
            </motion.span>
          ) : saved ? (
            <motion.span
              key="saved-icon"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="h-4 w-4"
            >
              <CheckIcon />
            </motion.span>
          ) : (
            <motion.span
              key="save-icon"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="h-4 w-4"
            >
              <Save />
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.span
              key="loading-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Saving...
            </motion.span>
          ) : saved ? (
            <motion.span
              key="saved-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Saved
            </motion.span>
          ) : (
            <motion.span
              key="save-text"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Save logo
            </motion.span>
          )}
        </AnimatePresence>
      </Button>
    </motion.div>
  );
}
