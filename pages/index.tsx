import { Octokit } from '@octokit/core';
import { GetServerSideProps } from 'next';
import { getYearFromFile, githubToken } from '../util/constants';
import { ConfigType, GithubFileInfoType } from '../util/types';
import Viewer from './timeline/[user]/[id]';

interface DataProps {
  years: number[];
  user: string;
  id: string;
  config: ConfigType;
  isGlobe: boolean;
}

const IndexPage = ({ years, user, id, config, isGlobe }: DataProps) => {
  return (
    <Viewer
      user={user}
      id={id}
      config={config}
      years={years}
      isGlobe={isGlobe}
    />
  );
};

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  query,
}) => {
  const user = 'nrgapple';
  const id = 'timeline-example';
  const isGlobe = query?.view === 'globe' ? true : false;
  try {
    const octokit = new Octokit({ auth: githubToken });
    const configRes = await fetch(
      `https://raw.githubusercontent.com/${user}/historicborders-${id}/main/config.json`,
    );
    const config: ConfigType = await configRes.json();
    const fileResp = await octokit.request(
      `/repos/${user}/historicborders-${id}/contents/years`,
    );
    const files: GithubFileInfoType[] = fileResp.data;
    const years = files
      .map((x) => getYearFromFile(x.name))
      .sort((a, b) => a - b);
    return {
      props: {
        years,
        user: user,
        id: id,
        config,
        isGlobe,
      } as DataProps,
    };
  } catch (e) {
    console.log(e);
  }
  return {
    props: {
      isGlobe,
    } as DataProps,
  };
};

export default IndexPage;
