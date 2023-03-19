import { Document } from 'mongoose';

export default interface Account extends Document {
    name: string;
    email: string;
    password: string;
   
    isValidPassword(passwod: string): Promise<Error | boolean>;
}
