import Docker from "dockerode";

class LTDocker {
	private static docker: Docker;

	public static getDocker() {
		if (!LTDocker.docker) {
			LTDocker.docker = new Docker({
				socketPath: "/var/run/docker.sock",
			});
		}
		return LTDocker.docker;
	}

	public static exec(containerId: string, cmds: string[]) {
		return new Promise((resolve, reject) => {
			try {
				const container = this.getDocker().getContainer(containerId);
				container.exec({ Cmd: cmds }).then(async (exec) => {
					await exec.start({});
					resolve(true);
				});
			} catch (e) {
				reject(e);
			}
		});
	}

	public static async create(
		id: string | number,
		sv_port: string | number,
		cl_port: string | number,
		port: string | number
	) {
		let exists = false;
		const containers = await this.getDocker().listContainers({ all: true });
		containers.forEach((container) => {
			if (container.Names[0] == "/gmodserver" + id) {
				exists = true;
			}
		});

		if (exists) return false;

		this.getDocker()
			.createContainer({
				Image: "ghcr.io/gameservermanagers/linuxgsm-docker:latest",
				name: "gmodserver" + id,
				Env: [
					"GAMESERVER=gmodserver",
					"LGSM_GITHUBUSER=GameServerManagers",
					"LGSM_GITHUBREPO=LinuxGSM",
					"LGSM_GITHUBBRANCH=master",
				],
				ExposedPorts: {
					"27015/tcp": {},
					"27015/udp": {},
					"27020/udp": {},
					"27005/udp": {},
				},
				Volumes: {
					"/home/linuxgsm/serverfiles": {},
					"/home/linuxgsm/log": {},
					"/home/linuxgsm/lgsm/config-lgsm": {},
				},
				HostConfig: {
					Binds: [
						"/home/gmodserver/gmodserver-docker/serverfiles:/home/linuxgsm/serverfiles",
						"/home/gmodserver/gmodserver-docker/log:/home/linuxgsm/log",
						"/home/gmodserver/gmodserver-docker/config-lgsm:/home/linuxgsm/lgsm/config-lgsm",
					],
					PortBindings: {
						"27015/tcp": [{ HostPort: sv_port }],
						"27015/udp": [{ HostPort: sv_port }],
						"27020/udp": [{ HostPort: port }],
						"27005/udp": [{ HostPort: cl_port }],
					},
				},
			})
			.then((container) => {
				container.start();
			})
			.catch(console.log);

		return true;
	}
}
export default LTDocker;
