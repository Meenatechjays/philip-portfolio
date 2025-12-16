'use client';

export default function Header() {
  const handleMenuClick = () => {
    // Menu toggle functionality can be added here
    console.log('Menu clicked');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-12 py-6">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <div className="text-2xl md:text-3xl font-bold text-gray-800">
          Phil.in
        </div>
      </div>
    </header>
  );
}

