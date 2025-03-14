import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(String(process.env.STRIPE_SECRET_KEY), {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const { amount, metadata } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `${metadata.credits} credits`,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.APP_URL}/?success-purchase=true`,
      cancel_url: `${process.env.APP_URL}/`,
      metadata,
    });

    return NextResponse.json({
      sessionId: session.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return Response.json(
      { error: "Failed to create payment intent" },
      { status: 500 },
    );
  }
}
