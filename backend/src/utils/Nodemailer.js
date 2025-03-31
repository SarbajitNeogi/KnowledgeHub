import nodemailer from "nodemailer";

export const Sendmail = async function (email, subject, message) {
  const transporter = nodemailer.createTransport({
    service: "gmail",  // Use `service: "gmail"` instead of `host`
    auth: {
      user: "neogisarbajit080103@gmail.com", // Your Gmail ID
      pass: "glvpwwwocdtmydsa", // Your Google App Password
    },
  });

  const mailOptions = {
    from: "neogisarbajit080103@gmail.com", // Sender (must match auth user)
    to: email, // Recipient
    subject: subject, // Email subject
    html: message, // Email body in HTML format
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent:", info.response);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    console.error("❌ Error sending email:", error);
    return { success: false, error: error.message };
  }
};
