import QuestionPaperData from '../../models/Question.js';

export const getQuestionSummary = async () => {

  try {

    const summary = await QuestionPaperData.aggregate([
      {
        $group: {
          _id: { class: "$class", subject: "$subject", chapter: "$chapter", type: "$type" },
          count: { $sum: 1 }
        }
      },
      {
        $group: {
          _id: { class: "$_id.class", subject: "$_id.subject", chapter: "$_id.chapter" },
          questionTypes: {
            $push: { type: "$_id.type", count: "$count" }
          }
        }
      },
      { $sort: { "_id.class": 1, "_id.subject": 1, "_id.chapter": 1 } }
    ]);

    return (summary);
  } catch (error) {
    return{ message: "Error fetching question summary", error };
  }   
  };