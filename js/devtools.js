var profiler;
chrome.devtools.panels.create(
    'Symfony Profiler',
    '/img/symfony01.png',
    '/pages/panel.html',
    function (panel) {
        function setProfilerPanel(p) {
            profiler = p;
        }

        panel.onShown.addListener(setProfilerPanel);
        panel.onHidden.addListener(setProfilerPanel);
    }
);

var navigatedURL;
chrome.devtools.network.onNavigated.addListener(function (url) {
    navigatedURL = url;
});

chrome.devtools.network.onRequestFinished.addListener(function (request) {
    if (navigatedURL !== request.request.url) {
        return;
    }

    var responseHeaders = request.response.headers;
    if (responseHeaders.length < 1) {
        return;
    }

    var headerFound = false;
    var panelURL = '/pages/index.html';
    for (var x = 0; x < responseHeaders.length; x++) {
        var header = responseHeaders[x];
        if (header.name.toLowerCase() === 'x-debug-token-link') {
            panelURL = header.value;
            headerFound = true;
            break;
        }
    }

    profiler.document
        .getElementById('symfony-profiler')
        .setAttribute('src', panelURL);
});
