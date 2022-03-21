import { Rcon } from "rcon-client";

class LTRcon {
	private static rcons: Rcon[] = [];

	public static async getRcon(port: number) {
		if (!LTRcon.rcons[port]) {
			LTRcon.rcons[port] = await Rcon.connect({
				host: "localhost",
				port,
				password: process.env.RCONPASSWORD,
			});
			LTRcon.rcons[port].on("end", () => {
				delete LTRcon.rcons[port];
			});
		}
		return LTRcon.rcons[port];
	}
}
export default LTRcon;
