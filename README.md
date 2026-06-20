# VolunteerHub — NayePankh Foundation

VolunteerHub is a full-stack web application designed to streamline volunteer management and event registration for the NayePankh Foundation. The system allows users to view upcoming community events, register for available slots with real-time capacity tracking, and provides administrative controls for managing event listings.

## 🚀 Live Demo

* **Live Website (Frontend):** (https://bespoke-dusk-e49300.netlify.app/)
* **Backend API Service:** (https://volunteer-system-backend.onrender.com)

---

## ✨ Features

* **Real-Time Slot Management:** Automatically decreases available slots when a volunteer registers for an event, preventing over-booking.
* **Admin Dashboard:** Secure administrative capabilities to create and delete events directly via backend configurations.
* **Dynamic Event Tracking:** Displays total counts of active events and registered volunteers instantly on the user dashboard.
* **Responsive User Interface:** Clean, modern single-page UI built for seamless navigation across desktop and mobile devices.

---

## 🛠️ Tech Stack

* **Frontend:** HTML5, CSS3 (Modern custom variables, responsive grid systems), JavaScript (Asynchronous Fetch API)
* **Backend:** Node.js, Express.js
* **Database:** SQLite (`better-sqlite3`)
* **Hosting & Deployment:** Netlify (Frontend), Render (Backend API Service)

---

## 📂 Project Structure

```text
├── backend/
│   ├── routes/
│   │   ├── auth.js            # Authentication routes
│   │   ├── events.js          # Event management and registration logic
│   │   └── volunteers.js      # Volunteer tracking routes
│   ├── middleware/
│   │   └── auth.js            # Authorization guards
│   ├── db.js                  # Database initialization and schema setup
│   ├── server.js              # Express server entry point
│   └── package.json           # Backend dependencies and scripts
└── index.html                 # Frontend user interface

⚙️ Local Setup Instructions
To run this project locally on your machine, follow these steps:

Prerequisites
Node.js installed on your computer.

Steps
Clone the repository:

Bash


git clone [PASTE_YOUR_GITHUB_REPOSITORY_URL_HERE]
cd volunteer-system-backend
Navigate to the backend directory and install dependencies:

Bash


cd backend
npm install
Set up your environment variables:
Create a .env file inside the backend folder and define your port:

Plaintext


PORT=3000
Start the local server:

Bash


node server.js
Launch the interface:
Open the index.html file in any modern web browser to interact with the system locally.


### How to add this to your GitHub right now:
1. Go to your repository page on **GitHub.com**.
2. Click the **Add file** button near the top right and select **Create new file**.
3. Name the file exactly **`README.md`**.
4. Paste the text from above into the text area. 
5. Replace the placeholder brackets like `[PASTE_YOUR_NETLIFY_LINK_HERE]` with your actual links so people can test it.
6. Scroll down to the bottom and click **Commit changes**.

Once this is saved, your GitHub page will transform into a professional-looking project presentation. Your project is completely wrapped up and ready for evaluation!
