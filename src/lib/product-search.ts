import { Product } from "@/types/commerce";

function normalize(input: string) {
  return input.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function hasAlias(query: string, aliases: string[]) {
  return aliases.some((alias) => query.includes(alias));
}

export function productMatchesSearch(product: Product, rawQuery: string) {
  const query = normalize(rawQuery);
  if (!query) return true;

  const productText = normalize(`${product.name} ${product.category}`);
  const category = normalize(product.category);

  // "two piece / 2 piece" should show: salwar + frog + gown
  const twoPieceAliases = [
    "2piece",
    "twopiece",
    "twopices",
    "twopeice",
    "tupiece",
    "towpiece",
    "tupece",
    "2pice"
  ];

  // "frog" should show: frog + gown
  const frogAliases = ["frog", "frogs", "frg", "frgs", "frok", "froog"];

  // "gown" should show: frog + gown
  const gownAliases = ["gown", "gaun", "gwon", "gon", "gwn"];

  const salwarAliases = ["salwar", "salowar", "slwar", "salwr"];
  const plazoAliases = ["plazo", "plazoo", "pajama", "pajamas", "palazzo"];

  if (hasAlias(query, twoPieceAliases)) {
    return (
      category.includes("salwar") ||
      category.includes("twopieces") ||
      category.includes("frogs") ||
      category.includes("gown")
    );
  }

  if (hasAlias(query, frogAliases) || hasAlias(query, gownAliases)) {
    return category.includes("frogs") || category.includes("gown");
  }

  if (hasAlias(query, salwarAliases)) {
    return category.includes("salwar");
  }

  if (hasAlias(query, plazoAliases)) {
    return category.includes("plazo");
  }

  return productText.includes(query);
}

export function filterProductsBySearch(products: Product[], query: string) {
  return products.filter((product) => productMatchesSearch(product, query));
}

