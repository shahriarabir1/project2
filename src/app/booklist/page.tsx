"use client";
import BookingList from "@/components/BookList";
import { CardElement, Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React from "react";

const Page = () => {
  const stripePromise = loadStripe(process.env.STRIPE_PUBLISHED_KEY!);
  return (
    <Elements stripe={stripePromise}>
      <CardElement />
      <div>
        <BookingList />
      </div>
    </Elements>
  );
};

export default Page;
