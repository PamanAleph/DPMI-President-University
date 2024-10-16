import Questions from "./questions";

interface Sections {
    id: number;
    setup_id: number;
    name: string;
    sequence: number;
    questions: Questions[];
}

export default Sections