import React from "react";

// Props設計: 既存コードの良さ(size対応)を取り入れ、interfaceではなくtypeで定義
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger"; // dangerを追加
  size?: "sm" | "md" | "lg"; // sizeを追加
};

export const Button = ({ 
  variant = "primary", 
  size = "md",
  className = "", 
  children, 
  ...props 
}: ButtonProps) => {
  
  // Base Styles: 共通部分
  const baseStyles = "inline-flex items-center justify-center rounded font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  // Variants: 色の定義
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };

  // Sizes: 大きさの定義
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  return (
    <button 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};