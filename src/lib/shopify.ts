import { toast } from "sonner";

// ============= Shopify Storefront API setup =============
export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "project-bhai-execute-m3dpx-c1d0sh3r.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "5c38508cdd34e8f34bd2e7435ceb5d20";

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType: string;
    tags: string[];
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    images: {
      edges: Array<{ node: { url: string; altText: string | null } }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

const STOREFRONT_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id
          title
          description
          handle
          productType
          tags
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
          images(first: 5) {
            edges {
              node {
                url
                altText
              }
            }
          }
          variants(first: 10) {
            edges {
              node {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
                selectedOptions {
                  name
                  value
                }
              }
            }
          }
          options {
            name
            values
          }
        }
      }
    }
  }
`;

export async function storefrontApiRequest<T = unknown>(query: string, variables: Record<string, unknown> = {}): Promise<T | undefined> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description:
        "Shopify API access requires an active Shopify billing plan. Upgrade at https://admin.shopify.com to continue.",
    });
    return undefined;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`Error calling Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`);
  }

  return data;
}

export async function fetchShopifyProducts(first = 50): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(STOREFRONT_QUERY, { first });
  return (data as { data: { products: { edges: ShopifyProduct[] } } } | undefined)?.data?.products?.edges ?? [];
}

// ============= Cart mutations =============
const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id
        checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id }
      userErrors { field message }
    }
  }
`;

const CART_QUERY = `
  query cart($id: ID!) {
    cart(id: $id) { id totalQuantity }
  }
`;

interface ShopifyUserError {
  field: (string | null)[] | null;
  message: string;
}

function formatCheckoutUrl(checkoutUrl: string): string {
  try {
    const url = new URL(checkoutUrl);
    url.searchParams.set("channel", "online_store");
    return url.toString();
  } catch {
    return checkoutUrl;
  }
}

function isCartNotFoundError(userErrors: ShopifyUserError[]): boolean {
  return userErrors.some(
    (e) => e.message.toLowerCase().includes("cart not found") || e.message.toLowerCase().includes("does not exist"),
  );
}

export async function createShopifyCart(
  item: { quantity: number; variantId: string },
): Promise<{ cartId: string; checkoutUrl: string; lineId: string } | null> {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] },
  });

  const result = (data as { data?: { cartCreate?: { userErrors: ShopifyUserError[]; cart: { id: string; checkoutUrl: string; lines: { edges: Array<{ node: { id: string } }> } } | null } } } | undefined)?.data?.cartCreate;
  if (!result) return null;

  if (result.userErrors.length > 0) {
    console.error("Cart creation failed:", result.userErrors);
    return null;
  }

  const cart = result.cart;
  if (!cart?.checkoutUrl) return null;

  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;

  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

export async function addLineToShopifyCart(
  cartId: string,
  item: { quantity: number; variantId: string },
): Promise<{ success: boolean; lineId?: string | undefined; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });

  const result = (data as { data?: { cartLinesAdd?: { userErrors: ShopifyUserError[]; cart: { lines: { edges: Array<{ node: { id: string; merchandise: { id: string } } }> } } | null } } } | undefined)?.data?.cartLinesAdd;
  if (!result) return { success: false };

  if (isCartNotFoundError(result.userErrors)) return { success: false, cartNotFound: true };
  if (result.userErrors.length > 0) {
    console.error("Add line failed:", result.userErrors);
    return { success: false };
  }

  const newLine = result.cart?.lines?.edges.find(
    (l) => l.node.merchandise.id === item.variantId,
  );
  return { success: true, lineId: newLine?.node.id };
}

export async function updateShopifyCartLine(
  cartId: string,
  lineId: string,
  quantity: number,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });

  const result = (data as { data?: { cartLinesUpdate?: { userErrors: ShopifyUserError[] } } } | undefined)?.data?.cartLinesUpdate;
  if (!result) return { success: false };

  if (isCartNotFoundError(result.userErrors)) return { success: false, cartNotFound: true };
  if (result.userErrors.length > 0) {
    console.error("Update line failed:", result.userErrors);
    return { success: false };
  }
  return { success: true };
}

export async function removeLineFromShopifyCart(
  cartId: string,
  lineId: string,
): Promise<{ success: boolean; cartNotFound?: boolean }> {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });

  const result = (data as { data?: { cartLinesRemove?: { userErrors: ShopifyUserError[] } } } | undefined)?.data?.cartLinesRemove;
  if (!result) return { success: false };

  if (isCartNotFoundError(result.userErrors)) return { success: false, cartNotFound: true };
  if (result.userErrors.length > 0) {
    console.error("Remove line failed:", result.userErrors);
    return { success: false };
  }
  return { success: true };
}

export async function queryShopifyCart(cartId: string): Promise<{ totalQuantity: number } | null> {
  const data = await storefrontApiRequest(CART_QUERY, { id: cartId });
  return (data as { data?: { cart?: { totalQuantity: number } | null } } | undefined)?.data?.cart ?? null;
}

// ============= Formatting helpers =============
export function formatMoney(amount: string, currencyCode: string): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      // The storefront catalog is presented in USD. Shopify can still use
      // the shopper's market currency at checkout when Markets is configured.
        currency: "INR",
      currencyDisplay: "narrowSymbol",
      maximumFractionDigits: 2,
    }).format(parseFloat(amount));
  } catch {
    return `${currencyCode} ${amount}`;
  }
}

// These two MotherLove ACV tonics stay contact-only per earlier product rules.
export function isContactOnly(product: ShopifyProduct): boolean {
  return product.node.title.startsWith("MotherLove");
}

export function firstVariant(product: ShopifyProduct) {
  return product.node.variants.edges[0]?.node ?? null;
}

export function productImage(product: ShopifyProduct): string | null {
  return product.node.images.edges[0]?.node.url ?? null;
}
