export const teachings: Teaching[] = [
	{
		id: "1",
		coverPhoto: "evangelism-workshop-01-2026.jpg",
		date: "2026-01-04",
		title: "Evangelism Workshop - What is Evangelism?",
		description: "How does the bible define 'evangelism'?",
		videoUrl:
			"https://church-teachings.s3.us-east-2.amazonaws.com/1-2026+-+Evangelism+Workshop/1%3A4%3A26+-+What+is+Evangelism%3F+(Matthew+28%3A19%2C+2+Corinthians+5%3A17-19).mp4",
		series: "Evangelism Workshop",
		scripture: [
			{
				book: "Matthew",
				chapter: 28,
				verses: ["19"],
			},
			{
				book: "2 Corinthians",
				chapter: 5,
				verses: ["17", "18", "19"],
			},
		],
		topics: ["evangelism", "great commission", "reconciliation"],
		isFeatured: true,
	},
];

export type ScriptureReference = {
	book: string;
	chapter: number;
	verses?: string[];
};

export type Teaching = {
	id: string;
	coverPhoto: string;
	date: string;
	title: string;
	description: string;
	videoUrl: string;
	series?: string;
	scripture: ScriptureReference[];
	topics: string[];
	isFeatured: boolean;
};
