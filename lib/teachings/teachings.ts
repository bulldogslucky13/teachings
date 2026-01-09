export const teachings: Teaching[] = [
	{
		id: "1",
		date: "11-9-2025",
		title: "Romans 11:1-10",
		description: "",
		coverPhoto: "romans-11-series-11-2025.png",
		scripture: [
			{ book: "Romans", chapter: 11, verses: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"] },
		],
		topics: ["israel", "remnant israel"],
		videoUrl: "https://www.youtube.com/embed/g5SxuRgVn9Y",
		series: "Merge - Romans 11",
	},
	{
		id: "2",
		date: "11-16-2025",
		title: "Romans 11:11-22",
		description: "",
		coverPhoto: "romans-11-series-11-2025.png",
		scripture: [
			{
				book: "Romans",
				chapter: 11,
				verses: ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"],
			},
		],
		topics: [
			"israel",
			"future plan for israel",
			"olive tree",
			"olive branches",
			"purpose for israel today",
		],
		videoUrl: "https://www.youtube.com/embed/1O9aeQa5rL8",
		series: "Merge - Romans 11",
	},
	{
		id: "3",
		date: "11-30-2025",
		title: "Romans 11:23-36",
		description: "",
		coverPhoto: "romans-11-series-11-2025.png",
		scripture: [
			{
				book: "Romans",
				chapter: 11,
				verses: [
					"23",
					"24",
					"25",
					"26",
					"27",
					"28",
					"29",
					"30",
					"31",
					"32",
					"33",
					"34",
					"35",
					"36",
				],
			},
		],
		topics: ["israel", "future plan for israel", "grafted in", "partial hardening", "mercy"],
		videoUrl: "https://www.youtube.com/embed/EUdHZzqBRdU",
		series: "Merge - Romans 11",
	},
	{
		id: "4",
		date: "2026-01-04",
		title: "Evangelism Workshop - What is Evangelism?",
		description: "How does the bible define 'evangelism'?",
		coverPhoto: "evangelism-workshop-01-2026.jpg",
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
	isFeatured?: boolean;
};
