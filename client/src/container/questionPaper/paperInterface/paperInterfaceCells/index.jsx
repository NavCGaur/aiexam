import React from 'react';
import PaperForm from '../../paperform/PaperForm';
import { useGeneratePaperMutation } from '../../../../state/api'; 

const PaperInterfaceCells = ({ onClose }) => {
  const [generatePaper, generatePaperResult] = useGeneratePaperMutation();

  return (
    <PaperForm
      onClose={onClose}
      generatePaperMutation={[generatePaper, generatePaperResult]}
    
    />
  );
};

export default PaperInterfaceCells;