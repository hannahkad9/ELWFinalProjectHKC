import {userModel} from '../users/users.model.js';

export  async function checkSecretMiddleware(req, res, next) {
    const secret = req.headers.secret;
    const userid = req.headers.userid;
    if(!secret || !userid) {
        res.status(401).json({
            message: 'No secret or id provided'
        });
        return;
    }
    const user = await userModel.findById(userid);
    if(!user) {
        res.status(401).json({
            message: 'User not found'
        });
        return;
    }
    if(user.secret !== secret) {
        res.status(401).json({
            message: 'Invalid secret'
            
        });
        return;
    }


console.log(req.headers)    
next()

}