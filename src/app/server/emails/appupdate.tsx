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
import { faHandPointRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface NewFeaturesEmailProps {
  username?: string | null;
  appName: string;
  updateTitle: string; // e.g., "Exciting New Features Just Launched!"
  featuresList: Array<{ title: string; description: string; imageUrl?: string; linkUrl?: string }>;
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

const featureTitle = {
  color: '#1a202c',
  fontSize: '18px',
  fontWeight: 'bold',
  marginBottom: '8px',
};

const featureDescription = {
  color: '#525f7f',
  fontSize: '15px',
  lineHeight: '22px',
  marginBottom: '15px',
};

const featureImage = {
  maxWidth: '100%',
  borderRadius: '8px',
  marginBottom: '10px',
};

const button = {
  backgroundColor: '#3C5931',
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

export const NewFeaturesEmail: React.FC<NewFeaturesEmailProps> = ({
  username = 'Valued User',
  appName,
  updateTitle,
  featuresList,
}) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        <Text style={heading}>{updateTitle}</Text>

        <Text style={paragraph}>Hi {username},</Text>
        <Text style={paragraph}>
          We've been busy making {appName} even better for you! Check out some of the exciting new features and improvements we've just rolled out:
        </Text>

        <Section>
          {featuresList.map((feature, index) => (
            <div key={index} style={{ marginBottom: '30px', padding: '15px', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e6ebf1' }}>
              <Text style={featureTitle}>- {feature.title}</Text>
              <Text style={featureDescription}>{feature.description}</Text>
              {feature.linkUrl && (
                <Link href={feature.linkUrl} style={{ color: '#4FA62D', textDecoration: 'underline', fontSize: '14px' }}>
                  Learn More &rarr;
                </Link>
              )}
            </div>
          ))}
        </Section>

        <Text style={paragraph}>
          Read more on these updates by clicking 'Learn More' on any specific features. Otherwise, jump right in to experience the improved lifestyle changes firsthand. We welcome you back to Just A Bit, and we have much more coming soon. Thank you for your continued support!
        </Text>

        <Section style={{ textAlign: 'center' }}>
          <Button style={button} href={"justabit.app/"}>
            Return to Just A Bit
          </Button>
        </Section>

        <Hr style={hr} />

        <Text style={footer}>
          © {new Date().getFullYear()} {appName}. All rights reserved.
        </Text>
        
      </Container>
    </Body>
  </Html>
);

export default NewFeaturesEmail;