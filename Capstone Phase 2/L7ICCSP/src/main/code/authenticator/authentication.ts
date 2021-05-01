// Interface for handling authentication to get access token
export interface Authentication{
    authorize(): Promise<void>; // auth function to get login credentials and provide the access token
    getAccessToken(code: string): Promise<void>;
    getUserId(): Promise<string>;
}