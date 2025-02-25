import { getQuestionSummaryService } from '../services/questionService.js';
import { getEduDataService } from '../services/questionService.js';

export const getQuestionSummary = async (req, res) => {
  try {
    const summary = await getQuestionSummaryService();
    res.json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEduData = async (req, res) => {
  try {
    console.log(" inside getEduData controller");
    const eduData = await getEduDataService();
    res.json(eduData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}