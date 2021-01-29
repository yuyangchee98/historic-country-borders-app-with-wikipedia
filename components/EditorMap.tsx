import React, { useEffect, useRef, useState } from 'react';
import { GeoJSONLayer } from 'react-mapbox-gl';
import MapboxGl, { Control } from 'mapbox-gl';
import { useData } from '../hooks/useData';
import Map from '../util/ReactMapBoxGl';
import DrawControl from '../thirdParty/react-mapbox-gl-draw';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import useEditorMap from '../state/useEditorMap';

const MapContainer = () => {
  const [data] = useEditorMap();
  const [zoomValue, setZoomValue] = useState(2);
  const mapRef = useRef<MapboxGl.Map | undefined>(undefined);
  const drawControlRef = useRef<DrawControl>(null);
  /**
   * @summary Reference to the drawer object. (Use for the current draw features)
   * @example Use for the current draw features
   */
  const drawRef = useRef<Control | undefined>(undefined);

  return (
    <div className="map-grid">
      <Map
        className="map"
        zoom={[zoomValue]}
        style="mapbox://styles/nrgapple/ckk7nff4z0jzj17pitiuejlvt"
        onStyleLoad={(map: MapboxGl.Map) => {
          mapRef.current = map;
          map.resize();
          if (drawControlRef.current) {
            if (drawControlRef.current.draw) {
              drawRef.current = drawControlRef.current.draw;
              console.log('draw', drawRef.current);
            }
          }
        }}
        onZoomEnd={(map) => {
          setZoomValue(map.getZoom());
        }}
      >
        {data && (
          <>
            <GeoJSONLayer
              data={data.borders}
              fillPaint={{
                'fill-color': ['get', 'COLOR'],
                'fill-opacity': 0.5,
              }}
            />
            <GeoJSONLayer
              data={data.labels}
              symbolLayout={{
                'text-field': '{NAME}',
                'text-font': ['Lato Bold'],
                'text-size': {
                  base: 1,
                  stops: [
                    [12, 12],
                    [16, 16],
                  ],
                },
                'text-padding': 3,
                'text-letter-spacing': 0.1,
                'text-max-width': 7,
                'text-transform': 'uppercase',
              }}
            />
          </>
        )}
        <DrawControl
          ref={drawControlRef}
          controls={{
            point: false,
            polygon: true,
            trash: true,
            line_string: false,
            combine_features: false,
            uncombine_features: false,
          }}
        />
      </Map>
    </div>
  );
};

export default MapContainer;
