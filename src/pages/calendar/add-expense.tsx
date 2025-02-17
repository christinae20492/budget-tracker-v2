"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import {
  addLocalExpense,
  generateExpenseId,
  addExpensetoEnvelope,
  Expense,
  getEnvelopes,
} from "@/app/utils/localStorage";
import { successToast, warnToast } from "@/app/utils/toast";

export default function AddExpenses() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedDate = searchParams ? searchParams.get("selectedDate") : null;
  const initialDate = selectedDate || new Date().toISOString().split("T")[0];

  const [location, setLocation] = useState("");
  const [envelopes, setEnvelopes] = useState<{ title: string }[]>([]);
  const [envelope, setEnvelope] = useState("");
  const [date, setDate] = useState(initialDate);
  const [amount, setAmount] = useState<string>("");
  const [comments, setComments] = useState("");

  useEffect(() => {
    const storedEnvelopes = getEnvelopes() || [];
    setEnvelopes(storedEnvelopes);
    if (storedEnvelopes.length > 0) {
      setEnvelope(storedEnvelopes[0].title);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!location || !envelope || !date || !amount) {
      warnToast("Please fill in all required fields.");
      return;
    }

    const newExpense: Expense = {
      id: generateExpenseId(),
      location,
      envelope,
      date,
      amount: parseFloat(amount),
      comments,
    };

    addLocalExpense(newExpense);
    addExpensetoEnvelope(newExpense);

    successToast(`Expense for ${date} added successfully`);
    router.push("/calendar");
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-center">Add New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="location"
            className="block text-sm font-medium text-gray-700"
          >
            Location of Purchase<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="envelope"
            className="block text-sm font-medium text-gray-700"
          >
            Category of Purchase<span className="text-red-500">*</span>
          </label>
          <select
            id="envelope"
            value={envelope}
            onChange={(e) => setEnvelope(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          >
            {envelopes.map((env) => (
              <option key={env.title} value={env.title}>
                {env.title}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date of Purchase<span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Total Cost ($)<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0"
            step="0.01"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          />
        </div>

        <div>
          <label
            htmlFor="comments"
            className="block text-sm font-medium text-gray-700"
          >
            Comments
          </label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            rows={3}
          ></textarea>
        </div>

        <div className="text-center">
          <button
            type="submit"
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-700"
          >
            Add Expense
          </button>
        </div>
      </form>
    </div>
  );
}
