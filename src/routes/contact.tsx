import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock3, Mail, MapPin, Navigation, Phone } from "lucide-react";
import logoUrl from "@/assets/atufert-logo-transparent.png";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | Atufert Agrimations" },
      { name: "description", content: "Contact Atufert Agrimations Equipments in Nashik, Maharashtra." },
    ],
  }),
  component: ContactPage,
});

const address = "ME 14, Sundarban Colony, Magh Sector, Bhujbal Farm Rd, behind Hotel Royal Garden, near HDFC Bank, Cidco, Nashik, Maharashtra 422009";
const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Atufert+Agrimations+Equipments+Nashik";

function ContactPage() {
  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="mx-auto flex h-20 max-w-[1320px] items-center justify-between px-5 md:px-10">
        <Link to="/" aria-label="ATUFERT home"><img src={logoUrl} alt="ATUFERT Agrimations Equipments" className="h-12 w-auto object-contain mix-blend-multiply" /></Link>
        <Button variant="outline" asChild><Link to="/"><ArrowLeft size={15} /> Home</Link></Button>
      </header>

      <section className="mx-auto max-w-[1320px] px-5 pb-16 pt-10 md:px-10 md:pb-24 md:pt-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-olive">ATUFERT AGRIMATIONS EQUIPMENTS PVT LTD</p>
          <h1 className="mt-4 text-balance text-4xl font-medium leading-tight md:text-7xl">Let’s grow better agriculture together.</h1>
          <p className="mt-5 max-w-xl text-sm leading-6 text-muted-foreground md:text-base">Reach us for product enquiries, agricultural equipment solutions, and support from our Nashik office.</p>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-[1.1fr_0.9fr] md:gap-8">
          <div className="rounded-2xl bg-ink p-6 text-primary-foreground md:p-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-sun">Office & Contact</p>
            <div className="mt-8 grid gap-7">
              <div className="flex gap-4"><MapPin className="mt-1 shrink-0 text-sun" size={21} /><div><p className="text-xs uppercase opacity-60">Address</p><p className="mt-2 max-w-lg text-sm leading-6">{address}</p></div></div>
              <div className="flex gap-4"><Phone className="mt-1 shrink-0 text-sun" size={21} /><div><p className="text-xs uppercase opacity-60">Phone</p><a className="mt-2 block text-sm hover:text-sun" href="tel:+919096955533">+91 90969 55533</a></div></div>
              <div className="flex gap-4"><Mail className="mt-1 shrink-0 text-sun" size={21} /><div><p className="text-xs uppercase opacity-60">Email</p><a className="mt-2 block break-all text-sm hover:text-sun" href="mailto:atufertagrimations@gmail.com">atufertagrimations@gmail.com</a></div></div>
              <div className="flex gap-4"><Clock3 className="mt-1 shrink-0 text-sun" size={21} /><div><p className="text-xs uppercase opacity-60">Opening hours</p><p className="mt-2 text-sm">Open · Closes 6:00 pm</p></div></div>
            </div>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button variant="sun" asChild><a href={`mailto:atufertagrimations@gmail.com?subject=Product%20enquiry`}>Email us <Mail size={15} /></a></Button>
              <Button variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10" asChild><a href={mapsUrl} target="_blank" rel="noreferrer">Get directions <Navigation size={15} /></a></Button>
            </div>
          </div>

          <div className="min-h-[360px] overflow-hidden rounded-2xl border border-line bg-[#d8e0d5]">
            <iframe title="Atufert Agrimations Equipments location map" src="https://www.google.com/maps?q=Atufert+Agrimations+Equipments+Nashik&output=embed" className="h-full min-h-[360px] w-full border-0" loading="lazy" />
          </div>
        </div>
      </section>
    </main>
  );
}
