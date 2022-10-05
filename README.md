# drawdist.app 

## Overview

[drawdist.app](https://drawdist.app) is a web application that lets your draw an arbitrary probability distribution function and then draw samples from the distribution. Samples are automatically copied to clipboard however they can also be downloaded.

Users may also upload a photo as a reference image to trace for the distribution (for example a bar chart 📊 or a visual representation of an unknown function 📈).

drawdist.app is build entirely in ReactJS and all the code runs locally in the users browser. The app is compatible with multiple platforms and works with both a mouse and touch events.

**If you enjoy [drawdist.app](https://drawdist.app) you can [support us on Ko-fi!](https://ko-fi.com/jamesandowen)**

# Getting Started

## First time setup
```
npm ci
```

## Running the project for development
```
npm start
```

## Building for Production
```
npm run build
```


# Codebase Structure

## src 
src holds the website source code.

### calcs 
Calcs holds all the JavaScript code required to perform the calculations that covert the provided PDF into a CDF which can be used to draw samples from

### components

### contexts
The contexts folder holds the global state of the application, state is managed exclusively with the React context API.