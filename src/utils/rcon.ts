import { Rcon } from "rcon-client";

class LTRcon {
	private static rcons: Rcon[] = [];

	public static async getRcon(serverid: number) {
		if (!LTRcon.rcons[serverid]) {
			try {
				LTRcon.rcons[serverid] = await Rcon.connect({
					host: "gmodserver" + serverid, // need to docker network connect this container to the gmodserver network
					port: 27015,
					password: process.env.RCONPASSWORD ?? "",
				});
			} catch (e) {
				// @ts-expect-error Error handling
				console.log(e.code == "ECONNREFUSED" ? "Rcon server not running" : e);
				return null;
			}

			LTRcon.rcons[serverid].on("end", () => {
				delete LTRcon.rcons[serverid];
			});
		}
		return LTRcon.rcons[serverid];
	}
}
export default LTRcon;
