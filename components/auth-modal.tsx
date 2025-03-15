"use client";

import type React from "react";

import { Loader2, X } from "lucide-react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { signIn, signUp } from "@/app/actions";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";

interface AuthModalProps {
  onClose: () => void;
}

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const signUpSchema = z.object({
  email: z.string().email("Email is required"),
  password: z
    .string()
    .min(6, "Password needs to be at least 6 characters long")
    .max(100),
});

export default function AuthModal({ onClose }: AuthModalProps) {
  const queryClient = useQueryClient();

  const signInForm = useForm<z.infer<typeof signInSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signInSchema),
  });

  const signUpForm = useForm<z.infer<typeof signUpSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(signUpSchema),
  });

  const { mutate: signUpMutation, isPending: isSigningUp } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (payload: z.infer<typeof signUpSchema>) => {
      return signUp(payload.email, payload.password);
    },
    onSuccess() {
      toast.success(
        "Account created successfully. Please, confirm your email.",
      );

      onClose();
    },
    onError() {
      toast.error("An error occurred while creating your account.");
    },
  });

  const { mutate: signInMutation, isPending: isSigningIn } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (payload: z.infer<typeof signInSchema>) => {
      return signIn(payload.email, payload.password);
    },
    async onSuccess() {
      toast.success("Logged in successfully.");

      await queryClient.invalidateQueries({
        queryKey: ["fetch-user"],
        refetchType: "active",
        exact: true,
      });

      await queryClient.invalidateQueries({
        queryKey: ["user-credits"],
        refetchType: "active",
        exact: true,
      });

      onClose();
    },
    onError() {
      toast.error("An error occurred while logging in.");
    },
  });

  function onSignIn(payload: z.infer<typeof signInSchema>) {
    signInMutation(payload);
  }

  function onSignUp(payload: z.infer<typeof signUpSchema>) {
    signUpMutation(payload);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      transition={{ duration: 0.1 }}
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
            <CardTitle className="text-2xl text-center">Welcome</CardTitle>
            <CardDescription className="text-center">
              Sign in to save and manage your logos
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <Form {...signInForm}>
                  <form
                    onSubmit={signInForm.handleSubmit(onSignIn)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">Email</Label>
                      <FormField
                        name="email"
                        control={signInForm.control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Input
                            id="signin-email"
                            type="email"
                            {...field}
                            placeholder="your@email.com"
                            required
                            autoComplete="email"
                            autoFocus
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Password</Label>
                      <FormField
                        name="password"
                        control={signInForm.control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Input
                            id="signin-password"
                            type="password"
                            {...field}
                            placeholder="••••••••"
                            autoComplete="current-password"
                            required
                          />
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-lg hover:shadow-primary/20"
                      disabled={isSigningIn}
                    >
                      {isSigningIn && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {isSigningIn ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              <TabsContent value="signup">
                <Form {...signUpForm}>
                  <form
                    onSubmit={signUpForm.handleSubmit(onSignUp)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <FormField
                        name="email"
                        control={signUpForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="signup-email">Email</FormLabel>
                            <FormControl>
                              <Input
                                id="signup-email"
                                type="email"
                                {...field}
                                placeholder="your@email.com"
                                required
                                autoComplete="email"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <FormField
                        name="password"
                        control={signUpForm.control}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel htmlFor="signup-password">
                              Password
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="signup-password"
                                type="password"
                                {...field}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground transition-all duration-300 hover:scale-[1.02] shadow-sm hover:shadow-lg hover:shadow-primary/20"
                      disabled={isSigningUp}
                    >
                      {isSigningUp && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}
                      {isSigningUp ? "Signing Up..." : "Create Account"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col space-y-2">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
              <Button variant="outline">Google</Button>
              <Button variant="outline">GitHub</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
