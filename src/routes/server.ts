import express from 'express';
import authMiddleware from './../middlewares/auth';
import LTDocker from './../utils/docker';

const router = express.Router();

router.get("/:serverid/start", authMiddleware, async (req, res) => {
	const exec = await LTDocker.exec(req.query.serverid as string, ["./gmodserver", "start"]);
	if (!exec) return res.status(500).send({ message: 'Error while sending command to docker !' });
	res.send({ exec, message: "Starting..." });
})

router.get("/:serverid/stop", authMiddleware, async (req, res) => {
	const exec = await LTDocker.exec(req.query.serverid as string, ["./gmodserver", "stop"]);
	if (!exec) return res.status(500).send({ message: 'Error while sending command to docker !' });
	res.send({ exec, message: "Stoping..." });
})

router.get("/:serverid/restart", authMiddleware, async (req, res) => {
	const exec = await LTDocker.exec(req.query.serverid as string, ["./gmodserver", "restart"]);
	if (!exec) return res.status(500).send({ message: 'Error while sending command to docker !' });
	res.send({ exec, message: "Restarting..." });
})

export default router;