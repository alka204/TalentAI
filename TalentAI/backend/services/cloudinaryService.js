const cloudinary = require('../config/cloudinary');
const { Readable } = require('stream');

/**
 * Uploads a file buffer (e.g. from multer memoryStorage) to Cloudinary.
 * @param {Buffer} buffer - the file buffer
 * @param {string} folder - Cloudinary folder to store the asset in
 * @param {string} resourceType - 'raw' for documents like PDFs, 'image' for photos
 * @returns {Promise<{url: string, publicId: string}>}
 */
const uploadBufferToCloudinary = (buffer, folder = 'talentai/resumes', resourceType = 'raw') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    Readable.from(buffer).pipe(uploadStream);
  });
};

module.exports = { uploadBufferToCloudinary };
