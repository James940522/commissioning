addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  console.log('request.url', request.url);

  //   if (false) {
  //     // if(request.url.indexOf('seeso.js') > -1 ){

  //     const modifiedRequest = new Request(
  //       'https://proxy.seesolabs.com/seeso.js',
  //       {
  //         method: request.method,
  //         headers: request.headers,
  //         body: request.body,
  //         redirect: 'manual', // 리디렉션 방지
  //       },
  //     );

  //     const response = await fetch(modifiedRequest);

  //     const headers = new Headers(response.headers);
  //     headers.set('Access-Control-Allow-Origin', '*'); // 모든 Origin 허용 (보안상 주의)
  //     headers.set(
  //       'Access-Control-Allow-Methods',
  //       'GET, POST, PUT, DELETE, OPTIONS',
  //     );
  //     headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  //     headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  //     headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  //     headers.set('Cross-Origin-Resource-Policy', 'cross-origin');
  //     headers.set(
  //       'Access-Control-Expose-Headers',
  //       'Cross-Origin-Embedder-Policy,Cross-Origin-Opener-Policy,Cross-Origin-Resource-Policy',
  //     );

  //     const corsResponse = new Response(response.body, {
  //       status: response.status,
  //       statusText: response.statusText,
  //       headers: headers,
  //     });

  //     // const data = await response.text();
  //     // console.log(data);
  //     return corsResponse;
  //   } else {
  // 요청 URL을 변경할 대상 URL로 대체합니다.
  const targetURL = new URL(request.url);
  targetURL.hostname = 'cloud.protopie.io'; // 프록시할 대상의 호스트네임
  targetURL.protocol = 'https'; // 프록시할 대상의 프로토콜 (HTTPS인 경우)

  const headers = new Headers(request.headers);
  headers.set(
    'User-Agent',
    'Mozilla/5.0 (Linux; Android 14; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.113 Mobile Safari/537.35',
  ); // 모든 Origin 허용 (보안상 주의)

  // 새로운 요청을 생성하여 대상 URL로 보냅니다.
  const modifiedRequest = new Request(targetURL, {
    method: request.method,
    headers,
    body: request.body,
    redirect: 'manual', // 리디렉션 방지
  });

  // 대상 URL로부터 응답을 가져옵니다.
  const response = await fetch(modifiedRequest);

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('text/html')) {
    // const headerimportScript = `

    // <script type="module" defer>
    // import Seeso, {UserStatusOption} from '/seeso.js';
    // console.log('hi this from seeso');
    // const seesoInstance = new Seeso();

    // await seesoInstance.initialize(
    //   'prod_z1majmawcx2ervgjpbiyvfcclxbptftzxrlrsf1t',
    //   new UserStatusOption(false, false, false),
    //   4
    // );

    // function onGaze(gazeInfo){
    //   console.log(gazeInfo)
    // }
    // seesoInstance.addGazeCallback(onGaze);
    // // const stream = await navigator.mediaDevices.getUserMedia({ video: {facingMode: "user"} });
    // // seesoInstance.startTracking(stream)

    // // MyClass의 인스턴스를 생성합니다.
    // // const seeso = new Seeso();
    // console.log('Seeso', seesoInstance);
    // console.log('Seeso UserStatusOption', UserStatusOption);
    // </script>
    // `;

    const customScript = `
  <script>
  // var originalXHR = window.XMLHttpRequest;

  // function CustomXHR() {
  //     var xhr = new originalXHR();
  
  //     xhr.onreadystatechange = function() {
  //         if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
  //             var contentType = xhr.getResponseHeader("Content-Type");
  //             if (contentType && contentType.includes("image/svg+xml")) {
  //                 console.log("SVG 요청이 감지되었습니다:", xhr.responseURL);
  //             }
  //         }
  //     };
  
  //     return xhr;
  // }

  // window.XMLHttpRequest = CustomXHR;

  // MutationObserver를 document에 연결

  // window.onmessage = function(arg){
  //   console.log('callFromIframe2', arg)
  // }




  // MutationObserver 생성
var observer2 = new MutationObserver(function(mutationsList) {
    mutationsList.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          console.log('mutation1', mutation);

            mutation.addedNodes.forEach(function(node) {
                if(node.innerHTML)
                if(node.innerHTML.indexOf('https://cloud-data.protopie.io') > -1){
                  console.log('mutation 새로운 inner가 추가되었습니다3:', node);

                  // let obj = JSON.parse(JSON.stringify(node));
                  window.parent.postMessage(node.innerHTML, "*")

                  // window.parent.callFromIframe(node);


                  // var newURL = "https://proxy.seesolabs.com";

                  // // 정규 표현식을 사용하여 URL 값 변경           
                  // const newInnerHtml = node.innerHTML.replace("\/(https:\/\/cloud-data.protopie.io)\/\g\", function(match, p1, p2) {
                  //   return newURL + p2 + "?host=https://cloud-data.protopie.io";
                  // });
                  // node.innerHTML = newInnerHtml;


                }
                if (node.tagName === 'IMG') {
                    // const originSrc = node.src;
                    // const newURL = "https://proxy.seesolabs.com";
                    // const newSrc = originSrc.replace('cloud-data.protopie.io', 'proxy.seesolabs.com') + '&host=https://cloud-data.protopie.io';
                    // node.src = newSrc;
                    console.log('mutation 새로운 이미지가 추가되었습니다3:', node);
                    // window.parent.callFromIframe(node);
                    // let obj = JSON.parse(JSON.stringify(node));
                    window.parent.postMessage(node.innerHTML, "*")


                }
                if (node.tagName === 'SVG') {
                  // const originSrc = node.src;
                  // const newURL = "https://proxy.seesolabs.com";
                  // const newSrc = originSrc.replace('cloud-data.protopie.io', 'proxy.seesolabs.com') + '&host=https://cloud-data.protopie.io';
                  // node.src = newSrc;
                  console.log('mutation 새로운 SVG 추가되었습니다3:', node);
                  // window.parent.callFromIframe(node);
                  let obj = JSON.parse(JSON.stringify(node));
                  // window.parent.postMessage(node.innerHTML, "*")


              }
            });
        }else{
          console.log('mutation2', mutation);
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
  observer2.observe(document.body, { childList: true, subtree: true });
});
// MutationObserver를 body 요소에 연결




  //  // MutationObserver 생성
  //  var observer = new MutationObserver(function(mutationsList) {
  //      mutationsList.forEach(function(mutation) {
  //          if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
  //              console.log('src 속성이 변경되었습니다.');
  //              // 변경된 src 속성 값 출력
  //              console.log('새로운 src:', targetElement.src);
  //          }
  //      });
  //  });
  // //  var targetElement = document.getElementById('example');

  //  var imgElements = document.getElementsByTagName('img');

  //   // imgElements를 배열로 변환하여 처리하거나 반복할 수 있습니다.
  //   // 예를 들어, 콘솔에 모든 img 요소의 src 속성 값을 출력하는 방법은 다음과 같습니다.
  //   for (var i = 0; i < imgElements.length; i++) {
  //       observer.observe(imgElements[i], { attributes: true });
  //   }

  

    // MutationObserver를 특정 HTML 요소에 연결



    // var originalAppendChild = document.head.appendChild;

    // // appendChild 메서드 재정의
    // document.head.appendChild = function(newChild) {
    //     console.log("Appending a child to the document head:", newChild);

    //   if (newChild.tagName === 'SCRIPT' && newChild.src) {
    //       console.log("Original src attribute:", newChild.src);

    //       const originSrc = newChild.src;
    //       const newURL = "https://proxy.seesolabs.com";
    //       const newSrc = originSrc.replace('static.protopie.io', 'proxy.seesolabs.com') + '?host=https://static.protopie.io';
    //       newChild.src = newSrc;

    //       console.log("New src attribute:", newChild.src);

    //   }
  
    //   return originalAppendChild.apply(this, arguments);
    // };

   
    const { fetch: originalFetch } = window;



    window.fetch = async (...args) => {

        let [resource, config ] = args;
        if(resource){
          console.log('fetch 요청이 감지되었습니다.', resource)

            if(resource.url){
                // if(resource.url.indexOf('cloud-data') > -1 || resource.url.indexOf('static.protopie') > -1 ){
                  if(resource.url.indexOf('cloud-data') > -1){

                  const protocol = resource.url.split('//')[0] + '//';
                  const host = resource.url.split('//')[1].split('/')[0];

                  const path = resource.url.split('//')[1].replace(host, '');

                  let isPathContainQuery = false;

                  if(path.indexOf('?') > -1){
                    isPathContainQuery = true;
                  }

                  console.log('DEBUG', protocol, host, path)
        

                  let url = ''
                  if(isPathContainQuery){
                    url = 'https://proxy.seesolabs.com' + path + '&host=' + protocol + host
                  }else{
                    url = 'https://proxy.seesolabs.com' + path + '?host=' + protocol + host

                  }

                  console.log('url', url);

                  const modifiedRequest = new Request(url, {
                    method: resource.method,
                    headers: resource.headers,
                    body: resource.body,
                    redirect: 'manual' // 리디렉션 방지
                  })


                  const response = await originalFetch(modifiedRequest, config);

                  return response;
                  
                    // const newHeaders = new Headers();
                    // newHeaders.set('Content-Type', 'application/json');
                    // const dummyResponse = new Response(JSON.stringify(json), {
                    //     status: 200,
                    //     statusText: "",
                    //     headers: newHeaders
                    // })
                    // return dummyResponse
                }
            }
        }
        
        const response = await originalFetch(resource, config);
        // response interceptor here
        console.log('response', response)
        return response;
    };



      // async function loadSeeso(){
      //   const Seeso = await importUMD('https://seeso-js-cdn.s3.ap-northeast-2.amazonaws.com/no-filter/seeso.js');

      //   console.log(Seeso);
      // }

      // loadSeeso();
      

      window.onload = function() {
        // 모든 리소스 로드 완료 후 실행될 코드
        window.parent.postMessage('loaded', '*');
      };

      document.addEventListener('DOMContentLoaded', function () {
        // Dom이 모두 렌더 되었을 때 message 실행
        window.addEventListener('message', e => {
          console.log('IFRAME_TEST', e.data);
          try {
            eval(e.data);
          } catch (error) {
            console.error('Error evaluating message:', error);
          }
        });
      });

  </script>    
`;

    let elements;
    let intervalId = 0;
    let count = 0;
    // while (!elements) {
    //   await new Promise(resolve => setTimeout(resolve, 1000));
    //   console.log('All Loaded Test 찾는중', count)
    //     elements = document.querySelectorAll(
    //       'div[data-layer-id="${dataLayerId}"]',
    //     );
    //   }
    //   count += 500;

    //   if (count > 5000) {
    //     console.log('도저히 못찾겠음');
    //     break;
    //   }
    // }

    console.log('Chacha', window.parent);
    window.parent.postMessage('Chacha!', '*');

    window.postMessage('All Loaded Test 결과', elements);
    console.log('All Loaded Test', element);

    if (resouce.url.includes())
      console.log(
        'fetch중',
        resouce.url,
        resouce.url(
          'https://proxy.seesolabs.com/xid/upload/pies/aac5c7bd3f/rev/1/data.json',
        ),
        new RegExp(
          'https://proxy.seesolabs.com/xid/upload/pies/\\w/rev/1/data.json\\w',
        ),
      );

    if (resource.url) {
      console.log(
        'fetch중',
        resource.url.includes('https://proxy.seesolabs.com/xid/upload/pies') &&
          resource.url.includes('data.json'),
      );
    }

    console.log(
      'fetch중',
      resource.url.includes('https://proxy.seesolabs.com/xid/upload/pies') &&
        resource.url.includes('data.json'),
    );
    // MutationObserver 생성
    var observer2 = new MutationObserver(function (mutationsList) {
      console.log('All Loaded Test', mutationsList);
      mutationsList.forEach(function (mutation) {
        allRendered = false;
        if (mutation.type === 'childList') {
          console.log('mutation1', mutation);

          mutation.addedNodes.forEach(function (node) {
            if (node.innerHTML)
              if (
                node.innerHTML.indexOf('https://cloud-data.protopie.io') > -1
              ) {
                console.log('mutation 새로운 inner가 추가되었습니다3:', node);

                // let obj = JSON.parse(JSON.stringify(node));
                window.parent.postMessage(node.innerHTML, '*');

                // window.parent.callFromIframe(node);

                // var newURL = "https://proxy.seesolabs.com";

                // // 정규 표현식을 사용하여 URL 값 변경
                // const newInnerHtml = node.innerHTML.replace("\/(https:\/\/cloud-data.protopie.io)\/\g\", function(match, p1, p2) {
                //   return newURL + p2 + "?host=https://cloud-data.protopie.io";
                // });
                // node.innerHTML = newInnerHtml;
              }
            if (node.tagName === 'IMG') {
              // const originSrc = node.src;
              // const newURL = "https://proxy.seesolabs.com";
              // const newSrc = originSrc.replace('cloud-data.protopie.io', 'proxy.seesolabs.com') + '&host=https://cloud-data.protopie.io';
              // node.src = newSrc;
              console.log('mutation 새로운 이미지가 추가되었습니다3:', node);
              // window.parent.callFromIframe(node);
              // let obj = JSON.parse(JSON.stringify(node));
              window.parent.postMessage(node.innerHTML, '*');
            }
            if (node.tagName === 'SVG') {
              // const originSrc = node.src;
              // const newURL = "https://proxy.seesolabs.com";
              // const newSrc = originSrc.replace('cloud-data.protopie.io', 'proxy.seesolabs.com') + '&host=https://cloud-data.protopie.io';
              // node.src = newSrc;
              console.log('mutation 새로운 SVG 추가되었습니다3:', node);
              // window.parent.callFromIframe(node);
              let obj = JSON.parse(JSON.stringify(node));
              // window.parent.postMessage(node.innerHTML, "*")
            }
          });
        } else {
          console.log('mutation2', mutation);
        }
      });
    });

    // 원래의 응답 본문을 텍스트로 변환합니다.
    const originalBody = await response.text();

    const newBody = originalBody.replace('</body>', `${customScript}</body>`);
    // const newBody2 = newBody.replace('</body>', `${headerimportScript}</body>`);
    // const newBody3 = newBody2.replaceAll('https://static.protopie.io', 'https://proxy.seesolabs.com');

    // 새로운 URL 값
    // var newURL = "https://proxy.seesolabs.com";

    // 정규 표현식을 사용하여 URL 값 변경
    // const newBody3 = newBody2.replace(/(https:\/\/static\.protopie\.io)(\/[^"']*)/g, function(match, p1, p2) {
    //   return newURL + p2 + "?host=https://static.protopie.io";
    // });

    // // 수정된 본문으로 새로운 Response 객체를 생성합니다.
    // const modifiedResponse = new Response(modifiedBody, response);

    // console.log('newBody3', newBody3)

    //   // 커스텀 자바스크립트 코드를 응답 본문에 추가합니다.
    //   const newBody = originalBody + customScript;

    // 새로운 응답 본문을 설정합니다.
    // modifiedResponse.body = newBody;

    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*'); // 모든 Origin 허용 (보안상 주의)
    headers.set(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, DELETE, OPTIONS',
    );
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    headers.set(
      'User-Agent',
      'Mozilla/5.0 (Linux; Android 14; SM-A205U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.6367.113 Mobile Safari/537.35',
    ); // 모든 Origin 허용 (보안상 주의)

    // headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
    // headers.set('Cross-Origin-Opener-Policy', 'same-origin')
    // headers.set('Cross-Origin-Resource-Policy', 'cross-origin')
    // headers.set('Access-Control-Expose-Headers', 'Cross-Origin-Embedder-Policy,Cross-Origin-Opener-Policy,Cross-Origin-Resource-Policy')

    // console.log(originalBody)

    const corsResponse = new Response(newBody, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
    return corsResponse;
  } else {
    return response;
  }
  // 원격 서버의 응답을 클라이언트에게 반환합니다.
}
// }
