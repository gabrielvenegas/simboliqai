"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { numberToMoney } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { loadStripe } from "@stripe/stripe-js";
import { User } from "@supabase/supabase-js";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { CreditCard, Loader2, X } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Skeleton } from "./ui/skeleton";

type UserWithCredits = User;

interface BuyCreditsModalProps {
  onClose: () => void;
  user?: Partial<UserWithCredits> | null;
}

const $stripe = loadStripe(
  String(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
);

const schema = z.object({
  plan: z.enum(["small", "medium", "large"]).default("medium"),
});

export default function BuyCreditsModal({
  onClose,
  user,
}: BuyCreditsModalProps) {
  const supabase = createClient();
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      plan: "medium",
    },
  });

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("credits", {
          ascending: true,
        });

      return data;
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["checkout"],
    mutationFn: async ({
      user,
      selectedPlan,
    }: {
      user: Partial<UserWithCredits>;
      selectedPlan: any;
    }) => {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedPlan.price,
          metadata: {
            userId: user.id,
            credits: selectedPlan.credits,
          },
        }),
      });

      return response.json();
    },
  });

  const selectedPlan = useMemo(
    () => data?.find((plan) => plan.slug === form.watch("plan")),
    [data, form.watch("plan")],
  );

  async function onSubmit(payload: z.infer<typeof schema>) {
    const stripe = await $stripe;

    if (!stripe) {
      toast.error("Stripe não foi inicializado");

      return;
    }

    if (!user) {
      toast.error("Usuário não encontrado");
      return;
    }

    const selectedPlan = data?.find((plan) => plan.slug === payload.plan);

    const response = await mutateAsync({ user, selectedPlan });

    const { sessionId } = response;
    await stripe.redirectToCheckout({ sessionId });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.1 } }}
      transition={{ duration: 0.1 }}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={onClose}
          >
            <div
              className="w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
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
                  <CardTitle className="text-2xl">Comprar créditos</CardTitle>
                  <CardDescription>
                    Escolha um plano para comprar créditos para sua conta.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  {isLoading && (
                    <div className="flex flex-row gap-4">
                      <Skeleton className="h-[124px] w-[126px]" />
                      <Skeleton className="h-[124px] w-[126px]" />
                      <Skeleton className="h-[124px] w-[126px]" />
                    </div>
                  )}

                  {!isLoading && (
                    <FormField
                      control={form.control}
                      name="plan"
                      render={({ field }) => (
                        <FormItem id="plan-form-item" className="space-y-3">
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-row w-full space-y-1"
                              id="plan-radio-group"
                              name={field.name}
                            >
                              {data?.map((pkg) => (
                                <RadioGroupItem
                                  value={pkg.slug}
                                  key={pkg.id}
                                  id={pkg.id}
                                  className={`w-full ${
                                    field?.value === pkg.slug
                                      ? "border-primary bg-primary/10"
                                      : "border-gray-100 hover:border-primary hover:shadow-sm"
                                  }`}
                                >
                                  <div className="text-2xl font-light">
                                    {pkg.credits}
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    créditos
                                  </div>
                                  <div className="mt-3 font-medium">
                                    {numberToMoney(pkg.price / 100)}
                                  </div>
                                </RadioGroupItem>
                              ))}
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {selectedPlan && (
                    <Button
                      type="submit"
                      disabled={!selectedPlan || isPending}
                      className="w-full mt-4"
                    >
                      {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard className="mr-2 h-4 w-4" />
                      )}
                      {isPending
                        ? "Processando..."
                        : "Pagar" +
                          " " +
                          numberToMoney(selectedPlan?.price / 100)}
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </motion.div>
  );
}
