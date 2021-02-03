import MapContainer from '../../../components/ViewerMapEvents';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import {
  convertYearString,
  getYearFromFile,
  githubToken,
  mapBCFormat,
  mod,
} from '../../../util/constants';
import Footer from '../../../components/Footer';
import NavBar from '../../../components/NavBar';
import Timeline from '../../../components/Timeline';
import ReactTooltip from 'react-tooltip';
import useKeyPress from '../../../hooks/useKeyPress';
import { GetServerSideProps, GetStaticProps } from 'next';
import { Octokit } from '@octokit/core';
import {
  ConfigType,
  GithubFileInfoType,
  mapEventPropertiesType,
} from '../../../util/types';
import Layout from '../../../components/Layout';
import { FeatureCollection } from 'geojson';
import { getMapEvents } from '../util';
import { useRouter } from 'next/dist/client/router';
import Detail from '../../../components/Detail';

ReactGA.initialize('UA-188190791-1');

interface DataProps {
  years: number[];
  currentYear: number;
  mapEvents?: FeatureCollection;
  user: string;
  id: string;
  config: ConfigType;
}

const Viewer = ({
  years,
  user,
  id,
  config,
  mapEvents,
  currentYear,
}: DataProps) => {
  const [index, setIndex] = useState(0);
  const [hide, setHide] = useState(false);
  const [help, setHelp] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isMobile =
    typeof window !== 'undefined'
      ? /Mobi|Android/i.test(navigator.userAgent)
      : false;
  const aPress = useKeyPress('a');
  const dPress = useKeyPress('d');
  const [details, setDetails] = useState<mapEventPropertiesType | undefined>();
  const router = useRouter();

  useEffect(() => {
    if ([user, id].some((x) => !x)) {
      ReactGA.pageview(`/no-data`);
    } else {
      ReactGA.pageview(`/events`);
    }
    setMounted(true);
  }, []);

  useEffect(() => {
    if (dPress) {
      setIndex(mod(index + 1, years.length));
    }
  }, [dPress]);

  useEffect(() => {
    if (aPress) {
      setIndex(mod(index - 1, years.length));
    }
  }, [aPress]);

  useEffect(() => {
    console.log({ years, user, id, config });
  }, [years, user, id, config]);

  useEffect(() => {
    setIndex(years.indexOf(currentYear));
    setDetails(undefined);
  }, [currentYear]);

  if (!(years && user && id && config))
    return <div>Not a valid timeline. Check your url.</div>;

  return (
    <>
      <Layout
        title={config.name}
        url={`https://historyborders.app/timeline/${user}/${id}`}
        description={config.description}
      >
        {details && (
          <Detail
            title={details.title}
            content={details.content}
            author={details.author}
            flagged={details.flagged}
            actualDate={details.actualDate}
            onFlag={() => {}}
            onClose={() => setDetails(undefined)}
            id={details.id}
          />
        )}
        {mounted && (
          <ReactTooltip
            resizeHide={false}
            id="fullscreenTip"
            place="left"
            effect="solid"
            globalEventOff={isMobile ? 'click' : undefined}
          >
            {hide ? 'Show Timeline' : 'Hide Timeline'}
          </ReactTooltip>
        )}
        <div
          data-tip
          data-for="fullscreenTip"
          data-delay-show="300"
          className="fullscreen"
          onClick={() => setHide(!hide)}
          style={{ top: hide ? '16px' : '165px' }}
        >
          <div className="noselect">🔭</div>
        </div>
        <div className={`${hide ? 'app-large' : 'app'}`}>
          {!hide && (
            <>
              <NavBar
                onHelp={() => setHelp(!help)}
                showHelp={help}
                title={config.name}
              />
              <Timeline
                index={index}
                onChange={(i) => router.push(`/events/${years[i]}`)}
                years={years}
              />
            </>
          )}
          <MapContainer
            year={convertYearString(mapBCFormat, years[index])}
            fullscreen={hide}
            user={user}
            id={id}
            mapEvents={mapEvents}
            onClickMapEvent={(props) => {
              setDetails(props ?? undefined);
            }}
          />
          {!hide && (
            <Footer
              dataUrl={`https://github.com/${user}/historicborders-${id}`}
            />
          )}
        </div>
      </Layout>
    </>
  );
};

export default Viewer;

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
    let currentYear = years[0];
    let mapEvents: FeatureCollection | null = null;
    if (params) {
      if (params.year) {
        const paramYear = parseInt(params.year as string);
        if (years.some((x) => x === paramYear)) {
          currentYear = paramYear;
          mapEvents = await getMapEvents(currentYear);
        }
      }
    }
    return {
      props: {
        years,
        mapEvents,
        currentYear,
        user: user,
        id: id,
        config,
      } as DataProps,
    };
  } catch (e) {
    console.log(e);
  }
  return {
    props: {} as DataProps,
  };
};