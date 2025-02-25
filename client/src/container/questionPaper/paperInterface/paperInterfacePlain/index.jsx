import React from 'react';
import PaperForm from '../../paperform/PaperForm';
import { useGeneratePaper3Mutation } from '../../../../state/api';

const PaperInterfacePlain = ({ onClose }) => {
  const [generatePaper3, generatePaperResult] = useGeneratePaper3Mutation();

  return (
    <PaperForm
      onClose={onClose}
      generatePaperMutation={[generatePaper3, generatePaperResult]}
    />
  );
};

export default PaperInterfacePlain; 