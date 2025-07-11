document.addEventListener('DOMContentLoaded', () => {
    const waitForEditor = () => {
        if (window.editor) {
            const editor = window.editor;
            const importBtn = document.getElementById('importHtml');
            const exportBtn = document.getElementById('exportHtml');
            const toggleStyleBtn = document.getElementById('toggleStyleEditor');
            const toggleHtmlBtn = document.getElementById('toggleHtmlEditor');
            const toggleHideBtn = document.getElementById('toggleHideBtn');

            const stylePanel = document.getElementById('styleEditorPanel');
            const styleTextarea = document.getElementById('styleEditor');

            const htmlPanel = document.getElementById('htmlEditorPanel');
            const htmlTextarea = document.getElementById('htmlEditor');

            // Create format button
            const formatBtn = document.createElement('button');
            formatBtn.textContent = 'Format';
            formatBtn.style.margin = '5px';
            htmlPanel.appendChild(formatBtn);

            let selectedComponent = null;
            let isUIVisible = true;
            let isStylePanelVisible = false;
            let isHtmlPanelVisible = false;

            function setUIVisibility(show) {
                const display = show ? 'block' : 'none';
                importBtn.style.display = display;
                exportBtn.style.display = display;
                toggleStyleBtn.style.display = display;
                toggleHtmlBtn.style.display = display;
                toggleHideBtn.textContent = show ? 'Hide' : 'Show';

                if (!show) {
                    stylePanel.style.display = 'none';
                    htmlPanel.style.display = 'none';
                    isStylePanelVisible = false;
                    isHtmlPanelVisible = false;
                }

                isUIVisible = show;
            }

            toggleStyleBtn.addEventListener('click', () => {
                isStylePanelVisible = !isStylePanelVisible;
                stylePanel.style.display = isStylePanelVisible ? 'block' : 'none';
                if (isStylePanelVisible && selectedComponent) {
                    loadStylesToTextarea(selectedComponent);
                }
            });

            toggleHtmlBtn.addEventListener('click', () => {
                isHtmlPanelVisible = !isHtmlPanelVisible;
                htmlPanel.style.display = isHtmlPanelVisible ? 'block' : 'none';
                if (isHtmlPanelVisible) {
                    const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Page</title>
  <style>${editor.getCss()}</style>
</head>
<body>
${editor.getHtml()}
</body>
</html>`;
                    htmlTextarea.value = fullHtml.trim();
                }
            });

            htmlTextarea.addEventListener('input', () => {
                try {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(htmlTextarea.value, 'text/html');
                    const bodyContent = doc.body.innerHTML;
                    const styleTags = [...doc.querySelectorAll('style')];
                    const combinedCss = styleTags.map(style => style.textContent).join('\n');
                    editor.setComponents(bodyContent);
                    editor.setStyle(combinedCss);
                } catch (err) {
                    console.warn('Invalid HTML:', err);
                }
            });

            toggleHideBtn.addEventListener('click', () => {
                setUIVisibility(!isUIVisible);
            });

            function loadStylesToTextarea(comp) {
                if (!comp) return;
                const styles = comp.getStyle();
                const cssString = Object.entries(styles)
                    .filter(([prop, val]) => val)
                    .map(([prop, val]) => `${prop}: ${val};`)
                    .join('\n');
                styleTextarea.value = cssString;
            }

            styleTextarea.addEventListener('input', () => {
                if (!selectedComponent) return;
                const newStyles = {};
                styleTextarea.value.split('\n').forEach(line => {
                    const [prop, val] = line.split(':').map(x => x && x.trim());
                    if (prop && val) {
                        newStyles[prop] = val.replace(/;$/, '');
                    }
                });
                selectedComponent.setStyle(newStyles);
            });

            editor.on('component:selected', comp => {
                selectedComponent = comp;
                if (isStylePanelVisible) {
                    loadStylesToTextarea(comp);
                }
            });

            editor.on('run:preview', () => {
                setUIVisibility(false);
                stylePanel.style.display = 'none';
                htmlPanel.style.display = 'none';
            });

            editor.on('stop:preview', () => {
                setUIVisibility(true);
            });

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

            // Simple HTML formatter (no external lib)
            function formatHtml(html) {
                let tab = 0;
                return html
                    .replace(/>\s*</g, '>\n<')
                    .split('\n')
                    .map((line) => {
                        if (line.match(/^<\/\w/)) tab--;
                        const indent = '  '.repeat(tab);
                        if (line.match(/^<[^!?\/].*>$/) && !line.endsWith('/>')) tab++;
                        return indent + line;
                    })
                    .join('\n')
                    .trim();
            }

            formatBtn.addEventListener('click', () => {
                htmlTextarea.value = formatHtml(htmlTextarea.value);
            });

            setUIVisibility(true);
            stylePanel.style.display = 'none';
            htmlPanel.style.display = 'none';

        } else {
            setTimeout(waitForEditor, 100);
        }
    };

    waitForEditor();
});
