import Question from '../../models/Question.js'; // Adjust the path to your Question model

// Function to identify and delete duplicates
export const deleteDuplicateQuestions = async () => {
  try {
    // Aggregation pipeline to group by hash and identify duplicates
    const duplicates = await Question.aggregate([
      {
        $group: {
          _id: '$hash',
          count: { $sum: 1 },
          ids: { $push: '$_id' },
        },
      },
      {
        $match: {
          count: { $gt: 1 }, // Only groups with more than one document
        },
      },
    ]);

    const deletedIds = [];

    // Process each group of duplicates
    for (const group of duplicates) {
      const idsToDelete = group.ids.slice(1); // Keep the first document, delete the rest
      await Question.deleteMany({ _id: { $in: idsToDelete } });
      deletedIds.push(...idsToDelete); // Add deleted IDs to the array
    }

    console.log('Duplicate questions deleted:', deletedIds);
  } catch (error) {
    console.error('Error deleting duplicates:', error);
  }
};

