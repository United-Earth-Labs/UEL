# Email.js Setup Guide (FREE)

Email.js allows you to send emails directly from your browser without a backend server. It's completely free with a generous limit!

## Step 1: Sign Up for Email.js
1. Go to https://www.emailjs.com
2. Click "Sign Up"
3. Create a free account

## Step 2: Set Up Gmail Connection
1. In Email.js dashboard, go to **Email Services**
2. Click **Add Service**
3. Select **Gmail**
4. Follow the prompts to connect your Gmail account
5. **Important:** You'll need to:
   - Allow Email.js to access your Gmail
   - Create an [App Password](https://myaccount.google.com/apppasswords) if you have 2FA enabled
6. Copy your **Service ID** (looks like: `service_xxxxxxxxx`)

## Step 3: Create Email Template
1. In Email.js dashboard, go to **Email Templates**
2. Click **Create New Template**
3. Name: `approval_rejection_template`
4. Set **To Email:** `{{to_email}}`
5. Set **Subject:** `{{subject}}`
6. In the template body, use a simple template with variables like:
   - `{{to_name}}` - applicant name
   - `{{message}}` - admin message
   - `{{status}}` - "Approved" or "Rejected"

7. Copy your **Template ID** (looks like: `template_xxxxxxxxx`)

## Step 4: Get Your Public Key
1. Go to **Account** settings
2. Copy your **Public Key** (looks like: `xxxxxxxxxxxxxxxxx`)

## Step 5: Update Your Code
In `src/components/ApplicationActionModal.jsx`, replace these placeholders at the top of the file:

```javascript
emailjs.init('YOUR_PUBLIC_KEY'); // Replace with your actual Email.js Public Key
```

Then in the handleSubmit function (around line 44-45), replace:
```javascript
emailjs.send(
  'YOUR_SERVICE_ID',    // Replace with your Service ID
  'YOUR_TEMPLATE_ID',   // Replace with your Template ID
  emailTemplate
);
```

## Example:
```javascript
emailjs.init('1a2b3c4d5e6f7g8h9i0j1k2l3m');

emailjs.send(
  'service_abc123xyz',
  'template_xyz789abc',
  emailTemplate
);
```

## Free Tier Limits
- **200 emails per month** (plenty for most use cases)
- **Unlimited recipients**
- **No credit card required**

## How It Works
When you approve/reject an application:
1. The application status updates in Firestore ✓
2. An email is sent to the applicant via Email.js ✓
3. The admin gets confirmation or optional warning if email fails

## Testing
1. Go back to your admin dashboard
2. Click "Action" on any pending application
3. Choose Approve or Reject
4. Enter a message
5. Click the submit button
6. Check the applicant's email inbox (usually arrives in seconds!)

If you get errors:
- Check Public Key, Service ID, and Template ID are correct
- Check Gmail is properly connected in Email.js dashboard
- Make sure you haven't exceeded 200 emails/month (shows in Email.js dashboard)
