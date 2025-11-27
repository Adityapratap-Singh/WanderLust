# Ghoomo: A Full-Stack Travel & Hospitality Platform

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Ghoomo is a robust and full-featured web application built on the Node.js runtime, designed as a dynamic marketplace for discovering, sharing, and reviewing unique accommodations. It serves as a comprehensive example of a modern web application using the Model-View-Controller (MVC) architecture, complete with secure user authentication, image handling, and a RESTful API design.

This project was built to demonstrate a wide range of web development concepts, from backend logic and database management to frontend rendering and security best practices.

<!--
**Live Demo:** [https://ghoomo-demo.herokuapp.com/](https://ghoomo-demo.herokuapp.com/)
-->

---

## Visual Showcase

*(Add screenshots of your application here to give users a visual overview.)*

| Home Page | Listing Details | Add New Listing |
| :---: | :---: | :---: |
| *(Your Screenshot Here)* | *(Your Screenshot Here)* | *(Your Screenshot Here)* |

---

## Key Features

-   **Full CRUD Functionality:** Users can Create, Read, Update, and Delete property listings.
-   **Secure User Authentication:** A complete authentication system using Passport.js, including user registration, login, and persistent sessions with `connect-mongo`.
-   **Authorization & Ownership:** Secure middleware ensures that users can only edit or delete the listings and reviews they own.
-   **Image Uploads via Cloudinary:** Seamless image uploads for listings are handled by Multer and stored directly in the cloud, keeping the application server stateless.
-   **Reviews and Ratings:** Authenticated users can post reviews with a 1-5 star rating for any listing.
-   **Server-Side Validation:** Robust incoming data validation using Joi to ensure data integrity before it reaches the database.
-   **Advanced Security:**
    -   **CSRF Protection** (`csrf-csrf`) on all state-changing forms.
    -   **Secure HTTP Headers** with `helmet`.
    -   **NoSQL Injection Sanitization** with `mongo-sanitize`.
    -   **Protected Routes** for authenticated users.
-   **Flash Notifications:** The UI provides contextual feedback for user actions (e.g., "Listing created successfully!", "You don't have permission to do that.").
-   **Responsive Frontend:** Built with Bootstrap 5, the user interface is fully responsive and works seamlessly on desktops, tablets, and mobile devices.
-   **Database Seeding/Migration:** Includes scripts to help manage database content.

---

## Technology & Architecture

This project uses the **Model-View-Controller (MVC)** pattern to create a clear separation of concerns, making the codebase organized, scalable, and easy to maintain.

-   **Models (`/models`)**: Define the data structure using Mongoose schemas. This is the layer that interacts directly with the MongoDB database.
-   **Views (`/views`)**: The presentation layer, built with EJS templates. It renders the UI and displays data to the user.
-   **Controllers (`/controllers`)**: The core logic of the application. Controllers handle user requests, process data by interacting with the Models, and decide which View to render.

### Tech Stack Deep Dive

| Technology | Role & Justification |
| :--- | :--- |
| **Node.js** | The core JavaScript runtime, chosen for its non-blocking, event-driven architecture, which is ideal for I/O-heavy web applications. |
| **Express.js** | A minimal and flexible web framework that provides a robust set of features for routing, middleware, and API creation. |
| **MongoDB** | A NoSQL database selected for its flexible, JSON-like document structure, which maps directly to the objects in the application code. |
| **Mongoose** | An Object Data Modeling (ODM) library that provides a straightforward, schema-based solution to model application data, including type casting, validation, and business logic hooks. |
| **EJS & EJS-Mate** | A simple templating language that lets you generate HTML markup with plain JavaScript. `ejs-mate` adds powerful layout and partial capabilities. |
| **Passport.js** | The de-facto standard for authentication in Node.js. It's extremely flexible and modular, allowing for easy integration of different authentication strategies. |
| **Cloudinary & Multer** | This combination provides a powerful, production-grade solution for handling file uploads. Multer processes the form data, and Cloudinary stores the files in the cloud, providing a CDN, image optimization, and transformations out of the box. |
| **Joi** | A powerful schema description language and data validator. Used to ensure all incoming data has the correct format and type before being processed, preventing common data-related errors. |
| **`connect-mongo`** | Persists session data in MongoDB, ensuring that user sessions are not lost when the server restarts, a critical feature for production environments. |

---

## API Endpoints & Routes

The application follows RESTful conventions for its routing.

| Route | HTTP Method | Description | Middleware |
| :--- | :--- | :--- | :--- |
| `/` | GET | Redirects to `/listings`. | |
| `/listings` | GET | Displays all listings. | |
| `/listings/new` | GET | Renders the form to create a new listing. | `isLoggedIn` |
| `/listings` | POST | Creates a new listing. | `isLoggedIn`, `validateListing` |
| `/listings/:id` | GET | Shows details for a specific listing. | |
| `/listings/:id/edit` | GET | Renders the form to edit a listing. | `isLoggedIn`, `isOwner` |
| `/listings/:id` | PUT | Updates a specific listing. | `isLoggedIn`, `isOwner`, `validateListing` |
| `/listings/:id` | DELETE | Deletes a specific listing. | `isLoggedIn`, `isOwner` |
| `/listings/:id/reviews` | POST | Creates a new review for a listing. | `isLoggedIn`, `validateReview` |
| `/listings/:id/reviews/:reviewId` | DELETE | Deletes a specific review. | `isLoggedIn`, `isReviewAuthor` |
| `/signup` | GET, POST | Renders the signup form and handles user registration. | `validateUser` |
| `/login` | GET, POST | Renders the login form and handles user login. | |
| `/logout` | GET | Logs the user out. | |

---

## Installation & Setup

Follow these steps to get a local copy of the project up and running.

### 1. Prerequisites

-   **Node.js** (v18.x or higher)
-   **MongoDB** (a local instance or a free cloud instance from [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
-   **Cloudinary Account** (a free account is sufficient for development)

### 2. Clone the Repository

```bash
git clone <your-repository-url>
cd ghoomo
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a file named `.env` in the root of the project and add the following configuration. Replace the placeholder values with your actual credentials.

```ini
# MongoDB Connection String
# Example: mongodb://127.0.0.1:27017/ghoomo
MONGO_URI=<your_mongodb_connection_string>

# Cloudinary Credentials
CLOUD_NAME=<your_cloudinary_cloud_name>
CLOUD_API_KEY=<your_cloudinary_api_key>
CLOUD_API_SECRET=<your_cloudinary_api_secret>

# Session Secret
# A long, random string used to sign the session ID cookie
SESSION_SECRET=<your_strong_session_secret>
```

### 5. Database Scripts (Optional)

The `/init` directory contains scripts for managing the database.
-   `data.js`: Contains sample data for listings.
-   `index.js`: A script that can be run to perform database operations. **Note:** The current script is designed to migrate data from an old schema format. You can modify it to create a seeder that populates your database with the sample data from `data.js`.

To run the script:
```bash
node init/index.js
```

### 6. Run the Application

You can run the server in two modes:

-   **Development Mode:** Uses `nodemon` to automatically restart the server on file changes.
    ```bash
    npm run dev
    ```

-   **Production Mode:**
    ```bash
    npm start
    ```

The application will be running at `http://localhost:8080`.

---

## License

This project is licensed under the ISC License. See the [LICENSE](LICENSE) file for details.

## Author

**Adityapratap Singh**