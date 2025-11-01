import React from 'react';
import { motion } from 'framer-motion';
import { 
  FaHeart, 
  FaPhoneAlt, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaShieldAlt,
  FaUserMd,
  FaHospital
} from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Patient Portal', path: '/login' },
    { name: 'Doctor Portal', path: '/login' },
  ];

  const services = [
    'Disease Prediction',
    'Health Analytics',
    'Medical Reports',
    'AI Diagnostics',
  ];

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaInstagram, href: '#', label: 'Instagram' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
  ];

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="bg-linear-to-br from-gray-900 via-pink-900 to-green-900 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-pink-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-green-500 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-16 relative z-10">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Company Info */}
          <div className="md:col-span-1">
            <motion.div 
              className="flex items-center mb-6"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-pink-500 rounded-full mr-3 shadow-lg">
                <FaHeart className="text-white text-xl" />
              </div>
              <h2 className="text-3xl font-bold">
                <span className="text-white">Health</span><span className="text-pink-400">Predict</span>
              </h2>
            </motion.div>
            <p className="text-gray-300 mb-6 leading-relaxed text-lg">
              Pioneering AI-powered healthcare solutions for early disease prediction and better patient outcomes.
            </p>
            <div className="flex items-center space-x-3 bg-green-500 bg-opacity-20 rounded-lg p-3">
              <FaShieldAlt className="text-green-400 text-lg" />
              <span className="text-sm text-white font-medium">HIPAA Compliant & Secure</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-white border-b-2 border-pink-400 pb-2">Quick Links</h3>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <motion.li 
                  key={index}
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    to={link.path}
                    className="text-gray-300 hover:text-pink-400 transition-all duration-300 flex items-center group"
                  >
                    <span className="w-3 h-3 bg-pink-400 rounded-full mr-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300"></span>
                    <span className="group-hover:font-medium">{link.name}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-green-400 border-b-2 border-green-400 pb-2">Our Services</h3>
            <ul className="space-y-4">
              {services.map((service, index) => (
                <motion.li 
                  key={index} 
                  className="text-gray-300 flex items-center group cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-8 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center mr-3 group-hover:bg-opacity-40 transition-all duration-300">
                    <FaUserMd className="text-green-400 text-sm" />
                  </div>
                  <span className="group-hover:text-white group-hover:font-medium transition-all duration-300">{service}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 text-blue-400 border-b-2 border-blue-400 pb-2">Contact Info</h3>
            <div className="space-y-5">
              <motion.div 
                className="flex items-start group cursor-pointer"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mr-3 shrink-0 group-hover:bg-opacity-40 transition-all duration-300">
                  <FaMapMarkerAlt className="text-blue-400 text-sm" />
                </div>
                <div className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  <p className="font-medium">123 Healthcare Ave</p>
                  <p>Medical District, MD 12345</p>
                </div>
              </motion.div>
              <motion.div 
                className="flex items-center group cursor-pointer"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mr-3 shrink-0 group-hover:bg-opacity-40 transition-all duration-300">
                  <FaPhoneAlt className="text-blue-400 text-sm" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">+1 (555) 123-HEALTH</span>
              </motion.div>
              <motion.div 
                className="flex items-center group cursor-pointer"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-8 h-8 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center mr-3 shrink-0 group-hover:bg-opacity-40 transition-all duration-300">
                  <FaEnvelope className="text-blue-400 text-sm" />
                </div>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300 font-medium">support@healthpredict.com</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Features Banner */}
        <div className="bg-pink-600 rounded-3xl p-10 mb-12 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-green-600 opacity-30"></div>
          <div className="absolute inset-0 bg-blue-600 opacity-20"></div>
          <div className="grid md:grid-cols-3 gap-8 text-center relative z-10">
            <motion.div 
              className="flex flex-col items-center group"
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 bg-white bg-opacity-25 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:bg-opacity-35 transition-all duration-300 shadow-lg">
                <FaHeart className="text-3xl text-white" />
              </div>
              <h4 className="font-bold text-lg mb-3 text-white">AI-Powered Predictions</h4>
              <p className="text-white text-opacity-90 leading-relaxed">Advanced machine learning for accurate health forecasting and early disease detection</p>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center group"
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 bg-white bg-opacity-25 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:bg-opacity-35 transition-all duration-300 shadow-lg">
                <FaHospital className="text-3xl text-white" />
              </div>
              <h4 className="font-bold text-lg mb-3 text-white">Expert Medical Team</h4>
              <p className="text-white text-opacity-90 leading-relaxed">Certified doctors and healthcare professionals providing world-class care</p>
            </motion.div>
            <motion.div 
              className="flex flex-col items-center group"
              whileHover={{ y: -5, scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-20 h-20 bg-white bg-opacity-25 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 group-hover:bg-opacity-35 transition-all duration-300 shadow-lg">
                <FaShieldAlt className="text-3xl text-white" />
              </div>
              <h4 className="font-bold text-lg mb-3 text-white">Secure & Private</h4>
              <p className="text-white text-opacity-90 leading-relaxed">Enterprise-grade security with full HIPAA compliance for your health data</p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-pink-400 border-opacity-30 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            {/* Copyright */}
            <div className="text-gray-300 mb-6 md:mb-0">
              <p className="text-lg font-medium">&copy; 2025 HealthPredict Clinic. All rights reserved.</p>
              <p className="text-base mt-1">Designed with <FaHeart className="inline text-pink-400 mx-1 animate-pulse" /> for better healthcare</p>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                const colors = ['bg-pink-500', 'bg-green-500', 'bg-blue-500', 'bg-pink-600'];
                return (
                  <motion.a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    whileHover={{ scale: 1.3, y: -5, rotate: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-12 ${colors[index]} rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm`}
                  >
                    <IconComponent className="text-lg" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Legal Links */}
          <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-8">
            <motion.a 
              href="#" 
              className="text-gray-400 hover:text-pink-400 transition-colors duration-300 font-medium text-base relative group"
              whileHover={{ y: -2 }}
            >
              Privacy Policy
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 group-hover:w-full transition-all duration-300"></span>
            </motion.a>
            <motion.a 
              href="#" 
              className="text-gray-400 hover:text-green-400 transition-colors duration-300 font-medium text-base relative group"
              whileHover={{ y: -2 }}
            >
              Terms of Service
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 group-hover:w-full transition-all duration-300"></span>
            </motion.a>
            <motion.a 
              href="#" 
              className="text-gray-400 hover:text-blue-400 transition-colors duration-300 font-medium text-base relative group"
              whileHover={{ y: -2 }}
            >
              HIPAA Compliance
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-400 group-hover:w-full transition-all duration-300"></span>
            </motion.a>
            <motion.a 
              href="#" 
              className="text-gray-400 hover:text-pink-400 transition-colors duration-300 font-medium text-base relative group"
              whileHover={{ y: -2 }}
            >
              Cookie Policy
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-400 group-hover:w-full transition-all duration-300"></span>
            </motion.a>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
