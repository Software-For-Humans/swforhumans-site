import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Acceptable Use Policy",
  description: `Acceptable Use Policy for ${site.legalName} services.`,
};

export default function AcceptableUsePage() {
  return (
    <LegalLayout
      title="Acceptable Use Policy"
      intro={`This Acceptable Use Policy describes activities that are prohibited when using services operated by ${site.legalName}. It supplements our Terms of Service.`}
      effectiveDate="TBD"
    >
      <LegalSection title="1. Prohibited Activities">
        <p>You may not use the services to:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Violate any applicable law or regulation;</li>
          <li>Infringe the intellectual property or privacy rights of others;</li>
          <li>
            Distribute malware, spyware, or other malicious software, or attempt
            to compromise the security of the services;
          </li>
          <li>
            Send unsolicited bulk communications (spam) or otherwise abuse the
            services to harass or defraud others;
          </li>
          <li>
            Attempt to gain unauthorized access to any account, system, or
            network;
          </li>
          <li>
            Interfere with or disrupt the integrity or performance of the
            services or the data they contain;
          </li>
          <li>
            Resell, sublicense, or commercially exploit the services without our
            prior written consent.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Enforcement">
        <p>
          Violations of this policy may result in temporary or permanent
          suspension of your account, removal of offending content, and
          referral to law enforcement where appropriate. We may take action
          without prior notice when we believe immediate action is necessary to
          protect users, the services, or third parties.
        </p>
      </LegalSection>

      <LegalSection title="3. Reporting Abuse">
        <p>
          To report a violation of this policy, contact{" "}
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
