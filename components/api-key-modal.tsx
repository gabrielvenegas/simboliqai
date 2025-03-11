"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField } from "./ui/form";

interface ApiKeyModalProps {
  onClose: () => void;
}

const schema = z.object({
  apiKey: z.string().min(1).max(100),
});

export default function ApiKeyModal({ onClose }: ApiKeyModalProps) {
  const form = useForm<z.infer<typeof schema>>({
    defaultValues: {
      apiKey: localStorage.getItem("replicateApiKey") || "",
    },
    resolver: zodResolver(schema),
  });

  function onSubmit({ apiKey }: z.infer<typeof schema>) {
    localStorage.setItem("replicateApiKey", apiKey.trim());
    onClose();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={onClose}
        >
          <div className="w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <Card className="relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>

              <CardHeader>
                <CardTitle className="text-2xl">Replicate API Key</CardTitle>
                <CardDescription>
                  Enter your Replicate API key to generate logos
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="apiKey">API Key</Label>
                  <FormField
                    name="apiKey"
                    control={form.control}
                    render={({ field }) => (
                      <Input
                        id="apiKey"
                        type="password"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Enter your Replicate API key"
                        className="border-[#ECF0F1]"
                        autoComplete="off"
                        autoFocus
                      />
                    )}
                  />
                  <div className="text-xs text-[#666666] space-y-2">
                    <p>
                      You need a Replicate API key to generate logos.
                      <a
                        href="https://replicate.com/account/api-tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary ml-1 hover:underline"
                      >
                        Get one here
                      </a>
                      .
                    </p>
                    <p>
                      Make sure to copy the full API key, which starts with
                      "r8_".
                    </p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  disabled={!form.formState.isValid}
                  className="bg-primary hover:bg-primary-hover text-white"
                  type="submit"
                >
                  Save & Continue
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </form>
    </Form>
  );
}
