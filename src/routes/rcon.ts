import { Router } from "express";
import authMiddleware from "./../middlewares/auth";
import LTRcon from "./../utils/rcon";

const router = Router();

router.post("/:serverport", authMiddleware, async (req, res) => {
	const { serverport } = req.params;
	if (!serverport)
		return res.status(400).send({ message: "No server port provided" });

	const { command } = req.body;
	if (!command) return res.status(400).send({ message: "No command provided" });

	const rcon = await LTRcon.getRcon(parseInt(serverport, 10));
	const rconRes = await rcon.send(command);
	res.json({ executed: true, message: rconRes });
});

export default router;
