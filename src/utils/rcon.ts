import { Rcon } from 'rcon-client';

class LTRcon {
	private static rcons: Rcon[];

	private constructor() {
	}

	public static async getRcon(port: number) {
		if (!LTRcon.rcons[port]) {
			LTRcon.rcons[port] = await Rcon.connect({
				host: "localhost",
				port,
				password: process.env.RCONPASSWORD
			});
		}
		return LTRcon.rcons[port]
	}
}
export default LTRcon;