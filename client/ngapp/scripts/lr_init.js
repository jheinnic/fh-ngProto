(function() {
  'use strict';
  //document.write('<script src="http://'
  //+ window.location.hostname
  //+ ':35729/livereload.js?snipver=1" type="text/javascript"><\/script>');

  function addLiveReloadScript () {
    var scriptElem = document.createElement('script');
    scriptElem.src = 'http://' + window.location.hostname + ':35729/livereload.js?snipver=1';
    scriptElem.type = 'text/javascript';
    document.body.appendChild(scriptElem);
  }

  window.setTimeout(addLiveReloadScript, 250);
}).call(window);
