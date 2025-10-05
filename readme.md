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
	# WanderLust

	An Express + EJS starter app for creating, viewing, editing, and deleting travel listings. Data is persisted in MongoDB via Mongoose. This README is updated to reflect the current codebase and includes setup, seeding, routes, and a short changelog of fixes.

	## What this project contains

	- Main app: `app.js` (Express server and routes)
	- Mongoose model: `models/listing.js`
	- Views: `views/` (EJS templates). Layout: `views/layouts/boilerPlate.ejs`.
	- Static assets: `public/` (CSS and client JS)
	- Seed data & script: `init/data.js` and `init/index.js`
	- Small helpers: `utils/wrapAsync.js`, `utils/expressError.js`

	## Prerequisites

	- Node.js (v16+ recommended; tested with Node 22)
	- npm
	- MongoDB (local or Atlas)

	## Install

	From the project root:

	```powershell
	npm install
	```

	## Configuration

	The app reads an optional `MONGO_URI` environment variable. If not present it falls back to the local MongoDB URI:

	```
	mongodb://localhost:27017/wonderlust
	```

	To run with a different URI (PowerShell example):

	```powershell
	$env:MONGO_URI = 'mongodb://username:password@host:port/dbname'
	npm start
	```

	## Run

	- Production: `npm start` (runs `node app.js`)
	- Development: `npm run dev` (uses `nodemon`, defined in `package.json`)

	The app listens on port 8080 by default. Open: http://localhost:8080/listings

	## Seed the database

	Seed the database with the provided sample listings (idempotent check for duplicate titles):

	```powershell
	node init/index.js
	```

	This will connect to the same `MONGO_URI` used by the app and insert sample documents where a title does not already exist.

	## Routes (summary)

	- GET `/` — Redirects to `/listings`
	- GET `/listings` — List all listings (renders `views/listings/index.ejs`)
	- GET `/listings/new` — Form to create a listing (`views/listings/new.ejs`)
	- POST `/listings` — Create a listing
	- GET `/listings/:id` — Show single listing (`views/listings/show.ejs`)
	- GET `/listings/:id/edit` — Edit form (`views/listings/edit.ejs`)
	- PUT `/listings/:id` — Update listing (uses `method-override`)
	- DELETE `/listings/:id` — Remove listing (uses `method-override`)

	Note: HTML forms support only GET/POST; this project uses the `method-override` package (already in `package.json`) to simulate PUT/DELETE via a `_method` field or query string.

	## Data model

	File: `models/listing.js` — Mongoose schema highlights:

	- title: String (required)
	- description: String (required)
	- image: String (optional, default placeholder)
	- price: Number (required)
	- location, country: String (optional)

	Sample document shape:

	```json
	{
	  "title": "Cozy Beachfront Cottage",
	  "description": "Escape to this charming beachfront cottage...",
	  "image": "https://...",
	  "price": 1500,
	  "country": "United States"
	}
	```

	## Files of interest (quick pointers)

	- `app.js` — sets up express, view engine, middleware, and all routes
	- `models/listing.js` — Mongoose schema and model export
	- `init/data.js` & `init/index.js` — seed data and seeder script
	- `views/listings/*.ejs` — list, new, edit and show templates
	- `public/css/style.css` and `public/js/script.js` — front-end assets

	## Recent fixes applied

	While inspecting and running the app I applied two small, safe fixes to `app.js` so the server starts correctly:

	1. Fixed the edit route which incorrectly passed additional params into `findById`:
		- Old: `listing.findById(id, description)` — removed the extra `description` param.
		- New: `listing.findById(id)`

	2. Replaced the invalid catch-all route handler that caused a path-to-regexp error when Express registered `app.all("*")` incorrectly:
		- Old: `app.all("*", (next) => { next(new expressErrors(404, "Page Not Found")); });` — this signature was wrong and triggered a router error.
		- New: `app.use((req, res, next) => next(new expressErrors(404, 'Page Not Found')));` plus an improved error handler that supplies defaults for status and message.

	These fixes are limited to `app.js` and don't change public APIs or data formats.

	## Troubleshooting

	- If you see MongoDB connection errors: confirm MongoDB is running and that `MONGO_URI` is correct.
	- If views fail to render: ensure `views/` exists and EJS is installed (`ejs` is in package.json).
	- If the server won't start and you get router/path errors: make sure routes use valid path strings and that `app.use`/`app.all` are used with the correct function signatures.

	If you want, I can run the app and fix any remaining runtime errors, add basic tests, or create a CI workflow.

	## Next improvements (suggested)

	- Add input validation (server-side) for create/update endpoints.
	- Add flash messages and better error pages (rendered EJS templates instead of plain text error responses).
	- Add unit/integration tests and a small CI workflow.
	- Consider adding authentication if listings should be owned by users.

	---

	If you'd like I can commit these README changes and/or continue by running the server locally, adding tests, or implementing any of the suggested improvements — tell me which you prefer next.

