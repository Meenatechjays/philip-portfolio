'use client';

export default function Header() {
  const handleMenuClick = () => {
    // Menu toggle functionality can be added here
    console.log('Menu clicked');
  };

  return (
    <header className="relative w-full px-6 md:px-12 py-6">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Menu Button - can be added later */}
      </div>
    </header>
  );
}

