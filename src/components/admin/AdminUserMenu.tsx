"use client";

import { UserButton, useUser } from "@clerk/nextjs";

export function AdminUserMenu() {
  const { user } = useUser();

  return (
    <div className="flex items-center gap-2.5">
      <UserButton
        appearance={{
          elements: {
            avatarBox: "h-7 w-7",
          },
        }}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium text-charcoal">
          {user?.firstName || user?.emailAddresses[0]?.emailAddress || "User"}
        </p>
        <p className="truncate text-[10px] text-stone">
          {(user?.publicMetadata?.role as string) || "admin"}
        </p>
      </div>
    </div>
  );
}
