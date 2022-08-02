const Joi = require("joi")

const creationSchema = Joi.object({
    user_id:Joi.number().required(),
    topic:Joi.string().max(30).min(0),
    description:Joi.string().min(0)
})
function validateCreatePost(post){
    return creationSchema.validate(post)
}

const modifySchema = Joi.object({
    description:Joi.string().min(0),
    topic:Joi.string().min(0).max(30)
})
function validateModifyPost(update){
    return modifySchema.validate(update)
}

module.exports = {
    validateCreatePost:validateCreatePost,
    validateModifyPost:validateModifyPost
}