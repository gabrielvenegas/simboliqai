"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export default function SuccessPurchase() {
  const searchParams = useSearchParams();
  const successPurchase = searchParams.get("success-purchase") === "true";

  useEffect(() => {
    if (successPurchase) {
      const timerId = setTimeout(() => {
        toast.success("Thank you for your purchase!", {
          className: "bg-green-500 text-white p-4 rounded-md",
        });
      });

      const url = new URL(window.location.href);
      url.searchParams.delete("success-purchase");
      window.history.replaceState({}, "", url.toString());

      return () => {
        clearTimeout(timerId);
      };
    }
  }, [successPurchase]);

  return null;
}
