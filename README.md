# School Transport Vehicle Management System (KidsRoute)

A web-based school transport management and real-time tracking system developed using the **PERN stack (PostgreSQL, Express, React, Node.js)**.

This repository contains the source code and documentation for the project, which is being developed as part of an academic software project.

---

## 📌 Project Description

The School Transport Vehicle Management System aims to improve the safety, transparency, and efficiency of school transportation by providing real-time vehicle tracking, journey management, and seamless communication between schools, drivers, and parents.

---

## ✨ Key Features

* **Real-Time GPS Tracking**: Parents can monitor the exact location of the school van during its journey.
* **Multi-Child Monitoring**: Dedicated dashboards to seamlessly track and manage transportation for multiple children.
* **Automated Attendance**: Drivers can instantly record student boarding and drop-off logs.
* **Live Notifications & SOS**: Instant alerts and announcements for parents and drivers during delays or emergencies.

---

## 🧱 High-Level Architecture

The system is designed as a web application following a three-tier architecture, utilizing WebSockets for real-time capabilities.

![System Architecture](docs/images/architecture.png)

* **Frontend:** React (Vite) single-page applications for Parents, Drivers, and Admins.
* **Backend:** Node.js with Express providing REST APIs and Socket.io for live tracking.
* **Database:** PostgreSQL (Supabase) for persistent data storage.

---

## ⚙️ Technology Stack

* **Frontend**: React, TypeScript, Tailwind CSS, Leaflet
* **Backend**: Node.js, Express, Socket.io
* **Database**: PostgreSQL (Supabase)
* **Version Control**: Git & GitHub

---

## 📁 Repository Structure

```text
root/
│
├── code/
│   ├── backend/       # Express server and APIs
│   └── frontend/      # React web application
├── docs/              # GitHub Pages documentation and assets
└── README.md
```

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/cepdnaclk/e22-co2060-School-Van-Management-System.git

# Switch to develop branch
git checkout develop
```

Detailed setup, API documentation, and contribution guidelines are available in the project documentation.

---

## 📄 Links & Resources

* [Project Documentation Site](https://cepdnaclk.github.io/e22-co2060-School-Van-Management-System/)
* [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)

---

### Project Team (Team AlphaWolves)
* E/22/214 – H.D. Lokugamage
* E/22/354 – K.A.H.G.D. Sandeepa
* E/22/372 – K.I. Sewmini
* E/22/127 – S.I. Gunawardhana
