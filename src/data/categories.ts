export interface CategoryItem {
  id: string;
  label: string;
  title: string;
  description: string;
  icon: string;
  imageUrl: string;
  accent: string;
}

export const categories: CategoryItem[] = [
  {
    id: "Salwar Kameez",
    label: "Everyday Elegance",
    title: "Salwar Kameez",
    description: "Comfort-first designs with stylish detailing.",
    icon: "✨",
    imageUrl: "/products/kurti/salwar1/olive.jpeg",
    accent: "#0ea5e9"
  },
  {
    id: "Two Pieces",
    label: "Modern Styles",
    title: "Two Pieces",
    description: "Comfortable and trendy two piece sets for daily wear.",
    icon: "🌿",
    imageUrl: "/products/kurti/two-piece/blue.jpeg",
    accent: "#38bdf8"
  },
  {
    id: "Three Pieces",
    label: "Premium Set",
    title: "Three Pieces",
    description: "Pure cotton three piece sets with elegant print and embroidery.",
    icon: "💫",
    imageUrl: "/products/kurti/three-piece/purple.jpeg",
    accent: "#0ea5e9"
  },
  {
    id: "Frogs",
    label: "Trending Collection",
    title: "Frogs",
    description: "Stylish frogs with elegant print and embroidery finishing.",
    icon: "👗",
    imageUrl: "/products/kurti/frog1/magenda.jpeg",
    accent: "#0ea5e9"
  },
  {
    id: "Gown",
    label: "One Piece",
    title: "Gown Collection",
    description: "Ready-made cotton gown one piece with embroidery and glass work.",
    icon: "🌸",
    imageUrl: "/products/kurti/gown1/navy-blue.jpeg",
    accent: "#0284c7"
  },
  {
    id: "Plazo",
    label: "Comfort Wear",
    title: "Plazo",
    description: "Embroidered plazo — premium fabric, free fit, long sizes 38–40.",
    icon: "👖",
    imageUrl: "/products/plazo/plazo1/img1.jpeg",
    accent: "#7c3aed"
  }
];

