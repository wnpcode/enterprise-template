import { env } from "../app/env";

export const apiUrl = (path: string) => `${env.VITE_API_URL}${path}`;
