(function(document) {
  window.MBP = window.MBP || {}; 

  // Fix for iPhone viewport scale bug 
  // http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
  MBP.viewportmeta = document.querySelector && document.querySelector('meta[name="viewport"]');
  MBP.ua = navigator.userAgent;

  MBP.scaleFix = function () {
    if (MBP.viewportmeta && /iPhone|iPad/.test(MBP.ua) && !/Opera Mini/.test(MBP.ua)) {
      MBP.viewportmeta.content = "width=device-width, minimum-scale=1.0, maximum-scale=1.0";
      document.addEventListener("gesturestart", MBP.gestureStart, false);
    }
  };
  MBP.gestureStart = function () {
      MBP.viewportmeta.content = "width=device-width, minimum-scale=0.25, maximum-scale=1.6";
  };

  // Hide URL Bar for iOS
  // http://remysharp.com/2010/08/05/doing-it-right-skipping-the-iphone-url-bar/
  MBP.hideUrlBar = function () {
      /iPhone/.test(MBP.ua) && !location.hash && setTimeout(function () {
        pageYOffset || window.scrollTo(0, 1);
      }, 1000);
  };

  // iOS Startup Image
  // https://github.com/shichuan/mobile-html5-boilerplate/issues#issue/2
  MBP.splash = function () {
      var filename = navigator.platform === 'iPad' ? 'h/' : 'l/';
      document.write('<link rel="apple-touch-startup-image" href="/img/' + filename + 'splash.png" />' );
  };
})(document);