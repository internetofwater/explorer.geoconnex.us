# [Geoconnex Explorer](https://explorer.geoconnex.us/)

## What is Geoconnex
The Geoconnex project provides technical infrastructure and guidance for creating an open, community-contribution model for a knowledge graph linking hydrologic features in the United States, published in accordance with [Spatial Data on the Web best practices](https://www.w3.org/TR/sdw-bp/) as an implementation of[ Internet of Water](https://github.com/opengeospatial/SELFIE/blob/master/docs/demo/internet_of_water.md) principles.

In short, Geoconnex aims to make water data as easily discoverable, accessible, and usable as possible.

## What is Geoconnex Explorer
Geoconnex Explorer is a web map interface for users to interact with and download datasets associated with mainstem data served from the [Geoconnex Reference Service](https://reference.geoconnex.us/)

## Running Geoconnex Explorer Locally

First, install necessary dependencies:

```bash
npm install
```

Add your ``MAPBOX_ACCESS_TOKEN`` to your `.env` file.
Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.
