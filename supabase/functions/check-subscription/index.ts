
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated or email not available");
    
    logStep("User authenticated", { userId: user.id, email: user.email });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", { apiVersion: "2023-10-16" });
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    
    if (customers.data.length === 0) {
      logStep("No customer found, updating unsubscribed state");
      await supabaseClient.from("subscribers").upsert({
        email: user.email,
        user_id: user.id,
        user_type: user.raw_user_meta_data?.type || 'freelancer',
        stripe_customer_id: null,
        subscribed: false,
        subscription_tier: null,
        subscription_end: null,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'email' });
      
      return new Response(JSON.stringify({ 
        subscribed: false, 
        subscription_tier: 'free',
        user_type: user.raw_user_meta_data?.type || 'freelancer'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const customerId = customers.data[0].id;
    logStep("Found Stripe customer", { customerId });

    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });
    
    const hasActiveSub = subscriptions.data.length > 0;
    let subscriptionTier = 'free';
    let subscriptionEnd = null;

    if (hasActiveSub) {
      const subscription = subscriptions.data[0];
      subscriptionEnd = new Date(subscription.current_period_end * 1000).toISOString();
      
      // Determine subscription tier from price
      const priceId = subscription.items.data[0].price.id;
      const price = await stripe.prices.retrieve(priceId);
      const amount = price.unit_amount || 0;
      
      if (amount === 1400) {
        subscriptionTier = "destaque";
      } else if (amount === 2900) {
        subscriptionTier = "profissional";
      } else if (amount === 3900) {
        subscriptionTier = "profissional";
      } else if (amount === 7900) {
        subscriptionTier = "avancado";
      }
      
      logStep("Active subscription found", { subscriptionId: subscription.id, tier: subscriptionTier });
    }

    const userType = user.raw_user_meta_data?.type || 'freelancer';
    
    await supabaseClient.from("subscribers").upsert({
      email: user.email,
      user_id: user.id,
      user_type: userType,
      stripe_customer_id: customerId,
      subscribed: hasActiveSub,
      subscription_tier: hasActiveSub ? subscriptionTier : null,
      subscription_end: subscriptionEnd,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'email' });

    // Update subscription limits
    const limits = {
      freelancer: {
        free: { applications: 3, events: null },
        destaque: { applications: null, events: null },
        profissional: { applications: null, events: null }
      },
      producer: {
        free: { applications: null, events: 1 },
        profissional: { applications: null, events: null },
        avancado: { applications: null, events: null }
      }
    };

    const currentLimits = limits[userType as keyof typeof limits]?.[subscriptionTier as keyof typeof limits.freelancer];
    
    await supabaseClient.from("subscription_limits").upsert({
      user_id: user.id,
      user_type: userType,
      subscription_tier: subscriptionTier,
      monthly_limit_applications: currentLimits?.applications,
      monthly_limit_events: currentLimits?.events,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });

    logStep("Updated database", { subscribed: hasActiveSub, subscriptionTier });
    
    return new Response(JSON.stringify({
      subscribed: hasActiveSub,
      subscription_tier: subscriptionTier,
      subscription_end: subscriptionEnd,
      user_type: userType
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
