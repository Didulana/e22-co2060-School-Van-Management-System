---
layout: home
permalink: index.html
repository-name: e22-co2060-School-Van-Management-System
title: School Transport Vehicle Management System
---

# School Transport Vehicle Management System

#### Table of Contents
1. [Introduction](#introduction)
2. [Solution Architecture](#solution-architecture)
3. [Software Design](#software-design)
4. [Key Features](#key-features)
5. [Testing](#testing)
6. [Conclusion](#conclusion)
7. [Links](#links)

---

## Introduction

School transport is a critical daily concern for thousands of parents — yet real-time visibility into a child's journey from home to school and back has historically been limited to phone calls or unreliable notifications. Delays, route changes, and safety incidents often go unreported in time for parents to act.

The **School Transport Vehicle Management System** addresses this challenge by providing a unified, real-time platform for tracking school vans, managing journeys, and enabling instant communication between **parents**, **drivers**, and **school administrators**.

The system removes uncertainty from the school run by:
- Giving parents **live GPS tracking** of their child's van directly from a web or mobile dashboard
- Alerting parents instantly when their child **boards or alights**
- Enabling drivers to **manage student attendance** and broadcast route announcements
- Allowing administrators to **oversee all routes, drivers, vehicles, and payment records**
- Preserving the **last known location** of a van even when the driver's network connection drops

This project was developed as part of the CO2060 Design Project module at the Faculty of Engineering, University of Peradeniya.

---

## Solution Architecture

The system follows a **three-tier architecture** built on the PERN stack (PostgreSQL, Express.js, React, Node.js), with an additional React Native mobile application for parents and drivers.

```
┌─────────────────────────────────────────────────┐
│                  Presentation Layer              │
│   React Web App (Admin/Driver)  │  React Native  │
│                                 │   Mobile App   │
│                                 │ (Parent/Driver)│
└───────────────────┬─────────────────────────────┘
                    │ HTTPS / WebSocket
┌───────────────────▼─────────────────────────────┐
│              Application Layer                   │
│   Node.js + Express.js REST API                  │
│   Socket.io (Real-time location broadcasting)    │
│   JWT Auth  │  Rate Limiting  │  Nominatim API   │
└───────────────────┬─────────────────────────────┘
                    │ pg (node-postgres)
┌───────────────────▼─────────────────────────────┐
│              Data Layer                          │
│   PostgreSQL Database                            │
│   (Users, Journeys, Locations, Payments, etc.)   │
└─────────────────────────────────────────────────┘
```

**External Integrations:**
- **OpenStreetMap / Nominatim** — Reverse geocoding for Last Known Location city names
- **OSRM Routing** — Route polyline generation on the tracking map
- **Socket.io** — Bidirectional real-time communication for GPS telemetry

---

## Software Design

### Backend (Node.js + Express)

The backend exposes a RESTful API with WebSocket support:

| Module | Description |
|---|---|
| `authRoutes` | JWT-based authentication for parents, drivers, and admins |
| `parentRoutes` | Child management, tracking, notifications, absence marking |
| `trackingRoutes` | GPS location updates with rate limiting |
| `driverJourneyRoutes` | Journey start/end, student boarding/dropoff |
| `adminRoutes` | User, route, vehicle, and payment management |
| `reverseGeocodeService` | Cached city-name lookup via Nominatim with stop fallback |

The database schema covers: `users`, `students`, `drivers`, `routes`, `route_stops`, `journeys`, `journey_locations`, `student_boarding`, `student_dropoff`, `notifications`, `payments`, and `vehicles`.

### Frontend Web App (React + Vite + Tailwind CSS)

Role-based dashboards for three user types:
- **Parent Dashboard** — Live tracking map (Leaflet.js), child status cards with last known city, notifications, fee management
- **Driver Dashboard** — Trip controls, student attendance scanner, SOS alert, route announcements
- **Admin Dashboard** — Full fleet, driver, route, and payment oversight

### Mobile App (Expo / React Native)

- Parent home screen with real-time map and child boarding alerts
- Driver GPS background tracking using `expo-location`
- Push-style alerts for SOS events and student status changes

---

## Key Features

| Feature | Description |
|---|---|
| 🗺️ **Live GPS Tracking** | Parents see the van's real-time position on an interactive map |
| 📍 **Last Known Location** | When the driver's connection drops, the last GPS ping and city name remain visible to parents with an offline indicator |
| 🔔 **Instant Alerts** | Boarding/dropoff events notify parents in real-time via WebSocket |
| 🚨 **SOS Emergency Alert** | Driver can trigger an emergency alert to all parents with one tap |
| 📵 **Absence Management** | Parents can mark children absent; drivers are notified immediately |
| 💳 **Payment Tracking** | Monthly fee dues, receipt uploads, and admin approval flow |
| 👤 **Role-Based Access** | Separate flows for Parents, Drivers, and Admins secured with JWT |
| 📡 **Background GPS** | Driver's phone continues broadcasting even when the app is backgrounded |

---

## Testing

The project includes an automated test suite using **Jest** and **Supertest** covering:

- Authentication route validation (login, registration, token expiry)
- Location update endpoint schema validation
- Journey status state machine tests
- Notification unread count integrity
- Admin service unit tests

**Test Results (latest run):**
- ✅ 6 test suites passed
- ✅ 12 test cases passed
- ⏱️ ~23 seconds total runtime

TypeScript strict compilation passes cleanly on both the backend (`tsc --noEmit`) and the frontend with zero errors.

---

## Conclusion

The School Transport Vehicle Management System successfully delivers a real-time, multi-role school transport coordination platform. Key achievements include:

- **End-to-end real-time tracking** with sub-second latency via Socket.io
- **Resilient offline mode** — parents always see the last known van location and city name when driver connectivity drops
- **Cross-platform reach** — web dashboard for administrators and a mobile app for parents and drivers
- **Clean architecture** — modular backend, typed APIs, and a role-based access control model

**Future Development Opportunities:**
- Push notification integration (FCM / APNs) for true background alerts
- Automated route optimization based on student pickup clusters
- Historical route playback for journey auditing
- In-app chat between drivers and parents

---

## Links

- [Project Repository](https://github.com/cepdnaclk/e22-co2060-School-Van-Management-System){:target="_blank"}
- [Project Page](https://cepdnaclk.github.io/e22-co2060-School-Van-Management-System){:target="_blank"}
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)
- [University of Peradeniya](https://eng.pdn.ac.lk/)

[//]: # (Please refer this to learn more about Markdown syntax)
[//]: # (https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

