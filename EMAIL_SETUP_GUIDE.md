# Email Setup Guide for United Earth Labs Application Form

This guide walks you through setting up the email functionality for your application form.

## Overview

When users submit the application form, your system will:
1. **Send an email to admin** (`aadityaraj11d@gmail.com`) with the complete application details
2. **Send a confirmation email to applicant** with their own email address

## Prerequisites

- Firebase project already set up
- Firebase CLI installed (`npm install -g firebase-tools`)
- Node.js 20 or higher installed

## Step 1: Set Up Gmail App Password

Since you're using Gmail, you need to generate an App Password:

1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Click **"Security"** in the left sidebar
3. Look for **"App passwords"** (you may need to enable 2-factor authentication first)
4. Select **"Mail"** and **"Windows Computer"**
5. Google will generate a 16-character password - **copy this**
6. This is your `GMAIL_PASSWORD`

> **Important**: Never commit this password to version control!

## Step 2: Update Cloud Function Configuration

1. Navigate to your Firebase project's functions directory:
   ```bash
   cd functions
   ```

2. Set environment variables for Firebase:
   ```bash
   firebase functions:config:set gmail.user="your-email@gmail.com" gmail.password="your-app-password"
   ```

   Replace:
   - `your-email@gmail.com` with your actual Gmail address
   - `your-app-password` with the 16-character password from Step 1

## Step 3: Deploy Cloud Functions

1. From the root directory, install dependencies:
   ```bash
   cd functions
   npm install
   cd ..
   ```

2. Deploy the function:
   ```bash
   firebase deploy --only functions
   ```

   After deployment, Firebase will show you the function URL. It will look like:
   ```
   https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/sendApplicationEmail
   ```

## Step 4: Update Frontend with Cloud Function URL

1. Open `src/components/ApplicationForm.jsx`
2. Find this line in the `handleSubmit` function:
   ```javascript
   'https://us-central1-your-project-id.cloudfunctions.net/sendApplicationEmail',
   ```
3. Replace `your-project-id` with your actual Firebase project ID

You can find your project ID:
- In Firebase Console: Project Settings → General
- Or in `.firebaserc` file in your project root

## Step 5: Install Frontend Dependencies

Install axios in your main project:
```bash
npm install axios
```

## Testing the Setup

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Open the application in your browser
3. Click "Apply to Join the Team"
4. Fill out the form and submit
5. Check both:
   - `dialgathisside@gmail.com` for the application details
   - Your test email for the confirmation message

## Troubleshooting

### "CORS Error"
- The Cloud Function has CORS enabled
- If you still get errors, check that the function URL is correct

### "Gmail Authentication Failed"
- Verify your app password is correct
- Make sure you used a 16-character app password (not your regular password)
- Check that 2-factor authentication is enabled on the Gmail account

### "Function Not Found (404)"
- Verify the function URL in ApplicationForm.jsx matches the deployed URL
- Check that `firebase deploy --only functions` completed successfully

### "Emails Not Being Sent"
- Check Firebase Function logs:
  ```bash
  firebase functions:log
  ```
- Verify environment variables are set:
  ```bash
  firebase functions:config:get
  ```

## Email Templates

The system sends two different emails:

### 1. Admin Email (to dialgathisside@gmail.com)
- Contains all form data in a formatted HTML layout
- Includes applicant's email in the Reply-To field
- Subject: `New Application: [Applicant Name] - United Earth Labs`

### 2. Applicant Confirmation Email
- Friendly welcome message
- Explains the review process
- Confirms receipt of application
- Subject: `Application Received - United Earth Labs`

## Next Steps

- Monitor the function logs for any errors
- Test with different form submissions
- Customize email templates by editing `functions/index.js` if needed
- Consider adding database storage to keep application records

## Customization

### Change Admin Email
Edit the line in `ApplicationForm.jsx`:
```javascript
recipientEmail: 'dialgathisside@gmail.com',
```

### Modify Email Templates
Edit the `getAdminEmailTemplate()` or `getApplicantEmailTemplate()` functions in `functions/index.js` to customize the email HTML.

### Add More Functionality
You can extend the function to:
- Store data in Firebase Firestore
- Send webhook notifications
- Integrate with other services
- Add email attachments

---

For more help, visit:
- [Firebase Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Nodemailer Documentation](https://nodemailer.com/)
