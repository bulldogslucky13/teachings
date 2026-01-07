import { teachings } from "./teachings";

export async function getMostRecentTeaching() {
	return teachings.sort((a, b) => b.date.localeCompare(a.date))[0];
}
