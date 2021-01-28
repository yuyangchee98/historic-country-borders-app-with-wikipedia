import { Octokit } from '@octokit/core';
import { Feature } from 'geojson';
import { FeatureCollection } from 'geojson';
import { useCallback, useEffect, useState } from 'react';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import { getNameFromFeature, getYearFromFile } from '../util/constants';
import { ConfigType, GithubFileInfoType } from '../util/types';
import { localStorageEffect } from './effects';

interface YearsFCType {
  year: string;
  data: FeatureCollection;
}

export const id = atom<string>({
  key: 'editor-Id',
  default: '',
  effects_UNSTABLE: [localStorageEffect('editor_id')],
});

export const user = atom<string>({
  key: 'editor-User',
  default: '',
  effects_UNSTABLE: [localStorageEffect('editor_user')],
});

export const allDataState = atom<YearsFCType[]>({
  key: 'editor-AllDataState',
  default: [],
  effects_UNSTABLE: [localStorageEffect('editor_data')],
});

export const currentYearState = atom<number | undefined>({
  key: 'editor-CurrentYearState',
  default: undefined,
});

export const loadedFeaturesState = atom<Feature[]>({
  key: 'editor-LoadedFeaturesState',
  default: [],
});

export const changedFeaturesState = atom<Feature[]>({
  key: 'editor-ChangedFeaturesState',
  default: [],
});

export const mapLoadingState = atom<boolean>({
  key: 'editor-mapLoadingState',
  default: false,
});

export const panelLoadingState = atom<boolean>({
  key: 'editor-mapLoadingState',
  default: false,
});

export const mainLoadingState = atom<boolean>({
  key: 'editor-mapLoadingState',
  default: false,
});

// --- Hooks

export const useEditor = () => {
  const [allData, setAllData] = useRecoilState(allDataState);
  const [isChange, setIsChange] = useState(false);
  const [loadedFeatures, setLoadedFeatures] = useRecoilState(
    loadedFeaturesState,
  );
  const [changedFeatures, setChangedFeatures] = useRecoilState(
    changedFeaturesState,
  );
  const [currentYear, setCurrentYear] = useRecoilState(currentYearState);

  useEffect(() => {
    setIsChange(loadedFeatures === changedFeatures);
  }, [changedFeatures]);

  const deleteCountry = useCallback(
    (country: string) => {
      if (
        loadedFeatures.length > 0 &&
        getNameFromFeature(loadedFeatures[0]) === country
      ) {
        setLoadedFeatures([]);
        setChangedFeatures([]);
      }

      setAllData([
        ...allData.filter((x) => x.year != currentYear),
        {
          year: currentYear,
          data: (() => {
            const collection = allData.find((x) => x.year === currentYear);
            return {
              ...collection,
              features: collection?.data.features.filter(
                (x) => getNameFromFeature(x) !== country,
              ),
            };
          })(),
        } as YearsFCType,
      ]);
    },
    [loadedFeatures, changedFeatures, allData, currentYear],
  );

  return { isChange, deleteCountry } as const;
};

const useSetUserAndId = (id: string, user: string) => {
  const setAllData = useSetRecoilState(allDataState);
  const [mainLoading, setMainLoading] = useRecoilState(mainLoadingState);
  const setUserAndId = async (id: string, user: string) => {
    setMainLoading(true);
    try {
      const octokit = new Octokit();
      const configRes = await fetch(
        `https://raw.githubusercontent.com/${context.params.user}/historicborders-${context.params.id}/main/config.json`,
      );
      const config: ConfigType = await configRes.json();
      const fileResp = await octokit.request(
        `/repos/${user}/historicborders-${id}/contents/years`,
      );
      const files: GithubFileInfoType[] = fileResp.data;
      const years = files
        .map((x) => getYearFromFile(x.name))
        .sort((a, b) => a - b);

      const fetcher = async (year: string) => {
        const resp = await fetch(
          `https://raw.githubusercontent.com/${user}/${year}${id}/main/years/${x}.geojson`,
        );
        const data = await resp.json() as FeatureCollection
        return {
          year,
          data
        } as YearsFCType
      };
      const dataFetchs = years.map(async(x) => await fetcher(x));
      const data = Promise.all(dataFetchs);
      setAllData(data);

      // }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (id && user) {
      setUserAndId(id, user);
    }
  });
};
