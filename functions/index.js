const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
const cors = require('cors')({ origin: true });

admin.initializeApp();

// Gmail configuration - Using App Password
// You need to generate an App Password from your Google Account
// 1. Go to myaccount.google.com/apppasswords
// 2. Create an app password for "Mail" and "Windows Computer"
// 3. Use that password below

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'adityaraj11d@gmaail.com',
    pass: process.env.GMAIL_PASSWORD || 'wsgv ympf dcns duar',
  },
});

// HTML Template for Admin Email
const getAdminEmailTemplate = (formData) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 800px; margin: 0 auto; padding: 20px; background: #f4f4f4; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; }
    .content { background: white; padding: 20px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #667eea; }
    .value { margin-top: 5px; padding: 10px; background: #f9f9f9; border-left: 3px solid #667eea; }
    .footer { background: #333; color: white; text-align: center; padding: 10px; border-radius: 0 0 5px 5px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>New Application Submission</h1>
      <p>United Earth Labs</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Full Name:</div>
        <div class="value">${formData.name}</div>
      </div>
      <div class="field">
        <div class="label">Age:</div>
        <div class="value">${formData.age}</div>
      </div>
      <div class="field">
        <div class="label">Email Address:</div>
        <div class="value">${formData.email}</div>
      </div>
      <div class="field">
        <div class="label">Contact Number:</div>
        <div class="value">${formData.contactNumber}</div>
      </div>
      <div class="field">
        <div class="label">Educational/Professional Background:</div>
        <div class="value">${formData.background || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Years of Experience:</div>
        <div class="value">${formData.experience || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Skills & Expertise:</div>
        <div class="value">${formData.skills || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Why do you want to join United Earth Labs?</div>
        <div class="value">${formData.reasonToJoin}</div>
      </div>
      <div class="field">
        <div class="label">Innovative Ideas:</div>
        <div class="value">${formData.innovativeIdeas}</div>
      </div>
      <div class="field">
        <div class="label">Time Dedication:</div>
        <div class="value">${formData.timeDedication}</div>
      </div>
      <div class="field">
        <div class="label">Availability:</div>
        <div class="value">${formData.availability || 'Not provided'}</div>
      </div>
    </div>
    <div class="footer">
      <p>Received at: ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
`;

// HTML Template for Applicant Confirmation Email
const getApplicantEmailTemplate = (name) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f4f4f4; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
    .content { background: white; padding: 30px; text-align: center; }
    .message { margin: 20px 0; }
    .footer { background: #333; color: white; text-align: center; padding: 15px; border-radius: 0 0 5px 5px; font-size: 12px; }
    .highlight { color: #667eea; font-weight: bold; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Welcome to United Earth Labs!</h1>
    </div>
    <div class="content">
      <p>Hi <span class="highlight">${name}</span>,</p>
      
      <div class="message">
        <p>Thank you for submitting your application to <span class="highlight">United Earth Labs</span>!</p>
        
        <p>We have successfully received your application and will review it carefully. Our team will evaluate your qualifications, ideas, and enthusiasm for joining our mission to advance humanity to a Type 1 Civilization.</p>
        
        <p>We pride ourselves on considering every applicant thoughtfully. If your profile matches our current needs and vision, we will reach out to you within the next 7-14 days with next steps.</p>
      </div>

      <div class="message" style="background: #f0f4ff; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p><strong>What happens next?</strong></p>
        <ul style="text-align: left; display: inline-block;">
          <li>Application Review</li>
          <li>Screening Interview (if selected)</li>
          <li>Technical/Creative Assessment</li>
          <li>Final Interview</li>
          <li>Onboarding</li>
        </ul>
      </div>

      <p>In the meantime, feel free to explore our website and learn more about our projects and vision.</p>
      
      <p>Best regards,<br>
      <span class="highlight">United Earth Labs Team</span></p>
    </div>
    <div class="footer">
      <p>© 2026 United Earth Labs. Building Tomorrow, Today.</p>
      <p>This is an automated response. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
`;

// Cloud Function to send application emails
exports.sendApplicationEmail = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const formData = req.body;
      const recipientEmail = formData.recipientEmail || 'adityaraj11d@gmail.com';

      // Validate required fields
      if (!formData.name || !formData.email || !formData.reasonToJoin) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      // Send email to admin with full application
      const adminMailOptions = {
        from: process.env.GMAIL_USER || 'adityaraj11d@gmail.com',
        to: recipientEmail,
        subject: `New Application: ${formData.name} - United Earth Labs`,
        html: getAdminEmailTemplate(formData),
        replyTo: formData.email,
      };

      // Send confirmation email to applicant
      const applicantMailOptions = {
        from: process.env.GMAIL_USER || 'adityaraj11d@gmail.com',
        to: formData.email,
        subject: 'Application Received - United Earth Labs',
        html: getApplicantEmailTemplate(formData.name),
      };

      // Send both emails
      await transporter.sendMail(adminMailOptions);
      await transporter.sendMail(applicantMailOptions);

      return res.status(200).json({
        success: true,
        message: 'Application submitted successfully! Check your email for confirmation.',
      });
    } catch (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({
        error: 'Failed to send email',
        details: error.message,
      });
    }
  });
});

// Cloud Function to send acceptance/rejection notifications
exports.sendApplicationNotification = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
      const { applicantEmail, applicantName, status, message } = req.body;

      // Validate required fields
      if (!applicantEmail || !applicantName || !status || !message) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

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
        return res.status(400).json({ error: 'Invalid status. Must be "approved" or "rejected"' });
      }

      // Send email to applicant
      const mailOptions = {
        from: process.env.GMAIL_USER || 'adityaraj11d@gmail.com',
        to: applicantEmail,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      };

      await transporter.sendMail(mailOptions);

      return res.status(200).json({
        success: true,
        message: 'Notification email sent successfully',
      });
    } catch (error) {
      console.error('Error sending notification email:', error);
      return res.status(500).json({
        error: 'Failed to send notification',
        details: error.message,
      });
    }
  });
});
