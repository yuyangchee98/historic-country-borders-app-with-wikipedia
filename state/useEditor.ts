import { useState, useEffect, useCallback } from 'react';
import { useRecoilState } from 'recoil';
import {
  convertYearString,
  convertYearStringToInt,
  getNameFromFeature,
  mapBCFormat,
} from '../util/constants';
import {
  allDataState,
  loadedFeaturesState,
  changedFeaturesState,
  currentYearState,
  YearsFCType,
} from './editorState';

const useEditor = () => {
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

  useEffect(() => {
    if (allData.length > 0) {
      const years = allData.map((x) => x.year);
      setCurrentYear(years.sort((a, b) => a - b)[0]);
    }
  }, [allData]);

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
        ...allData.filter((x) => x.year != currentYear!),
        {
          year: currentYear,
          data: (() => {
            const collection = allData.find((x) => x.year === currentYear!);
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

export default useEditor;
