'use client';

import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [errors, setErrors] = useState({ email: '' });
  const [touched, setTouched] = useState({ email: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const [submitMessage, setSubmitMessage] = useState('');
  const [iconPositions, setIconPositions] = useState([]);
  const animationFrameRef = useRef(null);

  const validateEmail = (email) => {
    if (email && !email.includes('@')) {
      return 'Email must contain @ symbol';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'email' && errors.email) {
      setErrors((prev) => ({ ...prev, email: '' }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      setTouched({ email: true });
      setErrors({ email: validateEmail(value) });
    }
  };

  // Smooth continuous loop animation for icons
  useEffect(() => {
    const icons = [
      {
        href: 'https://twitter.com',
        src: '/twitter.svg',
        alt: 'X',
      },
      {
        href: 'https://linkedin.com',
        src: '/linkedin.svg',
        alt: 'LinkedIn',
      },
      {
        href: 'https://instagram.com',
        src: '/instagram.svg',
        alt: 'Instagram',
      },
    ];

    // Arc configuration
    const startAngle = 222; // Top-right (in degrees)
    const endAngle = 143;   // Bottom-left
    const totalArcDegrees = startAngle - endAngle; // 79 degrees visible arc
    
    // Spacing between icons along the arc (based on original spacing)
    // Original icons were at 222°, 185°, 143° = 37° and 42° spacing
    // Average spacing ~39.5°, using 40° for consistent spacing
    const iconSpacing = 40; // degrees between icons
    
    // Animation settings
    // Calculate speed for 5 second duration: 79 degrees arc in 5000ms
    // At 60fps: speed = (arcDegrees * 16.67) / duration = (79 * 16.67) / 5000 ≈ 0.263
    const speed = 0.263; // degrees per frame for 5 second completion
    const startTime = Date.now();
    
    // Calculate constants for position calculation
    const centerX = 260;
    const centerY = 260;
    const radius = 255;
    const size = 64;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      // Continuous offset - never resets, just keeps increasing
      // Normalize to ~60fps for consistent speed
      const offset = (elapsed * speed) / 16.67;
      
      // Create continuous stream of icons
      const visibleIcons = [];
      
      // Calculate how many full cycles of icons we need to show
      // to ensure continuous coverage of the visible arc plus buffer
      const cycleLength = icons.length * iconSpacing; // One complete cycle = 3 icons * 40° = 120°
      const cyclesNeeded = Math.ceil((totalArcDegrees + iconSpacing * 3) / cycleLength) + 1;
      
      // Calculate the current cycle offset within the cycle length
      const currentCycleOffset = offset % cycleLength;
      
      // Generate multiple cycles of icons
      for (let cycle = -1; cycle <= cyclesNeeded; cycle++) {
        icons.forEach((icon, idx) => {
          // Calculate angle for this icon in this cycle
          const iconOffset = (cycle * cycleLength) + (idx * iconSpacing);
          const angle = startAngle - currentCycleOffset - iconOffset;
          
          // Only render icons within the visible arc range (plus extra 40° buffer for full arc completion)
          const extraBuffer = 40; // Extra 40 degrees before hiding and after appearing
          const buffer = iconSpacing * 1.5 + extraBuffer; // Combined buffer for fade in/out
          if (angle >= endAngle - buffer && angle <= startAngle + buffer) {
            // Convert angle to radians for position calculation
            const rad = (angle * Math.PI) / 180;
            const x = centerX + radius * Math.cos(rad) - size / 2;
            const y = centerY + radius * Math.sin(rad) - size / 2;
            
            // Calculate opacity based on position (fade at edges for smoothness)
            // Icons stay fully visible through the entire arc, then fade after extra 40°
            let opacity = 1;
            const fadeRange = 15; // degrees for fade effect
            // Icons appear 40° before startAngle (at 222° + 40 = 262°)
            const fadeStartTop = startAngle + extraBuffer - fadeRange;
            // Icons disappear 40° after endAngle (at 143° - 40 = 103°)
            const fadeStartBottom = endAngle - extraBuffer + fadeRange;
            
            if (angle > fadeStartTop) {
              // Fade in from top (icons appearing)
              opacity = Math.max(0, (startAngle + extraBuffer - angle) / fadeRange);
            } else if (angle < fadeStartBottom) {
              // Fade out at bottom (icons disappearing after completing full arc)
              opacity = Math.max(0, (angle - (endAngle - extraBuffer)) / fadeRange);
            } else {
              // Fully visible through the entire arc
              opacity = 1;
            }
            
            visibleIcons.push({
              ...icon,
              x,
              y,
              opacity: Math.max(0, Math.min(1, opacity)),
              key: `${icon.alt}-${cycle}-${idx}`,
            });
          }
        });
      }
      
      setIconPositions(visibleIcons);
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []); // Empty dependency array - only run once on mount

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors({ email: emailError });
      setTouched({ email: true });
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: '13458513-e2b5-40d3-b075-ebaf25b3552f',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: 'New Contact Form Submission - Philip Portfolio',
          from_name: 'Philip Portfolio Website',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your message has been sent successfully.');
        setFormData({ name: '', email: '', message: '' });
        setTouched({ email: false });
      } else {
        throw new Error();
      }
    } catch {
      setSubmitStatus('error');
      setSubmitMessage('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="relative w-full flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #89BBDD 0%, #FFFFFF 100%)',
      }}
    >
      <div className="mx-auto w-full px-2 md:px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">

          {/* LEFT – CONTACT FORM */}
          <div className="flex flex-col gap-4">
            <h2 className="section-heading leading-none">
              Get In Touch
            </h2>

            <p className="section-body max-w-md">
              Connect for business opportunities, partnerships, or thought leadership discussions
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-md">
              <div className="grid grid-cols-2 gap-3">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Name"
                  className="px-4 py-2 text-sm rounded-lg bg-white outline-none text-[#454654] font-satoshi font-weight-400"
                />

                <div>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Email"
                    className={`px-4 py-2 text-sm rounded-lg bg-white outline-none w-full text-[#454654] ${
                      errors.email ? 'border border-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <textarea
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Message"
                className="px-4 py-2 text-sm rounded-lg bg-white resize-none outline-none text-[#454654]"
              />

              {submitStatus && (
                <p
                  className={`text-sm ${
                    submitStatus === 'success'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {submitMessage}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
                className={`btn-sheen contact-button text-white text-sm px-6 py-2.5 rounded-lg w-fit transition-colors ${
                  isSubmitting ? 'is-disabled' : 'hover:brightness-110'
                }`}
              >
                {isSubmitting ? 'Sending…' : 'Send form'}
              </button>
            </form>
          </div>

          {/* RIGHT – IMAGE + SVG CURVE */}
          <div className="relative flex justify-end items-center">
            <div className="relative w-full max-w-[420px]">

              {/* Person Image - using regular img positioning */}
              <div className="relative w-full">
                <Image
                  src="/Phil contact fr.png"
                  alt="Philip"
                  width={420}
                  height={560}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>

              {/* SVG CURVED LINE - positioned to create arc on left side */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-[140px] w-[520px] h-[520px] pointer-events-none z-0">
                <svg width="520" height="520" viewBox="0 0 520 520" fill="none">
                  <defs>
                    <linearGradient
                      id="contactArcGradient"
                      x1="260"
                      y1="0"
                      x2="260"
                      y2="520"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#999999" stopOpacity="0.95" />
                      <animateTransform
                        attributeName="gradientTransform"
                        attributeType="XML"
                        type="translate"
                        from="0 -260"
                        to="0 260"
                        dur="6s"
                        repeatCount="indefinite"
                      />
                    </linearGradient>
                  </defs>
                  <path
                    d="M260 5 A255 255 0 0 0 260 515"
                    stroke="url(#contactArcGradient)"
                    strokeWidth="2.5"
                    fill="none"
                  />
                </svg>
              </div>

              {/* SOCIAL ICONS - Continuous loop animation */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-[140px] w-[520px] h-[520px] z-10">
                {iconPositions.map((icon) => (
                  <a
                    key={icon.key}
                    href={icon.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute hover:scale-110 transition-transform duration-200"
                    style={{
                      left: `${icon.x}px`,
                      top: `${icon.y}px`,
                      opacity: icon.opacity,
                    }}
                  >
                    <Image src={icon.src} alt={icon.alt} width={64} height={64} />
                  </a>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
      <style jsx>{`
        .contact-button {
          position: relative;
          overflow: hidden;
          border: 1px solid;
          border-image: linear-gradient(180deg, #ffffff 0%, #999999 100%) 1;
          background: linear-gradient(180deg, #132f56 0%, #0b1c33 100%);
          box-shadow: 0 12px 24px rgba(17, 38, 67, 0.22);
          transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
        }

        .contact-button:hover:not(.is-disabled) {
          transform: translateY(-1px);
          filter: brightness(1.06);
          box-shadow: 0 14px 30px rgba(17, 38, 67, 0.28);
        }

        .contact-button.is-disabled {
          background: #9ca3af;
          color: #e5e7eb;
          box-shadow: none;
          border-image: none;
          border-color: #d1d5db;
          cursor: not-allowed;
        }

        .contact-button.is-disabled::after {
          animation-play-state: paused;
          opacity: 0.2;
        }

        @keyframes sheen {
          0% {
            transform: translateX(-150%) rotate(20deg);
          }
          100% {
            transform: translateX(150%) rotate(20deg);
          }
        }

        .btn-sheen {
          position: relative;
          overflow: hidden;
        }

        .btn-sheen::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            120deg,
            transparent 0%,
            rgba(255, 255, 255, 0.18) 45%,
            rgba(255, 255, 255, 0.35) 50%,
            rgba(255, 255, 255, 0.18) 55%,
            transparent 70%
          );
          transform: translateX(-150%) rotate(20deg);
          animation: sheen 2.2s linear infinite;
          pointer-events: none;
        }
      `}</style>
    </section>
  );
}
