import type { StaticImageData } from "next/image";

import cover1 from "../../public/product1.png";
import cover2 from "../../public/product2.png";
import cover3 from "../../public/product3.png";
import cover4 from "../../public/product4.png";
import cover5 from "../../public/product5.png";
import cover6 from "../../public/product6.png";
import cover7 from "../../public/product7.png";
import cover8 from "../../public/product8.png";
import cover9 from "../../public/product9.png";

export type MagazineCard = {
  id: number;
  title: string;
  description: string;
  image: StaticImageData;
};

export const magazines: MagazineCard[] = [
  {
    id: 1,
    title: "Quiet Contrast Living",
    description:
      "Warm-toned vintage seating balances bold color and classic cabinetry.",
    image: cover1,
  },
  {
    id: 2,
    title: "Timeless Salon Arrangement",
    description:
      "Timeless Salon Arrangement Classic European silhouettes create a refined yet welcoming living space.",
    image: cover2,
  },
  {
    id: 3,
    title: "Layered Vintage Comfort",
    description:
      "Soft textures and mid-century forms bring warmth into a modern interior.",
    image: cover3,
  },
  {
    id: 4,
    title: "Heritage Meets Modern",
    description:
      "Traditional furniture pieces add depth to contemporary architectural details.",
    image: cover4,
  },
  {
    id: 5,
    title: "Collected Corners",
    description:
      "Vintage storage and analog objects create a calm, lived-in atmosphere.",
    image: cover5,
  },
  {
    id: 6,
    title: "Classic Domestic Scene",
    description:
      "Antique cabinetry and decorative accents evoke a sense of everyday nostalgia.",
    image: cover6,
  },
  {
    id: 7,
    title: "Mid-Century Revival",
    description:
      "Wooden furniture and geometric elements redefine retro living.",
    image: cover7,
  },
  {
    id: 8,
    title: "Warm Minimal Vintage",
    description:
      "Balanced composition highlights the harmony between nature and furniture.",
    image: cover8,
  },
  {
    id: 9,
    title: "Editorial Vintage Space",
    description:
      "Curated pieces transform the interior into a quiet design narrative.",
    image: cover9,
  },
];
