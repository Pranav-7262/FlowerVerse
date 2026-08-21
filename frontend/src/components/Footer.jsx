import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Heart,
  Flower2,
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
  ];

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Shop All", href: "/?category=All" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/support" },
  ];

  const customerService = [
    { label: "Track Order", href: "/orders" },
    { label: "Shipping Info", href: "/support" },
    { label: "Returns", href: "/support" },
    { label: "FAQ", href: "/support" },
  ];

  const info = [
    { icon: Phone, text: "+1 (555) 123-4567", label: "Call Us" },
    { icon: Mail, text: "hello@flowerrmart.com", label: "Email" },
    { icon: MapPin, text: "123 Flower Street, Garden City", label: "Visit Us" },
  ];

  return (
    <footer className="bg-gradient-to-b from-rose-50/80 via-pink-50/50 to-white border-t border-rose-100/50 shadow-inner shadow-rose-200/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
        >
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-rose-600 to-pink-600 rounded-lg">
                <Flower2 size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-black text-rose-700">FlowerrMart</h2>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed">
              Bringing nature's beauty to your doorstep. Fresh flowers delivered
              with love and care.
            </p>
            <div className="flex gap-3 pt-4">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 rounded-full bg-rose-100 border border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-200 hover:border-rose-300 transition-all"
                    aria-label={social.label}
                  >
                    <Icon size={18} />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-black uppercase tracking-widest text-rose-700 mb-6">
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-600 hover:text-rose-700 text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-1.5 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Customer Service */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-black uppercase tracking-widest text-rose-700 mb-6">
              Customer Service
            </h3>
            <ul className="space-y-3">
              {customerService.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-slate-600 hover:text-rose-700 text-sm transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="w-0 group-hover:w-1.5 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <h3 className="text-sm font-black uppercase tracking-widest text-rose-700 mb-6">
              Get in Touch
            </h3>
            <div className="space-y-4">
              {info.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    whileHover={{ x: 4 }}
                    className="flex gap-3 text-sm text-slate-600 hover:text-rose-700 transition-colors cursor-pointer group"
                  >
                    <Icon
                      size={18}
                      className="text-rose-600/70 group-hover:text-rose-700 transition-colors flex-shrink-0 mt-0.5"
                    />
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">
                        {item.label}
                      </p>
                      <p className="text-sm font-medium">{item.text}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>

        {/* Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          className="h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent mb-8"
        />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-center gap-6"
        >
          {/* Left */}
          <div className="flex flex-col sm:flex-row gap-4 text-xs text-slate-600">
            <Link
              to="/support"
              className="hover:text-rose-700 transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="hidden sm:block">•</span>
            <Link
              to="/support"
              className="hover:text-rose-700 transition-colors"
            >
              Terms of Service
            </Link>
            <span className="hidden sm:block">•</span>
            <Link
              to="/support"
              className="hover:text-rose-700 transition-colors"
            >
              Cookie Policy
            </Link>
          </div>

          {/* Center */}
          <div className="flex items-center gap-2 text-xs text-slate-600">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Heart size={14} className="text-rose-500" fill="currentColor" />
            </motion.div>
            <span>by FlowerrMart</span>
          </div>

          {/* Right */}
          <p className="text-xs text-slate-600 text-center md:text-right">
            © {currentYear} FlowerrMart. All rights reserved.
          </p>
        </motion.div>
      </div>

      {/* Top Gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-rose-300/30 to-transparent" />
    </footer>
  );
};

export default Footer;
