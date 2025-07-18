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

interface MonthlyBudgetUpdateEmailProps {
  username: string;
  startDate: string;
  endDate: string;
  totalIncome: string;
  totalExpenses: string;
  netBalance: string;
  envelopesSummary: Array<{ name: string; spent: string; allocated: string }>;
  appName: string;
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
};

const button = {
  backgroundColor: '#6366F1',
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

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  textAlign: 'center' as const,
};

const stringifyDate=(dateString: string)=>{
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
}

export const MonthlyBudgetUpdateEmail: React.FC<MonthlyBudgetUpdateEmailProps> = ({
  username,
  startDate,
  endDate,
  totalIncome,
  totalExpenses,
  netBalance,
  envelopesSummary,
  appName,
}) => (
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
          <Row style={summaryRow}>
            <Column><Text style={summaryLabel}>Total Income: </Text></Column>
            <Column>
            {totalIncome === '0' ? (
              <Text style={summaryValue}>Nothing to report for this week.</Text>  
            ) : (
              <Text style={summaryValue}> {totalIncome}</Text>
            )}
            </Column>
          </Row>
          <Row style={summaryRow}>
            <Column><Text style={summaryLabel}>Total Expenses: </Text></Column>
            <Column><Text style={summaryValue}> {totalExpenses}</Text></Column>
          </Row>
          <Hr style={hr} />
          <Row style={summaryRow}>
            <Column><Text style={summaryLabel}>Net Balance: </Text></Column>
            <Column><Text style={summaryValue}> {netBalance}</Text></Column>
          </Row>
        </Section>

        {envelopesSummary && envelopesSummary.length > 0 && (
          <Section style={summaryBox}>
            <Text style={subHeading}>Envelope Breakdown:</Text>
            {envelopesSummary.map((envelope, index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
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
          <Button style={button} href={"justabit.app/monthly-summary"}>
           View Summary
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          This is an automated email. You are receiving this email because you opted in to weekly budget updates. To manage your email preferences or unsubscribe, please visit your account page.
        </Text>
        <Text style={footer}>
          © {new Date().getFullYear()} {appName}. All rights reserved.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default MonthlyBudgetUpdateEmail;