import { Router } from 'express';
import authMiddleware from './../middlewares/auth';
import LTRcon from './../utils/rcon';

const router = Router();

router.post("/:servid", authMiddleware, async (req, res) => {
	const { command } = req.body;
	if (!command) return res.status(404).send({ message: "No command provided" });

	const rcon = await LTRcon.getRcon();
	const rconRes = await rcon.send(command);
	res.send({ executed: true, response: rconRes });
})

export default router;