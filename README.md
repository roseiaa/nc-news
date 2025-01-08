# Northcoders News API

## NC News Backend

[Hosted Version](https://nc-news-jstr.onrender.com/)


## Project Overview

We will be building an API for the purpose of accessing application data programmatically. The intention here is to mimic the building of a real-world backend service (such as Reddit) which should provide this information to the front-end architecture.


##  Prerequisites

Node.js: v16.0.0 or higher

PostgreSQL: v13.0 or higher

##  Installation and Setup

1. Clone the Repository

git clone https://github.com/roseiaa/nc-news

cd nc-news

2. Install Dependencies

npm install

3. Create Environment Files

.env file for development

NODE_ENV=(DEVDATA)

.env.test file for testing

NODE_ENV=(TESTDATA)

4. Setup Databases

npm run setup-dbs

5. Seed Local Database

npm run seed

6. Run the Application

npm start


Running Tests

npm test

## Additional Notes

Ensure PostgreSQL is running locally before starting the application.

Replace placeholder values in the .env files with your actual configuration.

Use npm run seed-prod for seeding the production database.

For any issues, refer to the logs or open an issue in the repository.



--- 

This portfolio project was created as part of a Digital Skills Bootcamp in Software Engineering provided by [Northcoders](https://northcoders.com/)
