import type { StaticImageData } from "next/image";

export type Product = {
  id: number;
  name: string;
  price: string;
  origin: string;
  era: string;
  image: StaticImageData;
};

import product1 from "../../public/product1.png";
import product2 from "../../public/product2.png";
import product3 from "../../public/product3.png";
import product4 from "../../public/product4.png";
import product5 from "../../public/product5.png";
import product6 from "../../public/product6.png";
import product7 from "../../public/product7.png";
import product8 from "../../public/product8.png";
import product9 from "../../public/product9.png";

export const products: Product[] = [
  {
    id: 1,
    name: "Copenhagen Lounge Chair",
    price: "950,000원",
    origin: "Copenhagen, Denmark",
    era: "1960s",
    image: product1,
  },
  {
    id: 2,
    name: "Baroque Accent Chair",
    price: "1,850,000원",
    origin: "Milan, Italy",
    era: "1940s",
    image: product2,
  },
  {
    id: 3,
    name: "Green Heritage Chair",
    price: "1,200,000원",
    origin: "Vienna, Austria",
    era: "Early 20th Century",
    image: product3,
  },
  {
    id: 4,
    name: "Nordic Reclining Lounge Chair",
    price: "2,600,000원",
    origin: "Aarhus, Denmark",
    era: "1960s",
    image: product4,
  },
  {
    id: 5,
    name: "Provincial Display Cabinet",
    price: "4,200,000원",
    origin: "Provence, France",
    era: "1930s",
    image: product5,
  },
  {
    id: 6,
    name: "Blue Velvet Salon Chair",
    price: "2,100,000원",
    origin: "Paris, France",
    era: "1950s",
    image: product6,
  },
  {
    id: 7,
    name: "Victorian Leather Lounge Chair",
    price: "2,800,000원",
    origin: "Manchester, England",
    era: "Late 19th Century",
    image: product7,
  },
  {
    id: 8,
    name: "Florence Pattern Armchair",
    price: "1,450,000원",
    origin: "Florence, Italy",
    era: "1970s",
    image: product8,
  },
  {
    id: 9,
    name: "Louis Tufted Loveseat",
    price: "3,200,000원",
    origin: "Lyon, France",
    era: "1920s",
    image: product9,
  },
];
