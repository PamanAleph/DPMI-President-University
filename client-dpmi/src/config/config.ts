export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL
export const API_MAJOR = BASE_URL + "/major"
export const API_QUESTION = BASE_URL + "/questions"
export const API_SETUP = BASE_URL + "/setup"
export const API_SECTION = BASE_URL + "/sections"
export const API_EVALUATION = BASE_URL + "/evaluations"
export const API_USER = BASE_URL + "/users"
export const API_ROLE = BASE_URL + "/roles"
export const API_AUTH = BASE_URL + "/auth"
export const API_ANSWER = BASE_URL + "/answers"

export const USER_SECRECTKEY = process.env.USER_SECRETKEY || "default-secret-key";
