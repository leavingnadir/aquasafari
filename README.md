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

1. **Install SQL Server (Developer or Express edition)** and **SSMS** on your machine (see the step-by-step setup guide `SSMS_Setup_Guide.html` in this repo for the full install + configuration walkthrough).
2. In SSMS, connect to your local instance (Server name is usually `localhost` or `localhost\SQLEXPRESS`, Authentication = Windows Authentication).
3. Create the project database:
```sql
CREATE DATABASE AquaSafariDB;
```
4. In `backend/pom.xml`, make sure the SQL Server driver dependency is present:
```xml
<dependency>
    <groupId>com.microsoft.sqlserver</groupId>
    <artifactId>mssql-jdbc</artifactId>
    <scope>runtime</scope>
</dependency>
```
5. Update `backend/src/main/resources/application.properties` (this file is git-ignored — see `database/application-example.properties` for the template):
```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=AquaSafariDB;encrypt=true;trustServerCertificate=true
spring.datasource.username=<your_local_sql_username>
spring.datasource.password=<your_local_sql_password>
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
```

> With `ddl-auto=update`, Hibernate creates/updates tables automatically from your `@Entity` classes the first time you run the app — nobody writes or shares manual `CREATE TABLE` scripts. Since each member runs their **own local database**, everyone should pull the latest entity classes from `dev` before running, so table structures stay consistent across the team.

6. Run your Spring Boot app once — Hibernate will create the tables in your local `AquaSafariDB`. Open SSMS to confirm the tables appear under **Databases → AquaSafariDB → Tables**.

> Never commit real SQL Server credentials to GitHub. Keep `application.properties` in `.gitignore` and only commit the placeholder `database/application-example.properties` template.

### Keeping schemas consistent across the team

Since each member's database is local and separate:
- Always pull the latest code from `main` before running your app, so your local tables match everyone else's entity definitions.
- If you change an `@Entity` (add/remove a field), let the team know so they pull and re-run to update their local schema too.
- Local test data does **not** need to match between members during individual development — only the table structure does.
- Ahead of integration testing / the final demo, the team should agree on one member's laptop (or a temporary shared connection) to run the combined system so all modules are tested against the same live data.

See [`database/`](./database) for the connection-string template and optional demo seed data, and see `SSMS_Setup_Guide.html` for the full installation and dummy-data walkthrough.

---

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
