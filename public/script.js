const form = document.getElementById('uploadForm');
const fileInput = document.getElementById('fileInput');
const dzText = document.getElementById('dzText');
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submitBtn');
const grid = document.getElementById('grid');
const emptyMsg = document.getElementById('emptyMsg');
const itemCount = document.getElementById('itemCount');

fileInput.addEventListener('change', () => {
  dzText.textContent = fileInput.files.length ? fileInput.files[0].name : 'Tap to choose a photo or video';
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!fileInput.files.length) {
    statusEl.textContent = 'Pick a photo or video first!';
    return;
  }

  const formData = new FormData();
  formData.append('media', fileInput.files[0]);
  formData.append('uploader', document.getElementById('uploader').value);
  formData.append('caption', document.getElementById('caption').value);

  submitBtn.disabled = true;
  statusEl.textContent = 'Pinning it up...';

  try {
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (!res.ok) throw new Error((await res.json()).error || 'Upload failed');
    statusEl.textContent = 'Added! 💜';
    form.reset();
    dzText.textContent = 'Tap to choose a photo or video';
    loadGallery();
  } catch (err) {
    statusEl.textContent = err.message;
  } finally {
    submitBtn.disabled = false;
    setTimeout(() => (statusEl.textContent = ''), 3000);
  }
});

function timeAgo(ts) {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function renderItem(item, index) {
  const card = document.createElement('div');
  card.className = 'polaroid';
  card.dataset.id = item.id;

  const mediaHtml = item.type === 'video'
    ? `<video src="${item.url}" controls playsinline></video>`
    : `<img src="${item.url}" alt="${item.caption || 'gallery memory'}" loading="lazy">`;

  const pinHtml = `<div class="pin daisy">
         <span class="petal"></span><span class="petal"></span><span class="petal"></span>
         <span class="petal"></span><span class="petal"></span><span class="petal"></span>
         <span class="center"></span>
       </div>`;

  card.innerHTML = `
    ${pinHtml}
    <button class="delete-btn" title="Remove this">✕</button>
    <div class="media-frame">${mediaHtml}</div>
    <div class="caption-row">
      ${item.caption ? `<p class="caption-text">${escapeHtml(item.caption)}</p>` : ''}
      <p class="meta-text">${escapeHtml(item.uploader)} · ${timeAgo(item.uploadedAt)}</p>
    </div>
  `;

  card.querySelector('.delete-btn').addEventListener('click', async () => {
    if (!confirm('Remove this from the wall?')) return;
    await fetch(`/api/items/${item.id}?type=${item.type}`, { method: 'DELETE' });
    loadGallery();
  });

  return card;
}

async function loadGallery() {
  const res = await fetch('/api/items');
  const items = await res.json();

  grid.innerHTML = '';
  if (items.length === 0) {
    emptyMsg.style.display = 'block';
  } else {
    emptyMsg.style.display = 'none';
    items.forEach((item, i) => grid.appendChild(renderItem(item, i)));
  }
  itemCount.textContent = items.length ? `${items.length} memor${items.length === 1 ? 'y' : 'ies'} pinned` : '';
}

loadGallery();
