import { createClient } from "@/lib/supabase/server";

export type MyProfile = {
  name: string;
  email: string;
  phone: string;
};

export type MyAddress = {
  id: number;
  name: string;
  phone: string;
  postcode: string;
  address: string;
  detailAddress: string;
  isDefault: boolean;
};

export type MyOrderItem = {
  id: number;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
};

export type MyOrder = {
  id: number;
  order_number: string;
  status: string;
  recipient_name: string;
  recipient_phone: string;
  address: string;
  detail_address: string | null;
  total_product_price: number;
  delivery_fee: number;
  total_price: number;
  ordered_at: string;
  order_items: MyOrderItem[];
};

export type MyWishlistItem = {
  id: number;
  name: string;
  price: string;
  image: string;
};

export type MyPageData = {
  profile: MyProfile;
  addresses: MyAddress[];
  orders: MyOrder[];
  wishlist: MyWishlistItem[];
};

export async function getMyPageData(
  userId: string,
  authEmail?: string,
  authName?: string
): Promise<MyPageData | null> {
  const supabase = await createClient();

  const [userRes, addressRes, ordersRes, wishlistRes] = await Promise.all([
    supabase.from("users").select("*").eq("id", userId).single(),
    supabase
      .from("addresses")
      .select("*")
      .eq("user_id", userId)
      .order("is_default", { ascending: false }),
    supabase
      .from("orders")
      .select("*, order_items (*)")
      .eq("user_id", userId)
      .order("ordered_at", { ascending: false }),
    supabase
      .from("wishlist_items")
      .select(
        `
        product_id,
        products (id, name, price, image_url)
      `
      )
      .eq("user_id", userId),
  ]);

  const profile: MyProfile = userRes.data
    ? {
        name: userRes.data.name || authName || "",
        email: userRes.data.email || authEmail || "",
        phone: userRes.data.phone || "",
      }
    : {
        name: authName || "",
        email: authEmail || "",
        phone: "",
      };

  const addresses: MyAddress[] = (addressRes.data || []).map((addr) => ({
    id: addr.id,
    name: addr.recipient_name,
    phone: addr.phone,
    postcode: addr.postcode,
    address: addr.address,
    detailAddress: addr.detail_address || "",
    isDefault: addr.is_default,
  }));

  const orders: MyOrder[] = (ordersRes.data || []) as MyOrder[];

  const wishlist: MyWishlistItem[] = (wishlistRes.data || [])
    .filter((item: { products: unknown }) => item.products)
    .map((item) => {
      const product = item.products as unknown as {
        id: number;
        name: string;
        price: number;
        image_url: string;
      };
      return {
        id: product.id,
        name: product.name,
        price: `${product.price.toLocaleString("ko-KR")}원`,
        image: product.image_url,
      };
    });

  return { profile, addresses, orders, wishlist };
}
