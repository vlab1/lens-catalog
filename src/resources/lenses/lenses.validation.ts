import Joi from 'joi';

const create = Joi.object({
    manufacturer: Joi.string(),
    country: Joi.string(),
    material: Joi.string(),
    coating: Joi.string(),
    description: Joi.string(),
    images: Joi.array(),
    name: Joi.string().required(),
    type: Joi.string().required()
});

const update = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    manufacturer: Joi.string(),
    country: Joi.string(),
    material: Joi.string(),
    coating: Joi.string(),
    description: Joi.string(),
    images: Joi.array(),
    name: Joi.string().required(),
    type: Joi.string(),
    prevImages: Joi.array()
});

const delete0 = Joi.object({
    _id: Joi.string().hex().length(24).required(),
});

const find = Joi.object({
    _id: Joi.string().hex().length(24),
    manufacturer: Joi.string(),
    country: Joi.string(),
    material: Joi.string(),
    coating: Joi.string(),
    description: Joi.string(),
    name: Joi.string(),
    type: Joi.string()
});

const imageDelete = Joi.object({
    _id: Joi.string().hex().length(24).required(),
    url: Joi.string().required(),
});

export default {
    create,
    update,
    delete0,
    find,
    imageDelete
};
