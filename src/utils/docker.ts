import Docker from 'dockerode';

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
		return new Promise(async (resolve, reject) => {
			try {
				const container = this.getDocker().getContainer(containerId);
				const exec = await container.exec({ Cmd: cmds });
				await exec.start({});
				resolve(true);
			} catch (e) {
				reject(e);
			}
		})
	}
}
export default LTDocker