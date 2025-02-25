import {
    generatePaperService,
    generatePaper3Service,
    generateBilingualPaperService,
    validatePaperService,
    getQuestionSummaryService,
  } from '../services/paper/paperService.js';
  
  export const generatePaper = async (req, res) => {

    console.log("inside geneeratePaper controller");

    try {
      const result = await generatePaperService(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const generatePaper3 = async (req, res) => {

    console.log("inside geneeratePaper3 controller :");
    try {
      const result = await generatePaper3Service(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const generateBilingualPaper = async (req, res) => {
    console.log("inside bilingual controller");

    try {
      const result = await generateBilingualPaperService(req.body);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  export const validatePaper = async (req, res) => {
    console.log("inside validatePaper controller");

    try {
      const result = await validatePaperService(req.params.paperId);
      res.json(result);
    } catch (error) {   
      res.status(500).json({ message: 'Server error' });
    }
  };
  
  export const getQuestionSummary = async (req, res) => {
    console.log("inside getquestion controller");

    try {
      const result = await getQuestionSummaryService();
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Error fetching question summary", error });
    }
  };