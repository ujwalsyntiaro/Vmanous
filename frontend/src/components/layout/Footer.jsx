import React from 'react';
import { Link } from 'react-router-dom';
import Container from '../ui/Container';
import Logo from '../ui/Logo';
import { Phone, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-vmanous-navy-dark pt-6 md:pt-8 pb-3 border-t border-gray-200">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 md:gap-8 lg:gap-10 mb-4 lg:pl-4">
          {/* Column 1: Brand & Contact Address */}
          <div className="lg:col-span-2 space-y-4 lg:pr-8">
            <div>
              <Logo />
              <div className="text-sm font-semibold text-gray-500 mt-1 pl-[74px]">Open Source</div>
            </div>

            <p className="text-gray-500 text-xs leading-relaxed max-w-xs">
              Enterprise Power BI consulting and managed analytics services for organisations that take data seriously.
            </p>

            <div className="text-xs font-bold text-gray-800">
              CIN: U62099PN2024PTC229219
            </div>

            <div className="text-xs text-gray-500 leading-relaxed">
              <span>ABC Junction Sector 26 Nigdi Pradhikaran, Near Akurdi Railway Station, Pune - 411044</span>
            </div>
          </div>

          {/* Column 2 & 3: Services & Quick Links (2-column layout on mobile) */}
          <div className="grid grid-cols-2 gap-6 col-span-1 md:col-span-2 lg:col-span-2">
            {/* Services */}
            <div>
              <h4 className="text-sm font-bold text-vmanous-navy-dark mb-3">Services</h4>
              <ul className="space-y-2.5 text-xs">
                <li><span className="text-gray-600 hover:text-vmanous-green transition-colors cursor-pointer font-medium">Strategic Consulting</span></li>
                <li><span className="text-gray-600 hover:text-vmanous-green transition-colors cursor-pointer font-medium">Data Architecture</span></li>
                <li><span className="text-gray-600 hover:text-vmanous-green transition-colors cursor-pointer font-medium">Governance & Security</span></li>
                <li><span className="text-gray-600 hover:text-vmanous-green transition-colors cursor-pointer font-medium">Dashboard Development</span></li>
                <li><span className="text-gray-600 hover:text-vmanous-green transition-colors cursor-pointer font-medium">DAX Optimization</span></li>
                <li><span className="text-gray-600 hover:text-vmanous-green transition-colors cursor-pointer font-medium">Managed Services</span></li>
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-sm font-bold text-vmanous-navy-dark mb-3">Quick Links</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/" className="text-gray-600 hover:text-vmanous-green transition-colors font-medium">Home</Link></li>
                <li><Link to="/about" className="text-gray-600 hover:text-vmanous-green transition-colors font-medium">About</Link></li>
                <li><Link to="/gallery" className="text-gray-600 hover:text-vmanous-green transition-colors font-medium">Gallery</Link></li>
                <li><Link to="/ai-summit" className="text-gray-600 hover:text-vmanous-green transition-colors font-medium">Solutions</Link></li>
                <li><Link to="/case-studies" className="text-gray-600 hover:text-vmanous-green transition-colors font-medium">Case Studies</Link></li>
                <li><Link to="/blog" className="text-gray-600 hover:text-vmanous-green transition-colors font-medium">Blog & Insights</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 4 & 5: Legal & Get In Touch (2-column layout on mobile) */}
          <div className="grid grid-cols-2 gap-6 col-span-1 md:col-span-2 lg:col-span-2">
            {/* Legal */}
            <div>
              <h4 className="text-sm font-bold text-vmanous-navy-dark mb-3">Legal</h4>
              <ul className="space-y-2.5 text-xs">
                <li><Link to="/privacy-policy" className="text-gray-600 hover:text-vmanous-green transition-colors font-medium">Privacy Policy</Link></li>
                <li><Link to="/terms-and-conditions" className="text-gray-600 hover:text-vmanous-green transition-colors font-medium">Terms & Conditions</Link></li>
                <li><Link to="/cancellation-policy" className="text-gray-600 hover:text-vmanous-green transition-colors font-medium">Cancellation Policy</Link></li>
                <li><Link to="/refund-policy" className="text-gray-600 hover:text-vmanous-green transition-colors font-medium">Refund Policy</Link></li>
              </ul>
            </div>

            {/* Get In Touch & Socials */}
            <div>
              <h4 className="text-sm font-bold text-vmanous-navy-dark mb-3">Get In Touch</h4>

              <div className="space-y-3 text-xs mb-4">
                <a href="tel:+919112113322" className="flex items-center gap-2 text-gray-600 hover:text-vmanous-green transition-colors font-medium">
                  <Phone size={14} className="text-vmanous-green flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs">IN +91 911 211 3322</span>
                </a>
                <a href="mailto:info@vmanous.com" className="flex items-center gap-2 text-gray-600 hover:text-vmanous-green transition-colors font-medium">
                  <Mail size={14} className="text-vmanous-green flex-shrink-0" />
                  <span className="text-[11px] sm:text-xs">info@vmanous.com</span>
                </a>
              </div>

              <div className="text-xs font-semibold text-gray-700 mb-3">Follow Us</div>
              <div className="flex items-center gap-4">
                {/* LinkedIn Icon */}
                <a
                  href="https://www.linkedin.com/company/vmanous/"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="hover:opacity-75 transition-opacity"
                >
                  <svg className="w-5 h-5 fill-[#0A66C2]" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                </a>

                {/* Instagram Icon */}
                <a
                  href="https://www.instagram.com/_vmanous?igsi=MTJ6MGEwZGQwbmRy"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="hover:opacity-75 transition-opacity"
                >
                  <svg className="w-5 h-5 stroke-[#E1306C] stroke-[2] fill-none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>

                {/* Messenger / Chat Icon */}
                <a
                  href="mailto:info@vmanous.com"
                  aria-label="Email Us"
                  className="hover:opacity-75 transition-opacity"
                >
                  <svg className="w-5 h-5 stroke-[#0084FF] stroke-[2] fill-none" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-3 mt-2 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-xs font-medium">
            All rights reserved by <span onClick={() => window.location.reload()} className="font-bold text-vmanous-navy-dark hover:text-emerald-600 cursor-pointer transition-colors">VMANOUS</span>
          </p>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
