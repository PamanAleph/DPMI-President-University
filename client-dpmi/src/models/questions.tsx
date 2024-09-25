interface Questions{
    id: number;
    question_data: string;
    question_type: string;
    sequence: number;
    parent_id: number | null;
    section_id: number | null;
}

export default Questions