import jwt from 'jsonwebtoken'

export const auth = (req, res, next) =>
{
    const token = req.cookies.authtoken
   
    
    if (!token){return res.status(401).send('Access Denied')}

    try {

        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
        
    } catch (error) {
        res.status(400).send('Invalid Token')
    }
}