'use client';

import { useContext } from 'react';
import axios from 'axios';
import _ from 'lodash';
import { VrmViewer } from '../compoments/vrmViewer';
import { ViewerContext } from '../features/vrmViewer/viewerContext';

export default function Home() {
  const { viewer } = useContext(ViewerContext);

  const voiceVoxRootUrl = process.env.NEXT_PUBLIC_VOICEVOX_API_ROOT_URL;
  const onTestClick = async () => {
    const targetSpeackerName = 'ずんだもん';
    const speackersResponse = await axios.get(`${voiceVoxRootUrl}/speakers`);
    console.log(speackersResponse);
    const targetSpeacker = speackersResponse.data.find((speacker: any) => speacker.name === targetSpeackerName);
    //const targetSpeackerStyle = _.sample(targetSpeacker.styles);
    // 'ノーマル', 'あまあま', 'ツンツン', 'セクシー', 'ささやき', 'ヒソヒソ' がある
    const targetSpeackerStyle = targetSpeacker.styles.find((style: any) => style.name === 'あまあま')
    const speackerId = targetSpeackerStyle.id;
    console.log(targetSpeacker);
    const responseAudio = await axios.post(`${voiceVoxRootUrl}/audio_query`, null, {
      params: {
        text: 'パンツ見せてくれませんか?',
        speaker: speackerId,
      },
    });
    console.log(responseAudio.data);
    const responseSynthesis = await axios.post(`${voiceVoxRootUrl}/synthesis`, responseAudio.data, {
      responseType: 'arraybuffer',
      params: {
        speaker: speackerId,
      },
    });
    viewer.model?.speak(responseSynthesis.data, 'neutral');
    /*
    const audioBlob = responseSynthesis.data;
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.volume = 1;
    audio.play();
    */
  };

  return (
    <div className={'font-M_PLUS_2'}>
      <VrmViewer />
      <button onClick={onTestClick}>test</button>
    </div>
  );
}
