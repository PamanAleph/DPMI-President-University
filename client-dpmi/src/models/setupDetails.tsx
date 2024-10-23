import Sections from "./section";

interface SetupDetails {
    id: number;
    name: string;
    slug: string;
    semester: number;
    major_id: number[];
    start_date: Date;
    end_date: Date;
    create_at: Date;
    major_name: string;
    sections: Sections[];
}

export default SetupDetails