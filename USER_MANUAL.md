# KidsRoute — User Manual & Operating Guide
**Real-Time School Van Management & Telemetry System**  
*Department of Computer Engineering, Faculty of Engineering, University of Peradeniya*  
*CO2060 Software Systems Development Project — Academic Evaluation*  
*Engineered by Team AlphaWolves*

---

> [!NOTE]
> The full, formatted documentation and assets are maintained in the [`docs/`](docs/) directory.  
> You can also view the complete manual online or directly in [`docs/USER_MANUAL.md`](docs/USER_MANUAL.md).

---

## 📋 Table of Contents
1. [Introduction & System Overview](#1-introduction--system-overview)
2. [System Architecture & Core Concepts](#2-system-architecture--core-concepts)
3. [System Access & Technical Requirements](#3-system-access--technical-requirements)
4. [Authentication & Account Management](#4-authentication--account-management)
5. [Parent User Guide](#5-parent-user-guide)
   - 5.1 [Parent Dashboard](#51-parent-dashboard)
   - 5.2 [Managing Children & Pickups](#52-managing-children--pickups)
   - 5.3 [Live GPS Tracking & Telemetry](#53-live-gps-tracking--telemetry)
   - 5.4 [Absence & Leave Reporting](#54-absence--leave-reporting)
   - 5.5 [Journey History & Attendance Logs](#55-journey-history--attendance-logs)
   - 5.6 [Fee Payments & Bank Slips](#56-fee-payments--bank-slips)
6. [Driver User Guide](#6-driver-user-guide)
   - 6.1 [Driver Onboarding & Setup](#61-driver-onboarding--setup)
   - 6.2 [Driver Dashboard & Journey Controls](#62-driver-dashboard--journey-controls)
   - 6.3 [Live Telemetry Broadcasting](#63-live-telemetry-broadcasting)
   - 6.4 [Passenger Attendance Manifest](#64-passenger-attendance-manifest)
   - 6.5 [Emergency SOS & Broadcast Announcements](#65-emergency-sos--broadcast-announcements)
   - 6.6 [Student Fee Collection & Management](#66-student-fee-collection--management)
7. [Administrator User Guide](#7-administrator-user-guide)
   - 7.1 [Admin Dashboard & System KPIs](#71-admin-dashboard--system-kpis)
   - 7.2 [Driver Approvals & User Auditing](#72-driver-approvals--user-auditing)
   - 7.3 [Vehicle & Fleet Management](#73-vehicle--fleet-management)
   - 7.4 [School Directory Management](#74-school-directory-management)
   - 7.5 [Route Configuration & Geocoding](#75-route-configuration--geocoding)
8. [Offline Resiliency & Telemetry Fail-Safes](#8-offline-resiliency--telemetry-fail-safes)
9. [Frequently Asked Questions & Troubleshooting](#9-frequently-asked-questions--troubleshooting)
10. [Academic & Team Attribution](#10-academic--team-attribution)

---

## 1. Introduction & System Overview

### 1.1 The Challenge
In Sri Lanka, school transportation has traditionally relied on fragmented, informal communication—phone calls, WhatsApp messaging while driving, and handwritten attendance notebooks. This leads to:
- **Severe anxiety for parents** who cannot ascertain their child's whereabouts during heavy morning/afternoon traffic.
- **Dangerous driver distractions** when drivers answer phone inquiries while operating vehicles on congested roadways.
- **Inefficient route scheduling** when children are absent without prior notice, forcing vans to make unnecessary detour stops.
- **Disputed attendance and payment tracking** across monthly transportation cycles.

### 1.2 The KidsRoute Solution
**KidsRoute** is an integrated, web-based real-time transport management platform designed to connect **Parents**, **School Van Drivers**, and **Educational Institutions** into a single cohesive ecosystem.

- **Real-Time Telemetry**: Real-time vehicle tracking on open-standard cartography (OpenStreetMap / Leaflet) using lightweight WebSockets.
- **Safety First**: One-tap driver attendance checklist (Boarded, Absent, Dropped Off) that immediately triggers parent notifications.
- **Emergency Protocols**: Instant SOS triggers and route-wide broadcast banners for traffic delays, inclement weather, or vehicle breakdowns.
- **Financial Transparency**: Built-in monthly fee tracking with bank transfer slip verification and cash collection receipts.

---

## 2. System Architecture & Core Concepts

KidsRoute follows a decoupled **Three-Tier Architecture** engineered for resilience under volatile 3G/4G connectivity:

```
+-------------------------------------------------------------------------+
|                              CLIENT TIER                                |
|  Marketing Website (/)  •  Web Portal (/portal)  •  PWA Mobile Friendly |
|  [React 19, TypeScript, Tailwind CSS, Leaflet, Socket.io-client]       |
+------------------------------------+------------------------------------+
                                     |  REST APIs (HTTPS) & WebSockets (WSS)
                                     v
+-------------------------------------------------------------------------+
|                            APPLICATION TIER                             |
|  Node.js + Express 5.2 API Gateway  •  Socket.io Real-Time Event Bus     |
|  JWT Authentication  •  Role Guard Middleware  •  Zod Validation Engine |
+------------------------------------+------------------------------------+
                                     |  SQL Connection Pool
                                     v
+-------------------------------------------------------------------------+
|                               DATA TIER                                 |
|  PostgreSQL Database (Supabase / Managed PostgreSQL)                   |
|  Tables: Users, Drivers, Vehicles, Routes, Journeys, Attendance, etc.   |
+-------------------------------------------------------------------------+
```

### 2.1 Core Terminology
- **Journey**: A single operational transit run operated by a driver. Can be classified as `MORNING` (home-to-school) or `AFTERNOON` (school-to-home).
- **Manifest**: The digital passenger checklist for an active journey, containing enrolled students, pickup orders, and current boarding states (`WAITING`, `BOARDED`, `ABSENT`, `DROPPED_OFF`).
- **Telemetry**: Real-time periodic packet transmitted by the driver device containing latitude, longitude, speed, heading, and timestamp.
- **Geofence / Waypoint**: Geocoded geographical coordinates marking a student's home pickup spot or school entrance.
- **SOS Broadcast**: High-priority alert triggered by a driver to notify all subscribed parents of an ongoing road hazard or mechanical breakdown.

---

## 3. System Access & Technical Requirements

### 3.1 Portal URLs
| Interface | URL Path | Intended Audience |
|---|---|---|
| **Marketing Website** | `/` | Prospective parents, drivers, university evaluators |
| **Portal Home / Auto-Redirect** | `/portal` | Automatically routes to user's assigned dashboard |
| **User Sign In** | `/portal/login` | Enrolled Parents & Approved Drivers |
| **User Registration** | `/portal/register` | New Parents & New Drivers |
| **Driver Pending Approval** | `/portal/pending-approval` | Drivers awaiting administrator credentials review |
| **Administrator Sign In** | `/portal/admin` | Authorized System Administrators only |

### 3.2 System Requirements
- **Web Browser**: Modern evergreen browsers supporting WebSockets and HTML5 Geolocation:
  - Google Chrome 100+ (Recommended)
  - Mozilla Firefox 100+
  - Apple Safari 15+ (iOS & macOS)
  - Microsoft Edge 100+
- **Driver Device**: Any smartphone or tablet running Android or iOS with GPS hardware enabled and cellular data connectivity.
- **Parent Device**: Any smartphone, tablet, laptop, or desktop computer with internet access.

---

## 4. Authentication & Account Management

### 4.1 Account Registration
1. Navigate to `/portal/register` or click **Sign Up** on the website header.
2. Select your account type: **Parent** or **Driver**.
3. Complete the registration form:
   - **Full Name**
   - **Email Address** (must be unique)
   - **Phone Number** (Sri Lankan format: `07XXXXXXXX`)
   - **Password** (minimum 6 characters)
4. Submit the form:
   - **Parents**: Redirected immediately to the **Parent Dashboard** (`/portal/parent`).
   - **Drivers**: Directed to the **Pending Approval Screen** (`/portal/pending-approval`). To preserve passenger safety, driver accounts require administrative verification of driving licenses and vehicle compliance before active dispatch.

```
       +---------------------------------------------+
       |             Registration Form               |
       +---------------------------------------------+
                              |
              +---------------+---------------+
              |                               |
       [ Role: Parent ]               [ Role: Driver ]
              |                               |
              v                               v
     Instant Activation           Awaiting Admin Approval
              |                               |
              v                               v
    /portal/parent Dashboard       /portal/pending-approval
```

### 4.2 Logging In & Role-Based Redirection
1. Open `/portal/login`.
2. Select the appropriate role tab: **Parent** or **Driver**.
3. Enter your registered email and password.
4. Click **Sign In**. The system validates your JWT token and redirects you:
   - `parent` → `/portal/parent`
   - `driver` (approved) → `/portal/driver`
   - `driver` (unapproved) → `/portal/pending-approval`
   - `admin` → `/portal/admin/dashboard`

> [!TIP]
> **Academic Evaluation Mode**: For rapid testing and grading, the Login Page provides 1-Click **Quick-Fill Demo** buttons (`Parent Demo: parent@test.com` and `Driver Demo: driver@test.com`). Click either pill to populate verified evaluation credentials instantly.

### 4.3 Administrator Authentication
The administrative back-office is partitioned from public authentication. Administrators authenticate at `/portal/admin` with designated privileged credentials.

### 4.4 Account Security & Profile Settings
Users can access their profile by clicking their avatar in the sidebar:
- **Profile (`/portal/profile`)**: Update name, emergency phone number, and residential address.
- **Settings (`/portal/settings`)**: Toggle notification channels (SMS / In-App) and modify account passwords.

---

## 5. Parent User Guide

The Parent Portal is engineered to minimize stress and eliminate uncertainty about your child's school transit.

### 5.1 Parent Dashboard (`/portal/parent`)
Upon signing in, parents are presented with the primary operations center:
- **Child Transit Cards**: Displays each enrolled child with their assigned driver, van registration number, and route name.
- **Live Status Indicator**:
  - `Van Idle / Scheduled`: The van has not yet begun the scheduled journey.
  - `Journey in Progress`: The driver has started the journey and is actively broadcasting telemetry.
  - `Completed`: The child has been safely dropped off.
- **Direct Action Buttons**:
  - **Live Tracking**: Launches the interactive map view.
  - **Mark Absence**: Submits advance leave notices to the driver.
  - **Call Driver**: Dial the driver's verified telephone number directly.

### 5.2 Managing Children & Pickups (`/portal/parent/children`)
Parents can enroll one or more children into the transit system:
1. Navigate to **My Children** in the sidebar.
2. Click **+ Add Child**.
3. Enter the student's information:
   - **Student Full Name**
   - **School**: Select from the approved school directory.
   - **Grade / Class**: e.g., Grade 7-B.
   - **Emergency Contact**: Secondary phone number for guardian backup.
   - **Pickup / Drop-off Address**: Residential address. Coordinates can be verified on the interactive pin-drop map.
4. Select the preferred **Assigned Van Route**.
5. Save the record. The student is immediately registered in the driver's route manifest.

### 5.3 Live GPS Tracking & Telemetry (`/portal/tracking`)
Clicking **Live Tracking** opens the real-time Leaflet map interface:
- **Van Location Pin**: Displays the custom school van icon moving along the roadway in real time as the driver transmits GPS fixes.
- **Route Path & Stops**: Renders planned pickup points, intermediate stops, and school destinations.
- **Telemetry HUD**: Displays current vehicle speed (km/h), distance to your child's stop, and estimated time of arrival (ETA).
- **Passenger Status Pill**: Shows your child's personal state in real time:
  - 🟡 `Waiting for Pickup` (Van en route to your stop)
  - 🟢 `Boarded & In Transit` (Child safely inside the van)
  - 🔵 `Safely Dropped Off` (Child delivered to school/home)

```
+--------------------------------------------------------------------------+
|  [ < Back ]  Live Van Tracking - Morning Run #04             [ LIVE ● ] |
+--------------------------------------------------------------------------+
|                                                                          |
|       [ Home Pickup: 7:05 AM ] ---> ( Van 🚎 ) ---> [ Kingswood College ] |
|                                                                          |
|       =================== MAP VIEW (OpenStreetMap) ==================    |
|                                                                          |
|                  📍 [Child Pickup Spot: 120m away]                       |
|                   \                                                      |
|                    \=====> 🚎 Van WP-NC-4821 (34 km/h)                   |
|                             \                                            |
|                              \=====> 🏫 Kingswood College                |
|                                                                          |
+--------------------------------------------------------------------------+
|  Telemetry: Speed: 34 km/h | ETA: 4 mins | Status: En Route              |
+--------------------------------------------------------------------------+
```

### 5.4 Absence & Leave Reporting
If your child is sick or will not be attending school, notify the driver with one click:
1. From the Parent Dashboard or Child Management page, click **Mark Absence**.
2. Select the affected date (single day or date range).
3. Select whether the absence applies to `Morning Run`, `Afternoon Run`, or `Full Day`.
4. (Optional) Provide a brief reason (e.g., *Fever*, *Family event*).
5. Submit the notice. The driver's manifest will immediately show your child as **Absent**, preventing unwanted stops and telephone inquiries.

### 5.5 Journey History & Attendance Logs (`/portal/parent/history`)
The history dashboard offers full auditability of all past trips:
- Comprehensive chronological table of every morning and afternoon trip.
- Exact recorded timestamps for **Boarded** and **Dropped Off**.
- Identity of the operating driver and vehicle license plate for that date.
- Exportable records for parental records and dispute resolution.

### 5.6 Fee Payments & Bank Slips (`/portal/parent/payments`)
KidsRoute eliminates paper receipts and cash handling confusion:
1. Navigate to **Payments** from the sidebar.
2. Review the monthly statement:
   - **Monthly Due Amount** (in LKR).
   - **Billing Month & Due Date**.
   - **Status Badge**: `PAID`, `PENDING`, or `OVERDUE`.
3. If paying via bank transfer:
   - Transfer the due amount to the driver's registered bank account displayed on the invoice card.
   - Click **Upload Bank Slip**.
   - Select an image or PDF of your bank deposit slip or mobile banking transfer receipt.
   - Click **Submit Payment Verification**.
4. Once the driver confirms receipt, your dashboard status automatically updates to **Verified & Paid**.

---

## 6. Driver User Guide

The Driver Portal is optimized for high-contrast visibility, large touch targets, and minimal distraction while operating a vehicle.

> [!WARNING]
> **Safety Notice**: Drivers must never interact with mobile screens while actively driving. Attendance updates and journey controls must only be operated when the vehicle is stationary at designated stops.

### 6.1 Driver Onboarding & Setup (`/portal/driver/onboarding`)
After administrative approval, drivers complete a one-time onboarding workflow:
1. **Vehicle Registration**:
   - Vehicle Make & Model (e.g., *Toyota HiAce 2018*)
   - Official License Plate Number (e.g., *WP-NB-8214*)
   - Seating Capacity (e.g., *14 Passengers*)
2. **Route Definition**:
   - Route Name (e.g., *Peradeniya - Kandy Schools Morning Route*)
   - Scheduled Departure Times (Morning & Afternoon)
   - Primary Destination Schools (e.g., *Kingswood, Dharmaraja, Girls' High School*)

### 6.2 Driver Dashboard & Journey Controls (`/portal/driver`)
The main dashboard gives drivers direct control over their daily trips:
- **Start Morning Journey**: Initializes the morning pickup run. Prompts for device GPS permission and establishes the WebSocket telemetry stream.
- **Start Afternoon Journey**: Initializes the afternoon school-dismissal return run.
- **End Journey**: Concludes the run, stops GPS broadcasting, and saves the final journey summary into the persistent database.

### 6.3 Live Telemetry Broadcasting
Once a journey starts:
- The device automatically polls HTML5 GPS coordinates at regulated intervals (every 3–5 seconds).
- Telemetry packets are sent over secure WebSockets (`location:update` event) to the server.
- The server broadcasts the updated position directly to parents subscribed to that journey room.
- If cellular connectivity is temporarily lost (e.g., passing through hill tunnels or dead zones), coordinates are queued locally and synced upon signal restoration.

### 6.4 Passenger Attendance Manifest (`/portal/driver/attendance`)
The Attendance page provides a digital checklist organized by pickup sequence:
- **Student Profile**: Shows child photo, name, school, and pickup address.
- **One-Tap Attendance Buttons**:
  - **Boarded**: Tap when the student steps into the van. Triggers an instant notification to the child's parents.
  - **Dropped Off**: Tap when the child arrives safely at school or home.
  - **Absent**: Automatically grayed out if the parent submitted prior notice. Driver can manually mark absent if the child is not at the stop after waiting.
- **Emergency Contact**: A direct call icon next to each child's name enables quick communication with the parent if the student is missing at the stop.

### 6.5 Emergency SOS & Broadcast Announcements (`/portal/driver/announce`)
In unpredictable traffic or emergency conditions:
- **Emergency SOS Button**: A prominent red alert button on the dashboard. Tapping and confirming triggers an immediate high-priority broadcast to all subscribed parents and administrators with current GPS coordinates (e.g., *Vehicle Breakdown*, *Emergency Assistance Required*).
- **Route Broadcast Announcements**:
  - Drivers can select pre-formatted announcement templates or type custom messages:
    - *"Heavy traffic at Peradeniya Bridge: expecting 15-minute delay."*
    - *"Heavy rain: please wait under shelter, arriving in 8 minutes."*
    - *"Flat tire safely replaced: journey resuming."*
  - Announcements appear as high-priority notification banners on all active parent screens.

### 6.6 Student Fee Collection & Management (`/portal/driver/payments`)
- **Payment Dashboard**: View payment statuses for all enrolled students for the current calendar month.
- **Confirm Cash Payments**: If a parent pays cash, the driver can tap **Mark as Paid** to issue a digital receipt.
- **Review Uploaded Slips**: Drivers can inspect photos of bank transfer slips uploaded by parents and click **Approve** or **Reject with Reason**.
- **Payment Settings (`/portal/driver/payments/settings`)**: Configure monthly rates per child based on distance and route tiers.

---

## 7. Administrator User Guide

The Administrator Back-Office is reserved for platform managers and transport coordinators.

### 7.1 Admin Dashboard & System KPIs (`/portal/admin/dashboard`)
The administrative command center provides an aggregate overview of platform health:
- **Total Registered Parents & Students**
- **Active Vehicles & Enrolled Drivers**
- **Live Ongoing Journeys & Telemetry Status**
- **Recent Platform Audit Logs**

### 7.2 Driver Approvals & User Auditing (`/portal/admin/users`)
To maintain safety and regulatory compliance:
1. Navigate to **User Management**.
2. Filter users by **Pending Drivers**.
3. Inspect driver details:
   - Driving license number and National Identity Card (NIC).
   - Vehicle registration credentials.
   - Assigned route proposal.
4. Click **Approve Driver** to grant active dispatch privileges, or **Reject / Suspend** if documentation is incomplete.

### 7.3 Vehicle & Fleet Management (`/portal/admin/vehicles`)
- Register new transport vehicles into the institutional fleet.
- Audit vehicle seating capacities against student enrollment to prevent overcrowding.
- Track vehicle inspection and revenue license expiry dates.

### 7.4 School Directory Management (`/portal/admin/schools`)
- Maintain official records of participating educational institutions.
- Store geolocations of main entrance gates for accurate drop-off geofence triggers.
- Record morning assembly bell times and afternoon dismissal times to assist drivers with departure planning.

### 7.5 Route Configuration & Geocoding (`/portal/routes`)
- Configure standard route corridors across municipalities (e.g., *Katugastota - Kandy*, *Peradeniya - Kandy*, *Gampola - Peradeniya*).
- Assign drivers and vehicles to specific routes.
- Optimize pickup waypoint sequences to reduce travel duration and fuel consumption.

---

## 8. Offline Resiliency & Telemetry Fail-Safes

Road conditions in Sri Lanka present intermittent 3G/4G cellular coverage. KidsRoute integrates architectural safeguards:
1. **Graceful Degradation**:
   - If the driver's device loses mobile data, the web client stores the latest GPS coordinates in local memory.
   - Once data connectivity resumes, queued fixes are flushed to the server.
2. **WebSocket Heartbeats & Reconnection**:
   - Both parent and driver clients maintain a 15-second heartbeat ping-pong with the Socket.io server.
   - If a connection drops, exponential backoff retries re-establish the socket session without requiring a page refresh.
3. **Optimistic UI Updates**:
   - Attendance clicks (Boarded/Dropped Off) update the local UI instantly so drivers can continue their workflow without waiting for network acknowledgment.

---

## 9. Frequently Asked Questions & Troubleshooting

### Q1: The live map is not updating the van's position. What should I check?
- **For Parents**: Verify that the driver has clicked **Start Journey**. The map only streams coordinates while an active journey is in progress. Check if your device has an active internet connection.
- **For Drivers**: Ensure your browser was granted **Location (GPS) Permissions**. In your smartphone settings, set location accuracy to **High Accuracy**.

### Q2: How does a driver get approved after registering?
- New driver registrations enter a `pending` state. An administrator must verify the driver's credentials in `/portal/admin/users` before the driver can log in to the driver dashboard.

### Q3: Can a parent track more than one child if they travel in different vans?
- **Yes**. KidsRoute supports multi-child monitoring. Each child card on the Parent Dashboard displays the assigned van independently. Clicking **Live Tracking** opens the specific vehicle stream for that child.

### Q4: What happens if a student is marked Absent by mistake?
- The driver can simply tap the student card on the Attendance Manifest and switch the status back to **Boarded** or **Waiting**.

### Q5: Can KidsRoute be used as a mobile app?
- **Yes**. KidsRoute is built as a responsive Progressive Web App (PWA). Users can open the portal in Chrome or Safari on iOS/Android and tap **Add to Home Screen** for a fullscreen mobile app experience.

---

## 10. Academic & Team Attribution

This software platform was designed and developed as part of the **CO2060 Software Systems Development Project** at the **Department of Computer Engineering, Faculty of Engineering, University of Peradeniya**.

### Engineering Team (Team AlphaWolves):
- **Didulana Lokugamage** — *E/22/214* — [didulanalokugamage@gmail.com](mailto:didulanalokugamage@gmail.com) • [GitHub](https://github.com/didulana)
- **Dilan Sandeepa** — *E/22/354* — [e22354@eng.pdn.ac.lk](mailto:e22354@eng.pdn.ac.lk) • [GitHub](https://github.com/dilansandeepa131)
- **Imasha Sewmini** — *E/22/372* — [e22372@eng.pdn.ac.lk](mailto:e22372@eng.pdn.ac.lk) • [GitHub](https://github.com/imasha284)
- **Samara Gunawardhana** — *E/22/127* — [e22127@eng.pdn.ac.lk](mailto:e22127@eng.pdn.ac.lk) • [GitHub](https://github.com/samara328)

### Project Repository & Resources:
- **GitHub Repository**: [cepdnaclk/e22-co2060-School-Van-Management-System](https://github.com/cepdnaclk/e22-co2060-School-Van-Management-System)
- **Department Website**: [Department of Computer Engineering, University of Peradeniya](http://www.ce.pdn.ac.lk/)

---
*KidsRoute — Keeping Sri Lankan School Journeys Tracked, Safe & Transparent.*
