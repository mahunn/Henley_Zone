import { Product } from "@/types/commerce";

export const seedProducts: Product[] = [
  /* ── Salwar Kameez (salwar1) — 5 colors ─────────────────── */
  {
    id: "p1",
    slug: "salwar-sequence-embroidery",
    name: "Salwar Set (Sequence Embroidery)",
    description:
      "New arrival with premium print, sequence embroidery + tassel finishing. Size: 34-48 (salwar free size). Full COD available.",
    price: 800,
    stock: 30,
    imageUrl: "/products/kurti/salwar1/yellow.jpeg",
    category: "Salwar Kameez",
    colors: [
      { id: "yellow",  label: "Yellow",  image: "/products/kurti/salwar1/yellow.jpeg"  },
      { id: "blue",    label: "Blue",    image: "/products/kurti/salwar1/blue.jpeg"    },
      { id: "olive",   label: "Olive",   image: "/products/kurti/salwar1/olive.jpeg"   },
      { id: "orange",  label: "Orange",  image: "/products/kurti/salwar1/orange.jpeg"  },
      { id: "purple",  label: "Purple",  image: "/products/kurti/salwar1/purple.jpeg"  }
    ]
  },

  /* ── Salwar Kameez (salwar2) — 3 colors ─────────────────── */
  {
    id: "p2",
    slug: "salwar-premium-cotton",
    name: "Printed Salwar Kameez",
    description:
      "Premium cotton quality with strong embroidery, color guarantee print, and white salwar. Size: 36-48.",
    price: 799,
    stock: 28,
    imageUrl: "/products/kurti/salwar2/green.jpeg",
    category: "Salwar Kameez",
    colors: [
      { id: "green",      label: "Green",      image: "/products/kurti/salwar2/green.jpeg"      },
      { id: "deep_green", label: "Deep Green", image: "/products/kurti/salwar2/deep_green.jpeg" },
      { id: "yellow",     label: "Yellow",     image: "/products/kurti/salwar2/yellow.jpeg"     }
    ]
  },

  /* ── Frogs (frog1) — 3 colors ───────────────────────────── */
  {
    id: "p3",
    slug: "embroidered-frogs",
    name: "Designer Frogs",
    description:
      "Color guarantee print with clean sequence embroidery on neck. Gher 80+, long 45, sizes 36-48.",
    price: 649,
    stock: 35,
    imageUrl: "/products/kurti/frog1/magenda.jpeg",
    category: "Frogs",
    colors: [
      { id: "magenda", label: "Magenta", image: "/products/kurti/frog1/magenda.jpeg" },
      { id: "yellow",  label: "Yellow",  image: "/products/kurti/frog1/yellow.jpeg"  },
      { id: "brown",   label: "Brown",   image: "/products/kurti/frog1/brown.jpeg"   }
    ]
  },

  /* ── Two Pieces (salwar3) — 6 colors ────────────────────── */
  {
    id: "p4",
    slug: "batik-print-two-piece",
    name: "Batik Print Two Piece",
    description:
      "রেডিমেড টু পিস। বাটিক প্রিন্ট। কালার গ্যারান্টি। বুকে,হাতে মিরর বসানো। সাইজ ৩৬-৩৮-৪০-৪২-৪৪-৪৬-৪৮।",
    price: 900,
    stock: 40,
    imageUrl: "/products/kurti/salwar3/blue.jpeg",
    category: "Two Pieces",
    colors: [
      { id: "blue",   label: "Blue",   image: "/products/kurti/salwar3/blue.jpeg"   },
      { id: "green",  label: "Green",  image: "/products/kurti/salwar3/green.jpeg"  },
      { id: "orange", label: "Orange", image: "/products/kurti/salwar3/orange.jpeg" },
      { id: "pink",   label: "Pink",   image: "/products/kurti/salwar3/pink.jpeg"   },
      { id: "purple", label: "Purple", image: "/products/kurti/salwar3/purple.jpeg" },
      { id: "yellow", label: "Yellow", image: "/products/kurti/salwar3/yellow.jpeg" }
    ]
  },

  /* ── Gown (gown1) — 6 colors ────────────────────────────── */
  {
    id: "p5",
    slug: "cotton-gown-embroidery",
    name: "Cotton Gown One Piece",
    description:
      "রেডিমেড সুতি গাউন ওয়ান পিস। এমব্রয়ডারি +গ্লাস ওয়ার্ক। ঘের ১৪০+ ইঞ্চি। রঙ উঠবে না ধোয়ার পরে। বডি সাইজ ৩৬-৪৮।",
    price: 750,
    stock: 45,
    imageUrl: "/products/kurti/gown1/navy-blue.jpeg",
    category: "Gown",
    colors: [
      { id: "brown",       label: "Brown",       image: "/products/kurti/gown1/brown.jpeg"       },
      { id: "light-blue",  label: "Light Blue",  image: "/products/kurti/gown1/light-blue.jpeg"  },
      { id: "lime-green",  label: "Lime Green",  image: "/products/kurti/gown1/lime-green.jpeg"  },
      { id: "navy-blue",   label: "Navy Blue",   image: "/products/kurti/gown1/navy-blue.jpeg"   },
      { id: "olive-green", label: "Olive Green", image: "/products/kurti/gown1/olive-green.jpeg" },
      { id: "orange",      label: "Orange",      image: "/products/kurti/gown1/orange.jpeg"      }
    ]
  }
];
