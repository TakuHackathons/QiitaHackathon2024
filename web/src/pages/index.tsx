"use client";

import { useCallback, useContext, useEffect, useState } from "react";
import styles from "./page.module.css";
import axios from "axios"
import _ from 'lodash';
import { VrmViewer } from "../compoments/vrmViewer";
import { ViewerContext } from "../features/vrmViewer/viewerContext";

export default function Home() {
  const { viewer } = useContext(ViewerContext);

  const voiceVoxRootUrl = "http://localhost:50021"
  const onTestClick = async () => {
    const targetSpeackerName = 'ずんだもん';
    const speackersResponse = await axios.get(`${voiceVoxRootUrl}/speakers`)
    console.log(speackersResponse)
    const targetSpeacker = speackersResponse.data.find((speacker) => speacker.name === targetSpeackerName)
    const targetSpeackerStyle = _.sample(targetSpeacker.styles);
    const speackerId = targetSpeackerStyle.id;
    console.log(targetSpeacker)
    const responseAudio = await axios.post(`${voiceVoxRootUrl}/audio_query`, null, {params: {
      text: "パンツ見せてくれませんか?",
      speaker: speackerId,
    }})
    console.log(responseAudio.data)
    const responseSynthesis = await axios.post(
      `${voiceVoxRootUrl}/synthesis`,
      responseAudio.data,
      {
        responseType: 'blob',
        params: {
          speaker: speackerId,
        }
      },
    )
    const audioBlob = responseSynthesis.data
    const audioUrl = URL.createObjectURL(audioBlob)
    const audio = new Audio(audioUrl)
    audio.volume = 1
    audio.play()
  }

  return (
    <div className={"font-M_PLUS_2"}>
      <VrmViewer />
      <button onClick={onTestClick}>test</button>
    </div>
  );
}
