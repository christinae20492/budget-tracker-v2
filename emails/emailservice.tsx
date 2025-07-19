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

interface EmailProps {
  username?: string | null;
}

const defaultProps: EmailProps = {
  username: 'Valued User',
};

export const EmailServiceAlert: React.FC<EmailProps> = ({
  username = defaultProps.username,
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
          <Text style={heading}>Receiving Emails from Just A Bit</Text>

          <Text style={paragraph}>Hi {username},</Text>
          <Text style={paragraph}>
            We're proud to announce that henceforth, Just A Bit will be utilizing an email service! You will be alerted whenever the app goes through any major updates, including a short
            description of new features to whet your appetite. We will also be sending emails alerting of any downtime for the app or any other urgent news.
          </Text>

          <Text style={paragraph}>
            In addition, you can also receive weekly and/or monthly budget updates detailing your incomes, expenses, and the purchases made for each envelope. For those emails, you are
            able to completely opt out if you so choose. To do so, simply go to the 'Account' page, click on the 'Preferences' tab, and click the button for 'No, unsubscribe from optional emails',
            and you're done!
          </Text>

          <Text style={paragraph}>
            Thank you for your continued support and usage of our app,
          </Text>

          <Text style={paragraph}>
            -The Team at Just A Bit
          </Text>

        </Container>
      </Body>
    </Html>
  );
};

export default EmailServiceAlert;
