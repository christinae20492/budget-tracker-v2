import { Envelope, Expense, getEnvelopes, Income } from "./localStorage";

// ✅ Ensure the function always returns a string
export function getFormattedDate(
  date: string | Date = new Date(),
  format = "yyyy-MM-dd"
): string {
  if (typeof date === "string") return date;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  switch (format) {
    case "yyyy-MM":
      return `${year}-${month}`;
    case "yyyy-MM-dd":
      return `${year}-${month}-${day}`;
    default:
      return `${year}-${month}-${day}`;
  }
}

export const formatCurrency = (
  amount: number,
  locale = "en-US",
  currency = "USD"
): string => {
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(
    amount
  );
};

export function calculateTotal(
  data: Expense[],
  timePeriod: "thisMonth" | "lastMonth"
): number {
  if (!Array.isArray(data)) return 0;

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const isWithinPeriod = (date: string | Date, monthOffset = 0): boolean => {
    const expenseDate = new Date(date);
    const targetMonth = currentMonth + monthOffset;
    const targetYear = targetMonth < 0 ? currentYear - 1 : currentYear;

    return (
      expenseDate.getMonth() === (targetMonth + 12) % 12 &&
      expenseDate.getFullYear() === targetYear
    );
  };

  const monthOffset = timePeriod === "lastMonth" ? -1 : 0;

  return data
    .filter((item) => item.date && isWithinPeriod(item.date, monthOffset))
    .reduce((total, item) => total + (item.amount || 0), 0);
}

export function getMonthlyExpenditureDetails(
  incomes: Income[],
  expenses: Expense[]
) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const lastMonthDate = new Date(currentDate);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonth = lastMonthDate.getMonth();
  const lastYear = lastMonthDate.getFullYear();

  const filterExpenseByMonth = (data: Expense[], month: number, year: number) =>
    data.filter((item) => {
      const [itemYear, itemMonth] = item.date.split("-").map(Number);
      return itemMonth - 1 === month && itemYear === year;
    });

  const filterIncomeByMonth = (data: Income[], month: number, year: number) =>
    data.filter((item) => {
      const [itemYear, itemMonth] = item.date.split("-").map(Number);
      return itemMonth - 1 === month && itemYear === year;
    });

  const thisMonthExpenses = filterExpenseByMonth(
    expenses,
    currentMonth,
    currentYear
  );
  const lastMonthExpenses = filterExpenseByMonth(expenses, lastMonth, lastYear);
  const thisMonthIncomes = filterIncomeByMonth(
    incomes,
    currentMonth,
    currentYear
  );
  const lastMonthIncomes = filterIncomeByMonth(incomes, lastMonth, lastYear);

  const totalSpendingThisMonth = thisMonthExpenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );
  const totalSpendingLastMonth = lastMonthExpenses.reduce(
    (sum, expense) => sum + (expense.amount || 0),
    0
  );
  const totalIncomeThisMonth = thisMonthIncomes.reduce(
    (sum, income) => sum + (income.amount || 0),
    0
  );
  const totalIncomeLastMonth = lastMonthIncomes.reduce(
    (sum, income) => sum + (income.amount || 0),
    0
  );

  const spendingDifference = totalIncomeThisMonth - totalSpendingThisMonth;

  const mostSpentEnvelope = thisMonthExpenses.reduce<Record<string, number>>(
    (acc, expense) => {
      if (expense.envelope) {
        acc[expense.envelope] = (acc[expense.envelope] || 0) + expense.amount;
      }
      return acc;
    },
    {}
  );

  const [highestEnvelope, highestAmount] =
    Object.entries(mostSpentEnvelope).sort((a, b) => b[1] - a[1])[0] || [];

  const mostFrequentEnvelope = thisMonthExpenses.reduce<Record<string, number>>(
    (acc, expense) => {
      if (expense.envelope) {
        acc[expense.envelope] = (acc[expense.envelope] || 0) + 1;
      }
      return acc;
    },
    {}
  );

  const [frequentEnvelope] =
    Object.entries(mostFrequentEnvelope).sort((a, b) => b[1] - a[1])[0] || [];

  const spendingComparison =
    totalSpendingLastMonth === 0
      ? 0
      : ((totalSpendingThisMonth - totalSpendingLastMonth) /
          totalSpendingLastMonth) *
        100;

  const mostSpentLocation = thisMonthExpenses.reduce<Record<string, number>>(
    (acc, expense) => {
      if (expense.location) {
        acc[expense.location] = (acc[expense.location] || 0) + expense.amount;
      }
      return acc;
    },
    {}
  );
  const [highestSpendingLocation, highestSpendingAmount] =
    Object.entries(mostSpentLocation).sort((a, b) => b[1] - a[1])[0] || [];

  return {
    incomeTotals: totalIncomeThisMonth,
    expenseTotals: totalSpendingThisMonth,
    spendingDifference,
    spendingComparison,
    highestEnvelope: highestEnvelope || "N/A",
    highestAmount: highestAmount || 0,
    frequentEnvelope: frequentEnvelope || "N/A",
    highestSpendingLocation: highestSpendingLocation || "N/A",
    highestSpendingAmount: highestSpendingAmount || 0,
  };
}

export function getYearlyExpenditureDetails(
  incomes: Income[],
  expenses: Expense[]
) {
  const currentYear = new Date().getFullYear();

  const filterByYear = <T extends { date: string }>(data: T[], year: number) =>
    data.filter((item) => new Date(item.date).getFullYear() === year);

  const yearlyExpenses = filterByYear(expenses, currentYear);
  const yearlyIncomes = filterByYear(incomes, currentYear);

  const incomeTotals = yearlyIncomes.reduce(
    (total, income) => total + income.amount,
    0
  );
  const expenseTotals = yearlyExpenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );
  const spendingDifference = incomeTotals - expenseTotals;

  const mostSpentEnvelope = yearlyExpenses.reduce<Record<string, number>>(
    (acc, expense) => {
      if (expense.envelope) {
        acc[expense.envelope] = (acc[expense.envelope] || 0) + expense.amount;
      }
      return acc;
    },
    {}
  );
  const [highestEnvelope = "N/A", highestAmount = 0] =
    Object.entries(mostSpentEnvelope).sort((a, b) => b[1] - a[1])[0] || [];

  const mostFrequentEnvelope = yearlyExpenses.reduce<Record<string, number>>(
    (acc, expense) => {
      if (expense.envelope) {
        acc[expense.envelope] = (acc[expense.envelope] || 0) + 1;
      }
      return acc;
    },
    {}
  );
  const [frequentEnvelope = "N/A"] =
    Object.entries(mostFrequentEnvelope).sort((a, b) => b[1] - a[1])[0] || [];

  return {
    incomeTotals,
    expenseTotals,
    spendingDifference,
    highestEnvelope,
    highestAmount,
    frequentEnvelope,
  };
}

export const getBudgetLimits = () => {
  const envelopes = getEnvelopes();
  return envelopes.map((env) => ({ title: env.title, budget: env.budget }));
};

export const totalSpend = (envelope: Envelope): number => {
  if (!envelope.expenses || envelope.expenses.length === 0) {
    return 0;
  }
  return envelope.expenses.reduce((sum, expense) => sum + expense.amount, 0);
};

export function filterEnvelopeExpenses(
  envelopes: Envelope[],
  criteria: {
    month?: number;
    year?: number;
    minAmount?: number;
    maxAmount?: number;
    envelopeName?: string;
  }
) {
  return envelopes
    .filter((envelope) => {
      if (criteria.envelopeName && envelope.title !== criteria.envelopeName)
        return false;
      return true;
    })
    .map((envelope) => {
      const filteredExpenses = envelope.expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const matchesMonth = criteria.month
          ? expenseDate.getMonth() + 1 === criteria.month
          : true;
        const matchesYear = criteria.year
          ? expenseDate.getFullYear() === criteria.year
          : true;
        const matchesMinAmount = criteria.minAmount
          ? expense.amount >= criteria.minAmount
          : true;
        const matchesMaxAmount = criteria.maxAmount
          ? expense.amount <= criteria.maxAmount
          : true;

        return (
          matchesMonth && matchesYear && matchesMinAmount && matchesMaxAmount
        );
      });

      return { ...envelope, expenses: filteredExpenses };
    })
    .filter((envelope) => envelope.expenses.length > 0);
}

export function filterCurrentMonthExpenses(expenses: any[]) {
  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();

  return expenses.filter(
    (expense: {
      date: {
        split: (arg0: string) => {
          (): any;
          new (): any;
          map: { (arg0: NumberConstructor): [any, any]; new (): any };
        };
      };
    }) => {
      const [year, month] = expense.date.split("-").map(Number);
      return year === currentYear && month === currentMonth;
    }
  );
}
