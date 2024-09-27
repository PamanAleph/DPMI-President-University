import SetupDetails from "./setupDetails";

interface EvaluationDetails {
    id: number;
    setup_id: number;
    major_id: number[];
    semester: string;
    major_names: string[];
    setup: SetupDetails;
    end_date: Date;
}

export default EvaluationDetails
