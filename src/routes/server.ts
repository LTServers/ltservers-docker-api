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

router.post("/new", authMiddleware, async (req, res) => {
	const { id, cl_port, sv_port, port } = req.body;

	LTDocker.create(id, sv_port, cl_port, port);

	res.json({ done: true, message: "Container is being created !" });
});

export default router;
