const generateOCRPrompt = (ocrText) => {
    return `Analyze the following Text  and determine if it is:
    - **(MCQ):** A question followed by answer choices.
    - **Mathematical Question:** A math-related question requiring calculations or formulas.
    - **Comprehension Question:** A question that requires understanding a passage or extracting information.
    - **General Question:** Any other type of direct question.
    - **No Question:** A statement or text that does not contain a question.
  
    **If the text does not clearly indicate a question**, respond with a friendly message asking the user to clarify their intent.
  
    **DO NOT answer the question yet.** Simply classify it and describe what kind of response is expected.
    
    Provide response in a friendly manner.
    ----
    **Text:** """${ocrText}"""
  
   `;
    
  };
  
  export default generateOCRPrompt