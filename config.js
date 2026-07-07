/* ===========================================================
   CONFIG — edit the values below to set up your own gallery
   =========================================================== */

// 1. Your Cloudinary cloud name (find it on your Cloudinary dashboard)
const CLOUDINARY_CLOUD_NAME = "YOUR_CLOUD_NAME";

// 2. An UNSIGNED upload preset (create one in Cloudinary:
//    Settings → Upload → Upload presets → Add upload preset → Signing Mode: Unsigned)
const CLOUDINARY_UPLOAD_PRESET = "YOUR_UPLOAD_PRESET";

/* ===========================================================
   PHOTOS — paste the Cloudinary image URLs you want to show.
   After uploading a photo (via the "Add a photo" button, or
   directly in your Cloudinary Media Library), copy its secure
   URL here so it's saved permanently in the gallery.

   pin: "heart" or "daisy" — decides the little icon on top
   caption: optional short text under the photo
   =========================================================== */
let GALLERY_IMAGES = [
  {
    url: "https://res.cloudinary.com/demo/image/upload/v1690000000/sample.jpg",
    pin: "heart",
    caption: "sunset walk"
  },
  {
    url: "https://res.cloudinary.com/demo/image/upload/v1690000000/couple.jpg",
    pin: "daisy",
    caption: "picnic day"
  },
  {
    url: "https://res.cloudinary.com/demo/image/upload/v1690000000/balloons.jpg",
    pin: "heart",
    caption: "birthday surprise"
  }
];
