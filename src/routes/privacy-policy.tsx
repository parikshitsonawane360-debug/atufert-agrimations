import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Mail } from "lucide-react";
import logoUrl from "@/assets/atufert-logo-transparent.png";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Atufert Agrimations" },
      { name: "description", content: "Privacy Policy for Atufert Agrimations." },
    ],
  }),
  component: PrivacyPolicyPage,
});

const collectedInformation = [
  "Name",
  "Email address",
  "Phone number",
  "Billing and shipping address",
  "Order and transaction details",
  "Information you provide when contacting us",
  "Website browsing and usage information",
  "Device, browser, IP address, and technical information",
  "Information collected through cookies and similar technologies",
];

const informationUses = [
  "Process and fulfill orders",
  "Process payments",
  "Provide our products and services",
  "Respond to inquiries and provide customer support",
  "Communicate with you about orders and services",
  "Improve our website and customer experience",
  "Maintain website security",
  "Detect and prevent fraud or unauthorized activity",
  "Send promotional communications where permitted",
  "Comply with applicable laws and legal requirements",
];

const sharedWith = [
  "Shopify and website service providers",
  "Payment processors",
  "Shipping and delivery providers",
  "Technology and analytics providers",
  "Customer support providers",
  "Professional service providers",
  "Government authorities where legally required",
];

const rights = [
  "Request access to your personal information",
  "Request correction of inaccurate information",
  "Request deletion of certain information",
  "Ask how your information is being used",
  "Withdraw consent where applicable",
  "Opt out of certain marketing communications",
];

function PolicyList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 grid gap-3 text-sm leading-6 text-muted-foreground md:grid-cols-2">
      {items.map((item) => <li key={item} className="flex gap-3"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-olive" />{item}</li>)}
    </ul>
  );
}

function PolicySection({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-line py-9 md:py-12">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">{number}</p>
      <h2 className="mt-3 text-2xl font-medium md:text-3xl">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="border-b border-line bg-paper/95">
        <div className="mx-auto flex h-20 max-w-[1180px] items-center justify-between px-5 md:px-10">
          <Link to="/" aria-label="Atufert Agrimations home"><img src={logoUrl} alt="Atufert Agrimations" className="h-10 w-auto object-contain md:h-12" /></Link>
          <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold transition-colors hover:text-olive"><ArrowLeft size={15} /> Back to home</Link>
        </div>
      </header>

      <section className="bg-ink px-5 py-20 text-paper md:px-10 md:py-28">
        <div className="mx-auto max-w-[920px]">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sun">ATUFERT AGRIMATIONS</p>
          <h1 className="mt-5 text-balance text-5xl font-medium leading-[0.95] md:text-8xl">Privacy Policy</h1>
          <p className="mt-7 text-sm text-paper/65">Last Updated: September 23, 2026</p>
        </div>
      </section>

      <article className="mx-auto max-w-[920px] px-5 py-14 md:px-10 md:py-20">
        <p className="text-base leading-7 text-muted-foreground">At <strong className="font-semibold text-ink">ATUFERT AGRIMATIONS</strong>, we respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, and protect information when you visit or use <strong className="font-semibold text-ink">atufertagrimations.com</strong>, purchase our products, or contact us.</p>

        <PolicySection number="01" title="Information We Collect">
          <p className="text-sm leading-6 text-muted-foreground">When you use our website or services, we may collect information such as:</p>
          <PolicyList items={collectedInformation} />
          <p className="mt-6 text-sm leading-6 text-muted-foreground">We collect only the information reasonably necessary to operate our website, provide our products and services, process orders, communicate with customers, and improve our services.</p>
        </PolicySection>

        <PolicySection number="02" title="How We Use Your Information">
          <p className="text-sm leading-6 text-muted-foreground">We may use your information to:</p>
          <PolicyList items={informationUses} />
        </PolicySection>

        <PolicySection number="03" title="Payments">
          <p className="text-sm leading-6 text-muted-foreground">Payments made through our website may be processed through <strong className="font-semibold text-ink">Shopify and/or third-party payment providers</strong> available through our online store.</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">Payment providers may collect and process payment information necessary to complete your transaction and prevent fraudulent activity. We do not intentionally store complete payment card information on our own systems. Payment information may be subject to the privacy policies and security practices of the relevant payment provider.</p>
        </PolicySection>

        <PolicySection number="04" title="Shopify">
          <p className="text-sm leading-6 text-muted-foreground">Our online store is powered by <strong className="font-semibold text-ink">Shopify</strong>. Shopify may process certain information necessary to operate our online store, process transactions, provide website functionality, maintain security, and support our services.</p>
          <a href="https://privacy.shopify.com/en" target="_blank" rel="noreferrer" className="mt-5 inline-block text-sm font-semibold text-olive underline decoration-olive/40 underline-offset-4 hover:text-olive-dark">Shopify Privacy Controls</a>
        </PolicySection>

        <PolicySection number="05" title="Cookies">
          <p className="text-sm leading-6 text-muted-foreground">Our website may use cookies and similar technologies to:</p>
          <PolicyList items={["Keep our website functioning properly", "Remember preferences", "Understand website usage", "Improve website performance", "Analyze website traffic", "Support relevant advertising and marketing activities"]} />
          <p className="mt-6 text-sm leading-6 text-muted-foreground">You may control or disable cookies through your browser settings. Disabling certain cookies may affect some website functionality.</p>
          <a href="https://www.shopify.com/in/legal/cookies" target="_blank" rel="noreferrer" className="mt-5 inline-block text-sm font-semibold text-olive underline decoration-olive/40 underline-offset-4 hover:text-olive-dark">Shopify Cookie Policy</a>
        </PolicySection>

        <PolicySection number="06" title="Sharing Your Information">
          <p className="text-sm leading-6 text-muted-foreground">We may share information when reasonably necessary with:</p>
          <PolicyList items={sharedWith} />
          <p className="mt-6 text-sm leading-6 text-muted-foreground">We do not sell your personal information as part of our ordinary business operations. Third-party service providers may handle information according to their own privacy policies.</p>
        </PolicySection>

        <PolicySection number="07" title="Data Security"><p className="text-sm leading-6 text-muted-foreground">We take reasonable measures to protect your personal information from unauthorized access, misuse, loss, alteration, or disclosure. Our website may rely on security measures provided by Shopify and other service providers. However, no online system or method of electronic transmission can be guaranteed to be completely secure.</p></PolicySection>
        <PolicySection number="08" title="Data Retention"><p className="text-sm leading-6 text-muted-foreground">We retain personal information only for as long as reasonably necessary for business, transaction, legal, security, and customer-service purposes. The period for which information is retained may vary depending on the type of information and the purpose for which it was collected.</p></PolicySection>

        <PolicySection number="09" title="Your Privacy Rights">
          <p className="text-sm leading-6 text-muted-foreground">Depending on applicable law, you may have rights regarding your personal information, including the right to:</p>
          <PolicyList items={rights} />
          <p className="mt-6 text-sm leading-6 text-muted-foreground">To make a privacy-related request, you can contact us using the details below.</p>
        </PolicySection>

        <PolicySection number="10" title="Marketing Communications"><p className="text-sm leading-6 text-muted-foreground">If we send promotional or marketing communications, you may unsubscribe at any time by using the unsubscribe option provided in the communication or by contacting us. We may still send important non-promotional communications relating to your orders, transactions, or services.</p></PolicySection>
        <PolicySection number="11" title="Third-Party Websites"><p className="text-sm leading-6 text-muted-foreground">Our website may contain links to third-party websites or services. We are not responsible for the privacy practices or security of third-party websites. We recommend reviewing their privacy policies before providing personal information.</p></PolicySection>
        <PolicySection number="12" title="Children's Privacy"><p className="text-sm leading-6 text-muted-foreground">Our website and services are not intentionally directed toward children. We do not knowingly collect personal information from children where prohibited by applicable law.</p></PolicySection>
        <PolicySection number="13" title="Changes to This Privacy Policy"><p className="text-sm leading-6 text-muted-foreground">We may update this Privacy Policy from time to time to reflect changes to our business, website, services, or applicable legal requirements. Any changes will be posted on this page with an updated “Last Updated” date.</p></PolicySection>

        <section className="mt-2 rounded-lg bg-olive p-7 text-primary-foreground md:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sun">14 · Contact Us</p>
          <h2 className="mt-3 text-3xl font-medium">Questions about your privacy?</h2>
          <p className="mt-5 text-sm leading-6 opacity-85">If you have any questions about this Privacy Policy or how we handle your information, please contact us.</p>
          <div className="mt-7 grid gap-3 text-sm">
            <p className="font-semibold">ATUFERT AGRIMATIONS</p>
            <p>Location: Nashik, Maharashtra, India</p>
            <a href="mailto:atufertagrimations@gmail.com" className="inline-flex items-center gap-2 underline underline-offset-4"><Mail size={15} /> atufertagrimations@gmail.com</a>
            <p>Website: atufertagrimations.com</p>
          </div>
        </section>
      </article>

      <footer className="bg-ink px-5 py-8 text-center text-xs text-paper/60 md:px-10"><Link to="/" className="underline underline-offset-4 hover:text-paper">Back to Atufert Agrimations</Link></footer>
    </main>
  );
}
