// Make editor global
window.editor = grapesjs.init({
  container: '#editor',
  fromElement: true,
  height: '100vh',
  width: 'auto',
  storageManager: false,
  plugins: ['gjs-preset-webpage'],
  pluginsOpts: {
    'gjs-preset-webpage': {}
  }
});
