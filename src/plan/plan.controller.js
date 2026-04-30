const prisma = require('../../config/db');

/**
 * @swagger
 * tags:
 *   name: Plans
 *   description: Plan for Subscription
*/

const getPlans = async(req,res) =>{

    try{

        const plans = await prisma.plan.findMany({
            where:{
                isActive:true
            },
            orderBy:{
                price:'asc'
            }
        });


        res.status(200).json({
            status:"success",
            data:plans
        })

    } catch(error){
        res.status(500).json({
            status:"failed",
            message:"Failed to fetch Plan",
            error:error.message
        })
    }


};

module.exports={
    getPlans
}