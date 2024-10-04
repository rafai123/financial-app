"use client"

import { DatePickerDemo } from "@/components/Date-picker-test";
import { Button } from "@/components/ui/button";
import { useNewAccount } from "@/features/accounts/hooks/use-new-accounts";
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function Home() {
  const { onOpen } = useNewAccount()

  return (
    <div >
      {/* <UserButton afterSignOutUrl="/" />
      This is protected page */}
      <Button 
        onClick={onOpen}
      >
        Add an ccount
      </Button>
      <DatePickerDemo />
    </div>
  );
}
