import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CardGrid = () => {
  const [cardData, setCardData] = useState([]);
  const [error, setError] = useState(null);
  const [gridTitle, setGridTitle] = useState('Devices');
  const [deviceid, setDeviceID] = useState('');
  const [showPopup, setShowPopup] = useState(true); // State for popup visibility
  const [loadingImages, setLoadingImages] = useState(false);
  const navigate = useNavigate();


  const ImageSkeleton = () => (
    <div className="w-full h-16 bg-gray-700 rounded-md shimmer"></div>
  );

  useEffect(() => {
    if (!showPopup) {
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
            'https://v0iasu9ohd.execute-api.ap-south-1.amazonaws.com/default/fetch_devices'
          );
          const deviceData = generateDeviceData(response.data.folders);
          setCardData(deviceData);
          setLoadingImages(false);
        } catch (err) {
          setError('Failed to load device data.');
        }
      };

      fetchDevices();
    }
  }, [showPopup]);

  const loadBatchData = async (deviceID) => {
    setDeviceID(deviceID);
    const generateBatchData = (batchIDs) => {
      const batchData = [];
      for (let i = 0; i < batchIDs.length; i++) {
        const batchDataObject = {
          title: `Batch ${i + 1}`,
          description: `Batch ID: ${batchIDs[i]}`,
          batchId: `${batchIDs[i]}`,
        };
        batchData.push(batchDataObject);
      }
      return batchData;
    };

    try {
      setCardData([]);
      setGridTitle(`Batches for ${deviceID}`);
      const url = 'https://joecbtigqf.execute-api.ap-south-1.amazonaws.com/default/fetch_batches';
      const payload = { folder_name: deviceID };
      setLoadingImages(true);
      const response = await axios.post(url, payload);
      const batchData = generateBatchData(response.data.subfolders);
      setCardData(batchData || []);
      setLoadingImages(false);
    } catch (error) {
      setCardData([]);
      setGridTitle(`Batches for ${deviceID}`);
      setError('Failed to load batch data.');
    }
  };

  const handleCardClick = (card) => {
    if (card.deviceID) {
      loadBatchData(card.deviceID);
    } else if (card.batchId) {
      navigate(`/batch/${deviceid}/${card.batchId}`);
    }
  };

  return (
    <>
      {showPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
            <div className="p-6 mx-auto text-white rounded-lg bg-neutral-800 w-[300px] md:w-[400px] lg:w-[500px] shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-white text-center mb-4">Select Category of Images</h2>
              
              <div className="flex flex-col items-center space-y-4">
                <button
                  className="px-4 py-2 bg-[#2563EB] w-60 rounded-lg text-2xl font-bold"
                  onClick={() => setShowPopup(false)}
                >
                  Unflagged Images
                </button>
                <button
                  className="px-4 py-2 bg-[#2563EB] w-60 rounded-lg text-2xl font-bold"
                  onClick={() => navigate(`/batch/device-flagged/flagged`)}
                >
                  Flagged Images
                </button>
              </div>
            </div>
          </div>
        )}

      

      {!showPopup && (
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
                <h3 className="text-lg font-bold text-white mb-2">{card.title}</h3>
                <p className="text-sm text-neutral-400">{card.description}</p>
              </div>
            ))}
          </div>
          )}

          {cardData.length === 0 && !error && (
            <p className="text-neutral-400 font-semibold text-center mt-4">No Data to display</p>
          )}
        </div>
      )}
    </>
  );
};

export default CardGrid;
