/** Mock adapter with sample data (enabled by NEXT_PUBLIC_USE_MOCK=true). */
import type { Locale } from "@/i18n/routing";
import type {
  Category,
  CategoryRow,
  CollectionPage,
  HomeContent,
  Look,
  Product,
  ProductSummary,
  Size,
  StoreApi,
} from "./types";

type T = Record<Locale, string>;

const categories: Record<string, T> = {
  outerwear: { ar: "ملابس خارجية", fr: "Vestes & manteaux", en: "Outerwear" },
  tops: { ar: "قمصان وتيشرتات", fr: "Hauts", en: "Tops" },
  footwear: { ar: "أحذية", fr: "Chaussures", en: "Footwear" },
  bottoms: { ar: "سراويل", fr: "Bas", en: "Bottoms" },
};

interface Seed {
  slug: string;
  art: string;
  category: keyof typeof categories;
  name: T;
  description: T;
  price: number;
  compareAt?: number;
  isNew?: boolean;
  shoes?: boolean;
  soldOut?: Size[];
}

const APPAREL: Size[] = ["XS", "S", "M", "L", "XL"];
const SHOES: Size[] = ["40", "41", "42", "43", "44"];

const seeds: Seed[] = [
  { slug: "nylon-zip-hoodie", art: "hoodie-stone", category: "outerwear", price: 7900, isNew: true,
    name: { ar: "هودي بسحاب نايلون", fr: "Hoodie zippé en nylon", en: "Nylon Full Zip Hoodie" },
    description: { ar: "هودي بسحاب كامل بقصّة قصيرة قليلاً وأكمام واسعة وقبعة تبقى منتصبة. قطعة أساسية لكل يوم.", fr: "Hoodie zippé légèrement court, manches amples et capuche qui garde sa forme. Une pièce essentielle du quotidien.", en: "A full zip hoodie with a slightly cropped fit, voluminous sleeves and a hood that holds its shape. An everyday staple." } },
  { slug: "denim-track-jacket", art: "jacket-denim", category: "outerwear", price: 6900, compareAt: 8500,
    name: { ar: "جاكيت جينز", fr: "Veste en jean", en: "Denim Track Jacket" },
    description: { ar: "جاكيت جينز مغسول بجيبين على الصدر وقصّة مريحة.", fr: "Veste en jean délavé, deux poches poitrine, coupe décontractée.", en: "Washed denim jacket with two chest pockets and a relaxed fit." } },
  { slug: "hooded-deck-coat", art: "coat-sand", category: "outerwear", price: 12900,
    name: { ar: "معطف طويل بقبعة", fr: "Manteau long à capuche", en: "Hooded Deck Coat" },
    description: { ar: "معطف طويل دافئ بأزرار أمامية ولون رملي هادئ.", fr: "Manteau long et chaud, boutonné, couleur sable.", en: "A long, warm coat with front buttons in a soft sand tone." } },
  { slug: "utility-jacket", art: "jacket-olive", category: "outerwear", price: 8400, isNew: true,
    name: { ar: "جاكيت عملي زيتي", fr: "Veste utilitaire olive", en: "Olive Utility Jacket" },
    description: { ar: "جاكيت متين بلون زيتي مع جيوب عملية.", fr: "Veste robuste olive avec poches utilitaires.", en: "A sturdy olive jacket with utility pockets." } },
  { slug: "charcoal-overcoat", art: "coat-charcoal", category: "outerwear", price: 13900,
    name: { ar: "معطف رمادي داكن", fr: "Pardessus anthracite", en: "Charcoal Overcoat" },
    description: { ar: "معطف كلاسيكي بلون رمادي داكن يناسب كل الإطلالات.", fr: "Pardessus classique anthracite, facile à porter.", en: "A classic charcoal overcoat that works with everything." } },
  { slug: "essential-hoodie-black", art: "hoodie-black", category: "outerwear", price: 5900,
    soldOut: ["XS"],
    name: { ar: "هودي أسود أساسي", fr: "Hoodie essentiel noir", en: "Essential Hoodie Black" },
    description: { ar: "هودي قطني ناعم بلون أسود.", fr: "Hoodie en coton doux, noir.", en: "Soft cotton hoodie in black." } },
  { slug: "henley-pullover", art: "shirt-plaid", category: "tops", price: 4200,
    name: { ar: "قميص مربعات", fr: "Chemise à carreaux", en: "Plaid Flannel Shirt" },
    description: { ar: "قميص فلانيل بمربعات حمراء، دافئ ومريح.", fr: "Chemise en flanelle à carreaux rouges, chaude et confortable.", en: "A warm, comfortable red plaid flannel shirt." } },
  { slug: "oxford-shirt-white", art: "shirt-white", category: "tops", price: 3900,
    name: { ar: "قميص أكسفورد أبيض", fr: "Chemise Oxford blanche", en: "White Oxford Shirt" },
    description: { ar: "قميص أبيض كلاسيكي من قماش أكسفورد.", fr: "Chemise blanche classique en tissu Oxford.", en: "A classic white Oxford cloth shirt." } },
  { slug: "heavy-tee-cream", art: "tee-cream", category: "tops", price: 2400, isNew: true,
    name: { ar: "تيشرت سميك كريمي", fr: "T-shirt épais crème", en: "Heavy Tee Cream" },
    description: { ar: "تيشرت قطني سميك بقصّة واسعة.", fr: "T-shirt en coton épais, coupe ample.", en: "Heavyweight cotton tee with a boxy fit." } },
  { slug: "heavy-tee-black", art: "tee-black", category: "tops", price: 2400,
    name: { ar: "تيشرت سميك أسود", fr: "T-shirt épais noir", en: "Heavy Tee Black" },
    description: { ar: "تيشرت قطني سميك بقصّة واسعة.", fr: "T-shirt en coton épais, coupe ample.", en: "Heavyweight cotton tee with a boxy fit." } },
  { slug: "black-skate-mid", art: "sneaker-black", category: "footwear", price: 9800, shoes: true,
    name: { ar: "حذاء رياضي أسود", fr: "Baskets mi-hautes noires", en: "Black Skate Mid Sneaker" },
    description: { ar: "حذاء رياضي متوسط الارتفاع بنعل أبيض.", fr: "Baskets mi-hautes, semelle blanche.", en: "Mid-top sneaker with a white sole." } },
  { slug: "red-skate-mid", art: "sneaker-red", category: "footwear", price: 9800, shoes: true, isNew: true,
    name: { ar: "حذاء رياضي أحمر", fr: "Baskets mi-hautes rouges", en: "Red Skate Mid Sneaker" },
    description: { ar: "حذاء رياضي متوسط الارتفاع باللون الأحمر.", fr: "Baskets mi-hautes rouges.", en: "Mid-top sneaker in red." } },
  { slug: "tear-away-sneaker", art: "sneaker-navy", category: "footwear", price: 8900, compareAt: 10900, shoes: true,
    name: { ar: "حذاء رياضي كحلي", fr: "Baskets bleu marine", en: "Navy Low Sneaker" },
    description: { ar: "حذاء رياضي منخفض بلون كحلي.", fr: "Baskets basses bleu marine.", en: "Low-top sneaker in navy." } },
  { slug: "chelsea-boot", art: "boot-cream", category: "footwear", price: 11500, shoes: true, soldOut: ["40"],
    name: { ar: "حذاء تشيلسي", fr: "Bottines Chelsea", en: "Chelsea Boot" },
    description: { ar: "حذاء تشيلسي من الجلد المدبوغ بلون كريمي.", fr: "Bottines Chelsea en suède crème.", en: "Chelsea boot in cream suede." } },
  { slug: "quilted-pant", art: "pants-black", category: "bottoms", price: 5900,
    name: { ar: "سروال مبطّن أسود", fr: "Pantalon matelassé noir", en: "Quilted Pant Black" },
    description: { ar: "سروال مريح مبطّن بخصر مرن.", fr: "Pantalon matelassé confortable, taille élastique.", en: "A comfortable quilted pant with an elastic waist." } },
  { slug: "slim-denim-jean", art: "jeans-light", category: "bottoms", price: 5400, isNew: true,
    name: { ar: "جينز ضيّق فاتح", fr: "Jean slim clair", en: "Slim Denim Jean" },
    description: { ar: "جينز بقصّة ضيقة ولون أزرق فاتح.", fr: "Jean coupe slim, bleu clair.", en: "Slim-fit jean in light blue." } },
];

const img = (art: string, n: number, alt: string) => ({ url: `/placeholders/${art}-${n}.svg`, alt });

function toCategory(slug: string, locale: Locale): Category {
  return { slug, name: categories[slug]?.[locale] ?? slug };
}

function toProduct(s: Seed, locale: Locale): Product {
  const sizes = s.shoes ? SHOES : APPAREL;
  const name = s.name[locale];
  return {
    id: `p_${s.slug}`,
    slug: s.slug,
    name,
    price: s.price,
    compareAtPrice: s.compareAt ?? null,
    image: img(s.art, 1, name),
    category: toCategory(s.category, locale),
    isNew: Boolean(s.isNew),
    description: s.description[locale],
    images: [1, 2, 3].map((n) => img(s.art, n, name)),
    sizes,
    variants: sizes.map((size, i) => ({
      id: `v_${s.slug}_${size}`,
      size,
      color: s.art.split("-")[1] ?? "default",
      stock: s.soldOut?.includes(size) ? 0 : 2 + ((i * 7) % 9),
      price: s.price,
      compareAtPrice: s.compareAt ?? null,
    })),
  };
}

const summary = (p: Product): ProductSummary => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  price: p.price,
  compareAtPrice: p.compareAtPrice,
  image: p.image,
  category: p.category,
  isNew: p.isNew,
});

const all = (locale: Locale) => seeds.map((s) => toProduct(s, locale));

const looks = (locale: Locale): Look[] => {
  const alt = { ar: "إطلالة", fr: "Look", en: "Look" }[locale];
  return [
    { id: "look-1", image: { url: "/placeholders/look-1.svg", alt: `${alt} 1` }, productSlugs: ["utility-jacket", "quilted-pant"] },
    { id: "look-2", image: { url: "/placeholders/look-2.svg", alt: `${alt} 2` }, productSlugs: ["essential-hoodie-black", "quilted-pant"] },
    { id: "look-3", image: { url: "/placeholders/look-3.svg", alt: `${alt} 3` }, productSlugs: ["charcoal-overcoat", "slim-denim-jean"] },
    { id: "look-4", image: { url: "/placeholders/look-4.svg", alt: `${alt} 4` }, productSlugs: ["henley-pullover", "quilted-pant"] },
  ];
};

function rows(locale: Locale, order: string[]): CategoryRow[] {
  const products = all(locale);
  return order.map((slug) => ({
    category: toCategory(slug, locale),
    products: products.filter((p) => p.category.slug === slug).map(summary),
  }));
}

const delay = <V>(v: V) => Promise.resolve(v);

export const mockApi: StoreApi = {
  getHome: (locale) =>
    delay<HomeContent>({
      announcement: null,
      hero: {
        title: { ar: "تشكيلة الشتاء", fr: "Collection hiver", en: "Winter Collection" }[locale],
        subtitle: { ar: "قطع دافئة بخطوط بسيطة", fr: "Des pièces chaudes aux lignes simples", en: "Warm pieces, simple lines" }[locale],
        image: { url: "/placeholders/hero-1.svg", alt: "" },
        collectionSlug: "winter",
      },
      looks: looks(locale),
      rows: rows(locale, ["outerwear", "footwear", "tops", "bottoms"]),
    }),

  getCollection: (slug, locale) =>
    delay<CollectionPage | null>(
      slug === "winter"
        ? {
            slug,
            title: { ar: "تشكيلة الشتاء", fr: "Collection hiver", en: "Winter Collection" }[locale],
            heroImage: { url: "/placeholders/hero-1.svg", alt: "" },
            looks: looks(locale),
            rows: rows(locale, ["bottoms", "outerwear", "footwear", "tops"]),
          }
        : null,
    ),

  getProduct: (slug, locale) => {
    const seed = seeds.find((s) => s.slug === slug);
    return delay(seed ? toProduct(seed, locale) : null);
  },

  listProducts: ({ q, category }, locale) => {
    const needle = q?.trim().toLowerCase();
    return delay(
      all(locale)
        .filter((p) => !category || p.category.slug === category)
        .filter(
          (p) =>
            !needle ||
            p.name.toLowerCase().includes(needle) ||
            p.category.name.toLowerCase().includes(needle) ||
            p.slug.includes(needle),
        )
        .map(summary),
    );
  },

  getRelated: (slug, locale) => {
    const current = seeds.find((s) => s.slug === slug);
    return delay(
      all(locale)
        .filter((p) => p.slug !== slug && p.category.slug === current?.category)
        .slice(0, 8)
        .map(summary),
    );
  },
};
