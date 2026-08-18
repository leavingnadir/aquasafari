# database/ — reference files only

The AquaSafari schema itself is **not** stored here — it's generated automatically
by Hibernate from the `@Entity` classes in `backend/src/main/java/...`
(`spring.jpa.hibernate.ddl-auto=update`), directly in the **shared Azure SQL
Database**. No local SQL Server install is needed on any laptop, and there's
nothing in this folder you need to run to get the app working.

What's here instead:

| File | What it's for |
|---|---|
| `application-example.properties` | Template with the shared Azure connection block and placeholder credentials. Copy it into `backend/src/main/resources/application.properties` (which is git-ignored — never commit real passwords). |
| `seed-data.sql` | Optional sample `INSERT` statements for demo/testing. Run manually in SSMS against the shared Azure database if the team wants consistent sample data for a presentation. |
| `schema-reference.sql` | (Optional, add if needed) A read-only export of the current table structure, generated via SSMS → right-click database → Tasks → Generate Scripts. Useful for the design document, not required to run the app. |

See the **Database Setup** section of `README.md` and Section 4 of
`AquaSafari_Git_Setup_Guide.html` for full step-by-step instructions on
creating and connecting to the shared Azure SQL Database.
