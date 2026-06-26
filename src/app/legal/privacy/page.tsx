import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `Privacy Policy for ${site.legalName}.`,
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      intro={`This Privacy Policy describes how ${site.legalName} collects, uses, and shares information about you when you use our websites and services.`}
      effectiveDate="TBD"
    >
      <LegalSection title="1. Information We Collect">
        <ul className="list-disc space-y-1 pl-6">
          <li>
            <strong>Account information:</strong> name, email address, and any
            other information you provide when creating an account.
          </li>
          <li>
            <strong>Usage information:</strong> log data, device information,
            browser type, IP address, and pages visited.
          </li>
          <li>
            <strong>Content:</strong> information you submit to or generate
            through our services.
          </li>
          <li>
            <strong>Cookies:</strong> see our{" "}
            <a
              href="/legal/cookies"
              className="text-accent underline underline-offset-4 hover:text-accent-hover"
            >
              Cookie Notice
            </a>
            .
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. How We Use Information">
        <p>We use information to:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Provide, maintain, and improve the services;</li>
          <li>Authenticate users and prevent abuse;</li>
          <li>Respond to inquiries and provide support;</li>
          <li>Comply with legal obligations.</li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Sharing and Subprocessors">
        <p>
          We share information with third-party service providers
          (subprocessors) who help us operate the services — for example,
          hosting, analytics, and email delivery providers. A current list of
          subprocessors will be published before any paid customer is
          onboarded.
        </p>
      </LegalSection>

      <LegalSection title="4. Data Retention">
        <p>
          We retain personal information only for as long as necessary to
          provide the services and comply with legal obligations. Account data
          is deleted within a reasonable period after account closure unless
          longer retention is required by law.
        </p>
      </LegalSection>

      <LegalSection title="5. Your Rights — GDPR (EEA / UK)">
        <p>
          If you are located in the European Economic Area or the United
          Kingdom, you have the right to access, rectify, erase, restrict, and
          port your personal data, and to object to its processing. Contact us
          at{" "}
          <a
            href={`mailto:${site.email.admin}`}
            className="text-accent underline underline-offset-4 hover:text-accent-hover"
          >
            {site.email.admin}
          </a>{" "}
          to exercise these rights.
        </p>
      </LegalSection>

      <LegalSection title="6. Your Rights — CCPA (California)">
        <p>
          California residents have the right to know what personal information
          we collect, to request deletion of that information, to opt out of
          the “sale” or “sharing” of personal information, and not to be
          discriminated against for exercising these rights. We do not sell
          personal information.
        </p>
      </LegalSection>

      <LegalSection title="7. Security">
        <p>
          We use commercially reasonable measures to protect personal
          information. No system is perfectly secure; we cannot guarantee
          absolute security.
        </p>
      </LegalSection>

      <LegalSection title="8. Contact">
        <p>
          For privacy questions or requests, contact{" "}
          <a
            href={`mailto:${site.email.admin}`}
            className="text-accent underline underline-offset-4 hover:text-accent-hover"
          >
            {site.email.admin}
          </a>
          .
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
