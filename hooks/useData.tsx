import type {
  FeatureCollection,
  GeoJsonProperties,
  Feature,
  MultiPolygon,
  Point,
} from 'geojson';
import { useEffect, useState } from 'react';
import stc from 'string-to-color';
import polylabel from 'polylabel';
import { processData, yearPrefix } from '../util/constants';
import { CountryData } from '../util/types';

export const useData = (year: string, user: string, id: string) => {
  const [isLoading, setIsLoading] = useState(true);
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [data, setData] = useState<CountryData | undefined>(undefined);

  useEffect(() => {
    if (year) {
      setIsLoading(true);
      setUrl(
        `https://raw.githubusercontent.com/${user}/${yearPrefix}${id}/main/years/${year}.geojson`,
      );
    }
  }, [year]);

  useEffect(() => {
    if (url) {
      (async () => {
        try {
          const resp = await fetch(url);
          const mapData = await resp.json();
          setData(processData(mapData as FeatureCollection));
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [url]);

  useEffect(() => {
    if (data) {
      setIsLoading(false);
    }
  }, [data]);

  return [isLoading, data] as const;
};
