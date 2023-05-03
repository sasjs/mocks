import csrf from 'csrf'

const csrfTokens = new csrf()
const secret = csrfTokens.secretSync()

export const generateCSRFToken = () => csrfTokens.create(secret)
