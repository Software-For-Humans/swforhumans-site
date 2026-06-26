import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of Service for ${site.legalName}.`,
};

export default function TermsPage() {
  return (
    <LegalLayout
      title="Terms of Service"
      intro={`These Terms of Service govern your access to and use of the websites, applications, and services operated by ${site.legalName} ("we", "us", "our"). By using our services, you agree to these terms.`}
      effectiveDate="TBD"
    >
      <LegalSection title="1. Acceptance of Terms">
        <p>
          By accessing or using any service operated by {site.legalName}, you
          agree to be bound by these Terms of Service and all applicable laws
          and regulations.
        </p>
      </LegalSection>

      <LegalSection title="2. Disclaimer of Warranties">
        <p>
          The services are provided <strong>“AS IS” and “AS AVAILABLE”</strong>,
          without warranties of any kind, whether express or implied, including
          but not limited to implied warranties of merchantability, fitness for
          a particular purpose, and non-infringement.
        </p>
      </LegalSection>

      <LegalSection title="3. Limitation of Liability">
        <p>
          To the maximum extent permitted by law, our total liability for any
          claim arising out of or relating to these terms or the services is
          limited to the greater of (a) the total fees you paid us in the
          twelve (12) months preceding the event giving rise to the claim, or
          (b) one hundred U.S. dollars (US$100) if the services were provided
          without charge.
        </p>
      </LegalSection>

      <LegalSection title="4. Indemnification">
        <p>
          You agree to defend, indemnify, and hold harmless {site.legalName}
          {" "}and its officers, employees, and affiliates from any claims,
          damages, or expenses (including reasonable attorneys’ fees) arising
          from your use of the services or violation of these terms.
        </p>
      </LegalSection>

      <LegalSection title="5. Intellectual Property">
        <p>
          All content, trademarks, software, and other intellectual property
          made available through the services are owned by {site.legalName} or
          its licensors. No license or right is granted except as expressly set
          forth in these terms.
        </p>
      </LegalSection>

      <LegalSection title="6. Account Termination">
        <p>
          We may suspend or terminate your access to the services at any time,
          with or without notice, for conduct that we believe violates these
          terms or is harmful to other users, us, or third parties.
        </p>
      </LegalSection>

      <LegalSection title="7. Governing Law and Forum">
        <p>
          These terms are governed by the laws of the Commonwealth of Virginia,
          without regard to its conflict-of-law principles. The exclusive forum
          for any non-arbitrable claim shall be the state and federal courts
          located in Virginia.
        </p>
      </LegalSection>

      <LegalSection title="8. Binding Arbitration; Class-Action Waiver">
        <p>
          Any dispute arising out of or relating to these terms or the services
          will be resolved by binding individual arbitration. You and{" "}
          {site.legalName} each waive the right to participate in a class
          action or class-wide arbitration. Details of the arbitration process
          will be specified in the final reviewed version of these terms.
        </p>
      </LegalSection>

      <LegalSection title="9. Changes to These Terms">
        <p>
          We may update these terms from time to time. Material changes will be
          posted on this page with an updated effective date.
        </p>
      </LegalSection>

      <LegalSection title="10. Contact">
        <p>
          Questions about these terms can be sent to{" "}
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
