import fs from "node:fs";
import path from "node:path";

export function* listupFixtures(rootDir) {
	for (const filename of fs.readdirSync(rootDir)) {
		const filepath = path.join(rootDir, filename);
		if (fs.statSync(filepath).isDirectory()) {
			for (const { filepath: childFilepath, content } of listupFixtures(
				filepath,
			)) {
				yield {
					filename: childFilepath.slice(rootDir.length),
					filepath: childFilepath,
					content,
				};
			}
		} else {
			yield {
				filename,
				filepath,
				content: fs.readFileSync(filepath, "utf-8"),
			};
		}
	}
}
