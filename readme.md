WanderLust

WanderLust is a small Express + EJS application for creating, viewing, editing, and deleting travel listings. It uses MongoDB via Mongoose for data storage and includes simple server-rendered views under `views/listings`.

This README documents how to set up, run, and seed the project, plus the available routes and data model.

## Table of contents
- Project status
- Tech stack
- Prerequisites
- Installation
- Configuration
- Run the app
- Seed the database
- Routes
- Data model
- Project structure
- Examples (curl)
- Contributing
- License

## Project status

Minimal CRUD application. Intended as a learning / demo project.

## Tech stack

- Node.js (CommonJS)
- Express
- EJS (server-side templates)
- Mongoose / MongoDB
- method-override (to allow PUT & DELETE from HTML forms)

Dependencies (from `package.json`):

- `express`
- `ejs`
- `mongoose`
- `method-override`

## Prerequisites

- Node.js (>= 16 recommended)
- npm (bundled with Node)
- MongoDB running locally (or a remote MongoDB connection string)

This project expects a MongoDB database reachable at:

`mongodb://localhost:27017/wonderlust`

If you prefer a different URI, set the `MONGO_URI` environment variable and start the server with it (instructions below).

## Installation

1. Clone or copy the project into a directory.
2. From the project root (`p1`), install dependencies:

```powershell
npm install
```

## Configuration

By default the app connects to `mongodb://localhost:27017/wonderlust` (see `app.js`). To use a different URI, set `MONGO_URI` before running the server. Example (PowerShell):

```powershell
# $env:MONGO_URI = "mongodb://username:password@host:port/dbname"
node app.js
```

Note: The current code reads the MongoDB URL directly from `app.js` and `init/index.js`. If you wish to centralize configuration, update those files to read from `process.env.MONGO_URI`.

## Run the app

Start the server:

```powershell
node app.js
```

The server listens on port `8080`. Open http://localhost:8080 in your browser. Primary listing index is at:

```
http://localhost:8080/listings
```

## Seed the database (sample data)

There is an `init` script that attempts to insert sample listings into the database. To seed the DB run:

```powershell
node init/index.js
```

Make sure MongoDB is running and reachable at the configured URI before seeding. The `init` folder reads `init/data.js` and inserts those records into the `listings` collection.

If you run the seed multiple times you may create duplicate entries.

## Routes

The application exposes the following user-facing routes (server-rendered EJS views):

- GET `/` — simple root; returns "Hello World" (placeholder)
- GET `/listings` — index: show all listings (renders `views/listings/index.ejs`)
- GET `/listings/new` — form to create a new listing (renders `views/listings/new.ejs`)
- POST `/listings` — create a new listing (form submit)
- GET `/listings/:id` — show a single listing (renders `views/listings/show.ejs`)
- GET `/listings/:id/edit` — edit form for a listing (renders `views/listings/edit.ejs`)
- PUT `/listings/:id` — update a listing (method override from form)
- DELETE `/listings/:id` — delete a listing (method override from form)

Notes about method override:

- HTML forms only support GET and POST. This project uses the `method-override` middleware and conventions such as adding a hidden `_method` field or using `?_method=PUT` in the action URL to perform PUT/DELETE.

## Data model

Model: `Listing` (Mongoose)

Fields (from `models/listing.js`):

- `title` (String, required)
- `description` (String, required)
- `image` (String, optional — default placeholder URL)
- `price` (Number, required)
- `country` (String, optional)

Example document:

```json
{
	"title": "Cozy mountain cabin",
	"description": "A small cabin with amazing valley views",
	"image": "https://example.com/img.jpg",
	"price": 120,
	"country": "Nepal"
}
```

## Project structure

```
. 
├─ app.js                # main Express application
├─ package.json
├─ readme.md
├─ init/
│  ├─ index.js           # script that seeds sample data
│  └─ data.js            # sample listing objects
├─ models/
│  └─ listing.js         # Mongoose Listing model
└─ views/
	 └─ listings/          # EJS templates for index/new/edit/show
```

## Examples (curl)

Create a listing (form-style POST):

```powershell
curl -X POST http://localhost:8080/listings -d "title=Beach%20House&description=Sea%20view&price=250&country=Spain"
```

Update a listing (using method override query param):

```powershell
curl -X POST "http://localhost:8080/listings/<LISTING_ID>?_method=PUT" -d "title=Updated%20title&price=300"
```

Delete a listing (using method override query param):

```powershell
curl -X POST "http://localhost:8080/listings/<LISTING_ID>?_method=DELETE"
```

Replace `<LISTING_ID>` with the `_id` of the document.

## Contributing

This is a small learning demo. If you'd like to contribute improvements:

1. Fork the repo
2. Create a feature branch
3. Open a pull request describing your changes

Suggested improvements:

- Add environment-based configuration for MongoDB URIs
- Add basic request validation and flash messages
- Add tests and linting

## License

This repository does not include an explicit license. Add a `LICENSE` file if you want to permit reuse.

---

If you want, I can also:

- update `app.js` and `init/index.js` to read `MONGO_URI` from the environment,
- add an npm `start` script to `package.json`, or
- add a small README badge and screenshots.

Tell me which of those you'd like next.
