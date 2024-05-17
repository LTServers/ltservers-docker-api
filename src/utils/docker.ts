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
		return new Promise<string[]>((resolve, reject) => {
			try {
				const container = this.getDocker().getContainer(containerId);
				void container
					.exec({ Cmd: cmds, AttachStdin: true, AttachStdout: true })
					.then((exec) => {
						exec.start({ hijack: true, stdin: true }, function (err, stream) {
							if (err) {
								reject(err);
							}

							if (!stream) return reject("No stream !");

							const datas: string[] = [];
							stream.on("data", (data: Buffer) => {
								datas.push(data.toString());
							});
							stream.on("end", () => {
								resolve(datas);
							});
						});
					});
			} catch (e) {
				reject(e);
			}
		});
	}

	public static async create(
		id: number,
		sv_port: string | number,
		cl_port: string | number,
		port: string | number,
	) {
		try {
			let exists = false;
			const containers = await this.getDocker().listContainers({ all: true });
			containers.forEach((container) => {
				if (container.Names[0] == "/gmodserver" + id) {
					exists = true;
				}
			});

			if (exists) return false;
		} catch (e) {
			console.log("Server creation error !", e);
			return false;
		}

		const container = await this.getDocker()
			.createContainer({
				// Image: "ghcr.io/gameservermanagers/linuxgsm-docker:latest",
				Image: "gameservermanagers/gameserver:gmod",
				name: "gmodserver" + id,
				ExposedPorts: {
					"27015/tcp": {},
					"27015/udp": {},
					"27020/udp": {},
					"27005/udp": {},
				},
				Volumes: {
					"/data": {},
				},
				HostConfig: {
					RestartPolicy: {
						Name: "unless-stopped",
					},
					Binds: [
						(process.env.GMODSERVER_DATA_PATH ?? "/data") + ":/data",
					],
					PortBindings: {
						"27015/tcp": [{ HostPort: "" + sv_port }],
						"27015/udp": [{ HostPort: "" + sv_port }],
						"27020/udp": [{ HostPort: "" + port }],
						"27005/udp": [{ HostPort: "" + cl_port }],
					},
				},
			}).catch((e) => {
				console.log("Error while creating container !", e);
				return false;
			});
		if (typeof container == "boolean") return false;

		await this.getDocker()
			.getNetwork("gmodnetwork")
			.connect({ Container: "gmodserver" + id });

		await container.start();
		// create fake execs to setup a unique config for this server
		// all the files are shared, so each server can't have its own config
		// usefull to set a unique server hostname, and then get it in gmod to identify the server
		for (let i = 0; i < id; i++) {
			await this.exec("gmodserver" + id, [
				"su",
				"linuxgsm",
				"&&",
				"touch",
				"gmodserver" + (i != 0 ? "-" + (i + 1) : ""),
			]);
		}

		return true;
	}
}
export default LTDocker;
