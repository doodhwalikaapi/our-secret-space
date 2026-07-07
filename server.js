// server.js — the little engine behind "Our Gallery"
// Files are uploaded straight to Cloudinary (free forever storage),
// so nothing gets wiped when the free Render server restarts.

const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = process.env.PORT || 3000;

// --- Cloudinary setup: reads your credentials from environment variables ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// --- Multer: holds the uploaded file in memory just long enough to forward it ---
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB per file
  fileFilter: (req, file, cb) => {
    const okTypes = /jpeg|jpg|png|gif|webp|mp4|mov|webm|avi/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (okTypes.test(ext)) cb(null, true);
    else cb(new Error('Only image or video files are allowed'));
  }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function uploadBufferToCloudinary(buffer, resourceType, context) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: 'our-gallery', context },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
}

// Get every item in the gallery, newest first
app.get('/api/items', async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression('folder:our-gallery')
      .with_field('context')
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    const items = result.resources.map(r => ({
      id: r.public_id,
      url: r.secure_url,
      type: r.resource_type === 'video' ? 'video' : 'image',
      uploader: (r.context && r.context.custom && r.context.custom.uploader) || 'Someone',
      caption: (r.context && r.context.custom && r.context.custom.caption) || '',
      uploadedAt: new Date(r.created_at).getTime()
    }));

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load gallery' });
  }
});

// Upload a new photo or video
app.post('/api/upload', upload.single('media'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file received' });

  const ext = path.extname(req.file.originalname).toLowerCase();
  const isVideo = ['.mp4', '.mov', '.webm', '.avi'].includes(ext);

  try {
    const result = await uploadBufferToCloudinary(
      req.file.buffer,
      isVideo ? 'video' : 'image',
      {
        uploader: (req.body.uploader || 'Someone').slice(0, 30),
        caption: (req.body.caption || '').slice(0, 140)
      }
    );

    res.json({
      id: result.public_id,
      url: result.secure_url,
      type: isVideo ? 'video' : 'image'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Delete an item
app.delete('/api/items/:id(*)', async (req, res) => {
  try {
    const publicId = req.params.id;
    const resourceType = req.query.type === 'video' ? 'video' : 'image';
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n💗 Our Gallery is running on port ${PORT}\n`);
});