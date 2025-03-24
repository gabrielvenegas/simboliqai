"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, Download, Loader2 } from "lucide-react";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import UserAvatarMenu from "@/components/user-avatar-menu";
import { Suspense, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { generateLogo, saveLogo } from "./actions";
import { Textarea } from "@/components/ui/textarea";
import confetti from "canvas-confetti";
import LogoViewer from "@/components/logo-viewer";
import SuccessPurchase from "@/components/success-purchase";
import { cn } from "@/lib/utils";
import MainBanner from "@/components/main-banner";
import Image from "next/image";
import SaveLogoButton from "@/components/save-logo-button";

const schema = z.object({
  brandName: z.string(),
  iconDescription: z.string(),
  fontStyle: z.string(),
});

export default function Home() {
  const queryClient = useQueryClient();
  const supabase = createClient();

  const [downloaded, setDownloaded] = useState(false);
  const [saved, setSaved] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    mode: "onSubmit",
    defaultValues: {
      brandName: "",
      iconDescription: "",
      fontStyle: "elegant",
    },
    resolver: zodResolver(schema),
  });

  const svgContainer = useRef<HTMLDivElement>(null);

  const { onToggle: toggleApiKeyModal, isOpen: apiKeyModalIsOpen } =
    useDisclosure();

  const { onToggle: toggleAuthModal, isOpen: authModalIsOpen } =
    useDisclosure();

  const { onToggle: toggleBuyCreditsModal, isOpen: buyCreditsModalIsOpen } =
    useDisclosure();

  const { data: user } = useQuery({
    queryKey: ["fetch-user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();

      if (!data || !data.user) return null;
      return { ...data.user };
    },
    staleTime: 1000 * 60 * 5,
    experimental_prefetchInRender: true,
    networkMode: "offlineFirst",
  });

  const { data: credits, isLoading: isCreditLoading } = useQuery<number>({
    queryKey: ["user-credits"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_credits")
        .select("credits")
        .single();

      return data?.credits || 0;
    },
  });

  const {
    mutate,
    data: generatedLogo,
    isPending,
  } = useMutation({
    mutationKey: ["generate-logo"],
    mutationFn: async (payload: {
      iconDescription: string;
      brandName: string;
      fontStyle: string;
      devMode?: boolean;
    }) => generateLogo(payload),
    onSuccess: async (data) => {
      if (data.success) {
        toast.success("Logo generated successfully!");

        await queryClient.invalidateQueries({
          queryKey: ["user-credits"],
          refetchType: "active",
          exact: true,
        });

        confetti()?.then(() => console.log("Generated logo"));
      }
    },
    onError: () => {
      toast.error(
        "Logo generation failed. Don't worry — no credits were deducted.",
      );
    },
  });

  const { mutate: saveLogoMutation, isPending: isSavingLogo } = useMutation({
    mutationKey: ["save-logo"],
    mutationFn: async (payload: {
      iconDescription: string;
      brandName: string;
      fontStyle: string;
    }) => {
      const svgElement = svgContainer.current?.querySelector("svg");
      if (!svgElement) {
        console.error("No SVG element found");
        return;
      }

      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svgElement);

      const blob = new Blob([svgString], {
        type: "image/svg+xml;charset=utf-8",
      });

      const file = new File([blob], "logo.svg", { type: "image/svg+xml" });

      return saveLogo(
        {
          iconDescription: payload.iconDescription,
          brandName: payload.brandName,
          fontStyle: payload.fontStyle,
          fontFamily: generatedLogo?.fontFamily,
        },
        file,
      );
    },
    onSuccess: async () => {
      toast.success("Logo saved successfully!");
      setSaved(true);
    },
    onError: () => {
      toast.error(
        "Logo saving failed. Don't worry — no credits were deducted.",
      );
    },
  });

  function onBuyCredits() {
    if (!user) {
      toast.error("Please sign in or register to buy credits.");
      toggleAuthModal();

      return;
    }

    toggleBuyCreditsModal();
  }

  function downloadLogo() {
    const svgElement = svgContainer.current?.querySelector("svg");
    if (!svgElement) {
      console.error("SVG element not found.");
      return;
    }

    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "logo.svg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloaded(true);

    setTimeout(() => {
      setDownloaded(false);
    }, 5000);
  }

  async function onSignOut() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  function onSubmit(payload: z.infer<typeof schema>) {
    setSaved(false);

    const requestPayload = {
      iconDescription: payload.iconDescription,
      brandName: payload.brandName,
      fontStyle: payload.fontStyle,
      devMode: false,
    };

    mutate(requestPayload);
  }

  async function handleSave() {
    if (!generatedLogo?.svg) return;

    const payload = form.getValues();
    saveLogoMutation(payload);
  }

  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-4 md:p-8">
      <FormProvider {...form}>
        <form
          className="flex justify-center w-full"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-4xl space-y-6"
          >
            <div
              className={cn(
                "flex gap-2 sm:gap-8 items-center",
                user ? "flex-row justify-end" : "flex-col sm:flex-row",
              )}
            >
              <MainBanner />
              <UserAvatarMenu
                user={user}
                onAuth={toggleAuthModal}
                onLogout={onSignOut}
              />
            </div>
            <div className="text-center md:relative">
              <Image
                className="justify-self-center"
                src="/logo.svg"
                alt="AI Logo Generator"
                width={400}
                height={100}
              />
              <p className="text-lg text-[#666666]">
                Create beautiful SVG logos in seconds
              </p>

              {/* <div className="absolute right-0 top-4 items-center space-x-2 flex"> */}
              {/* <Button variant="ghost" size="icon" onClick={toggleApiKeyModal}>
                  <Settings className="h-5 w-5 text-[#666666]" />
                  <span className="sr-only">API Settings</span>
                </Button> */}
              {/* </div> */}
            </div>

            <div className="border-b border-gray-100">
              <CreditsDisplay onBuyCredits={onBuyCredits} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="shadow-md border-gray-100">
                  <CardHeader>
                    <CardTitle>Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      name="brandName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="bandName">Brand name</FormLabel>
                          <FormControl>
                            <Input
                              id="brandName"
                              {...field}
                              placeholder="Enter your brand name"
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="iconDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="iconDescription">
                            Icon description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              id="iconDescription"
                              {...field}
                              placeholder="minimalistic flower design..."
                              required
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="fontStyle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Font style</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full border-[#ECF0F1]">
                                <SelectValue placeholder="Select a style" />
                              </SelectTrigger>
                            </FormControl>

                            <SelectContent>
                              <SelectItem value="elegant">Elegant</SelectItem>
                              <SelectItem value="energetic">
                                Energetic
                              </SelectItem>
                              <SelectItem value="calm">Calm</SelectItem>
                              <SelectItem value="professional">
                                Professional
                              </SelectItem>
                              <SelectItem value="playful">Playful</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-lg hover:shadow-primary/20"
                      disabled={
                        !user ||
                        credits! <= 0 ||
                        isPending ||
                        !form.formState.isValid
                      }
                    >
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : isCreditLoading ? (
                        "Loading Credits..."
                      ) : credits! > 0 ? (
                        "Generate Logo"
                      ) : (
                        "Insufficient credits"
                      )}
                    </Button>

                    <small className="text-gray-500">
                      * Each successfully generated logo costs 1 credit
                    </small>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="shadow-md border-gray-100 h-full flex flex-col">
                  <CardHeader>
                    <CardTitle>Logo Preview</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <div className="flex-1 flex items-center justify-center bg-[#ECF0F1] rounded-md p-4 mb-4">
                      <div className="w-full h-full flex flex-col items-center justify-center">
                        <AnimatePresence mode="wait">
                          {isPending ? (
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
                          ) : generatedLogo?.svg ? (
                            <motion.div
                              key="svg"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0 }}
                              className="w-full h-full flex flex-col items-center justify-center"
                            >
                              <LogoViewer
                                svgContainer={svgContainer}
                                svg={generatedLogo?.svg}
                              />
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
                    </div>
                    {generatedLogo?.svg && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex items-center justify-center"
                      >
                        <Button
                          onClick={downloadLogo}
                          variant="ghost"
                          className={cn(
                            downloaded
                              ? "text-success hover:text-success"
                              : "text-primary hover:text-primary",
                          )}
                        >
                          <AnimatePresence mode="wait">
                            {downloaded ? (
                              <motion.div
                                key="downloaded"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center"
                              >
                                <CheckIcon className="h-4 w-4" />
                                <span className="ml-2">Download</span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="download"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 10 }}
                                transition={{ duration: 0.2 }}
                                className="flex items-center"
                              >
                                <Download className="h-4 w-4" />
                                <span className="ml-2">Download</span>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Button>
                        <SaveLogoButton
                          onSave={handleSave}
                          isLoading={isSavingLogo}
                          saved={saved}
                        />
                      </motion.div>
                    )}

                    {/* {generatedLogo?.svg && (
                    )} */}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </form>

        {authModalIsOpen && <AuthModal onClose={toggleAuthModal} />}

        {apiKeyModalIsOpen && <ApiKeyModal onClose={toggleApiKeyModal} />}

        {buyCreditsModalIsOpen && (
          <BuyCreditsModal onClose={toggleBuyCreditsModal} user={user} />
        )}
      </FormProvider>

      <Suspense>
        <SuccessPurchase />
      </Suspense>
    </main>
  );
}
