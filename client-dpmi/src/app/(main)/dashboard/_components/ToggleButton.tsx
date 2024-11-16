"use client";
import { useDashboardContext } from "./DashboardContext";

export default function ToggleButton() {
    const { isMenuOpen, toggleMenu } = useDashboardContext();

    return (
        <button
            className="fixed bottom-4 left-4 z-50 rounded-full bg-sky-500 p-2 text-white shadow-md"
            onClick={() => toggleMenu()}
        >
            {isMenuOpen ? "Close" : "Open"}
        </button>
    );
}
