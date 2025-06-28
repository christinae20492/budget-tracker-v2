export interface Expense {
  id: string;
  location: string;
  envelope: string;
  userId: string;
  date: string;
  amount: number;
  comments?: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
  userId: string;
  savings?: number;
  investments?: number;
  remainder?: number;
  dateCreated: string;
  dateUpdated: string;
}

export interface Envelope {
  id: string;
  title: string;
  fixed: boolean;
  budget: number;
  expenses: Expense[];
  icon: string;
  userId: string;
  color: string;
  comments?: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface Note {
  id: string;
  month: number;
  content: string;
  userId: string;
  dateCreated: string;
  dateUpdated: string;
}

export interface EditExpense {
  location?: string;
  envelope?: string;
  date?: string;
  amount?: number;
  comments?: string;
}

export interface EditIncome {
  source?: string;
  amount?: number;
  date?: string;
  savings?: number;
  investments?: number;
  remainder?: number;
}

export interface EditEnvelope {
  title?: string;
  fixed?: boolean;
  budget?: number;
  icon?: string;
  color?: string;
  addExpense?: number;
  removeExpense?: number;
  comments?: string;
}

export interface EditNote {
  content?: string;
}

export interface NewExpense {
  id: number;
  location: string;
  envelope: string;
  date: string;
  amount: number;
  comments?: string;
}

export interface NewIncome {
  id: number;
  source: string;
  amount: number;
  date: string;
  savings?: number;
  investments?: number;
  remainder?: number;
}

export interface NewEnvelope {
  title: string;
  fixed: boolean;
  budget: number;
  expenses: number[];
  icon: string;
  color: string;
  comments?: string;
}

export interface NewNote {
  id: number;
  month: number;
  content: string;
}
