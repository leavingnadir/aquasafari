<img width="1280" height="320" alt="BANNER" src="https://github.com/user-attachments/assets/5f7b6004-18e1-4dce-9ff5-18c340d6e7fa" />

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
- Microsoft SQL Server (via SQL Server Management Studio - SSMS)

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

> If you already generated the project with MySQL Driver selected, just swap the dependency in `pom.xml` — see below.

---
 
## 🗄️ Database Setup (Azure SQL Database — shared by the whole team)
 
We use **one shared Azure SQL Database** — nobody installs SQL Server locally. Every member's Spring Boot app connects to the same cloud database over the internet, so data created by one module (e.g. a booking) is immediately visible to every other module (e.g. Payment).
 
1. Get the connection details from whoever set up the Azure SQL server (server name, database name, admin username/password). Keep these out of GitHub — share them over a private channel (WhatsApp/Discord/etc).
2. Make sure your IP is allowed through the server's firewall — see **Section 4** of `AquaSafari_Git_Setup_Guide.html` if you get a connection-refused error (this is the most common setup issue; campus/home WiFi IPs can also change over time).
3. In `backend/pom.xml`, make sure the SQL Server driver dependency is present:
```xml
<dependency>
    <groupId>com.microsoft.sqlserver</groupId>
    <artifactId>mssql-jdbc</artifactId>
    <scope>runtime</scope>
</dependency>
```
 
4. Update `backend/src/main/resources/application.properties` (this file is git-ignored — see `database/application-example.properties` for the template):
```properties
spring.datasource.url=jdbc:sqlserver://<your-server-name>.database.windows.net:1433;database=AquaSafariDB;encrypt=true;trustServerCertificate=false
spring.datasource.username=<shared_admin_username>
spring.datasource.password=<shared_admin_password>
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
 
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
```
 
> With `ddl-auto=update`, Hibernate creates/updates tables automatically from your `@Entity` classes the first time you run the app — nobody writes or shares manual `CREATE TABLE` scripts. Since everyone connects to the same Azure database, tables created by one member's entities are immediately visible to everyone else.
 
5. (Optional) Connect via **SSMS** to browse/verify the shared data directly: Server name = `<your-server-name>.database.windows.net`, Authentication = SQL Server Authentication, using the shared admin credentials.
> Never commit real Azure credentials to GitHub. Keep `application.properties` in `.gitignore` and only commit the placeholder `database/application-example.properties` template.
 
See the [`database/`](./database) folder for the connection-string template and optional demo seed data.
 
---
 
## 📁 `database/` folder
 
This folder does **not** hold the schema — Hibernate generates tables automatically from the JPA entity classes, directly in the shared Azure database. It holds reference files only:
 
```
database/
├── application-example.properties   # Azure connection template
├── seed-data.sql                     # optional sample data for demos
└── README.md                          # explains what's here
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
