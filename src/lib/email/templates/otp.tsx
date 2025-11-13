import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface OtpEmailProps {
  otp: string;
}

export default function OtpEmail({ otp }: OtpEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your OTP code is {otp}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Verify Your Identity</Heading>
          <Text style={text}>
            We received a request to verify your identity using a one-time
            password (OTP).
          </Text>

          <Section style={otpBox}>
            <Text style={otpText}>{otp}</Text>
          </Section>

          <Text style={text}>
            This OTP is valid for the next <strong>2 minutes</strong>. Please do
            not share it with anyone.
          </Text>

          <Text style={text}>
            If you did not request this, please ignore this email or contact our
            support team.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            &copy; {new Date().getFullYear()} PH Tour. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = { backgroundColor: "#f7f8fa", fontFamily: "Arial, sans-serif" };
const container = {
  margin: "40px auto",
  padding: "30px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  boxShadow: "0 0 10px rgba(0,0,0,0.05)",
  maxWidth: "600px",
};
const h1 = { color: "#333333", fontSize: "24px", marginBottom: "20px" };
const text = {
  fontSize: "16px",
  color: "#555555",
  lineHeight: "1.6",
  margin: "10px 0",
};
const otpBox = {
  backgroundColor: "#f1f3f5",
  padding: "15px",
  textAlign: "center" as const,
  borderRadius: "6px",
  margin: "20px 0",
};
const otpText = {
  fontSize: "28px",
  fontWeight: "bold",
  letterSpacing: "5px",
  color: "#111111",
};
const hr = { borderColor: "#e6e6e6", margin: "30px 0" };
const footer = {
  fontSize: "13px",
  color: "#999999",
  textAlign: "center" as const,
};
