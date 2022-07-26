import express from "express";
import authMiddleware from "./../middlewares/auth";
import LTDocker from "./../utils/docker";
import { parseDockerCompose } from "../utils/compose";

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

	await parseDockerCompose(id, sv_port, cl_port, port);
	const container = await LTDocker.compose(
		"../../include/docker-compose.yml",
		"gmodserver" + id
	);
	if (!container)
		return res
			.status(500)
			.send({ message: "Error while creating container !" });

	res.json({ done: true, message: "Container created !" });
});

export default router;
