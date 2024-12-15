// import { downloadFile } from "@/service/api/download";
// import React from "react";

// export default function DownloadButton() {
//   const handleDownload = async (format: "excel" | "pdf") => {
//     try {
//       await downloadFile(format, evaluationData);
//     } catch (error) {
//       console.error("Download failed:", error);
//     }
//   };
//   return (
//     <div className="flex space-x-4 mt-4">
//       <button
//         onClick={() => handleDownload("excel")}
//         className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all"
//       >
//         Download as Excel
//       </button>
//       <button
//         onClick={() => handleDownload("pdf")}
//         className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
//       >
//         Download as PDF
//       </button>
//     </div>
//   );
// }
