"use client";

import Image from "next/image";
import styles from "./page.module.css";
import axios from "axios"

export default function Home() {
  const voiceVoxRootUrl = "http://localhost:50021"
  const onTestClick = async () => {
    const targetSpeackerName = 'ずんだもん';
    const speackersResponse = await axios.get(`${voiceVoxRootUrl}/speakers`)
    console.log(speackersResponse)
    const targetSpeacker = speackersResponse.data.find((speacker) => speacker.name === targetSpeackerName)
    console.log(targetSpeacker)
    const responseAudio = await axios.post(`${voiceVoxRootUrl}/audio_query`, null, {params: {
      text: "こんにちは",
      speaker: 3,
    }})
    console.log(responseAudio)
  }

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <button onClick={onTestClick}>test</button>
      </main>
    </div>
  );
}
