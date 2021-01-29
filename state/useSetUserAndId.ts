import { Octokit } from '@octokit/core';
import { FeatureCollection } from 'geojson';
import { useEffect } from 'react';
import { useSetRecoilState, useRecoilState } from 'recoil';
import {
  convertYearStringToInt,
  getYearStringFromFile,
  yearPrefix,
} from '../util/constants';
import { ConfigType, GithubFileInfoType } from '../util/types';
import {
  allDataState,
  userState,
  idState,
  titleState,
  mainLoadingState,
  YearsFCType,
  currentYearState,
} from './editorState';

const useSetUserAndId = (id: string, user: string) => {
  const setAllData = useSetRecoilState(allDataState);
  const setUser = useSetRecoilState(userState);
  const setId = useSetRecoilState(idState);
  const setTitle = useSetRecoilState(titleState);
  const setMainLoading = useSetRecoilState(mainLoadingState);
  const setCurrentYear = useSetRecoilState(currentYearState);
  const setUserAndId = async (id: string, user: string) => {
    setMainLoading(true);
    try {
      const octokit = new Octokit();
      const configRes = await fetch(
        `https://raw.githubusercontent.com/${user}/historicborders-${id}/main/config.json`,
      );
      const config: ConfigType = await configRes.json();
      const fileResp = await octokit.request(
        `/repos/${user}/historicborders-${id}/contents/years`,
      );
      const files: GithubFileInfoType[] = fileResp.data;
      const yearStrings = files.map((x) => getYearStringFromFile(x.name));

      const fetcher = async (year: string) => {
        const resp = await fetch(
          `https://raw.githubusercontent.com/${user}/${yearPrefix}${id}/main/years/${year}.geojson`,
        );
        const data = (await resp.json()) as FeatureCollection;
        return {
          year: convertYearStringToInt(year),
          data,
        } as YearsFCType;
      };
      const dataFetchs = yearStrings.map(async (x) => await fetcher(x));
      const data = await Promise.all(dataFetchs);
      setAllData(data);
      setTitle(config.name);
      setCurrentYear(data.map((x) => x.year).sort((a, b) => a - b)[0]);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (id && user) {
      setUserAndId(id, user);
    }
    setId(id);
    setUser(user);
  }, [id, user]);
};

export default useSetUserAndId;
