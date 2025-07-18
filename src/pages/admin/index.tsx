"use client";

import React, { useEffect, useState } from "react";
import Layout from "@/app/components/ui/Layout";
import {
  successToast,
  failToast,
  progressToast,
  warnToast,
} from "@/app/utils/toast";
import { ConfirmModal } from "@/app/components/ui/ConfirmModal";
import LoadingScreen from "@/app/components/ui/Loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { User } from "@/generated/prisma/client";
import { getWeeklyExpenditureDetails } from "@/app/utils/expenses";
import { Expense, Income, Envelope } from "@/app/utils/types";

interface envelopeObj {
  name: string,
  spent: string,
  allocated: string,
}

export default function AdminUpdateEmailSender() {
  const [updateTitle, setUpdateTitle] = useState("");
  const [featuresJson, setFeaturesJson] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  const [selectedUserId, setSelectedUserId] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const [userIncomes, setUserIncomes] = useState<Income[]>([]);
  const [userExpenses, setUserExpenses] = useState<Expense[]>([]);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [userEnvelopeData, setUserEnvelopeData] = useState<envelopeObj | null>(null)
  const [isFetchingFinancialData, setIsFetchingFinancialData] = useState(false);

  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [remainingBudget, setRemainingBudget] = useState<number>(0);
  const [topCategories, setTopCategories] = useState<string>("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    if (!session.user.isAdmin) {
      warnToast("You are not authorized to access this page.");
      router.push("/");
    }

  }, [session, status, router]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user/get");
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          console.error("Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    setLoading(true);
    fetchUsers();
    setLoading(false);

  }, [session, status]);

  useEffect(() => {
    const fetchAndCalculateBudget = async () => {
      if (!selectedUserId) {
        setStartDate("");
        setEndDate("");
        setTotalIncome(0);
        setTotalExpenses(0);
        setRemainingBudget(0);
        setTopCategories("");
        setUserIncomes([]);
        setUserExpenses([]);
        return;
      }

      setIsFetchingFinancialData(true);
      setStatusMessage("Fetching user's financial data...");
      try {
        const response = await fetch(`/api/data/${selectedUserId}`);
        if (response.ok) {
          const { incomes, expenses, envelopes } = await response.json();
          setUserIncomes(incomes);
          setUserExpenses(expenses);
          setEnvelopes(envelopes)

          const weeklyDetails = getWeeklyExpenditureDetails(incomes, expenses);

          setTotalIncome(weeklyDetails.incomeTotals);
          setTotalExpenses(weeklyDetails.expenseTotals);
          setRemainingBudget(weeklyDetails.spendingDifference);

          const getEnvelopeTitle = (envelopeId: string): string => {
            const envelope = envelopes.find((env: Envelope) => env.id === envelopeId);
            return envelope ? envelope.title : "Unknown Envelope";
          };

          const getEnvelopeData = (envelopeId: string) => {
            const envelope = envelopes.find((env: Envelope) => env.id === envelopeId);
            if (envelope) {
              return envelope
            }
          };

          const formattedTopCategories = weeklyDetails.frequentEnvelope
            ? weeklyDetails.frequentEnvelope
            : "";

          setTopCategories(getEnvelopeTitle(formattedTopCategories));

          const now = new Date();
          const today = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate()
          );
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(today.getDate() - 6);

          setStartDate(sevenDaysAgo.toISOString().split("T")[0]);
          setEndDate(today.toISOString().split("T")[0]);

          setStatusMessage("Financial data loaded and calculated.");
        } else {
          const errorData = await response.json();
          setStatusMessage(
            `Error fetching financial data: ${errorData.message || "Unknown error"}`
          );
          console.error("Failed to fetch user financial data:", errorData);
          setStartDate("");
          setEndDate("");
          setTotalIncome(0);
          setTotalExpenses(0);
          setRemainingBudget(0);
          setTopCategories("");
          setUserIncomes([]);
          setUserExpenses([]);
        }
      } catch (error) {
        setStatusMessage(
          "An unexpected error occurred while fetching financial data."
        );
        console.error("Error fetching financial data:", error);
        setStartDate("");
        setEndDate("");
        setTotalIncome(0);
        setTotalExpenses(0);
        setRemainingBudget(0);
        setTopCategories("");
        setUserIncomes([]);
        setUserExpenses([]);
      } finally {
        setIsFetchingFinancialData(false);
      }
    };

    fetchAndCalculateBudget();
  }, [selectedUserId]);

  const handleSendEmails = async () => {
    setLoading(true);
    try {
      const featuresList = JSON.parse(featuresJson);

      progressToast("Sending update emails to all users...");

      const response = await fetch("/api/email/all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updateTitle, featuresList }),
      });

      const result = await response.json();

      if (response.ok) {
        successToast(result.message || "Emails sent successfully!");
      } else {
        failToast(result.message || "Failed to send emails.");
      }
    } catch (error) {
      failToast("Invalid JSON or network error.");
      console.error("Send emails error:", error);
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  };

  const handleSendWeeklyBudgetUpdate = async () => {
    if (!selectedUserId || !startDate || !endDate) {
      setStatusMessage("Please select a user and ensure dates are populated.");
      return;
    }

    setIsSending(true);
    setStatusMessage("Sending weekly budget update...");

    const parsedTopCategories = topCategories
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean) 
      .map((name) => ({ name, amount: 0 }));

    try {
      const response = await fetch("/api/email/opt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUserId,
          startDate,
          endDate,
          totalIncome,
          totalExpenses,
          remainingBudget,
          topCategories: parsedTopCategories,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setStatusMessage(`Success: ${data.message}`);
      } else {
        setStatusMessage(`Error: ${data.message || "Failed to send email"}`);
      }
    } catch (error) {
      console.error("Error sending budget update:", error);
      setStatusMessage("An unexpected error occurred.");
    } finally {
      setIsSending(false);
    }
  };

  if (
    status === "loading" ||
    (status === "authenticated" && !session?.user?.isAdmin) ||
    loading
  ) {
    return <LoadingScreen />;
  }

  return (
    <Layout>
      {loading && <LoadingScreen />}

      {confirm && (
        <ConfirmModal
          dialogue="Are you sure you want to send this update email to ALL users?"
          buttonOne="Send Emails"
          buttonOneAction={handleSendEmails}
          buttonTwo="Cancel"
          buttonTwoAction={() => setConfirm(false)}
        />
      )}

      <div className="max-w-xl mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
        <h1 className="header text-center mb-6">
          Send Update Email to All Users
        </h1>

        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
          Update Title:
        </label>
        <input
          type="text"
          value={updateTitle}
          onChange={(e) => setUpdateTitle(e.target.value)}
          className="text-input mb-4"
          placeholder="e.g., Exciting New Features!"
        />

        <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
          Features List (JSON array):
        </label>
        <textarea
          value={featuresJson}
          onChange={(e) => setFeaturesJson(e.target.value)}
          className="w-full h-40 p-3 border rounded mb-4 dark:bg-gray-700 dark:text-gray-100"
          placeholder={`[
  {
    "title": "Feature 1",
    "description": "Description of feature 1",
    "imageUrl": "https://...",
    "linkUrl": "https://..."
  },
  ...
]`}
        />

        <button
          onClick={() => setConfirm(true)}
          disabled={loading || !updateTitle || !featuresJson}
          className="button w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          Preview & Send Update Emails
        </button>

        <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
          <strong>Payload Preview:</strong>
          <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded mt-2 overflow-x-auto max-h-60">
            {JSON.stringify(
              {
                updateTitle,
                featuresList: (() => {
                  try {
                    return JSON.parse(featuresJson);
                  } catch {
                    return "Invalid JSON";
                  }
                })(),
              },
              null,
              2
            )}
          </pre>
        </div>

        <div className="block h-4 my-9 w-full bg-black"></div>

        <div>
          <h2 className="text-center">Send Personal Weekly Budget Update</h2>
          <div style={{ marginBottom: "15px" }}>
            <label htmlFor="userSelect">Select User:</label>
            <select
              id="userSelect"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              disabled={isSending || isFetchingFinancialData}
              style={{ marginLeft: "10px", padding: "8px" }}
            >
              <option value="">-- Select a User --</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.username || user.email} ({user.id})
                </option>
              ))}
            </select>
            {isFetchingFinancialData && (
              <span style={{ marginLeft: "10px" }}>Loading data...</span>
            )}
          </div>

          <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
            <div>
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                readOnly
                disabled={isSending || isFetchingFinancialData}
                style={{
                  marginLeft: "5px",
                  padding: "8px",
                  cursor: "not-allowed",
                }}
              />
            </div>
            <div>
              <label htmlFor="endDate">End Date:</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                readOnly
                disabled={isSending || isFetchingFinancialData}
                style={{
                  marginLeft: "5px",
                  padding: "8px",
                  cursor: "not-allowed",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
            <div>
              <label htmlFor="totalIncome">Total Income:</label>
              <input
                type="number"
                id="totalIncome"
                value={totalIncome}
                readOnly
                disabled={isSending || isFetchingFinancialData}
                style={{
                  marginLeft: "5px",
                  padding: "8px",
                  cursor: "not-allowed",
                }}
              />
            </div>
            <div>
              <label htmlFor="totalExpenses">Total Expenses:</label>
              <input
                type="number"
                id="totalExpenses"
                value={totalExpenses}
                readOnly
                disabled={isSending || isFetchingFinancialData}
                style={{
                  marginLeft: "5px",
                  padding: "8px",
                  cursor: "not-allowed",
                }}
              />
            </div>
            <div>
              <label htmlFor="remainingBudget">Remaining Budget:</label>
              <input
                type="number"
                id="remainingBudget"
                value={remainingBudget}
                readOnly
                disabled={isSending || isFetchingFinancialData}
                style={{
                  marginLeft: "5px",
                  padding: "8px",
                  cursor: "not-allowed",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="topCategories">
              Top Categories (comma-separated: Name1, Name2):
            </label>
            <input
              type="text"
              id="topCategories"
              value={topCategories}
              readOnly
              disabled={isSending || isFetchingFinancialData}
              placeholder="e.g., Groceries, Transport"
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                cursor: "not-allowed",
              }}
            />
          </div>

          <button
            onClick={handleSendWeeklyBudgetUpdate}
            disabled={
              isSending ||
              !selectedUserId ||
              isFetchingFinancialData ||
              (totalIncome === 0 && totalExpenses === 0)
            }
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            {isSending ? "Sending..." : "Send Weekly Budget Update"}
          </button>
          {statusMessage && (
            <p
              style={{
                marginTop: "10px",
                color: statusMessage.startsWith("Error") ? "red" : "green",
              }}
            >
              {statusMessage}
            </p>
          )}
        </div>
      </div>
    </Layout>
  );
}
