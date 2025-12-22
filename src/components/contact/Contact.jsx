'use client';

import Image from 'next/image';
import { useState } from 'react';

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
      className="relative w-full pt-20 md:pt-24 lg:pt-28 pb-16 px-6 md:px-12 lg:px-24"
      style={{
        background: 'linear-gradient(180deg, #89BBDD 0%, #FFFFFF 100%)',
      }}
    >
      <div className="mx-auto w-full px-2 md:px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">

          {/* LEFT – CONTACT FORM */}
          <div className="flex flex-col gap-4">
            <h2 className="text-[3rem] font-bold text-[#112643] leading-none">
              Get In Touch
            </h2>

            <p className="text-sm text-[#4a4a4a] max-w-md">
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
                className={`btn-sheen text-white text-sm px-6 py-2.5 rounded-lg w-fit transition-colors ${
                  isSubmitting ? 'cursor-not-allowed' : 'hover:brightness-110'
                }`}
                style={buttonStyle}
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

              {/* SOCIAL ICONS - positioned on the curve */}
              {(() => {
                const icons = [
                  {
                    href: 'https://twitter.com',
                    src: '/twitter.svg',
                    alt: 'X',
                    angle: 222,
                  },
                  {
                    href: 'https://linkedin.com',
                    src: '/linkedin.svg',
                    alt: 'LinkedIn',
                    angle: 185,
                  },
                  {
                    href: 'https://instagram.com',
                    src: '/instagram.svg',
                    alt: 'Instagram',
                    angle: 143,
                  },
                ];

                const centerX = 260;
                const centerY = 260;
                const radius = 255;
                const size = 64;

                const getPosition = (deg) => {
                  const rad = (deg * Math.PI) / 180;
                  const x = centerX + radius * Math.cos(rad) - size / 2;
                  const y = centerY + radius * Math.sin(rad) - size / 2;
                  return { left: `${x}px`, top: `${y}px` };
                };

                return (
                  <div className="absolute top-1/2 -translate-y-1/2 -left-[140px] w-[520px] h-[520px] z-10">
                    {icons.map((icon) => {
                      const position = getPosition(icon.angle);
                      return (
                        <a
                          key={icon.alt}
                          href={icon.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="absolute hover:scale-110 transition-transform duration-200"
                          style={position}
                        >
                          <Image src={icon.src} alt={icon.alt} width={size} height={size} />
                        </a>
                      );
                    })}
                  </div>
                );
              })()}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
