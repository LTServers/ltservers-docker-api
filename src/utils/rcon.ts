import { Rcon } from "rcon-client";

class LTRcon {
	private static rcons: Rcon[] = [];

	public static async getRcon(port: number) {
		if (!LTRcon.rcons[port]) {
			try {
				LTRcon.rcons[port] = await Rcon.connect({
					host: process.env.IPADDRESS,
					port,
					password: process.env.RCONPASSWORD,
				});
			} catch (e) {
				console.log(e.code == "ECONNREFUSED" ? "Rcon server not running" : e);
				return null;
			}

			LTRcon.rcons[port].on("end", () => {
				delete LTRcon.rcons[port];
			});
		}
		return LTRcon.rcons[port];
	}
}
export default LTRcon;
