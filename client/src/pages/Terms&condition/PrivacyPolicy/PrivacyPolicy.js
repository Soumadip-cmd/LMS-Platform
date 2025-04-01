import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="mx-2 lg:mx-12 p-4 md:p-8 text-gray-800">
      <div className="flex flex-col md:flex-row md:justify-between items-start mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-500 mb-2 md:mb-0">Privacy Policy</h1>
        <p className="text-sm text-gray-600">Last Updated: 20 April 2025</p>
      </div>
      
      <div className="space-y-6">
        <p className="text-sm">
          At Preplings, we highly value our users and their privacy. It's crucial that you feel at ease while using our website. Understanding how we gather, utilize, and safeguard your information is essential. This Privacy Policy addresses the personally identifiable information (referred to as "Data" below) that we may collect on our site.
        </p>
        <p className="text-sm">
          Please note that this policy doesn't extend to entities beyond our ownership or control, nor to individuals who aren't our employees, agents, or under our control. This Privacy Policy explains what we are, how we collect, store, and use personal information, and how you can exercise your privacy rights.
        </p>
        
        <section>
          <h2 className="text-lg font-semibold">Who We Are</h2>
          <p className="text-sm">
            At Preplings, we are committed to revolutionizing the language learning experience through AI-driven personalized feedback and a supportive environment for learners. You can find us online at <a href="http://www.preplings.com" className="text-blue-500 hover:underline">www.preplings.com</a> and its related subdomains.
          </p>
          <p className="text-sm">
            When you engage with our website or any of our products/services, you acknowledge and agree to abide by this Privacy Policy in addition to our Terms of Service.
          </p>
        </section>
        
        <section>
          <h2 className="text-lg font-semibold">Type of Data We Collect</h2>
          <p className="text-sm">We collect different types of data based on your activities on our site:</p>
          <ol className="list-decimal pl-8 text-sm space-y-2">
            <li>
              <span className="font-medium">Personal Information:</span> Depending on your actions on our site, personal information like your name, email address, and billing address (if making a purchase) is gathered when you register, place an order, or subscribe to our newsletter.
            </li>
            <li>
              <span className="font-medium">Non-Personal Information:</span> We also gather non-personal information, such as demographic data, user IP addresses, browser types, and other anonymous statistical data related to how our website is used.
            </li>
          </ol>
        </section>
        
        <section>
          <h2 className="text-lg font-semibold">Children's Data</h2>
          <p className="text-sm">
            At Preplings, we do not knowingly gather information from children under 18 years old. If you're aware that a child under 18 has provided us with their information, please get in touch with us immediately, and we'll take prompt action.
          </p>
        </section>
        
        <section>
          <h2 className="text-lg font-semibold">Use of Personal Information</h2>
          <ol className="list-decimal pl-8 text-sm space-y-2">
            <li>
              <span className="font-medium">Data Usage:</span> The personal data we collect serves various business purposes. Personal details (such as name and email address) help us recognize you, enabling us to get in touch, send newsletters, and provide product assistance. Non-personal data aids in enhancing our service.
            </li>
            <li>
              <span className="font-medium">Purpose of Data Collection:</span> These details allow us to identify you as a customer, subscriber, or user and facilitate product delivery, verification, and other marketing communications. To use certain features like making purchases, subscribing to newsletters, or leaving comments, providing this information becomes necessary for identification.
            </li>
            <li>
              <span className="font-medium">No Data Sharing With Third Parties:</span> We don't share your data with third parties in any way that would reveal any of your personal information like email, name, etc. (subject to laws and regulations). If you have been through the ways we collect data from, only our administrators have access to your data. No third party can access your data from us. However, you can review and delete your data whenever you want.
            </li>
            <li>
              <span className="font-medium">Data Retention:</span> Upon registration with Preplings, we securely store your personal data for as long as your account remains active, subject to legal obligations. You can delete your account or unsubscribe at any time, adhering to applicable laws and regulations.
            </li>
          </ol>
        </section>
        
        <section>
          <h2 className="text-lg font-semibold">Third-Party Integration and Links</h2>
          <p className="text-sm">
            On Preplings, we might discuss third-party products and services. These external sites have their own privacy policies. As a result, we hold no responsibility or liability for their content or activities on these linked sites.
          </p>
        </section>
        
        <section>
          <h2 className="text-lg font-semibold">Cookies and Tracking Technologies</h2>
          <p className="text-sm">
            Preplings.com uses cookies to identify and track visitors, observing their actions on the site and their website access preferences. For this program to function, cookies containing visitors' IP addresses and visit times are stored in their browsers. Users who prefer not to have cookies stored should adjust their browser settings accordingly to refuse cookies before using Preplings.com. However, some features of Preplings.com may not function properly without cookies enabled.
          </p>
        </section>
        
        <section>
          <h2 className="text-lg font-semibold">Data Breach Procedures We Have in Place</h2>
          <p className="text-sm">
            If we encounter any data breach compromising personal information, such as loss, alteration, unauthorized disclosure or access, personal data transmission, storage, or otherwise, we will promptly notify affected parties as soon as we become aware of the incident.
          </p>
        </section>
        
        <section>
          <h2 className="text-lg font-semibold">Data Review, Update, Download, and Deletion</h2>
          <p className="text-sm">
            If you hold an account or have written comments on Preplings.com, you can request an exported file of your personal information or ask for its deletion. However, certain data may be retained for security, administrative, or legal purposes.
          </p>
          <p className="text-sm">
            You have the ability to review and edit your information at any time through your account details.
          </p>
          <p className="text-sm">
            To delete or receive a copy of your data from our site, reach out to us via our support system, and we will promptly assist you.
          </p>
        </section>
        
        <section>
          <h2 className="text-lg font-semibold">Updating Privacy Policy</h2>
          <p className="text-sm">
            We may occasionally update this Privacy Policy. Any changes or additions will be posted on this page, and major modifications will also be communicated via newsletters.
          </p>
        </section>
        
        <section>
          <h2 className="text-lg font-semibold">Contact Us</h2>
          <p className="text-sm">
            If you have any questions, please contact us at: <a href="mailto:care@preplings.com" className="text-blue-500 hover:underline">care@preplings.com</a>
          </p>
          <p className="text-sm">
            B-16, Deolab Plaza, Nashik, Maharashtra-India
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;