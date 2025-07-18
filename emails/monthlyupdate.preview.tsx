import * as React from 'react';
import MonthlyBudgetUpdateEmail from './monthlyupdate';

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

const welcomeEmailDummyProps = {
 username: 'TestUser',
  startDate: '2025-01-01',
  endDate: '2025-02-01',
  totalIncome: '3500', 
  totalExpenses: '2700',
  netBalance: '800',
  envelopesSummary:dummyEnvelopesSummary,
  appName: "BudgetBreeze",
};

export default function WelcomeEmailPreview() {
  return <MonthlyBudgetUpdateEmail {...welcomeEmailDummyProps} />;
}