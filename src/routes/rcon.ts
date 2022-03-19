import { Router } from 'express';
import authMiddleware from './../middlewares/auth';
import LTRcon from './../utils/rcon';

const router = Router();

router.post("/:serverport", authMiddleware, async (req, res) => {
	const { command } = req.body;
	if (!command) return res.status(404).send({ message: "No command provided" });

	const { serverport } = req.params;
	if (!serverport) return res.status(404).send({ message: "No server port provided" });

	const rcon = await LTRcon.getRcon(parseInt(serverport, 10));
	const rconRes = await rcon.send(command);
	res.send({ executed: true, response: rconRes });
})

export default router;