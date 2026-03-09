import { APP_NAME } from "@/constants";

export function Footer() {
  return (
    <footer className="mt-auto py-6 border-t border-gray-200 dark:border-gray-800 text-center text-gray-500 dark:text-gray-400 text-sm">
      <p>{APP_NAME} — SCSS + Bootstrap + Tailwind CSS</p>
    </footer>
  );
}
