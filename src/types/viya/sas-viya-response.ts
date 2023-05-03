import { SasViyaResponseType } from './sas-viya-response-type'

export interface SasViyaResponse {
  content: any
  type?: SasViyaResponseType
  redirect?: string
  status?: number
  error?: boolean
}
