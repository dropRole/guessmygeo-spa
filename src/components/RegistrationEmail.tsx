import React from "react";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";
import { Section } from "@react-email/section";
import { Hr } from "@react-email/hr";

interface IRegistrationEmailProps {
  username: string;
  registrated: Date;
}

export const RegistrationEmail: React.FC<IRegistrationEmailProps> = ({
  username,
  registrated,
}) => {
  return (
    <Html>
      <Head>
        <title>Registration</title>
        <meta charSet="UTF-8" />
      </Head>
      <Section style={{ fontFamily: "Roboto" }}>
        <p style={{ fontSize: "20px", textAlign: "center" }}>
          <span style={{ color: "hsl(203, 37%, 22%)" }}>Guess</span>
          <span style={{ color: "hsl(162, 23%, 49%)" }}>My</span>
          <span style={{ color: "hsl(203, 37%, 22%)" }}>Geo</span>
        </p>
      </Section>
      <Hr />
      <Section style={{ fontFamily: "Roboto" }}>
        <p style={{ fontSize: "16px", textAlign: "center" }}>
          Greetings {username},
        </p>
        <p style={{ textAlign: "center" }}>
          {`on day ${registrated.toLocaleDateString()} at ${registrated.toLocaleTimeString()} you've registrated for GuessMyGeo app.`}
          <br /> We wish you pleasant guessing experience.
        </p>
      </Section>
      <Hr />
      <Section>
        <p style={{ textAlign: "center" }}>Sincerely, GuessMyGeo team.</p>
      </Section>
    </Html>
  );
};
