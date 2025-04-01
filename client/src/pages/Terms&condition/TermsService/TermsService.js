import React from 'react';

const TermsService = () => {
  return (
    <div className="mx-2 lg:mx-12 p-4 md:p-8 text-gray-800">
      <div className="flex flex-col md:flex-row md:justify-between items-start mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-500 mb-2 md:mb-0">Terms of Service</h1>
        <p className="text-sm text-gray-600">Last Updated: 20 April 2025</p>
      </div>
      
      <div className="space-y-5">
        <section>
          <p className="font-medium">1. Introduction</p>
          <p className="text-sm">
            Welcome to Preplings! These Terms of Service ("Terms") govern your use of Preplings, an AI-driven language learning platform. By accessing or using our services, you agree to comply with these Terms. If you do not agree, please do not use our services.
          </p>
        </section>
        
        <section>
          <p className="font-medium">2. Eligibility</p>
          <p className="text-sm">
            You must be at least 18 years old or have parental consent to use our services. By using Preplings, you confirm that you meet these requirements.
          </p>
        </section>
        
        <section>
          <p className="font-medium">3. Services Offered</p>
          <p className="text-sm">
            Preplings provides various language learning services, including general practice, exam preparation, live instructor-led courses, and recorded courses. Features may evolve over time, and we reserve the right to modify, add, or discontinue services at our discretion.
          </p>
        </section>
        
        <section>
          <p className="font-medium">4. Account Registration</p>
          <p className="text-sm">
            To access certain features, you must create an account. You are responsible for maintaining the confidentiality of your account credentials. Any activity under your account is your responsibility.
          </p>
        </section>
        
        <section>
          <p className="font-medium">5. Payment and Refund Policy</p>
          <p className="text-sm">
            Preplings operates on a one-time purchase model for courses and services. Payments must be made in advance. Refunds, if applicable, will be issued per our refund policy, which is available on our website.
          </p>
        </section>
        
        <section>
          <p className="font-medium">6. User Conduct</p>
          <p className="text-sm">
            You agree to use our platform ethically and in compliance with applicable laws. You may not:
          </p>
          <ul className="list-disc pl-8 text-sm space-y-1">
            <li>Engage in harassment, hate speech, or abusive behavior.</li>
            <li>Use our services for illegal or unauthorized purposes.</li>
            <li>Attempt to disrupt or hack our platform.</li>
          </ul>
        </section>
        
        <section>
          <p className="font-medium">7. Intellectual Property</p>
          <p className="text-sm">
            All content on Preplings, including but not limited to course materials, AI-generated insights, and website content, is owned by or licensed to Preplings. Unauthorized use, reproduction, or distribution is prohibited.
          </p>
        </section>
        
        <section>
          <p className="font-medium">8. AI-Generated Content</p>
          <p className="text-sm">
            Some of our features use AI to provide personalized recommendations and feedback. AI-generated content is for educational purposes only and may not always be accurate. Users should use their discretion when relying on AI-generated suggestions.
          </p>
        </section>
        
        <section>
          <p className="font-medium">9. Third-Party Integrations</p>
          <p className="text-sm">
            Preplings may integrate with third-party services such as Zoom or Google Meet for live classes. Your use of such third-party services is subject to their respective terms and privacy policies.
          </p>
        </section>
        
        <section>
          <p className="font-medium">10. Privacy Policy</p>
          <p className="text-sm">
            Your use of Preplings is also governed by our Privacy Policy, which outlines how we collect, use, and protect your data. By using our services, you consent to our data practices as described in the Privacy Policy.
          </p>
        </section>
        
        <section>
          <p className="font-medium">11. Limitation of Liability</p>
          <p className="text-sm">
            Preplings is provided "as is" without warranties of any kind. We are not liable for any direct, indirect, incidental, or consequential damages arising from your use of our services.
          </p>
        </section>
        
        <section>
          <p className="font-medium">12. Termination</p>
          <p className="text-sm">
            We reserve the right to suspend or terminate your account if you violate these Terms or engage in fraudulent or harmful activities.
          </p>
        </section>
        
        <section>
          <p className="font-medium">13. Changes to Terms</p>
          <p className="text-sm">
            We may update these Terms from time to time. Continued use of our services after changes constitutes acceptance of the revised Terms.
          </p>
        </section>
        
        <section>
          <p className="font-medium">14. Governing Law and Dispute Resolution</p>
          <p className="text-sm">
            These Terms are governed by the laws of India. Any disputes shall be resolved through arbitration or mediation as per applicable legal provisions.
          </p>
        </section>
        
        <section>
          <p className="font-medium">15. Contact Us</p>
          <p className="text-sm">
            If you have questions regarding these Terms, you can contact us at <a href="mailto:care@preplings.com" className="text-blue-500 hover:underline">care@preplings.com</a>.
          </p>
        </section>
        
        <p className="text-sm font-medium mt-6">
          By using Preplings, you acknowledge that you have read, understood, and agreed to these Terms.
        </p>
      </div>
    </div>
  );
};

export default TermsService;