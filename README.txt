TK OFFICE MANAGER v5
====================

Offline Multi-Page Work & Client Management Software
---------------------------------------------------

This software is built for auditor offices, consultants, and tax practitioners.
Works fully offline using HTML + JavaScript + localStorage.

Folder Structure
----------------
TK_Office_Manager_v5/
│
├── login.html
├── dashboard.html
├── clients.html
├── works.html
├── accounts.html
├── files.html
├── settings.html
│
├── app.js
├── style.css
├── icons.svg
│
└── README.txt


Login Credentials
-----------------
Username: admin
Password: tk1234
(This cannot be changed – fixed for offline mode)


How To Use
----------

1) Open login.html in Chrome.
2) Enter the password and login.
3) Use the left sidebar to navigate between modules.

Modules Overview
----------------

1) Dashboard
   - Pending works count
   - Due Today
   - Next 7 Days
   - Overdue list count
   - Fees Today / Week / Month
   - Expenses Today / Week / Month

2) Clients
   - Add client
   - Monthly GST client toggle
   - Search clients
   - Delete client

3) Works
   - Add work for a client
   - Auto GST generator (GSTR-1 and GSTR-3B)
   - Pending works sorted by due date
   - Completed works sorted by completed date
   - Mark Done (fee received / not received logic)
   - Edit work

4) Accounts
   - Fees received entry
   - Expenses entry
   - Cashbook (Receipts and Payments combined)
   - Monthly summary (Fees, Expenses, Profit)
   - Export CSV

5) Files (Physical File Register)
   - Auto file numbers: F-001, F-002...
   - Location and status
   - Notes
   - Delete file

6) Settings
   - Download Backup (JSON)
   - Restore Backup
   - Application info

Backup & Restore
----------------
Backup:
   Settings → Download Backup
   Saves file: TK_Office_Manager_v5_Backup.json

Restore:
   Settings → Upload Backup JSON → Restore

IMPORTANT:
Restoring a backup replaces all current data.


Moving Software to Another Computer
-----------------------------------
Copy the entire folder:
   TK_Office_Manager_v5/
Paste into the new computer.
Open login.html in Chrome.
All data will load automatically (if inside same computer).

For another computer:
Use Backup → Restore.


Converting to Online Version (Future)
-------------------------------------
All pages can be uploaded to a hosting service like:
   Netlify / GitHub Pages / Firebase Hosting

Works easily because:
   – Multi-page structure
   – Modular JS
   – Offline localStorage friendly


Support
-------
Developed by ChatGPT (AI) with your customization.
Contact: You (Thirumalaikumar).
Version: v5.0

