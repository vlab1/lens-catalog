import { Document } from 'mongoose';

export default interface Lenses extends Document {
    manufacturer: string;
    country: string;
    material: string;
    coating: string;
    description: string;
    images: Array<string>;
    name: string;
    type: string;
}
