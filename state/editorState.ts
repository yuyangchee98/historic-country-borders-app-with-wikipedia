import { Feature } from 'geojson';
import { FeatureCollection } from 'geojson';
import { atom } from 'recoil';
import { localStorageEffect } from './effects';

export interface YearsFCType {
  year: number;
  data: FeatureCollection;
}

export const idState = atom<string>({
  key: 'editor-idState',
  default: '',
  //effects_UNSTABLE: [localStorageEffect('editor_id')],
});

export const userState = atom<string>({
  key: 'editor-userState',
  default: '',
  //effects_UNSTABLE: [localStorageEffect('editor_user')],
});

export const titleState = atom<string>({
  key: 'editor-titleState',
  default: 'Editor',
  //effects_UNSTABLE: [localStorageEffect('editor_user')],
});

export const allDataState = atom<YearsFCType[]>({
  key: 'editor-allDataState',
  default: [],
  //effects_UNSTABLE: [localStorageEffect('editor_data')],
});

export const currentYearState = atom<number | undefined>({
  key: 'editor-currentYearState',
  default: undefined,
});

export const loadedFeaturesState = atom<Feature[]>({
  key: 'editor-loadedFeaturesState',
  default: [],
});

export const changedFeaturesState = atom<Feature[]>({
  key: 'editor-changedFeaturesState',
  default: [],
});

export const mapLoadingState = atom<boolean>({
  key: 'editor-mapLoadingState',
  default: false,
});

export const panelLoadingState = atom<boolean>({
  key: 'editor-panelLoadingState',
  default: false,
});

export const mainLoadingState = atom<boolean>({
  key: 'editor-mainLoadingState',
  default: false,
});
