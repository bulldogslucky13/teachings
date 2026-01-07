export const teachings: Teaching[] = [
	{
		id: "1",
		coverPhoto: "evangelism-workshop-01-2026.jpg",
		date: "2026-01-04",
		title: "Evangelism Workshop - What is Evangelism?",
		description: "How does the bible define 'evangelism'?",
		videoUrl:
			"https://church-teachings.s3.us-east-2.amazonaws.com/1-2026+-+Evangelism+Workshop/1%3A4%3A26+-+What+is+Evangelism%3F+(Matthew+28%3A19%2C+2+Corinthians+5%3A17-19).mp4",
	},
];

export type Teaching = {
	id: string;
	coverPhoto: string;
	date: string;
	title: string;
	description: string;
	videoUrl: string;
};
