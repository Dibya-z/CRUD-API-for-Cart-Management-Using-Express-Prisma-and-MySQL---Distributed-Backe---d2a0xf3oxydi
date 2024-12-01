const express = require('express');
const { route } = require('..');
const { Prisma } = require('@prisma/client');
const router = express.Router();
const p = require('../db/config');
const { parse } = require('dotenv');
const prisma = p.prisma

router.get('/',async(req,res)=>{
    return res.status(200).send("Welcome")
})
router.post('/addProduct', async(req,res)=>{
    const {userId, productId, count} = req.body;
    try{
        if(!userId || !productId || !count){
            return res.status(404).json({"error": "All fields required"})
        }
        const newlyCreatedCart = await prisma.cart.create({
            data :  {userId,productId,count}
        })
        return res.status(201).json(newlyCreatedCart)
    }catch(e){
        return res.status(500).json({error : "Internal server error"})
    }
})
router.get('/getById/:id', async(req,res)=>{
    const {id} = req.params;
    const cart = await prisma.cart.findUnique({
        where : {cartId : parseInt(id)}
    })
    try{
        if (!cart){
            return res.status(404).json({error : "Cart not found"})
        }
        return res.status(200).json({cart})
    }
    catch(e){
        return res.status(500).json("Internal server error")
    }

})
router.patch('/patch/:id',async(req,res)=>{
    const {id} = req.params;
    const {count} = req.body;

    try{
        if(!count){
            return res.status(404).json({error : "Missing data"})
        }
        const cart = await prisma.cart.findUnique({
            where : {cartId : parseInt(id)}
        })
        if(!cart){
            return res.status(404).json({"error": "Cart not found"})
        }
        const updatedCart = await prisma.cart.update({
            where : {cartId : parseInt(id)},
            data : {count}
        })
        return res.status(200).json({updatedCart});
    }catch(e){
        return res.status(500).json({error : "Internal server error"})
    }
})
router.delete('/removeProduct/:id', async(req,res)=>{
    const {id} = req.params;
    try{
        const cart = await prisma.cart.findUnique({
            where : {cartId : parseInt(id)}
        })
        if(!cart){
            return res.status(404).json({"error": "Cart not found"})
        }
        await prisma.cart.delete({
            where : {
                cartId : parseInt(id)
            }
        })
        return res.status(200).json({ "message": "Cart deleted successfully" })

    }catch(e){
        return res.status(500).json("Internal server error")
    }
})

module.exports = router;