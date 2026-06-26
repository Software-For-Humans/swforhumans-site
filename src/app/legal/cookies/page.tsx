import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookie Notice",
  description: `Cookie Notice for ${site.legalName} websites and services.`,
};

export default function CookiesPage() {
  return (
    <LegalLayout
      title="Cookie Notice"
      intro={`This Cookie Notice explains how ${site.legalName} uses cookies and similar technologies on our websites and services.`}
      effectiveDate="TBD"
    >
      <LegalSection title="1. What Are Cookies?">
        <p>
          Cookies are small text files placed on your device by the websites
          you visit. They are widely used to make websites work, improve
          performance, and provide analytical and marketing information to site
          operators.
        </p>
      </LegalSection>

      <LegalSection title="2. Categories of Cookies We Use">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong>Essential</strong> — required for the site to function
            (e.g., authentication, security, load balancing). These cannot be
            switched off.
          </li>
          <li>
            <strong>Analytics</strong> — help us understand how visitors
            interact with the site so we can improve it. These are anonymized
            where possible.
          </li>
          <li>
            <strong>Marketing</strong> — used only if and when we run paid
            campaigns; disabled by default until explicitly enabled.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="3. Managing Your Preferences">
        <p>
          On your first visit, you will be presented with a cookie banner
          allowing you to accept or reject non-essential cookies. You can
          change your preferences at any time from the footer of any page (link
          to be added when the consent management tool is integrated).
        </p>
      </LegalSection>

      <LegalSection title="4. Browser Controls">
        <p>
          You can also control cookies through your browser settings. Disabling
          essential cookies may affect the functioning of the services.
        </p>
      </LegalSection>

      <LegalSection title="5. Contact">
        <p>
          For questions about this notice, contact{" "}
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
