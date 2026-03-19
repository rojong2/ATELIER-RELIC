import { supabase } from "@/lib/supabase";
import type { CartItem } from "@/store/cartStore";

export type CreateOrderInput = {
  userId: string | null;
  ordererName: string;
  ordererPhone: string;
  ordererEmail: string;
  recipientName: string;
  recipientPhone: string;
  postcode: string;
  address: string;
  detailAddress: string;
  deliveryMemo: string;
  paymentMethod: string;
  items: CartItem[];
  totalProductPrice: number;
  deliveryFee: number;
  totalPrice: number;
};

export async function createOrder(input: CreateOrderInput) {
  const {
    userId,
    ordererName,
    ordererPhone,
    ordererEmail,
    recipientName,
    recipientPhone,
    postcode,
    address,
    detailAddress,
    deliveryMemo,
    items,
    totalProductPrice,
    deliveryFee,
    totalPrice,
  } = input;

  const { data: orderData, error: orderError } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      orderer_name: ordererName,
      orderer_phone: ordererPhone,
      orderer_email: ordererEmail,
      recipient_name: recipientName,
      recipient_phone: recipientPhone,
      postcode: postcode,
      address: address,
      detail_address: detailAddress,
      delivery_method: "delivery",
      payment_method: "prepaid",
      delivery_memo: deliveryMemo || null,
      total_product_price: totalProductPrice,
      delivery_fee: deliveryFee,
      total_price: totalPrice,
    })
    .select()
    .single();

  if (orderError) {
    console.error("Order creation error:", orderError);
    throw new Error("주문 생성에 실패했습니다.");
  }

  const orderItems = items.map((item) => ({
    order_id: orderData.id,
    product_id: item.id,
    product_name: item.name,
    product_price: item.price,
    quantity: item.qty,
    subtotal: item.price * item.qty,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) {
    console.error("Order items creation error:", itemsError);
    throw new Error("주문 상품 저장에 실패했습니다.");
  }

  return {
    orderId: orderData.id,
    orderNumber: orderData.order_number,
  };
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error fetching user:", error);
    return null;
  }

  return data;
}

export async function getDefaultAddress(userId: string) {
  const { data } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .eq("is_default", true)
    .maybeSingle();

  if (data) return data;

  const { data: firstAddress } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return firstAddress ?? null;
}
