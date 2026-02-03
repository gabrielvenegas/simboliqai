"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { Skeleton } from "../ui/skeleton";

interface CreditsDisplayProps {
  onBuyCredits: () => void;
}

export default function CreditsDisplay({ onBuyCredits }: CreditsDisplayProps) {
  const supabase = createClient();

  const { data: credits, isLoading } = useQuery<number>({
    queryKey: ["user-credits"],
    queryFn: async () => {
      const { data } = await supabase
        .from("user_credits")
        .select("credits")
        .single();

      return data?.credits || 0;
    },
  });

  return (
    <div className="flex items-center justify-between py-2 px-1">
      <div className="flex items-center space-x-2">
        {isLoading && <Skeleton className="h-5 w-[160px] bg-gray-200" />}
        {!isLoading && (
          <>
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium dark:text-foreground text-gray-600">
              {credits} {credits === 1 ? "crédito" : "créditos"} restantes
            </span>
          </>
        )}
      </div>

      <Button
        variant="ghost"
        size="sm"
        onClick={onBuyCredits}
        className="text-primary hover:text-primary hover:bg-primary/20"
      >
        Adicionar créditos
      </Button>
    </div>
  );
}
