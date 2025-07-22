import * as React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Link,
  Button,
  Section,
  Hr,
  Column,
  Row,
} from '@react-email/components';

// Assuming these interfaces are defined elsewhere or in the same file for demonstration
export interface SummaryDetails {
  incomeTotals: number;
  expenseTotals: number;
  spendingDifference: number; // This is your netBalance
  spendingComparison: number; // Percentage change
  highestEnvelope: string;
  highestAmount: number;
  frequentEnvelope: string;
  highestSpendingLocation: string;
  highestSpendingAmount: number;
}

// Keep envelopesSummary separate if it provides a detailed list beyond SummaryDetails
interface DetailedEnvelopeSummary {
  name: string;
  spent: string; // These are still strings, assuming they are pre-formatted
  allocated: string;
}

interface MonthlyBudgetUpdateEmailProps {
  username: string;
  startDate: string; // Date string for display range
  endDate: string;   // Date string for display range
  summary: SummaryDetails; // The new prop for overall summary
  envelopesSummary?: DetailedEnvelopeSummary[]; // Optional: for detailed envelope breakdown
  appName: string;
  summaryUrl: string; // URL for the "View Summary" button
  unsubscribeUrl: string; // URL for the unsubscribe link
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  width: '580px',
  maxWidth: '100%',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const paragraph = {
  color: '#525f7f',
  fontSize: '16px',
  lineHeight: '24px',
  textAlign: 'left' as const,
};

const heading = {
  color: '#1a202c',
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  marginBottom: '20px',
};

const subHeading = {
  color: '#1a202c',
  fontSize: '22px',
  fontWeight: 'bold',
  marginTop: '25px',
  marginBottom: '10px',
  textAlign: 'center' as const,
};

const summaryBox = {
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  padding: '20px',
  border: '1px solid #e6ebf1',
  marginBottom: '20px',
};

const summaryRow = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
};

const summaryLabel = {
  color: '#214E0F',
  fontSize: '15px',
  fontWeight: 'normal' as const,
  marginRight: '4px'
};

const summaryValue = {
  color: '#1a202c',
  fontSize: '15px',
  fontWeight: 'bold' as const, // Added bold for values for better readability
};

const button = {
  backgroundColor: '#355329',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  width: 'fit-content',
  margin: '30px auto',
};

const envelopeBox = {
  border: '1px solid #A9ACA9',
  marginBottom: '4px',
  padding: '8px',
  textAlign: 'center' as const,
  borderRadius: '5px'
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};

// Helper function to format numbers as currency strings
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // You might want to make this dynamic based on user's currency setting
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

// Helper function to stringify dates (as provided by you)
const stringifyDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.warn(`Invalid date string provided: "${dateString}". Returning empty string.`);
      return "";
    }
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error(`Error processing date string "${dateString}":`, error);
    return "";
  }
};

export const MonthlyBudgetUpdateEmail: React.FC<MonthlyBudgetUpdateEmailProps> = ({
  username,
  startDate,
  endDate,
  summary, // Now receiving the SummaryDetails object
  envelopesSummary, // Still receiving optional detailed envelopes
  appName,
  summaryUrl, // New prop for the button link
}) => {
  // Determine if there's any financial activity to report
  const hasActivity = summary.incomeTotals > 0 || summary.expenseTotals > 0;

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Text style={heading}>Your Monthly Budget Update for {appName}</Text>

          <Text style={paragraph}>Hi {username},</Text>
          <Text style={paragraph}>
            Thank you for your continued use of {appName}! Here's a quick summary of your financial activity from {stringifyDate(startDate)} to {stringifyDate(endDate)}.
          </Text>

          <Section style={summaryBox}>
            <Text style={subHeading}>Overall Summary:</Text>
            {!hasActivity ? (
              <Text style={{ ...paragraph, textAlign: 'center', fontStyle: 'italic' }}>
                Nothing to report for this period.
              </Text>
            ) : (
              <>
                <Row style={summaryRow}>
                  <Column><Text style={summaryLabel}>Total Income: </Text></Column>
                  <Column><Text style={summaryValue}>{formatCurrency(summary.incomeTotals)}</Text></Column>
                </Row>
                <Row style={summaryRow}>
                  <Column><Text style={summaryLabel}>Total Expenses: </Text></Column>
                  <Column><Text style={summaryValue}>{formatCurrency(summary.expenseTotals)}</Text></Column>
                </Row>
                <Hr style={hr} />
                <Row style={summaryRow}>
                  <Column><Text style={summaryLabel}>Net Balance: </Text></Column>
                  <Column><Text style={summaryValue}>{formatCurrency(summary.spendingDifference)}</Text></Column>
                </Row>
                {/* Optional: Add spending comparison if relevant for monthly */}
                {summary.spendingComparison !== 0 && (
                    <Row style={summaryRow}>
                        <Column><Text style={summaryLabel}>Spending Change: </Text></Column>
                        <Column><Text style={summaryValue}>{summary.spendingComparison.toFixed(2)}%</Text></Column>
                    </Row>
                )}
                {/* Optional: Display highest spending envelope/location from SummaryDetails */}
                {summary.highestEnvelope && summary.highestAmount > 0 && (
                    <Row style={summaryRow}>
                        <Column><Text style={summaryLabel}>Highest Envelope: </Text></Column>
                        <Column><Text style={summaryValue}>{summary.highestEnvelope} ({formatCurrency(summary.highestAmount)})</Text></Column>
                    </Row>
                )}
                {summary.highestSpendingLocation && summary.highestSpendingAmount > 0 && (
                    <Row style={summaryRow}>
                        <Column><Text style={summaryLabel}>Highest Location: </Text></Column>
                        <Column><Text style={summaryValue}>{summary.highestSpendingLocation} ({formatCurrency(summary.highestSpendingAmount)})</Text></Column>
                    </Row>
                )}
              </>
            )}
          </Section>

          {/* Detailed Envelope Breakdown (if provided as a separate prop) */}
          {envelopesSummary && envelopesSummary.length > 0 && (
            <Section style={summaryBox}>
              <Text style={subHeading}>Envelope Breakdown:</Text>
              {envelopesSummary.map((envelope, index) => (
                <div key={index} style={envelopeBox}>
                  <Text style={{ ...summaryValue, fontSize: '16px', marginBottom: '5px', fontWeight:"bold" }}>{envelope.name}</Text>
                  <Row style={summaryRow}>
                    <Column><Text style={summaryLabel}>Spent:</Text></Column>
                    <Column><Text style={summaryValue}>{envelope.spent}</Text></Column>
                  </Row>
                  <Row style={summaryRow}>
                    <Column><Text style={summaryLabel}>Allocated:</Text></Column>
                    <Column><Text style={summaryValue}>{envelope.allocated}</Text></Column>
                  </Row>
                </div>
              ))}
            </Section>
          )}

          <Text style={paragraph}>
            For a more detailed look at your budget and financial progress, log in and view your monthly summary:
          </Text>

          <Section style={{ textAlign: 'center' }}>
            <Button style={button} href={summaryUrl}>
              View Summary
            </Button>
          </Section>

          <Hr style={hr} />

          <Text style={footer}>
            This is an automated email. You are receiving this email because you opted in to budget updates. To manage your email preferences or unsubscribe, please visit: <Link href={'justabit.app/acc/'} style={{ color: '#8898aa', textDecoration: 'underline' }}>Unsubscribe</Link>
          </Text>
          <Text style={footer}>
            © {new Date().getFullYear()} {appName}. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default MonthlyBudgetUpdateEmail;