# Email.js Debugging Guide

If you're not receiving emails, follow these steps to troubleshoot:

## Step 1: Check Browser Console
1. Open your browser's Developer Tools (F12 or Right-click → Inspect)
2. Go to the **Console** tab
3. Try approving/rejecting an application
4. Look for these messages:

### ✅ Success Messages:
```
Email.js Public Key loaded: ✓ Present
📧 Sending Email:
  Service ID: ✓ Present
  Template ID: ✓ Present
  To: applicant@example.com
  Action: approved
✅ Email sent successfully: {status: 200, ...}
```

### ❌ Error Messages & Fixes:

**Error: "Public Key loaded: ✗ Missing"**
- Fix: Add `VITE_EMAILJS_PUBLIC_KEY` to `.env.local`
- Restart dev server after changes

**Error: "Service ID: ✗ Missing" or "Template ID: ✗ Missing"**
- Fix: Add the missing variables to `.env.local`:
  - `VITE_EMAILJS_SERVICE_ID=your_service_id`
  - `VITE_EMAILJS_TEMPLATE_ACCEPTANCE=your_template_id`
  - `VITE_EMAILJS_TEMPLATE_REJECTION=your_template_id`
- Restart dev server

**Error: "Invalid credentials" or "Unauthorized"**
- The Public Key/Service ID combination is wrong
- Go to https://dashboard.emailjs.com and verify your IDs

**Error: "Invalid template id"**
- The Template ID doesn't exist
- Go to https://dashboard.emailjs.com/admin/templates
- Copy the correct Template ID

## Step 2: Verify Email.js Setup

### Check Service Connection:
1. Go to https://dashboard.emailjs.com
2. Click **Email Services** 
3. Verify Gmail is connected and enabled ✓

### Check Templates Exist:
1. Go to https://dashboard.emailjs.com/admin/templates
2. Create 2 templates if they don't exist:
   - **ACCEPTANCE** template
   - **REJECTION** template
3. Each template should use these variables:
   - `{{to_email}}` - recipient email
   - `{{to_name}}` - recipient name
   - `{{message}}` - admin's custom message
   - `{{status}}` - "Approved" or "Rejected"

### Test Template in Email.js Dashboard:
1. Go to Email Templates
2. Click your ACCEPTANCE template
3. Click **Send Test Email**
4. Enter a test email address
5. If you receive the test email, templates work! ✓

## Step 3: Check .env.local Format

Your `.env.local` should look like:
```
VITE_EMAILJS_PUBLIC_KEY=yYour_actual_key_here
VITE_EMAILJS_SERVICE_ID=service_xxx123xxx
VITE_EMAILJS_TEMPLATE_ACCEPTANCE=template_abc456
VITE_EMAILJS_TEMPLATE_REJECTION=template_def789
```

### Common Issues:
- ❌ Using quotes: `VITE_EMAILJS_PUBLIC_KEY="key"` (wrong)
- ✅ No quotes: `VITE_EMAILJS_PUBLIC_KEY=key` (correct)
- ❌ Spaces: `VITE_EMAILJS_PUBLIC_KEY = key` (wrong)
- ✅ No spaces: `VITE_EMAILJS_PUBLIC_KEY=key` (correct)

## Step 4: Restart Dev Server

After updating `.env.local`:
1. Stop your Vite dev server (Ctrl+C)
2. Run: `npm run dev`
3. Try approving/rejecting again

## Step 5: Check Network Tab

1. Open Developer Tools (F12)
2. Go to **Network** tab
3. Try approving/rejecting an application
4. Look for a request to `api.emailjs.com`
5. Check the response:
   - **Status 200**: Email sent ✓
   - **Status 401/403**: Auth issue (check public key)
   - **Status 400**: Bad request (check template variables)

## Step 6: Email.js Limits

Check you haven't exceeded limits:
1. Go to https://dashboard.emailjs.com
2. Look at your plan usage
3. Free tier: 200 emails/month

## Common Issues Summary:

| Issue | Cause | Solution |
|-------|-------|----------|
| No email after 5 mins | Config issue | Check console logs, restart server |
| "Invalid credentials" | Wrong keys | Copy exact IDs from Email.js dashboard |
| "Invalid template" | Template doesn't exist | Create template in Email.js |
| Appears to send but no email | Template broken | Test template in Email.js dashboard |
| No console logs at all | Vite not reloaded | Restart dev server |

## Still Not Working?

Try this test:
1. Go to https://www.emailjs.com/docs/rest-api/send/
2. Copy the curl example
3. Replace with your actual keys
4. Run it in terminal
5. This isolates if it's an Email.js issue or code issue

Or share the console errors and I can help debug!
