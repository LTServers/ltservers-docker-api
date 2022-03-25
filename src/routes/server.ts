import express from "express";
import authMiddleware from "./../middlewares/auth";
import LTDocker from "./../utils/docker";

const router = express.Router();

router.get("/:serverip/connect", async (req, res) => {
	res.redirect(`steam://connect/${req.params.serverip}`);
});

router.get("/:serverid/start", authMiddleware, async (req, res) => {
	const executed = await LTDocker.exec(req.params.serverid as string, [
		"./gmodserver",
		"start",
	]);
	if (!executed)
		return res
			.status(500)
			.send({ message: "Error while sending command to docker !" });
	res.json({ executed, message: "Starting..." });
});

router.get("/:serverid/stop", authMiddleware, async (req, res) => {
	const executed = await LTDocker.exec(req.params.serverid as string, [
		"./gmodserver",
		"stop",
	]);
	if (!executed)
		return res
			.status(500)
			.send({ message: "Error while sending command to docker !" });
	res.json({ executed, message: "Stoping..." });
});

router.get("/:serverid/restart", authMiddleware, async (req, res) => {
	const executed = await LTDocker.exec(req.params.serverid as string, [
		"./gmodserver",
		"restart",
	]);
	if (!executed)
		return res
			.status(500)
			.send({ message: "Error while sending command to docker !" });
	res.json({ executed, message: "Restarting..." });
});

export default router;
