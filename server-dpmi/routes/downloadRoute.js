const router = require("express").Router();
const {downloadExcel, downloadPDF} = require("../controller/controllerDownload");

router.post("/excel", downloadExcel);
router.post("/pdf", downloadPDF);

module.exports = router;