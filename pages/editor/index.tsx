import EditorMap from '../../components/EditorMap';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import {
  convertYearString,
  getYearFromFile,
  mapBCFormat,
  mod,
} from '../../util/constants';
import Footer from '../../components/Footer';
import NavBar from '../../components/NavBar';
import Timeline from '../../components/Timeline';
import ReactTooltip from 'react-tooltip';
import useKeyPress from '../../hooks/useKeyPress';
import { GetServerSideProps } from 'next';
import { Octokit } from '@octokit/core';
import { ConfigType, GithubFileInfoType } from '../../util/types';

ReactGA.initialize('UA-188190791-1');

interface DataProps {
  years: number[];
  user: string;
  id: string;
  config: ConfigType;
}

const Editor = () => {
  const [index, setIndex] = useState(0);
  const [help, setHelp] = useState(false);

  useEffect(() => {
    ReactGA.pageview('/editor');
  }, []);

  return (
    <>
      <div className="app">
        <NavBar
          onHelp={() => setHelp(!help)}
          showHelp={help}
          title={'Editor'}
        />
        <Timeline index={index} onChange={setIndex} years={[]} />
        <EditorMap />
        <Footer />
      </div>
    </>
  );
};

export default Editor;
