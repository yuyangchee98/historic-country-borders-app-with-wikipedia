import React, { useEffect, useRef, useState } from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';
import MapboxGl from 'mapbox-gl';
import { useData } from '../hooks/useData';
import Map from '../util/ReactMapBoxGl';
import DrawControl from 'react-mapbox-gl-draw';

import 'mapbox-gl/dist/mapbox-gl.css';

const MapContainer = () => {
  const [zoomValue, setZoomValue] = useState(2);
  const mapRef = useRef<MapboxGl.Map | undefined>(undefined);

  return (
    <div className="map-grid">
      <Map
        className="map"
        zoom={[zoomValue]}
        style="mapbox://styles/nrgapple/ckk7nff4z0jzj17pitiuejlvt"
        onStyleLoad={(map: MapboxGl.Map) => {
          mapRef.current = map;
          map.resize();
        }}
        onZoomEnd={(map) => {
          setZoomValue(map.getZoom());
        }}
      >
        <DrawControl />
      </Map>
    </div>
  );
};

export default MapContainer;
