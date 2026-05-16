import { uploadToCloudinary } from "@/backend/config/cloudinary";

const MAX_FILE_BYTES    = 10 * 1024 * 1024;
const ALLOWED_DOC_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
const ALLOWED_IMG_TYPES = ["image/jpeg", "image/png", "image/webp"];

function validateFile(file, allowedTypes, label) {
  if (!file || file.size === 0) return null;
  if (file.size > MAX_FILE_BYTES)
    return `${label} exceeds the 10 MB limit (${(file.size / 1024 / 1024).toFixed(1)} MB).`;
  if (!allowedTypes.includes(file.type))
    return `${label} must be a PDF, JPG, PNG, or WEBP file.`;
  return null;
}

async function toBuffer(file) {
  return Buffer.from(await file.arrayBuffer());
}

export async function handleFileUploads(formData, userId) {
  const folder      = `products/${userId}`;
  const productName = (formData.get("productName") || "").toString().trim();

  const installationCopyFile = formData.get("installationCopy");
  const invoiceCopyFile      = formData.get("invoiceCopy");
  const photoFiles           = formData.getAll("installationPhotos").filter((f) => f && f.size > 0);

  // Validate
  const icErr  = validateFile(installationCopyFile, ALLOWED_DOC_TYPES, "Installation copy");
  const invErr = validateFile(invoiceCopyFile,      ALLOWED_DOC_TYPES, "Invoice copy");
  if (icErr)  { const err = new Error(icErr);  err.status = 400; throw err; }
  if (invErr) { const err = new Error(invErr); err.status = 400; throw err; }

  for (const photo of photoFiles) {
    const photoErr = validateFile(photo, ALLOWED_IMG_TYPES, `Photo "${photo.name}"`);
    if (photoErr) { const err = new Error(photoErr); err.status = 400; throw err; }
  }

  // Upload in parallel
  const uploadTasks = [];

  if (installationCopyFile && installationCopyFile.size > 0) {
    uploadTasks.push(
      toBuffer(installationCopyFile).then((buf) =>
        uploadToCloudinary(buf, folder, "auto", { userId, productName, uploadType: "installation" })
      )
    );
  } else {
    uploadTasks.push(Promise.resolve(""));
  }

  if (invoiceCopyFile && invoiceCopyFile.size > 0) {
    uploadTasks.push(
      toBuffer(invoiceCopyFile).then((buf) =>
        uploadToCloudinary(buf, folder, "auto", { userId, productName, uploadType: "invoice" })
      )
    );
  } else {
    uploadTasks.push(Promise.resolve(""));
  }

  const photoUploadTasks = photoFiles.map((photo) =>
    toBuffer(photo).then((buf) =>
      uploadToCloudinary(buf, folder, "image", { userId, productName, uploadType: "photos" })
    )
  );

  const [installationCopyUrl, invoiceCopyUrl, ...photoResults] =
    await Promise.all([...uploadTasks, ...photoUploadTasks]);

  return { installationCopyUrl, invoiceCopyUrl, installationPhotosUrls: photoResults };
}
