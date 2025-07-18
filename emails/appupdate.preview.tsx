import * as React from 'react';
import NewFeaturesEmail from './appupdate';

const newFeaturesEmailDummyProps = {
  username: "NewUser",
  appName: "BudgetBreeze App",
  updateTitle: "Exciting New Features Just Launched!",
  featuresList: [
    {
      title: "Enhanced Analytics Dashboard",
      description: "Get deeper insights into your spending habits with our redesigned dashboard. Visualize your finances like never before!",
      imageUrl: "https://example.com/analytics-dashboard.png",
      linkUrl: "https://budgetbreeze.com/features/analytics",
    },
    {
      title: "Customizable Budget Categories",
      description: "Tailor your budget to your unique needs. Create, edit, and delete categories to match your lifestyle.",
      imageUrl: "https://example.com/categories-update.png",
      linkUrl: "https://budgetbreeze.com/features/categories",
    },
    {
      title: "Dark Mode Support",
      description: "Enjoy a more comfortable viewing experience, especially at night, with our brand new dark mode.",
    },
  ],
};

export default function NewFeaturesEmailPreview() {
  return <NewFeaturesEmail {...newFeaturesEmailDummyProps} />;
}