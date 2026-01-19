import { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import emailjs from '@emailjs/browser';

// Initialize Email.js with Public Key from .env.local
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
console.log('Email.js Public Key loaded:', publicKey ? '✓ Present' : '✗ Missing');
emailjs.init(publicKey);

export default function ApplicationActionModal({ application, onClose, onSuccess }) {
  console.log('🎯 ApplicationActionModal mounted for:', application.name);
  
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Update Firestore
      const appRef = doc(db, 'applications', application.id);
      await updateDoc(appRef, {
        status: actionType,
        adminMessage: message,
        updatedAt: new Date(),
      });

      // Send email notification to applicant via Email.js
      try {
        const emailTemplate = {
          to_email: application.email,
          name: application.name,  // Changed from to_name to match template
          time: new Date().toLocaleDateString(),  // Added time field for template
          subject: actionType === 'approved' 
            ? 'Congratulations! Your Application to United Earth Labs has been Accepted 🎉'
            : 'Thank You for Your Application to United Earth Labs',
          status: actionType === 'approved' ? 'Approved' : 'Rejected',
          message: message,
        };

        // Choose template based on action type
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = actionType === 'approved'
          ? import.meta.env.VITE_EMAILJS_TEMPLATE_ACCEPTANCE
          : import.meta.env.VITE_EMAILJS_TEMPLATE_REJECTION;

        console.log('📧 SENDING EMAIL - Detailed Log:');
        console.log('Service ID:', serviceId);
        console.log('Template ID:', templateId);
        console.log('Email Payload:', emailTemplate);

        if (!serviceId || !templateId) {
          throw new Error('Email.js Service ID or Template ID is missing. Check your .env.local file.');
        }

        if (!serviceId.startsWith('service_')) {
          throw new Error(`Invalid Service ID format. Expected "service_*", got "${serviceId}"`);
        }

        if (!templateId.startsWith('template_')) {
          throw new Error(`Invalid Template ID format. Expected "template_*", got "${templateId}"`);
        }

        console.log('🔄 Calling emailjs.send()...');
        console.log('Sending with:');
        console.log('- Service:', serviceId);
        console.log('- Template:', templateId);
        console.log('- Recipient:', emailTemplate.to_email);
        
        const response = await emailjs.send(
          serviceId,
          templateId,
          emailTemplate,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY  // Explicitly pass public key
        );
        console.log('✅ EMAIL SENT SUCCESSFULLY!');
        console.log('Response:', response);
        console.log('Status:', response.status);
        console.log('Text:', response.text);
      } catch (emailError) {
        console.error('❌ EMAIL SENDING FAILED!');
        console.error('Error Name:', emailError.name);
        console.error('Error Message:', emailError.message);
        console.error('Full Error Object:', emailError);
        
        // Show error as popup alert so you can see it
        const errorMsg = emailError.message || 'Unknown email error';
        alert(`❌ Email Error:\n\n${errorMsg}\n\nCheck console for details.`);
        
        // Still show in UI
        setError(`❌ Email Failed: ${errorMsg}`);
        setIsSubmitting(false);
        return;
      }

      onSuccess();
      onClose();

      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'Error processing application');
      setIsSubmitting(false);
    }
  };

  if (!actionType) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-lg p-8 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-2xl font-bold text-cyan-400 mb-4">{application.name}</h2>
          <p className="text-gray-300 mb-6">What action do you want to take?</p>

          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActionType('approved')}
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg transition-all"
            >
              ✓ Approve
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActionType('rejected')}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition-all"
            >
              ✗ Reject
            </motion.button>
          </div>

          <button
            onClick={onClose}
            className="w-full mt-3 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all"
          >
            Cancel
          </button>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-500/30 rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-cyan-400">
              {actionType === 'approved' ? '✓ Approve Application' : '✗ Reject Application'}
            </h2>
            <p className="text-gray-400 mt-1">{application.name} • {application.email}</p>
          </div>
          <button
            onClick={() => setActionType(null)}
            className="p-2 hover:bg-purple-500/20 rounded-full transition-all"
          >
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 p-4 bg-red-900/30 border border-red-500/50 rounded-lg"
          >
            <p className="text-red-300 text-sm">{error}</p>
          </motion.div>
        )}

        <div className="mb-6">
          <label className="block text-cyan-400 font-semibold mb-2">
            Message to Applicant <span className="text-red-400">*</span>
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              actionType === 'approved'
                ? 'Write a welcome message...\n\nExample: We are excited to have you on the team! Please check your email for next steps.'
                : 'Write a feedback message...\n\nExample: Thank you for your interest. We will contact you if a suitable position opens up in the future.'
            }
            rows="6"
            className="w-full px-4 py-3 bg-gray-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/50 transition-all resize-none"
          />
          <p className="text-gray-400 text-sm mt-2">This message will be sent to the applicant via email.</p>
        </div>

        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActionType(null)}
            disabled={isSubmitting}
            className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-lg transition-all disabled:opacity-50"
          >
            Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            className={`flex-1 py-3 ${
              actionType === 'approved'
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-red-600 hover:bg-red-700'
            } text-white font-bold rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isSubmitting ? 'Processing...' : actionType === 'approved' ? '✓ Approve & Send Email' : '✗ Reject & Send Email'}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
