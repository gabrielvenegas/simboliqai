import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const { error } = await supabase.auth.getUser();
  if (error) {
    redirect("/");
  }

  return <div className="min-h-screen w-full">{children}</div>;
}
