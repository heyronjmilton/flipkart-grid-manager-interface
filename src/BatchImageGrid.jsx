import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import Toastify
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify styles

const BatchImageGrid = () => {
  const { deviceId, batchId } = useParams(); // Get the batchId from the route
  const [images, setImages] = useState([]);
  const [gridTitle, setGridTitle] = useState("");
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedImages, setSelectedImages] = useState([]); // To store selected image details
  const [loadingImages, setLoadingImages] = useState(false);
  const itemsPerPage = 12; // Number of images per page


  const ImageSkeleton = () => (
    <div className="w-full h-32 bg-gray-700 rounded-md shimmer"></div>
  );


  useEffect(() => {
    const fetchImages = async () => {
      try {
         {

            setGridTitle(`Images for Batch ${batchId}`)
            const url = "https://qps9s2ufx1.execute-api.ap-south-1.amazonaws.com/default/fetch_expiry_annotation";
            const payload = {
              "device_name": deviceId,
              "batch_number": batchId            
            };
            setLoadingImages(true);
            const response = await axios.post(url, payload);
            console.log("Response:", response.data);
            
            console.log("device id",deviceId);
            setImages(response.data.urls || []);
            setLoadingImages(false);
        }
      } catch (err) {
        setError('Failed to load images.');
        setLoadingImages(false)
        console.log(err);
      }
    };

    fetchImages();
  }, []);

  const totalPages = Math.ceil(images.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedImages = images.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  

  const handleUploadSelected = async () => {
    try {
      // Replace with the actual API endpoint for uploading selected images
      const response = await axios.post('https://your-upload-api-endpoint.com', {
        selectedImages, // Send selected images to the API
      });
      toast.success('Selected images uploaded successfully!')
    } catch (err) {
      toast.error('Failed to upload selected images.')
    }
  };

  return (
    <div className="p-4 mx-auto my-auto text-white rounded-lg bg-neutral-700 w-[300px] md:w-3/4 lg:w-1/2">
      <h2 className="text-3xl p-4 font-bold mb-4 text-white">{gridTitle}</h2>

      {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}

      {loadingImages ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(8)].map((_, index) => (
          <ImageSkeleton key={index} />
        ))}
      </div>
      ) : (

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {paginatedImages.map((imageURL, index) => (
          <div
            key={index}
            className={`relative group overflow-hidden rounded-md border border-neutral-600 ${
              selectedImages.includes(imageURL) ? 'border-blue-500' : ''
            }`} // Add border to selected images
             // Handle select/deselect
          >
            <img
              src={imageURL}
              alt={`Batch ${batchId} Image ${index + 1}`}
              className="w-full h-auto object-cover rounded-md group-hover:opacity-30 transition-opacity"
            />
            {selectedImages.includes(imageURL) && (
              <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md">Selected</div>
            )}
          </div>
        ))}
      </div>
      )}

      {images.length === 0 && !error && (
        <p className="text-neutral-400 font-semibold text-center mt-4">No images to display</p>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-500"
        >
          Previous
        </button>
        <span className="text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-500"
        >
          Next
        </button>
      </div>

      


      <ToastContainer
              position="top-right" // Position where notifications appear
              autoClose={5000} // Duration for which the notification will appear (in ms)
              hideProgressBar={true} // Hide progress bar
              newestOnTop={true} // Display newest notifications on top
              closeButton={true} // Allow users to manually close the notification
              rtl={false} // If you need RTL support, set it to true
            />
    </div>
  );
};

export default BatchImageGrid;
