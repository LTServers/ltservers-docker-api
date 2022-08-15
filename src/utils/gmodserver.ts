export function formatExec(id: string) {
	const fid = parseInt(id);
	if (!fid) return null;
	return "./gmodserver" + (fid != 0 ? " - " + (fid + 1) : "");
}
