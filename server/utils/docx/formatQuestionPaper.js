import { AlignmentType, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, VerticalAlign } from "docx";

export const formatQuestionPaper = async (title, instructions, sections, paperId) => {
    let questionNumber = 1;
    const doc = new Document({
      sections: [{
        children: [
  
          
          new Paragraph({
            children: [
                new TextRun({
                    text: `Exam Ai: Save this Paper ID to get your Answer Paper – `,
                    size: 27  ,
                    font: "Times New Roman"
                }),
                new TextRun({
                    text: paperId,
                    size: 27,
                    bold: true,
                    font: "Times New Roman",
                    color: "000000"  // Ensuring paperId ID is black
                }),
      
            ],
            alignment: AlignmentType.LEFT,
            spacing: { before : 100, after: 300 },
        }),
  
          new Paragraph({
            children: [new TextRun({ text: "PMSHRI KENDRIYA VIDYALAYA SAURKHAND", bold: true, size: 28 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 24 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          ...instructions.map(inst => new Paragraph({ text: inst, spacing: { after: 200 } })),
          ...sections.map(section => {
            const rows = [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: section.title, bold: true, size: 24 }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    columnSpan: 3,
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                ],
              }),
              ...section.questions.map(q => {
  
                console.log("q",q)
  
                const questionParagraphs = [
                  new Paragraph({
                    text: q.text,
                    spacing: { after: 100 },
                    indent: { left: 50 },
                  }),
                ];
  
              if (q.type === "mcq" && q.options) {
                  q.options.forEach((option, index) => {
                    questionParagraphs.push(
                      new Paragraph({
                        children: [
                          new TextRun({ text: `(${String.fromCharCode(97 + index)}) ${option}` }),
                        ],
                        spacing: { before: 50 },
                        indent: { left: 50 },
                      })
                    );
                  });
                } else if (q.type === "caseBased" && q.caseDetails?.subQuestions) {
  
                  const caseMarks = q.caseDetails.subQuestions.reduce(
                    (total, caseQuestion) => total + (caseQuestion.marks || 0),
                    0
                  );
                  q.marks = caseMarks;
              
                  console.log("q.marks", q.marks);
              
                  q.caseDetails.subQuestions.forEach((caseQuestion, index) => {
                    questionParagraphs.push(
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${index + 1}. ${caseQuestion.text} (${caseQuestion.marks} marks)` }),
                        ],
                        spacing: { before: 50 },
                        indent: { left: 50 },
                      })
                    );
                  });
              }else if (q.type === "assertionReason") {
                questionParagraphs.push(
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Assertion: ", bold: true }),
                      new TextRun({ text: q.assertion }),
                    ],
                    spacing: { before: 50 },
                    indent: { left: 50 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({ text: "Reason: ", bold: true }),
                      new TextRun({ text: q.reason }),
                    ],
                    spacing: { before: 50 },
                    indent: { left: 50 },
                  }),
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: "Select the correct option: (a) Both are true (b) Assertion is true but reason is false (c) Assertion is false but reason is true (d) Both are false",
                      }),
                    ],
                    spacing: { before: 50 },
                    indent: { left: 50 },
                  })
                );
  
                // ✅ Fill in the Blanks Question Handling
              } else if (q.type === "fillInTheBlanks") {
                questionParagraphs.push(
                  new Paragraph({
                    children: [
                      new TextRun({ text: q.text.replace("_____", "______"), bold: true }),
                    ],
                    spacing: { before: 50 },
                    indent: { left: 50 },
                  })
                );
  
              }else if (q.type === "matchTheFollowing" && q.columnA && q.columnB) { 
                questionParagraphs.push(
                  new Paragraph({
                    children: [new TextRun({ text: "Match the following:", bold: true })],
                    spacing: { before: 50 },
                    indent: { left: 50 },
                  })
                );
              
                // Fisher-Yates Shuffle for columnB
                const shuffledColumnB = [...q.columnB]; // Copy columnB
                for (let i = shuffledColumnB.length - 1; i > 0; i--) {
                  const j = Math.floor(Math.random() * (i + 1));
                  [shuffledColumnB[i], shuffledColumnB[j]] = [shuffledColumnB[j], shuffledColumnB[i]];
                }
              
                // Add (a), (b), (c), (d) prefixes to shuffledColumnB
                const optionLabels = ["(a)", "(b)", "(c)", "(d)"];
                const labeledColumnB = shuffledColumnB.map((item, index) => `${optionLabels[index]} ${item}`);
              
                const matchRows = q.columnA.map((leftItem, index) => {
                  return new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: `(${index + 1}) ${leftItem}` })],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: { top: { size: 0, color: "FFFFFF" }, bottom: { size: 0, color: "FFFFFF" }, left: { size: 0, color: "FFFFFF" }, right: { size: 0, color: "FFFFFF" } },
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: labeledColumnB[index] || "" })],
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        borders: { top: { size: 0, color: "FFFFFF" }, bottom: { size: 0, color: "FFFFFF" }, left: { size: 0, color: "FFFFFF" }, right: { size: 0, color: "FFFFFF" } },
                      }),
                    ],
                  });
                });
              
                questionParagraphs.push(
                  new Table({
                    rows: matchRows,
                    width: { size: 100, type: WidthType.PERCENTAGE },
                    borders: { top: null, bottom: null, left: null, right: null }, // Hide table borders
                  })
                );
              }
              
  
  
                return new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: `${questionNumber++}`, alignment: AlignmentType.CENTER })],
                      width: { size: 5, type: WidthType.PERCENTAGE },
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: questionParagraphs,
                      width: { size: 90, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: `${q.marks}`, alignment: AlignmentType.CENTER })],
                      width: { size: 5, type: WidthType.PERCENTAGE },
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                  ],
                });
              }),
            ];
            return new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } });
          }),
        ],
      }],
    });
    return Packer.toBuffer(doc);
};

export const getAnswerpaper = async (title, instructions, sections) => {
    let questionNumber = 1;
    const doc = new Document({
      sections: [{
        children: [
          new Paragraph({
            children: [new TextRun({ text: "PMSHRI KENDRIYA VIDYALAYA SAURKHAND", bold: true, size: 28 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [new TextRun({ text: title, bold: true, size: 24 })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          ...instructions.map(inst => new Paragraph({ text: inst, spacing: { after: 200 } })),
          ...sections.map(section => {
            const rows = [
              new TableRow({
                children: [
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: section.title, bold: true, size: 24 }),
                        ],
                        alignment: AlignmentType.CENTER,
                      }),
                    ],
                    columnSpan: 3,
                    verticalAlign: VerticalAlign.CENTER,
                  }),
                ],
              }),
              ...section.questions.map(q => {
  
                const questionParagraphs = [
                  new Paragraph({
                    text: q.text,
                    spacing: { after: 100 },
                    indent: { left: 50 },
                  }),
                ];
  
                if (q.type === "mcq" && q.options) {
                  q.options.forEach((option, index) => {
                    questionParagraphs.push(
                      new Paragraph({
                        children: [
                          new TextRun({ text: `(${String.fromCharCode(97 + index)}) ${option}` }),
                        ],
                        spacing: { before: 50 },
                        indent: { left: 50 },
                      })
                    );
                  });
  
                  if (q.correctAnswer) {
                    questionParagraphs.push(
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Correct Answer: ", bold: true }),
                          new TextRun({ text: `(${q.correctAnswer}) ${q.options[q.correctAnswer.charCodeAt(0) - 97]}` }),
                        ],
                        spacing: { before: 50 },
                        indent: { left: 50 },
                      })
                    );
                  }
  
                } else if (q.type === "caseBased" && q.caseDetails?.subQuestions) {
                  const caseMarks = q.caseDetails.subQuestions.reduce(
                    (total, caseQuestion) => total + (caseQuestion.marks || 0),
                    0
                  );
                  q.marks = caseMarks;
  
  
                  q.caseDetails.subQuestions.forEach((caseQuestion, index) => {
                    questionParagraphs.push(
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${index + 1}. ${caseQuestion.text} (${caseQuestion.marks} marks)` }),
                        ],
                        spacing: { before: 50 },
                        indent: { left: 50 },
                      })
                    );
  
                    if (caseQuestion.answer) {
                      questionParagraphs.push(
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Answer: ", bold: true }),
                            new TextRun({ text: caseQuestion.answer }),
                          ],
                          spacing: { before: 50 },
                          indent: { left: 50 },
                        })
                      );
                    }
                  });
                }
  
                // Add the answer to the question
                if (q.answer) {
                  questionParagraphs.push(
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Answer: ", bold: true }),
                        new TextRun({ text: q.answer }),
                      ],
                      spacing: { before: 50 },
                      indent: { left: 50 },
                    })
                  );
                }
  
                return new TableRow({
                  children: [
                    new TableCell({
                      children: [new Paragraph({ text: `${questionNumber++}`, alignment: AlignmentType.CENTER })],
                      width: { size: 5, type: WidthType.PERCENTAGE },
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                    new TableCell({
                      children: questionParagraphs,
                      width: { size: 90, type: WidthType.PERCENTAGE },
                    }),
                    new TableCell({
                      children: [new Paragraph({ text: `${q.marks}`, alignment: AlignmentType.CENTER })],
                      width: { size: 5, type: WidthType.PERCENTAGE },
                      verticalAlign: VerticalAlign.CENTER,
                    }),
                  ],
                });
              }),
            ];
            return new Table({ rows, width: { size: 100, type: WidthType.PERCENTAGE } });
          }),
        ],
      }],
    });
    return Packer.toBuffer(doc);
  };