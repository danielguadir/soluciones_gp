"use client";

import React from "react";
import { PortfolioHeader } from "@/components/portfolio/PortfolioHeader";
import { PortfolioGrid } from "@/components/portfolio/PortfolioGrid";
import { PortfolioCTA } from "@/components/portfolio/PortfolioCTA";

/**
 * Portfolio Page
 * Refactored to follow SOLID principles (Single Responsibility)
 * and high scalability.
 * 
 * - UI components: /src/components/Portfolio
 * - Portfolio Data: /src/data/portfolio.ts
 */
export default function PortfolioPage() {
    return (
        <div className="bg-[#0f172a] min-h-screen text-slate-300">
            {/* Header Section */}
            <PortfolioHeader />

            {/* Main Content: Projects Grid */}
            <PortfolioGrid />

            {/* Final CTA Section */}
            <PortfolioCTA />
        </div>
    );
}
