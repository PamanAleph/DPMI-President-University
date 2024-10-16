interface Questions{
    id: number;
    question: string;
    type: string;
    sequence: number;
    parent_id: number | null;
    section_id: number | null;
}

export default Questions