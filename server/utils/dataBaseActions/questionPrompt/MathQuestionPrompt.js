export const generateMCQPrompt = (chapter,Subject, Class ) => `
  Provide 3 MCQ type questions from the chapter "${chapter}" of ${Subject} of class "${Class}" in the following JSON format:
    Ensure that:  
  - The first question is a **numerical or conceptual application-based MCQ**.  
  - The second question is a **word problem or real-life application-based MCQ**.  
  - The third question is an **MCQ requiring basic calculations or logical reasoning**.
  [{
    "class": ${Class},
    "subject": "${Subject}",
    "chapter": "${chapter}",
    "type": "mcq",
    "difficulty": "easy",
    "text": "Question text with numerical or conceptual application",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": "A",
    "marks": 1,
    "createdAt": "2024-02-02T00:00:00Z"
  }]`;

export const generateOneWordQPrompt = (chapter,Subject, Class) => `
  Provide 4 Fill in the Blanks type questions from the chapter "${chapter}" of ${Subject} of class "${Class}" in the following JSON format:
   Ensure that:  
  - The first question is **numerical or formula-based** (e.g., missing values, units, or constants).  
  - The second question is **a conceptual definition or property-based statement**.  
  - The third question involves **real-life application or measurement-based completion**.  
  - The fourth question is **logical or reasoning-based completion**. 
  [{
    "class": ${Class},
    "subject": "${Subject}",
    "chapter": "${chapter}",
    "type": "fillInTheBlanks",
    "difficulty": "easy",
    "text": "Question with a blank ________ to fill.",
    "answer": "Correct Word",
    "marks": 1,
    "createdAt": "2025-01-30T16:44:47.559Z"
  }]`;

export const generateMatchQPrompt = (chapter,Subject, Class) => `
  Provide 4 "Match the Following" questions from the chapter "${chapter}" of "${Subject}" for class "${Class}". Include actual terms or words in Column A and corresponding concepts or definitions in Column B, along with the correct answer options. Provide the response in the following JSON format:
  Ensure that:  
  - **One question focuses on formulas, properties, or mathematical terms**.  
  - **The second question involves real-life applications, measurements, or numerical patterns**.  
  [{
    "class": ${Class},
    "subject": "${Subject}",
    "chapter": "${chapter}",
    "type": "matchTheFollowing",
    "difficulty": "easy",
    "marks": 4,
    "text": "Match the items in Column A with the correct options from Column B.",
    "columnA": ["Actual Term 1", "Actual Term 2", "Actual Term 3", "Actual Term 4"],
    "columnB": ["Actual Concept/Definition A", "Actual Concept/Definition B", "Actual Concept/Definition C", "Actual Concept/Definition D"],
    "options": ["1B, 2A, 3C, 4D"],
    "answer": "1B, 2A, 3C, 4D",
    "createdAt": "2025-01-30T16:44:47.559Z"
  }]`;

export const generateAssertionReasonPrompt = (chapter,Subject, Class) => `
  Provide 1 Assertion Reason type questions from the chapter "${chapter}" of ${Subject} of class "${Class}" in the following JSON format:
  [{
    "class": ${Class},
    "subject": "${Subject}",
    "chapter": "${chapter}",
    "type": "assertionReason",
    "difficulty": "easy",
    "assertion": "Assertion text here.",
    "reason": "Reason text here.",
    "options": [
      "Both Assertion and Reason are true, and Reason is the correct explanation of Assertion.",
      "Both Assertion and Reason are true, but Reason is not the correct explanation of Assertion.",
      "Assertion is true, but Reason is false.",
      "Assertion is false, but Reason is true."
    ],
    "correctAnswer": "A",
    "answer": "A brief explanation (1-2 sentences) for the correct answer.",
    "marks": 1,
    "createdAt": "2025-01-30T16:44:47.559Z"
  }]`;

export const generateShortAnswerPrompt = (chapter, Subject, Class) => `
  Provide 4 Short Answer type questions from the chapter "${chapter}" of ${Subject} of class "${Class}" in the following JSON format:
  Ensure that:  
  - **At least one question involves a numerical calculation**.  
  - **One question is based on a real-life application of a mathematical concept**.  
  - **One question requires stating a property, theorem, or formula**.  
  - **One question involves reasoning or a "why" explanation related to a concept**.  
  [{
    "class": ${Class},
    "subject": "${Subject}",
    "chapter": "${chapter}",
    "type": "shortAnswer",
    "difficulty": "easy",
    "text": "What is a short answer question?",
    "marks": 2,
    "answer": "A short answer question requires a brief but complete response, typically 1-2 sentences.",
    "createdAt": "2024-02-02T00:00:00Z"
  }]`;

export const generateMediumAnswerPrompt = (chapter,Subject, Class) => `
  Provide 2 mediumAnswer type questions from the chapter "${chapter}" of ${Subject} of class "${Class}" Strictly in the following JSON format:
  Ensure that:  
  - **One question requires a step-by-step numerical solution**.  
  - **One question asks for a conceptual explanation or theorem proof**.  
  [{
    "class": ${Class},
    "subject": "${Subject}",
    "chapter": "${chapter}",
    "type": "mediumAnswer",
    "difficulty": "easy",
    "text": "Describe the three main layers of the Earth and their characteristics.",
    "marks": 3,
    "answer": "The Earth consists of three main layers: crust, mantle, and core. The crust is the outermost layer where we live, made up of solid rocks and minerals, and is thinnest under the oceans and thickest under mountains. The mantle is the middle layer, much thicker than the crust, consisting of semi-solid rocks and minerals at very high temperatures."
  }]`;

export const generateLongAnswerPrompt = (chapter,Subject, Class) => `
  Provide 1 long Answer type questions from the chapter "${chapter}" of ${Subject} of class "${Class}" in the following JSON format:
  Ensure that:  
  - **The question requires a detailed explanation with step-by-step calculations, theorem proofs, or problem-solving techniques**.  
  [{
    "class": ${Class},
    "subject": "${Subject}",
    "chapter": "${chapter}",
    "type": "longAnswer",
    "difficulty": "easy",
    "text": "Question Text here",
    "marks": 4,
    "answer": "Answer of question in detail with at least 90 words."
  }]`;

export const generateCaseBasedAnswerPrompt = (chapter,Subject, Class) => `
Ensure that:  
  - The **case description should be at least 90 words** and should be **based on a real-life mathematical situation, data interpretation, or application-based reasoning**.  
  - The **question should test students’ problem-solving skills, logical reasoning, and conceptual understanding**.    
Provide 1 caseBased Answer type questions from the chapter "${chapter}" of ${Subject} of class "${Class}" in the following JSON format:
  [{
    "class": ${Class},
    "subject": "${Subject}",
    "chapter": "${chapter}",
    "type": "caseBased",
    "difficulty": "easy",
    "text": "Case description text here - must be of minimum 90 words.",
    "marks": 5,
    "caseDetails": {
      "subQuestions": [
        {
          "text": "Question text here related to case description",
          "marks": 1,
          "answer": "One line answer text here."
        },
        {
          "text": "Question text here related to case description",
          "marks": 1,
          "answer": "One line answer text here."
        },
        {
          "text": "Question text here related to case description",
          "marks": 1,
          "answer": "One line answer text here."
        },
        {
          "text": "Question text here related to case description",
          "marks": 1,
          "answer": "One line answer text here."
        },
        {
          "text": "Question text here related to case description",
          "marks": 1,
          "answer": "One line answer text here."
        }
      ]
    }
  }]`;

