import LogoGallery from "@/components/logo-gallery";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: userData, error: userError } = await supabase.auth.getUser();

  if (userError || !userData?.user?.id) {
    redirect("/");
  }

  const { data, error } = await supabase
    .from("logo_history")
    .select("*")
    .eq("user_id", userData.user.id);

  if (error) {
    console.error("Error fetching logo history:", error);
    return [];
  }

  const logos = await Promise.all(
    data.map(async (logo) => {
      const { data: signedUrlData, error: signedUrlError } =
        await supabase.storage
          .from("logos")
          .createSignedUrl(logo.url.split("/").pop(), 60, {
            download: true,
            transform: {
              quality: 75,
            },
          });

      if (signedUrlError) {
        console.error("Error generating signed URL:", signedUrlError);
        return { ...logo, public_url: null };
      }

      return { ...logo, public_url: signedUrlData?.signedUrl };
    }),
  );

  return <LogoGallery logos={logos} />;
}
