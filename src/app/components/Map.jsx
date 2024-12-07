import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function LocationMarker({ onLocationSelected }) {
  useMapEvents({
    click(e) {
      onLocationSelected(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function MapResizer() {
  const maps = useMap();

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      maps.invalidateSize();
    });
    resizeObserver.observe(maps.getContainer());

    return () => {
      resizeObserver.disconnect();
    };
  }, [maps]);

  return null;
}

export default function Map({ onLocationSelected, steps }) {
  const [showHtmlComponent, setShowHtmlComponent] = useState(false);

  const toggleHtmlComponent = () => {
    setShowHtmlComponent(prev => !prev);
  };

  useEffect(() => {
    // Cleanup function to unmount the component if necessary
    return () => {
      setShowHtmlComponent(false);
    };
  }, []);

  return (
    <MapContainer 
      center={[20.5937, 78.9629]} 
      zoom={5} 
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker onLocationSelected={onLocationSelected} />
      {steps.map((step, index) => (
        <Marker 
          key={index} 
          position={[step.location.latitude, step.location.longitude]} 
        />
      ))}
      <MapResizer />
      <button onClick={toggleHtmlComponent}>
        {showHtmlComponent ? 'Unmount HTML Component' : 'Mount HTML Component'}
      </button>
      {showHtmlComponent && <HtmlComponent />}
    </MapContainer>
  );
}

function HtmlComponent() {
  return (
    <div>
      <h1>This is the HTML Component</h1>
      {/* Other content */}
    </div>
  );
}
