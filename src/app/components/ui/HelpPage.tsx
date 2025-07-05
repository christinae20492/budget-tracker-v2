import React from 'react'
import Image from 'next/image';


interface HelpPageProps {
    currentTab: string;
}

export default function HelpPage({ currentTab }: HelpPageProps) {
    const content = () =>{

    switch (currentTab) {
    case 'Introduction':
      return (
        <>
      <h3 className="text-center">Welcome to Just A Bit!</h3>
      <p>Welcome to Just A Bit, your intelligent companion designed to transform your financial life, one step at a time. Are you ready to take control of your money with clarity and confidence?</p>
      <p><strong>Just A Bit</strong> empowers you to effortlessly track every expense, manage all your income streams, and organize your funds using our intuitive envelope budgeting system. Say goodbye to financial guesswork and hello to peace of mind. Our user-friendly interface makes it simple to categorize your spending, set personalized financial goals, and gain a clear overview of your money, whether you're at home or on the go.</p>
      <p>Built with your financial well-being at its core, Just A Bit provides the insights you need to achieve your goals, big or small. Plus, with robust security measures and a steadfast commitment to your privacy, you can manage your money knowing your data is always safe and entirely yours. We ensure all your financial information is protected, and you have complete control over your account preferences and data, including the option to securely delete your account at any time.</p>
      <p>Start your journey to financial freedom today with Just A Bit – because every bit counts!</p>
      </>
    )
    case 'Home':
      return (
        <>
        <h3 className='text-center'>The Home Page</h3>
        <p>Now you've made it onto the app true. When first logging in, you're greeted with a custom welcome message including your username. But let me be the second to say - welcome!</p>
        <span className='mx-auto'><Image src={'/img/homepage-1.jpeg'} alt={''} width={600} height={300}/></span>
        <p>Landing on the home page, you'll see a short and sweet table summarizing your month. This is punctuated by a custom message, a message that will vary if you spent more than you earned or if you saved a lot of money.</p>
        <span className='mx-auto'><Image src={'/img/homepage-2.jpeg'} alt={''} width={300} height={300}/></span>
        <p>You also get a to-the-point pie chart to complement the table. Helps to put things in perspective when you have a visual aid.</p>
        </>
      )
    case 'Calendar':
      return (
        <><h3 className='header'>The Calendar Page</h3>
        <p>Now we move onto the meat of the app - the Calendar page!</p>
        <span className='mx-auto'><Image src={'/img/calendar-1.jpeg'} alt={''} width={500} height={300}/></span>
        <p>Here, you can view all your expenses and incomes that you've already created, as well as view new ones. You can also view details of expenses, including location, envelope, and any comments. The calendar can be filtered to show only expenses, only incomes, or both, using this toggle bar.</p>
        <span className='mx-auto'><Image src={'/img/calendar-2.jpeg'} alt={''} width={300} height={100}/></span>
        <p>Now, when you're ready to add an expense or income, you click on the day of your choice and it will open the modal.</p>
        <span className='mx-auto'><Image src={'/img/calendar-3.jpeg'} alt={''} width={500} height={300}/></span>
        <p>(Mind you, you have to click <strong>on the day itself.</strong> If you click on any existing expense/income within the day, it will take you to a details page for that day, and not open the creation modal.)</p>
        <span className='mx-auto'><Image src={'/img/calendar-5.jpeg'} alt={''} width={500} height={600}/></span>
        <p>Pick your option and it will take you to the relevant page. For this example, I'll use the expense page.</p>
        <span className='mx-auto'><Image src={'/img/calendar-4.jpeg'} alt={''} width={600} height={300}/></span>
        <p><span className='text-red font-bold'>Warning: You won't be able to create an expense without first creating an envelope. Go to the 'Envelope' section of this page if you need help doing so.</span> Here, you can fill in the appropriate details: the location of purchase, the category (envelope), the total cost, and any comments. The date with automatically be filled once you're directed to this page, but you can change it if you've selected the wrong day. After all that, click "Add Expense", and you're all done! The process is much the same for adding an income.</p>
        </>
      )
    case 'Summary':
     return (
        <>
        <h3 className='header'>The Summary Page</h3>
        <p>The main section of this page shows you your totals for the month. This includes the obvious - total income, total expenses - but also gives you any trends, like the location where you spent the most money or your spending this month compared to last month.</p>
        <span className='mx-auto'><Image src={'/img/summary-1.jpeg'} alt={''} width={300} height={300}/></span>
        <p>You can also view all envelopes here and the expenses for them for this month. Here is also where the envelope's budget comes into play: if you made an envelope to be "fixed," this page will give you warnings when you're close to an envelope's budget, or if you've already exceeded it.</p>
        <span className='mx-auto'><Image src={'/img/summary-2.jpeg'} alt={''} width={800} height={500}/></span>
        <p>In the upper right corner, you have the option to switch to a yearly review.</p>
        <span className='mx-auto'><Image src={'/img/summary-3.jpeg'} alt={''} width={200} height={200}/></span>
        <p>Here, the screen is much the same, except the values now span across your entire year's worth of expenses and incomes. You can change the year value to check data from previous years.</p>
        <span className='mx-auto'><Image src={'/img/summary-4.jpeg'} alt={''} width={600} height={300}/></span>
        <p>However, instead of viewing your envelopes, you have a chart representing your expenses vs incomes.</p>
        <span className='mx-auto'><Image src={'/img/summary-5.jpeg'} alt={''} width={600} height={300}/></span>
        </>
     )
    case 'Envelopes':
      //content = <p className="text-blue-600 font-semibold text-lg p-2">Organize your Envelopes</p>;
      break;
    case 'Edit':
      //content = <p className="text-indigo-600 font-semibold text-lg p-2">Edit your Account Details</p>;
      break;
    case 'Notes':
      //content = <p className="text-purple-600 font-semibold text-lg p-2">Jot down your Notes</p>; // Using purple for violet-like shade
      break;
    default:
      //content = <p className="text-gray-500 font-semibold text-lg p-2">Select a tab to see content.</p>;
  }
}

  return (
    <div>{content()}</div>
  )
}
