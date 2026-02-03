"use client";

import { signIn, signUp } from "@/app/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Provider } from "@supabase/supabase-js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Loader2, X } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Checkbox } from "./ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";

interface AuthModalProps {
  onClose: () => void;
}

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

const signUpSchema = z.object({
  email: z.string().email("O e-mail é obrigatório"),
  password: z
    .string()
    .min(6, "A senha precisa ter pelo menos 6 caracteres")
    .max(100),
  terms: z.boolean().refine((value) => value, {
    message: "Você deve concordar com os termos e condições",
  }),
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
      terms: false,
    },
    resolver: zodResolver(signUpSchema),
  });

  const { mutate: signUpMutation, isPending: isSigningUp } = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: async (payload: z.infer<typeof signUpSchema>) => {
      return signUp(payload.email, payload.password);
    },
    onSuccess() {
      toast.success("Conta criada com sucesso. Confirme seu e-mail.");

      onClose();
    },
    onError() {
      toast.error("Ocorreu um erro ao criar sua conta.");
    },
  });

  const { mutate: signInMutation, isPending: isSigningIn } = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: async (payload: z.infer<typeof signInSchema>) => {
      return signIn(payload.email, payload.password);
    },
    async onSuccess() {
      toast.success("Login realizado com sucesso.");

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
      toast.error("Ocorreu um erro ao fazer login.");
    },
  });

  function onSignIn(payload: z.infer<typeof signInSchema>) {
    signInMutation(payload);
  }

  function onSignUp(payload: z.infer<typeof signUpSchema>) {
    signUpMutation(payload);
  }

  async function signInWith(provider: Provider) {
    const supabase = createClient();
    let options: any = {
      redirectTo: "http://simboliqai.com/auth/callback",
    };

    if (provider === "google") {
      options.queryParams = {
        access_type: "offline",
        prompt: "consent",
      };
    }
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: options,
    });

    if (error) {
      console.error("OAuth error:", error.message);
      toast.error("Falha ao entrar com o GitHub.");
      return;
    }

    if (data.url) {
      window.location.href = data.url; // Redirect client-side
    }
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
            <span className="sr-only">Fechar</span>
          </Button>

          <CardHeader>
            <CardTitle className="text-2xl text-center">Bem-vindo</CardTitle>
            <CardDescription className="text-center">
              Entre para salvar e gerenciar seus logos
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin">Entrar</TabsTrigger>
                <TabsTrigger value="signup">Criar conta</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <Form {...signInForm}>
                  <form
                    onSubmit={signInForm.handleSubmit(onSignIn)}
                    className="space-y-4"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="signin-email">E-mail</Label>
                      <FormField
                        name="email"
                        control={signInForm.control}
                        rules={{ required: true }}
                        render={({ field }) => (
                          <Input
                            id="signin-email"
                            type="email"
                            {...field}
                            placeholder="seu@email.com"
                            required
                            autoComplete="email"
                            autoFocus
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signin-password">Senha</Label>
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
                      {isSigningIn ? "Entrando..." : "Entrar"}
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
                            <FormLabel htmlFor="signup-email">E-mail</FormLabel>
                            <FormControl>
                              <Input
                                id="signup-email"
                                type="email"
                                {...field}
                                placeholder="seu@email.com"
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
                              Senha
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
                    <div className="space-y-2">
                      <FormField
                        name="terms"
                        control={signUpForm.control}
                        render={({ field }) => (
                          <FormItem className="flex flex-wrap items-center">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>
                              Aceito os{" "}
                              <Link
                                className="underline"
                                href="/tos"
                                target="_blank"
                              >
                                termos e condições
                              </Link>
                            </FormLabel>
                            <div className="w-full mt-2">
                              <FormMessage />
                            </div>
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
                      {isSigningUp ? "Criando conta..." : "Criar conta"}
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
                  Ou continue com
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full">
              <Button onClick={() => signInWith("google")} variant="outline">
                Google
              </Button>
              <Button onClick={() => signInWith("github")} variant="outline">
                GitHub
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
