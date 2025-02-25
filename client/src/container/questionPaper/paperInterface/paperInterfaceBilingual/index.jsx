import React from 'react';
import PaperForm from '../../paperform/PaperForm';
import { useGeneratePaperBilingualMutation } from '../../../../state/api';

const PaperInterfaceBilingual = ({ onClose }) => {
  const [generatePaperBilingual, generatePaperResult] = useGeneratePaperBilingualMutation();

  return (
    <PaperForm
      onClose={onClose}
      generatePaperMutation={[generatePaperBilingual, generatePaperResult]}
    />
  );
};

export default PaperInterfaceBilingual; 


