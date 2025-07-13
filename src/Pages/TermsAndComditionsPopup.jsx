
import React from 'react';

const TermsAndConditionsPopup = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Terms and Conditions</h2>
        <div className="text-gray-700 text-sm leading-relaxed space-y-4">
          <p>
            These terms and conditions ("Terms") govern your use of the restaurant registration service provided by **[Your Company Name]** ("we," "us," or "our"). By registering your restaurant, you agree to comply with and be bound by these Terms.
          </p>
          <h3 className="font-semibold text-lg">1. Registration and Account</h3>
          <p>
            You must provide accurate, current, and complete information during the registration process. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
          </p>
          <h3 className="font-semibold text-lg">2. Content and Information</h3>
          <p>
            You are solely responsible for the accuracy and legality of all content, including restaurant details, menus, images, and offers, that you upload or provide through our service.
          </p>
          <h3 className="font-semibold text-lg">3. Licenses and Documents</h3>
          <p>
            You warrant that you possess all necessary licenses, permits, and documents required to operate your restaurant in accordance with applicable laws and regulations in **India**. You agree to provide valid and verifiable copies of these documents upon request.
          </p>
          <h3 className="font-semibold text-lg">4. Data Privacy</h3>
          <p>
            We collect and use your data in accordance with our Privacy Policy. By agreeing to these Terms, you also acknowledge and agree to our Privacy Policy.
          </p>
          <h3 className="font-semibold text-lg">5. Termination</h3>
          <p>
            We reserve the right to suspend or terminate your registration at our sole discretion if you violate these Terms or engage in any fraudulent or unlawful activities.
          </p>
          <h3 className="font-semibold text-lg">6. Disclaimer of Warranties</h3>
          <p>
            Our service is provided "as is" and "as available" without any warranties, express or implied. We do not guarantee that the service will be error-free or uninterrupted.
          </p>
          <h3 className="font-semibold text-lg">7. Limitation of Liability</h3>
          <p>
            To the fullest extent permitted by law, we shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or in connection with your use of the service.
          </p>
          <h3 className="font-semibold text-lg">8. Governing Law</h3>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of **India**.
          </p>
          <h3 className="font-semibold text-lg">9. Changes to Terms</h3>
          <p>
            We reserve the right to modify these Terms at any time. Your continued use of the service after any such modifications constitutes your acceptance of the new Terms.
          </p>
        </div>
        <div className="flex justify-center mt-6">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPopup;