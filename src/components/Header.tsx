"use client";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

const Header = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="py-8 xl:py-12 bg-pink-50/20 flex flex-row border-b border-black items-center justify-between px-10">
      <div className="text-xl font-bold">Header</div>
      <div
        className={`border-2 ${
          theme === "light" ? "border-gray-800" : "border-gray-100"
        } rounded-full p-1 transition-all duration-300`}
      >
        <button
          onClick={toggleTheme}
          className="w-10 h-10 flex items-center justify-center transition-all duration-300"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
