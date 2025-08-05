This repository contains the **Community Tab** code that will be integrated as:
1. A tab on the main website
2. A feature within the mobile app

The Community Tab allows users to:
- Create text posts with optional background colors
- Upload up to 4 images per post
- Create polls with multiple options
- Dynamically change UI based on user interactions

---

## Features

- **Conditional UI logic**
  - Background color picker shows only if there are no images and poll mode is off
  - Poll creation hides the background color picker but allows images
  - Adding an image hides the background color picker
- **Image uploads** (max 4)
- **Poll creation**
  - Add multiple options
  - Set expiration
- Responsive design for both web and mobile integration

---

## Tech Stack

- React (or framework used)
- HTML/CSS/JavaScript
- Node.js (for local dev)
- API/Backend (if connected)

---

## Getting Started (Local Development)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/community-tab.git
cd community-tab
2. Install dependencies
bash
Copy
Edit
npm install
3. Start the development server
bash
Copy
Edit
npm run dev
or

bash
Copy
Edit
npm start
The app will be available at:

arduino
Copy
Edit
http://localhost:3000
(or the port shown in the terminal)

Integration Notes
Web
Import the Community Tab component into the designated tab/page of your site

Ensure your CSS matches your website theme

Mobile App
If using React Native or a hybrid framework, adapt the components for mobile compatibility

Ensure image upload and poll logic integrates with your app’s backend

TODO
Connect to backend to store posts and polls

Add vote tracking and result display

Add moderation tools for posts and polls

Enable edit/delete functionality
