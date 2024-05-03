"use client";
import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";

import axios from "axios";
import { useRouter } from "next/navigation";
interface Booking {
  name: string;
  email: string;
  startDate: Date;
  endDate: Date;
  roomType: string;
  roomAmount: number;
  addOns: string[];
  totalCost: number;
}
const BookingList = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const router = useRouter();
 
  const stripe = useStripe();
  const elements = useElements();
  useEffect(() => {
    const storedData = localStorage.getItem("booking");
    if (storedData) {
      setBookings(JSON.parse(storedData));
    }
  }, []);

  const handleDelete = (index: number) => {
    const updatedBookings = [...bookings];
    updatedBookings.splice(index, 1);
    setBookings(updatedBookings);
    localStorage.setItem("booking", JSON.stringify(updatedBookings));
  };
  const handlePayment = async (index: number) => {
    const allBook = [...bookings];
    const newBook: Booking = allBook.find((_, i) => i === index);

    const cardElement = elements?.getElement("card");

    try {
      if (!stripe || !cardElement) return null;
      const { data } = await axios.post("/api/payment", {
        data: { amount: newBook?.totalCost },
      });
      const clientSecret = data;

      await stripe?.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-lg font-semibold">Booking List</h2>
      {bookings.length > 0 ? (
        <ul className="flex flex-col gap-5">
          {bookings.map((booking, index) => (
            <li key={index} className="mb-2">
              <div>
                <strong>Name:</strong> {booking.name}
              </div>
              <div>
                <strong>Email:</strong> {booking.email}
              </div>
              <div>
                <strong>Check-in Date:</strong> {booking.startDate}
              </div>
              <div>
                <strong>Check-out Date:</strong> {booking.endDate}
              </div>
              <div>
                <strong>Room Type:</strong> {booking.roomType}
              </div>
              <div>
                <strong>Room Amount:</strong> {booking.roomAmount}
              </div>
              <div>
                <strong>Add-ons:</strong>{" "}
                {booking.addOns.length > 0 ? booking.addOns.join(", ") : "None"}
              </div>
              <div>
                <strong>Total Cost:</strong> {booking.totalCost} taka
              </div>
              <button
                onClick={() => handleDelete(index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mt-2 mr-10"
              >
                Delete
              </button>
              <button
                onClick={() => handlePayment(index)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mt-2"
              >
                Payment
              </button>
            </li>
          ))}
        </ul>
      ) : (
        "No Data Found"
      )}
    </div>
  );
};

export default BookingList;
