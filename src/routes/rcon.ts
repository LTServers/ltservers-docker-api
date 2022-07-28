import { Router } from "express";
import authMiddleware from "./../middlewares/auth";
import LTRcon from "./../utils/rcon";

const router = Router();

router.post("/:serverport", authMiddleware, async (req, res) => {
	const { serverport } = req.params;
	if (!serverport)
		return res
			.status(400)
			.json({ executed: false, message: "No server port provided" });

	const { command } = req.body;
	if (!command)
		return res
			.status(400)
			.json({ executed: false, message: "No command provided" });

	const rcon = await LTRcon.getRcon(parseInt(serverport, 10));
	if (!rcon)
		return res
			.status(404)
			.json({ executed: false, message: "Rcon server not running" });

	const rconRes = await rcon.send(command);
	res.json({ executed: true, message: rconRes });
});

export default router;
