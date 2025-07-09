// Add custom blocks
const blockManager = editor.BlockManager;

blockManager.add('custom-heading', {
  label: 'Heading',
  category: 'Ammar',
  content: '<h1>My Custom Heading</h1>',
  attributes: { class: 'fa fa-header' }
});
blockManager.add('ammar', {
  label: 'ammar',
  category: 'Ammar',
  content: '<h1>hello i am Ammar</h1>',
  attributes: { class: 'fa fa-header' }
});


blockManager.add('custom-paragraph', {
  label: 'Paragraph',
  category: 'Ammar',
  content: '<p>Write something amazing here...</p>',
  attributes: { class: 'fa fa-paragraph' }
});

blockManager.add('custom-button', {
  label: 'Button',
  category: 'Ammar',
  content: '<button class="btn">Click Me</button>',
  attributes: { class: 'fa fa-hand-pointer-o' }
});

blockManager.add('custom-image', {
  label: 'Image',
  category: 'Media',
  content: { type: 'image' },
  attributes: { class: 'fa fa-image' }
});