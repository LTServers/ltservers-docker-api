import Docker from "dockerode";
import DockerCompose from "dockerode-compose";

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

	public static async compose(file: string, name: string) {
		const compose = new DockerCompose(this.getDocker(), file, name);
		return await compose.up();
	}
}
export default LTDocker;
