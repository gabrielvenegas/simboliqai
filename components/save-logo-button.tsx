import { cn } from "@/lib/utils";
import { CheckIcon, Save } from "lucide-react";
import { Button } from "./ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

type SaveLogoButtonProps = {
  onSave: () => Promise<void>;
};
export default function SaveLogoButton({ onSave }: SaveLogoButtonProps) {
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    try {
      await onSave();
      setSaved(true);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="flex"
    >
      <Button
        onClick={handleSave}
        variant="ghost"
        className={cn(
          "flex-1",
          saved
            ? "text-success hover:text-success"
            : "text-primary hover:text-primary",
        )}
      >
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.span
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
          {saved ? (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Saved to your gallery
            </motion.span>
          ) : (
            <motion.span
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
