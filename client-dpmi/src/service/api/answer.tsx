import { API_ANSWER } from "@/config/config";
import Answer from "@/models/answer";
import axios from "axios";

export async function fetchAnswers(evaluationId: number, accessToken: string): Promise<Answer[]> {
  try {
    const response = await axios.get(
      `${API_ANSWER}/evaluation/${evaluationId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching answers:", error);
    throw error;
  }
}

export async function createAnswer(answerData: Answer, accessToken: string): Promise<Answer> {
  try {
    const response = await axios.post(
      `${API_ANSWER}`,
      answerData,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error creating answer:", error);
    throw error;
  }
}

export async function updateAnswer(
  answers: Array<{ id: number; answer: string; score: number }>,
  fileAnswers: Array<{ id: number; files: File[] }>,
  accessToken: string
): Promise<void> {
  const formData = new FormData();

  // Append answers and fileAnswers metadata
  formData.append("answers", JSON.stringify(answers));
  formData.append(
    "fileAnswers",
    JSON.stringify(fileAnswers.map((fa) => ({ id: fa.id })))
  );

  fileAnswers.forEach((fileAnswer) => {
    const file = fileAnswer.files[0];
    if (file) {
      formData.append(`fileAnswers_${fileAnswer.id}_files_0`, file);
    }
  });

  try {
    await axios.put(`${API_ANSWER}/batch-update`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`, 
      },
    });
  } catch (error) {
    console.error("Error updating answers with files:", error);
    throw error;
  }
}

interface UpdateAnswerScoreParams {
  evaluationId: number;
  questionId: number;
  score: number;
}

export async function updateAnswerScore(
  { questionId, score, evaluationId }: UpdateAnswerScoreParams,
  accessToken: string
) {
  try {
    const response = await axios.put(
      `${API_ANSWER}/update-score`,
      {
        questionId,
        score,
        evaluationId,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating answer score:", error);
    throw error;
  }
}

export async function deleteAnswer(answerId: number, accessToken: string): Promise<void> {
  try {
    await axios.delete(`${API_ANSWER}/${answerId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.error("Error deleting answer:", error);
    throw error;
  }
}