import { redirect } from "next/navigation";

import MyPageClient from "@/features/my/components/MyPageClient";
import { getMyPageData } from "@/features/my/services/myService";
import { createClient } from "@/lib/supabase/server";

export default async function MyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const data = await getMyPageData(
    user.id,
    user.email ?? undefined,
    user.user_metadata?.name as string | undefined
  );

  if (!data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-[14px] tracking-[0.08em] text-[#9b8a72]">
          데이터를 불러올 수 없습니다.
        </div>
      </main>
    );
  }

  return (
    <MyPageClient
      userId={user.id}
      initialProfile={data.profile}
      initialAddresses={data.addresses}
      initialOrders={data.orders}
      initialWishlist={data.wishlist}
    />
  );
}
