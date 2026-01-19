# Firestore Applications Dashboard Setup

## Overview

Your application form now stores all submissions in **Firebase Firestore** and displays them in a beautiful admin dashboard. No emails needed!

**Features:**
- ✅ All applications stored in real-time Firestore database
- ✅ Admin dashboard to view, filter, and manage applications
- ✅ Download applications as CSV
- ✅ Change application status (pending, approved, rejected)
- ✅ View full application details
- ✅ Completely free with Firebase

## How It Works

1. **User submits form** → Data saves to Firestore instantly
2. **You access dashboard** → See all applications in real-time
3. **Manage applications** → Change status, filter, download data

## Setup Instructions

### Step 1: Enable Firestore in Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `united-earth-labs`
3. Go to **Firestore Database** in the left sidebar
4. Click **"Create database"**
5. Select **"Start in production mode"**
6. Choose region: **us-central1** (or closest to you)
7. Click **"Enable"**

### Step 2: Set Firestore Rules (IMPORTANT!)

1. In Firebase Console, go to **Firestore Database** → **Rules**
2. Replace the existing rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow anyone to create applications
    match /applications/{document=**} {
      allow create: if request.auth == null || request.auth != null;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

3. Click **"Publish"**

### Step 3: Access the Admin Dashboard

The dashboard is accessible at:
```
http://localhost:5173#admin
```

Or in production:
```
https://your-domain.com#admin
```

Just add `#admin` to your URL and the dashboard will load!

> **Note**: You can add authentication later to protect the dashboard with a password. For now, it's accessible to anyone with the URL.

### Step 4: Test Everything

1. **Run your dev server:**
   ```bash
   npm run dev
   ```

2. **Fill out the application form** and submit
3. **Visit the dashboard:** http://localhost:5173#admin
4. **See your application** appear instantly!

## Dashboard Features

### View Applications
- See all applications in a table format
- View full details by clicking the eye icon
- Search/filter by status (pending, approved, rejected)

### Manage Applications
- **Change Status:** Click the status dropdown to mark as pending, approved, or rejected
- **Delete Application:** Click the X button to remove
- **View Details:** Click the eye icon to see full information in a modal

### Export Data
- **Download CSV:** Click "Download CSV" to export all applications as a spreadsheet
- Includes all fields: name, email, age, contact, background, experience, skills, reason to join, ideas, time dedication, availability, status, and submission date

### Real-time Updates
- Dashboard updates instantly when new applications come in
- No need to refresh - changes happen automatically

## Form Simplification

The application form no longer requires:
- ❌ Gmail app password
- ❌ Any external email setup

Now it just:
- ✅ Takes basic applicant info
- ✅ Validates the form
- ✅ Saves to Firestore
- ✅ Shows success message

## Admin Dashboard Security

Currently, the dashboard is accessible via `#admin` URL hash. For production, you can:

1. **Add Password Protection:**
   - Create a simple login page
   - Store admin credentials in Firebase Auth
   - Only show dashboard after login

2. **Use Authentication:**
   - Set up Firebase Auth with email/password
   - Require users to authenticate before viewing dashboard

3. **Environment Variables:**
   - Store admin access tokens
   - Verify on component load

## Firestore Database Structure

Applications are stored in Firestore with this structure:

```
applications/
├── document-id-1/
│   ├── name: "John Doe"
│   ├── email: "john@example.com"
│   ├── age: "25"
│   ├── contactNumber: "+1234567890"
│   ├── background: "Computer Science degree"
│   ├── experience: "5 years"
│   ├── skills: "Python, JavaScript, React"
│   ├── reasonToJoin: "Want to contribute..."
│   ├── innovativeIdeas: "I think we should..."
│   ├── timeDedication: "full-time"
│   ├── availability: "Immediately"
│   ├── status: "pending"
│   └── submittedAt: Timestamp
└── document-id-2/
    └── ...
```

## Troubleshooting

### "Permission denied" error when saving applications
- Check Firestore Rules
- Make sure you published the rules
- Verify Firestore is enabled in Firebase

### Dashboard not loading at #admin
- Clear browser cache
- Check browser console for errors
- Verify Firestore database is created
- Check that you're using the correct project ID

### Applications not appearing in dashboard
- Refresh the page
- Check Firestore console to see if data was saved
- Verify Firestore Rules allow reads

### Cannot change application status
- Make sure Firestore Rules allow update operations
- Check browser console for errors

## Next Steps

### Optional: Add Authentication
Create a login page for admin dashboard:
```javascript
// Add Firebase Auth
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Create login component
// Only show dashboard after authentication
```

### Optional: Send Email Notifications
Add SendGrid or Mailgun webhook to send you notification emails when new applications arrive:
```javascript
// Add Cloud Function to send email on new application
// Trigger on `applications` collection write
```

### Optional: Auto-Response Emails
Send confirmation emails to applicants:
```javascript
// Add Cloud Function to email applicant
// Trigger on form submission
```

## File Structure

```
src/
├── App.jsx                          # Main app with dashboard routing
├── firebaseConfig.js                # Firebase config with Firestore
├── components/
│   ├── ApplicationForm.jsx          # Updated form (no Gmail password)
│   ├── AdminDashboard.jsx           # Dashboard component
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   └── ...other components
```

## FAQ

**Q: Is Firestore really free?**
A: Yes! Firestore has a generous free tier:
- 1 GB stored data
- 50K read operations/day
- 20K write operations/day
- 20K delete operations/day

**Q: How do I backup my applications?**
A: Download the CSV from the dashboard or export from Firebase Console

**Q: Can I share the dashboard with my team?**
A: Yes! Anyone with the URL can access it. Add authentication to restrict access.

**Q: What happens when I exceed free tier limits?**
A: You'll get a notification. Pay-as-you-go pricing is very affordable.

**Q: Can I delete old applications?**
A: Yes! Click the X button on any application row to delete it.

---

**That's it! Your applications system is now live!** 🎉

All applications will be saved to Firestore in real-time and you can manage them from the dashboard.
