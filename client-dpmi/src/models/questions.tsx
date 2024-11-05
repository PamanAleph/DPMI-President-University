import Answer from "./answer";

interface Questions {
  id: number;
  question: string;
  type: string;
  sequence: number;
  parent_id: number | null;
  section_id: number | null;
  answer: Answer;
}

export default Questions;
