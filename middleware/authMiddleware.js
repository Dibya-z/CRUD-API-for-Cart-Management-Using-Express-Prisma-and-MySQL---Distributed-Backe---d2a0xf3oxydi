const validAuthKye = "8a60348b-d4a4-564a-9b45-aab518adb7f4";

const authMiddleware = (req,res,next)=>{
    const apiKey = req.header("apiauthkey")
    if (!apiKey){
        return res.status(403).json({ "error": "apiauthkey is missing or invalid"})
    }
    if(apiKey != validAuthKye){
        return res.status(403).json({"error": "Failed to authenticate apiauthkey"})
    }

    next()
}
module.exports = authMiddleware;

