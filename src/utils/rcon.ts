import { Rcon } from 'rcon-client';

class LTRcon {
	private static rcon: Rcon;

	private constructor() {
	}

	public static async getRcon() {
		if (!LTRcon.rcon) {
			LTRcon.rcon = await Rcon.connect({
				host: "localhost",
				port: 27015,
				password: "adminpbCrNPuZ"
			});
		}
		return LTRcon.rcon
	}
}
export default LTRcon;