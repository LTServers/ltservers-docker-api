import express from "express";
import authMiddleware from "./../middlewares/auth";
import LTDocker from "./../utils/docker";
import LTRcon from "./../utils/rcon";
import { formatExec } from "./../utils/gmodserver";

const router = express.Router();

router.get("/:serverip/connect", async (req, res) => {
	res.redirect(`steam://connect/${req.params.serverip}`);
});

router.get("/:serverid/start", authMiddleware, async (req, res) => {
	const { serverid } = req.params;
	const executed = await LTDocker.exec(("gmodserver" + serverid) as string, [
		formatExec(serverid),
		"start",
	]);
	if (!executed)
		return res
			.status(500)
			.send({ message: "Error while sending command to docker !" });
	res.json({ executed, message: "Starting..." });
});

router.get("/:serverid/stop", authMiddleware, async (req, res) => {
	const { serverid } = req.params;
	const executed = await LTDocker.exec(("gmodserver" + serverid) as string, [
		formatExec(serverid),
		"stop",
	]);
	if (!executed)
		return res
			.status(500)
			.send({ message: "Error while sending command to docker !" });
	res.json({ executed, message: "Stoping..." });
});

router.get("/:serverid/restart", authMiddleware, async (req, res) => {
	const { serverid } = req.params;
	const executed = await LTDocker.exec(("gmodserver" + serverid) as string, [
		formatExec(serverid),
		"restart",
	]);
	if (!executed)
		return res
			.status(500)
			.send({ message: "Error while sending command to docker !" });
	res.json({ executed, message: "Restarting..." });
});

router.post("/:serverid/rcon", authMiddleware, async (req, res) => {
	const { serverid } = req.params;
	if (!serverid)
		return res
			.status(400)
			.json({ executed: false, message: "No server id provided" });

	const { command } = req.body;
	if (!command)
		return res
			.status(400)
			.json({ executed: false, message: "No command provided" });

	const rcon = await LTRcon.getRcon(parseInt(serverid));
	if (!rcon)
		return res
			.status(404)
			.json({ executed: false, message: "Rcon server not running" });

	const rconRes = await rcon.send(command);
	res.json({ executed: true, message: rconRes });
});

router.post("/new", authMiddleware, async (req, res) => {
	const { id: bid } = req.body;

	if (!bid)
		return res
			.status(400)
			.json({ valid: false, message: "Missing 'id' in body !" });

	const id = parseInt(bid);
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
