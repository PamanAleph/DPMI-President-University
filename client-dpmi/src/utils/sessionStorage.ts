export function getAccessToken(): string | null {
    try {
      if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
        console.warn("SessionStorage is not accessible in this environment.");
        return null;
      }
  
      const userData = sessionStorage.getItem("user");
      if (!userData) {
        console.warn("No user data found in sessionStorage.");
        return null;
      }
  
      const parsedData = JSON.parse(userData);
      return parsedData.accessToken || null;
    } catch (error) {
      console.error("Error retrieving access token from sessionStorage:", error);
      return null;
    }
  }
  