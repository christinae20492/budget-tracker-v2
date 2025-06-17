import { generateClient } from "aws-amplify/api";
import { Amplify } from "aws-amplify";
import awsmobile from "@/aws-exports";
import { Expense } from "./localStorage";
import { getCurrentUser } from "@aws-amplify/auth";
import { useAuthenticator } from "@aws-amplify/ui-react";

Amplify.configure(awsmobile);

const client = generateClient();


export async function getExpenses(): Promise<Expense[]> {
  if (!client) throw new Error("GraphQL client is not initialized");

  const result = await client.graphql({
    query: `query ListExpenses {
      listExpenses {
        items {
          id
          amount
          envelope
          date
          user
          comments
          location
        }
      }
    }`,
  });

  return result.data.listExpenses.items;
}

export async function addExpense(expense: Expense) {

    
  if (!client) throw new Error("GraphQL client is not initialized");
  if (!expense.id || !expense.amount || !expense.envelope || !expense.date || !expense.location ) {
    console.error("Error: Missing required fields", expense);}

  try {
    await client.graphql({
      query: `mutation CreateExpense($input: CreateExpenseInput!) {
        createExpense(input: $input) {
          id
        }
      }`,
      variables: {
        input: {
          id: expense.id,
          amount: expense.amount,
          envelope: expense.envelope,
          date: expense.date,
          user: expense.user,
          comments: expense.comments ?? "",
          location: expense.location ?? "",
        },
      },
    });
  } catch (error) {
    console.error("Error adding expense:", error);
  }
}