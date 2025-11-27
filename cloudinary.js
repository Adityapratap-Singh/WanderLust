const cloudinary = require('cloudinary');
const CloudinaryStorage = require('multer-storage-cloudinary');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'ghoomo_DEV',
      allowedFormats: ['png', 'jpg', 'jpeg'],
      secure: true
    },
  });

  module.exports = {
    cloudinary,
    storage
  }
