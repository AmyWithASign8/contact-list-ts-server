import {Request} from "express";

export interface IGetUserForRequest extends Request{
   user:{
       id:number;
       name:string;
       password: string;
   }
}