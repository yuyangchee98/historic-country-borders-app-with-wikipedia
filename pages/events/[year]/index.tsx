import { Octokit } from '@octokit/core';
import { FeatureCollection } from 'geojson';
import { GetServerSideProps } from 'next';
import { githubToken, getYearFromFile } from '../../../util/constants';
import { ConfigType, GithubFileInfoType } from '../../../util/types';
import { getEventsForYear } from '../../../util/severUtil';
import Viewer from '../[year]/[id]';

interface DataProps {
  years: number[];
  currentYear: number;
  mapEvents?: FeatureCollection;
  user: string;
  id: string;
  config: ConfigType;
}

const Year = ({
  years,
  currentYear,
  mapEvents,
  user,
  id,
  config,
}: DataProps) => (
  <Viewer
    years={years}
    currentYear={currentYear}
    mapEvents={mapEvents}
    user={user}
    id={id}
    config={config}
  />
);

export default Year;

export const getServerSideProps: GetServerSideProps<DataProps> = async ({
  params,
}) => {
  const user = 'nrgapple';
  const id = 'timeline-example';
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
    const currentYear = params?.year
      ? parseInt(params.year as string)
      : years[0];
    const mapEvents: FeatureCollection | null = await getEventsForYear(
      currentYear,
    );
    console.log('events', mapEvents);
    return {
      redirect: {
        permanent: true,
        destination: `/events/${currentYear}/none`,
      },
    };
  } catch (e) {
    console.log(e);
  }
  return {
    props: {} as DataProps,
  };
};
