# PROG2002-A3

Gold Coast Charity Connect
PROG2002 Web Development II - Assessment 3
By Grace Sutton & Kydan Jenkins

Gold Coast Charity Connect is a full-stack web application that centralises charity events within the Gold Coast area. 

This A3 version extends the A2 project by introducing event registration, an admin dashboard, and a RESTful API, now restructured using the Angular framework for the client-side interface.

This project has been deployed live on cPanel here:
* Client-side: https://23290509.it.scu.edu.au/prog2002/goldcoastcharityconnect/client/
* Admin dashboard: https://23290509.it.scu.edu.au/prog2002/goldcoastcharityconnect/admin/
* API: https://23290509.it.scu.edu.au/prog2002/goldcoastcharityconnect/api/

Read below for more information and local hosting details.

## Overview

The application consists of three parts:
1. Client-Side Website (Angular) – Allows users to browse events, view details, and register.

2. Admin-Side Website (Angular) – Enables administrators to create, edit, or delete events.

3. Backend RESTful API (Node.js + Express + MySQL) – Handles all server-side logic and data operations.

## Getting Started

### Dependencies

* Node.js (v16 or higher recommended)
* MySQL (v8 or higher)
* npm packages: express, body-parser, mysql2, cors
* Angular CLI v19.2.4 or later

### Installing

#### Backend Setup

1. Install dependencies:

``` bash
cd backend
npm install
```

2. Configure database:
* Set up a MySQL database called ```charityevents_db```.
* Import the provided schema SQL file (```charityevents_db.sql```).
* Update the database credentials in ```event_db.js``` if required.

3. Start the backend server: ```npm start``` OR ```node server.js```

Backend runs on http://localhost:8080

#### Client Setup

1. Install dependencies:

``` bash
cd client
npm install
```

2. Run the development server:

``` bash
ng serve
```

Then open http://localhost:4200 in your browser.

## API Endpoints

* GET /api/events → all events with category info
* GET /api/events/:id → details of a single event
* GET /api/events/categories/list → list of categories
* GET /api/events/search?date=&location=&categoryID= → search with filters

# PROG2002A3

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.4.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
