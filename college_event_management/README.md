# College Event Management System

Built from the supplied project structure using the existing Node.js, Express, MySQL and HTML/CSS/JavaScript setup.

## Requirements
- Node.js and npm
- MySQL Server and MySQL Workbench
- VS Code (recommended)

## 1. Set up the database
1. Open MySQL Workbench and connect to your local MySQL server.
2. Open `database.sql` in Workbench.
3. Run the complete script (lightning icon). It creates the `school` database and the `event` table.
4. The table contains `EventID`, `EventName`, `Type`, `Date`, `Venue`, `Description`, and `Photos`.

## 2. Check the MySQL password
Open `app7a-0.js`. In the `mysql.createConnection` settings, change `password: process.env.DB_PASSWORD || "123456"` to your MySQL root password if it is different. The default was retained from the supplied project. Alternatively, set the `DB_PASSWORD` environment variable before starting Node.

## 3. Run in VS Code
1. Extract this ZIP.
2. Open the `college_event_management` folder in VS Code (the folder containing `package.json`).
3. Open Terminal > New Terminal.
4. Run `npm install` (only needed the first time).
5. Run `npm start`.
6. Open `http://localhost:3000` in your browser. Keep the terminal open while using the site.

## 4. Test the features
- **Create:** choose **Add Event**, complete the required fields, optionally select a photo, then save.
- **Read:** choose **All Events** to see event details in a table.
- **Search:** use the search box on **All Events** to filter by event name, type, venue or description.
- **Update:** click **Edit** in a table row, change details and save.
- **Delete:** click **Delete** in a table row and confirm.
- **Photo:** choose an image in the Add/Edit form. A small image preview is shown and the image data is stored in the `Photos` column. Use reasonably small images (recommended under 1 MB) because images are stored in the database.

## Notes
- Event IDs are generated automatically by MySQL.
- If the page says the database is not connected, confirm MySQL is running, the `school` database and `event` table exist, and the credentials in `app7a-0.js` match your local setup.
- The app does not delete any existing `student` table. It uses a separate `event` table.
