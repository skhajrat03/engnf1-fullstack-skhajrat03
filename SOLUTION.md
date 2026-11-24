# SOLUTION.md

# MongoDB Atlas Connection Error – Solution

## Problem

While starting the backend server using:


npm run dev


The following error occurred:


MongoDB Error: Could not connect to any servers
in your MongoDB Atlas cluster.

One common reason is that you're trying to access
the database from an IP that isn't whitelisted.

## Cause of the Problem

The backend application was unable to establish a connection with the MongoDB Atlas cluster.

Possible reasons include:

1. Current IP address not added to the Atlas IP Access List.
2. Incorrect MongoDB connection string.
3. Incorrect database username or password.
4. Special characters in the database password not URL-encoded.
5. MongoDB Atlas cluster unavailable.
6. Network or firewall restrictions.

## Solution 1: Configure MongoDB Network Access

1. Log in to MongoDB Atlas.
2. Open your project.
3. Navigate to **Security → Network Access**.
4. Open the IP Access List.
5. Click **Add IP Address**.
6. Add your current IP address.
7. Save the configuration.

For temporary development testing, you can also use:


0.0.0.0/0


This allows access from any IP address. Use restricted IP access for production environments.

## Solution 2: Verify MongoDB Connection String

Open the backend `.env` file.


MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/databaseName


Verify:

- Database username is correct.
- Database password is correct.
- Cluster hostname is correct.
- Database name is correct.
- Special characters in passwords are URL-encoded.

Use MongoDB Database Access credentials rather than your Atlas account login credentials.

## Solution 3: Check Database Connection Code

Example `config/db.js`:


import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Error:", error.message);
    process.exit(1);
  }
};

export default connectDB;


## Solution 4: Restart Backend Server

Stop the existing backend server:


Ctrl + C


Restart it:


npm run dev


## Verification

After successfully configuring MongoDB Atlas, the expected terminal output is:


MongoDB Connected Successfully
Server running on port 5000


## Final Result

The MongoDB Atlas connection issue can be resolved by configuring the IP Access List, verifying the database connection string, checking database credentials, and restarting the backend server.

## Important Security Notes

- Never commit `.env` files to GitHub.
- Never expose database passwords.
- Use environment variables for sensitive credentials.
- Avoid unrestricted IP access in production.
- Use a dedicated database user with appropriate permissions.

---

**Status:** MongoDB Atlas connection troubleshooting documented.
