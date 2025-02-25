import Paper from '../../models/PaperSchema.js';


export const validatePaper = async (paperId) => {

    console.log("inside validation route, paperId:",paperId )
    try {
      const paper = await Paper.findOne({ paperId});
      if (paper) {
        return { isValid: true };
      } else {
        return{ isValid: false };
      }
    } catch (error) {
      return{ message: 'Server error' };
    }
    
}

