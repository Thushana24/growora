import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface OtpEmailProps {
  username?: string;
  otp?: string;
  purpose?: string; // e.g., SIGNUP / LOGIN / PASSWORD RESET
}

export const OtpEmail = ({
  username,
  otp,
  purpose = "SIGNUP",
}: OtpEmailProps) => {
  const previewText = `Your OTP code for ${purpose} verification`;

  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="mx-auto my-auto bg-white px-2 font-sans">
          <Preview>{previewText}</Preview>
          <Container className="mx-auto my-10 max-w-[465px] rounded border border-solid border-[#eaeaea] p-5">
            <Section className="mt-8">
              <Img
                src="https://firebasestorage.googleapis.com/v0/b/host-media-862d8.appspot.com/o/logo.jpg?alt=media&token=b361445c-309e-4b40-aead-4049a7b3c75b"
                width="40"
                height="37"
                alt="Growora Logo"
                className="mx-auto my-0"
              />
            </Section>

            <Heading className="mx-0 my-[30px] text-center text-[24px] font-normal text-black">
              OTP Verification
            </Heading>

            <Text className="text-[14px] leading-6 text-black">
              Hello {username || "User"},
            </Text>

            <Text className="text-[14px] leading-6 text-black">
              Your one-time password (OTP) for <strong>{purpose}</strong> is:
            </Text>

            <Section className="my-6 text-center">
              <Text className="text-[28px] font-bold tracking-widest text-gray-900">
                {otp}
              </Text>
            </Section>

            <Text className="text-[14px] leading-6 text-gray-700">
              This OTP is valid for <strong>10 minutes</strong>. Please do not
              share it with anyone.
            </Text>

            <Hr className="my-[26px] w-full border border-solid border-[#eaeaea]" />

            <Text className="text-[12px] text-[#666666] text-center">
              If you did not request this code, you can safely ignore this
              email.
            </Text>

            <Text className="text-[12px] text-[#999999] text-center mt-4">
              — The Growora Team
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default OtpEmail;
