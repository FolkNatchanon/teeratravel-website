export type UserRole = "A" | "U";

export type TeeraUserCookie = {
    user_id: number;
    username: string;
    role: UserRole;
};