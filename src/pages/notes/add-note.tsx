"use client"
import { useState } from "react"
import { Note, addLocalNote } from "@/app/utils/localStorage"
=import { failToast, successToast } from "@/app/utils/toast";
import { useRouter } from "next/router";
import Head from "next/head";
import Layout from "@/app/components/ui/Layout";

export default function CreateNote() {
  const router = useRouter();
    const date = new Date();
    const currentMonth = date.getMonth();
    const [body, setBody] = useState("");

    const handleSubmit = (e: React.FormEvent) =>{
        e.preventDefault();
        if (!body) {
            failToast("The note is empty.")
        }

        const idgen=()=>{
                     const randomNumber = Math.floor(10000 + Math.random() * 90000);
            return randomNumber;
          }

        const newNote: Note = {
            id: idgen(),
            month: currentMonth,
            content: body
        }

        addLocalNote(newNote);
        successToast('New note created!')
        router.push('/notes');
    }

  return (
    <Layout>
      <Head>
        <title>Add Note</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:text-white">
            <h2 className="header">Create a Note</h2>
            <form onSubmit={handleSubmit}>
            <div>
            <label
              htmlFor="body"
              className="block text-sm font-medium text-gray-700 dark:text-white"
            >
              What do you have to say?
            </label>
            <textarea
              id="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              className="mt-1 block w-full min-h-48 border border-gray-300 rounded-md shadow-sm p-2 dark:bg-slate-900 dark:text-white"
            />
          </div>
          <div className="text-center">
            <button
              type="submit"
              className="px-4 py-2 my-5 rounded-md bg-blue-500 text-white hover:bg-blue-700 dark:bg-blue-400"
            >
              Add Note
            </button>
          </div>
            </form>
        </div>
    </Layout>
  )
}
