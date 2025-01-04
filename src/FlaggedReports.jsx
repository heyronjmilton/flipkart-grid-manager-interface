import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const FlaggedReports = () => {
  const [cardData, setCardData] = useState([]);
  const [error, setError] = useState(null);
  const [gridTitle, setGridTitle] = useState('Devices');
  const [deviceid, setDeviceID] = useState('');
  const [expiredItems, setExpiredItems] = useState(null);
  const [loadingImages, setLoadingImages] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingTable, setLoadingTable] = useState(false);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const batchid = useRef();

  const ImageSkeleton = () => (
    <div className="w-full h-16 bg-gray-700 rounded-md shimmer"></div>
  );


  const downloadXlsx = async () => {
    try {
      
      
      // Make the API request to download the file
      const response = await axios.get(`https://flipkart-reports.s3.ap-south-1.amazonaws.com/${deviceid}_${batchid.current}_report.xlsx`, {
        responseType: "blob", // Ensures the file is handled as a binary stream
      });
  
      // Create a URL for the file blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${batchid.current}.xlsx`); // Set the file name
      document.body.appendChild(link);
      link.click();
  
      // Clean up the link
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error downloading file:", error);
      alert(
        error.response?.data?.detail ||
          "An error occurred while downloading the file."
      );
    }
  };

  const PaginatedTable = ({ data, currentPage, itemsPerPage }) => {
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
  
    const paginatedData = data.slice(startIndex, endIndex);
  
    return (
      <div className="p-4 mx-auto my-auto text-white rounded-lg bg-neutral-700 w-[300px] md:w-3/4 lg:w-1/2">
        <h2 className="text-3xl p-4 font-bold mb-2 text-white">Expired Items</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto text-white border-collapse border border-neutral-600">
            <thead>
              <tr>
                <th className="py-2 px-4 border border-neutral-600">Item Name</th>
                <th className="py-2 px-4 border border-neutral-600">Manufacture Date</th>
                <th className="py-2 px-4 border border-neutral-600">Expiry Date</th>
                <th className="py-2 px-4 border border-neutral-600">Batch No</th>
                
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border border-neutral-600">{item.ItemName}</td>
                  <td className="py-2 px-4 border border-neutral-600">{item.ManufactureDate}</td>
                  <td className="py-2 px-4 border border-neutral-600">{item.ExpiryDate}</td>
                  <td className="py-2 px-4 border border-neutral-600">{item.Item_BatchNo}</td>
                  
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            disabled={currentPage <= 1}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Previous
          </button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
        
        <div className="mt-4 text-center">
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded disabled:bg-gray-500"
          onClick={downloadXlsx}
        >
          Download Report
        </button>
        <button
          className="bg-blue-500 text-white px-6 py-3 rounded disabled:bg-gray-500 m-2"
          onClick={() => { navigate(`/batch/${deviceid}/${batchid.current}`);}}
        >
          View Inferenced Images
        </button>
      </div>
        

      </div>
    );
  };

  useEffect(() => {
     {
      const fetchDevices = async () => {
        try {
          const generateDeviceData = (deviceIDNumbers) => {
            const deviceData = [];
            for (let i = 0; i < deviceIDNumbers.length; i++) {
              const deviceDataObject = {
                title: `Device ${i + 1}`,
                description: `Device ID: ${deviceIDNumbers[i]}`,
                deviceID: `${deviceIDNumbers[i]}`,
              };
              deviceData.push(deviceDataObject);
            }
            return deviceData;
          };
          setLoadingImages(true);
          const response = await axios.get(
            'https://90kkuzc5pj.execute-api.ap-south-1.amazonaws.com/default/get_expiry_table'
          );
          // console.log(response.data.devices)
          // const deviceData = [];
          const deviceData = generateDeviceData(Object.keys(response.data.devices));
          setExpiredItems(response.data.devices);
          setCardData(deviceData);
          setLoadingImages(false);
        } catch (err) {
          setError('Failed to load device data.');
        }
      };

      fetchDevices();
    }
  }, []);

  const loadBatchData = async (deviceID) => {
    setDeviceID(deviceID);
    const generateBatchData = (batchIDs) => {
      const batchData = [];
      for (let i = 0; i < batchIDs.length; i++) {
        const batchDataObject = {
          title: `Batch ${i + 1}`,
          description: `${batchIDs[i]}`,
          batchId: `${batchIDs[i]}`,
        };
        batchData.push(batchDataObject);
      }
      return batchData;
    };

    try {
      setCardData([]);
      setGridTitle(`Batches for ${deviceID}`);
      setLoadingImages(true);
      // console.log("expired items : ",expiredItems[deviceID])
      
      const batchData = generateBatchData(Object.keys(expiredItems[deviceID]));
      // console.log("batch Data", batchData)
      setCardData(batchData || []);
      setLoadingImages(false);
    } catch (error) {
      setCardData([]);
      setGridTitle(`Batches for ${deviceID}`);
      setError('Failed to load batch data.',error);
    }
  };

  const handleCardClick = (card) => {
    if (card.deviceID) {
      loadBatchData(card.deviceID);
    } else if (card.batchId) {
      // navigate(`/batch/${deviceid}/${card.batchId}`);
      batchid.current = card.batchId;
      console.log(batchid)
      console.log(expiredItems[deviceid][batchid.current])
      setLoadingTable(true)
    }
  };

  return (
    <>
      

      {!loadingTable && 
      
      
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
            {cardData.map((card, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-md border border-neutral-600 p-4 bg-neutral-800 cursor-pointer hover:bg-neutral-700 transition"
                onClick={() => handleCardClick(card)}
              >
                {card.deviceID &&
                <>
                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-neutral-400">{card.description}</p>
                </>
              }
                {card.batchId &&
                <h3 className="text-lg font-bold text-white mb-2">{card.description}</h3>
              }
                
              </div>
            ))}
          </div>
          )}

          {cardData.length === 0 && !error && (
            <p className="text-neutral-400 font-semibold text-center mt-4">No Data to display</p>
          )}
        </div>
      }

      


      {loadingTable &&
        
        <>
          <PaginatedTable data={expiredItems[deviceid][batchid.current]} currentPage={currentPage} itemsPerPage={itemsPerPage} />
        </>
      }
      
    </>
  );
};

export default FlaggedReports;
