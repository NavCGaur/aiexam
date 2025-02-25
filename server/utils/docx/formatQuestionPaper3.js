import { AlignmentType, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, VerticalAlign, TabStopType, BorderStyle } from "docx";

export const formatQuestionPaper3 = async (title, instructions, sections, paperId) => {


    let questionNumber = 1;

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Palanquin Dark"
            }
          }
        }
      },
      sections: [{
        children: [
  
          new Table({ 
            rows: [
                new TableRow({
                    children: [
                        new TableCell({
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
                                    spacing: { before : 100, after: 100 },
                                }),
                            ],
                            
                            columnSpan: 3,
                            width: { size: 100, type: WidthType.PERCENTAGE },
                            borders: {
                                top: { style: BorderStyle.DASHED, size: 1, color: "000000" },
                                bottom: { style: BorderStyle.DASHED, size: 1, color: "000000" },
                                left: { style: BorderStyle.DASHED, size: 1, color: "000000" },
                                right: { style: BorderStyle.DASHED, size: 1, color: "000000" },
                            },
                            verticalAlign: VerticalAlign.CENTER,
                            margins: { bottom: 300 } // Adds margin BELOW the bottom border
  
                        }),
                    ],
                }),
            ],
            width: { size: 100, type: WidthType.PERCENTAGE },
            margins: { bottom: 300 } // Adds margin BELOW the bottom border
  
        }),
        new Paragraph({
          text: "",  // Empty paragraph
          spacing: { after: 300 }, // Space above and below
      }),
          
          // Title (School name and exam name)
          new Paragraph({
            children: [
              new TextRun({ 
                text: title,
                bold: true,
                size: 28,
                font: "Palanquin Dark"
              })
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 }
          }),
  
          // Instructions
          ...instructions.map(inst => new Paragraph({
            children: [
              new TextRun({ 
                text: inst,
                size: 24,
                font: "Palanquin Dark"
              })
            ],
            spacing: { after: 200 }
          })),
  
          // Sections
          ...sections.flatMap(section => [
            // Section Header
            new Paragraph({
              children: [
                new TextRun({ 
                  text: section.title,
                  bold: true,
                  size: 24,
                  font: "Palanquin Dark"
                })
              ],
              spacing: { before: 400, after: 200 }
            }),
  
            // Questions
            ...section.questions.flatMap(q => {
              if (q.type === "mcq") {
                // Question text in one paragraph
                const questionPara = new Paragraph({
                  children: [
                    new TextRun({ 
                      text: `${questionNumber++}. ${q.text}`,
                      size: 22,
                      font: "Palanquin Dark"
                    })
                  ],
                  spacing: { after: 100 }
                });
  
                // Each option in its own paragraph
                const optionParas = q.options.map((option, index) => 
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: `    ${String.fromCharCode(97 + index)}) ${option}`,
                        size: 22,
                        font: "Palanquin Dark"
                      })
                    ],
                    spacing: { after: 100 }
                  })
                );
  
                return [questionPara, ...optionParas];
              }
  
              if (q.type === "caseBased" && q.caseDetails?.subQuestions) {
                const caseParagraphs = [
                    new Paragraph({
                        children: [
                            new TextRun({ 
                                text: `${questionNumber++}. Case Study:\n`,
                                bold: true,
                                size: 22,
                                font: "Palanquin Dark"
                            }),
                            new TextRun({ 
                                text: q.text,
                                size: 22,
                                font: "Palanquin Dark"
                            })
                        ],
                        spacing: { after: 200 }
                    }),
                    ...q.caseDetails.subQuestions.map((subQ, index) => new Paragraph({
                        children: [
                            new TextRun({ 
                                text: `${String.fromCharCode(97 + index)}) ${subQ.text}`,
                                size: 22,
                                font: "Palanquin Dark"
                            }),
  
                            new TextRun({ 
                              text: ` (${subQ.marks} mark${subQ.marks > 1 ? "s" : ""})`, 
                              size: 22,
                              font: "Palanquin Dark",
                          })
                        ],
                        spacing: { after: 200 },
                        tabStops: [{ position: 7000, type: TabStopType.RIGHT }]
  
                    }))
                ];
                return caseParagraphs;
            }
            
  
              // Regular questions (short/long answer)
              return new Paragraph({
                children: [
                  new TextRun({ 
                    text: `${questionNumber++}. ${q.text}`,
                    size: 22,
                    font: "Palanquin Dark"
                  })
                ],
                spacing: { after: 200 }
              });
            })
          ])
        ]
      }]
    });
  
    return Packer.toBuffer(doc);};

export const getAnswerpaper3 = async (title, instructions, sections) => {

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
  
                // Handle MCQ questions
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
  
                  // Add correct answer for MCQ
                  if (q.correctAnswer) {
                    questionParagraphs.push(
                      new Paragraph({
                        children: [
                          new TextRun({ text: "Correct Answer: ", bold: true }),
                          new TextRun({ text: q.correctAnswer, bold: true }),
                        ],
                        spacing: { before: 50, after: 50 },
                        indent: { left: 50 },
                      })
                    );
                  }
                }
  
                // Handle case-based questions
                else if (q.type === "caseBased" && q.caseDetails?.subQuestions) {
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
  
                    // Add answer for each sub-question
                    if (caseQuestion.answer) {
                      questionParagraphs.push(
                        new Paragraph({
                          children: [
                            new TextRun({ text: "Answer: ", bold: true }),
                            new TextRun({ text: caseQuestion.answer, bold: true }),
                          ],
                          spacing: { before: 50, after: 50 },
                          indent: { left: 50 },
                        })
                      );
                    }
                  });
                }
  
                // Handle other question types (shortAnswer, mediumAnswer, longAnswer, etc.)
                else if (q.answer) {
                  questionParagraphs.push(
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Answer: ", bold: true }),
                        new TextRun({ text: q.answer, bold: true }),
                      ],
                      spacing: { before: 50, after: 50 },
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