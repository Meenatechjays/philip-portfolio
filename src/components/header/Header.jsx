'use client';

import MobileNavigation from './MobileNavigation';

export default function Header() {
  return (
    <header className="relative w-full px-6 md:px-12 py-6">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Desktop Navigation - can be added later if needed */}
        {/* Mobile Navigation - hamburger menu for ≤1024px */}
        <MobileNavigation />
      </div>
    </header>
  );
}

