export type Question = {
  id: number;
  section_id: number;
  require: boolean;
  question: string;
  var_name: string;
  answer_type: "text" | "email" | "number" | "radio" | "checkbox" | null;
  answer_id: number | null;
  data_type: "root_question" | "sub_question";
  children_value?: {
    id: number[]; 
  } | null;
};

export interface FormSectionProps {
  question: Question; 
  numberPrefix: string; 
  formValues: { [key: number]: string | number }; 
  handleInputChange: (questionID: number, value: string | number) => void; 
}