import { Schema, model } from 'mongoose';
import Lenses from '@/resources/lenses/lenses.interface';

const LensesSchema = new Schema(
    {
        manufacturer: {
            type: String,
            trim: true,
        },
        country: {
            type: String,
            trim: true,
        },
        material: {
            type: String,
            trim: true,
        },
        coating: {
            type: String,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        images: {
            type: Array<String>,
            trim: true,
        },
        name: {
            type: String,
            trim: true,
        },
        type: {
            type: String,
            trim: true,
        },
    },
    { timestamps: true }
);


export default model<Lenses>('Lenses', LensesSchema);
