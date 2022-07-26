import Docker from "dockerode";
import * as compose from "docker-compose";
import path from "path";

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

	public static async compose(id: string | number) {
		// const compose = new DockerCompose(this.getDocker(), file, name);
		// return await compose.up();
		return await compose.upOne("linuxgsm" + id, {
			cwd: path.resolve(__dirname, "../include"),
		});
	}
}
export default LTDocker;
