import { Viewer } from 'resium';
import React, { useEffect, useRef, useState } from 'react';
import { useData } from '../hooks/useData';

interface MapContainerProps {
  year: string;
  user: string;
  id: string;
  fullscreen?: boolean;
}

const MapContainer = ({ year, fullscreen, user, id }: MapContainerProps) => {
  const [, data] = useData(year, user, id);
  const [zoomValue, setZoomValue] = useState(2);

  return (
    <div className="map-grid">
      <Viewer />
    </div>
  );
};

export default MapContainer;
