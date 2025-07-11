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
  Img,
  Column,
  Row,
} from '@react-email/components';

interface WelcomeEmailProps {
  username?: string | null;
  loginUrl: string;     
  appName: string;        
  helpCenterUrl?: string; 
  socialMediaLinks?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };
}

const defaultProps: WelcomeEmailProps = {
  username: 'Valued User',
  loginUrl: 'https://justabit.app/auth/login',
  appName: 'Just A Bit',
  helpCenterUrl: `https://justabit.app/acc?tab='Help'`,
};

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  username = defaultProps.username,
  loginUrl = defaultProps.loginUrl,
  appName = defaultProps.appName,
  helpCenterUrl = defaultProps.helpCenterUrl,
  socialMediaLinks,
}) => {
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
    margin: '0 auto',
  };

  const footer = {
    color: '#8898aa',
    fontSize: '12px',
    lineHeight: '16px',
    textAlign: 'center' as const,
  };

  const featureList = {
    listStyleType: 'disc',
    paddingLeft: '20px',
    margin: '10px 0',
  };

  const listItem = {
    marginBottom: '8px',
    color: '#525f7f',
    fontSize: '15px',
  };

  const heading = {
    color: '#1a202c',
    fontSize: '24px',
    fontWeight: 'bold',
    textAlign: 'center' as const,
    marginBottom: '20px',
  };

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={{ textAlign: 'center', marginBottom: '20px' }}>
            {/* logo */}
          </Section>

          <Text style={heading}>Welcome to {appName}!</Text>

          <Text style={paragraph}>Hi {username},</Text>
          <Text style={paragraph}>
            We're absolutely thrilled to have you join the {appName} community. Get ready to transform the way you manage your money and achieve your financial goals with clarity and confidence.
          </Text>

          <Text style={paragraph}>
            At {appName}, we believe budgeting should be simple, intuitive, and stress-free. That’s why we've designed powerful features to help you master your finances:
          </Text>

          <ul style={featureList}>
            <li style={listItem}>
              <strong>Effortless Expense Tracking:</strong> Easily log your income and expenses as they happen, so you always know where your money is going.
            </li>
            <li style={listItem}>
              <strong>Smart Envelope Budgeting:</strong> Our unique envelope system helps you allocate funds to different categories, preventing overspending and giving every dollar a purpose.
            </li>
            <li style={listItem}>
              <strong>Customizable Categories:</strong> Create envelopes for anything you need – from groceries to savings goals – making your budget truly yours.
            </li>
            <li style={listItem}>
              <strong>Clear Financial Insights:</strong> Gain a transparent view of your spending habits and financial progress with intuitive overviews and reports.
            </li>
            <li style={listItem}>
              <strong>Stay in Control:</strong> Whether you're planning for big purchases or just tracking daily spending, {appName} gives you the tools to stay on top of your finances.
            </li>
          </ul>

          <Text style={paragraph}>Ready to dive in? Here are a few quick steps to get started:</Text>

          <ol style={{ ...featureList, listStyleType: 'decimal' }}>
            <li style={listItem}><strong>Create Your First Envelope:</strong> Head over to your Envelopes page and set up your initial spending categories.</li>
            <li style={listItem}><strong>Add Your Income:</strong> Log your first income entry to get funds into your budget.</li>
            <li style={listItem}><strong>Track Your Expenses:</strong> Start adding your daily expenses to see your envelopes in action.</li>
          </ol>

          <Section style={{ textAlign: 'center', margin: '30px 0' }}>
            <Button style={button} href={loginUrl}>
              Log In Now
            </Button>
          </Section>

          <Text style={paragraph}>
            We're here to help you every step of the way. If you have any questions, feel free to visit our{' '}
            <Link href={helpCenterUrl} style={{ color: '#6366F1', textDecoration: 'underline' }}>
              Help Center/FAQ
            </Link>{' '}or contact our support team.
          </Text>

          <Text style={paragraph}>Happy budgeting!</Text>
          <Text style={paragraph}>The Team at {appName}</Text>

          <Hr style={hr} />

          <Text style={footer}>
            © {new Date().getFullYear()} {appName}. All rights reserved.
          </Text>
          {socialMediaLinks && (
            <Section style={{ textAlign: 'center', marginTop: '10px' }}>
              <Row>
                {socialMediaLinks.facebook && (
                  <Column style={{ padding: '0 5px' }}>
                    <Link href={socialMediaLinks.facebook} style={footer}>Facebook</Link>
                  </Column>
                )}
                {socialMediaLinks.twitter && (
                  <Column style={{ padding: '0 5px' }}>
                    <Link href={socialMediaLinks.twitter} style={footer}>Twitter</Link>
                  </Column>
                )}
                {socialMediaLinks.linkedin && (
                  <Column style={{ padding: '0 5px' }}>
                    <Link href={socialMediaLinks.linkedin} style={footer}>LinkedIn</Link>
                  </Column>
                )}
              </Row>
            </Section>
          )}
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;
