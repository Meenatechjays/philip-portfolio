'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const [errors, setErrors] = useState({
    email: ''
  });

  const [touched, setTouched] = useState({
    email: false
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' or 'error'
  const [submitMessage, setSubmitMessage] = useState('');

  const validateEmail = (email) => {
    if (email && !email.includes('@')) {
      return 'Email must contain @ symbol';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing again after blur
    if (name === 'email' && errors.email) {
      setErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    
    if (name === 'email') {
      setTouched(prev => ({
        ...prev,
        email: true
      }));
      setErrors(prev => ({
        ...prev,
        email: validateEmail(value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate email before submission
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setErrors(prev => ({
        ...prev,
        email: emailError
      }));
      setTouched(prev => ({
        ...prev,
        email: true
      }));
      return;
    }

    // Validate all fields are filled
    if (!formData.name || !formData.email || !formData.message) {
      setSubmitStatus('error');
      setSubmitMessage('Please fill in all fields');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      // Using Web3Forms API - Send to both email addresses
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: '13458513-e2b5-40d3-b075-ebaf25b3552f',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          subject: 'New Contact Form Submission - Philip Portfolio',
          from_name: 'Philip Portfolio Website',
          cc: 'meena.sivakumar@techjays.com', // Send copy to second email
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setSubmitMessage('Thank you! Your message has been sent successfully.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
        setTouched({ email: false });
      } else {
        setSubmitStatus('error');
        setSubmitMessage('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setSubmitMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      className="relative w-full min-h-screen py-20 px-6 md:px-12 lg:px-24"
      style={{
        background: 'linear-gradient(180deg, #89BBDD 0%, #FFFFFF 100%)'
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          {/* Left Section - Contact Form */}
          <div className="flex flex-col gap-6 lg:gap-8">
            {/* Title */}
            <h2 
              className="font-satoshi"
              style={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 700,
                fontStyle: 'normal',
                fontSize: '3rem',
                lineHeight: '100%',
                letterSpacing: '0%',
                color: '#112643'
              }}
            >
              Get In Touch
            </h2>
            
            {/* Subtitle */}
            <p className="text-base md:text-lg text-[#4a4a4a] leading-relaxed max-w-lg">
              Connect for business opportunities, partnerships, or thought leadership discussions
            </p>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 mt-4">
              {/* Name and Email - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#89BBDD] focus:border-transparent text-[#1a1a1a] placeholder-gray-400"
                    placeholder=" name"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 rounded-lg bg-white border ${
                      errors.email 
                        ? 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-red-500' 
                        : 'border-gray-200 focus:ring-2 focus:ring-[#89BBDD] focus:border-transparent'
                    } focus:outline-none text-[#1a1a1a] placeholder-gray-400`}
                    placeholder="email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                  )}
                </div>
              </div>

              {/* Message Field */}
              <div>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#89BBDD] focus:border-transparent text-[#1a1a1a] placeholder-gray-400 resize-none"
                  placeholder="message"
                />
              </div>

              {/* Status Message */}
              {submitStatus && (
                <div 
                  className={`p-4 rounded-lg ${
                    submitStatus === 'success' 
                      ? 'bg-green-50 border border-green-200' 
                      : 'bg-red-50 border border-red-200'
                  }`}
                >
                  <p className={`text-sm ${
                    submitStatus === 'success' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {submitMessage}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#89BBDD] focus:ring-offset-2 ${
                  isSubmitting 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-[#0d3a5c] hover:bg-[#0a2d47] text-white'
                }`}
                style={{ width: 'fit-content' }}
              >
                {isSubmitting ? 'Sending...' : 'Send form'}
              </button>
            </form>
          </div>

          {/* Right Section - Person Image and Social Media */}
          <div className="relative flex justify-center lg:justify-end items-center min-h-[500px] lg:min-h-[600px]">
            <div className="relative w-full max-w-md lg:max-w-lg">
              {/* Person Image */}
              <div className="relative w-full flex justify-end">
                <div className="relative w-full max-w-[380px] lg:max-w-[450px] aspect-[3/4] translate-x-4 lg:translate-x-8">
                  <Image
                    src="/Phil contact fr.png"
                    alt="Philip Samuelraj"
                    fill
                    className="object-contain object-center"
                    priority
                  />
                  
                  {/* Social Media Icons with Connecting Lines - Overlapping person's left shoulder */}
                  <div className="absolute top-1/2 -translate-y-1/2 -left-16 lg:-left-20 z-10 flex flex-col items-center justify-center">
                    {/* X/Twitter Icon */}
                    <div className="relative z-10">
                      <a 
                        href="https://twitter.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block rounded-full bg-black flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200 relative"
                        style={{
                          width: '56px',
                          height: '56px',
                          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3), inset 0 -28px 20px -10px rgba(255, 255, 255, 0.3)',
                          overflow: 'hidden'
                        }}
                      >
                        {/* White half-circle highlight using pseudo-element approach */}
                        <div 
                          className="absolute inset-0 pointer-events-none"
                          style={{
                            background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 40%, transparent 80%)',
                            borderRadius: '50%',
                            zIndex: 1
                          }}
                        />
                        <svg 
                          width="22" 
                          height="22" 
                          viewBox="0 0 24 24" 
                          fill="none"
                          className="relative z-10"
                        >
                          <path 
                            d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" 
                            fill="white"
                          />
                        </svg>
                      </a>
                    </div>

                    {/* Connecting Lines SVG - Curved lines connecting icon centers */}
                    <svg 
                      className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none z-0"
                      width="4"
                      height="140"
                    >
                      {/* Curved line from Twitter bottom center to LinkedIn top center - S-shaped curve */}
                      <path 
                        d="M 2 28 Q 8 42 2 56" 
                        stroke="white" 
                        strokeWidth="2" 
                        fill="none"
                        strokeLinecap="round"
                      />
                      {/* Curved line from LinkedIn bottom center to Instagram top center - S-shaped curve */}
                      <path 
                        d="M 2 84 Q 8 98 2 112" 
                        stroke="white" 
                        strokeWidth="2" 
                        fill="none"
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* LinkedIn Icon */}
                    <div className="relative z-10" style={{ marginTop: '28px' }}>
                      <a 
                        href="https://linkedin.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block rounded-full bg-[#0077b5] flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200 relative overflow-hidden"
                        style={{
                          width: '56px',
                          height: '56px',
                          boxShadow: '0 4px 15px rgba(0, 119, 181, 0.4)'
                        }}
                      >
                        {/* White half-circle highlight - positioned at top */}
                        <svg 
                          className="absolute top-0 left-0 pointer-events-none"
                          width="56"
                          height="28"
                          style={{ zIndex: 1 }}
                        >
                          <defs>
                            <linearGradient id="whiteGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.7)" />
                              <stop offset="40%" stopColor="rgba(255, 255, 255, 0.4)" />
                              <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                          </defs>
                          <path 
                            d="M 0 0 A 28 28 0 0 1 56 0 L 56 28 L 0 28 Z" 
                            fill="url(#whiteGradient2)"
                          />
                        </svg>
                        <svg 
                          width="22" 
                          height="22" 
                          viewBox="0 0 24 24" 
                          fill="none"
                          className="relative z-10"
                        >
                          <path 
                            d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" 
                            fill="white"
                          />
                        </svg>
                      </a>
                    </div>

                    {/* Instagram Icon */}
                    <div className="relative z-10" style={{ marginTop: '28px' }}>
                      <a 
                        href="https://instagram.com" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block rounded-full flex items-center justify-center shadow-xl hover:scale-110 transition-transform duration-200 relative overflow-hidden"
                        style={{
                          width: '56px',
                          height: '56px',
                          background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)',
                          boxShadow: '0 4px 15px rgba(188, 24, 136, 0.4)'
                        }}
                      >
                        {/* White half-circle highlight - positioned at top */}
                        <svg 
                          className="absolute top-0 left-0 pointer-events-none"
                          width="56"
                          height="28"
                          style={{ zIndex: 1 }}
                        >
                          <defs>
                            <linearGradient id="whiteGradient3" x1="0%" y1="0%" x2="0%" y2="100%">
                              <stop offset="0%" stopColor="rgba(255, 255, 255, 0.7)" />
                              <stop offset="40%" stopColor="rgba(255, 255, 255, 0.4)" />
                              <stop offset="100%" stopColor="transparent" />
                            </linearGradient>
                          </defs>
                          <path 
                            d="M 0 0 A 28 28 0 0 1 56 0 L 56 28 L 0 28 Z" 
                            fill="url(#whiteGradient3)"
                          />
                        </svg>
                        <svg 
                          width="22" 
                          height="22" 
                          viewBox="0 0 24 24" 
                          fill="none"
                          className="relative z-10"
                        >
                          <path 
                            d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" 
                            fill="white"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

