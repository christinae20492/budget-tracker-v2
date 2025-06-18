export interface Expense {
  id: number;
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
  id: number;
  source: string;
  amount: number;
  date: string;
  user: string;
  savings?: number;
  investments?: number;
  remainder?: number;
    dateCreated: string;
  dateUpdated: string;
}

export interface Envelope {
  title: string;
  fixed?: boolean;
  budget?: number;
  expenses: number[];
  icon: string;
  user: string;
  color: string;
  comments?: string;
    dateCreated: string;
  dateUpdated: string;
}

export interface Note {
  id: number,
  month: number,
  content: string,
  user: string,
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
  expenses?: number[];
  icon?: string;
  color?: string;
  comments?: string;
}

export interface EditNote {
  content?: string,
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
  fixed?: boolean;
  budget?: number;
  expenses: number[];
  icon: string;
  color: string;
  comments?: string;
}

export interface NewNote {
  id: number,
  month: number,
  content: string,
}