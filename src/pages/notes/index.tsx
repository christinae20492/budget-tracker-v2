import Layout from "@/app/components/ui/Layout";
import { getLocalNotes, Note, deleteNote } from "@/app/utils/localStorage";
import { successToast } from "@/app/utils/toast";
import {
  faPenNib,
  faTrash,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Head from "next/head";
import Link from "next/link";
import { Router, useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Notes() {
  const router = useRouter();
  const date = new Date();
  const [currentMonth, setCurrentMonth] = useState(date.getMonth());
  const [notes, setNotes] = useState<Note[]>([]);
  const [hoveredNoteId, setHoveredNoteId] = useState(0);

  const fetchData = () => {
    const rawNotes = getLocalNotes();
    const filteredNotes = rawNotes.filter(
      (note) => note.month === currentMonth
    );
    setNotes(filteredNotes);
  };

  const increment = () => {
    setCurrentMonth((prevMonth) => {
      let newMonth = prevMonth + 1;
      if (newMonth > 11) {
        newMonth = 0;
      }
      return newMonth;
    });
  };

  const decrement = () => {
    setCurrentMonth((prevMonth) => {
      let newMonth = prevMonth - 1;
      if (newMonth < 0) {
        newMonth = 11;
      }
      return newMonth;
    });
  };

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  function getMonthName(monthNumber: number): string {
    switch (monthNumber) {
      case 0:
        return "January";
      case 1:
        return "February";
      case 2:
        return "March";
      case 3:
        return "April";
      case 4:
        return "May";
      case 5:
        return "June";
      case 6:
        return "July";
      case 7:
        return "August";
      case 8:
        return "September";
      case 9:
        return "October";
      case 10:
        return "November";
      case 11:
        return "December";
      default:
        return "Invalid month";
    }
  }

  function handleDelete(id: number) {
    if (!id) return null;
    deleteNote(id);
    successToast("Note deleted successfully.");
    fetchData();
  }

  return (
    <Layout>
      <Head>
        <title>Notes for {getMonthName(currentMonth)}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div>
        <h1 className="header">Notes</h1>
        <h2 className="header text-gray-600">
          <button onClick={decrement}>Previous</button>{" "}
          <strong className="text-gray-800">
            {getMonthName(currentMonth)}
          </strong>{" "}
          <button onClick={increment}>Next</button>
        </h2>
      </div>
      <div className="clear-both">
        <div>
          {notes.length === 0 ? (
            <p className="text-xl text-center">No notes for this month.</p>
          ) : (
            <div>
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="border border-notindigo-400 rounded-xl my-4 max-w-4xl mx-auto p-4 shadow text-lg list-disc transition-all relative hover:border-none hover:bg-notindigo-500 hover:text-xl hover:shadow-lg dark:text-black"
                  onMouseEnter={() => setHoveredNoteId(note.id)}
                  onMouseLeave={() => setHoveredNoteId(0)}
                >
                  <div>{note.content}</div>
                  {hoveredNoteId === note.id && (
                    <button
                      className="absolute top-0 right-0 text-red-500 hover:text-red-700 transition-opacity items-center"
                      onClick={() => handleDelete(note.id)}
                    >
                      <FontAwesomeIcon
                        icon={faTrashCan}
                        beat
                        className="size-6"
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Link href="/notes/add-note">
        <span className="float-right bottom-0 right-6 border-2 border-gray-400 p-3 hover:rounded-2xl transition-all">
          <FontAwesomeIcon icon={faPenNib} className="size-8 text-gray-700" />
        </span>
      </Link>
    </Layout>
  );
}
