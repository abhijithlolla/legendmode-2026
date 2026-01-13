"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
    children: ReactNode;
    className?: string;
};

export function BentoGrid({ children, className = "" }: Props) {
    return (
        <div className={`grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto p-4 ${className}`}>
            {children}
        </div>
    );
}

export function BentoItem({
    children,
    className = "",
    colSpan = 1,
    rowSpan = 1
}: Props & { colSpan?: number; rowSpan?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className={`
        bento-card glass-surface p-6 relative group
        ${colSpan === 2 ? 'md:col-span-2' : colSpan === 3 ? 'md:col-span-3' : ''}
        ${rowSpan === 2 ? 'row-span-2' : ''}
        ${className}
      `}
        >
            {children}
        </motion.div>
    );
}
