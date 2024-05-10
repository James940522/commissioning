/* eslint-disable @typescript-eslint/no-explicit-any */
// import './App.css';
import { useEffect, useRef, useState } from 'react';
import scene from './assets/scene.json';

const protoPieUrl = `https://proxy.megapass-dashboard.com/p/aac5c7bd3f?ui=false&scaleToFit=true&enableHotspotHints=true&cursorType=touch&mockup=false`;

const dataLayerId = '2402b947-1a44-4e0e-9eb9-315b93155720';

function App() {
  const [sceneId, setSceneId] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const findElement = () => {
    const iframeElement = iframeRef.current;

    if (!iframeElement) return;

    if (!iframeElement) {
      console.log(
        'Test iframe is not loaded yet or cross-origin policy prevents access',
      );
      return;
    }

    if (iframeElement.contentWindow) {
      //TODO: TargetElement를 찾을때 까지 반복해서 select
      const customScript = `
      const intervalId = setInterval(() => {
        
        const htmlDivList = document.querySelectorAll('div[data-layer-id]');
        const targetElement = Array.from(htmlDivList).find(
          el => el.dataset.layerId === '${dataLayerId}'
        );
        console.log('IFRAME_TEST 찾는중', targetElement);
        if (targetElement) {
          targetElement.style.border = '5px solid red';
          clearInterval(intervalId); // 찾았으면 인터벌 중지
        }
      }, 500); // 500ms 마다 실행
      `;

      iframeElement.contentWindow.postMessage(
        customScript,
        'https://proxy.megapass-dashboard.com',
      );
    }
  };

  useEffect(() => {
    window.addEventListener('message', event => {
      if (typeof event.data === 'string' && event.data.includes('datajson')) {
        const { data } = event;

        const map: Record<string, string> = {};

        const scenes = JSON.parse(data.replace('datajson', ''));

        scenes.forEach((item: any) => {
          item.layers.forEach((layer: any) => {
            map[layer.id] = item.id;
          });
        });
        console.log('map', map);
        // console.log('event', event.data);
      }
    });
  }, []);

  // useEffect(() => {
  //   const iframe = iframeRef.current;
  //   if (!iframe) return;
  //   // iframe이 로드되었는지 확인 후 요소 탐색
  //   const handleLoad = () => {
  //     findElement(iframe);
  //   };

  //   if (iframe) {
  //     iframe.addEventListener('load', handleLoad);
  //   }

  //   // 이벤트 리스너 정리
  //   return () => {
  //     if (iframe) {
  //       iframe.removeEventListener('load', handleLoad);
  //     }
  //   };
  // }, [iframeRef]); // iframeRef가 변경될 때마다 useEffect 실행

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-[1080px]">
        <div className=" max-h-[1080px] mx-auto w-full h-full flex flex-1 flex-col justify-center items-center gap-y-12">
          <div className="w-[512px] h-[768px] border">
            <iframe
              ref={iframeRef}
              src={`${protoPieUrl}&sceneId=${sceneId}`}
              className="w-full h-full"
              onLoad={findElement}
              // onLoadStart={}
            />
          </div>
          <div className="flex gap-2 border border-zinc-500 p-3 flex-wrap w-full">
            {Object.keys(scene).map(key => (
              <button
                key={key}
                onClick={() => {
                  setSceneId(scene[key as keyof typeof scene]);
                }}
              >
                {key}
              </button>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
