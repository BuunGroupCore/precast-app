/**
 * Stripe Payment Integration for Express
 * @module stripePayment
 * @description Complete Stripe payment processing with webhooks and customer management
 */

import { Router, Request, Response } from "express";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16",
});

const router = Router();

interface CreatePaymentIntentBody {
  amount: number;
  currency?: string;
  metadata?: Record<string, string>;
}

/**
 * Create a payment intent for processing payments
 * @route POST /create-intent
 * @param {CreatePaymentIntentBody} req.body - Payment intent data
 * @returns {object} Client secret for payment processing
 */
router.post(
  "/create-intent",
  async (req: Request<{}, {}, CreatePaymentIntentBody>, res: Response) => {
    try {
      const { amount, currency = "usd", metadata } = req.body;

      if (!amount || amount <= 0) {
        return res.status(400).json({ error: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        automatic_payment_methods: {
          enabled: true,
        },
        metadata,
      });

      res.json({
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).json({
        error: error instanceof Error ? error.message : "Failed to create payment intent",
      });
    }
  }
);

/**
 * Webhook endpoint for processing Stripe events
 * @route POST /webhook
 * @param {Request} req - Express request with Stripe event data
 * @returns {object} Confirmation of event processing
 */
router.post("/webhook", async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"] as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    console.error("Stripe webhook secret not configured");
    return res.status(500).send("Webhook Error: Secret not configured");
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return res
      .status(400)
      .send(`Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`);
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log("Payment succeeded:", paymentIntent.id);
      break;

    case "payment_intent.payment_failed":
      const failedPayment = event.data.object as Stripe.PaymentIntent;
      console.log("Payment failed:", failedPayment.id);
      break;

    case "charge.succeeded":
      const charge = event.data.object as Stripe.Charge;
      console.log("Charge succeeded:", charge.id);
      break;

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      const subscription = event.data.object as Stripe.Subscription;
      console.log(`Subscription ${event.type}:`, subscription.id);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
});

/**
 * Retrieve payment methods for a customer
 * @route GET /payment-methods/:customerId
 * @param {string} req.params.customerId - Stripe customer ID
 * @returns {object} List of customer's payment methods
 */
router.get("/payment-methods/:customerId", async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: "card",
    });

    res.json(paymentMethods.data);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to fetch payment methods",
    });
  }
});

/**
 * Create a new Stripe customer
 * @route POST /create-customer
 * @param {object} req.body - Customer data (email, name, metadata)
 * @returns {object} Created customer object
 */
router.post("/create-customer", async (req: Request, res: Response) => {
  try {
    const { email, name, metadata } = req.body;

    const customer = await stripe.customers.create({
      email,
      name,
      metadata,
    });

    res.json(customer);
  } catch (error) {
    console.error("Error creating customer:", error);
    res.status(500).json({
      error: error instanceof Error ? error.message : "Failed to create customer",
    });
  }
});

export default router;
