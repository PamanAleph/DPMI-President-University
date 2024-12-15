interface Major {
    id: number;
    name: string;
    head: string;
    slug: string;
    emails: string[] | null;
    created_at: Date;
}

export default Major;