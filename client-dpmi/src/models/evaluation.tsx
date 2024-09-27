interface Evaluation {
    id: number;
    setup_id: number;
    major_id: number[];
    semester: string;
    end_date: Date;
    major_names: string[];
    setup_name: string;
}

export default Evaluation