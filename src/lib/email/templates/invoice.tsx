import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface InvoiceEmailProps {
  name: string;
  email: string;
  bookingId: string;
  tourTitle: string;
  bookingDate: string;
  paymentId: string;
  amountPerGuest: string;
  totalGuests: number;
  amount: string;
  paymentMethod: string;
  TrxId: string;
}

export const InvoiceEmail = ({
  name,
  email,
  bookingId,
  tourTitle,
  bookingDate,
  paymentId,
  amountPerGuest,
  totalGuests,
  amount,
  paymentMethod,
  TrxId,
}: InvoiceEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>{`Invoice for your booking ${bookingId} - PH Tour`}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 text-gray-900 font-sans">
          <Container className="bg-white dark:bg-[#111] shadow-lg rounded-xl mx-auto my-10 p-8 max-w-lg">
            <Heading className="text-2xl font-semibold text-center text-blue-600 dark:text-blue-400">
              PH Tour - Booking Invoice
            </Heading>

            <Hr className="border-gray-300 dark:border-gray-700 my-4" />

            <Section className="text-sm leading-relaxed">
              <Text className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
                Customer Details
              </Text>
              <Text>
                <strong>Name:</strong> {name}
              </Text>
              <Text>
                <strong>Email:</strong> {email}
              </Text>
              <Text>
                <strong>Booking ID:</strong> {bookingId}
              </Text>
              <Text>
                <strong>Tour Title:</strong> {tourTitle}
              </Text>
              <Text>
                <strong>Booking Date:</strong> {bookingDate}
              </Text>
            </Section>

            <Hr className="border-gray-300 dark:border-gray-700 my-4" />

            <Section className="text-sm leading-relaxed">
              <Text className="font-semibold text-lg text-gray-800 dark:text-gray-200 mb-2">
                Payment Information
              </Text>
              <Text>
                <strong>Payment ID:</strong> {paymentId}
              </Text>
              <Text>
                <strong>Amount per Guest:</strong> {amountPerGuest}
              </Text>
              <Text>
                <strong>Total Guests:</strong> {totalGuests}
              </Text>
              <Text>
                <strong>Total Paid:</strong> {amount}
              </Text>
              <Text>
                <strong>Payment Method:</strong> {paymentMethod}
              </Text>
              <Text>
                <strong>Transaction ID:</strong> {TrxId}
              </Text>
            </Section>

            <Hr className="border-gray-300 dark:border-gray-700 my-4" />

            <Section className="text-center mt-4">
              <Text className="text-base text-gray-700 dark:text-gray-300">
                Thank you for booking your tour with{" "}
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  PH Tour
                </span>
                ! We hope you have a memorable journey.
              </Text>
            </Section>

            <Section className="text-center mt-6">
              <Button
                href="https://ph-tour.com/dashboard/bookings"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                View Your Booking
              </Button>
            </Section>

            <Hr className="border-gray-300 dark:border-gray-700 my-6" />

            <Text className="text-xs text-gray-500 text-center">
              © {new Date().getFullYear()} PH Tour. All rights reserved. <br />
              This is an automated message — please do not reply.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default InvoiceEmail;
