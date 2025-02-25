export const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

export const generateUniqueId = () => {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const millis = String(now.getTime()).slice(-4);
  const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
  return `QP${year}${month}${day}${millis}${randomStr}`;
};

export const insertData = async () => {
  try {
    console.log("Inserting Questions");

    await QuestionPaperData.insertMany(questionData); // Insert new questions
    console.log("Questions inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  }
};
