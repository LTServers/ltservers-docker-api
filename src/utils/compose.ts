import * as fs from "fs/promises";

/*
 * sv_port: 27015
 * cl_port: 27005
 * port: 27020
 */
export async function parseDockerCompose(
	id: string | number,
	sv_port: string | number,
	cl_port: string | number,
	port: string | number
) {
	const file = await fs.readFile(
		"../../include/docker-compose-template.yml",
		"utf8"
	);
	let finalFile = file.replace(/\$\{id\}/g, "" + id);
	finalFile = file.replace(/\$\{sv_port\}/g, "" + sv_port);
	finalFile = file.replace(/\$\{cl_port\}/g, "" + cl_port);
	finalFile = file.replace(/\$\{port\}/g, "" + port);

	await fs.writeFile("../../include/docker-compose.yml", finalFile);
}
