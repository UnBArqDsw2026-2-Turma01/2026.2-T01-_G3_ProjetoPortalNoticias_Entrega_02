(() => {
  const modal = document.createElement('div');
  modal.className = 'diagram-modal';
  modal.hidden = true;
  modal.innerHTML = `
    <div class="diagram-modal-backdrop" data-diagram-close></div>
    <div class="diagram-modal-panel" role="dialog" aria-modal="true" aria-label="Visualizador de diagrama">
      <div class="diagram-modal-tools" aria-label="Controles de zoom">
        <button type="button" data-diagram-zoom="out" aria-label="Reduzir zoom">-</button>
        <button type="button" data-diagram-zoom="reset" aria-label="Restaurar zoom">100%</button>
        <button type="button" data-diagram-zoom="in" aria-label="Aumentar zoom">+</button>
      </div>
      <button class="diagram-modal-close" type="button" aria-label="Fechar visualizador" data-diagram-close>&times;</button>
      <div class="diagram-modal-content"></div>
    </div>`;
  document.body.appendChild(modal);

  const content = modal.querySelector('.diagram-modal-content');
  let zoom = 1;
  const close = () => {
    modal.hidden = true;
    content.replaceChildren();
    document.body.classList.remove('diagram-modal-open');
  };

  const open = (source, title) => {
    const isImage = /\.(avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i.test(source);
    const element = isImage ? document.createElement('img') : document.createElement('iframe');
    element.src = source;
    element.alt = title;
    element.title = title;
    element.className = 'diagram-modal-media';
    if (!isImage) element.loading = 'lazy';
    content.replaceChildren(element);
    zoom = 1;
    modal.hidden = false;
    document.body.classList.add('diagram-modal-open');
  };

  const changeZoom = (direction) => {
    if (direction === 'reset') zoom = 1;
    if (direction === 'in') zoom = Math.min(3, zoom + 0.25);
    if (direction === 'out') zoom = Math.max(0.5, zoom - 0.25);
    const media = content.querySelector('.diagram-modal-media');
    if (media) {
      media.style.width = `${zoom * 100}%`;
      media.style.height = `${zoom * 100}%`;
      media.style.maxWidth = 'none';
      media.style.maxHeight = 'none';
    }
  };

  document.querySelectorAll('.diagram-frame').forEach((frame) => {
    const source = frame.getAttribute('src');
    const title = frame.getAttribute('title') || 'Diagrama';
    if (!source) return;

    const preview = document.createElement('button');
    preview.type = 'button';
    preview.className = 'diagram-preview';
    preview.title = 'Abrir diagrama ampliado';
    preview.setAttribute('aria-label', `Abrir ${title} ampliado`);

    if (/\.(avif|gif|jpe?g|png|svg|webp)(?:[?#].*)?$/i.test(source)) {
      const image = document.createElement('img');
      image.src = source;
      image.alt = title;
      image.loading = 'lazy';
      preview.appendChild(image);
    } else {
      preview.textContent = 'Abrir diagrama ampliado';
    }

    preview.addEventListener('click', () => open(source, title));
    frame.replaceWith(preview);
  });

  modal.addEventListener('click', (event) => {
    if (event.target.matches('[data-diagram-close]')) close();
    const zoomButton = event.target.closest('[data-diagram-zoom]');
    if (zoomButton) changeZoom(zoomButton.dataset.diagramZoom);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) close();
  });
})();
