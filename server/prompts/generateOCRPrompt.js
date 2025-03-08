const generateOCRPrompt = (ocrText) => {
    return `Analyze the following Text and classify it based on its structure. Determine if it is:
    - **Multiple-Choice Question (MCQ):** A question followed by answer choices.
    - **Mathematical Question:** A math-related question requiring calculations or formulas.
    - **Comprehension Question:** A question that requires understanding a passage or extracting information.
    - **General Question:** Any other type of direct question.
  
    **If the text does not clearly indicate a question**, respond with a friendly message asking the user to clarify their intent.
  
    **DO NOT answer the question yet.** Simply classify it and describe what kind of response is expected.
    
    Provide response in a clear and structured format. Here's an example:
    ----
    **Text:** """${ocrText}"""
  
    It seems like this is a **(MCQ / Math / Comprehension / General Question / Statement / Not Clear)**.  
    Does that sound right to you? If it's unclear, could you help me understand what you're asking?  

   **If it's correct, would you like me to provide an answer for it?**  

   ---
    Let me know if you'd like me to proceed with an answer! 😊`;
    
  };
  
  export default generateOCRPrompt