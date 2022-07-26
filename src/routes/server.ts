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
	const { id } = req.body;

	if (!id)
		return res
			.status(400)
			.json({ valid: false, message: "Missing parameters !" });

	const sv_port = 27100 + id;
	const cl_port = 27000 + id;
	const port = 27200 + id;

	const did = await LTDocker.create(id, sv_port, cl_port, port);
	if (!did)
		return res.status(400).json({
			valid: false,
			message: "A container with the same id already exists !",
		});

	res.json({ done: true, message: "Container is being created !" });
});

export default router;
