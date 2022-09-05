import { Router } from "express"
import { authentication } from "../../auth/authentication"
import { createAuthentication } from "../../auth/createAuthentication"

const router = Router()

// router.get<{}, IIndexResponse<IUser>, {}, IIndexQuery>('/',
//   async (request, response, next) => {

//     const authVerified = await authentication(request)

//     if(authVerified) {   
//       try {
//         const query = await Crud.Index<IUser>(request.query, 'user', ['id', 'first_name', 'last_name', 'email'])
//         response.json(query)
//       } catch (err) {
//         next(err)
//       }
//     } else {
//       next(new Error('Authentication failed'))
//     } 
//   }
// )

export const USER_ROUTES = router