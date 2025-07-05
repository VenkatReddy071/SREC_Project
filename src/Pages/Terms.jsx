import React from 'react';
import {Link} from "react-router-dom"
const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-white text-white p-4 shadow-md sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/"><h1 className="text-2xl font-bold text-blue-400">NANDYAL INFO</h1></Link>
          <h2 className="text-2xl text-black font-bold">Terms of Service</h2>
         
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <nav className="lg:w-1/4 p-4 bg-gray-50 rounded-lg shadow-sm lg:sticky lg:top-24 self-start">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Sections</h3>
          <ul className="space-y-2">
            <li>
              <a href="#agreement" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                1. Agreement to Terms
              </a>
            </li>
            <li>
              <a href="#services-overview" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                2. Services Overview
              </a>
            </li>
            <li>
              <a href="#user-representations" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                3. User Representations
              </a>
            </li>
            <li>
              <a href="#prohibited-activities" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                4. Prohibited Activities
              </a>
            </li>
            <li>
              <a href="#intellectual-property" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                5. Intellectual Property
              </a>
            </li>
            <li>
              <a href="#third-party-websites" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                6. Third-Party Websites & Content
              </a>
            </li>
            <li>
              <a href="#disclaimers" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                7. Disclaimers
              </a>
            </li>
            <li>
              <a href="#limitation-of-liability" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                8. Limitation of Liability
              </a>
            </li>
            <li>
              <a href="#indemnification" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                9. Indemnification
              </a>
            </li>
            <li>
              <a href="#governing-law" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                10. Governing Law
              </a>
            </li>
            <li>
              <a href="#changes-to-terms" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                11. Changes to Terms
              </a>
            </li>
            <li>
              <a href="#contact-us" className="text-blue-700 hover:text-blue-900 font-medium transition-colors">
                12. Contact Us
              </a>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <main className="lg:w-3/4 bg-white p-6 rounded-lg shadow">
          <section id="agreement" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">1. Agreement to Terms</h3>
            <p className="mb-4">
              These Terms of Service ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you"), and NANDYAL INFO ("we," "us," or "our"), concerning your access to and use of the NANDYAL INFO website as well as any other media form, media channel, mobile website or mobile application related, linked, or otherwise connected thereto (collectively, the "Site").
            </p>
            <p>
              You agree that by accessing the Site, you have read, understood, and agreed to be bound by all of these Terms of Service. IF YOU DO NOT AGREE WITH ALL OF THESE TERMS OF SERVICE, THEN YOU ARE EXPRESSLY PROHIBITED FROM USING THE SITE AND YOU MUST DISCONTINUE USE IMMEDIATELY.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="services-overview" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">2. Services Overview</h3>
            <p className="mb-4">
              NANDYAL INFO provides a platform to streamline your life with easy access to healthcare, fashion, education, and dining experiences. Our services include, but are not limited to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Hospital and Doctor Appointment Booking</li>
              <li>Online Fashion Clothing Shopping</li>
              <li>Schools and Colleges Information and Application Assistance</li>
              <li>Restaurants and Food Ordering Services</li>
            </ul>
            <p className="mt-4">
              By using any of these services, you agree to comply with these Terms and any specific terms applicable to that service.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="user-representations" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">3. User Representations</h3>
            <p className="mb-4">
              By using the Site, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information and promptly update such registration information as necessary; (3) you have the legal capacity and you agree to comply with these Terms of Service; (4) you are not a minor in the jurisdiction in which you reside, or if a minor, you have received parental permission to use the Site; (5) you will not access the Site through automated or non-human means, whether through a bot, script, or otherwise; (6) you will not use the Site for any illegal or unauthorized purpose; and (7) your use of the Site will not violate any applicable law or regulation.
            </p>
            <p>
              If you provide any information that is untrue, inaccurate, not current, or incomplete, we have the right to suspend or terminate your account and refuse any and all current or future use of the Site (or any portion thereof).
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="prohibited-activities" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">4. Prohibited Activities</h3>
            <p className="mb-4">
              You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.
            </p>
            <p className="mb-4 font-semibold">
              As a user of the Site, you agree not to:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
              <li>Make any unauthorized use of the Site, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.</li>
              <li>Circumvent, disable, or otherwise interfere with security-related features of the Site, including features that prevent or restrict use or copying of any Content or enforce limitations on the use of the Site and/or the Content contained therein.</li>
              <li>Engage in unauthorized framing of or linking to the Site.</li>
              <li>Interfere with, disrupt, or create an undue burden on the Site or the networks or services connected to the Site.</li>
              <li>Use the Site as part of any effort to compete with us or otherwise use the Site and/or the Content for any revenue-generating endeavor or commercial enterprise.</li>
              <li>Attempt to impersonate another user or person or use the username of another user.</li>
              <li>Sell or otherwise transfer your profile.</li>
              <li>Use any information obtained from the Site in order to harass, abuse, or harm another person.</li>
              <li>Use the Site to advertise or offer to sell goods and services.</li>
              <li>Upload or transmit (or attempt to upload or to transmit) viruses, Trojan horses, or other material, including excessive use of capital letters and spamming (continuous posting of repetitive text), that interferes with any party’s uninterrupted use and enjoyment of the Site or modifies, impairs, disrupts, alters, or interferes with the use, features, functions, operation, or maintenance of the Site.</li>
              <li>Upload or transmit (or attempt to upload or to transmit) any material that acts as a passive or active information collection or transmission mechanism, including without limitation, clear graphics interchange formats (“gifs”), 1×1 pixels, web bugs, cookies, or other similar devices (sometimes referred to as “spyware” or “passive collection mechanisms” or “pcms”).</li>
              <li>Disparage, tarnish, or otherwise harm, in our opinion, us and/or the Site.</li>
              <li>Use the Site in a manner inconsistent with any applicable laws or regulations.</li>
            </ul>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="intellectual-property" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">5. Intellectual Property</h3>
            <p className="mb-4">
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the “Content”) and the trademarks, service marks, and logos contained therein (the “Marks”) are owned or controlled by us or licensed to us, and are protected by copyright and trademark laws and various other intellectual property rights and unfair competition laws of India, foreign jurisdictions, and international conventions.
            </p>
            <p>
              The Content and the Marks are provided on the Site “AS IS” for your information and personal use only. Except as expressly provided in these Terms of Service, no part of the Site and no Content or Marks may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose whatsoever, without our express prior written permission.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="third-party-websites" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">6. Third-Party Websites & Content</h3>
            <p className="mb-4">
              The Site may contain (or you may be sent via the Site) links to other websites ("Third-Party Websites") as well as articles, photographs, text, graphics, pictures, designs, music, sound, video, information, applications, software, and other content or items belonging to or originating from third parties ("Third-Party Content"). Such Third-Party Websites and Third-Party Content are not investigated, monitored, or checked for accuracy, appropriateness, or completeness by us, and we are not responsible for any Third-Party Websites accessed through the Site or any Third-Party Content posted on, available through, or installed from the Site.
            </p>
            <p>
              Inclusion of any links to or use of any Third-Party Websites or any Third-Party Content does not imply approval or endorsement thereof by us. If you decide to leave the Site and access the Third-Party Websites or to use or install any Third-Party Content, you do so at your own risk, and you should be aware these Terms of Service no longer govern.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="disclaimers" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">7. Disclaimers</h3>
            <p className="mb-4">
              THE SITE IS PROVIDED ON AN AS-IS AND AS-AVAILABLE BASIS. YOU AGREE THAT YOUR USE OF THE SITE AND OUR SERVICES WILL BE AT YOUR SOLE RISK. TO THE FULLEST EXTENT PERMITTED BY LAW, WE DISCLAIM ALL WARRANTIES, EXPRESS OR IMPLIED, IN CONNECTION WITH THE SITE AND YOUR USE THEREOF, INCLUDING, WITHOUT LIMITATION, THE IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE MAKE NO WARRANTIES OR REPRESENTATIONS ABOUT THE ACCURACY OR COMPLETENESS OF THE SITE’S CONTENT OR THE CONTENT OF ANY WEBSITES LINKED TO THE SITE AND WE WILL ASSUME NO LIABILITY OR RESPONSIBILITY FOR ANY (1) ERRORS, MISTAKES, OR INACCURACIES OF CONTENT AND MATERIALS, (2) PERSONAL INJURY OR PROPERTY DAMAGE, OF ANY NATURE WHATSOEVER, RESULTING FROM YOUR ACCESS TO AND USE OF THE SITE, (3) ANY UNAUTHORIZED ACCESS TO OR USE OF OUR SECURE SERVERS AND/OR ANY AND ALL PERSONAL INFORMATION AND/OR FINANCIAL INFORMATION STORED THEREIN, (4) ANY INTERRUPTION OR CESSATION OF TRANSMISSION TO OR FROM THE SITE, (5) ANY BUGS, VIRUSES, TROJAN HORSES, OR THE LIKE WHICH MAY BE TRANSMITTED TO OR THROUGH THE SITE BY ANY THIRD PARTY, AND/OR (6) ANY ERRORS OR OMISSIONS IN ANY CONTENT AND MATERIALS OR FOR ANY LOSS OR DAMAGE OF ANY KIND INCURRED AS A RESULT OF THE USE OF ANY CONTENT POSTED, TRANSMITTED, OR OTHERWISE MADE AVAILABLE VIA THE SITE.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="limitation-of-liability" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">8. Limitation of Liability</h3>
            <p className="mb-4">
              IN NO EVENT WILL WE OR OUR DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE TO YOU OR ANY THIRD PARTY FOR ANY DIRECT, INDIRECT, CONSEQUENTIAL, EXEMPLARY, INCIDENTAL, SPECIAL, OR PUNITIVE DAMAGES, INCLUDING LOST PROFIT, LOST REVENUE, LOSS OF DATA, OR OTHER DAMAGES ARISING FROM YOUR USE OF THE SITE, EVEN IF WE HAVE BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. NOTWITHSTANDING ANYTHING TO THE CONTRARY CONTAINED HEREIN, OUR LIABILITY TO YOU FOR ANY CAUSE WHATSOEVER AND REGARDLESS OF THE FORM OF THE ACTION, WILL AT ALL TIMES BE LIMITED TO THE AMOUNT PAID, IF ANY, BY YOU TO US DURING THE SIX (6) MONTH PERIOD PRIOR TO ANY CAUSE OF ACTION ARISING.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="indemnification" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">9. Indemnification</h3>
            <p className="mb-4">
              You agree to defend, indemnify, and hold us harmless, including our subsidiaries, affiliates, and all of our respective officers, agents, partners, and employees, from and against any loss, damage, liability, claim, or demand, including reasonable attorneys’ fees and expenses, made by any third party due to or arising out of: (1) your Contributions; (2) use of the Site; (3) breach of these Terms of Service; (4) any breach of your representations and warranties set forth in these Terms of Service; (5) your violation of the rights of a third party, including but not limited to intellectual property rights; or (6) any overt harmful act toward any other user of the Site with whom you connected via the Site.
            </p>
            <p>
              Notwithstanding the foregoing, we reserve the right, at your expense, to assume the exclusive defense and control of any matter for which you are required to indemnify us, and you agree to cooperate with our defense of such claims. We will use reasonable efforts to notify you of any such claim, action, or proceeding which is subject to this indemnification upon becoming aware of it.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="governing-law" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">10. Governing Law</h3>
            <p className="mb-4">
              These Terms of Service and your use of the Site are governed by and construed in accordance with the laws of India, without regard to its conflict of law principles.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="changes-to-terms" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">11. Changes to Terms</h3>
            <p className="mb-4">
              We reserve the right, in our sole discretion, to make changes or modifications to these Terms of Service at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of these Terms of Service, and you waive any right to receive specific notice of each such change.
            </p>
            <p>
              It is your responsibility to periodically review these Terms of Service to stay informed of updates. You will be subject to, and will be deemed to have been made aware of and to have accepted, the changes in any revised Terms of Service by your continued use of the Site after the date such revised Terms of Service are posted.
            </p>
          </section>

          <hr className="my-8 border-gray-200" />

          <section id="contact-us" className="mb-8">
            <h3 className="text-2xl font-bold text-blue-600 mb-4">12. Contact Us</h3>
            <p className="mb-4">
              In order to resolve a complaint regarding the Site or to receive further information regarding use of the Site, please contact us at:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
              <li>By email: <a href="mailto:support@nandyalinfo.com" className="text-blue-700 hover:underline">support@nandyalinfo.com</a></li>
              <li>By visiting this page on our website: <a href="/contact" className="text-blue-700 hover:underline">/contact</a></li>
              <li>By mail: [Your Company Full Address Here]</li>
            </ul>
          </section>
        </main>
      </div>
    </div>
  );
};

export default TermsOfService;
