import Answer from "./answer";
import Option from "./option";

interface Questions {
  id: number;
  question: string;
  type: string;
  sequence: number;
  parent_id: number | null;
  section_id: number | null;
  answer?: Answer | null;
  options?: Option[] | null;
}

export default Questions;
