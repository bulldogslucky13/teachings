"use server";

const teachings: Teaching[] = [
	{
		id: "1",
		date: "2025-11-09",
		title: "Romans 11:1-10",
		description: "",
		coverPhoto: "romans-11-series-11-2025.png",
		scripture: [
			{
				book: "Romans",
				chapter: 11,
				verses: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
				referenceType: "featured",
			},
			{
				book: "1 Kings",
				chapter: 19,
				verses: [
					"1",
					"2",
					"3",
					"4",
					"5",
					"6",
					"7",
					"8",
					"9",
					"10",
					"11",
					"12",
					"13",
					"14",
					"15",
					"16",
					"17",
					"18",
				],
				referenceType: "featured",
			},
			{ book: "Romans", chapter: 10, verses: ["31"], referenceType: "cross-referenced" },
			{ book: "Jeremiah", chapter: 31, verses: ["31"], referenceType: "cross-referenced" },
		],
		topics: ["remnant israel", "ethnic israel", "foreknowledge", "election", "predestination"],
		videoUrl: "https://www.youtube.com/embed/g5SxuRgVn9Y",
		notesUrl:
			"https://schtowkzjmfht9nx.public.blob.vercel-storage.com/teaching-notes/romans-11-1-10_notes.pdf",
		series: "Merge - Romans 11",
		nextInSeries: "2",
	},
	{
		id: "2",
		date: "2025-11-16",
		title: "Romans 11:11-22",
		description: "",
		coverPhoto: "romans-11-series-11-2025.png",
		scripture: [
			{
				book: "Romans",
				chapter: 11,
				verses: ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22"],
				referenceType: "featured",
			},
			{ book: "Romans", chapter: 9, verses: ["32", "33"], referenceType: "cross-referenced" },
			{
				book: "Ezekiel",
				chapter: 36,
				verses: ["22", "23", "24", "25", "26", "27", "28", "29", "30"],
				referenceType: "featured",
			},
			{ book: "Zechariah", chapter: 12, verses: ["10"], referenceType: "cross-referenced" },
			{ book: "Zechariah", chapter: 14, verses: ["9", "16"], referenceType: "cross-referenced" },
		],
		topics: [
			"israel",
			"future plan for israel",
			"fullness of the Gentiles",
			"israel's partial hardening",
			"millenial kingdom",
			"olive tree",
			"olive branches",
			"purpose for israel today",
		],
		videoUrl: "https://www.youtube.com/embed/1O9aeQa5rL8",
		notesUrl:
			"https://schtowkzjmfht9nx.public.blob.vercel-storage.com/teaching-notes/romans-11-11-22_notes.pdf",
		series: "Merge - Romans 11",
		nextInSeries: "3",
	},
	{
		id: "3",
		date: "2025-11-30",
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
				referenceType: "featured",
			},
			{ book: "Zechariah", chapter: 12, verses: ["10"], referenceType: "cross-referenced" },
			{
				book: "2 Samuel",
				chapter: 7,
				verses: ["10", "11", "12", "13"],
				referenceType: "cross-referenced",
			},
			{
				book: "Jeremiah",
				chapter: 31,
				verses: ["31", "32", "33", "34"],
				referenceType: "featured",
			},
			{
				book: "Ezekiel",
				chapter: 20,
				verses: ["33", "34", "35", "36", "37", "38"],
				referenceType: "featured",
			},
			{ book: "Revelation", chapter: 7, verses: ["2", "3", "4"], referenceType: "featured" },
		],
		topics: [
			"israel",
			"future plan for israel",
			"national israel",
			"the church",
			"grafted in",
			"partial hardening",
			"mercy",
			"glory of God",
		],
		videoUrl: "https://www.youtube.com/embed/EUdHZzqBRdU",
		notesUrl:
			"https://schtowkzjmfht9nx.public.blob.vercel-storage.com/teaching-notes/romans-11-23-36_notes.pdf",
		series: "Merge - Romans 11",
	},
	{
		id: "4",
		date: "2026-01-04",
		title: "What is Evangelism?",
		description: "How does the bible define 'evangelism'?",
		coverPhoto: "evangelism-workshop-01-2026.jpg",
		videoUrl:
			"https://church-teachings.s3.us-east-2.amazonaws.com/1-2026+-+Evangelism+Workshop/1%3A4%3A26+-+What+is+Evangelism%3F+(Matthew+28%3A19%2C+2+Corinthians+5%3A17-19).mp4",
		notesUrl:
			"https://schtowkzjmfht9nx.public.blob.vercel-storage.com/teaching-notes/1-4-26_evangelism-workshop_what-is-evangelism_notes.pdf",
		series: "Evangelism Workshop",
		scripture: [
			{
				book: "Matthew",
				chapter: 28,
				verses: ["19"],
				referenceType: "featured",
			},
			{
				book: "2 Corinthians",
				chapter: 5,
				verses: ["17", "18", "19"],
				referenceType: "featured",
			},
		],
		topics: ["evangelism", "great commission", "reconciliation"],
		nextInSeries: "5",
	},
	{
		id: "5",
		date: "2026-01-11",
		title: "Motivations for Evangelism",
		description: "What does the Bible say should motivate us to evangelize?",
		coverPhoto: "evangelism-workshop-01-2026.jpg",
		videoUrl: "https://youtu.be/VIs1WgLUdAI",
		notesUrl:
			"https://schtowkzjmfht9nx.public.blob.vercel-storage.com/teaching-notes/1-11-26_why_evangelize_notes.pdf",
		series: "Evangelism Workshop",
		scripture: [
			{
				book: "Matthew",
				chapter: 28,
				verses: ["16", "17"],
				referenceType: "featured",
			},
			{
				book: "Revelation",
				chapter: 10,
				verses: ["8", "9", "10", "11"],
				referenceType: "featured",
			},
			{
				book: "Isaiah",
				chapter: 6,
				verses: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
				referenceType: "featured",
			},
			{ book: "John", chapter: 3, verses: ["16", "18"], referenceType: "cross-referenced" },
			{
				book: "2 Corinthians",
				chapter: 10,
				verses: ["20", "21"],
				referenceType: "cross-referenced",
			},
		],
		topics: [
			"evangelism",
			"great commission",
			"biblical motivations",
			"wrath of God",
			"grace of God",
		],
		isFeatured: true,
	},
];

export type ScriptureReference = {
	book: string;
	chapter: number;
	verses?: string[];
	/**
	 * 'featured' = primary scripture for the teaching (displayed to users)
	 * 'cross-referenced' = supplementary passages mentioned but not central to the teaching (hidden from display)
	 */
	referenceType: "featured" | "cross-referenced";
};

export type Teaching = {
	id: string;
	coverPhoto: string;
	date: string;
	title: string;
	description: string;
	videoUrl: string;
	notesUrl?: string;
	series?: string;
	scripture: ScriptureReference[];
	topics: string[];
	isFeatured?: boolean;
	nextInSeries?: string;
};

export async function getAllTeachings(): Promise<Teaching[]> {
	return teachings;
}
