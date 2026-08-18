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

## 🗄️ Database Setup (Microsoft SQL Server + SSMS)

Each member runs their **own local SQL Server instance** — you don't share one server between the 6 of you. Everyone points their app at `localhost`, and the schema stays in sync because it's generated from the same JPA entity classes in Git (see below).

1. Install **SQL Server** (Developer or Express edition) and **SQL Server Management Studio (SSMS)**.
2. During SQL Server install, enable **Mixed Mode Authentication** and set an `sa` password (write it down — every teammate will use the same one for consistency).
3. Open SSMS → connect to `localhost` (or `localhost\SQLEXPRESS` if you installed Express) using **SQL Server Authentication**, login `sa`.
4. Right-click **Databases → New Database**, name it `AquaSafariDB`.
5. In `backend/pom.xml`, make sure the SQL Server driver dependency is present:

```xml
<dependency>
    <groupId>com.microsoft.sqlserver</groupId>
    <artifactId>mssql-jdbc</artifactId>
    <scope>runtime</scope>
</dependency>
```

6. Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:sqlserver://localhost:1433;databaseName=AquaSafariDB;encrypt=false;trustServerCertificate=true
spring.datasource.username=sa
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.SQLServerDialect
```

> With `ddl-auto=update`, Hibernate creates/updates the tables automatically from your `@Entity` classes the first time you run the app — nobody needs to run manual `CREATE TABLE` scripts, and everyone's local database ends up with the same structure as long as the entity classes are the same (which Git guarantees).

> Never commit real `sa` passwords to a public repo. For a private academic repo it's common to just share the convention with your team; for anything else, keep credentials in a local `application-local.properties` or environment variables instead.

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
