import jwt from "jsonwebtoken";
import { User } from "../mongodb/models/index.js";

const requireAuth = async (req, res, next) => {
  //verify user is authenticated
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token in Bearer format required.' });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findOne({ _id }).select('_id');

    if (!user) {
      return res.status(401).json({ error: 'User not found.' });
    } else {
      req.userId = user._id;
    }
    // const isCustomAuth = token.length < 500;

    // let decodedData;

    // if (token && isCustomAuth) {
    //   decodedData = jwt.verify(token, secret);

    //   req.userId = decodedData?.id;
    // } else {
    //   decodedData = jwt.decode(token);

    //   req.userId = decodedData?.sub;
    // }

    next();
  } catch (error) {
    console.log(error)

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token.' });
    }

    return res.status(401).json({ error: 'Request is not authorized.' })
  }
};

export default requireAuth;
