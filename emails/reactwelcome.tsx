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
  loginUrl: 'justabit.app/auth/login',
  appName: 'Just A Bit',
  helpCenterUrl: `justabit.app/acc?tab='Help'`,
};

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  username = defaultProps.username,
  loginUrl = defaultProps.loginUrl,
  appName = defaultProps.appName,
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
    marginTop: '4px'
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
          </Section>
          <Text style={heading}>Welcome to {appName}!</Text>

          <Text style={paragraph}>Hi {username},</Text>
          <Text style={paragraph}>
            Welcome to the {appName} community! We're happy to see that you've decided to hold a firmer grasp on your money, and we provide all the tools for you to do so with complete ease and convenience.
          </Text>

          <Text style={paragraph}>
            At {appName}, we believe that finance is a topic that anyone should be able to understand and execute. Your money should not be moving without your know-how or without educated decision making. Therefore, we provide these features for your benefit:
          </Text>

          <ul style={featureList}>
            <li style={listItem}>
              <strong>Effortless Tracking:</strong> Log your purchases and incomes right as they come on our convenient calendar.
            </li>
            <li style={listItem}>
              <strong>Smart Envelope Budgeting:</strong> Create envelopes to organize your purchases into. You can even decide if a category has a set amount for budgeting, or if it's more lenient.
            </li>
            <li style={listItem}>
              <strong>Privacy & Security:</strong> You always have the ability to delete your account and all associated data.
            </li>
            <li style={listItem}>
              <strong>Clear Financial Insights:</strong> Track your details by the month or the year - whichever you choose! See how your money's been moving and how much you've saved so far.
            </li>
            <li style={listItem}>
              <strong>Choose Your Preferences:</strong> Whether you want your theme light or dark, or if you want to see budgeting update emails, you can decide yourself by changing your user preferences.
            </li>
          </ul>

          <Text style={paragraph}>Ready to dive in? Here are a few quick steps to get started:</Text>

          <ol style={{ ...featureList, listStyleType: 'decimal' }}>
            <li style={listItem}><strong>Create Your First Envelope:</strong> Head over to your Envelopes page and set up your first envelope.</li>
            <li style={listItem}><strong>Add Your Income:</strong> Log your first income entry to get funds into your budget.</li>
            <li style={listItem}><strong>Track Your Expenses:</strong> Start adding your daily expenses to see your envelopes in action.</li>
            <li style={listItem}><strong>Help On The Way:</strong> If you ever have any questions, visiting the 'Help' tab on the 'Account' page - there's an answer for everything!</li>
          </ol>

          <Section style={{ textAlign: 'center', margin: '30px 0' }}>
            <Button style={button} href={loginUrl}>
              Log In Now
            </Button>
          </Section>

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
