// import { verify as jwtVerify } from 'jsonwebtoken';
// import httpStatus from 'http-status';
// import { JWT_SECRET } from '../../constants';

// export default (app) => async (req, res, next) => {
//   const token = req.headers.authorization ? req.headers.authorization.replace(/^Bearer /, '') : null;

//   if (token) {
//     try {
//       const payload = jwtVerify(token, JWT_SECRET);
//       const user = await app.service('UsersService').get(payload?._id);

//       if (!user) {
//         return next({ message: 'User not found', status: httpStatus.UNAUTHORIZED });
//       }
//       req.user = user.toJSON();
//     } catch (error) {
//       return next({
//         message: error.message || 'Error validating token',
//         status: httpStatus.UNAUTHORIZED,
//         stack: error.stack,
//       });
//     }
//   }
//   return next();
// };
