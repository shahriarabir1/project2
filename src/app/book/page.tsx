 "use client";
import { useState, useEffect } from "react";

import React from "react";
// import "../style.css";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [roomType, setRoomType] = useState<string>("");
  const [roomAmount, setRoomAmount] = useState<number>(1);
  const [addOns, setAddOns] = useState<string[]>([]);
  const [storedBooking, setStoredBooking] = useState<string | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("booking");
    if (storedData) {
      setStoredBooking(storedData);
    }
  }, []);

  const handleRoomTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRoomType(e.target.value);
  };

  const handleRoomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRoomAmount(parseInt(e.target.value));
  };

  const handleAddOnsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedAddOn = e.target.value;
    if (addOns.includes(selectedAddOn)) {
      setAddOns(addOns.filter((addOn) => addOn !== selectedAddOn));
    } else {
      setAddOns([...addOns, selectedAddOn]);
    }
  };
  const [totalCost, setTotalCost] = useState<number>(0);

  useEffect(() => {
    if (startDate && endDate) {
      const days = Math.ceil(
        (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24)
      );
      const roomPrice = roomType === "one-bed" ? 1000 : 2000;
      const totalRoomCost = roomPrice * roomAmount * days;
      const addOnsCost = addOns.length * 200 * days;
      const calculatedTotalCost = totalRoomCost + addOnsCost;
      if (startDate && endDate && startDate > endDate) {
        setTotalCost(0);
      } else {
        setTotalCost(calculatedTotalCost);
      }
    }
  }, [roomType, roomAmount, addOns, startDate, endDate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (startDate && endDate && startDate > endDate) {
      alert("Start date cannot be greater than end date");
      return;
    }

    // Retrieve existing booking data from local storage
    const existingBookingData = JSON.parse(
      localStorage.getItem("booking") || "[]"
    );

    // Create new booking object
    const newBooking = {
      name,
      email,
      startDate,
      endDate,
      roomType,
      roomAmount,
      addOns,
      totalCost,
    };

    // Append new booking data to existing array
    const updatedBookingData = [...existingBookingData, newBooking];

    // Store updated booking data array in local storage
    localStorage.setItem("booking", JSON.stringify(updatedBookingData));

    // Redirect to booklist page
    router.push("/booklist");
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mt-8 p-4 bg-gray-100 rounded-lg shadow-lg"
      >
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-bold">
            Name:
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="form-input mt-1 block w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 font-bold">
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input mt-1 block w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="startDate" className="block text-gray-700 font-bold">
            Check-in Date:
          </label>
          <input
            type="date"
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="endDate" className="block text-gray-700 font-bold">
            Check-out Date:
          </label>
          <input
            type="date"
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="roomType" className="block text-gray-700 font-bold">
            Room Type:
          </label>
          <select
            id="roomType"
            value={roomType}
            onChange={handleRoomTypeChange}
            className="form-select mt-1 block w-full"
            required
          >
            <option value="">Select Room Type</option>
            <option value="one-bed">One Bed</option>
            <option value="two-bed">Two Bed</option>
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="roomAmount" className="block text-gray-700 font-bold">
            Room Amount:
          </label>
          <input
            type="number"
            id="roomAmount"
            value={roomAmount}
            onChange={handleRoomAmountChange}
            className="form-input mt-1 block w-full"
            min={1}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 font-bold">Add-ons:</label>
          <div>
            <input
              type="checkbox"
              id="breakfast"
              value="breakfast"
              checked={addOns.includes("breakfast")}
              onChange={handleAddOnsChange}
              className="mr-2"
            />
            <label htmlFor="breakfast" className="mr-4">
              Breakfast
            </label>
            <input
              type="checkbox"
              id="lunch"
              value="lunch"
              checked={addOns.includes("lunch")}
              onChange={handleAddOnsChange}
              className="mr-2"
            />
            <label htmlFor="lunch" className="mr-4">
              Lunch
            </label>
            <input
              type="checkbox"
              id="dinner"
              value="dinner"
              checked={addOns.includes("dinner")}
              onChange={handleAddOnsChange}
              className="mr-2"
            />
            <label htmlFor="dinner" className="mr-4">
              Dinner
            </label>
            <input
              type="checkbox"
              id="ac"
              value="ac"
              checked={addOns.includes("ac")}
              onChange={handleAddOnsChange}
              className="mr-2"
            />
            <label htmlFor="ac" className="mr-4">
              AC
            </label>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Book Now
        </button>
      </form>
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Total Cost:</h2>
        <p>{totalCost} taka</p>
      </div>
    </div>
  );
};

export default page;