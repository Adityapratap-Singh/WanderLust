# WanderLust

WanderLust is a small Express + EJS application for creating, viewing, editing, and deleting travel listings. It uses MongoDB via Mongoose for data storage and includes server-rendered views located under `views/listings`.

This README explains how to install, run, and seed the project, and documents the main routes and data model.

## Quick start

- Clone the repository and change into the project folder.
- Install dependencies:

```powershell
npm install
```

- Start a local MongoDB server (default URI used by the app is `mongodb://localhost:27017/wonderlust`).
- Start the app:

```powershell
npm start
```

Open http://localhost:8080/listings in your browser.

## What's included

- Express app in `app.js`
- Mongoose model: `models/listing.js`
- Views: `views/listings/*` (EJS templates)
- Static assets: `public/` (CSS, images, etc.)
- Seed data: `init/data.js` and `init/index.js`

## Prerequisites

- Node.js (16+ recommended)
- npm (comes with Node)
- MongoDB (local or remote)

If you don't have MongoDB locally, you can use a hosted MongoDB Atlas cluster and set the connection URL with the `MONGO_URI` environment variable (see Configuration).

## Installation

1. Install node modules:

```powershell
npm install
```

2. (Optional) Install `nodemon` globally for development automatic restarts:

```powershell
npm install -g nodemon
```

## Configuration

By default the app connects to `mongodb://localhost:27017/wonderlust` (configured in `app.js`). To use a different URI set `MONGO_URI` before running the server. Example (PowerShell):

```powershell
$env:MONGO_URI = 'mongodb://username:password@host:port/dbname'
npm start
```

Note: The repository currently hardcodes the local MongoDB URI in `app.js` and `init/index.js`. Consider updating those files to read from `process.env.MONGO_URI` if you want environment-driven configuration.

## NPM scripts

- `npm start` — run the app with Node (`node app.js`)
- `npm run dev` — run the app with `nodemon` (auto restart during development). `nodemon` must be installed globally or added to devDependencies.

These scripts are defined in `package.json`.

## Seed the database

Seed sample listings into the database with the included script:

```powershell
node init/index.js
```

Make sure MongoDB is running and reachable first. Running the seed script multiple times may create duplicate records.

## Routes (overview)

- GET `/` — Redirects to the (/listings)
- GET `/listings` — index: show all listings (renders `views/listings/index.ejs`)
- GET `/listings/new` — form to create a new listing (renders `views/listings/new.ejs`)
- POST `/listings` — create a new listing
- GET `/listings/:id` — show a single listing (renders `views/listings/show.ejs`)
- GET `/listings/:id/edit` — edit form for a listing (renders `views/listings/edit.ejs`)
- PUT `/listings/:id` — update a listing (uses `method-override` middleware)
- DELETE `/listings/:id` — delete a listing (uses `method-override` middleware)

Notes: HTML forms only support GET/POST, so this project uses the `method-override` middleware (via a `_method` field or `?_method=` query string) to simulate PUT and DELETE requests.

## Data model

Model: `Listing` (Mongoose)

Important fields (see `models/listing.js`):

- `title` (String, required)
- `description` (String, required)
- `image` (String, optional — default placeholder)
- `price` (Number, required)
- `country` (String, optional)

Example document:

```json
{
	"title": "Cozy Beachfront Cottage",
	"description": "Escape to this charming beachfront cottage...",
	"image": "https://example.com/img.jpg",
	"price": 1500,
	"country": "United States"
}
```

## Project structure

```
.
├─ app.js               # main Express application
├─ package.json
├─ readme.md
├─ init/
│  ├─ index.js          # seed script that inserts sample data
│  └─ data.js           # sample listing objects
├─ models/
│  └─ listing.js        # Mongoose Listing model
├─ public/              # static assets (css, images)
└─ views/
	 ├─ layouts/
	 └─ listings/         # EJS templates (index, new, edit, show)
```

## Examples (curl / PowerShell)

Create a listing (form-style POST):

```powershell
curl -X POST http://localhost:8080/listings -d "title=Beach%20House&description=Sea%20view&price=250&country=Spain"
```

Update a listing (method override):

```powershell
curl -X POST "http://localhost:8080/listings/<LISTING_ID>?_method=PUT" -d "title=Updated%20title&price=300"
```

Delete a listing (method override):

```powershell
curl -X POST "http://localhost:8080/listings/<LISTING_ID>?_method=DELETE"
```

Replace `<LISTING_ID>` with the document `_id`.

## Troubleshooting

- If the server can't connect to MongoDB, ensure MongoDB is running and reachable at the configured URI. Check the console output from `app.js` for the error message.
- If views don't render, confirm `views/` exists and `app.set('view engine', 'ejs')` is configured (see `app.js`).

## Next steps / suggestions

- Move DB connection strings into environment variables (`MONGO_URI`) and load them with a library like `dotenv`.
- Add form validation, error handling, and user-friendly flash messages.
- Add automated tests and linting.

## License

This repository does not contain an explicit license. Add a `LICENSE` file if you want to permit reuse.

