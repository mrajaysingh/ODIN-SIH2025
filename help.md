React JS with MapTiler maps
In this step-by-step tutorial, you’ll learn how to create a React JS component that leverages the power of MapTiler SDK JS mapping library to render maps. Together we will build a simple full-screen map application, serving as a practical example of how to seamlessly integrate MapTiler maps into your own React app.

By the end of this tutorial, you will be able to create a full-screen map with a marker placed at a specified location. With your newfound knowledge, you will be able to create visually stunning maps within your React projects. Take a sneak peek at the final output of this tutorial below:

Display MapTiler SDK JS map using React JS

Getting started
Minimal requirements for completing this tutorial.

Basic React JS knowledge. You don’t need a lot of experience using React for this tutorial, but you should be familiar with basic concepts and workflow.

MapTiler API key. Your MapTiler account access key is on your MapTiler Cloud account page or Get API key for FREE.

MapTiler SDK JS. JavaScript library for building web maps. In this tutorial, you will learn how to install it.

Node.js and npm. Necessary to run your React app locally. Node.js

Create an app
In this step, we are going to learn how to create a React app.

To create a new react project run in your command-line:

npm create vite my-react-map -- --template react
Bash
create vite will create a simple one-page application in React. For more information follow Scaffolding Your First Vite Project.

Navigate to the newly created project folder my-react-map

cd my-react-map
Bash
Inside the newly created project, run npm install to install the dependencies.

To start your local environment, run npm run dev. You will find your app running on the address http://localhost:5173/.

Now you should see the app in your browser.

Vite + React app

Installation and setting up
To install MapTiler SDK JS library, navigate to your project folder and run the command:

npm i @maptiler/sdk
Bash
Navigate to the src folder and delete all the contents of the index.css file.

Navigate to the src folder and replace all the contents of the App.css file with the following lines:

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
  'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
  sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
  monospace;
}
CSS
Replace all the contents of the App.jsx file with the following lines:

import './App.css';

function App() {
  return (
    <div className="App">
    This is my map App
    </div>
  );
}

export default App;
React JSX
Now you should see “This is my map App“ in your browser.

Create a navbar component
In this step, we will create a simple heading navbar component.

Create a new folder called components inside the src folder.

Create a new file called navbar.jsx inside the components folder and write these lines:

import React from 'react';
import './navbar.css';

export default function Navbar(){
  return (
    <div className="heading">
    <h1>This is my map App</h1>
    </div>
  );
}
React JSX
Create a new file called navbar.css inside the components folder and write these lines:

.heading {
  margin: 0;
  padding: 0px;
  background-color: 
black;
  color: 
white;
  text-align: center;
}

.heading > h1 {
  padding: 20px;
  margin: 0;
}
CSS
Finally, to display the Navbar we need to import the Navbar component and add it to our main component App.jsx.

Import the navbar component into App.jsx write the following line at the beginning of the file

import Navbar from './components/navbar.jsx';
React JSX
Replace the text This is my map App with <Navbar />. Your App.jsx file should look like this:

import Navbar from './components/navbar.jsx';
import './App.css';

function App() {
  return (
    <div className="App">
    <Navbar/>
    </div>
  );
}

export default App;
React JSX
Now you should see the black navbar at the top of your browser.

App navigation bar

Create a map component
In this step, we will create a simple map component.

Create a new file called map.jsx inside the components folder.

First, we’ll import MapTiler SDK JS and the required React functions. Add these lines on top of map.jsx file.

import React, { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';
React JSX
Now we will create a function as our map component.

export default function Map() {
}
React JSX
And set up your map’s default state.

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const tokyo = { lng: 139.753, lat: 35.6844 };
  const zoom = 14;
  maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';
}
React JSX
The state stores the map object, its container. Longitude, latitude, and zoom for the map will all change as your user interacts with the map.

Replace YOUR_MAPTILER_API_KEY_HERE with your own API key. Make sure to protect the key before publishing your map app!

In the next step, we will initialize the map in the Map() function.

useEffect(() => {
  if (map.current) return; // stops map from intializing more than once

  map.current = new maptilersdk.Map({
    container: mapContainer.current,
    style: maptilersdk.MapStyle.STREETS,
    center: [tokyo.lng, tokyo.lat],
    zoom: zoom
  });

}, [tokyo.lng, tokyo.lat, zoom]);
React JSX
This code will be right after the component is inserted into the DOM tree. We initialize the map using React effect hook and we also set up some basic options of the map:

The container option sets the DOM element in which will the map be rendered. We will assign the ref our component expects to an HTML element, which will act as a container, later in this tutorial.

The style option defines what style is the map going to use.

The center and zoom options set the starting position of the map.

Now, we will add the return statement to your Map() function. Add the following code to your component above the closing curly brace of Map():

return (
  <div className="map-wrap">
    <div ref={mapContainer} className="map" />
  </div>
);
React JSX
The ref={mapContainer} specifies that App should be drawn to the HTML page in the <div> element.

We are finished with our basic map component, your map.jsx file should look like this:

import React, { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const tokyo = { lng: 139.753, lat: 35.6844 };
  const zoom = 14;
  maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [tokyo.lng, tokyo.lat],
      zoom: zoom
    });

  }, [tokyo.lng, tokyo.lat, zoom]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
React JSX
Now we will need simple styling to render the map correctly. Create a file named map.css in components folder for the map component style and write the following code to your map.css file:

.map-wrap {
  position: relative;
  width: 100%;
  height: calc(100vh - 77px); /* calculate height of the screen minus the heading */
}

.map {
  position: absolute;
  width: 100%;
  height: 100%;
}
CSS
We use position: absolute on the map itself and position: relative on the wrap around the map for more possibilities in future styling.

Render a map
Now we will import the map component into your app, add the following line to the top of the App.jsx.

import Map from './components/map.jsx';
React JSX
And then, add the imported <Map/> component in your App() function. Your App.jsx file should then look like this:

import React from 'react';
import Map from './components/map.jsx';
import Navbar from './components/navbar.jsx';
import './App.css';

function App() {
  return(
    <div className="App">
      <Navbar/>
      <Map/>
    </div>
  )
}

export default App;
React JSX
With everything done up until now, you should be able see your beautiful map in your browser.

Full-screen map

Map marker
Another basic thing to add to your map could be a marker of some location.

In the next line where we declare the navigation control we add these lines:

new maptilersdk.Marker({color: "#FF0000"})
  .setLngLat([139.7525,35.6846])
  .addTo(map.current);
React JSX
We create a new marker using the .marker function. We added the color option to make it red, then set Lng/Lat of the marker using .setLngLat() function , and finally added it to the current map using .addTo() function.

We are finished with our basic map objects, your map.js file should look like this:

import React, { useRef, useEffect } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './map.css';

export default function Map() {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const tokyo = { lng: 139.753, lat: 35.6844 };
  const zoom = 14;
  maptilersdk.config.apiKey = 'YOUR_MAPTILER_API_KEY_HERE';

  useEffect(() => {
    if (map.current) return; // stops map from intializing more than once

    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.STREETS,
      center: [tokyo.lng, tokyo.lat],
      zoom: zoom
    });

    new maptilersdk.Marker({color: "#FF0000"})
      .setLngLat([139.7525,35.6846])
      .addTo(map.current);
  }, [tokyo.lng, tokyo.lat, zoom]);

  return (
    <div className="map-wrap">
      <div ref={mapContainer} className="map" />
    </div>
  );
}
React JSX
Display MapTiler SDK JS map using React JS

What’s next
To enhance your map app, check out our series on maps in React. In the episodes, you’ll learn how to add popups, a visualization switcher, geocoding control, 3D terrain, and a sidebar:

Build a map app with Material UI
Add points from GeoJSON
Create a heatmap
Add popups and sidebar
Add place search (geocoding control) to a map
Create a 3D terrain map with place search
Also, you can check more than 200 SDK JS examples to see the limitless possibilities of MapTiler SDK JS and unlock the full potential of your React applications. It offers easy terrain, built-in styles, language switching, geocoding, TypeScript power, optional IP geolocation, etc.