// globe-webgl.js — Uses globe.gl library for a production-quality Earth globe
// window.GlobeComponent — React component that renders the globe

(function() {
  // We'll init the globe.gl instance imperatively inside the React wrapper
  window.GLOBE_GL_READY = false;
  window.GLOBE_GL_QUEUE = [];
})();
