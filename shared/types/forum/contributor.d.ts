import type { User } from "../wikia";

export interface ContributorList {
    /// set to "0" on the sample idk what this does
    count: string;
    userInfo: User[];
}