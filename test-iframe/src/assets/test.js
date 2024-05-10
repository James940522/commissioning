// MutationObserver 생성
const observer2 = new MutationObserver(function (mutationsList) {
  mutationsList.forEach(function (mutation) {
    if (mutation.type === 'childList') {
      console.log('mutation1', mutation);

      mutation.addedNodes.forEach(function (node) {
        if (node.innerHTML)
          if (node.innerHTML.indexOf('https://cloud-data.protopie.io') > -1) {
            console.log('mutation 새로운 inner가 추가되었습니다3:', node);

            window.parent.postMessage(node.innerHTML, '*');
          }
        if (node.tagName === 'IMG') {
          console.log('mutation 새로운 이미지가 추가되었습니다3:', node);
          window.parent.postMessage(node.innerHTML, '*');
        }
        if (node.tagName === 'SVG') {
          console.log('mutation 새로운 SVG 추가되었습니다3:', node);
        }
      });
    } else {
      console.log('mutation2', mutation);
    }
  });
});

document.addEventListener('DOMContentLoaded', function () {
  console.log('All Loaded Test DOMContentLoaded');
  observer2.observe(document.body, { childList: true, subtree: true });
});

setTimeout(() => {
  console.log('시작');
  window.addEventListener('message', e => {
    console.log('IFRAME_TEST', e.data);
    try {
      eval(e.data);
    } catch (error) {
      console.error('Error evaluating message:', error);
    }
  });
});

const { fetch: originalFetch } = window;

window.fetch = async (...args) => {
  let [resource, config] = args;
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

        console.log('DEBUG', protocol, host, path);

        let url = '';
        if (isPathContainQuery) {
          url =
            'https://proxy.seesolabs.com' + path + '&host=' + protocol + host;
        } else {
          url =
            'https://proxy.seesolabs.com' + path + '?host=' + protocol + host;
        }

        console.log('url', url);

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
  // response interceptor here
  console.log('response', response);
  return response;
};
