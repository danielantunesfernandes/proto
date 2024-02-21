import { User } from "./user";

export interface Relation {
    id: number;
    user: User;
    relType: string;
};


