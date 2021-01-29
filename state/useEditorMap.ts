import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { processData } from '../util/constants';
import { CountryData } from '../util/types';
import { allDataState, currentYearState } from './editorState';

const useEditorMap = () => {
  const allData = useRecoilValue(allDataState);
  const currentYear = useRecoilValue(currentYearState);
  const [data, setData] = useState<CountryData | undefined>(undefined);

  useEffect(() => {
    if (allData && currentYear) {
      console.log(allData);
      setData(processData(allData.find((x) => x.year == currentYear)!.data));
    }
  }, [allData, currentYear]);

  return [data] as const;
};

export default useEditorMap;
