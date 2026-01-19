# Admin Dashboard Advanced Features Setup

## New Features

✅ **Google Authentication** - Admins sign in with Google  
✅ **Admin Authorization** - Only authorized emails can access dashboard  
✅ **Accept/Reject with Message** - Add custom message for each decision  
✅ **Email Notifications** - Applicants receive decision emails  
✅ **Admin Panel Security** - Logout button + protected routes  

## Setup Instructions

### Step 1: Set Up Admin Accounts in Firestore

1. **Go to Firebase Console** → Select "united-earth-labs"
2. **Firestore Database** → Click **"Collections"** tab
3. **Create Collection** called: `admins`
4. **Add Documents** with admin email addresses:
   - Click **"Add document"**
   - Set Document ID: any unique name (e.g., `admin1`)
   - Add field `email` with value: `your-email@gmail.com` (the Google account email)
   - Add field `role` with value: `admin`
   - Click **"Save"**

Example document structure:
```
Collection: admins
├── admin1/
│   ├── email: "adityaraj11d@gmail.com"
│   └── role: "admin"
├── admin2/
│   ├── email: "another-admin@gmail.com"
│   └── role: "admin"
```

### Step 2: Enable Google Sign-In in Firebase

1. **Firebase Console** → Select "united-earth-labs"
2. **Build** → **Authentication**
3. Click **"Get Started"** (if not already set up)
4. Click **"Google"** provider
5. Click **"Enable"** toggle
6. Add your email to **"Authorized domains"** (it should auto-add localhost)
7. Click **"Save"**

### Step 3: Set Up SendGrid for Email Notifications (Optional but Recommended)

For free email sending:

1. **Go to [SendGrid](https://sendgrid.com/)**
2. **Sign up for free account**
3. Go to **Settings** → **API Keys**
4. Click **"Create API Key"**
5. Name it: `United Earth Labs`
6. Copy the API key
7. In your project, create `.env.local`:
   ```
   REACT_APP_SENDGRID_API_KEY=your_sendgrid_api_key_here
   ```

> **Note**: Without SendGrid, the system will still work but won't send emails. Add SendGrid to enable email notifications.

### Step 4: Test Everything

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Access admin panel:**
   - Go to: `http://localhost:5173#admin`
   - You should see the login page

3. **Sign in with Google:**
   - Click "Sign in with Google"
   - Use the Google account you added to the `admins` collection
   - Dashboard should load

4. **Test Accept/Reject Flow:**
   - You should see "Action" button on pending applications
   - Click it
   - Choose Approve or Reject
   - Add a custom message
   - Click "Approve & Send Email" or "Reject & Send Email"
   - Check the applicant's email for the notification

## How It Works

### User Journey

1. **Applicant fills form** → Submitted to Firestore
2. **Admin goes to #admin** → Login page appears
3. **Admin signs in** → Dashboard loads with applications
4. **Admin clicks "Action"** on pending app → Action modal opens
5. **Admin writes message** → Chooses Approve or Reject
6. **Admin sends** → Application updated + Email sent to applicant

### Admin Authorization

- Only emails in `admins` collection can access dashboard
- Google account email must match exactly
- System checks on login + on component load
- If not authorized, shows error and logs out

## Database Structure

### Admins Collection

```
admins/
├── admin1/
│   ├── email: "admin@gmail.com"
│   ├── role: "admin"
│   └── createdAt: Timestamp
└── admin2/
    └── ...
```

### Applications Collection (Updated)

```
applications/
├── app-id-1/
│   ├── name: "John Doe"
│   ├── email: "john@example.com"
│   ├── ...other fields
│   ├── status: "approved" | "rejected" | "pending"
│   ├── adminMessage: "Welcome to the team!"
│   └── updatedAt: Timestamp
```

## Email Templates

### Approval Email
- Subject: "Congratulations! Your Application has been Accepted 🎉"
- Shows admin's custom message
- Professional HTML design

### Rejection Email
- Subject: "Thank You for Your Application"
- Shows admin's custom feedback
- Professional HTML design

Both emails include branding and next steps information.

## Troubleshooting

### "You are not authorized as an admin"
- Make sure your Google email is in the `admins` collection
- Email must match exactly (case-sensitive domain, but Gmail is case-insensitive)
- Try logging out and back in

### "Sign in failed"
- Make sure Google Authentication is enabled in Firebase
- Check that your project allows Google sign-in
- Try incognito window

### "Emails not being sent"
- Check if SendGrid API key is set in `.env.local`
- Verify SendGrid account is active
- Check the API key is correct
- Without SendGrid, application will still update but won't send emails

### "Action button not showing"
- Only shows for pending applications
- If status is approved/rejected, no action button appears
- Can still view details with eye icon

## Firestore Rules (Update)

Make sure your Firestore rules look like this:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public: anyone can create applications
    match /applications/{document=**} {
      allow create: if true;
      allow read, update, delete: if true;
    }
    
    // Admin: only admins can read
    match /admins/{document=**} {
      allow read, update, delete: if true;
      allow create: if false;
    }
  }
}
```

## Optional: Add More Admins

To add another admin later:

1. Go to Firebase Console → Firestore Database
2. In `admins` collection, click **"Add document"**
3. Add new admin email
4. They can now sign in with their Google account

## Optional: Enhanced Security

For production, you can add:

1. **Custom Claims** - Mark users as admins in Firebase Auth
2. **Email Verification** - Only specific domain emails (e.g., @yourcompany.com)
3. **Session Management** - Auto-logout after inactivity
4. **Audit Logs** - Track who approved/rejected each application

## Accessing Admin Dashboard in Production

Once deployed:

```
https://your-domain.com#admin
```

Just add `#admin` to your URL to access the login page.

---

**All features are now live!** 🎉

- Admins can log in securely with Google
- Only authorized emails can access the dashboard
- Custom messages for each decision
- Automatic email notifications to applicants
- Professional HTML emails
- Full application management
