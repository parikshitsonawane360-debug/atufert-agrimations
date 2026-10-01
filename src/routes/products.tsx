import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Loader2, ShoppingBag, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import logoUrl from "@/assets/atufert-logo-transparent.png";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "@/components/CartDrawer";
import { useCartSync } from "@/hooks/useCartSync";
import { localProductByHandle, productCategories, products as localProducts, shopifyHandleBySlug } from "@/lib/products";
import {
  fetchShopifyProducts,
  firstVariant,
  formatMoney,
  isContactOnly,
  productImage,
  type ShopifyProduct,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

const productsSearchSchema = z.object({ product: z.string().optional() });

export const Route = createFileRoute("/products")({
  validateSearch: (search) => productsSearchSchema.parse(search),
  head: () => ({
    meta: [
      { title: "Atufert Agrimations — Products" },
      { name: "description", content: "Explore ATUFERT agricultural, animal health, bio-management, and crop nutrition products." },
      { property: "og:title", content: "Atufert Agrimations — Products" },
      { property: "og:description", content: "Browse ATUFERT products for farms, livestock, pets, and crops." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProductsPage,
});

type StoreProduct = {
  handle: string;
  name: string;
  size: string;
  price: string;
  prefix: string | undefined;
  contactOnly: boolean;
  type: string;
  image: string | null;
  description: string;
  imgClass: string | undefined;
  gallery: string[] | undefined;
  shopify: ShopifyProduct | null;
};

function toStoreProduct(shopify: ShopifyProduct): StoreProduct {
  const handle = shopify.node.handle;
  const local = localProductByHandle[handle];
  const variant = firstVariant(shopify);
  const price = variant?.price ?? shopify.node.priceRange.minVariantPrice;
  return {
    handle,
    name: shopify.node.title,
    size: local?.size ?? (variant && variant.title !== "Default Title" ? variant.title : ""),
    price: local?.price ?? formatMoney(price.amount, price.currencyCode),
    prefix: local?.prefix,
    contactOnly: Boolean(local?.contactOnly) || isContactOnly(shopify),
    type: shopify.node.productType || local?.type || "Product",
    image: productImage(shopify) ?? local?.image ?? null,
    description: shopify.node.description || local?.description || "",
    imgClass: local?.imgClass,
    gallery: local?.gallery,
    shopify,
  };
}

function toLocalStoreProduct(local: (typeof localProducts)[number]): StoreProduct {
  return {
    handle: shopifyHandleBySlug[local.slug],
    name: local.name,
    size: local.size,
    price: local.price,
    prefix: local.prefix,
    contactOnly: true,
    type: local.type,
    image: local.image,
    description: local.description,
    imgClass: local.imgClass,
    gallery: local.gallery,
    shopify: null,
  };
}

const categoryContent: Record<(typeof productCategories)[number], { title: string; description: string }> = {
  "All Products": {
    title: "Bio Management",
    description: "The search for non-toxic alternatives in crop production intensifies each year as consumer demand for chemical-free food increases. NTS has specialised in these products and offers an innovative range of natural options for the biological farmer.",
  },
  "Bio-Management": {
    title: "Bio Management",
    description: "The search for non-toxic alternatives in crop production intensifies each year as consumer demand for chemical-free food increases. NTS has specialised in these products and offers an innovative range of natural options for the biological farmer.",
  },
  Microbes: {
    title: "Microbes",
    description: "Beneficial microbial products to support root health, nutrient availability, and vigorous crop growth.",
  },
  "Microbe Culturing": {
    title: "Microbe Culturing",
    description: "Brewing adjuvants and microbial-culture support products formulated to help stabilise and protect microbial brews.",
  },
  "Monitoring Meters": {
    title: "Monitoring Meters",
    description: "Testing tools and sampling equipment for monitoring soil biology and preparing crop and soil samples.",
  },
  "Home Garden": {
    title: "Home Garden Specials",
    description: "Special selections for home gardens, balconies, and everyday plant care.",
  },
  "Animal Health": {
    title: "Animal Health",
    description: "Elevate your livestock's health with our expertly formulated nutritional supplements, harnessing the synergy of minerals and microbes. Our animal health collection features prebiotics to boost gut biology, nutrient-packed botanicals, and naturally chelated trace minerals. These superior feed additives cater to a diverse range of animals, including Horses, Dairy Cattle, Beef Cattle, Calves, Sheep, Poultry, Pigs, and Goats. Explore our selection and invest in your livestock's well-being.",
  },
  Humates: {
    title: "Humates",
    description: "Practical solutions to support soil health, crop nutrition, and stronger agricultural outcomes.",
  },
  "Dry Mineral Fertilisers": {
    title: "Dry Mineral Fertilisers",
    description: "Nutrient-rich dry fertilisers and soil conditioners designed to support soil structure, microbial activity, and productive crops.",
  },
  "Liquid Fertiliser Ranges": {
    title: "Liquid Fertiliser Ranges",
    description: "Premium liquid fertilisers for targeted crop nutrition and stronger, healthier growth.",
  },
  "Micronised Mineral": {
    title: "Micronised Mineral Suspensions",
    description: "Micronised mineral suspensions formulated to support soil and crop nutrition through efficient fertigation.",
  },
};

function ProductsPage() {
  const { product: selectedHandle } = Route.useSearch();
  const [activeCategory, setActiveCategory] = useState<(typeof productCategories)[number]>("All Products");
  const [galleryImage, setGalleryImage] = useState<string | null>(null);
  const addItem = useCartStore((state) => state.addItem);
  const isAdding = useCartStore((state) => state.isLoading);
  useCartSync();

  const { data: shopifyProducts, isLoading } = useQuery({
    queryKey: ["shopify-products"],
    queryFn: () => fetchShopifyProducts(50),
    staleTime: 60_000,
  });

  const storeProducts = useMemo(() => {
    const remoteProducts = (shopifyProducts ?? []).map(toStoreProduct);
    const remoteHandles = new Set(remoteProducts.map((product) => product.handle));
    const localOnlyProducts = localProducts
      .filter((product) => !remoteHandles.has(shopifyHandleBySlug[product.slug]))
      .map(toLocalStoreProduct);
    return [...remoteProducts, ...localOnlyProducts];
  }, [shopifyProducts]);
  const selectedProduct = storeProducts.find((product) => product.handle === selectedHandle);
  useEffect(() => setGalleryImage(null), [selectedHandle]);
  const filteredProducts = useMemo(
    () => activeCategory === "All Products"
      ? storeProducts.filter((product) => product.type !== "Home Garden")
      : storeProducts.filter((product) => product.type === activeCategory),
    [activeCategory, storeProducts],
  );
  const activeContent = categoryContent[activeCategory];

  const handleAddToCart = async (product: StoreProduct) => {
    if (!product.shopify) {
      toast.info("Please contact us to order this product.");
      return;
    }
    const variant = firstVariant(product.shopify);
    if (!variant) {
      toast.error("This product is not available right now.");
      return;
    }
    const added = await addItem({
      product: product.shopify,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions,
    });
    if (added) {
      toast.success(`${product.name} added to cart`);
    } else {
      toast.error("Product could not be added to cart", {
        description: "Shopify checkout is not reachable right now. Please refresh or contact ATUFERT.",
      });
    }
  };

  return (
    <main className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-30 border-b border-line bg-paper/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-5 md:px-10">
          <Link to="/" aria-label="ATUFERT home"><img src={logoUrl} alt="ATUFERT Agrimations Equipments" className="h-11 w-auto object-contain md:h-13" /></Link>
          <nav className="flex items-center gap-3 md:gap-8">
            <Link to="/" className="hidden text-xs font-semibold transition-colors hover:text-olive sm:inline">Home</Link>
            <span className="text-xs font-semibold text-olive">Products</span>
            <CartDrawer />
          </nav>
        </div>
      </header>

      {selectedProduct && (
        <section className="border-b border-line bg-paper-deep px-5 py-10 md:px-10 md:py-14">
          <div className="relative mx-auto grid max-w-[1120px] gap-10 md:grid-cols-[1.05fr_.95fr] md:items-center">
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 z-10" aria-label="Close product details" asChild>
              <Link to="/products" search={{}}><X size={17} /></Link>
            </Button>
            <div className="aspect-square overflow-hidden rounded-lg bg-card">
              {selectedProduct.image && (
                <img src={galleryImage ?? selectedProduct.image} alt={selectedProduct.name} className={`h-full w-full object-contain p-8 md:p-14 ${selectedProduct.imgClass ?? ""}`} />
              )}
            </div>
            {selectedProduct.gallery && (
              <div className="grid grid-cols-4 gap-3 md:col-start-1 md:row-start-2">
                {selectedProduct.gallery.map((image) => (
                  <button type="button" key={image} onClick={() => setGalleryImage(image)} className={`aspect-square overflow-hidden rounded-md border bg-card ${galleryImage === image ? "border-ink" : "border-line"}`} aria-label={`View ${selectedProduct.name} image`}>
                    <img src={image} alt={selectedProduct.name} className="h-full w-full object-contain p-2" />
                  </button>
                ))}
              </div>
            )}
            <div className="pr-4 md:pr-10">
              <p className="text-xs font-semibold uppercase text-olive">{selectedProduct.type}</p>
              <h2 className="mt-4 text-balance text-3xl font-medium leading-tight md:text-5xl">{selectedProduct.name}</h2>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">{selectedProduct.description}</p>
              <div className="mt-7 flex items-center gap-8 border-y border-line py-5">
                {selectedProduct.size && (
                  <div><p className="text-[10px] uppercase text-muted-foreground">Pack size</p><p className="mt-1 text-sm font-semibold">{selectedProduct.size}</p></div>
                )}
                <div><p className="text-[10px] uppercase text-muted-foreground">Price</p><p className="mt-1 text-lg font-semibold">{selectedProduct.prefix && <span className="mr-1 text-xs font-normal">{selectedProduct.prefix}</span>}{selectedProduct.price}</p></div>
              </div>
              {selectedProduct.contactOnly ? (
                <Button className="mt-7" asChild><a href="mailto:atufertagrimations@gmail.com?subject=Product%20enquiry">Contact to order <ArrowRight size={15} /></a></Button>
              ) : (
                <Button className="mt-7" disabled={isAdding} onClick={() => handleAddToCart(selectedProduct)}>
                  {isAdding ? <Loader2 size={15} className="animate-spin" /> : <>Add to cart <ShoppingBag size={15} /></>}
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="px-5 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1320px]">
          <div className="-mx-5 overflow-x-auto border-b border-line px-5 pb-4 md:mx-0 md:px-0 md:pb-7" aria-label="Product categories">
            <div className="flex w-max min-w-full flex-nowrap gap-2" role="tablist" aria-label="Product categories">
            {productCategories.map((category) => (
              <Button
                key={category}
                type="button"
                variant={activeCategory === category ? "default" : "outline"}
                size="sm"
                role="tab"
                aria-selected={activeCategory === category}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
            </div>
          </div>
          {isLoading ? (
            <div className="flex items-center justify-center py-24"><Loader2 className="size-8 animate-spin text-olive" /></div>
          ) : storeProducts.length === 0 ? (
            <p className="py-24 text-center text-sm text-muted-foreground">Products abhi load nahi ho paye. Please refresh the page.</p>
          ) : (
            <div className="mt-9 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-7 md:gap-y-14">
              {filteredProducts.map((product) => (
                <article key={product.handle} className="group min-w-0">
                  <Link to="/products" search={{ product: product.handle }} className="block" aria-label={`View ${product.name}`}>
                    <div className="relative aspect-square overflow-hidden rounded-lg border border-line bg-card transition-colors group-hover:border-olive">
                      {product.image && (
                        <img src={product.image} alt={product.name} loading="lazy" className={`absolute inset-0 m-auto h-full w-full object-contain p-5 transition-transform duration-500 group-hover:scale-[1.035] md:p-10 ${product.imgClass ?? ""}`} />
                      )}
                    </div>
                    <p className="mt-4 text-[10px] font-semibold uppercase text-olive">{product.type}</p>
                    <div className="mt-2 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="text-sm font-semibold leading-5 md:text-base">{product.name}</h2>
                        {product.size && <p className="mt-1 text-xs text-muted-foreground">{product.size}</p>}
                        <p className="mt-2 font-semibold">{product.prefix && <span className="mr-1 text-xs font-normal">{product.prefix}</span>}{product.price}</p>
                      </div>
                      <span className="grid size-9 shrink-0 place-items-center rounded-full border border-line transition-colors group-hover:border-olive group-hover:text-olive"><ArrowRight size={15} /></span>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-ink px-5 py-12 text-paper md:px-10">
        <div className="mx-auto flex max-w-[1320px] flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div><Link to="/" className="inline-block rounded bg-paper p-2"><img src={logoUrl} alt="ATUFERT Agrimations Equipments" className="h-11 w-auto object-contain" /></Link><p className="mt-5 max-w-sm text-xs leading-5 opacity-60">Supporting agriculture with carefully selected solutions for farms, livestock, pets, and crops.</p></div>
          <div className="flex flex-wrap gap-6 text-xs"><Link to="/">Home</Link><Link to="/products">Products</Link><Link to="/contact">Contact</Link><a href="https://wa.me/919096955533?text=Hello%20ATUFERT%2C%20I%20would%20like%20to%20know%20more%20about%20your%20products." target="_blank" rel="noreferrer">WhatsApp</a></div>
        </div>
        <div className="mx-auto mt-10 flex max-w-[1320px] flex-col gap-3 border-t border-paper/20 pt-6 text-[10px] opacity-50 sm:flex-row sm:items-center sm:justify-between"><span>© 2026 ATUFERT Agrimations Equipments. All rights reserved.</span><div className="flex gap-5"><Link to="/privacy-policy" className="underline underline-offset-4">Privacy Policy</Link><Link to="/terms-of-service" className="underline underline-offset-4">Terms of Service</Link></div></div>
      </footer>
    </main>
  );
}
