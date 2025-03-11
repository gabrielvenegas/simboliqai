import { createClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") || "";

  try {
    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.userId;
      const amountPaid = session.amount_total! / 100;
      const credits = session.metadata?.credits;

      if (!userId) {
        console.error("Missing user ID in metadata");
        return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
      }

      const supabase = createClient();

      const { error } = await supabase.from("credit_transactions").insert([
        {
          user_id: userId,
          transaction_type: "recharge",
          amount: credits,
          description: "Stripe checkout recharge",
          metadata: { stripeSessionId: session.id },
        },
      ]);

      if (error) {
        console.error("Error logging credit transaction:", error);
        return NextResponse.json(
          { error: "Failed to log credit transaction" },
          { status: 500 },
        );
      }

      console.log(
        `User ${userId} credited ${amountPaid} USD via Stripe checkout`,
      );
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 400 },
    );
  }
}
