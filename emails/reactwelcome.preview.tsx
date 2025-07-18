import * as React from 'react';
import WelcomeEmail from './reactwelcome';

const welcomeEmailDummyProps = {
  username: "BudgetMaster",
  loginUrl: "https://budgetbreeze.com/login",
  appName: "BudgetBreeze",
  helpCenterUrl: "https://budgetbreeze.com/help",
  socialMediaLinks: {
    facebook: "https://facebook.com/budgetbreeze",
    twitter: "https://twitter.com/budgetbreeze",
    linkedin: "https://linkedin.com/company/budgetbreeze",
  },
};

export default function WelcomeEmailPreview() {
  return <WelcomeEmail {...welcomeEmailDummyProps} />;
}