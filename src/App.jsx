import './App.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

import {BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home.jsx'
import Nav from './Nav.jsx'
import BatchImageGrid from './BatchImageGrid.jsx'
import PdfPreview from './PDFpreview.jsx'
import FlaggedReports from './FlaggedReports.jsx';

function App() {
  return (
    <>
     <BrowserRouter>
     <Nav/>
        <Routes>
        
          <Route path='/' element={<Home/>}  />     
          <Route path='/insights' element={<PdfPreview />} />
          <Route path='/batch/:deviceId/:batchId' element={<BatchImageGrid/>} />
          <Route path='/expired-items' element={<FlaggedReports />} />
          
        </Routes>
     </BrowserRouter>
    </>
  )
}

export default App
