<img width="1280" height="320" alt="Banner" src="https://github.com/user-attachments/assets/5c0b6177-0091-41df-a5db-1e2d53d5429f" />

# 🚤 AquaSafari – Web Based Boat Safari Trip Management System

## 📌 Project Overview

**AquaSafari** is a full-stack web application built to modernize boat safari operations in Sri Lanka — replacing phone calls, notebooks, and paper receipts with a single organized platform.

Through the system, **customers** can search for trips, make bookings, pay online, and manage their reservations. **Administrators** manage boats, trips, schedules, and users. **Boat operators** and **tour guides** track their assigned trips, and payments are recorded and reconciled through a dedicated payment module.

**Group ID:** 2026-Y2-S1-MLB-B03G2-03
**Module:** SE2030 – Software Engineering | BSc (Hons) in Information Technology, SLIIT

---

## 🛠️ Technologies Used

### 🔹 Frontend
- Vite
- React
- Tailwind CSS
- JavaScript / Axios

### 🔹 Backend
- Java Spring Boot
- Spring Web (REST APIs)
- Spring Data JPA
- Spring Security
- Lombok, Validation

### 🔹 Database
- Microsoft SQL Server (managed via **SQL Server Management Studio – SSMS**)

### 🔹 Tools
- IntelliJ IDEA / VS Code
- Postman (API testing)
- Git & GitHub (version control)
- SQL Server Management Studio (SSMS)

---

## 📁 Project Structure

```
aquasafari/
├── frontend/       # React + Vite app
└── backend/        # Spring Boot app
```

---

## ⚙️ Spring Boot Project Configuration

👉 Open Spring Initializr: https://start.spring.io/

| Setting          | Value                          |
|-------------------|--------------------------------|
| Project           | Maven                          |
| Language          | Java                           |
| Spring Boot       | Latest stable (3.x)            |
| Group             | `com.aquasafari`                |
| Artifact          | `backend`                       |
| Name              | `backend`                       |
| Package name      | `com.aquasafari`                |
| Packaging         | Jar                             |
| Java Version      | 17 ✅                            |

### 📦 Dependencies

**Required**
- Spring Web
- Spring Data JPA
- MS SQL Server Driver
- Spring Security
- Lombok
- Validation

**Optional**
- Spring Boot DevTools

Click **Generate → Download ZIP**, then unzip it into the `backend/` folder of the repo.

---

## 🗄️ Database Setup (Microsoft SQL Server — local instance, `localhost`)

Every team member installs **Microsoft SQL Server** and **SQL Server Management Studio (SSMS)** on their own laptop and runs the database **locally** — `localhost` is sufficient for development, coursework, and the viva demo.

## 📁 `database/` folder

This folder does **not** hold the schema — Hibernate generates tables automatically from the JPA entity classes, directly in your local SQL Server database. It holds reference files only:

```
database/
├── application-example.properties   # local SQL Server connection template
├── seed-data.sql                     # optional sample/dummy data for local testing
└── README.md                          
```

---

## ☕ Backend Setup

```bash
cd backend
```

```bash
# Windows
mvnw.cmd clean install
mvnw.cmd spring-boot:run
```

```bash
# macOS / Linux
./mvnw clean install
./mvnw spring-boot:run
```

Backend runs at: **http://localhost:8080** (or the port set in `application.properties`)

---

## 🎨 Frontend Setup

```bash
cd frontend
npm install
npm install axios
npm install lucide-react
npm install react-router-dom
npm install -D tailwindcss@3.4.17 postcss autoprefixer
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🧰 Quick Git Reference

```bash
# Initial setup
git config --global user.name "Your Name"
git config --global user.email "you@my.sliit.lk"

git clone <repo-url>
cd aquasafari

# Create and switch to your feature branch
git checkout dev
git pull origin dev
git checkout -b feature/payment-management

# Daily workflow
git add .
git commit -m "feat(payment): describe your change"
git push origin feature/payment-management

# Keep your branch up to date
git checkout dev
git pull origin dev
git checkout feature/payment-management
git merge dev
```

---

## 👨‍💻 Contributors

| Name                  | Student ID  | Major Function              | Scrum Role       |
|-------------------------|-------------|-------------------------------|--------------------|
| Nimalthilaka N.M.S.U     | IT25101857  | User & Admin Management       | Product Owner      |
| Ekanayake E.M.I.U        | IT25103708  | Boat Management                | Scrum Master       |
| Lakshan A.M.S.U          | IT25103722  | Trip Management                | Developer 3        |
| Hemanga B.M.T            | IT25101908  | Booking Management             | Developer 1        |
| Ranaweera R.H.H.V        | IT25102853  | Payment Management             | Developer 2        |
| Muthuthanthri M.B.M.A    | IT25100928  | Feedback & Reviews Management  | Developer 4        |

---

This project is developed for academic purposes only (SE2030 – Software Engineering, SLIIT).
