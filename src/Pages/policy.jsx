import React from 'react';
import {Link} from "react-router-dom"
const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      <header className="bg-white text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/"><h1 className="text-2xl font-bold text-blue-400">NANDYAL INFO</h1></Link>
          <h2 className="text-xl text-black font-bold">Privacy Policy</h2>
         
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <nav className="lg:w-1/4 p-4 bg-gray-50 rounded-lg shadow-sm lg:sticky lg:top-24 self-start">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Sections</h3>
          <ul className="space-y-2">
            <li>
              <a href="#introduction" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                1. Introduction
              </a>
            </li>
            <li>
              <a href="#data-we-collect" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                2. Data We Collect
              </a>
            </li>
            <li>
              <a href="#how-we-use-data" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                3. How We Use Your Data
              </a>
            </li>
            <li>
              <a href="#data-sharing" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                4. Data Sharing & Disclosure
              </a>
            </li>
            <li>
              <a href="#your-rights" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                5. Your Rights & Choices
              </a>
            </li>
            <li>
              <a href="#data-security" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                6. Data Security
              </a>
            </li>
            <li>
              <a href="#changes-to-policy" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                7. Changes to This Policy
              </a>
            </li>
            <li>
              <a href="#contact-us" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                8. Contact Us
              </a>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="lg:w-3/4 bg-white p-6 rounded-lg shadow">
          <section id="introduction" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">1. Introduction</h3>
            <p className="mb-4">
              Welcome to NANDYAL INFO! Your privacy is critically important to us. This Privacy Policy describes how NANDYAL INFO ("we," "us," or "our") collects, uses, and discloses information about you when you visit, use, or make purchases from our website at [Your Website URL] (the "Site").
            </p>
            <p>
              By using the Site, you agree to the collection and use of information in accordance with this policy.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="data-we-collect" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">2. Data We Collect</h3>
            <p className="mb-4">
              We collect several types of information from and about users of our Site, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Personal Data:</strong> Information that can be used to identify you directly or indirectly, such as your name, email address, phone number, shipping address, billing address, and payment information related to healthcare, fashion, education, and dining services.
              </li>
              <li>
                <strong>Usage Data:</strong> Information about how the Site is accessed and used. This Usage Data may include information such as your computer's Internet Protocol address (e.g., IP address), browser type, browser version, the pages of our Site that you visit (e.g., healthcare booking, fashion product pages, education listings, restaurant menus), the time and date of your visit, the time spent on those pages, unique device identifiers, and other diagnostic data.
              </li>
              <li>
                <strong>Tracking & Cookies Data:</strong> We use cookies and similar tracking technologies to track the activity on our Site and hold certain information to enhance your experience across our services.
              </li>
              <li>
                <strong>Service-Specific Data:</strong>
                <ul className="list-circle list-inside ml-6 mt-2">
                  <li>For Healthcare: Appointment details, doctor preferences, medical history (if provided by you).</li>
                  <li>For Fashion: Shopping preferences, size, color, brand preferences, purchase history.</li>
                  <li>For Education: Course interests, application history, educational background.</li>
                  <li>For Dining: Order history, dietary preferences, favorite restaurants.</li>
                </ul>
              </li>
            </ul>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="how-we-use-data" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">3. How We Use Your Data</h3>
            <p className="mb-4">
              We use the collected data for various purposes, including:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>To provide and maintain our Site and services (healthcare appointments, fashion shopping, education information, food ordering).</li>
              <li>To notify you about changes to our services.</li>
              <li>To allow you to participate in interactive features of our Site when you choose to do so.</li>
              <li>To provide customer care and support.</li>
              <li>To provide analysis or valuable information so that we can improve the Site and services.</li>
              <li>To monitor the usage of the Site.</li>
              <li>To detect, prevent and address technical issues.</li>
              <li>To provide you with news, special offers and general information about other goods, services and events which we offer that are similar to those that you have already purchased or enquired about unless you have opted not to receive such information.</li>
            </ul>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="data-sharing" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">4. Data Sharing & Disclosure</h3>
            <p className="mb-4">
              We may share your personal information with third parties only in the ways that are described in this Privacy Policy. We do not sell your personal information to third parties.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Service Providers:</strong> We may employ third party companies and individuals to facilitate our Site and services ("Service Providers"), to provide the Site and services on our behalf, to perform Site-related services or to assist us in analyzing how our Site and services are used. These third parties have access to your Personal Data only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose. This includes sharing necessary data with hospitals/doctors for appointments, fashion retailers for purchases, educational institutions for applications, and restaurants for food orders.
              </li>
              <li>
                <strong>Legal Requirements:</strong> We may disclose your Personal Data in the good faith belief that such action is necessary to:
                <ul className="list-circle list-inside ml-6 mt-2">
                  <li>To comply with a legal obligation.</li>
                  <li>To protect and defend the rights or property of NANDYAL INFO.</li>
                  <li>To prevent or investigate possible wrongdoing in connection with the Site.</li>
                  <li>To protect the personal safety of users of the Site or the public.</li>
                  <li>To protect against legal liability.</li>
                </ul>
              </li>
              <li>
                <strong>Business Transfer:</strong> If NANDYAL INFO is involved in a merger, acquisition or asset sale, your Personal Data may be transferred. We will provide notice before your Personal Data is transferred and becomes subject to a different Privacy Policy.
              </li>
            </ul>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="your-rights" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">5. Your Rights & Choices</h3>
            <p className="mb-4">
              You have certain rights regarding the personal data we hold about you. These include:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>
                <strong>Access and Update:</strong> You have the right to access and update your personal data directly within your account settings.
              </li>
              <li>
                <strong>Deletion:</strong> You may request the deletion of your personal data, subject to certain legal obligations.
              </li>
              <li>
                <strong>Opt-Out:</strong> You can opt-out of receiving marketing communications from us by following the unsubscribe link or instructions provided in any email we send or by contacting us directly.
              </li>
              <li>
                <strong>Cookies:</strong> You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Site.
              </li>
            </ul>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="data-security" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">6. Data Security</h3>
            <p className="mb-4">
              The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security. We implement various security measures including encryption and access controls to protect your data.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="changes-to-policy" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">7. Changes to This Policy</h3>
            <p className="mb-4">
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
            </p>
            <p>
              We will let you know via email and/or a prominent notice on our Site, prior to the change becoming effective and update the "effective date" at the top of this Privacy Policy.
            </p>
            <p>
              You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="contact-us" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">8. Contact Us</h3>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>By email: <a href="mailto:privacy@nandyalinfo.com" className="text-blue-700 hover:underline">privacy@nandyalinfo.com</a></li>
              <li>By visiting this page on our website: <a href="/contact" className="text-blue-700 hover:underline">/contact</a></li>
              <li>By mail: [Your Company Full Address Here]</li>
            </ul>
          </section>
        </main>
      </div>

    </div>
  );
};

export default PrivacyPolicy;
