import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function ApplicationForm({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    email: '',
    contactNumber: '',
    reasonToJoin: '',
    innovativeIdeas: '',
    timeDedication: '',
    skills: '',
    background: '',
    experience: '',
    availability: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.age.trim()) newErrors.age = 'Age is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!formData.contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid contact number';
    }
    if (!formData.reasonToJoin.trim()) newErrors.reasonToJoin = 'This field is required';
    if (!formData.innovativeIdeas.trim()) newErrors.innovativeIdeas = 'This field is required';
    if (!formData.timeDedication.trim()) newErrors.timeDedication = 'This field is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        // Save application to Firestore
        const applicationsRef = collection(db, 'applications');
        await addDoc(applicationsRef, {
          ...formData,
          submittedAt: serverTimestamp(),
          status: 'pending',
        });

        alert('Thank you for your application! We will review it and get back to you soon.');
        // Reset form
        setFormData({
          name: '',
          age: '',
          email: '',
          contactNumber: '',
          reasonToJoin: '',
          innovativeIdeas: '',
          timeDedication: '',
          skills: '',
          background: '',
          experience: '',
          availability: '',
        });
        onClose();
      } catch (error) {
        console.error('Error submitting application:', error);
        alert('Error submitting application. Please try again later.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 border border-purple-500/30 rounded-3xl shadow-2xl shadow-purple-500/20">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-purple-500/20 rounded-full transition-all duration-200 z-10"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-900/50 to-blue-900/50 backdrop-blur-md border-b border-purple-500/30 p-6 rounded-t-3xl">
                <h2 className="text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-purple-400 to-blue-400">
                  Join United Earth Labs
                </h2>
                <p className="text-gray-300 mt-2">Help us advance humanity to Type 1 Civilization</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                {/* Name and Age */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cyan-400 font-semibold mb-2">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.name ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all`}
                      placeholder="Your name"
                    />
                    {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-cyan-400 font-semibold mb-2">
                      Age <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      name="age"
                      value={formData.age}
                      onChange={handleChange}
                      min="18"
                      className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.age ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all`}
                      placeholder="Your age"
                    />
                    {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age}</p>}
                  </div>
                </div>

                {/* Email and Contact */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cyan-400 font-semibold mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.email ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all`}
                      placeholder="your-email@example.com"
                    />
                    {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-cyan-400 font-semibold mb-2">
                      Contact Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.contactNumber ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all`}
                      placeholder="+1 0000000000"
                    />
                    {errors.contactNumber && <p className="text-red-400 text-sm mt-1">{errors.contactNumber}</p>}
                  </div>
                </div>

                {/* Background and Experience */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cyan-400 font-semibold mb-2">
                      Educational/Professional Background
                    </label>
                    <input
                      type="text"
                      name="background"
                      value={formData.background}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="Your educational/professional background"
                    />
                  </div>

                  <div>
                    <label className="block text-cyan-400 font-semibold mb-2">
                      Years of Experience
                    </label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                      placeholder="Your years of experience"
                    />
                  </div>
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-cyan-400 font-semibold mb-2">
                    Skills & Expertise
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                    placeholder="Your skills & expertise"
                  />
                </div>

                {/* Reason to Join */}
                <div>
                  <label className="block text-cyan-400 font-semibold mb-2">
                    Why do you want to join United Earth Labs? <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="reasonToJoin"
                    value={formData.reasonToJoin}
                    onChange={handleChange}
                    rows="4"
                    className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.reasonToJoin ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all resize-none`}
                    placeholder="Your reason to join"
                  />
                  {errors.reasonToJoin && <p className="text-red-400 text-sm mt-1">{errors.reasonToJoin}</p>}
                </div>

                {/* Innovative Ideas */}
                <div>
                  <label className="block text-cyan-400 font-semibold mb-2">
                    Share Your Innovative Ideas <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="innovativeIdeas"
                    value={formData.innovativeIdeas}
                    onChange={handleChange}
                    rows="5"
                    className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.innovativeIdeas ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all resize-none`}
                    placeholder="Your innovative ideas"
                  />
                  {errors.innovativeIdeas && <p className="text-red-400 text-sm mt-1">{errors.innovativeIdeas}</p>}
                </div>

                {/* Time Dedication and Availability */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-cyan-400 font-semibold mb-2">
                      How much time can you dedicate? <span className="text-red-400">*</span>
                    </label>
                    <select
                      name="timeDedication"
                      value={formData.timeDedication}
                      onChange={handleChange}
                      className={`w-full px-4 py-3 bg-gray-800/50 border ${errors.timeDedication ? 'border-red-500' : 'border-purple-500/30'} rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all`}
                    >
                      <option value="">Select...</option>
                      <option value="part-time">Part-time (10-20 hrs/week)</option>
                      <option value="full-time">Full-time (40+ hrs/week)</option>
                      <option value="contract">Contract/Project-based</option>
                      <option value="volunteer">Volunteer (flexible)</option>
                    </select>
                    {errors.timeDedication && <p className="text-red-400 text-sm mt-1">{errors.timeDedication}</p>}
                  </div>

                  <div>
                    <label className="block text-cyan-400 font-semibold mb-2">
                      Availability
                    </label>
                    <input
                      type="text"
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all"
                        placeholder="Your availability"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 flex gap-4">
                  <motion.button
                    type="button"
                    onClick={onClose}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gray-800/50 hover:bg-gray-700/50 border border-purple-500/30 hover:border-purple-500/50 text-gray-300 font-semibold rounded-lg transition-all duration-300"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold rounded-lg shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
