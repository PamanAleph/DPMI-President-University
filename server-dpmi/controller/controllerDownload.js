const XLSX = require("xlsx");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const downloadExcel = (req, res) => {
  const data = req.body.data; // Data JSON dari frontend

  // Buat workbook dan worksheet
  const workbook = XLSX.utils.book_new();

  data.setup.sections.forEach((section) => {
    const sheetData = section.questions.map((q) => ({
      Section: section.name,
      Question: q.question,
      Answer: q.answer ? q.answer.answer : "",
      Score: q.answer ? q.answer.score : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(sheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, section.name);
  });

  const filePath = path.join(__dirname, "../temp/evaluation_data.xlsx");
  XLSX.writeFile(workbook, filePath);

  res.download(filePath, "evaluation_data.xlsx", (err) => {
    if (err) console.error("Error downloading Excel file:", err);
    fs.unlinkSync(filePath);
  });
};

const downloadPDF = (req, res) => {
  const data = req.body.data;
  const doc = new PDFDocument();
  const filePath = path.join(__dirname, "../temp/evaluation_data.pdf");
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(18).text("Evaluation Data", { align: "center" }).moveDown();

  data.setup.sections.forEach((section) => {
    doc.fontSize(14).text(section.name, { underline: true }).moveDown(0.5);
    section.questions.forEach((question, index) => {
      doc.fontSize(12).text(`Q${index + 1}: ${question.question}`);
      doc
        .fontSize(10)
        .text(`Answer: ${question.answer ? question.answer.answer : ""}`);
      doc
        .fontSize(10)
        .text(`Score: ${question.answer ? question.answer.score : ""}`);
      doc.moveDown(0.5);
    });
    doc.moveDown(1);
  });

  doc.end();

  doc.on("finish", () => {
    res.download(filePath, "evaluation_data.pdf", (err) => {
      if (err) console.error("Error downloading PDF file:", err);
      fs.unlinkSync(filePath);
    });
  });
};

module.exports = { downloadExcel, downloadPDF };
