import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Uploads a file Buffer to Cloudinary using a signed server-side upload.
 *
 * @param {Buffer} buffer          - The file buffer to upload
 * @param {string} folder          - The Cloudinary folder (e.g. "products/{userId}")
 * @param {string} resourceType    - 'image', 'raw', or 'auto'
 * @param {Object} [contextMeta]   - Optional key-value metadata stored as Cloudinary context
 *   @param {string} contextMeta.userId
 *   @param {string} contextMeta.productName
 *   @param {string} contextMeta.uploadType  - "installation" | "invoice" | "photos"
 * @returns {Promise<string>} - The secure URL of the uploaded file
 */
export async function uploadToCloudinary(
  buffer,
  folder = "products",
  resourceType = "auto",
  contextMeta = {}
) {
  return new Promise((resolve, reject) => {
    // Build Cloudinary context string: "key=value|key2=value2"
    const contextParts = Object.entries(contextMeta)
      .filter(([, v]) => v)
      .map(([k, v]) => `${k}=${String(v).replace(/[|=]/g, "_")}`);

    const uploadOptions = {
      folder,
      resource_type: resourceType,
      // Signed upload — API secret is used server-side only, never exposed to client
      ...(contextParts.length > 0 && { context: contextParts.join("|") }),
    };

    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload failed:", error);
          reject(new Error("Failed to upload file to Cloudinary."));
        } else {
          resolve(result.secure_url);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

export default cloudinary;
