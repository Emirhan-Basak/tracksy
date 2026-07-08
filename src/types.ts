export type TransactionType = "expense" | "income";

export type Category = "food" | "housing" | "transport" | "leisure" | "shopping" | "health" | "bills" | "other expense" | "salary" | "freelance" | "investment" | "gift" | "other income";

export type Transaction = {
    id: number;
    type: TransactionType;
    label: string;
    amount: number;
    category: Category;
    date: Date;
}

type DateFilter =
  | "all"
  | "today"
  | "week"
  | "month"
  | "year"

export type Filter = {
    category: Category[],
    transactionType: TransactionType[],
    date: DateFilter
    editMod: number | null
}