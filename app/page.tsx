"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Download, ExternalLink, Loader2, Save, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import AuthModal from "@/components/auth-modal";
import ApiKeyModal from "@/components/api-key-modal";
import CreditsDisplay from "@/components/credits-display/credits-display";
import BuyCreditsModal from "@/components/buy-credits-modal";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDisclosure } from "@/hooks/use-disclosure";
import { createClient } from "@/lib/supabase/client";
import { useQuery } from "@tanstack/react-query";
import UserAvatarMenu from "@/components/user-avatar-menu";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import Autocomplete from "@/components/ui/autocomplete";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const schema = z.object({
  brandName: z.string().min(2).max(100),
  iconDescription: z.string().min(2).max(100),
  sentiment: z.string().min(2).max(100),
  colorPalette: z.string().min(2).max(100),
});

export default function Home() {
  const searchParams = useSearchParams();
  const successPurchase = searchParams.get("success-purchase") === "true";

  const supabase = createClient();

  const {
    data: user,
    isLoading: isLoadingUser,
    refetch: refetchUser,
    isRefetching: isRefetchingUser,
  } = useQuery({
    queryKey: ["fetch-user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      return data?.user;
    },
    staleTime: 1000 * 60 * 5,
    experimental_prefetchInRender: true,
    networkMode: "offlineFirst",
  });

  const { onToggle: toggleApiKeyModal, isOpen: apiKeyModalIsOpen } =
    useDisclosure();

  const { onToggle: toggleAuthModal, isOpen: authModalIsOpen } =
    useDisclosure();

  const { onToggle: toggleBuyCreditsModal, isOpen: buyCreditsModalIsOpen } =
    useDisclosure();

  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      brandName: "",
      iconDescription: "",
      sentiment: "elegant",
      colorPalette: "",
    },
    resolver: zodResolver(schema),
  });

  const generateLogo = async () => {
    try {
      // Construct the request payload with both the icon and brand text info.
      const requestPayload = {
        iconDescription,
        brandName,
        sentiment,
        apiKey,
      };

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      });

      // Handle non-JSON responses
      let data;
      try {
        data = await response.json();
      } catch (e) {
        const text = await response.text();
        throw new Error(
          `Server returned non-JSON response: ${text.substring(0, 100)}...`,
        );
      }

      if (data.success) {
      } else {
      }
    } catch (error) {
    } finally {
    }
  };

  const downloadSvg = () => {
    if (!svgUrl) return;

    // Open the SVG URL in a new tab
    window.open(svgUrl, "_blank");
  };

  useEffect(() => {
    console.log(successPurchase);
    if (successPurchase) {
      const timerId = setTimeout(() => {
        toast.success("Thank you for your purchase!", {
          className: "bg-green-500 text-white p-4 rounded-md",
        });
      });

      const url = new URL(window.location.href);
      url.searchParams.delete("success-purchase");
      window.history.replaceState({}, "", url.toString());

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [successPurchase]);

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 md:p-8">
      <FormProvider {...form}>
        <form className="flex justify-center w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl"
          >
            <div className="text-center mb-6 relative">
              <h1 className="text-4xl font-bold text-[#333333] mb-2">
                AI Logo Generator
              </h1>
              <p className="text-lg text-[#666666]">
                Create beautiful SVG logos in seconds
              </p>

              <div className="absolute right-0 top-0 items-center space-x-2 flex">
                <UserAvatarMenu
                  user={user}
                  onAddMoreCredits={toggleBuyCreditsModal}
                  onAuth={toggleAuthModal}
                  onLogout={() => {}}
                />
                <Button variant="ghost" size="icon" onClick={toggleApiKeyModal}>
                  <Settings className="h-5 w-5 text-[#666666]" />
                  <span className="sr-only">API Settings</span>
                </Button>
              </div>
            </div>

            <div className="mb-6 border-b border-gray-100">
              <CreditsDisplay onBuyCredits={toggleBuyCreditsModal} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="shadow-md">
                  <CardContent className="pt-6">
                    <form
                      className="space-y-4"
                      onSubmit={(e) => {
                        e.preventDefault();
                        generateLogo();
                      }}
                    >
                      <div className="space-y-2">
                        <Label htmlFor="brandName">Brand Name</Label>
                        <Input
                          id="brandName"
                          value={brandName}
                          onChange={(e) => setBrandName(e.target.value)}
                          placeholder="Enter your brand name"
                          className="border-[#ECF0F1] focus:border-primary focus:ring-primary"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="iconDescription">
                          Icon Description
                        </Label>
                        <Input
                          id="iconDescription"
                          value={iconDescription}
                          onChange={(e) => setIconDescription(e.target.value)}
                          placeholder="Describe your icon (e.g., minimalist clock, abstract figure)"
                          className="border-[#ECF0F1]"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sentiment">Logo Style</Label>
                        <Select value={sentiment} onValueChange={setSentiment}>
                          <SelectTrigger className="w-full border-[#ECF0F1]">
                            <SelectValue placeholder="Select a style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="elegant">Elegant</SelectItem>
                            <SelectItem value="energetic">Energetic</SelectItem>
                            <SelectItem value="calm">Calm</SelectItem>
                            <SelectItem value="professional">
                              Professional
                            </SelectItem>
                            <SelectItem value="playful">Playful</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sentiment">Color Style</Label>
                        <Select value={sentiment} onValueChange={setSentiment}>
                          <SelectTrigger className="w-full border-[#ECF0F1]">
                            <SelectValue placeholder="Select a color style" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="elegant">Warm</SelectItem>
                            <SelectItem value="energetic">Cold</SelectItem>
                            <SelectItem value="bright">Bright</SelectItem>
                            <SelectItem value="dark">Dark</SelectItem>
                            <SelectItem value="pastel">Pastel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Autocomplete />
                      </div>

                      <Button
                        type="submit"
                        disabled={
                          isGenerating ||
                          !brandName ||
                          !iconDescription ||
                          !apiKey ||
                          credits <= 0
                        }
                        className="w-full bg-primary hover:bg-primary-hover text-white"
                      >
                        {isGenerating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Generating...
                          </>
                        ) : !apiKey ? (
                          "Add API Key to Generate"
                        ) : credits <= 0 ? (
                          "Add Credits to Generate"
                        ) : (
                          "Generate Logo"
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="shadow-md h-full flex flex-col">
                  <CardContent className="pt-6 flex-1 flex flex-col">
                    <h2 className="text-xl font-semibold text-[#333333] mb-4">
                      Logo Preview
                    </h2>

                    <div className="flex-1 flex items-center justify-center bg-[#ECF0F1] rounded-md p-4 mb-4">
                      <AnimatePresence mode="wait">
                        {isGenerating ? (
                          <motion.div
                            key="loading"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex flex-col items-center justify-center"
                          >
                            <Loader2 className="h-12 w-12 animate-spin text-primary" />
                            <p className="mt-2 text-[#666666]">
                              Creating your logo...
                            </p>
                          </motion.div>
                        ) : svgUrl ? (
                          <motion.div
                            key="svg"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full flex flex-col items-center justify-center"
                          >
                            <img
                              src={svgUrl}
                              alt={`${brandName} Logo`}
                              style={{ objectFit: "contain" }}
                            />
                            <a
                              href={svgUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 text-sm text-[#666666] hover:text-primary flex items-center"
                            >
                              View full SVG{" "}
                              <ExternalLink className="ml-1 h-3 w-3" />
                            </a>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="placeholder"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center text-[#666666]"
                          >
                            <p>Your logo will appear here</p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {svgUrl && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex gap-2"
                      >
                        <Button
                          onClick={downloadSvg}
                          className="flex-1 bg-[#27AE60] hover:bg-[#219955] text-white"
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Download SVG
                        </Button>
                        <Button
                          onClick={() => setShowAuthModal(true)}
                          className="flex-1 bg-primary hover:bg-primary-hover text-white"
                        >
                          <Save className="mr-2 h-4 w-4" />
                          Save Logo
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </form>

        {authModalIsOpen && (
          <AuthModal onClose={toggleAuthModal} refetchUser={refetchUser} />
        )}

        {apiKeyModalIsOpen && <ApiKeyModal onClose={toggleApiKeyModal} />}

        {buyCreditsModalIsOpen && (
          <BuyCreditsModal onClose={toggleBuyCreditsModal} user={user} />
        )}
      </FormProvider>
    </main>
  );
}
