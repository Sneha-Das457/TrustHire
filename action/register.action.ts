"use server"

import {auth} from "@/lib/auth"
import prisma from "@/lib/prisma"
import { APIError } from "better-auth"
import { error } from "console"

interface registerActionProps {
    name: string
    email: string
    password: string
}

export default async function registerAction({name, email, password}: registerActionProps){
    try{
        if(!name || !email || !password){
            return {error: "All fields are required"}
        }

        await auth.api.signUpEmail({
            body: {
                name,
                email,
                password
            }
        });

        return null
    }catch(err){
        if(err instanceof APIError){
            return {error: err.message}
        }

        return {error: String(err)};
    }
}