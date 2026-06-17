import { connectDB } from "@/backend/database/connection/db";
import BookService from "@/backend/database/models/BookService";
import Product from "@/backend/database/models/Product";
import User from "@/backend/database/models/User";
import { uploadToCloudinary } from "@/backend/config/cloudinary";

// -----------------------------------------------------------------------------
// This file contains the business logic for handling service requests.
// It is written in a simple, step-by-step way to be beginner-friendly.
// -----------------------------------------------------------------------------

// We define the allowed image types for uploads (JPEG, PNG, WEBP)
const ALLOWED_IMG_TYPES = ["image/jpeg", "image/png", "image/webp"];

// We define the maximum file size allowed (10 MB in bytes)
const MAX_FILE_BYTES = 10 * 1024 * 1024; 

/**
 * Creates a new service request in the database.
 * 
 * @param {Object} body - The data sent from the frontend form
 * @param {String} userId - The ID of the user making the request
 * @returns {Object} - The newly created service request details
 */
export async function createServiceRequest(body, userId) {
  // Step 1: Extract and clean up the data from the request body
  // We use .toString().trim() to remove any accidental extra spaces
  const contactNumber = body.contactNumber ? body.contactNumber.toString().trim() : "";
  const contactPersonNumber = body.contactPersonNumber ? body.contactPersonNumber.toString().trim() : "";
  const alternativeNumber = body.alternativeNumber ? body.alternativeNumber.toString().trim() : "";
  const problemDescription = body.problemDescription ? body.problemDescription.toString().trim() : "";
  const productId = body.productId ? body.productId.toString().trim() : "";
  
  // For images, we check if it is an array. If not, we use an empty array.
  const problemImages = Array.isArray(body.problemImages) ? body.problemImages : [];

  // Step 2: Validate the required fields
  // If any required field is missing, we throw an error that the controller will catch
  if (!productId) {
    const error = new Error("Product ID is required.");
    error.status = 400; // Bad Request
    throw error;
  }

  if (!contactNumber) {
    const error = new Error("Contact number is required.");
    error.status = 400;
    throw error;
  }

  if (!contactPersonNumber) {
    const error = new Error("Contact person number is required.");
    error.status = 400;
    throw error;
  }

  if (!problemDescription) {
    const error = new Error("Problem description is required.");
    error.status = 400;
    throw error;
  }

  // Step 3: Connect to the database
  await connectDB();

  // Step 4: Check if the product exists and belongs to this user
  // We search for a product that matches both the given productId and the userId
  const product = await Product.findOne({ _id: productId, userId: userId });
  
  if (!product) {
    const error = new Error("Product not found or does not belong to you.");
    error.status = 404; // Not Found
    throw error;
  }

  // Step 5: Get the user's details from the User collection
  // We use .lean() because we only need to read the data, not modify it
  const user = await User.findById(userId).lean();
  
  let customerName = "";
  let customerEmail = "";

  if (user) {
    // If the user exists, we grab their name and personal email
    customerName = user.name || "";
    customerEmail = user.personalEmail || "";
  }

  // Step 6: Save the new service request into the database
  const serviceRequest = await BookService.create({
    userId: userId,
    productId: productId,
    customerName: customerName,
    customerEmail: customerEmail,
    contactNumber: contactNumber,
    contactPersonNumber: contactPersonNumber,
    alternativeNumber: alternativeNumber,
    problemImages: problemImages,
    problemDescription: problemDescription,
    status: "Pending", // Every new request starts as 'Pending'
  });

  // Step 7: Return a clean object with only the necessary information
  return {
    id: serviceRequest._id.toString(),
    productId: serviceRequest.productId.toString(),
    productName: product.productName, // We get the name from the product we found earlier
    contactNumber: serviceRequest.contactNumber,
    contactPersonNumber: serviceRequest.contactPersonNumber,
    status: serviceRequest.status,
    createdAt: serviceRequest.createdAt,
  };
}

/**
 * Handles uploading problem images to Cloudinary.
 * 
 * @param {FormData} formData - The form data containing the uploaded files
 * @param {String} userId - The ID of the user uploading the files
 * @returns {Array} - An array of URLs pointing to the uploaded images
 */
export async function handleProblemImageUploads(formData, userId) {
  // Step 1: Create a specific folder path for this user's uploads
  const folderPath = `service-requests/${userId}`;
  
  // Step 2: Extract all files named "problemImages" from the form data
  // We only keep files that actually have some size (greater than 0)
  const files = formData.getAll("problemImages").filter(function(file) {
    return file && file.size > 0;
  });

  // If there are no valid files, just return an empty array
  if (files.length === 0) {
    return [];
  }

  // Step 3: Loop through each file to validate size and type
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // Check if the file is too large
    if (file.size > MAX_FILE_BYTES) {
      const error = new Error(`File "${file.name}" exceeds the 10 MB limit.`);
      error.status = 400;
      throw error;
    }

    // Check if the file type is allowed
    if (!ALLOWED_IMG_TYPES.includes(file.type)) {
      const error = new Error(`File "${file.name}" must be a JPG, PNG, or WEBP image.`);
      error.status = 400;
      throw error;
    }
  }

  // Step 4: Upload all files at the same time (in parallel) for better speed
  const uploadPromises = files.map(async function(file) {
    // Convert the file into a buffer so Cloudinary can process it
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // Upload the buffer to Cloudinary and return the resulting URL
    const uploadedUrl = await uploadToCloudinary(fileBuffer, folderPath, "image", {
      userId: userId,
      uploadType: "service-problem",
    });

    return uploadedUrl;
  });

  // Wait for all uploads to finish, then return the list of URLs
  const allUrls = await Promise.all(uploadPromises);
  
  return allUrls;
}
