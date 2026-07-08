const express = require('express');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

const app = express();
const PORT = process.env.PORT || 3000;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /jpeg|jpg|png|gif|webp|mp4|mov|webm|avi/;
    if (ok.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only images and videos allowed'));
  }
});

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function uploadToCloudinary(buffer, resourceType, context) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: 'our-secret-space', context },
      (err, result) => err ? reject(err) : resolve(result)
    );
    stream.end(buffer);
  });
}

app.get('/api/items', async (req, res) => {
  try {
    const result = await cloudinary.search
      .expression('folder:our-secret-space')
      .with_field('context')
      .sort_by('created_at', 'desc')
      .max_results(200)
      .execute();

    const items = result.resources.map(r => ({
      id: r.public_id,
      url: r.secure_url,
      type: r.resource_type === 'video' ? 'video' : 'image',
      uploader: (r.context?.custom?.uploader) || 'someone',
      caption: (r.context?.custom?.caption) || '',
      uploadedAt: new Date(r.created_at).getTime()
    }));
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load gallery' });
  }
});

app.post('/api/upload', upload.single('media'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file received' });
  const ext = path.extname(req.file.originalname).toLowerCase();
  const isVideo = ['.mp4', '.mov', '.webm', '.avi'].includes(ext);

  try {
    const result = await uploadToCloudinary(
      req.file.buffer,
      isVideo ? 'video' : 'image',
      {
        uploader: (req.body.uploader || 'someone').slice(0, 30),
        caption: (req.body.caption || '').slice(0, 140)
      }
    );
    res.json({ id: result.public_id, url: result.secure_url, type: isVideo ? 'video' : 'image' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Upload failed' });
  }
});

app.delete('/api/items/:id(*)', async (req, res) => {
  try {
    await cloudinary.uploader.destroy(req.params.id, {
      resource_type: req.query.type === 'video' ? 'video' : 'image'
    });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: 'Delete failed' });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌸 Our Secret Space is running on port ${PORT}`);
});
