import type { Metadata } from "next";
import { LegalLayout, LegalSection } from "@/components/LegalLayout";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "DMCA Policy",
  description: `DMCA Policy and copyright takedown procedure for ${site.legalName}.`,
};

export default function DMCAPage() {
  return (
    <LegalLayout
      title="DMCA Policy"
      intro={`${site.legalName} respects the intellectual property rights of others and expects users of our services to do the same. This page describes how to submit a copyright takedown notice under the U.S. Digital Millennium Copyright Act (DMCA).`}
      effectiveDate="TBD"
    >
      <LegalSection title="Designated DMCA Agent">
        <p>
          Copyright takedown notices must be sent to our designated DMCA agent,
          registered with the U.S. Copyright Office:
        </p>
        <address className="not-italic rounded-xl border border-subtle bg-surface px-5 py-4 text-foreground">
          <div className="font-medium">DMCA Agent — {site.legalName}</div>
          <div className="text-muted">Email: dmca@swforhumans.com</div>
          <div className="text-muted">{site.address.line1}</div>
          <div className="text-muted">{site.address.line2}</div>
        </address>
      </LegalSection>

      <LegalSection title="1. Filing a Takedown Notice">
        <p>A valid DMCA notice must include:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>
            A physical or electronic signature of the copyright owner or an
            authorized representative;
          </li>
          <li>Identification of the copyrighted work claimed to be infringed;</li>
          <li>
            Identification of the allegedly infringing material and its
            location (URL);
          </li>
          <li>Your contact information (address, phone number, email);</li>
          <li>
            A statement that you have a good-faith belief that use of the
            material is not authorized;
          </li>
          <li>
            A statement, under penalty of perjury, that the information is
            accurate and that you are authorized to act on behalf of the
            copyright owner.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="2. Counter-Notice Procedure">
        <p>
          If you believe your content was removed in error, you may file a
          counter-notice with the same agent. It must include your contact
          information, identification of the removed material, a statement
          under penalty of perjury that the removal was a mistake or
          misidentification, and consent to the jurisdiction of the federal
          court in Virginia.
        </p>
      </LegalSection>

      <LegalSection title="3. Repeat Infringer Policy">
        <p>
          We will, in appropriate circumstances and at our discretion, disable
          or terminate the accounts of users we determine to be repeat
          infringers.
        </p>
      </LegalSection>
    </LegalLayout>
  );
}
