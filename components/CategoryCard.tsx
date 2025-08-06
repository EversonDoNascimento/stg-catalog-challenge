"use client";

import { ReactNode } from "react";

type Props = {
  title: string;
  icon: ReactNode;
  onClick?: () => void;
};

const CategoryCard = ({ title, icon, onClick }: Props) => {
  return (
    <button
      onClick={onClick}
      className="w-full max-w-96 flex items-center gap-4 bg-white dark:bg-background border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-all duration-200 hover:scale-105 ease-in-out"
    >
      <div className="text-primary">{icon}</div>
      <span className="text-foreground font-medium text-lg">{title}</span>
    </button>
  );
};

export default CategoryCard;
