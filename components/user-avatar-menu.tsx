"use client";

import React from "react";
import { LogOut, CreditCard, Image, MailIcon } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface UserAvatarMenuProps {
  user?: Partial<SupabaseUser> | null;
  onLogout: () => void;
  onAuth: () => void;
}

export default function UserAvatarMenu({
  user = { email: "" },
  onLogout,
  onAuth,
}: UserAvatarMenuProps) {
  const getInitials = (email: string) => {
    if (!email) return "";
    return email
      .split("@")[0]
      .split(".")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (!user)
    return (
      <Button onClick={onAuth} variant="default" size="sm">
        Sign In / Register
      </Button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-white"
        >
          <Avatar className="h-10 w-10 border border-gray-200">
            <AvatarFallback className="bg-gradient-to-r from-primary to-secondary text-white text-xs">
              {getInitials(user?.email!)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 rounded-lg bg-white shadow-sm border-gray-200 z-50"
        align="end"
        sideOffset={5}
      >
        <div className="p-4 border-b space-y-1 border-gray-100">
          <div className="flex flex-row items-center text-xs text-gray-500 truncate">
            <MailIcon className="mr-2 h-4 w-4 text-gray-500" />
            {user?.email}
          </div>
        </div>

        <DropdownMenuItem className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
          <Image className="mr-3 h-4 w-4 text-gray-500" />
          Your Logos
        </DropdownMenuItem>
        <DropdownMenuItem className="flex items-center px-4 py-2 text-sm hover:bg-gray-50">
          <CreditCard className="mr-3 h-4 w-4 text-gray-500" />
          Billing
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-gray-100 h-px" />
        <DropdownMenuItem
          onSelect={onLogout}
          className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
