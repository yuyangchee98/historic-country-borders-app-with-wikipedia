import EditorMap from '../../../components/EditorMap';
import React, { useEffect, useState } from 'react';
import ReactGA from 'react-ga';
import {
  convertYearString,
  getYearFromFile,
  mapBCFormat,
  mod,
} from '../../../util/constants';
import Footer from '../../../components/Footer';
import NavBar from '../../../components/NavBar';
import Timeline from '../../../components/Timeline';
import ReactTooltip from 'react-tooltip';
import useKeyPress from '../../../hooks/useKeyPress';
import { GetServerSideProps } from 'next';
import { Octokit } from '@octokit/core';
import { ConfigType, GithubFileInfoType } from '../../../util/types';
import useSetUserAndId from '../../../state/useSetUserAndId';
import { useRecoilValue } from 'recoil';
import { titleState } from '../../../state/editorState';
import useEditor from '../../../state/useEditor';

ReactGA.initialize('UA-188190791-1');

interface DataProps {
  user?: string;
  id?: string;
}

const Editor = ({ user = '', id = '' }) => {
  const [index, setIndex] = useState(0);
  const [help, setHelp] = useState(false);
  useSetUserAndId(id, user);
  const title = useRecoilValue(titleState);
  const {} = useEditor();
  useEffect(() => {
    ReactGA.pageview('/editor');
  }, []);

  return (
    <>
      <div className="app">
        <NavBar onHelp={() => setHelp(!help)} showHelp={help} title={title} />
        <Timeline index={index} onChange={setIndex} years={[]} />
        <EditorMap />
        <Footer />
      </div>
    </>
  );
};

export default Editor;

export const getServerSideProps: GetServerSideProps<DataProps> = async (
  context,
) => {
  if (context.params && context.params.user && context.params.id) {
    return {
      props: {
        user: context.params.user,
        id: context.params.id,
      } as DataProps,
    };
  }
  return {
    props: {} as DataProps,
  };
};
