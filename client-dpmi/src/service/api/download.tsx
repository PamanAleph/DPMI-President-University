import { API_DOWNLOAD } from "@/config/config";
import axios from "axios";

interface EvaluationData {
  setup: {
    sections: {
      name: string;
      questions: {
        question: string;
        answer?: { answer: string; score: number | null };
      }[];
    }[];
  };
}

export const downloadFile = async (
  format: "excel" | "pdf",
  evaluationData: EvaluationData
) => {
  try {
    const url =
      format === "excel" ? `${API_DOWNLOAD}/excel` : `${API_DOWNLOAD}/pdf`;

    // Lakukan POST request untuk mengirim data dan mendapatkan file
    const response = await axios.post(
      url,
      { data: evaluationData },
      {
        responseType: "blob",
      }
    );

    const blob = new Blob([response.data], {
      type: response.headers["content-type"],
    });
    const downloadUrl = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `evaluation_data.${format === "excel" ? "xlsx" : "pdf"}`;
    document.body.appendChild(link);
    link.click();

    link.remove();
    URL.revokeObjectURL(downloadUrl);

    console.log("File downloaded successfully");
  } catch (error) {
    console.error("Error downloading file:", error);
    throw new Error("Failed to download file");
  }
};
