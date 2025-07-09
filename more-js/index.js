 document.addEventListener('DOMContentLoaded', () => {
            const waitForEditor = () => {
                if (window.editor) {
                    const editor = window.editor;
                    const importBtn = document.getElementById('importHtml');
                    const exportBtn = document.getElementById('exportHtml');
                    const toggleBtn = document.getElementById('toggleStyleEditor');
                    const panel = document.getElementById('styleEditorPanel');
                    const textarea = document.getElementById('styleEditor');
                    const toggleHideBtn = document.getElementById('toggleHideBtn');

                    let selectedComponent = null;
                    let isUIVisible = true;
                    let isStylePanelVisible = false;

                    function setUIVisibility(show) {
                        const display = show ? 'block' : 'none';
                        importBtn.style.display = display;
                        exportBtn.style.display = display;
                        toggleBtn.style.display = display;
                        toggleHideBtn.textContent = show ? 'Hide' : 'Show';

                        if (!show) {
                            panel.style.display = 'none';
                            isStylePanelVisible = false;
                        }
                        isUIVisible = show;
                    }

                    toggleBtn.addEventListener('click', () => {
                        isStylePanelVisible = !isStylePanelVisible;
                        panel.style.display = isStylePanelVisible ? 'block' : 'none';

                        if (isStylePanelVisible && selectedComponent) {
                            loadStylesToTextarea(selectedComponent);
                        }
                    });

                    toggleHideBtn.addEventListener('click', () => {
                        setUIVisibility(!isUIVisible);
                    });

                    function loadStylesToTextarea(comp) {
                        if (!comp) return;

                        // Get ONLY the explicitly set styles (ignores computed/inherited styles)
                        const styles = comp.getStyle();

                        // Format as CSS
                        const cssString = Object.entries(styles)
                            .filter(([prop, val]) => val) // Remove empty values
                            .map(([prop, val]) => `${prop}: ${val};`)
                            .join('\n');

                        textarea.value = cssString;
                    }

                    editor.on('component:selected', comp => {
                        selectedComponent = comp;
                        if (isStylePanelVisible) {
                            loadStylesToTextarea(comp);
                        }
                    });

                    textarea.addEventListener('input', () => {
                        if (!selectedComponent) return;

                        const styleText = textarea.value;
                        const newStyles = {};

                        styleText.split('\n').forEach(line => {
                            const [prop, val] = line.split(':').map(x => x && x.trim());
                            if (prop && val) {
                                newStyles[prop] = val.replace(/;$/, '');
                            }
                        });

                        selectedComponent.setStyle(newStyles);
                    });

                    editor.on('run:preview', () => setUIVisibility(false));
                    editor.on('stop:preview', () => setUIVisibility(true));

                    // Initialize UI
                    setUIVisibility(true);
                    panel.style.display = 'none';

                    // Import HTML
                    importBtn.addEventListener('change', e => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const reader = new FileReader();
                        reader.onload = function (event) {
                            const htmlContent = event.target.result;
                            editor.DomComponents.getWrapper().set('content', '');
                            editor.setComponents(htmlContent);
                        };
                        reader.readAsText(file);
                    });

                    // Export HTML
                    exportBtn.addEventListener('click', () => {
                        const html = editor.getHtml();
                        const css = editor.getCss();

                        const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Exported Page</title>
  <style>${css}</style>
</head>
<body>
  ${html}
</body>
</html>`;

                        const blob = new Blob([fullHtml], { type: 'text/html' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = 'exported.html';
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                    });

                } else {
                    setTimeout(waitForEditor, 100);
                }
            };

            waitForEditor();
        });