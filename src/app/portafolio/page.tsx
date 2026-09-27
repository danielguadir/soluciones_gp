"use client";

import React from "react";
import { PortfolioHeader } from "@/design-system/components/portfolio/PortfolioHeader";
import { PortfolioCarousel } from "@/design-system/components/portfolio/PortfolioCarousel";
import { PortfolioCTA } from "@/design-system/components/portfolio/PortfolioCTA";

export default function PortfolioPage() {
    return (
        <div className="bg-[#0f172a] min-h-screen text-slate-300">
            {/* Header Section */}
            <PortfolioHeader />

            {/* Main Content: Automatic 3s Carousel */}
            <PortfolioCarousel />

            {/* Final CTA Section */}
            <PortfolioCTA />
        </div>
    );
}
