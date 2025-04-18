'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Polyline, InfoWindow } from '@react-google-maps/api';

// Map container style
const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '8px',
};

// San Francisco coordinates as center
const center = {
  lat: 37.7749,
  lng: -122.4194
};

// Route coordinates (San Francisco to Los Angeles)
const routeCoordinates = [
  { lat: 37.7749, lng: -122.4194 }, // San Francisco
  { lat: 37.3382, lng: -121.8863 }, // San Jose
  { lat: 36.2048, lng: -120.8612 }, // Midpoint in Central Valley
  { lat: 35.3733, lng: -119.0187 }, // Bakersfield
  { lat: 34.0522, lng: -118.2437 }  // Los Angeles
];

// Truck current position (will be animated)
const initialTruckPosition = { ...routeCoordinates[0] };

// Waypoint markers
const waypoints = [
  { position: routeCoordinates[0], label: 'A', title: 'Pickup: San Francisco', info: '123 Market St, San Francisco, CA' },
  { position: routeCoordinates[4], label: 'B', title: 'Delivery: Los Angeles', info: '456 Main St, Los Angeles, CA' }
];

// Custom truck icon SVG
const truckSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" fill="#4F46E5">
  <path d="M48 0C21.5 0 0 21.5 0 48V368c0 26.5 21.5 48 48 48H64c0 53 43 96 96 96s96-43 96-96H384c0 53 43 96 96 96s96-43 96-96h32c17.7 0 32-14.3 32-32s-14.3-32-32-32V288 256 237.3c0-17-6.7-33.3-18.7-45.3L512 114.7c-12-12-28.3-18.7-45.3-18.7H416V48c0-26.5-21.5-48-48-48H48zM416 160h50.7L544 237.3V256H416V160zM112 416a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zm368-48a48 48 0 1 1 0 96 48 48 0 1 1 0-96z"/>
</svg>
`;

// Map options
const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  styles: [
    {
      featureType: 'poi',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'transit',
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#e9e9e9' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#ffffff' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#d6d6d6' }]
    }
  ]
};

const MapDisplay = () => {
  const [truckPosition, setTruckPosition] = useState(initialTruckPosition);
  const [routeProgress, setRouteProgress] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [truckHeading, setTruckHeading] = useState(0); // Truck rotation angle

  // Load Google Maps API
  const { isLoaded, loadError: jsApiLoadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCwh15QUndd0s2q4pfLvoB5OZ9xqzYJpQc' // Using the provided API key
  });

  // Handle load errors
  useEffect(() => {
    if (jsApiLoadError) {
      setLoadError('Failed to load Google Maps API. Please check your internet connection.');
      console.error('Google Maps API load error:', jsApiLoadError);
    }
  }, [jsApiLoadError]);

  // Animate truck along the route
  useEffect(() => {
    if (!isLoaded) return;

    const animateRoute = () => {
      // Calculate position along the route
      const routeLength = routeCoordinates.length - 1;
      const segmentIndex = Math.floor(routeProgress);
      const segmentProgress = routeProgress - segmentIndex;

      if (segmentIndex < routeLength) {
        const start = routeCoordinates[segmentIndex];
        const end = routeCoordinates[segmentIndex + 1];

        // Interpolate position
        const lat = start.lat + (end.lat - start.lat) * segmentProgress;
        const lng = start.lng + (end.lng - start.lng) * segmentProgress;

        setTruckPosition({ lat, lng });
        
        // Calculate heading (direction) for truck rotation
        const dx = end.lng - start.lng;
        const dy = end.lat - start.lat;
        const heading = (Math.atan2(dy, dx) * 180) / Math.PI;
        setTruckHeading(heading);
        
        // Increment progress (slower speed)
        setRouteProgress((prev) => {
          const newProgress = prev + 0.0015; // Reduced from 0.005 to 0.0015 for slower movement
          return newProgress > routeLength ? 0 : newProgress;
        });
      } else {
        // Reset to beginning when route is complete
        setRouteProgress(0);
      }
    };

    const interval = setInterval(animateRoute, 50);
    return () => clearInterval(interval);
  }, [isLoaded, routeProgress]);

  // Handle map load
  const onLoad = useCallback((map: google.maps.Map) => {
    // Fit bounds to show the entire route
    const bounds = new google.maps.LatLngBounds();
    routeCoordinates.forEach((coord) => bounds.extend(coord));
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  // Handle map unmount
  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Calculate ETA based on route progress
  const calculateETA = () => {
    const totalDistance = 382; // miles from SF to LA
    const progressPercent = (routeProgress / (routeCoordinates.length - 1)) * 100;
    const remainingDistance = totalDistance * (1 - progressPercent / 100);
    
    // Format as hours and minutes
    const hours = Math.floor(remainingDistance / 60);
    const minutes = Math.floor(remainingDistance % 60);
    
    return `${hours}h ${minutes}m`;
  };

  // Loading state
  if (!isLoaded) {
    return (
      <div className="h-full w-full bg-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-600 mb-2"></div>
          <div className="text-indigo-600 font-medium">Loading map...</div>
        </div>
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="h-full w-full bg-red-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-2">⚠️</div>
          <div className="text-red-600 font-medium mb-1">Error loading map</div>
          <div className="text-red-500 text-sm">{loadError}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full w-full relative">
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={7}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={mapOptions}
      >
        {/* Route line */}
        <Polyline
          path={routeCoordinates}
          options={{
            strokeColor: '#4F46E5',
            strokeOpacity: 0.8,
            strokeWeight: 4,
          }}
        />

        {/* Waypoint markers */}
        {waypoints.map((waypoint, index) => (
          <Marker
            key={index}
            position={waypoint.position}
            label={{
              text: waypoint.label,
              color: 'white',
              fontWeight: 'bold',
            }}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: index === 0 ? '#10B981' : '#3B82F6',
              fillOpacity: 1,
              strokeWeight: 2,
              strokeColor: 'white',
            }}
            onClick={() => setSelectedMarker(index)}
          />
        ))}

        {/* Truck marker */}
        <Marker
          position={truckPosition}
          icon={{
            url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(truckSvg)}`,
            scaledSize: new google.maps.Size(40, 40),
            rotation: truckHeading + 90,
            anchor: new google.maps.Point(20, 20)
          }}
          zIndex={1000} // Ensure truck is on top of other markers
        />

        {/* Info windows */}
        {selectedMarker !== null && (
          <InfoWindow
            position={waypoints[selectedMarker].position}
            onCloseClick={() => setSelectedMarker(null)}
          >
            <div className="p-1">
              <h3 className="font-medium text-gray-900">{waypoints[selectedMarker].title}</h3>
              <p className="text-sm text-gray-600">{waypoints[selectedMarker].info}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      {/* Overlay with delivery info */}
      <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md max-w-xs">
        <div className="flex items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm font-medium text-gray-900">In Transit</span>
        </div>
        <h3 className="text-base font-semibold text-gray-900 mt-1">Sofa & 5 Boxes</h3>
        <div className="mt-2 flex justify-between text-sm text-gray-600">
          <span>ETA: {calculateETA()}</span>
          <span>382 miles total</span>
        </div>
      </div>
    </div>
  );
};

export default MapDisplay;
