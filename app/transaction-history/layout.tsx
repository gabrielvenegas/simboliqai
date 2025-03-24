import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function TransactionHistoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { error } = await supabase.auth.getUser();
  if (error) {
    redirect("/");
  }

  return <main className="max-w-6xl mx-auto">{children}</main>;
}
