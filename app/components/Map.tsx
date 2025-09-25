'use client';

import { useRef, useEffect, useState } from 'react';
import lottie from 'lottie-web';
import * as maptilersdk from '@maptiler/sdk';
import '@maptiler/sdk/dist/maptiler-sdk.css';
import proximityAlertsData from '../../data/proximityAlerts.json';

interface MapProps {
  className?: string;
}

export default function Map({ className = '' }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maptilersdk.Map | null>(null);
  const [isSatelliteView, setIsSatelliteView] = useState(true);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isReloading, setIsReloading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [mapOpacity, setMapOpacity] = useState(1);
  const [isGridEnabled] = useState(true);
  
  // Default location coordinates
  const defaultLocation = {
    lat: 8.031127,
    lng: 76.140737
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || map.current || !mapContainer.current) return;

    // Set your MapTiler API key
    maptilersdk.config.apiKey = 'Slx857nSZ7JmUiCsJzsj';

    // Initialize the map with satellite view by default
    map.current = new maptilersdk.Map({
      container: mapContainer.current,
      style: maptilersdk.MapStyle.SATELLITE,
      center: [defaultLocation.lng, defaultLocation.lat], // [lng, lat] - Default location
      zoom: 6.5,
      minZoom: 4,
      // Disable all default controls to have full control
      attributionControl: false,
      // Disable all default navigation controls
      navigationControl: false,
      // Disable compass control by not adding it to the map
      // The compass control is not added by default, so we don't need to explicitly disable it
    });

    // Wait for map to load before adding controls
    map.current.on('load', () => {
      // Remove any existing navigation controls first
      const existingControls = mapContainer.current?.querySelectorAll('.maplibregl-ctrl-group');
      existingControls?.forEach(control => control.remove());

      // Add only ONE navigation control (zoom in/out) without compass
      map.current?.addControl(new maptilersdk.NavigationControl({
        showCompass: false, // This explicitly disables the compass
        showZoom: true
      }), 'top-right');

      // Add place labels to the map
      addPlaceLabels();

      // Initialize grid overlay
      if (isGridEnabled) {
        ensureGridLayers();
        updateGrid();
        map.current?.on('moveend', updateGrid);
        map.current?.on('zoomend', updateGrid);
      }

      // Wait until preloader is not active before adding hotspots
      waitForPreloaderInactive().then(() => {
        // Load alerts dynamically from data file
        loadProximityAlerts();
      });
    });

    // Additional cleanup to prevent duplicates
    const cleanup = () => {
      const allControls = mapContainer.current?.querySelectorAll('.maplibregl-ctrl-group');
      if (allControls && allControls.length > 1) {
        // Keep only the first control group, remove the rest
        for (let i = 1; i < allControls.length; i++) {
          allControls[i].remove();
        }
      }
    };

    // Run cleanup after a short delay to ensure all controls are rendered
    setTimeout(cleanup, 100);

    // Explicitly do NOT add geolocate control (find my location)
    // This ensures the "find my location" button won't appear

    // Optional: Add other controls you might want
    // map.current.addControl(new maptilersdk.FullscreenControl(), 'top-right');

    return () => {
      if (map.current) {
        // Remove grid listeners
        if (isGridEnabled) {
          map.current.off('moveend', updateGrid);
          map.current.off('zoomend', updateGrid);
        }
        map.current.remove();
        map.current = null;
      }
    };
  }, [isMounted]);

  // Wait until the preloader body class is removed
  const waitForPreloaderInactive = (): Promise<void> => {
    return new Promise((resolve) => {
      if (typeof document === 'undefined') return resolve();
      const isInactive = () => !document.body.classList.contains('preloader-active');
      if (isInactive()) return resolve();
      const observer = new MutationObserver(() => {
        if (isInactive()) {
          observer.disconnect();
          resolve();
        }
      });
      observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    });
  };

  // Function to load proximity alerts from data file and place them on map
  const loadProximityAlerts = () => {
    if (!map.current || !proximityAlertsData.alerts) {
      console.log('Map or alerts data not available');
      return;
    }

    console.log('Loading proximity alerts:', proximityAlertsData.alerts.length, 'alerts found');
    
    const coordinates = proximityAlertsData.alerts.map(alert => [alert.coordinates.lng, alert.coordinates.lat]);
    console.log('Alert coordinates:', coordinates);

    // Add all alerts to the map synchronously to ensure identical conditions
    console.log('Creating all markers synchronously...');
    proximityAlertsData.alerts.forEach((alert, index) => {
      console.log(`Adding alert ${index + 1}:`, alert.id, 'at coordinates:', alert.coordinates);
      
      addAlertHotspotConfigured(
        alert.coordinates.lng,
        alert.coordinates.lat,
        {
          lottiePath: alert.lottiePath,
          title: alert.title,
          alertType: alert.alertName,
          timeToCoast: alert.timeToCoast,
          evacuationTime: alert.evacuationTime,
          wind: alert.windSpeed,
          observer: alert.observer,
          colors: alert.colors,
          markerColor: alert['marker-color']
        },
        index // Pass the index for debugging
      );
    });
    console.log('All markers created successfully');

    // Fit all alert markers in view if there are any
    if (coordinates.length > 0) {
      const lngs = coordinates.map(coord => coord[0]);
      const lats = coordinates.map(coord => coord[1]);
      const sw: [number, number] = [Math.min(...lngs), Math.min(...lats)];
      const ne: [number, number] = [Math.max(...lngs), Math.max(...lats)];
      console.log('Fitting bounds:', { sw, ne });
      map.current?.fitBounds([sw, ne], { padding: 80, duration: 800 });
    }
  };

  // Add configurable hotspot with custom lottie and popup styling/content
  const addAlertHotspotConfigured = (
    lng: number,
    lat: number,
    options: {
      lottiePath: string;
      title: string;
      alertType: string;
      timeToCoast: string;
      evacuationTime: string;
      wind: string;
      observer: string;
      colors: { bg: string; border: string; text: string };
      markerColor: string;
     },
     index?: number
  ) => {
    if (!map.current) return;

    console.log(`Creating marker ${index !== undefined ? index + 1 : '?'} for alert at ${lng}, ${lat}`);
    
    // Create a simple, consistent marker element without Lottie animations to test positioning
    const markerElement = document.createElement('div');
    markerElement.style.width = '30px';
    markerElement.style.height = '30px';
    markerElement.style.borderRadius = '50%';
    markerElement.style.pointerEvents = 'auto';
    markerElement.style.cursor = 'pointer';
    markerElement.style.display = 'flex';
    markerElement.style.alignItems = 'center';
    markerElement.style.justifyContent = 'center';
    markerElement.style.fontSize = '12px';
    markerElement.style.fontWeight = 'bold';
    markerElement.style.color = 'white';
    markerElement.style.boxSizing = 'border-box';
    markerElement.style.border = '3px solid white';
    markerElement.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';

    // Use marker color from the JSON data
    const backgroundColor = options.markerColor;
    
    markerElement.style.backgroundColor = backgroundColor;
    
    console.log(`Creating marker at ${lng}, ${lat} with background: ${backgroundColor}`);
    
// Create the marker with the simple element

    const marker = new maptilersdk.Marker({ 
     element: markerElement,
      anchor: 'center',

      offset: [0, 0]
    })
      .setLngLat([lng, lat])
      .addTo(map.current);


      console.log(`Marker ${index !== undefined ? index + 1 : '?'} successfully added to map at ${lng}, ${lat}`);
    
    // Force a refresh of the marker position
    setTimeout(() => {
      marker.setLngLat([lng, lat]);
      console.log(`Position refreshed for marker ${index !== undefined ? index + 1 : '?'} at ${lng}, ${lat}`);
    }, 100);
      

    const popupHtml = `
      <div style="min-width:220px;max-width:260px;background:${options.colors.bg};color:${options.colors.text};border:1px solid ${options.colors.border};border-radius:8px;padding:10px;box-shadow:0 6px 16px rgba(0,0,0,0.25)">
        <div style="font-weight:700;margin-bottom:6px">${options.title}</div>
        <div style="font-size:12px;display:flex;justify-content:space-between;margin-bottom:2px">
          <span>Alert</span><span style="font-weight:700">${options.alertType}</span>
        </div>
        <div style="font-size:12px;display:flex;justify-content:space-between;margin-bottom:2px">
          <span>Time to Coast</span><span style="font-weight:700">${options.timeToCoast}</span>
        </div>
        <div style="font-size:12px;display:flex;justify-content:space-between;margin-bottom:2px">
          <span>Evacuation Time</span><span style="font-weight:700">${options.evacuationTime}</span>
        </div>
        <div style="font-size:12px;display:flex;justify-content:space-between;margin-bottom:2px">
          <span>Wind</span><span style="font-weight:700">${options.wind}</span>
        </div>
        <div style="font-size:12px;display:flex;justify-content:space-between;margin-bottom:6px">
          <span>Observer</span><span style="font-weight:700">${options.observer}</span>
        </div>
        <div style="font-size:11px;opacity:0.85">Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}</div>
      </div>
    `;

    const popup = new maptilersdk.Popup({ closeButton: true, closeOnMove: false, closeOnClick: false, offset: 12 })
      .setHTML(popupHtml);

    let hoveringContainer = false;
    let hoveringPopup = false;
    const conditionalHide = () => {
      setTimeout(() => {
        if (!hoveringContainer && !hoveringPopup) {
          popup.remove();
        }
      }, 80);
    };
    const onContainerEnter = () => { hoveringContainer = true; show(); };
    const onContainerLeave = () => { hoveringContainer = false; conditionalHide(); };
    const onClick = (e: MouseEvent) => { e.stopPropagation(); show(); };

    const onPopupEnter = () => { hoveringPopup = true; };
    const onPopupLeave = () => { hoveringPopup = false; conditionalHide(); };

    const show = () => {
      popup.setLngLat([lng, lat]).addTo(map.current!);
    };

    // Attach popup hover listeners only when popup is opened and element exists
    popup.on('open', () => {
      const el = popup.getElement();
      if (!el) return;
      el.addEventListener('mouseenter', onPopupEnter);
      el.addEventListener('mouseleave', onPopupLeave);
    });

    markerElement.addEventListener('mouseenter', onContainerEnter);
    markerElement.addEventListener('mouseleave', onContainerLeave);
    markerElement.addEventListener('click', onClick);

    return () => {
      markerElement.removeEventListener('mouseenter', onContainerEnter);
      markerElement.removeEventListener('mouseleave', onContainerLeave);
      markerElement.removeEventListener('click', onClick);
      const el = popup.getElement();
      if (el) {
        el.removeEventListener('mouseenter', onPopupEnter);
        el.removeEventListener('mouseleave', onPopupLeave);
      }
      popup.remove();
      marker.remove();
    };
  };

  // Add a Lottie hotspot marker at [lng, lat]
  const addAlertHotspot = (lng: number, lat: number) => {
    if (!map.current) return;

    const container = document.createElement('div');
    container.style.width = '84px';
    container.style.height = '84px';
    container.style.pointerEvents = 'auto';
    container.style.zIndex = '9999';
    container.style.position = 'relative';
    container.style.cursor = 'pointer';
    container.style.transform = 'translate(-50%, -50%)';

    lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/animation/hotspot/danger-red.json',
      rendererSettings: { preserveAspectRatio: 'xMidYMid slice' },
    });

    const marker = new maptilersdk.Marker({ element: container, anchor: 'center' })
      .setLngLat([lng, lat])
      .addTo(map.current);

    // Popup content for proximity alert
    const popupHtml = `
      <div style="min-width:220px;max-width:260px;background:#dc2626;color:#ffffff;border:1px solid #b91c1c;border-radius:8px;padding:10px;box-shadow:0 6px 16px rgba(0,0,0,0.25)">
        <div style="font-weight:700;margin-bottom:6px">Proximity Alert</div>
        <div style="font-size:12px;display:flex;justify-content:space-between;margin-bottom:2px">
          <span>Alert</span><span style="font-weight:700">Tsunami</span>
        </div>
        <div style="font-size:12px;display:flex;justify-content:space-between;margin-bottom:2px">
          <span>Time to Coast</span><span style="font-weight:700">35 min</span>
        </div>
        <div style="font-size:12px;display:flex;justify-content:space-between;margin-bottom:2px">
          <span>Evacuation Time</span><span style="font-weight:700">20 min</span>
        </div>
        <div style="font-size:12px;display:flex;justify-content:space-between;margin-bottom:2px">
          <span>Wind</span><span style="font-weight:700">28 km/h ↗ NE</span>
        </div>
        <div style="font-size:12px;display:flex;justify-content:space-between;margin-bottom:6px">
          <span>Observer</span><span style="font-weight:700">ODIN Watch</span>
        </div>
        <div style="font-size:11px;opacity:0.85">Lat ${lat.toFixed(6)}, Lng ${lng.toFixed(6)}</div>
      </div>
    `;

    const popup = new maptilersdk.Popup({ closeButton: true, closeOnMove: false, closeOnClick: false, offset: 12 })
      .setHTML(popupHtml);

    // Show popup on hover and click
    let hoveringContainer = false;
    let hoveringPopup = false;
    const show = () => popup.setLngLat([lng, lat]).addTo(map.current!);
    const conditionalHide = () => {
      // Delay slightly to allow pointer to move between marker and popup
      setTimeout(() => {
        if (!hoveringContainer && !hoveringPopup) {
          popup.remove();
        }
      }, 80);
    };
    const onContainerEnter = () => {
      hoveringContainer = true;
      show();
    };
    const onContainerLeave = () => {
      hoveringContainer = false;
      conditionalHide();
    };
    const onClick = (e: MouseEvent) => { e.stopPropagation(); show(); };

    container.addEventListener('mouseenter', onContainerEnter);
    container.addEventListener('mouseleave', onContainerLeave);
    container.addEventListener('click', onClick);

    // Track popup hover state
    const popupEl = popup.getElement();
    const onPopupEnter = () => { hoveringPopup = true; };
    const onPopupLeave = () => { hoveringPopup = false; conditionalHide(); };
    popupEl.addEventListener('mouseenter', onPopupEnter);
    popupEl.addEventListener('mouseleave', onPopupLeave);

    // Return cleanup
    return () => {
      container.removeEventListener('mouseenter', onContainerEnter);
      container.removeEventListener('mouseleave', onContainerLeave);
      container.removeEventListener('click', onClick);
      const el = popup.getElement();
      el.removeEventListener('mouseenter', onPopupEnter);
      el.removeEventListener('mouseleave', onPopupLeave);
      popup.remove();
    };
  };

  // Function to add place labels to the map
  const addPlaceLabels = () => {
    if (!map.current) return;

    // Wait for the style to be fully loaded
    if (!map.current.isStyleLoaded()) {
      map.current.on('styledata', () => {
        addPlaceLabels();
      });
      return;
    }

    // Add vector source for labels if it doesn't exist
    if (!map.current.getSource('maptiler-vector')) {
      map.current.addSource('maptiler-vector', {
        type: 'vector',
        url: 'https://api.maptiler.com/tiles/v3/tiles.json?key=Slx857nSZ7JmUiCsJzsj'
      });
    }

    // Add place points (markers for cities, towns, etc.)
    if (!map.current.getLayer('place-points')) {
      map.current.addLayer({
        id: 'place-points',
        type: 'circle',
        source: 'maptiler-vector',
        'source-layer': 'place',
        layout: {
          visibility: 'visible'
        },
        paint: {
          'circle-color': [
            'case',
            // All coastal/ocean-near locations - Red
            ['in', ['get', 'name'], ['literal', [
              // Major coastal cities
              'Mumbai', 'Chennai', 'Kolkata', 'Kochi', 'Cochin', 'Visakhapatnam', 'Vizag', 
              'Surat', 'Panaji', 'Goa', 'Puducherry', 'Pondicherry', 'Ernakulam','colachel',
              // Major sea ports
              'Jawaharlal Nehru Port', 'JNPT', 'Navi Mumbai', 'Kandla', 'Deendayal Port',
              'Mormugao Port', 'New Mangalore Port', 'Paradip Port', 'Port Blair Port',
              'Tuticorin', 'V.O. Chidambaranar Port',
              // Coastal towns and villages
              'Diu', 'Porbandar', 'Daman', 'Alappuzha', 'Nagapattinam', 'Gokarna', 
              'Varkala', 'Puri', 'Kovalam', 'Mararikulam', 'Karwar', 'Udupi', 
              'Maravanthe', 'Machilipatnam', 'Kozhikode', 'Thiruvananthapuram', 
              'Kannur', 'Kasaragod', 'Kollam', 'Thrissur', 'Malappuram', 'Palakkad', 
              'Kottayam', 'Mangalore', 'Bhavnagar',
              // Island locations
              'Lakshadweep', 'Andaman', 'Nicobar', 'Minicoy', 'Kavaratti', 'Agatti', 
              'Port Blair', 'Bangaram Island', 'Agatti Island'
            ]]],
            '#E7000B',
            // Safe inland places - White (default)
            '#ffffff'
          ],
          'circle-radius': 3,
          'circle-stroke-color': '#000000',
          'circle-stroke-width': 1
        }
      });
    }

    // Add place labels (cities, towns, etc.)
    if (!map.current.getLayer('place-labels')) {
      map.current.addLayer({
        id: 'place-labels',
        type: 'symbol',
        source: 'maptiler-vector',
        'source-layer': 'place',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Lato', 'Arial Unicode MS Regular'],
          'text-size': 12,
          'text-transform': 'uppercase',
          'text-letter-spacing': 0.1,
          'text-offset': [0, 1.5],
          'text-anchor': 'top'
        },
        paint: {
          'text-color': '#ffffff'
        }
      });
    }

    // Add road labels
    if (!map.current.getLayer('road-labels')) {
      map.current.addLayer({
        id: 'road-labels',
        type: 'symbol',
        source: 'maptiler-vector',
        'source-layer': 'transportation_name',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Lato', 'Arial Unicode MS Regular'],
          'text-size': 10,
          'text-transform': 'uppercase',
          'text-letter-spacing': 0.1,
          'symbol-placement': 'line',
          'text-rotation-alignment': 'map'
        },
        paint: {
          'text-color': '#ffffff'
        }
      });
    }
  };

  // Function to toggle between satellite and street view
  const toggleSatelliteView = () => {
    if (map.current) {
      const newStyle = isSatelliteView ? maptilersdk.MapStyle.STREETS : maptilersdk.MapStyle.SATELLITE;
      map.current.setStyle(newStyle);
      setIsSatelliteView(!isSatelliteView);
      
      // Add place labels after style change
      setTimeout(() => {
        addPlaceLabels();
        if (isGridEnabled) {
          ensureGridLayers();
          updateGrid();
        }
      }, 100);
    }
  };

  // Function to reset map to default location
  const resetToDefaultLocation = () => {
    if (map.current) {
      map.current.flyTo({
        center: [defaultLocation.lng, defaultLocation.lat],
        zoom: 6.5,
        bearing: 0, // Reset bearing to north (0 degrees)
        duration: 1000 // Animation duration in milliseconds
      });
    }
  };

  // Function to reload/refresh the map with loading states
  const reloadMap = async () => {
    if (map.current && !isReloading) {
      setIsReloading(true);
      setLoadingStep('Fetching data...');
      
      // Get current map state
      const currentCenter = map.current.getCenter();
      const currentZoom = map.current.getZoom();
      const currentBearing = map.current.getBearing();
      const currentStyle = map.current.getStyle();
      
      // Fade out the map
      setMapOpacity(0);
      
      // Wait for fade out
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Remove the current map
      map.current.remove();
      map.current = null;
      
      setLoadingStep('Plotting map...');
      
      // Wait a bit for the loading step to be visible
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Reinitialize map
      if (!map.current && mapContainer.current) {
        // Set your MapTiler API key
        maptilersdk.config.apiKey = 'Slx857nSZ7JmUiCsJzsj';

        // Initialize the map with current state
        map.current = new maptilersdk.Map({
          container: mapContainer.current,
          style: currentStyle || maptilersdk.MapStyle.SATELLITE,
          center: [currentCenter.lng, currentCenter.lat],
          zoom: currentZoom,
          minZoom: 4,
          bearing: currentBearing,
          attributionControl: false,
          navigationControl: false,
        });

        // Wait for map to load before adding controls
        map.current.on('load', () => {
          setLoadingStep('Loading alerts...');
          
          // Remove any existing navigation controls first
          const existingControls = mapContainer.current?.querySelectorAll('.maplibregl-ctrl-group');
          existingControls?.forEach(control => control.remove());

          // Add only ONE navigation control (zoom in/out) without compass
          map.current?.addControl(new maptilersdk.NavigationControl({
            showCompass: false,
            showZoom: true
          }), 'top-right');

          // Add place labels to the map
          addPlaceLabels();
          
          // Initialize grid overlay
          if (isGridEnabled) {
            ensureGridLayers();
            updateGrid();
            map.current?.on('moveend', updateGrid);
            map.current?.on('zoomend', updateGrid);
          }
          
          // Wait until preloader is not active before adding hotspots
          waitForPreloaderInactive().then(() => {
            // Reload proximity alerts from data file
            loadProximityAlerts();
            
            setLoadingStep('Data loaded');
            
            // Wait a bit then fade in
            setTimeout(() => {
              setMapOpacity(1);
              setTimeout(() => {
                setIsReloading(false);
                setLoadingStep('');
              }, 500);
            }, 500);
          });
        });

        // Additional cleanup to prevent duplicates
        const cleanup = () => {
          const allControls = mapContainer.current?.querySelectorAll('.maplibregl-ctrl-group');
          if (allControls && allControls.length > 1) {
            for (let i = 1; i < allControls.length; i++) {
              allControls[i].remove();
            }
          }
        };

        setTimeout(cleanup, 100);
      }
    }
  };

  // ----- Grid Overlay -----
  type Feature = GeoJSON.Feature<GeoJSON.Geometry, { [key: string]: any }>;
  type FeatureCollection = GeoJSON.FeatureCollection<GeoJSON.Geometry, { [key: string]: any }>;

  const getGridStepForZoom = (zoom: number): number => {
    if (zoom >= 12) return 0.01; // ~1.1km at equator
    if (zoom >= 10) return 0.05;
    if (zoom >= 8) return 0.1;
    if (zoom >= 6) return 0.25;
    if (zoom >= 4) return 0.5;
    if (zoom >= 2) return 1;
    return 2;
  };

  const clampBounds = (bounds: maptilersdk.LngLatBounds): maptilersdk.LngLatBounds => {
    const west = Math.max(-180, bounds.getWest());
    const south = Math.max(-85, bounds.getSouth());
    const east = Math.min(180, bounds.getEast());
    const north = Math.min(85, bounds.getNorth());
    return new maptilersdk.LngLatBounds([west, south], [east, north]);
  };

  const buildGridData = (bounds: maptilersdk.LngLatBounds, step: number): { lines: FeatureCollection; points: FeatureCollection } => {
    const clamped = clampBounds(bounds);
    const west = clamped.getWest();
    const south = clamped.getSouth();
    const east = clamped.getEast();
    const north = clamped.getNorth();

    const startLon = Math.floor(west / step) * step;
    const endLon = Math.ceil(east / step) * step;
    const startLat = Math.floor(south / step) * step;
    const endLat = Math.ceil(north / step) * step;

    const lineFeatures: Feature[] = [];
    const pointFeatures: Feature[] = [];

    let lineCount = 0;
    const maxLines = 500;

    // Vertical lines (constant lon)
    for (let lon = startLon; lon <= endLon && lineCount < maxLines; lon = +(lon + step).toFixed(10)) {
      lineFeatures.push({
        type: 'Feature',
        properties: { kind: 'lon', lon },
        geometry: {
          type: 'LineString',
          coordinates: [ [lon, south], [lon, north] ]
        }
      });
      lineCount++;
    }

    // Horizontal lines (constant lat)
    for (let lat = startLat; lat <= endLat && lineCount < maxLines; lat = +(lat + step).toFixed(10)) {
      lineFeatures.push({
        type: 'Feature',
        properties: { kind: 'lat', lat },
        geometry: {
          type: 'LineString',
          coordinates: [ [west, lat], [east, lat] ]
        }
      });
      lineCount++;
    }

    // Points at intersections (labels)
    const maxPoints = 2000;
    let pointCount = 0;
    for (let lon = startLon; lon <= endLon && pointCount < maxPoints; lon = +(lon + step).toFixed(10)) {
      for (let lat = startLat; lat <= endLat && pointCount < maxPoints; lat = +(lat + step).toFixed(10)) {
        const label = `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
        pointFeatures.push({
          type: 'Feature',
          properties: { label, lat, lon },
          geometry: { type: 'Point', coordinates: [lon, lat] }
        });
        pointCount++;
      }
    }

    return {
      lines: { type: 'FeatureCollection', features: lineFeatures },
      points: { type: 'FeatureCollection', features: pointFeatures }
    };
  };

  const ensureGridLayers = () => {
    if (!map.current) return;
    const m = map.current;

    if (!m.getSource('grid-lines')) {
      m.addSource('grid-lines', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    }
    if (!m.getLayer('grid-lines')) {
      m.addLayer({
        id: 'grid-lines',
        type: 'line',
        source: 'grid-lines',
        paint: {
          'line-color': '#ffffff',
          'line-opacity': 0.05,
          'line-blur': [ 'interpolate', ['linear'], ['zoom'], 4, 0.2, 8, 0.6, 12, 1.2 ],
          'line-width': [ 'interpolate', ['linear'], ['zoom'], 4, 0.25, 8, 0.75, 12, 1.25 ]
        }
      });
    }

    if (!m.getSource('grid-points')) {
      m.addSource('grid-points', { type: 'geojson', data: { type: 'FeatureCollection', features: [] } });
    }
    if (!m.getLayer('grid-point-labels')) {
      m.addLayer({
        id: 'grid-point-labels',
        type: 'symbol',
        source: 'grid-points',
        layout: {
          'text-field': ['get', 'label'],
          'text-size': [ 'interpolate', ['linear'], ['zoom'], 4, 8, 8, 10, 12, 12 ],
          'text-anchor': 'center',
          'text-offset': [0, 0]
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': 'rgba(0,0,0,0.05)',
          'text-halo-width': 0.5,
          'text-opacity': 0.05
        }
      });
    }
  };

  const updateGrid = () => {
    if (!map.current) return;
    const m = map.current;
    const bounds = m.getBounds();
    const zoom = m.getZoom();
    const step = getGridStepForZoom(zoom);
    const { lines, points } = buildGridData(bounds, step);

    const linesSource = m.getSource('grid-lines') as maptilersdk.GeoJSONSource | undefined;
    const pointsSource = m.getSource('grid-points') as maptilersdk.GeoJSONSource | undefined;
    if (linesSource && 'setData' in linesSource) {
      (linesSource as any).setData(lines);
    }
    if (pointsSource && 'setData' in pointsSource) {
      (pointsSource as any).setData(points);
    }
  };

  // Function to get user's current location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLoadingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const location = { lat: latitude, lng: longitude };
        
        setUserLocation(location);
        
        if (map.current) {
          // Fly to user's location
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            duration: 1500
          });

          // Add a marker for user's location
          new maptilersdk.Marker({ 
            color: "#FF6900",
            scale: 1.2
          })
            .setLngLat([longitude, latitude])
            .setPopup(new maptilersdk.Popup().setHTML('<div class="text-center"><strong>Your Location</strong><br><small>Lat: ' + latitude.toFixed(6) + '<br>Lng: ' + longitude.toFixed(6) + '</small></div>'))
            .addTo(map.current);
        }
        
        setIsLoadingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        let errorMessage = 'Unable to retrieve your location.';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        
        alert(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  if (!isMounted) {
    return (
      <div className={`w-full h-full relative ${className}`}>
        <div className="w-full h-full rounded-[23px] bg-gray-200 flex items-center justify-center">
          <div className="text-gray-500">Loading map...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full relative ${className}`}>
      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-[23px] transition-opacity duration-500"
        style={{
          // Hide any potential geolocate controls that might appear
          '--maplibregl-ctrl-geolocate': 'none',
          opacity: mapOpacity
        } as React.CSSProperties}
      />
      
      {/* Loading Overlay */}
      {isReloading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center rounded-[23px] z-50">
          <div className="bg-white rounded-lg p-6 shadow-xl text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <div className="text-gray-700 font-medium">{loadingStep}</div>
          </div>
        </div>
      )}
      
      {/* Satellite View Toggle Button */}
      <button
        onClick={toggleSatelliteView}
        className="absolute top-4 left-4 z-10 bg-white hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg shadow-lg border border-gray-300 flex items-center gap-2 transition-colors duration-200"
        title={isSatelliteView ? "Switch to Street View" : "Switch to Satellite View"}
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d={isSatelliteView 
              ? "M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              : "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
            }
          />
        </svg>
        <span className="text-sm font-medium">
          {isSatelliteView ? "Street" : "Satellite"}
        </span>
      </button>

      {/* Get Current Location Button */}
      <button
        onClick={getUserLocation}
        disabled={isLoadingLocation}
        className="absolute bottom-4 left-4 z-10 bg-white hover:bg-gray-100 disabled:bg-gray-200 text-gray-700 px-3 py-2 rounded-lg shadow-lg border border-gray-300 flex items-center gap-2 transition-colors duration-200"
        title="Get My Current Location"
      >
        {isLoadingLocation ? (
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        )}
        <span className="text-sm font-medium">
          {isLoadingLocation ? "Locating..." : "My Location"}
        </span>
      </button>

      {/* Reload Map Button */}
      <button
        onClick={reloadMap}
        className="absolute bottom-4 right-32 z-10 bg-white hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg shadow-lg border border-gray-300 flex items-center gap-2 transition-colors duration-200"
        title="Reload Map"
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span className="text-sm font-medium">Reload</span>
      </button>

      {/* Reset to Default Location Button */}
      <button
        onClick={resetToDefaultLocation}
        className="absolute bottom-4 right-4 z-10 bg-white hover:bg-gray-100 text-gray-700 px-3 py-2 rounded-lg shadow-lg border border-gray-300 flex items-center gap-2 transition-colors duration-200"
        title="Reset to Default Location"
      >
        <svg 
          className="w-4 h-4" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
          />
        </svg>
        <span className="text-sm font-medium">Reset</span>
      </button>
    </div>
  );
}