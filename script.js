/* ===========================================================
   PIN ICONS (inline SVG so they inherit the theme colors)
   =========================================================== */
const PIN_ICONS = {
  heart: `
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path fill="#FFC7DE" stroke="#fff" stroke-width="1.5"
        d="M16 28s-11-7.2-14-13.4C.4 9.8 3 5 8 5c3 0 5.3 1.8 8 5 2.7-3.2 5-5 8-5 5 0 7.6 4.8 6 9.6C27 20.8 16 28 16 28z"/>
    </svg>`,
  daisy: `
    <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g fill="#FFFFFF" stroke="#EFE4CC" stroke-width="0.6">
        <ellipse cx="16" cy="6" rx="4.2" ry="6"/>
        <ellipse cx="16" cy="26" rx="4.2" ry="6"/>
        <ellipse cx="6" cy="16" rx="6" ry="4.2"/>
        <ellipse cx="26" cy="16" rx="6" ry="4.2"/>
        <ellipse cx="9" cy="9" rx="4.2" ry="6" transform="rotate(45 9 9)"/>
        <ellipse cx="23" cy="23" rx="4.2" ry="6" transform="rotate(45 23 23)"/>
        <ellipse cx="23" cy="9" rx="4.2" ry="6" transform="rotate(-45 23 9)"/>
        <ellipse cx="9" cy="23" rx="4.2" ry="6" transform="rotate(-45 9 23)"/>
      </g>
      <circle cx="16" cy="16" r="5.5" fill="#FFFF84"/>
    </svg>`
};

/* ===========================================================
   RENDER GALLERY
   =========================================================== */
const galleryEl = document.getElementById('gallery');
const emptyStateEl = document.getElementById('empty-state');
const countPillEl = document.getElementById('photo-count');

function renderGallery(images){
  galleryEl.innerHTML = '';

  if (!images || images.length === 0){
    emptyStateEl.hidden = false;
    countPillEl.textContent = '0 memories';
    return;
  }
  emptyStateEl.hidden = true;

  images.forEach((item) => {
    const pinType = item.pin === 'daisy' ? 'daisy' : 'heart';

    const card = document.createElement('article');
    card.className = 'card';

    card.innerHTML = `
      <div class="card-pin">${PIN_ICONS[pinType]}</div>
      <div class="card-photo-wrap">
        <img src="${item.url}" alt="${item.caption || 'gallery photo'}" loading="lazy" />
      </div>
      ${item.caption ? `<p class="card-caption">${item.caption}</p>` : ''}
    `;

    card.addEventListener('click', () => openLightbox(item.url, item.caption || ''));
    galleryEl.appendChild(card);
  });

  countPillEl.textContent = `${images.length} ${images.length === 1 ? 'memory' : 'memories'}`;
}

renderGallery(GALLERY_IMAGES || []);

/* ===========================================================
   LIGHTBOX
   =========================================================== */
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxCaption = document.getElementById('lightbox-caption');
const lightboxClose = document.getElementById('lightbox-close');

function openLightbox(url, caption){
  lightboxImg.src = url;
  lightboxCaption.textContent = caption;
  lightbox.classList.add('open');
}
function closeLightbox(){
  lightbox.classList.remove('open');
  lightboxImg.src = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* ===========================================================
   FLOATING BACKGROUND DECOR (hearts + daisies drifting)
   =========================================================== */
(function seedFloaties(){
  const container = document.getElementById('floaties');
  const symbols = ['♡', '✿', '❀', '♡'];
  const count = window.innerWidth < 600 ? 8 : 14;

  for (let i = 0; i < count; i++){
    const el = document.createElement('span');
    el.className = 'floaty';
    el.textContent = symbols[i % symbols.length];
    el.style.left = `${Math.random() * 100}%`;
    el.style.top = `${Math.random() * 100}%`;
    el.style.animationDuration = `${10 + Math.random() * 8}s`;
    el.style.animationDelay = `${Math.random() * 6}s`;
    el.style.fontSize = `${16 + Math.random() * 14}px`;
    container.appendChild(el);
  }
})();

/* ===========================================================
   CLOUDINARY — "Add a photo" upload widget
   New uploads are added to the on-screen gallery immediately.
   To make a new photo permanent, copy its URL (logged to the
   console and shown in an alert) into GALLERY_IMAGES in config.js.
   =========================================================== */
const addPhotoBtn = document.getElementById('add-photo-btn');

addPhotoBtn.addEventListener('click', () => {
  if (typeof cloudinary === 'undefined'){
    alert('Cloudinary widget failed to load — check your internet connection.');
    return;
  }
  if (CLOUDINARY_CLOUD_NAME === 'YOUR_CLOUD_NAME'){
    alert('Set up your Cloudinary cloud name and upload preset in config.js first! Check the README for steps.');
    return;
  }

  const widget = cloudinary.createUploadWidget(
    {
      cloudName: CLOUDINARY_CLOUD_NAME,
      uploadPreset: CLOUDINARY_UPLOAD_PRESET,
      folder: 'our-secret-space',
      multiple: false,
      styles: {
        palette: {
          window: '#FFFFFF',
          sourceBg: '#F5EAF6',
          windowBorder: '#C7A0CB',
          tabIcon: '#C7A0CB',
          inactiveTabIcon: '#8A768F',
          menuIcons: '#C7A0CB',
          link: '#8A6C90',
          action: '#C7A0CB',
          inProgress: '#FFFF84',
          complete: '#8BC98F',
          error: '#E27D8B',
          textDark: '#5B4763',
          textLight: '#FFFFFF'
        },
        fonts: {
          "'Quicksand', sans-serif": {
            url: 'https://fonts.googleapis.com/css2?family=Quicksand',
            active: true
          }
        }
      }
    },
    (error, result) => {
      if (!error && result && result.event === 'success'){
        const url = result.info.secure_url;

        const newItem = {
          url,
          pin: Math.random() > 0.5 ? 'heart' : 'daisy',
          caption: ''
        };
        GALLERY_IMAGES = [...(GALLERY_IMAGES || []), newItem];
        renderGallery(GALLERY_IMAGES);

        console.log('New photo uploaded! Add this to GALLERY_IMAGES in config.js to keep it:', newItem);
        alert('Photo added! To keep it in your gallery permanently, copy the URL from the browser console into config.js.');
      }
    }
  );

  widget.open();
});
