import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

const PdfPreview = () => {
  const [numPages, setNumPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const s3Url = "https://flipkart-insights.s3.ap-south-1.amazonaws.com/insight.pdf";  // Your S3 URL

  // Set the worker URL manually
  pdfjs.GlobalWorkerOptions.workerSrc = `pdfs\\pdf.worker.min.mjs`;

  const onLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onLoadError = (error) => {
    setError(error.message);
  };

  const handlePrevPage = () => {
    setCurrentPage(prevPage => Math.max(prevPage - 1, 1)); // Prevent going below 1
  };

  const handleNextPage = () => {
    setCurrentPage(prevPage => Math.min(prevPage + 1, numPages)); // Prevent going above the last page
  };

  return (
    <div className="p-4 mx-auto my-auto text-white rounded-lg bg-neutral-700 w-[300px] md:w-3/4 lg:w-1/2 mt-10">
      <h2 className="text-3xl font-bold mb-4 text-white">Insights</h2>
      {error && <p className="text-red-500 font-semibold mb-4">{error}</p>}
      <div className="bg-gray-800 p-4 rounded-md overflow-hidden shadow-md">
        <Document
          file={s3Url}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          renderMode="canvas"
        >
          <div className="mb-4">
            <Page pageNumber={currentPage} />
          </div>
        </Document>
      </div>
      <div className="flex justify-center items-center mt-4">
        
        <span className="text-white">
          Page {currentPage} of {numPages}
        </span>
        
      </div>
      <div className="flex justify-center items-center mt-4">
        <a
          href={s3Url}
          download="previewed-file.pdf"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Download Insights
        </a>
      </div>
    </div>
  );
};

export default PdfPreview;
