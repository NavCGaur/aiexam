import { generatePaper } from './generatePaper.js';
import { generatePaper3 } from './generatePaper3.js';
import { generateBilingualPaper } from './generateBilingualPaper.js';
import {getQuestionSummary} from './getQuestionSummary.js';
import {validatePaper} from './validatePaper.js'

export const generatePaperService = generatePaper;
export const generatePaper3Service = generatePaper3;
export const generateBilingualPaperService = generateBilingualPaper;
export const getQuestionSummaryService = getQuestionSummary;
export const validatePaperService = validatePaper;