import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck, Globe, Headset, Leaf, Menu, Minus, Plus, Sprout, Tractor, Waves, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import seedlingHero from "@/assets/seedling-hero.png";
import productImage from "@/assets/fertilizer-product.jpg";
import aboutBanner from "@/assets/about-banner.jpg";
import logoUrl from "@/assets/atufert-logo-transparent.png";
import { products, shopifyHandleBySlug } from "@/lib/products";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartSync } from "@/hooks/useCartSync";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Atufert Agrimations" },
    { name: "description", content: "Premium natural fertilizer made from rescued food waste for richer soil, healthier plants, and a lighter footprint." },
    { property: "og:title", content: "Atufert Agrimations" },
    { property: "og:description", content: "Feed your plants and restore the soil with clean organic fertilizer." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ]}),
  component: Index,
});

const benefits = [
  { label: "Decrease Carbon", Icon: Leaf },
  { label: "Promotes Soil Health", Icon: Sprout },
  { label: "Saves Water & Resources", Icon: Waves },
];

const faqs = [
  ["What is ATUFERT AGRIMATIONS organic fertilizer?", "ATUFERT AGRIMATIONS organic fertilizers are made from natural, nutrient-rich materials to support healthy plant growth, improve soil quality, and promote sustainable farming."],
  ["How is ATUFERT AGRIMATIONS fertilizer different from chemical fertilizers?", "Our fertilizers are designed with natural and organic inputs that help improve soil health and provide nutrients to plants while supporting environmentally friendly farming practices."],
  ["What are the benefits of using ATUFERT AGRIMATIONS fertilizers?", "They help improve soil fertility, support healthy root development, enhance plant growth, and provide essential nutrients for better crop performance."],
  ["Is ATUFERT AGRIMATIONS fertilizer safe for all types of plants?", "Our fertilizers can be used for a wide range of crops and plants. The recommended application rate may vary depending on the crop, soil condition, and product, so always follow the product instructions."],
];

const focusAreas = [
  { title: "Agricultural Equipment", text: "Equipment solutions to support agricultural activities and professional farming operations.", Icon: Tractor },
  { title: "Product Quality", text: "A commitment to careful product selection and quality-focused business practices.", Icon: BadgeCheck },
  { title: "Customer Support", text: "Building strong relationships by understanding customer requirements and providing professional service.", Icon: Headset },
  { title: "Market Development", text: "Expanding our presence across India and exploring opportunities in international agricultural markets.", Icon: Globe },
];

const whyChoose = [
  ["Quality-Focused Approach", "We value dependable products and professional standards in every aspect of our business."],
  ["Customer-Centered Service", "Our customers are at the heart of our growth. We focus on understanding their needs and building long-term relationships."],
  ["Agriculture-Focused Expertise", "We are committed to understanding the requirements of the agricultural sector and supporting its development."],
  ["India & International Reach", "We aspire to serve customers across India while developing meaningful opportunities in international markets."],
  ["Long-Term Partnership", "Our approach is based on trust, transparency, and sustainable business relationships."],
];

function Index() {
  const [quantity, setQuantity] = useState(1);
  const [weight, setWeight] = useState("1 kg");
  const [openFaq, setOpenFaq] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [aboutOpen, setAboutOpen] = useState(false);
  useCartSync();

  useEffect(() => {
    document.body.style.overflow = aboutOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setAboutOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKey); };
  }, [aboutOpen]);

  return <main className="overflow-hidden bg-paper text-ink">
    <header className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10">
      <Link to="/" aria-label="ATUFERT home" className="shrink-0"><img src={logoUrl} alt="ATUFERT Agrimations Equipments" className="h-11 w-auto object-contain mix-blend-multiply md:h-13" /></Link>
      <nav className="hidden items-center gap-10 text-xs font-semibold md:flex">
        <a className="cursor-pointer transition-colors hover:text-olive" onClick={(e) => { e.preventDefault(); setAboutOpen(true); }}>About us</a>
        <Link className="transition-colors hover:text-olive" to="/products">Products</Link>
        <a className="transition-colors hover:text-olive" href="#faq">FAQ</a>
      </nav>
      <div className="flex items-center gap-3">
        <Button variant="ghost" className="size-10 px-0 md:w-auto md:px-4" aria-label="Open menu"><Menu size={16} /><span className="hidden md:inline">Menu</span></Button>
        <CartDrawer />
      </div>
    </header>

    <section id="top" className="relative mx-auto min-h-[760px] max-w-[1440px] px-5 pb-12 pt-6 md:px-10 md:pt-14">
      <div className="relative z-10 max-w-[660px]">
        <h1 className="text-balance text-[clamp(4.3rem,9.5vw,9.3rem)] font-medium leading-[0.78] tracking-normal">ATUFERT<br/>AGRIMATIONS</h1>
        <p className="mt-8 max-w-[420px] text-sm leading-6 text-muted-foreground">Turning food waste into clean energy and organic fertilizer, we create a sustainable future while reducing landfill pollution and carbon emissions.</p>
        <div className="mt-7 flex items-center gap-2"><Button asChild><Link to="/products">View Products</Link></Button><Button variant="sun" className="size-10 px-0" aria-label="View products" asChild><Link to="/products"><span aria-hidden>→</span></Link></Button></div>
      </div>
      <img src={seedlingHero} alt="Young green plant growing in organic soil" width={1200} height={1200} className="pointer-events-none absolute left-1/2 top-32 w-[min(62vw,760px)] -translate-x-[38%] object-contain md:top-2" />
      <div className="relative z-10 mt-64 ml-auto w-full max-w-sm md:absolute md:right-10 md:top-48 md:mt-0 md:w-80">
        {benefits.map(({label, Icon}) => <div key={label} className="flex items-center justify-between border-b border-line py-5 text-sm font-semibold"><span>{label}</span><Icon className="text-olive" size={23} strokeWidth={1.5}/></div>)}
      </div>
      <div className="relative z-10 mt-12 flex items-end justify-between md:absolute md:inset-x-10 md:bottom-10 md:mt-0">
        <p className="max-w-52 text-xs leading-5 text-muted-foreground">One small change can grow a healthier future.<br/><a className="mt-2 inline-block cursor-pointer font-semibold text-olive underline underline-offset-4" onClick={() => setAboutOpen(true)}>Learn More</a></p>
        <div className="text-right"><p className="text-3xl font-medium">4.8/5 <span className="text-lg text-sun">★</span></p><p className="mt-1 text-xs text-muted-foreground">Explore our trusted<br/>customer reviews</p></div>
      </div>
    </section>

    {aboutOpen && <div className="fixed inset-0 z-50 overflow-y-auto bg-paper animate-in fade-in duration-300">
      <button className="fixed right-5 top-5 z-20 grid size-11 place-items-center rounded-full bg-ink text-primary-foreground transition-colors hover:bg-olive md:right-8 md:top-8" aria-label="Close About Us" onClick={() => setAboutOpen(false)}><X size={18}/></button>
      <div className="relative flex h-[300px] items-center justify-center overflow-hidden md:h-[430px]">
        <img src={aboutBanner} alt="Sunrise over green farmland with a farmer" width={1920} height={704} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-ink/30" />
        <div className="relative z-10 px-5 text-center text-primary-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-balance text-5xl font-medium md:text-7xl">About Us</h2>
          <p className="mt-4 text-sm opacity-90 md:text-base">Learn more about ATUFERT Agrimations Equipments</p>
        </div>
      </div>
      <div className="mx-auto max-w-[860px] px-5 py-16 md:py-20">
        <img src={logoUrl} alt="ATUFERT Agrimations Equipments logo" width={1024} height={768} className="mx-auto h-14 w-auto mix-blend-multiply md:h-16" />
        <h3 className="mt-8 text-balance text-center text-3xl font-medium leading-tight md:text-4xl">Growing Better Agriculture. Building a Sustainable Future.</h3>
        <p className="mt-8 text-sm leading-6 text-muted-foreground">Welcome to ATUFERT AGRIMATIONS EQUIPMENTS, an emerging agricultural solutions company committed to supporting farmers with innovative products, practical solutions and a progressive approach to modern agriculture.</p>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">Based in India, our vision is to contribute to a more productive, sustainable and efficient agricultural future by connecting farmers with solutions that support crop performance, farm productivity and long-term agricultural development.</p>
        <p className="mt-5 text-sm leading-6 text-muted-foreground">We believe that agriculture is not just an industry—it is the foundation of food security, rural livelihoods and a healthier future.</p>
        <div className="mt-9 text-center"><Button asChild><Link to="/products">Explore ATUFERT Products</Link></Button></div>

        <section className="mt-16 border-t border-line pt-12">
          <p className="text-xs font-semibold uppercase tracking-wide text-olive">Our Vision</p>
          <h4 className="mt-3 text-balance text-2xl font-medium leading-tight md:text-3xl">Building a Stronger Agricultural Future</h4>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">Our vision is to establish ATUFERT AGRIMATIONS EQUIPMENTS as a recognized and trusted agricultural equipment company in India and across international markets.</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">We aim to grow through responsible business practices, product-focused innovation, customer satisfaction, and partnerships that create lasting value for the agricultural community.</p>
        </section>

        <section className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-wide text-olive">What We Do</p>
          <h4 className="mt-3 text-balance text-2xl font-medium leading-tight md:text-3xl">Agricultural Equipment & Solutions</h4>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">ATUFERT AGRIMATIONS EQUIPMENTS focuses on agricultural equipment and solutions designed to support the changing needs of modern agriculture.</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">We aim to connect customers with equipment that prioritizes practical use, reliability, and operational efficiency.</p>
        </section>

        <section className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-wide text-olive">Our Focus Areas</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {focusAreas.map(({ title, text, Icon }) => (
              <div key={title} className="rounded-lg border border-line bg-card p-6">
                <Icon className="text-olive" size={22} strokeWidth={1.5} />
                <h5 className="mt-4 text-sm font-semibold">{title}</h5>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-wide text-olive">Why Choose ATUFERT?</p>
          <h4 className="mt-3 text-balance text-2xl font-medium leading-tight md:text-3xl">Built on Trust. Driven by Agriculture.</h4>
          <div className="mt-6">
            {whyChoose.map(([title, text], i) => (
              <div key={title} className="flex gap-5 border-b border-line py-5 first:border-t">
                <span className="pt-0.5 text-xs font-semibold text-olive">0{i + 1}</span>
                <div>
                  <h5 className="text-sm font-semibold">{title}</h5>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14">
          <p className="text-xs font-semibold uppercase tracking-wide text-olive">Our Commitment</p>
          <p className="mt-5 text-sm leading-6 text-muted-foreground">At ATUFERT AGRIMATIONS EQUIPMENTS, we believe that progress in agriculture requires continuous learning, responsible innovation, and collaboration.</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">We are committed to developing our product portfolio, improving customer experiences, and building a business that creates value for agricultural professionals and communities.</p>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">Every relationship represents an opportunity to learn, improve, and contribute to the future of agriculture.</p>
        </section>

        <section className="mt-14 rounded-lg bg-ink p-7 text-primary-foreground md:p-10">
          <p className="text-xs font-semibold uppercase tracking-wide text-sun">Growing Together</p>
          <h4 className="mt-3 text-balance text-2xl font-medium leading-tight md:text-3xl">A Partner for Agricultural Progress</h4>
          <p className="mt-5 text-sm leading-6 opacity-80">Whether you are a farmer, agricultural business, distributor, or international partner, ATUFERT AGRIMATIONS EQUIPMENTS welcomes opportunities to connect and explore mutually beneficial collaborations.</p>
          <p className="mt-4 text-sm leading-6 opacity-80">Our journey is driven by a simple purpose: to support agriculture through reliable equipment, professional service, and a vision for long-term growth.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild><Link to="/products">Explore Our Products</Link></Button>
            <Button variant="ghost" className="border border-primary-foreground/30 bg-transparent hover:bg-primary-foreground/10" onClick={() => { setAboutOpen(false); requestAnimationFrame(() => document.querySelector('#contact')?.scrollIntoView()); }}>Contact Us</Button>
          </div>
          <div className="mt-10 border-t border-primary-foreground/20 pt-7">
            <p className="text-sm font-semibold">ATUFERT AGRIMATIONS EQUIPMENTS</p>
            <p className="mt-1 text-xs opacity-70">Supporting Agriculture. Building Tomorrow.</p>
          </div>
        </section>
      </div>
    </div>}

    <section id="products" className="bg-paper-deep px-5 py-20 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1320px]">
        <div className="flex items-end justify-between gap-6 border-b border-line pb-6">
          <div><p className="mb-2 text-xs font-semibold uppercase text-olive">Store Specials</p><Link to="/products" className="group inline-flex items-center gap-3"><h2 className="text-4xl font-medium md:text-5xl">Our Products</h2><span className="text-2xl transition-transform group-hover:translate-x-1" aria-hidden>→</span></Link></div>
          <p className="hidden max-w-xs text-right text-xs leading-5 text-muted-foreground md:block">Organic inputs and daily-care products for farms, livestock, pets, and crops.</p>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 md:gap-x-6 md:gap-y-12">
          {products.filter((item) => !["Humates", "Dry Mineral Fertilisers", "Home Garden"].includes(item.type)).map((item) => (
            <article key={item.name} className="group">
              <Link to="/products" search={{ product: shopifyHandleBySlug[item.slug] }} className="relative block h-44 overflow-hidden rounded-lg border border-border bg-card md:h-56" aria-label={`View ${item.name}`}>
                <img src={item.image} alt={item.name} loading="lazy" width={768} height={768} className={`absolute inset-0 m-auto h-full w-full object-contain p-1.5 md:p-4 transition-transform duration-500 group-hover:scale-[1.03] ${item.imgClass ?? ""}`} />
              </Link>
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-olive">{item.type}</p>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  {item.contactOnly && <p className="mb-2 text-[10px] font-semibold uppercase text-olive">Order via phone/contact form</p>}
                  <h3 className="text-sm font-semibold leading-5 md:text-base">{item.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{item.size}</p>
                  <p className="mt-2 text-base font-semibold text-ink">{item.prefix && <span className="mr-1 text-xs">{item.prefix}</span>}{item.price}</p>
                </div>
                <Button variant="outline" className="size-9 shrink-0 px-0" aria-label={`View ${item.name}`} asChild><Link to="/products" search={{ product: shopifyHandleBySlug[item.slug] }}><span aria-hidden>→</span></Link></Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section id="faq" className="px-5 py-24 md:px-10 md:py-28">
      <div className="mx-auto max-w-[900px]"><div className="text-center"><h2 className="text-balance text-4xl font-medium md:text-5xl">Frequently Asked Questions</h2><p className="mt-4 text-xs text-muted-foreground">Everything you need to know about feeding plants naturally.</p></div>
        <div className="mt-12">{faqs.map(([question, answer], i) => <div key={question} className={`border-b border-line ${openFaq === i ? "my-2 rounded-lg border border-olive bg-card px-5" : "px-5"}`}><button className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold" onClick={() => setOpenFaq(openFaq === i ? -1 : i)} aria-expanded={openFaq === i}><span>{question}</span>{openFaq === i ? <Minus size={17}/> : <Plus size={17}/>}</button>{openFaq === i && <p className="max-w-2xl pb-6 text-xs leading-5 text-muted-foreground">{answer}</p>}</div>)}</div>
      </div>
    </section>

    <footer id="contact" className="relative overflow-hidden bg-ink px-5 pb-8 pt-20 text-primary-foreground md:px-10">
      <div className="relative z-10 mx-auto grid max-w-[1320px] gap-12 text-xs md:grid-cols-4">
          <div><Link to="/" aria-label="ATUFERT home" className="inline-block"><img src={logoUrl} alt="ATUFERT Agrimations Equipments" className="h-16 w-auto object-contain md:h-18" /></Link><div className="mt-12 flex gap-6 opacity-70"><a href="#about" className="cursor-pointer" onClick={(e) => { e.preventDefault(); setAboutOpen(true); }}>About Us</a><Link to="/products">Products</Link><a href="#faq">FAQ</a></div></div>
        <div><p className="opacity-40">Social Media</p><div className="mt-5 grid gap-3"><a href="https://wa.me/919096955533?text=Hello%20ATUFERT%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products." target="_blank" rel="noreferrer">WhatsApp</a></div></div>
        <div><p className="opacity-40">Contact Info</p><div className="mt-5 grid gap-3"><a href="tel:+919096955533">+91 9096955533</a><a href="mailto:atufertagrimations@gmail.com">atufertagrimations@gmail.com</a></div></div>
        <div><p className="opacity-40">Address</p><p className="mt-5 leading-5">Nashik,<br/>Maharashtra, India</p></div>
      </div>
      <p className="mt-12 whitespace-nowrap text-[clamp(3.3rem,9vw,8.5rem)] font-medium leading-none text-primary-foreground/10">ATUFERT AGRIMATIONS</p>
      <div className="relative z-10 mx-auto mt-14 flex max-w-[1320px] flex-col gap-4 text-[10px] opacity-50 md:flex-row md:justify-between"><p>© 2026 ATUFERT Agrimations Equipments. All rights reserved.</p><div className="flex gap-6"><Link to="/privacy-policy">Privacy Policy</Link><Link to="/terms-of-service">Terms of Service</Link><a href="#top">Accessibility</a></div></div>
    </footer>
  </main>;
}
