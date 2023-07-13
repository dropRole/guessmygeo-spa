import React from "react";
import { Link } from "@react-email/link";
import { Head } from "@react-email/head";
import { Html } from "@react-email/html";
import { Section } from "@react-email/section";
import { Hr } from "@react-email/hr";
import { IPasswordResetEmailProps } from "./interfaces/email";

export const PasswordResetEmail: React.FC<IPasswordResetEmailProps> = ({
  username,
  url,
  requested,
}) => {
  return (
    <Html>
      <Head>
        <title>Password reset</title>
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
          {`on day ${requested.toLocaleDateString()} at ${requested.toLocaleTimeString()} you've requested password reset.`}
          <br /> Therefore, we've sent a link to the reset form.
          <br /> The password reset token will expire in 24 hours.
        </p>
        <p style={{ textAlign: "center" }}>
          <Link href={url}>
            <button
              style={{
                background: "hsl(162, 23%, 49%)",
                color: "hsl(0, 0%, 100%)",
                boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.1)",
                border: "none",
                borderRadius: "4px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              RESET
            </button>
          </Link>
        </p>
      </Section>
      <Hr />
      <Section>
        <p style={{ textAlign: "center" }}>Sincerely, GuessMyGeo team.</p>
      </Section>
    </Html>
  );
};
