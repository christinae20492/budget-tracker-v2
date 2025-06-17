export interface Expense {
  id: number;
  location: string;
  envelope: string;
  //user: string;
  date: string;
  amount: number;
  comments?: string;
}

export function getLocalExpenses(): Expense[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("expenses");
  return data ? JSON.parse(data) : [];
}

export function addLocalExpense(expense: Expense): void {
  const expenses = getLocalExpenses();
  expenses.push(expense);
  localStorage.setItem("expenses", JSON.stringify(expenses));
}

export const addExpensetoEnvelope = (expense: Expense) => {
  const envelopes = getEnvelopes();
  const envelope = envelopes.find((ev) => ev.title === expense.envelope);
  if (envelope) {
    envelope.expenses.push(expense.id);
    localStorage.setItem("envelopes", JSON.stringify(envelopes));
  }
};

export function generateExpenseId(): number {
  return Date.now();
}

export interface Income {
  id: number;
  source: string;
  amount: number;
  date: string;
  //user: string;
  savings?: number;
  investments?: number;
  remainder?: number;
}

export function getLocalIncome(): Income[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("incomes");
  return data ? JSON.parse(data) : [];
}

export function addLocalIncome(income: Income): void {
  const incomes = getLocalIncome();
  incomes.push(income);
  localStorage.setItem("incomes", JSON.stringify(incomes));
}

export function generateIncomeId(): number {
  return Date.now();
}

export const getMonthlyTotal = async () => {
  const expenses = await getLocalExpenses();
  const currentMonth = new Date().getMonth();
  const monthlyExpenses = expenses.filter(
    (expense) => new Date(expense.date).getMonth() === currentMonth
  );
  return monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
};

export interface Envelope {
  title: string;
  fixed?: boolean;
  budget?: number;
  expenses: number[];
  icon: string;
  //user: string;
  color: string;
  comments?: string;
}

export function getEnvelopes(): Envelope[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("envelopes");
  return data ? JSON.parse(data) : [];
}

export function createEnvelope(envelope: Envelope): void {
  const envelopes = getEnvelopes();
  envelopes.push(envelope);
  localStorage.setItem("envelopes", JSON.stringify(envelopes));
}

export const getExpensesForEnvelope = (envelope: Envelope, allExpenses: Expense[]): Expense[] => {
  if (!envelope || !envelope.expenses) {
    return [];
  }

  const expenseMap = new Map<number, Expense>();
  allExpenses.forEach(exp => expenseMap.set(exp.id, exp));

  const envelopeExpenses: Expense[] = [];
  for (const id of envelope.expenses) {
    const foundExpense = expenseMap.get(id);
    if (foundExpense) {
      envelopeExpenses.push(foundExpense);
    }
  }
  return envelopeExpenses;
};

export interface Note {
  id: number,
  month: number,
  content: string,
  //user: string,
}

export function getLocalNotes(): Note[] {
  if (typeof window === "undefined") return [];
  const data = localStorage.getItem("notes");
  return data ? JSON.parse(data) : [];
}

export function addLocalNote(note: Note): void {
  const notes = getLocalNotes();
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
}

export const deleteExpense = async (id: number) => {
  const expenses = getLocalExpenses();
  const updatedExpenses = expenses.filter((exp) => exp.id !== id);
  localStorage.setItem("expenses", JSON.stringify(updatedExpenses));

  const envelopes = JSON.parse(localStorage.getItem("envelopes") || "[]");
  const updatedEnvelopes = envelopes.map(
    (envelope: { expenses: number[] }) => ({
      ...envelope,
      expenses: envelope.expenses.filter((expense) => expense !== id),
    })
  );
  localStorage.setItem("envelopes", JSON.stringify(updatedEnvelopes));
};

export const deleteEnvelope = async (title: string) => {
  const envelopes = getEnvelopes();
  const updatedEnvelopes = envelopes.filter((env) => env.title !== title);
  localStorage.setItem("envelopes", JSON.stringify(updatedEnvelopes));
};

export const deleteIncome = async (id: number) => {
  const incomes = getLocalIncome();
  const updatedIncomes = incomes.filter((inc) => inc.id !== id);
  localStorage.setItem("incomes", JSON.stringify(updatedIncomes));
};

export const deleteNote = async (id: number) => {
  const notes = getLocalNotes();
  const updatedNotes = notes.filter((note) => note.id !== id);
  localStorage.setItem("notes", JSON.stringify(updatedNotes));
};