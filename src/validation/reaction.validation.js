const Joi = require("joi")

const addSchema = Joi.object({
    reactionCode:Joi.number().min(1).max(5).required(),
    userId:Joi.number().required(),
    postId:Joi.number().required()
})

function addReaction(data){
    return addSchema.validate(data)
}

module.exports = {
    addReaction:addReaction
}
