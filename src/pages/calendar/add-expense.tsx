"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { failToast, successToast, warnToast } from "@/app/utils/toast";
import Head from "next/head";
import Layout from "@/app/components/ui/Layout";
import { addExpenseToEnvelope, createExpense } from "@/app/server/expenses";
import { useSession } from "next-auth/react";
import { getAllEnvelopes } from "@/app/server/envelopes";
import { Envelope } from "@/app/utils/types";
import LoadingScreen from "@/app/components/ui/Loader";
import { faSquareCaretDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function AddExpenses() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedDate = searchParams ? searchParams.get("selectedDate") : null;
  const initialDate = selectedDate || new Date().toISOString().split("T")[0];

  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useState("");
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [envelope, setEnvelope] = useState("");
  const [date, setDate] = useState(initialDate);
  const [amount, setAmount] = useState<string>("");
  const [comments, setComments] = useState("");

  const { data: session, status } = useSession();

  const fetchData = async () => {
    setLoading(true);
    const storedEnvelopes = await getAllEnvelopes(session, status);
    if (!storedEnvelopes) return null;
    setEnvelopes(storedEnvelopes);
    if (storedEnvelopes.length > 0) {
      setEnvelope(storedEnvelopes[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [session, status]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Starting post");

    if (loading || status === "loading" || status === "unauthenticated") {
      warnToast("Please wait for authentication/data to load.");
      return;
    }

    console.log(status);

    if (!location || !envelope || !date || !amount) {
      warnToast("Please fill in all required fields.");
      return;
    }

    console.log(envelope);

    setLoading(true);

    if (!envelopes || envelopes.length === 0) {
      warnToast("Envelopes not loaded.");
      return;
    }

    const result = await createExpense(
      location,
      envelope,
      date,
      amount,
      comments,
      session,
      status
    );

    setLoading(false);

    if (result) {
      router.push("/calendar");
      successToast(`Expense for ${date} added successfully`);
    }
    successToast(`Expense for ${date} added successfully`);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      <Head>
        <title>Add Expense for {date}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div
        className="md:max-w-xl mx-auto md:mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white
            w-full mt-1"
      >
        <h2 className="text-center">Add New Expense</h2>
        <form onSubmit={(e) => handleSubmit(e)} className="space-y-4">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Location of Purchase<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="envelope"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Category of Purchase<span className="text-red-500">*</span>
            </label>
            <select
              id="envelope"
              value={envelope}
              onChange={(e) => setEnvelope(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
            >
              {envelopes.map((env) => (
                <option key={env.id} value={env.id}>
                  {env.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Date of Purchase<span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-white"
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
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
            />
          </div>

          <div>
            <label
              htmlFor="comments"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              Comments
            </label>
            <textarea
              id="comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
              rows={3}
            ></textarea>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 rounded-l-md bg-blue-500 text-white hover:bg-blue-700 dark:bg-blue-400"
            >
              Add Expense
            </button>
            <span className="p-3 rounded-r-md bg-blue-950 text-white hover:bg-blue-800 dark:bg-blue-dark"><FontAwesomeIcon icon={faSquareCaretDown} /></span>
          </div>
        </form>
      </div>
    </Layout>
  );
}
