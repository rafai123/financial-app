import Link from "next/link";
import { Button } from "./ui/button";
import { FC } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type NavButtonProps = {
  href: string;
  label: string;
};

const NavButton = ({ href, label }: NavButtonProps) => {
  const pathName = usePathname();

  console.log(pathName);

  return (
    <>
      <Button
        asChild
        variant="outline"
        size="sm"
        className={cn(
          "w-full lg:w-auto justify-between font-normal hover:bg-white/20 hover:text-white border-none focus-visible:ring-offset-0 focus-visible:ring-transparent outline-none text-white focus:bg-white/30 transition ",
          pathName === href ? "bg-white/10 text-white" : "bg-transparent text-white"
        )}
      >
        <Link href={href}>{label}</Link>
      </Button>
    </>
  );
};

export default NavButton;
