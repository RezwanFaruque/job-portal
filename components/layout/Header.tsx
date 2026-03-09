import Link from "next/link";
import { APP_NAME } from "@/constants";
import Navbar from "../features/Navbar";

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
        <Navbar />
    </header>
  );
}
