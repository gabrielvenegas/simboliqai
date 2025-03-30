"use client";

import MarkdownPreview from "@uiw/react-markdown-preview";

const source = `
  ## Privacy Policy

  **Effective Date:** March 23, 2025

  **1. Introduction**
  SimboliqAI ("we", "us", or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and protect your personal data when you interact with our website (simboliqai.com) and services.

  **2. Information We Collect**
  - **Email Addresses:** When you contact our support team or sign up for our services, we collect your email address.
  - **Cookies:** We use cookies for authentication and to enhance your user experience via Supabase auth.
  - **Payment Data:** All payment processing is handled by Stripe. We do not store any payment or credit card information.

  **3. How We Use Your Information**
  - **Support and Communication:** Your email is used solely for responding to support inquiries and sending essential service updates.
  - **Authentication:** Cookies help maintain your session and ensure secure authentication.
  - **Payment Processing:** Stripe manages all aspects of payment transactions.

  **4. Data Sharing and Third-Party Services**
  - **Stripe:** All payment details are processed by Stripe. We do not share or retain any sensitive payment information.
  - **Supabase Auth:** We rely on Supabase for authentication; any data shared is subject to their privacy practices.
  - **Other Services:** We do not sell or share your email or other personal data with third parties for marketing purposes.

  **5. Data Retention**
  We retain your email address and authentication-related data only as long as necessary to fulfill the purposes outlined here and to comply with any legal obligations.

  **6. Cookies**
  Our website uses cookies for authentication and session management. You can manage your cookie preferences through your browser settings.

  **7. Your Rights**
  Depending on your jurisdiction, you may have the right to access, update, or request deletion of your personal data. Contact us at support@simboliqai.com for any inquiries or requests regarding your data.

  **8. Security**
  While we strive to protect your data, no online transmission is completely secure. We take reasonable measures to secure your personal information but cannot guarantee absolute security.

  **9. Changes to This Policy**
  We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date.

  **10. Contact Us**
  If you have questions or concerns about this Privacy Policy, please contact us at:
  **Email:** support@simboliqai.com
`;

export default function PrivacyPolicyPage() {
  return (
    <MarkdownPreview
      source={source}
      style={{ padding: 16, backgroundColor: "white", color: "black" }}
    />
  );
}
