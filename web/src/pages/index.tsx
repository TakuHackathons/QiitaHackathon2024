'use client';

import { useContext, useState, useEffect } from 'react';
import { VrmViewer } from '../compoments/vrmViewer';
import { ViewerContext } from '../features/vrmViewer/viewerContext';
import { IconButton } from '../compoments/iconButton';
import { speakCharacter } from '../features/speak-character';

export default function Home() {
  const { viewer } = useContext(ViewerContext);
  const [userMessage, setUserMessage] = useState('');
  let counter = 0;
  let tiredCount = 0;

  useEffect(() => {
    (async () => {
      await speakCharacter('ずんだもんだよ〜', viewer);
      const intervalId = setInterval(() => {
        if (!userMessage) {
          counter++;
          speakCharacter('何か話しかけてね', viewer);
        }
        if (counter > 3) {
          clearInterval(intervalId);
        }
      }, 10000);
    })();
  }, []);

  const onTestClick = async () => {
    tiredCount++;
    if (tiredCount <= 3) {
      await speakCharacter(userMessage, viewer);
    }
    if (tiredCount > 3) {
      await speakCharacter('お腹すいたーご飯食べたい', viewer);
    }
  };

  return (
    <div className={'font-M_PLUS_2'}>
      <VrmViewer />
      <div className="absolute bottom-0 z-20 w-screen">
        <div className="bg-base text-black">
          <div className="mx-auto max-w-4xl p-16">
            <div className="grid grid-flow-col gap-[8px] grid-cols-[min-content_1fr_min-content]">
              <input
                type="text"
                placeholder="聞きたいことをいれてね"
                onChange={(e) => setUserMessage(e.target.value)}
                disabled={false}
                className="bg-surface1 hover:bg-surface1-hover focus:bg-surface1 disabled:bg-surface1-disabled disabled:text-primary-disabled rounded-16 w-full px-16 text-text-primary typography-16 font-bold disabled"
                value={userMessage}
              ></input>

              <IconButton
                iconName="24/Send"
                className="bg-secondary hover:bg-secondary-hover active:bg-secondary-press disabled:bg-secondary-disabled"
                isProcessing={false}
                disabled={false}
                onClick={onTestClick}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
