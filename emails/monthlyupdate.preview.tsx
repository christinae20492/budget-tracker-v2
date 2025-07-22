import * as React from 'react';
// Make sure this import path is correct for your MonthlyBudgetUpdateEmail component
import MonthlyBudgetUpdateEmail from './monthlyupdate';

// Define the dummy data for the detailed envelopes summary
const dummyEnvelopesSummary = [
  {
    name: "Groceries",
    spent: "$250.75",
    allocated: "$300.00",
  },
  {
    name: "Dining Out",
    spent: "$120.50",
    allocated: "$100.00",
  },
  {
    name: "Transportation",
    spent: "$85.00",
    allocated: "$150.00",
  },
  {
    name: "Entertainment",
    spent: "$45.00",
    allocated: "$75.00",
  },
  {
    name: "Utilities",
    spent: "$90.20",
    allocated: "$100.00",
  },
  {
    name: "Savings",
    spent: "$0.00",
    allocated: "$200.00",
  },
];

// --- Corrected Dummy Props for MonthlyBudgetUpdateEmail ---
// This object now matches the `MonthlyBudgetUpdateEmailProps` interface
const monthlyBudgetUpdateDummyProps = {
  username: 'TestUser',
  startDate: '2025-01-01', // Date string
  endDate: '2025-01-31',   // Date string (assuming a full month)
  appName: "BudgetBreeze",
  summaryUrl: "https://budgetbreeze.com/dashboard/monthly-summary", // Example URL
  unsubscribeUrl: "https://budgetbreeze.com/account?tab=Preferences", // Example URL

  // The 'summary' object now contains numbers, as per SummaryDetails interface
  summary: {
    incomeTotals: 3500,
    expenseTotals: 2700,
    spendingDifference: 800, // incomeTotals - expenseTotals
    spendingComparison: 15.5, // Example percentage change
    highestEnvelope: "Groceries",
    highestAmount: 250.75,
    frequentEnvelope: "Groceries",
    highestSpendingLocation: "SuperMart",
    highestSpendingAmount: 350,
  },
  envelopesSummary: dummyEnvelopesSummary, // Optional, but included here
};

// Renamed the export function to reflect the email it's previewing
export default function MonthlyBudgetUpdateEmailPreview() {
  return <MonthlyBudgetUpdateEmail {...monthlyBudgetUpdateDummyProps} />;
}