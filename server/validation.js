import Joi from "@hapi/joi"

export const registrationValidation = (data)=>{

    const schema =  Joi.object({
        username: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        profileiImg: Joi.string(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data)

}

export const updateValidationProcess = (data)=>{

    const schema =  Joi.object({
        username: Joi.string().min(6),
        email: Joi.string().min(6).email(),
        password: Joi.string().min(6),
        profileiImg: Joi.string(),
        
    });
    return schema.validate(data)

}


export const loginValidation = (data)=>{

    const schema =  Joi.object({
       
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data)

}