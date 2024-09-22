import axios from 'axios';
import { Viewer } from './vrmViewer/viewer';

export async function speakCharacter(speakText: string, viewer: Viewer) {
  const voiceVoxRootUrl = process.env.NEXT_PUBLIC_VOICEVOX_API_ROOT_URL;
  const targetSpeackerName = 'ずんだもん';
  const speackersResponse = await axios.get(`${voiceVoxRootUrl}/speakers`);
  console.log(speackersResponse);
  const targetSpeacker = speackersResponse.data.find((speacker: any) => speacker.name === targetSpeackerName);
  // 'ノーマル', 'あまあま', 'ツンツン', 'セクシー', 'ささやき', 'ヒソヒソ' がある
  const targetSpeackerStyle = targetSpeacker.styles.find((style: any) => style.name === 'あまあま');
  const speackerId = targetSpeackerStyle.id;
  console.log(targetSpeacker);
  const responseAudio = await axios.post(`${voiceVoxRootUrl}/audio_query`, null, {
    params: {
      text: speakText,
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
}
