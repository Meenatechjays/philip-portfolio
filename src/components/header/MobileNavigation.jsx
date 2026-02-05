'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'about', label: 'ABOUT', number: '01' },
  { id: 'timeline', label: 'TIMELINE', number: '02' },
  { id: 'around-the-world', label: 'AROUND THE WORLD', number: '03' },
  { id: 'highlights', label: 'HIGHLIGHTS', number: '04' },
  { id: 'investors', label: 'INVESTORS', number: '05' },
  { id: 'contact', label: 'CONTACT', number: '06' },
];

const SOCIAL_LINKS = [
  { href: 'https://linkedin.com', src: '/linkedin.svg', alt: 'LinkedIn' },
  { href: 'https://twitter.com', src: '/twitter.svg', alt: 'X' },
  { href: 'https://instagram.com', src: '/instagram.svg', alt: 'Instagram' },
];

export default function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');
  const menuRef = useRef(null);
  const backdropRef = useRef(null);

  // Detect active section based on scroll position (works with scroll-snap)
  useEffect(() => {
    if (isOpen) return; // Don't update active section when menu is open

    const handleScroll = () => {
      const sections = NAV_ITEMS.map(item => {
        const element = document.getElementById(item.id);
        return element ? { id: item.id, element } : null;
      }).filter(Boolean);

      // Find the section that's most visible in the viewport
      let maxVisibility = 0;
      let activeId = sections[0]?.id || 'about';

      sections.forEach(({ id, element }) => {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        // Calculate how much of the section is visible
        const visibleTop = Math.max(0, -rect.top);
        const visibleBottom = Math.min(rect.height, viewportHeight - rect.top);
        const visibleHeight = Math.max(0, visibleBottom - visibleTop);
        const visibility = visibleHeight / Math.min(rect.height, viewportHeight);
        
        // Section is considered active if more than 50% is visible
        if (visibility > maxVisibility && visibility > 0.5) {
          maxVisibility = visibility;
          activeId = id;
        }
      });

      setActiveSection(activeId);
    };

    // Use both scroll and IntersectionObserver for better accuracy
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check

    // Also use IntersectionObserver for more accurate detection
    const observers = NAV_ITEMS.map(item => {
      const element = document.getElementById(item.id);
      if (!element) return null;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
              setActiveSection(item.id);
            }
          });
        },
        { threshold: 0.5 }
      );

      observer.observe(element);
      return observer;
    }).filter(Boolean);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observers.forEach(observer => observer.disconnect());
    };
  }, [isOpen]);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('menu-open');
      document.documentElement.classList.add('menu-open');
    } else {
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
    }

    return () => {
      document.body.classList.remove('menu-open');
      document.documentElement.classList.remove('menu-open');
    };
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen]);

  // Handle click outside menu (on backdrop)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        isOpen &&
        backdropRef.current &&
        backdropRef.current === e.target &&
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      // Close menu first
      setIsOpen(false);
      
      // Small delay to ensure menu closes before scrolling
      setTimeout(() => {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger Button - Visible on mobile/tablet (≤1024px) */}
      <button
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label="Toggle navigation menu"
        className="lg:hidden fixed top-6 right-6 z-50 p-2 text-[#1F2024] hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-[#1F2024] focus:ring-offset-2 rounded-md bg-white/80 backdrop-blur-sm"
      >
        <Menu size={28} strokeWidth={2} />
      </button>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              ref={backdropRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed inset-0 bg-[#112643] z-40 lg:hidden"
            />

            {/* Menu Content */}
            <motion.nav
              ref={menuRef}
              id="mobile-menu"
              role="navigation"
              aria-label="Main navigation"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed inset-0 z-50 lg:hidden overflow-y-auto bg-[#112643]"
            >
              <div className="flex flex-col h-full px-6 md:px-12 py-8">
                {/* Close Button */}
                <div className="flex justify-end mb-8">
                  <button
                    onClick={toggleMenu}
                    aria-label="Close navigation menu"
                    className="p-2 text-white hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#112643] rounded-md"
                  >
                    <X size={28} strokeWidth={2} />
                  </button>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 flex flex-col justify-center gap-6 md:gap-8">
                  {NAV_ITEMS.map((item) => {
                    const isActive = activeSection === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => scrollToSection(item.id)}
                        className={`
                          text-left font-satoshi font-semibold text-2xl md:text-3xl lg:text-4xl
                          text-white transition-all duration-300 ease-in-out
                          hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#112643] rounded-md px-2 py-3
                          touch-manipulation
                          ${isActive ? 'opacity-100' : 'opacity-90'}
                        `}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className="font-bold">{item.number}</span> {item.label}
                      </button>
                    );
                  })}
                </nav>

                {/* Footer - Name and Social Icons */}
                <div className="mt-auto pt-8 pb-6 flex flex-col gap-4">
                  {/* Name */}
                  <div className="text-white font-satoshi text-lg md:text-xl">
                    Philip Samuelraj
                  </div>

                  {/* Social Icons */}
                  <div className="flex gap-4">
                    {SOCIAL_LINKS.map((social) => (
                      <a
                        key={social.alt}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.alt}
                        className="text-white hover:opacity-80 transition-opacity focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#112643] rounded-md p-1 touch-manipulation"
                      >
                        <img
                          src={social.src}
                          alt={social.alt}
                          className="w-6 h-6 md:w-7 md:h-7"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

