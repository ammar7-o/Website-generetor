// // Make editor global
// window.editor = grapesjs.init({
//   container: '#editor',
//   fromElement: true,
//   height: '100vh',
//   width: 'auto',
//   storageManager: false,
//   plugins: ['gjs-preset-webpage'],
//   pluginsOpts: {
//     'gjs-preset-webpage': {}
//   }
// });
// this for add blocks from preset-webpage



window.editor = grapesjs.init({
  container: '#editor',
  fromElement: true,
  height: '100vh',
  width: 'auto',
  storageManager: false,
  plugins: ['gjs-preset-webpage'],
  pluginsOpts: {
    'gjs-preset-webpage': {
      blocks: [],             // disable its own basic blocks
      blocksBasicOpts: false, // disable grapesjs-blocks-basic plugin
      navbarOpts: false,      // prevent loading navbar plugin
      countdownOpts: false,   // if present
      formsOpts: false,       // disable forms plugin
      exportOpts: false,      // disable export plugin
      aviaryOpts: false,
      filestackOpts: false
    }
  }
});
