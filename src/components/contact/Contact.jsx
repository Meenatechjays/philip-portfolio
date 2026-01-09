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
  const sectionRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const buttonStyle = isSubmitting
    ? {
        border: '1px solid',
        borderImageSource: 'linear-gradient(180deg, #FFFFFF 0%, #999999 100%)',
        borderImageSlice: 1,
        background: '#9ca3af',
      }
    : {
        border: '1px solid',
        borderImageSource: 'linear-gradient(180deg, #FFFFFF 0%, #999999 100%)',
        borderImageSlice: 1,
        background: 'var(--Colors-Surface-Buttons-Button-normal, #112643)',
      };

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

  // One-time, on-enter quarter-arc animation for social icons
  useEffect(() => {
    const ICONS = [
      { href: 'https://twitter.com', src: '/twitter.svg', alt: 'X' },
      { href: 'https://linkedin.com', src: '/linkedin.svg', alt: 'LinkedIn' },
      { href: 'https://instagram.com', src: '/instagram.svg', alt: 'Instagram' },
    ];
    const ORBIT_CONFIG = {
      startAngleDeg: 222,        // starting angle on left side
      arcSpanDeg: 90,            // quarter circle
      spreadDeg: 60,             // how much of the arc the icons occupy (smaller = closer)
      stopAngleOffsetDeg: -15,   // move final resting position down the arc (negative = down)
      centerX: 260,
      centerY: 260,
      radius: 255,
      iconSize: 80,
      durationMs: 1400,          // animation duration per icon
      staggerMs: 120,            // slight delay between icons
      travelDeg: 30,             // how far each icon travels along the arc
    };
    const spacingDeg =
      ICONS.length > 1 ? ORBIT_CONFIG.spreadDeg / (ICONS.length - 1) : 0;

    const toRadians = (deg) => (deg * Math.PI) / 180;

    const startAnimation = () => {
      if (isAnimatingRef.current) return;
      isAnimatingRef.current = true;

      const startTime = performance.now();
      const step = (now) => {
        const elapsed = now - startTime;
        let allDone = true;

        const positions = ICONS.map((icon, idx) => {
          // progress 0->1 for each icon with stagger
          const localElapsed = Math.max(0, elapsed - idx * ORBIT_CONFIG.staggerMs);
          const t = Math.min(1, localElapsed / ORBIT_CONFIG.durationMs);
          if (t < 1) allDone = false;

          // Each icon moves from an initial offset to its final spaced position
          const baseEndDeg =
            ORBIT_CONFIG.startAngleDeg + ORBIT_CONFIG.stopAngleOffsetDeg;
          const startDeg = baseEndDeg + ORBIT_CONFIG.travelDeg;
          const endDeg = baseEndDeg - idx * spacingDeg;
          const currentAngleDeg = startDeg + (endDeg - startDeg) * t;
          const rad = toRadians(currentAngleDeg);

          const x =
            ORBIT_CONFIG.centerX +
            ORBIT_CONFIG.radius * Math.cos(rad) -
            ORBIT_CONFIG.iconSize / 2;
          const y =
            ORBIT_CONFIG.centerY +
            ORBIT_CONFIG.radius * Math.sin(rad) -
            ORBIT_CONFIG.iconSize / 2;

          return {
            ...icon,
            x,
            y,
            opacity: 1,
            key: icon.alt,
          };
        });

        setIconPositions(positions);
        if (!allDone) {
          animationFrameRef.current = requestAnimationFrame(step);
        } else {
          isAnimatingRef.current = false;
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        }
      };

      animationFrameRef.current = requestAnimationFrame(step);
    };

    // Observe visibility of the section to trigger once when it enters view
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            startAnimation();
          } else {
            // When out of view, allow re-trigger next time and stop any running frame
            isAnimatingRef.current = false;
            if (animationFrameRef.current) {
              cancelAnimationFrame(animationFrameRef.current);
            }
          }
        });
      },
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

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
      ref={sectionRef}
      className="relative w-full flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #89BBDD 0%, #FFFFFF 100%)',
      }}
    >
      <div className="mx-auto w-full px-2 md:px-4 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">

          {/* LEFT – CONTACT FORM */}
          <div className="flex flex-col gap-4">
            <h2 className="section-heading leading-none">
              Get In Touch
            </h2>

            <p className="section-body max-w-md pb-4">
              Connect for business opportunities, partnerships, or thought leadership discussions
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3 max-w-lg">
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
                className={`btn-sheen text-white text-sm px-6 py-2.5 rounded-lg w-fit transition-colors ${
                  isSubmitting ? 'cursor-not-allowed' : 'hover:brightness-110'
                }`}
                style={buttonStyle}
              >
                {isSubmitting ? 'Sending…' : 'Send form'}
              </button>
            </form>

            {/* Copyright notice */}
            <p className="text-xs text-[#454654] mt-4 font-satoshi">
              © 2025 Philip Samuelraj
            </p>
          </div>

          {/* RIGHT – IMAGE + SVG CURVE */}
          <div className="relative flex justify-end items-center right-[-60px]">
            <div className="relative w-full max-w-[460px]">

              {/* SVG CURVED LINE - positioned to create arc on left side (behind image) */}
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
                      <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.95" />
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

              {/* Person Image - using regular img positioning (above SVG line) */}
              <div className="relative w-full z-10">
                <Image
                  src="/Phil contact fr.png"
                  alt="Philip"
                  width={460}
                  height={614}
                  className="w-full h-auto object-contain relative z-10"
                  priority
                />
              </div>

              {/* SOCIAL ICONS - quarter-arc, one-time animation on enter */}
              <div className="absolute top-1/2 -translate-y-1/2 -left-[140px] w-[520px] h-[520px] z-20">
                {iconPositions.map((icon) => (
                  <a
                    key={icon.key}
                    href={icon.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute hover:scale-110 transition-transform duration-200 flex items-center justify-center"
                    style={{
                      left: `${icon.x}px`,
                      top: `${icon.y}px`,
                      width: '80px',
                      height: '80px',
                      opacity: icon.opacity,
                    }}
                  >
                    <Image src={icon.src} alt={icon.alt} width={80} height={80} className="object-contain" />
                  </a>
                ))}
              </div>

            </div>
          </div>

        </div>
      </div>
      <style jsx>{`
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
