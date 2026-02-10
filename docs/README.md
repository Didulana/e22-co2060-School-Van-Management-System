---
layout: home
permalink: index.html
repository-name: e22-co2060-school-van-management
title: School Van Management System
---

# School Van Management System

---

## Team
- **E/22/214** – H.D. Lokugamage, [e22214@eng.pdn.ac.lk](mailto:e22214@eng.pdn.ac.lk)
- **E/22/354** – K.A.H.G.D. Sandeepa, [e22354@eng.pdn.ac.lk](mailto:e22354@eng.pdn.ac.lk)
- **E/22/372** – K.I. Sewmini, [e22372@eng.pdn.ac.lk](mailto:e22372@eng.pdn.ac.lk)
- **E/22/127** – S.I. Gunawardhana, [e22127@eng.pdn.ac.lk](mailto:e22127@eng.pdn.ac.lk)

<!-- Add cover_page.jpg and thumbnail.jpg inside /docs/data -->

#### Table of Contents
1. [Introduction](#introduction)
2. [Solution Architecture](#solution-architecture)
3. [Software Designs](#software-designs)
4. [Testing](#testing)
5. [Conclusion](#conclusion)
6. [Links](#links)

---

## Introduction

School transportation management is often handled manually using paper records or informal communication methods, which can lead to inefficiencies, poor coordination, and safety concerns. Tracking student registrations, van routes, schedules, and driver assignments becomes difficult as the number of students and vehicles increases.

The **School Van Management System** is a web-based software solution developed under the **CO2060 – Software Systems Design** module to address these challenges. The system digitizes school van operations by providing a centralized platform for managing students, vans, routes, and schedules, improving reliability, transparency, and operational efficiency for school administrators.

---

## Solution Architecture

The system follows a **three-tier architecture**:

- **Frontend**: A web-based user interface that allows administrators to manage students, vans, and routes, while enabling users to view relevant transportation details.
- **Backend**: Handles business logic, data validation, and communication between the frontend and the database.
- **Database**: Stores persistent data such as student records, van details, route information, and schedules.

This architecture ensures modularity, scalability, and easier maintenance.

---

## Software Designs

The software design is developed using standard object-oriented design principles and UML-based modeling. Key design aspects include:

- **Entity Design**: Student, Van, Route, Driver, and Schedule entities with clearly defined responsibilities.
- **Class Diagrams**: Represent relationships and interactions between system components.
- **Use Case Diagrams**: Describe system functionality from the perspective of administrators and users.
- **Sequence Diagrams**: Illustrate interactions between system components during key operations such as student registration and route assignment.

These designs ensure clarity, reusability, and alignment with software engineering best practices.

---

## Testing

Software testing was conducted to verify correctness, reliability, and robustness of the system. The following testing approaches were used:

- **Unit Testing**: Individual modules were tested to ensure correct functionality.
- **Integration Testing**: Interactions between frontend, backend, and database were validated.
- **Functional Testing**: Core features such as student registration, van allocation, and schedule management were tested against requirements.

Test results confirmed that the system performs as expected under normal usage scenarios.

---

## Conclusion

The School Van Management System successfully delivers a structured and efficient solution for managing school transportation operations. By automating manual processes, the system improves operational efficiency, data accuracy, and overall reliability.

Future enhancements may include real-time GPS tracking, automated notifications for parents, mobile application support, and advanced analytics. With further development, the system has potential for real-world deployment and commercialization in educational institutions.

---

## Links

- [Project Repository](https://github.com/cepdnaclk/{{ page.repository-name }}){:target="_blank"}
- [Project Page](https://cepdnaclk.github.io/{{ page.repository-name }}){:target="_blank"}
- [Department of Computer Engineering](http://www.ce.pdn.ac.lk/)
- [University of Peradeniya](https://eng.pdn.ac.lk/)
