"use client";

import MarkdownPreview from "@uiw/react-markdown-preview";

const source = `
  ## Terms of Service

  **Effective Date:** March 23, 2025

  **1. Acceptance of Terms**
  By accessing or using SimboliqAI's services, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.

  **2. Description of Service**
  SimboliqAI is an AI-powered platform that empowers you to create unique, custom logos tailored to your brand identity. By leveraging advanced machine learning and intuitive design tools, we deliver high-quality logo designs quickly and efficiently. As we continuously evolve our technology to stay ahead of market trends, please note that we reserve the right to modify, enhance, or discontinue the service at any time without notice.

  **3. Account and Registration**
  - When you register or use our services, you may be required to provide a valid email address.
  - You agree to provide accurate information and update it as needed.

  **4. Payment Processing**
  - All payments are securely processed through Stripe.
  - We do not store or handle any sensitive payment information; please review Stripe’s terms and privacy policy for details.

  **5. Use of Cookies**
  We use cookies to authenticate users and improve service quality. By using our services, you consent to our cookie policy as described in our Privacy Policy.

  **6. Customer Support**
  For support, please email us at support@simboliqai.com. While we aim to address all inquiries in a timely manner, response times may vary.

  **7. Intellectual Property**
  All content, trademarks, and data on the website are the property of SimboliqAI or its licensors. Unauthorized use of this material is prohibited.

  **8. Disclaimer of Warranties**
  - Our services are provided "as is" and "as available" without any warranties, express or implied.
  - We do not guarantee uninterrupted or error-free operation of our services.

  **9. Limitation of Liability**
  In no event shall SimboliqAI, its affiliates, or their respective officers be liable for any indirect, incidental, special, or consequential damages arising from your use of our services.

  **10. Governing Law**
  These Terms shall be governed by the laws of the jurisdiction in which SimboliqAI operates, without regard to conflict of law provisions.

  **11. Modifications to the Terms**
  We reserve the right to update these Terms at any time. Continued use of the service constitutes acceptance of any changes.

  **12. Contact Information**
  If you have any questions regarding these Terms of Service, please contact us at support@simboliqai.com.
`;

export default function TosPage() {
  return (
    <MarkdownPreview
      source={source}
      style={{ padding: 16, backgroundColor: "white", color: "black" }}
    />
  );
}
