import { faHandPointRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function Changelog() {
  return (
    <div>
      <section id="v4">
        <div>
          <h2 className="header">Version 4</h2>
          <p>
            The polishing up of version 3. As we now have account services,
            there is a dedicated 'Account' page with personalization services.
            The app's design was also updated so it can be used from mobile.
            We've also done some general interface changes to make your
            navigation and usage much easier.
          </p>
          <div className="border border-grey-300 rounded p-4 w-3/4 mx-auto my-4">
            <h3 className="text-grey-600">
              <FontAwesomeIcon icon={faHandPointRight} /> Account Page
            </h3>
            <p>
              Going into the 'Account' page, you'll see several new tabs
              organizing your new user options. You can change your username or
              email, adjust your theme and email preferences, and if you feel it
              necessary, delete your account and all associated data. There's
              also a 'Help' tab which provides detailed instructions for each
              page in case you're ever in need.
            </p>
          </div>
          <div className='border border-grey-300 rounded p-4 w-3/4 mx-auto my-4'>
            <h3 className='text-grey-600'><FontAwesomeIcon icon={faHandPointRight} /> Mobile Support</h3>
            <p>If you ever needed to quickly log a purchase while on the go, now you can! Just A Bit
              can be accessed on your phone with a clean and simplified user interface that will work
              on any mobile device - phone or tablet.
            </p>
          </div>
          <div className='border border-grey-300 rounded p-4 w-3/4 mx-auto my-4'>
            <h3 className='text-grey-600'><FontAwesomeIcon icon={faHandPointRight} /> Small Adjustments</h3>
            <p>The modal on the calendar page had its position adjust so it could appear in the same spot more consistently. While
              you're editing an expense or income, you can delete it from right there. Dark mode is now
              controlled from the 'Account' page and not the toolbar. Added dark mode colors to more elements, and
              accessibility titles to images. Added a welcome email for new users. New colors were added to the user interface.
            </p>
          </div>
        </div>
      </section>
      <section id="v3">
        <div>
          <h2 className="header">Version 3</h2>
          <p>
            The long-awaited budget app, now with the addition of database
            services provided by Vercel. This includes login and logout
            functionality, and migrating from local storage to database storage
            for incomes, expenses, and envelopes, meaning you can access your
            data from any device. It also means a public URL that anybody can
            access.
          </p>
          <div className="border border-grey-300 rounded p-4 w-3/4 mx-auto my-4">
            <h3 className="text-grey-600">
              <FontAwesomeIcon icon={faHandPointRight} /> Notes Page
            </h3>
            <p>
              Need little reminders for throughout the month? Maybe "Set aside
              $60 for emergencies" or "Pay $150 towards the phone bill"? You can
              create notes for the month on the notes page.
            </p>
          </div>
          <div className="border border-grey-300 rounded p-4 w-3/4 mx-auto my-4">
            <h3 className="text-grey-600">
              <FontAwesomeIcon icon={faHandPointRight} /> Edit Items
            </h3>
            <p>
              If you slipped a little entering an amount for an income, or maybe
              put an expense into the wrong envelope, now you can go to the Edit
              page and chang it on the spot, rather than deleting it and
              starting over.
            </p>
          </div>
          <div className="border border-grey-300 rounded p-4 w-3/4 mx-auto my-4">
            <h3 className="text-grey-600">
              <FontAwesomeIcon icon={faHandPointRight} /> Yearly Summary
            </h3>
            <p>
              The same way you can view a summary for the month, you can now
              view your summary for the year to date. You can't see invididual
              expenses here, but instead you get a line chart comparing your
              overall expenses to income.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
