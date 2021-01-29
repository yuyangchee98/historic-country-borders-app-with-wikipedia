import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Point,
} from 'geojson';
import polylabel from 'polylabel';
import stc from 'string-to-color';
import { CountryData } from './types';

export const yearPrefix = 'historicborders-';

export const convertYearString = (
  format: (value: number) => string,
  year: number,
) => {
  if (year < 0) {
    return format(year);
  }
  return year.toString();
};

export const convertYearStringToInt = (year: string) =>
  parseInt(year.replace(/bc/g, '-'));

export const mapBCFormat = (value: number) => `bc${(value * -1).toString()}`;

export const timelineBCFormat = (value: number) =>
  `${(value * -1).toString()} BC`;

export const mod = (n: number, m: number) => {
  return ((n % m) + m) % m;
};

export const getYearFromFile = (fileName: string) =>
  parseInt(fileName.replace(/.geojson/g, '').replace(/bc/g, '-'));

export const getYearStringFromFile = (fileName: string) =>
  fileName.replace(/.geojson/g, '');

export const getNameFromFeature = (feature: Feature) => {
  return feature.properties!.Name;
};

export const processData = (data: FeatureCollection) => {
  const dataNoUnclaimed = {
    ...data,
    features: data.features.filter(
      (f) => f.properties?.NAME != null && f.properties?.NAME != 'unclaimed',
    ),
  };
  const featureParts = dataNoUnclaimed.features.map((feature) => {
    const name = feature.properties?.NAME ?? 'unclaimed';
    const color = stc(name);
    const labels = (feature.geometry as MultiPolygon).coordinates
      .map((x) => polylabel(x))
      .map((x) => ({
        geometry: {
          type: 'Point',
          coordinates: x,
        } as Point,
        properties: {
          ...feature.properties,
          NAME: name,
          COLOR: color,
        } as GeoJsonProperties,
      })) as Feature[];

    const bounds = {
      geometry: feature.geometry,
      properties: {
        ...feature.properties,
        COLOR: color,
        NAME: name,
      } as GeoJsonProperties,
    } as Feature;
    return {
      bounds,
      labels,
    };
  });
  const labelCol = {
    ...data,
    //@ts-ignore
    features: featureParts.map((x) => x.labels).flat(1),
  } as FeatureCollection;
  const boundCol = {
    ...data,
    features: featureParts.map((x) => x.bounds),
  } as FeatureCollection;
  return {
    labels: labelCol,
    borders: boundCol,
  } as CountryData;
};
