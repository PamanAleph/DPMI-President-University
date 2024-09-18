import axios from "axios";
// import { API_MAJOR } from "@/config/config";

// Define the Major interface
interface Major {
    id: number;
    name: string;
    created_at: string; // Or Date, depending on your handling
}

// Fetch data function
export const fetchMajor = async (): Promise<Major[]> => {
    try {
        const response = await axios.get<{ data: Major[] }>("http://localhost:4000/major-list");
        console.log(response.data.data)
        return response.data.data; // Extract and return the data array

    } catch (error) {
        console.error("Error fetching majors:", error);
        return []; // Return an empty array in case of an error
    }
};
