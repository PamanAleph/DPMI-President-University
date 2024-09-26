import Questions from "./questions";

interface Sections {
    id: number;
    setup_id: number;
    section_name: string;
    sequence: number;
    questions: Questions[];
}

export default Sections