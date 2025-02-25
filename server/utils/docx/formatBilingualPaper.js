import { AlignmentType, Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, WidthType, VerticalAlign, TabStopType, BorderStyle } from "docx";

export const formatQuestionPaperBilingual = async (title, instructions, sections, paperId) => {
    let questionNumber = 1;

    const doc = new Document({
      styles: {
        default: {
          document: {
            run: {
              font: "Palanquin Dark",
            },
          },
        },
      },
      sections: [
        {
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
                              size: 27,
                              font: "Times New Roman",
                            }),
                            new TextRun({
                              text: paperId,
                              size: 27,
                              bold: true,
                              font: "Times New Roman",
                              color: "000000", // Ensuring paperId ID is black
                            }),
                          ],
                          alignment: AlignmentType.LEFT,
                          spacing: { before: 100, after: 100 },
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
                      margins: { bottom: 300 }, // Adds margin BELOW the bottom border
                    }),
                  ],
                }),
              ],
              width: { size: 100, type: WidthType.PERCENTAGE },
              margins: { bottom: 300 }, // Adds margin BELOW the bottom border
            }),
            new Paragraph({
              text: "", // Empty paragraph
              spacing: { after: 300 }, // Space above and below
            }),
  
            // Title (School name and exam name)
            new Paragraph({
              children: [
                new TextRun({
                  text: title,
                  bold: true,
                  size: 28,
                  font: "Palanquin Dark",
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 300 },
            }),
  
            // Instructions
            ...instructions.map((inst) =>
              new Paragraph({
                children: [
                  new TextRun({
                    text: inst,
                    size: 24,
                    font: "Palanquin Dark",
                  }),
                ],
                spacing: { after: 200 },
              })
            ),
  
            // Sections
            ...sections.flatMap((section) => [
              // Section Header
              new Paragraph({
                children: [
                  new TextRun({
                    text: section.title,
                    bold: true,
                    size: 24,
                    font: "Palanquin Dark",
                  }),
                ],
                spacing: { before: 400, after: 200 },
              }),
  
              // Questions
              ...section.questions.flatMap((q) => {
                if (q.type === "mcq") {
                  // Question text in English and Hindi
                  const questionPara = new Paragraph({
                    children: [
                      new TextRun({
                        text: `${questionNumber++}. ${q.text}`, // English text
                        size: 22,
                        font: "Palanquin Dark",
                      }),
                      new TextRun({
                        text: `\n${q.text_hi}`, // Hindi text
                        size: 22,
                        font: "Palanquin Dark",
                      }),
                    ],
                    spacing: { after: 100 },
                  });
  
                  // Each option in English and Hindi
                  const optionParas = q.options.map((option, index) =>
                    new Paragraph({
                      children: [
                        new TextRun({
                          text: `    ${String.fromCharCode(97 + index)}) ${option}`, // English option
                          size: 22,
                          font: "Palanquin Dark",
                        }),
                        new TextRun({
                          text: `\n    ${String.fromCharCode(97 + index)}) ${q.options_hi[index]}`, // Hindi option
                          size: 22,
                          font: "Palanquin Dark",
                        }),
                      ],
                      spacing: { after: 100 },
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
                          font: "Palanquin Dark",
                        }),
                        new TextRun({
                          text: q.text, // English text
                          size: 22,
                          font: "Palanquin Dark",
                        }),
                        new TextRun({
                          text: `\n${q.text_hi}`, // Hindi text
                          size: 22,
                          font: "Palanquin Dark",
                        }),
                      ],
                      spacing: { after: 200 },
                    }),
                    ...q.caseDetails.subQuestions.map((subQ, index) =>
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `${String.fromCharCode(97 + index)}) ${subQ.text}`, // English sub-question
                            size: 22,
                            font: "Palanquin Dark",
                          }),
                          new TextRun({
                            text: `\n${String.fromCharCode(97 + index)}) ${subQ.text_hi}`, // Hindi sub-question
                            size: 22,
                            font: "Palanquin Dark",
                          }),
                          new TextRun({
                            text: ` (${subQ.marks} mark${subQ.marks > 1 ? "s" : ""})`,
                            size: 22,
                            font: "Palanquin Dark",
                          }),
                        ],
                        spacing: { after: 200 },
                        tabStops: [{ position: 7000, type: TabStopType.RIGHT }],
                      })
                    ),
                  ];
                  return caseParagraphs;
                }
  
                // Regular questions (short/long answer)
                return new Paragraph({
                  children: [
                    new TextRun({
                      text: `${questionNumber++}. ${q.text}`, // English text
                      size: 22,
                      font: "Palanquin Dark",
                    }),
                    new TextRun({
                      text: `\n${q.text_hi}`, // Hindi text
                      size: 22,
                      font: "Palanquin Dark",
                    }),
                  ],
                  spacing: { after: 200 },
                });
              }),
            ]),
          ],
        },
      ],
    });
  
    return Packer.toBuffer(doc);
};