const generateOCRPrompt = (ocrText) => {
    return `Analyze this text -${ocrText}, If its a question answer it else respond with a friendly message asking the user to clarify their intent.
  
  
   `;
    
  };
  
  export default generateOCRPrompt