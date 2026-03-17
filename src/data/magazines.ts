import type { StaticImageData } from "next/image";

import cover1 from "../../public/product1.png";
import cover2 from "../../public/product2.png";
import cover3 from "../../public/product3.png";
import cover4 from "../../public/product4.png";
import cover5 from "../../public/product5.png";
import cover6 from "../../public/product6.png";

export type MagazineCard = {
  id: number;
  title: string;
  description: string;
  image: StaticImageData;
};

export const magazines: MagazineCard[] = [
  {
    id: 1,
    title: "Layered Vintage Comfort",
    description:
      "Soft textures and mid-century forms bring warmth into a modern interior.",
    image: cover1,
  },
  {
    id: 2,
    title: "Mid-Century Revival",
    description:
      "Wooden furniture and geometric elements redefine retro living.",
    image: cover2,
  },
  {
    id: 3,
    title: "Warm Minimal Vintage",
    description:
      "Balanced composition highlights the harmony between nature and furniture.",
    image: cover3,
  },
  {
    id: 4,
    title: "Editorial Vintage Space",
    description:
      "Curated pieces transform the interior into a quiet design narrative.",
    image: cover4,
  },
  {
    id: 5,
    title: "Quiet Contrast Living",
    description:
      "Warm-toned vintage seating balances bold color and classic cabinetry.",
    image: cover5,
  },
  {
    id: 6,
    title: "Timeless Salon Arrangement",
    description:
      "Classic European silhouettes create a refined yet welcoming living space.",
    image: cover6,
  },
];

