import { Request, Response, Router } from 'express';
import { BaseController } from '../interfaces/IBaseController';
import { UserService } from './user.service';

export class UserController extends BaseController {
	constructor(private readonly userService: UserService) {
		super();
	}

	routes(): Router {
		const router = Router();

		router.get('/', this.getUsers.bind(this));
		return router;
	}

	private async getUsers(req: Request, res: Response) {
		try {
			const users = await this.userService.getUsers();
			res.status(200).json({ users });
		} catch (error) {
			res.status(500).json({ error });
		}
	}
}
