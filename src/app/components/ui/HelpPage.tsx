import React from "react";
import Image from "next/image";

interface HelpPageProps {
  currentTab: string;
}

export default function HelpPage({ currentTab }: HelpPageProps) {
  const content = () => {
    switch (currentTab) {
      case "Introduction":
        return (
          <>
            <h3 className="text-center">Welcome to Just A Bit!</h3>
            <p>
              Welcome to Just A Bit, your intelligent companion designed to
              transform your financial life, one step at a time. Are you ready
              to take control of your money with clarity and confidence?
            </p>
            <p>
              <strong>Just A Bit</strong> empowers you to effortlessly track
              every expense, manage all your income streams, and organize your
              funds using our intuitive envelope budgeting system. Say goodbye
              to financial guesswork and hello to peace of mind. Our
              user-friendly interface makes it simple to categorize your
              spending, set personalized financial goals, and gain a clear
              overview of your money, whether you're at home or on the go.
            </p>
            <p>
              Built with your financial well-being at its core, Just A Bit
              provides the insights you need to achieve your goals, big or
              small. Plus, with robust security measures and a steadfast
              commitment to your privacy, you can manage your money knowing your
              data is always safe and entirely yours. We ensure all your
              financial information is protected, and you have complete control
              over your account preferences and data, including the option to
              securely delete your account at any time.
            </p>
            <p>
              Start your journey to financial freedom today with Just A Bit –
              because every bit counts!
            </p>
          </>
        );
      case "Home":
        return (
          <>
            <h3 className="text-center">The Home Page</h3>
            <p>
              Now you've made it onto the app true. When first logging in,
              you're greeted with a custom welcome message including your
              username. But let me be the second to say - welcome!
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/homepage-1.jpeg"}
                alt={""}
                width={600}
                height={300}
              />
            </span>
            <p>
              Landing on the home page, you'll see a short and sweet table
              summarizing your month. This is punctuated by a custom message, a
              message that will vary if you spent more than you earned or if you
              saved a lot of money.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/homepage-2.jpeg"}
                alt={""}
                width={300}
                height={300}
              />
            </span>
            <p>
              You also get a to-the-point pie chart to complement the table.
              Helps to put things in perspective when you have a visual aid.
            </p>
          </>
        );
      case "Calendar":
        return (
          <>
            <h3 className="header">The Calendar Page</h3>
            <p>Now we move onto the meat of the app - the Calendar page!</p>
            <span className="mx-auto">
              <Image
                src={"/img/calendar-1.jpeg"}
                alt={""}
                width={500}
                height={300}
              />
            </span>
            <p>
              Here, you can view all your expenses and incomes that you've
              already created, as well as view new ones. You can also view
              details of expenses, including location, envelope, and any
              comments. The calendar can be filtered to show only expenses, only
              incomes, or both, using this toggle bar.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/calendar-2.jpeg"}
                alt={""}
                width={300}
                height={100}
              />
            </span>
            <p>
              Now, when you're ready to add an expense or income, you click on
              the day of your choice and it will open the modal.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/calendar-3.jpeg"}
                alt={""}
                width={500}
                height={300}
              />
            </span>
            <p>
              (Mind you, you have to click <strong>on the day itself.</strong>{" "}
              If you click on any existing expense/income within the day, it
              will take you to a details page for that day, and not open the
              creation modal.)
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/calendar-5.jpeg"}
                alt={""}
                width={500}
                height={600}
              />
            </span>
            <p>
              Pick your option and it will take you to the relevant page. For
              this example, I'll use the expense page.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/calendar-4.jpeg"}
                alt={""}
                width={600}
                height={300}
              />
            </span>
            <p>
              <span className="text-red font-bold">
                Warning: You won't be able to create an expense without first
                creating an envelope. Go to the 'Envelope' section of this page
                if you need help doing so.
              </span>{" "}
              Here, you can fill in the appropriate details: the location of
              purchase, the category (envelope), the total cost, and any
              comments. The date with automatically be filled once you're
              directed to this page, but you can change it if you've selected
              the wrong day. After all that, click "Add Expense", and you're all
              done! The process is much the same for adding an income.
            </p>
          </>
        );
      case "Summary":
        return (
          <>
            <h3 className="header">The Summary Page</h3>
            <p>
              The main section of this page shows you your totals for the month.
              This includes the obvious - total income, total expenses - but
              also gives you any trends, like the location where you spent the
              most money or your spending this month compared to last month.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/summary-1.jpeg"}
                alt={""}
                width={300}
                height={300}
              />
            </span>
            <p>
              You can also view all envelopes here and the expenses for them for
              this month. Here is also where the envelope's budget comes into
              play: if you made an envelope to be "fixed," this page will give
              you warnings when you're close to an envelope's budget, or if
              you've already exceeded it.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/summary-2.jpeg"}
                alt={""}
                width={800}
                height={500}
              />
            </span>
            <p>
              In the upper right corner, you have the option to switch to a
              yearly review.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/summary-3.jpeg"}
                alt={""}
                width={200}
                height={200}
              />
            </span>
            <p>
              Here, the screen is much the same, except the values now span
              across your entire year's worth of expenses and incomes. You can
              change the year value to check data from previous years.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/summary-4.jpeg"}
                alt={""}
                width={600}
                height={300}
              />
            </span>
            <p>
              However, instead of viewing your envelopes, you have a chart
              representing your expenses vs incomes.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/summary-5.jpeg"}
                alt={""}
                width={600}
                height={300}
              />
            </span>
          </>
        );
      case "Envelopes":
        return (
          <>
            <h3 className="header">The Envelopes Page</h3>
            <p>
              Come on, come all to view your budgets for the month! The first
              thing you're greeted with is a handy little modal that will, at a
              glance, show you how much you've spent today. Click on the little
              notepad icon, and it will show you your total spending for each
              day of the past week.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/env-1.jpeg"}
                alt={""}
                width={600}
                height={300}
              />
            </span>
            <p>
              Directly below that, you have a pie chart that compares your
              spending totals for each envelope.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/env-2.jpeg"}
                alt={""}
                width={300}
                height={300}
              />
            </span>
            <p>
              When you look at the envelopes' section, you'll noticed they are
              divided into two categories: 'Fixed' and 'Variable.' Just as with
              the summary page, if your envelope is marked as 'fixed,' this page
              will warn you as you approach and/or exceed that budget. At a
              glance, you can see what an envelope's budget is, and how much
              you've spent out of it.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/env-3.jpeg"}
                alt={""}
                width={700}
                height={300}
              />
            </span>
            <p>
              You can also click on any envelope to view its expenses for the
              month.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/env-6.jpeg"}
                alt={""}
                width={400}
                height={300}
              />
            </span>
            <p>At the bottom of the page is the 'Add Envelope' button.</p>
            <span className="mx-auto">
              <Image
                src={"/img/env-4.jpeg"}
                alt={""}
                width={200}
                height={200}
              />
            </span>
            <p>
              Clicking it will open the modal to define the envelope's details.
              Name it anything you want, according to how you'll use it. You can
              click the buttons to switch between 'fixed' and 'variable.' Then
              you allocate a budget for it, and finally you can add any comments
              you want to it, although it's not necessary. Once you're all done,
              just click 'Add.'
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/env-5.jpeg"}
                alt={""}
                width={600}
                height={300}
              />
            </span>
          </>
        );
      case "Edit":
        return (
          <>
            <h3 className="header">The Edit Page</h3>
            <p>
              Here, you can view all of the expenses, incomes, and envelopes you
              created, plus a little bit of info for each.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/edit-1.jpeg"}
                alt={""}
                width={600}
                height={300}
              />
            </span>
            <p>
              Clicking on an expense or income takes you to an editing page.
              Here's the expense page for example. Clicking the 'Edit Expense'
              button will update the expense. Editing an income is much the
              same.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/edit-2.jpeg"}
                alt={""}
                width={600}
                height={300}
              />
            </span>
            <p>
              Clicking on an envelope opens a different editing page. You can
              adjust the budget with the slider; just slide to the desired value
              and let it go. After a second, it'll automatically update. You can
              also delete any expenses associated with it by clicking on the
              expense.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/edit-3.jpeg"}
                alt={""}
                width={600}
                height={300}
              />
            </span>
          </>
        );
      case "Notes":
        return (
          <>
            <h3 className="header">The Notes Page</h3>
            <p>
              The notes page will be the simplest to pick up. You use this page
              to create notes for the month - maybe "I need to add more to my
              savings" or "I need to cut back spending at Nordstrom." Notes will render in a list for you,
              and if you want to delete one, just hover over it (or click if 
              you're on mobile) to show the delete icon. You can use the selector
              on top to change months.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/notes-1.jpeg"}
                alt={""}
                width={600}
                height={300}
              />
            </span>
            <p>
              Clicking the pen icon on the right hand side will open the note
              creation modal.
            </p>
            <span className="mx-auto">
              <Image
                src={"/img/notes-2.jpeg"}
                alt={""}
                width={600}
                height={300}
              />
            </span>
            <p>
              The only thing you need to enter here is a short message for the
              note. Click 'Add Note' and you're all done!
            </p>
          </>
        );
      default:
        return (
          <p className="text-gray-500 font-semibold text-lg p-2">
            Select a tab to see content.
          </p>
        );
    }
  };

  return <div>{content()}</div>;
}
