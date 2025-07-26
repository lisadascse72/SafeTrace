# 🛡️ SafeTrace — Emergency SOS & Women Safety Web App

**SafeTrace** is a real-time emergency response web application built to enhance public safety, especially during emergencies and women's safety incidents. With just one click, users can send live location alerts to admins for quick intervention.

---

## 🚀 Features

- 🔴 **Emergency SOS**: One-click SOS trigger that captures real-time location, name, phone, and timestamp.
- 🟣 **Women Safety Mode**: Dedicated route to send women safety alerts instantly with location.
- 📍 **Admin Dashboard**: Real-time dashboard showing all SOS & safety alerts with reverse-geocoded location and Google Maps links.
- 🔔 **Auto Alerts**: Triggers an alarm sound for new incoming SOS alerts.
- ✔️ **Resolve Button**: Admins can resolve SOS requests and delete them from the dashboard.

---

## 🧑‍💻 Tech Stack

- **Frontend**: HTML, CSS, Vanilla JavaScript  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB Atlas  
- **APIs Used**: 
  - [OpenStreetMap Nominatim API](https://nominatim.openstreetmap.org/) (for reverse geocoding)

---

## 🌐 Live Deployment

- ⚙️ **Render**: [https://safetrace-deploy.onrender.com](https://safetrace-deploy.onrender.com)
- 📊 **Admin Dashboard**: [https://safetrace-deploy.onrender.com/admin.html](https://safetrace-deploy.onrender.com/admin.html)

---

## 🧪 Usage & How It Works

1. **User side** (`index.html`):
   - Enters name & phone, taps SOS → triggers `/sos` or `/track` POST API.
   - Sends geolocation to server.

2. **Server side** (`server.js`):
   - Stores alerts in MongoDB.
   - Serves frontend static files.
   - Provides `/alerts` API for dashboard.

3. **Admin side** (`admin.html`):
   - Polls `/alerts` every 3 seconds.
   - Displays SOS entries in a table.
   - Triggers alert sound when new data arrives.
   - Reverse geocodes coordinates to human-readable locations.

---

## 🛠️ Setup & Usage

### 1. Clone the repo:
```bash
git clone https://github.com/lisadascse72/SafeTrace.git
cd SafeTrace
pip install -r requirements.txt
# or
npm install


## 📄 License & Usage

This project is open for **educational** and **non-commercial** use only.

### ✅ You Can:
- Clone and modify it
- Use it in academic or hackathon projects

### ❌ You Cannot:
- Redistribute it for commercial purposes
- Claim it as your own without credit

> Please provide proper credit by linking back to this repository or mentioning the original author.

---

## 👤 Author

**🔗 Lisa Das**  
📦 GitHub Repository: [https://github.com/lisadascse72/SafeTrace](https://github.com/lisadascse72/SafeTrace)  
🌐 LinkedIn: [https://www.linkedin.com/in/lisa-das-9aab0a244](https://www.linkedin.com/in/lisa-das-9aab0a244)

---

### 🚫 Disclaimer
This tool is **not a substitute** for professional emergency systems. Always contact official authorities in real-life emergencies.

