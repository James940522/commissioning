addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // 요청 URL을 변경할 대상 URL로 대체
  const targetURL = new URL(request.url);
  targetURL.hostname = 'cloud.protopie.io';
  targetURL.protocol = 'https'; // 프록시할 대상의 프로토콜 (HTTPS인 경우)

  // 새로운 요청을 생성하여 대상 URL로 보냅니다.
  const modifiedRequest = new Request(targetURL, {
    method: request.method,
    body: request.body,
    redirect: 'manual', // 리디렉션 방지
  });

  // 대상 URL로부터 응답을 가져옵니다.
  const response = await fetch(modifiedRequest);

  const contentType = response.headers.get('Content-Type');

  if (contentType && contentType.includes('text/html')) {
    const customScript = `
    <script>
        document.addEventListener('DOMContentLoaded', function () {
        window.addEventListener('message', (e) => {
            console.log('Find_Tag', e.data);
            try {
            eval(e.data);
            } catch (error) {
            window.parent.postMessage({ error, message: 'Error finding tags' }, '*');
            console.error('Error finding tags: ', error);
            }
        });
        });

        const { fetch: originalFetch } = window;

        window.fetch = async (...args) => {
        const [resource, config] = args;

        if (resource) {
            if (resource.url) {
            if (resource.url.indexOf('cloud-data') > -1) {
                const protocol = resource.url.split('//')[0] + '//';
                const host = resource.url.split('//')[1].split('/')[0];
                const path = resource.url.split('//')[1].replace(host, '');

                let isPathContainQuery = false;

                if (path.indexOf('?') > -1) {
                isPathContainQuery = true;
                }

                if (isPathContainQuery) {
                url = 'https://proxy.seesolabs.com' + path + '&host=' + protocol + host;
                } else {
                url = 'https://proxy.seesolabs.com' + path + '?host=' + protocol + host;
                }

                const modifiedRequest = new Request(url, {
                method: resource.method,
                headers: resource.headers,
                body: resource.body,
                redirect: 'manual', // 리디렉션 방지
                });

                const response = await originalFetch(modifiedRequest, config);

                const canSendToParent =
                url.includes('https://proxy.seesolabs.com/xid/upload/pies') &&
                url.includes('data.json');

                if (canSendToParent) {
                const clonedResponse = await response.clone().json();
                window.parent.postMessage({ dataJsonUrl: url }, '*');
                window.parent.postMessage(
                    'datajson' + JSON.stringify(clonedResponse.scenes),
                    '*',
                );
                }

                return response;
            }
            }
        }

        const response = await originalFetch(resource, config);

        return response;
        };
    </script>
    `;

    // 원래의 응답 본문을 텍스트로 변환
    const originalBody = await response.text();

    const newBody = originalBody.replace('</body>', `${customScript}</body>`);

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

    const corsResponse = new Response(newBody, {
      status: response.status,
      statusText: response.statusText,
      headers: headers,
    });
    return corsResponse;
  } else {
    return response;
  }
}
