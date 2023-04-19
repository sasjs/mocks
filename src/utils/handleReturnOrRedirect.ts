import express from 'express'
import { SasViyaResponse } from "../controllers/sasviya";

/**
 * Reusable function that checks whether controller response is json or redirect
 * And it returns accordingly
 * 
 * @param res Express response (to return)
 * @param response Controller response
 * @returns 
 */
export const handleReturnOrRedirect = (
    res: express.Response,
    response: SasViyaResponse
) => {
    if (response.redirect) {
        res.redirect(response.redirect)
        return
    }
    
    try {
        res.send(response.content)
    } catch (err: any) {
        res.status(403).send(err.toString())
    }
}