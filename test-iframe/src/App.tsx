// import './App.css';
import { useEffect, useRef, useState } from 'react';
import scene from './assets/scene.json';

const protoPieUrl = `https://proxy.megapass-dashboard.com/p/aac5c7bd3f?ui=false&scaleToFit=true&enableHotspotHints=true&cursorType=touch&mockup=false`;

const dataLayerId = '2402b947-1a44-4e0e-9eb9-315b93155720';

function App() {
  const [sceneId, setSceneId] = useState<string>('');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  const findElement = () => {
    if (!iframeRef.current) {
      console.log(
        'Test iframe is not loaded yet or cross-origin policy prevents access',
      );
      return;
    }
    const test = `
      setTimeout(() => {
        const htmlDivList = document.querySelectorAll('div[data-layer-id]');
        const targetElement = Array.from(htmlDivList).filter(
          el => el.dataset.layerId === '${dataLayerId}',
        );
        console.log('IFRAME_TEST', targetElement);
        targetElement.forEach(element => {
          element.style.border = '5px solid red';
          let start = null;
          function step(timestamp) {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            element.style.transform =
              'translateY(' + Math.sin(progress / 100) * 1 + 'px)';
            if (progress < 1000) {
              window.requestAnimationFrame(step);
            } else {
              start = null; // Reset start time to repeat the animation
              window.requestAnimationFrame(step);
            }
          }
          window.requestAnimationFrame(step);
        });
      }, 5000);
    `;

    iframeRef.current.contentWindow?.postMessage(
      test,
      'https://proxy.megapass-dashboard.com',
    );
  };

  useEffect(() => {
    // iframe이 로드되었는지 확인 후 요소 탐색
    const handleLoad = () => {
      findElement();
    };

    const iframe = iframeRef.current;

    if (iframe) {
      setTimeout(findElement, 10000);
      // iframe.addEventListener('load', handleLoad);
    }

    // 이벤트 리스너 정리
    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleLoad);
      }
    };
  }, [iframeRef]); // iframeRef가 변경될 때마다 useEffect 실행

  return (
    <main className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-[1080px]">
        <div className=" max-h-[1080px] mx-auto w-full h-full flex flex-1 flex-col justify-center items-center gap-y-12">
          <div className="w-[512px] h-[768px] border">
            <iframe
              ref={iframeRef}
              src={`${protoPieUrl}&sceneId=${sceneId}`}
              className="w-full h-full"
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
