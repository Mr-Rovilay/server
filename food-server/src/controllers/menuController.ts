// @ts-ignore
import { NextFunction, Request, Response } from "express";
import uploadImageOnCloudinary from "../utils/imageUpload";
import mongoose, { ObjectId } from "mongoose";
import multer, { Multer } from 'multer'; 
import { Menu, NigerianDelicacyCategory } from "../models/menuModel";
import { Restaurant } from "../models/restaurantModel";

export const addMenu = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
    try {
        const {name, description, price, category} = req.body;
        const file = req.file;
        if(!file){
           res.status(400).json({
                success:false,
                message:"Image is required"
            })
            return;
        };
        if (!Object.values(NigerianDelicacyCategory).includes(category)) {
           res.status(400).json({
                success: false,
                message: "Invalid category",
            });
            return;
        }
        const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
        const menu: any = await Menu.create({
            name , 
            description,
            price,
            category,
            image:imageUrl
        });
        const restaurant = await Restaurant.findOne({user:req.id});
        if(restaurant){
            (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
            await restaurant.save();
        }

        res.status(201).json({
            success:true,
            message:"Menu added successfully",
            menu
        });
        return;
    } catch (error) {
        console.log(error);
         res.status(500).json({message:"Internal server error"});
         return; 
    }
}
export const editMenu = async (req:Request, res:Response, next:NextFunction):Promise<void> => {
    try {
        const {id} = req.params;
        const {name, description, price, category} = req.body;
        const file = req.file;
        const menu = await Menu.findById(id);
        if(!menu){
            res.status(404).json({
                success:false,
                message:"Menu not found!"
            })
            return;
        }
        if(name) menu.name = name;
        if(description) menu.description = description;
        if(price) menu.price = price;
        if (category) menu.category = category;  // Update category

        if(file){
            const imageUrl = await uploadImageOnCloudinary(file as Express.Multer.File);
            menu.image = imageUrl;
        }
        await menu.save();

       res.status(200).json({
            success:true,
            message:"Menu updated",
            menu,
        })
        return;
    } catch (error) {
        console.log(error);
         res.status(500).json({message:"Internal server error"});
         return; 
    }
}