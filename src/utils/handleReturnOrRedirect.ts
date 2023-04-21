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

  if (!response.status) response.status = 200

  try {
    if (!response.type) response.type = 'json'

    if (response.type === 'json') res.status(response.status).json(response.content)
    if (response.type === 'text') res.status(response.status).send(response.content)
  } catch (err: any) {
    res.status(403).send(err.toString())
  }
}