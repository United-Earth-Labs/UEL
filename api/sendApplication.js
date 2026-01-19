import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { formData, adminEmail } = req.body;

    // Create transporter using applicant's Gmail account
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: formData.email,
        pass: formData.gmailAppPassword, // Applicant provides their own app password
      },
    });

    // Email content for admin
    const emailContent = `
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

    // Send email FROM applicant TO admin
    await transporter.sendMail({
      from: formData.email,
      to: adminEmail,
      subject: `Application: ${formData.name} - United Earth Labs`,
      html: emailContent,
    });

    return res.status(200).json({
      success: true,
      message: 'Application submitted successfully!',
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      error: 'Failed to send application',
      details: error.message,
    });
  }
}
