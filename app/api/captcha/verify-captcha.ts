import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { token } = req.body;
  const secretKey = process.env.HCAPTCHA_SECRET_KEY; // Add this to your .env.local

  if (!token || !secretKey) {
    return res
      .status(400)
      .json({ success: false, message: "Missing token or secret key" });
  }

  try {
    const verificationResponse = await fetch(
      "https://api.hcaptcha.com/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secretKey}&response=${token}`,
      },
    );
    const data = await verificationResponse.json();

    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "hCaptcha verification failed" });
    }
  } catch (error) {
    console.error("hCaptcha verification error:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
}
