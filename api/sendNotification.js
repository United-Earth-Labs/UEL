import nodemailer from 'nodemailer';

const ADMIN_EMAIL = 'adityaraj11d@gmail.com';
const ADMIN_PASSWORD = 'wsgv ympf dcns duar'; // App password

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { applicantEmail, applicantName, status, message } = req.body;

    console.log('Sending notification email to:', applicantEmail);

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: ADMIN_EMAIL,
        pass: ADMIN_PASSWORD,
      },
    });

    // Email templates
    const emailContent = {
      approved: {
        subject: `Congratulations! Your Application to United Earth Labs has been Accepted 🎉`,
        html: `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4; }
                .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
                .content { background: white; padding: 30px; }
                .message { margin: 20px 0; padding: 15px; background: #ecfdf5; border-left: 4px solid #10b981; }
                .footer { background: #333; color: white; text-align: center; padding: 15px; border-radius: 0 0 5px 5px; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>🎉 You're In!</h1>
                  <p>Your Application has been Accepted</p>
                </div>
                <div class="content">
                  <p>Hi <strong>${applicantName}</strong>,</p>
                  
                  <p>We are thrilled to inform you that your application to <strong>United Earth Labs</strong> has been <strong style="color: #10b981;">ACCEPTED</strong>!</p>
                  
                  <div class="message">
                    <strong>Message from our team:</strong><br>
                    ${message.replace(/\n/g, '<br>')}
                  </div>

                  <p>Thank you for your enthusiasm and commitment to advancing humanity to a Type 1 Civilization. We look forward to working with you!</p>
                  
                  <p>Best regards,<br>
                  <strong>United Earth Labs Team</strong></p>
                </div>
                <div class="footer">
                  <p>© 2026 United Earth Labs. Building Tomorrow, Today.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      },
      rejected: {
        subject: `Thank You for Your Application to United Earth Labs`,
        html: `
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4; }
                .header { background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
                .content { background: white; padding: 30px; }
                .message { margin: 20px 0; padding: 15px; background: #f3f4f6; border-left: 4px solid #6b7280; }
                .footer { background: #333; color: white; text-align: center; padding: 15px; border-radius: 0 0 5px 5px; font-size: 12px; }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <h1>Thank You for Applying</h1>
                  <p>United Earth Labs</p>
                </div>
                <div class="content">
                  <p>Hi <strong>${applicantName}</strong>,</p>
                  
                  <p>Thank you for your interest in joining <strong>United Earth Labs</strong>. We appreciate the time you took to submit your application and learn about our mission.</p>
                  
                  <div class="message">
                    <strong>Feedback from our team:</strong><br>
                    ${message.replace(/\n/g, '<br>')}
                  </div>

                  <p>While your profile was impressive, we have decided to move forward with other candidates at this time. However, we encourage you to stay connected with us. We will consider future applications and would love to hear from you again.</p>
                  
                  <p>Best regards,<br>
                  <strong>United Earth Labs Team</strong></p>
                </div>
                <div class="footer">
                  <p>© 2026 United Earth Labs. Building Tomorrow, Today.</p>
                </div>
              </div>
            </body>
          </html>
        `,
      },
    };

    const emailTemplate = emailContent[status];

    if (!emailTemplate) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Send email
    const info = await transporter.sendMail({
      from: ADMIN_EMAIL,
      to: applicantEmail,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    });

    console.log('Email sent successfully:', info.messageId);

    return res.status(200).json({
      success: true,
      message: 'Notification email sent successfully',
      messageId: info.messageId,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({
      error: 'Failed to send notification',
      details: error.message,
    });
  }
}
