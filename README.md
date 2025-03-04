website Link : https://splendorous-dragon-ca5185.netlify.app/


Smart Home Management System
Overview
This project is a Smart Home Management System built using the MERN stack (MongoDB, Express.js, React.js, Node.js). The system allows users to manage and monitor various smart devices in their home. Since we don't have real-world data, we used dummy data for testing and demonstration purposes.

Tech Stack Used
MongoDB → For storing device data
Express.js → Backend API
React.js → Frontend UI
Node.js → Server-side logic
Postman → Used to test API requests and upload data
Features
✅ Add Smart Devices → Users can register devices like lights, fans, and sensors.
✅ Monitor Devices → View real-time status of connected devices.
✅ Control Devices → Toggle device states (on/off).
✅ API Testing with Postman → Used for debugging and data uploads.
✅ MongoDB Storage → Stores device information and user preferences.

Project Setup
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/smart-home.git
cd smart-home
2. Install Dependencies
Backend:

bash
Copy
Edit
cd backend
npm install
Frontend:

bash
Copy
Edit
cd frontend
npm install
3. Set Up MongoDB
Ensure MongoDB is installed and running.
Update your .env file with your MongoDB URI:
bash
Copy
Edit
MONGO_URI=mongodb://localhost:27017/smarthome
4. Run the Project
Backend:

bash
Copy
Edit
npm start
Frontend:

bash
Copy
Edit
npm start
API Endpoints (Tested in Postman)
Method	Endpoint	Description
GET	/api/devices	Get all smart devices
POST	/api/devices	Add a new device
PUT	/api/devices/:id	Update device state
DELETE	/api/devices/:id	Remove a device
Screenshots
📌 Dummy Data Example (Uploaded via Postman)
(Insert screenshots of Postman requests and MongoDB collections here.)

📌 Smart Home Dashboard UI
(Insert UI screenshots here.)

Future Improvements
🔹 Real-world device integration (IoT)
🔹 User authentication
🔹 Voice command support

Contributors
Your Name (GitHub Profile)
