"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { HistoryIcon, Image, LogOut, MailIcon } from "lucide-react";
import Link from "next/link";

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
      <Button
        onClick={onAuth}
        variant="default"
        size="sm"
        className="w-full sm:w-auto"
      >
        Entrar / Cadastrar
      </Button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="h-12 w-12 border">
          <AvatarFallback>{getInitials(user?.email!)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 rounded-lg z-50"
        align="end"
        sideOffset={5}
      >
        <div className="p-4 border-b space-y-1">
          <div className="flex flex-row items-center text-xs truncate">
            <MailIcon className="mr-2 h-4 w-4" />
            {user?.email}
          </div>
        </div>

        <DropdownMenuItem
          className="flex items-center px-4 py-2 text-sm"
          asChild
        >
          <Link href="/gallery">
            <Image className="mr-3 h-4 w-4" />
            Galeria
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center px-4 py-2 text-sm"
          asChild
        >
          <Link href="/transaction-history">
            <HistoryIcon className="mr-3 h-4 w-4" />
            Histórico de Transações
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center px-4 py-2 text-sm"
          asChild
        >
          <a href="mailto:support@simboliqai.com?subject=Solicita%C3%A7%C3%A3o%20de%20Suporte&body=Descreva%20seu%20problema%20aqui">
            <MailIcon className="mr-3 h-4 w-4" />
            Suporte
          </a>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 h-px" />
        <DropdownMenuItem
          onSelect={onLogout}
          className="flex items-center px-4 py-2 text-sm text-red-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="mr-3 h-4 w-4 text-red-600" />
          Sair
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
