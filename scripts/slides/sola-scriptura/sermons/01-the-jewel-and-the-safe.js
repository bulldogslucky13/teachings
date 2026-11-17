// Case Study 01 — The Jewel & The Safe. Follows the 11/8/26 teaching transcript:
//   I.  The Safe (sola Scriptura; 2 Timothy 3:16–17)
//   II. The Jewel (sola fide; Ephesians 2:8–10)
// Each part still runs question → evidence → conclusion: the divider asks the
// question, Scripture carries the evidence, a conclusion slide closes it.

const SERIES = require("../series");

const plan = SERIES.find((s) => s.number === "01");

const SAFE = 1;
const JEWEL = 2;

module.exports = {
	number: "01",
	// Taught before decks became simple by default; kept as it was shown.
	simple: false,
	movements: [
		{ numeral: "I", label: "THE SAFE", divider: "THE SAFE  ·  SOLA SCRIPTURA" },
		{ numeral: "II", label: "THE JEWEL", divider: "THE JEWEL  ·  SOLA FIDE" },
	],

	build(deck) {
		deck.section("Opening");
		deck.cover();
		deck.sermonTitle(plan);
		deck.statement({
			kicker: "THE MOST IMPORTANT QUESTION",
			text: "What must I do in order to be saved?",
			support: "There is no more important question you and I will ever answer.",
		});
		deck.quote({
			kicker: "THE JEWEL AND THE SAFE",
			text: "The way I like to put it is that sola fide is the “what” of the Reformation; sola Scriptura, the “how.” The first is an object, the second a method. The first is a *precious jewel*; the second, *the safe that protects it*.",
			attribution: "Gavin Ortlund",
			source: "What It Means to Be Protestant",
		});
		deck.outline({
			parts: [
				{ label: "SOLA SCRIPTURA", head: "The Safe", body: "The “how”: a method that protects the gospel.", ref: "2 Timothy 3:16–17" },
				{ label: "SOLA FIDE", head: "The Jewel", body: "The “what”: the gospel itself.", ref: "Ephesians 2:8–10" },
			],
		});

		deck.section("I · The Safe");
		deck.movement(SAFE, "Is Scripture alone enough to make us complete?");
		deck.quote({
			movement: SAFE,
			kicker: "A DEFINITION",
			text: "Henceforth, [the reformers] established the position of sola Scriptura (“Scripture alone”), meaning that *Scripture is our only ultimate authority for faith and practice*. This doesn’t mean that the Bible is the only place where truth is found, but it does mean that everything else we learn about God and his world, and all other authorities, are subordinate to the Scriptures. *The Scriptures are the sole necessary and sufficient source of our theology*.",
			attribution: "Justin S. Holcomb",
			source: "Know the Creeds and Councils  ·  2014  ·  p. 102",
			footnote: "We’ll test this definition against the Scriptures — then come back to it.",
		});
		deck.scripture({
			movement: SAFE,
			book: "2 Timothy",
			verses: "3:16–17",
			text: "All Scripture is *breathed out by God* and profitable for teaching, for reproof, for correction, and for training in righteousness, that the man of God may be *complete*, equipped for every good work.",
		});
		deck.phrase({
			movement: SAFE,
			ref: "2 Timothy 3:17",
			phrase: "complete",
			gloss: "To make perfect",
			body: ["The Bible has in it the ability to perfect the Christian.", "Written about pastors — but a principle for all of us."],
			verse: "All Scripture is breathed out by God and profitable for teaching, for reproof, for correction, and for training in righteousness, that the man of God may be *complete*, equipped for every good work.",
			verseRef: "2 Timothy 3:16–17",
		});
		deck.scripture({
			movement: SAFE,
			kicker: "THE WORD OF GOD  ·  THE SAME PRINCIPLE, FOR ALL OF US",
			book: "2 Corinthians",
			verses: "3:18",
			text: "And we all, with unveiled face, beholding the glory of the Lord, *are being transformed into the same image* from one degree of glory to another. For this comes from the Lord who is the Spirit.",
		});
		deck.scripture({
			movement: SAFE,
			kicker: "THE WORD OF GOD  ·  THE NEW COVENANT PROMISE",
			book: "Ezekiel",
			verses: "36:27",
			text: "And I will put my Spirit within you, and *cause you to walk in my statutes* and be careful to obey my *rules*.",
		});
		deck.statement({
			movement: SAFE,
			kicker: "THE TESTIMONY OF SCRIPTURE",
			text: "The Bible, empowered by God the Holy Spirit, transforms us into Christ’s image. *It perfects us.*",
			ref: "2 Timothy 3:17  ·  2 Corinthians 3:18  ·  Ezekiel 36:27",
		});
		deck.compare({
			movement: SAFE,
			title: "Is anything else needed?",
			columns: [
				{
					label: "ANOTHER WAY TO COME TO GOD",
					head: "Any way but faith in Jesus Christ",
					body: ["If it were true, it would be in the book that perfects you", "It isn’t — so it’s wrong"],
				},
				{
					label: "SOMETHING ADDED",
					head: "Anything more to be made like God",
					body: ["If we needed it, it would be in the book", "It isn’t — so it’s wrong"],
				},
			],
		});
		deck.definition({
			movement: SAFE,
			title: "Back to our definition",
			statement: "Scripture is our only ultimate authority for faith and practice. The Scriptures are the sole necessary and sufficient source of our theology.",
			source: "Justin S. Holcomb",
			clarification: "This comes directly out of the Bible itself: it claims to be the very breathed-out Word of God, able to perfect you and me today.",
			marks: [
				{ label: "Inspired", ref: "2 Timothy 3:16", body: "Breathed out by God." },
				{ label: "Perfecting", ref: "2 Timothy 3:17", body: "Able to make the believer complete." },
				{ label: "Transforming", ref: "2 Corinthians 3:18", body: "By the Spirit, we behold Christ and become like him." },
				{ label: "Empowering", ref: "Ezekiel 36:27", body: "The Spirit causes us to walk in God’s Word." },
			],
		});
		deck.quote({
			movement: SAFE,
			kicker: "THE CONTEXT  ·  COUNCIL OF TRENT, 1546",
			text: "Trent ruled that Scripture and tradition were to be *given equal weight* in determining what Christians ought to believe. The council decided that in addition to the Scriptures stood “also the traditions, whether they relate to faith or to morals, as having been dictated either orally by Christ or by the Holy Ghost, and preserved in the Catholic Church in unbroken succession.” This is in contrast to the Protestants, who wanted to give *the final and arbitrating authority to the Scriptures alone*.",
			attribution: "Justin S. Holcomb",
			source: "Know the Creeds and Councils  ·  2014  ·  p. 102",
			footnote: "Sola Scriptura: not Scripture without tradition, but tradition under Scripture.",
		});
		deck.compare({
			movement: SAFE,
			title: "The Reformers kept the creeds",
			columns: [
				{ label: "1529", head: "Luther’s Small & Large Catechisms", body: ["Expound the Apostles’ Creed", "Show it is taught by Scripture"] },
				{ label: "1542", head: "Calvin’s Geneva Catechism", body: ["Expounds the Apostles’ Creed", "Shows it is taught by Scripture"] },
				{ label: "1563", head: "The Heidelberg Catechism", body: ["Expounds the Apostles’ Creed", "Proves each article from Scripture"] },
			],
			footnote: "Not anti-tradition: reforming to the faith “once for all delivered to the saints” (Jude 3)",
		});
		deck.statement({
			movement: SAFE,
			kicker: "SOLA, NOT SOLO",
			text: "Sol*a* Scriptura is not sol*o* scriptura.",
			emphasis: { bold: true, underline: { style: "sng" } },
			support: "Scripture alone is our ultimate authority for faith and practice — not our only resource.",
		});
		deck.compare({
			movement: SAFE,
			title: "Tradition, under Scripture",
			columns: [
				{
					label: "WHERE IT ALIGNS WITH SCRIPTURE",
					head: "Embrace it",
					body: ["Pastors and elders who faithfully teach the Bible", "Study Bibles that faithfully explain it", "Tradition that faithfully embraces it"],
					foot: "Good to go!",
					highlight: true,
				},
				{
					label: "WHERE IT CONTRADICTS OR ADDS",
					head: "Reject it",
					body: ["At best: unnecessary for becoming like Jesus", "At worst: legalistic distractions from what makes us like Christ"],
					foot: "On the authority of Scripture alone",
				},
			],
		});
		deck.conclusion({
			movement: SAFE,
			kicker: "THE SAFE",
			statement: "We must uphold sola Scriptura to defend sola fide. We must defend the safe to protect the jewel.",
			groundedIn: ["2 Timothy 3:16–17", "2 Corinthians 3:18", "Ezekiel 36:27"],
			methodLabel: "WHY IT MATTERS",
			method: "Through church history, churches that moved away from sola Scriptura wandered from the gospel.",
		});
		deck.discussion({
			label: "DISCUSSION  ·  THE SAFE",
			questions: [
				"Re-read 2 Timothy 3:16–17. How important is Scripture in growing in godliness, according to Paul? Share a time when you have been sanctified through the power of Scripture (e.g., on your own, through a discipler, by a sermon).",
				{
					text: "In your own words, come to a group agreement on a biblical definition of sola Scriptura.",
					sub: ["How would you explain the importance of affirming the doctrine of sola Scriptura?"],
				},
			],
		});

		deck.section("II · The Jewel");
		deck.movement(JEWEL, "How can we be saved?");
		deck.scripture({
			movement: JEWEL,
			book: "Ephesians",
			verses: "2:8–10",
			text: "For *by grace* you have been saved *through faith*. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast. For we are his workmanship, created in Christ Jesus for good works, which God prepared beforehand, that we should walk in them.",
		});
		deck.compare({
			movement: JEWEL,
			title: "“But God”",
			columns: [
				{
					label: "EPHESIANS 2:1–3",
					head: "By nature, children of wrath",
					body: ["Dead in trespasses and sins", "Every one of us has sinned", "Owed only the wrath of God"],
				},
				{
					label: "EPHESIANS 2:4–7",
					head: "Now, children of God",
					body: ["Rich in mercy, out of great love", "Made alive together with Christ", "Raised and seated with him"],
					highlight: true,
				},
			],
		});
		const eph289 = (emph) =>
			`For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not a result of works, so that no one may boast.`.replace(emph, `*${emph}*`);
		deck.phrase({
			movement: JEWEL,
			ref: "Ephesians 2:8",
			phrase: "by grace",
			gloss: "Unmerited favor",
			body: ["Not because of anything in ourselves — by nature, we are children of wrath.", "Totally unearned. Given by a loving, gracious God."],
			verse: eph289("by grace"),
			verseRef: "Ephesians 2:8–9",
		});
		deck.phrase({
			movement: JEWEL,
			ref: "Ephesians 2:8",
			phrase: "through faith",
			gloss: "Trust, confidence, belief",
			body: ["Not just knowing the gospel is true — that’s knowledge.", "Faith trusts Jesus Christ alone to save you."],
			verse: eph289("through faith"),
			verseRef: "Ephesians 2:8–9",
		});
		deck.phrase({
			movement: JEWEL,
			ref: "Ephesians 2:8–9",
			phrase: "not your own doing",
			glossLabel: "PAUL SETS FAITH AGAINST",
			gloss: "Works: “not a result of works”",
			body: ["Every other religion: do something to earn God’s favor.", "The gospel: you cannot do enough — and he knows that."],
			verse: eph289("not your own doing").replace("not a result of works", "*not a result of works*"),
			verseRef: "Ephesians 2:8–9",
		});
		deck.scripture({
			movement: JEWEL,
			kicker: "THE WORD OF GOD  ·  CORROBORATING TEXT",
			book: "Romans",
			verses: "3:28",
			text: "For we hold that one is *justified by faith* apart from works of the law.",
		});
		deck.scripture({
			movement: JEWEL,
			kicker: "THE WORD OF GOD  ·  CORROBORATING TEXT",
			book: "Galatians",
			verses: "2:16",
			text: "yet we know that a person is not justified by works of the law but *through faith in Jesus Christ*, so we also have believed in Christ Jesus, in order to be *justified by faith in Christ* and not by works of the law, because by works of the law no one will be justified.",
		});
		deck.statement({
			movement: JEWEL,
			kicker: "THE TEACHING OF SCRIPTURE",
			text: "We are saved — justified — by faith, *not works*.",
			support: "Faith, and trying to appease God by our own works, are contradictory in Scripture.",
			ref: "Ephesians 2:8–9  ·  Romans 3:28  ·  Galatians 2:16",
		});
		deck.phrase({
			movement: JEWEL,
			ref: "Ephesians 2:8",
			phrase: "you have been saved",
			glossLabel: "IN THE GREEK",
			gloss: "The perfect tense",
			body: ["Began in the past, when we believed — and its effect continues today.", "“You have been saved, and remain in a saved condition.”"],
			verse: eph289("you have been saved"),
			verseRef: "Ephesians 2:8–9",
			notes: "Easy to miss in English: “saved” is in the perfect tense. Salvation is a completed event. It happened at a point in the past (when we believed), and we remain in that state to this day. That’s the doctrine of justification.",
		});
		deck.compare({
			movement: JEWEL,
			title: "Justification and sanctification",
			columns: [
				{
					label: "JUSTIFICATION",
					head: "A completed event",
					body: ["Once, at the moment we believe", "A state we remain in until we go home to be with the Lord"],
					foot: "“You have been saved”",
					highlight: true,
				},
				{
					label: "SANCTIFICATION",
					head: "A lifelong process",
					body: ["Becoming more like Christ", "What we do for the rest of our lives"],
				},
			],
		});
		deck.scripture({
			movement: JEWEL,
			book: "Ephesians",
			verses: "2:10",
			text: "For we are his workmanship, created in Christ Jesus *for good works*, which God prepared beforehand, that we should walk in them.",
		});
		deck.quote({
			movement: JEWEL,
			kicker: "JOHN CALVIN  ·  ANTIDOTE TO THE COUNCIL OF TRENT",
			text: "It is therefore [faith alone which justifies]^1, and yet [the faith which justifies is not alone]^2",
			attribution: "John Calvin",
			source: "Acts of the Council of Trent with the Antidote  ·  1547",
			normedBy: ["Eph 2:8–9", "Eph 2:10"],
		});
		deck.conclusion({
			movement: JEWEL,
			kicker: "THE JEWEL",
			statement: "The Bible teaches that good works are the *result* of our salvation, not the *means* of it.",
			emphasis: { underline: { style: "sng" } },
			groundedIn: ["Ephesians 2:8–10", "Romans 3:28", "Galatians 2:16"],
			methodLabel: "THE CORE OF THE REFORMATION",
			method: "Salvation by faith alone is the core of the gospel of Jesus Christ.",
		});

		deck.section("II · Why It Matters");
		deck.compare({
			movement: JEWEL,
			title: "Two answers to one question",
			columns: [
				{
					label: "ROME  ·  COUNCIL OF TRENT, 1547",
					head: "Faith and works",
					body: ["Works cooperate in justification", "Tradition equal to Scripture"],
					foot: "Authority: Scripture, Tradition, Magisterium",
				},
				{
					label: "THE REFORMATION",
					head: "Faith alone",
					body: ["Works are fruit, not root", "Scripture the ultimate authority"],
					foot: "Authority: Scripture alone",
					highlight: true,
				},
			],
		});
		deck.scripture({
			movement: JEWEL,
			kicker: "THE WORD OF GOD  ·  ANSWERING FALSE TEACHING",
			book: "Jude",
			verses: "22–23",
			text: "And *have mercy* on those who doubt; *save others* by snatching them out of the fire; to others *show mercy with fear*, hating even the garment stained by the flesh.",
		});
		deck.cards({
			movement: JEWEL,
			title: "Three groups to reach",
			items: [
				{ label: "THOSE WHO DOUBT", head: "Have mercy", body: "Dabbling with a false gospel, but not yet converted to it.", ref: "Jude 22" },
				{ label: "THOSE IN THE FIRE", head: "Snatch them", body: "Trapped in false teaching, and perishing.", ref: "Jude 23a" },
				{ label: "THE FALSE TEACHERS", head: "With fear", body: "Convincing and logical. They may even quote the Bible.", ref: "Jude 23b" },
			],
		});
		deck.statement({
			movement: JEWEL,
			kicker: "IN CONVERSATION",
			text: "“What does that mean to you?”",
			support: "Many don’t believe what their church officially teaches. Find out how they believe we are saved, and keep the conversation on the gospel.",
		});
		deck.interlude({
			movement: JEWEL,
			kicker: "WE’VE SEEN WHAT THE BIBLE TEACHES",
			title: "What do these churches teach?",
			items: [
				{ label: "ROMAN CATHOLICISM", head: "The Council of Trent", detail: "Convened 1545, in response to the Reformation" },
				{ label: "EASTERN ORTHODOXY", head: "The Confession of Dositheus", detail: "Synod of Jerusalem, 1672" },
			],
			notes: "We’ve seen what the Bible teaches on salvation — sola fide. Now let’s see what these churches teach, in their own words.",
		});
		deck.quote({
			movement: JEWEL,
			kicker: "COUNCIL OF TRENT  ·  SESSION VI, CANON 9  ·  STILL BINDING",
			text: "If any one saith, that by faith alone the impious [an unbeliever] is justified; in such wise as to mean, that *nothing else is required to cooperate in order to the obtaining the grace of justification*, and that it is not in any way necessary, that he be prepared and disposed by the movement of his own will; *let him be anathema*.",
			attribution: "Council of Trent",
			source: "1547  ·  trans. J. Waterworth",
			contradictedBy: ["Eph 2:8–9", "Rom 3:28", "Rom 11:6"],
			notes: "Anathema: cut off. If you believe salvation is by grace alone through faith alone apart from works, Trent says you are damned. Trent’s decrees have never been superseded: tradition is not corrected by Scripture; it is held equal to it.",
		});
		deck.quote({
			movement: JEWEL,
			kicker: "CONFESSION OF DOSITHEUS  ·  STILL GOVERNING",
			text: "We believe a man to be not simply justified through faith alone, but through faith which works through love, that is to say, *through faith and works*.",
			attribution: "Synod of Jerusalem",
			source: "1672  ·  Decree 13, opening sentence",
			contradictedBy: ["Eph 2:8–9", "Rom 3:28", "Rom 11:6"],
		});
		deck.statement({
			movement: JEWEL,
			kicker: "ROME & ORTHODOXY",
			text: "Justification: a process that begins, and *does not end until you die*.",
			support: "But that is not the biblical gospel. Salvation comes by faith alone, and is completed in the moment you believe.",
			ref: "Ephesians 2:8",
		});
		deck.statement({
			movement: JEWEL,
			text: "If Jesus Christ truly paid the penalty for our sin, what could my works possibly add to my justification?",
			support: "It is either by faith alone, or by faith and works. It can’t be both.",
		});
		deck.scripture({
			movement: JEWEL,
			kicker: "THE WORD OF GOD  ·  IT CAN’T BE MORE CLEAR",
			book: "Ephesians",
			verses: "2:8–9",
			text: "For by grace you have *been saved through faith*. And this is not your own doing; it is the gift of God, *not a result of works*, so that no one may boast.",
		});
		deck.statement({
			movement: JEWEL,
			kicker: "THE REAL QUESTION",
			text: "By grace through faith *alone* — or by grace through faith *and works*?",
			support: "Rome and Orthodoxy do teach salvation by grace through faith. Don’t get lost there.",
		});
		deck.scripture({
			movement: JEWEL,
			kicker: "THE WORD OF GOD  ·  FUNDAMENTALLY OPPOSED",
			book: "Romans",
			verses: "11:6",
			text: "But if it is by grace, it is no longer on the basis of works; *otherwise grace would no longer be grace*.",
		});

		deck.section("Conclusion");
		deck.outline({
			title: "So, today",
			parts: [
				{ label: "SOLA SCRIPTURA", head: "The Safe", body: "The doctrine we must defend to protect the saving gospel.", ref: "2 Timothy 3:16–17" },
				{ label: "SOLA FIDE", head: "The Jewel", body: "The gospel itself: salvation by faith alone, apart from works.", ref: "Ephesians 2:8–10" },
			],
		});
		deck.statement({
			kicker: "WHAT MUST A PERSON DO TO BE SAVED?",
			text: "It is by faith *alone* in Jesus Christ *alone* that we can be saved.",
			support: "That is the jewel — the core of the gospel itself.",
		});
		deck.discussion({
			label: "DISCUSSION  ·  THE JEWEL",
			questions: [
				{
					text: "Re-read Ephesians 2:8–10.",
					sub: [
						"How would you explain the relationship between works and faith in this passage?",
						"Besides the examples given, what other examples of improperly bringing works into salvation have you seen?",
						"Is it hard to believe that salvation/justification is a once completed action? Why or why not?",
					],
				},
				"Say you knew someone who rejects the idea that salvation is by grace alone through faith alone. How would you help them to see what the Bible teaches on this?",
			],
		});

		deck.nextWeek(SERIES, "01");
	},
};
