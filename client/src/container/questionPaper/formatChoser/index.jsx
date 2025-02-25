import React, { useState } from 'react';
import { Modal} from '@mui/material';

import './index.css';
import FormatOne from '../../../assets/formatone.png'
import FormatTwo from '../../../assets/formattwo.png'
import Bilingual from '../../../assets/bilingual.png'
import PaperInterfaceCells from '../paperInterface/paperInterfaceCells';
import PaperInterfacePlain from '../paperInterface/paperInterfacePlain';
import {trackEvent} from '../../../analytics/analytics'
import PaperInterfaceBilingual from '../paperInterface/paperInterfaceBilingual';





const FormatChoser = () => {
    const [openModal, setOpenModal] = useState(false);
    const [modalContent, setModalContent] = useState(null);
  
    const handleOpenModal = (content) => {

      trackEvent('User', 'Clicked FormatChoser Button', 'FormatChoser Button');
      setModalContent(content);
      setOpenModal(true);
    };
  
    const handleCloseModal = () => {
      setOpenModal(false);
      setModalContent(null);
    };
  
    return (
      <div className="container" id='formatChoser'>
        <h2>Choose Word Document Format</h2>
  
        <div className="format-grid">
          {/* Format Option 1 */}
          <div className="format-card">
            <img 
              src={FormatOne} 
              alt="Standard Format" 
              className="format-image"
            />
            <h5 className="format-title">Word Document without Cells and Tables</h5>
            <button 
              className="format-button"
              onClick={() => handleOpenModal(<PaperInterfacePlain onClose={handleCloseModal} />)}
            >
              Select Format
            </button>
          </div>
  
          {/* Format Option 2 */}
          <div className="format-card">
            <img 
              src={FormatTwo} 
              alt="Advanced Format" 
              className="format-image"
            />
            <h5 className="format-title">Word Document with Cells and Tables</h5>
            <button 
              className="format-button"
              onClick={() => handleOpenModal(<PaperInterfaceCells onClose={handleCloseModal} />)}
            >
              Select Format
            </button>
          </div>

          {/* Format Option 3 - Bilingual */}
          <div className="format-card">
            <img 
              src={Bilingual} 
              alt="Advanced Format" 
              className="format-image"
            />
            <h5 className="format-title">Bilingual Paper - English and Hindi</h5>
            <button 
              className="format-button"
              onClick={() => handleOpenModal(<PaperInterfaceBilingual onClose={handleCloseModal} />)}
            >
              Select Format
            </button>
          </div>

        </div>
  
        {/* Modal */}
        <Modal
          open={openModal}
          onClose={handleCloseModal}
          aria-labelledby="paper-interface-modal"
        >
          <div className="modal-content">
            {modalContent}
          </div>
        </Modal>
      </div>
    );
  };
  

export default FormatChoser;