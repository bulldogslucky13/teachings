// Case Study 02 — The Word & The Witness. Follows the 11/15/26 teaching transcript:
//   I.  How should we view the relationship between Scripture and tradition? (Matthew 15:1–6)
//   II. The history of the church's understanding of the incarnation
// Each slide is marked in the transcript where it should be shown: yellow for a main
// point to read from the slide word for word, blue for supporting content (verses,
// quotes, headers).

const SERIES = require("../series");

const plan = SERIES.find((s) => s.number === "02");

const WORD = 1;
const INCARNATION = 2;

const HOLCOMB = "Know the Creeds and Councils  ·  2014";

module.exports = {
	number: "02",
	// Feedback after 01: the peripheral text was distracting. Just the verse, the
	// quote, or the heading; sources and Latin go to the speaker notes.
	simple: true,
	movements: [
		{ numeral: "I", label: "THE WORD & THE WITNESS", divider: "SCRIPTURE & TRADITION" },
		{ numeral: "II", label: "THE INCARNATION", divider: "THE INCARNATION" },
	],

	build(deck) {
		deck.section("Opening");
		deck.cover();
		deck.sermonTitle(plan);

		deck.statement({
			text: "Tradition is a good servant and a terrible master, and that only one Word gets *the final say*.",
		});
		deck.outline({
			title: "This morning",
			parts: [
				{ label: "THE WORD & THE WITNESS", head: "Tradition", body: "How should we view the relationship between Scripture and tradition?", ref: "Matthew 15:1–6" },
				{ label: "AN EXAMPLE IN ACTION", head: "Incarnation", body: "The history of the church’s understanding of the incarnation." },
			],
		});

		// ── I. Scripture and tradition
		deck.section("I · Scripture & Tradition");
		deck.movement(WORD, "How should we view the relationship between Scripture and tradition?");
		deck.scripture({
			book: "Matthew",
			verses: "15:1–6",
			text: "[1] Then Pharisees and scribes came to Jesus from Jerusalem and said, [2] “Why do your disciples break the tradition of the elders? For they do not wash their hands when they eat.” [3] He answered them, “And *why do you break the commandment of God for the sake of your tradition?* [4] For God commanded, ‘Honor your father and your mother,’ and, ‘Whoever reviles father or mother must surely die.’ [5] But you say, ‘If anyone tells his father or his mother, “What you would have gained from me is given to God,” [6] he need not honor his father.’ So *for the sake of your tradition you have made void the word of God*.",
		});
		deck.statement({
			text: "Tradition is *normed by* (or under the authority of) Scripture.",
			support: "Their tradition violated the Word of God; therefore, because it violated God’s Word, their tradition was incorrect.",
			ref: "Matthew 15:3",
		});
		deck.quote({
			text: "Henceforth, [the reformers] established the position of sola Scriptura (“Scripture alone”), meaning that *Scripture is our only ultimate authority for faith and practice*. This doesn’t mean that the Bible is the only place where truth is found, but it does mean that *everything else we learn about God and his world, and all other authorities, are subordinate to the Scriptures*. The Scriptures are the sole necessary and sufficient source of our theology.",
			attribution: "Justin S. Holcomb",
			source: `${HOLCOMB}  ·  p. 102`,
		});
		deck.statement({
			text: "Tradition itself is not wrong, but it always must be *subordinate* to the ultimate authority of Scripture.",
		});
		deck.quote({
			text: "[The Council of] Trent ruled that Scripture and tradition were to be given *equal weight* in determining what Christians ought to believe. The council decided that in addition to the Scriptures stood “also the traditions, whether they relate to faith or to morals, as having been dictated either orally by Christ or by the Holy Ghost, and *preserved in the Catholic Church in unbroken succession*.” This is in contrast to the Protestants, who wanted to give *the final and arbitrating authority to the Scriptures alone*.",
			attribution: "Justin S. Holcomb",
			source: `${HOLCOMB}  ·  p. 102`,
		});
		deck.compare({
			title: "An example: praying to Mary",
			columns: [
				{
					label: "CATHOLIC DOGMA",
					head: "Mary carries our prayers to Jesus",
					body: ["As his mother, she has a special relationship to him", "So she can pray for us better than we can"],
					foot: "Grounded in tradition and logic",
				},
				{
					label: "THE SCRIPTURES",
					head: "Not a single verse teaches it",
					body: ["Draw near to the throne with confidence (Hebrews 4:16)", "The Father delights to call us his children (1 John 3:1)"],
					highlight: true,
				},
			],
		});
		deck.scripture({
			book: "Hebrews",
			verses: "4:16",
			text: "[16] Let us then *with confidence draw near to the throne of grace*, that we may receive mercy and find grace to help in time of need.",
		});
		deck.scripture({
			book: "1 John",
			verses: "3:1",
			text: "[1] See what kind of love the Father has given to us, that *we should be called children of God*; and so we are. The reason why the world does not know us is that it did not know him.",
		});
		deck.statement({
			text: "If something is asserted as necessary, or even helpful, in becoming more like Christ, but is not found in this book, *we should reject it*.",
			ref: "2 Timothy 3:16–17",
		});
		deck.statement({
			text: "Why should we, as a nondenominational Protestant church, care about tradition and church history at all?",
		});
		deck.statement({
			text: "We are not anti-tradition. We embrace all of the history of the church *insofar as it accords with the Scriptures*.",
		});
		deck.scripture({
			book: "1 Timothy",
			verses: "3:15",
			text: "[15] if I delay, you may know how one ought to behave in the household of God, which is the church of the living God, *a pillar and buttress of the truth*.",
		});
		deck.statement({
			text: "But where it does align with Scripture, we should honor the work the Lord did through these saints of old to *define and defend the truth* as its pillar and buttress.",
		});
		deck.scripture({
			book: "2 Timothy",
			verses: "2:1–2",
			text: "[1] You then, my child, be strengthened by the grace that is in Christ Jesus, [2] and what you have heard from me in the presence of many witnesses *entrust to faithful men*, who will be able to teach others also.",
		});
		deck.phrase({
			ref: "2 Timothy 2:2",
			phrase: "entrust",
			gloss: "To deposit, trusting",
			body: ["Like a direct deposit you trust the bank to keep.", "Generation after generation of pastors, entrusted with the gospel."],
			verse: "[1] You then, my child, be strengthened by the grace that is in Christ Jesus, [2] and what you have heard from me in the presence of many witnesses *entrust* to faithful men, who will be able to teach others also.",
			verseRef: "2 Timothy 2:1–2",
		});
		deck.scripture({
			book: "Jude",
			verses: "3",
			text: "[3] Beloved, although I was very eager to write to you about our common salvation, I found it necessary to write appealing to you to *contend for the faith that was once for all delivered to the saints*.",
		});
		deck.statement({
			text: "To embrace church tradition is *not anti-biblical*, nor anti-sola Scriptura.",
		});
		deck.compare({
			title: "Gifts to the church",
			columns: [
				{ label: "TEACHERS", head: "Pillars of the faith", body: ["Athanasius and Augustine", "Luther and Spurgeon", "Lloyd-Jones and Packer", "MacArthur, Sproul and Swindoll"] },
				{ label: "CREEDS & CONFESSIONS", head: "Summaries of the faith", body: ["The Nicene Creed", "The Definition of Chalcedon", "The catechisms"] },
			],
		});
		deck.conclusion({
			movement: WORD,
			statement: "The Scripture is our ultimate authority on what is to be considered proper and improper tradition. But we should love to embrace traditions that encapsulate these truths faithfully.",
			groundedIn: ["Matthew 15:3–6", "1 Timothy 3:15", "2 Timothy 2:2", "Jude 3"],
		});
		deck.discussion({
			label: "DISCUSSION  ·  SCRIPTURE & TRADITION",
			questions: [
				{
					text: "Re-read Matthew 15:1–6. The Pharisees probably didn’t set out to “make void the word of God.”",
					sub: [
						"How does a tradition slowly move from helping people obey Scripture to standing in its place?",
						"Can you think of any traditions (in your family, your church background, or Christian culture) that you have seen treated as if they were as binding as Scripture?",
					],
				},
				{
					text: "Paul calls the church “a pillar and buttress of the truth” (1 Timothy 3:15) and tells Timothy to “entrust” the gospel to faithful men (2 Timothy 2:2).",
					sub: [
						"If our tradition is normed by Scripture, why still read the church fathers, creeds and catechisms at all?",
						"How would you answer a friend who says, “I just need me and my Bible”?",
					],
				},
			],
		});

		// ── II. The incarnation
		deck.section("II · The Incarnation");
		deck.movement(INCARNATION, "How has the church understood the incarnation?");
		deck.cards({
			title: "Three creeds on the incarnation",
			items: [
				{ label: "C. AD 140", head: "Apostles’", body: "Against Gnosticism: Jesus truly came in the flesh." },
				{ label: "AD 325 · 381", head: "Nicene", body: "Against Arius: Jesus is truly God, not a created being." },
				{ label: "AD 451", head: "Chalcedon", body: "Against Eutyches and Nestorius: two natures, one person." },
			],
		});
		deck.interlude({
			movement: INCARNATION,
			kicker: "CREED 1 OF 3",
			title: "The Apostles’ Creed",
			items: [
				{ label: "WRITTEN", head: "c. AD 140" },
				{ label: "IN RESPONSE TO", head: "Gnosticism" },
			],
		});
		deck.scripture({
			book: "1 John",
			verses: "1:1",
			text: "[1] That which was from the beginning, which we have heard, which we have seen with our eyes, which we looked upon and *have touched with our hands*, concerning the word of life—",
		});
		deck.quote({
			text: "I believe in God, the Father Almighty, the Maker of heaven and earth, and in Jesus Christ, His only Son, our Lord: Who was *conceived* by the Holy Ghost, *born* of the virgin Mary, *suffered* under Pontius Pilate, was *crucified*, *died*, and *buried*…",
			attribution: "The Apostles’ Creed",
			source: `c. AD 140  ·  as given in Holcomb, ${HOLCOMB}, p. 27`,
		});
		deck.statement({
			text: "The Apostles’ Creed pretty clearly rejects any view that Jesus was not a real, physical human in the incarnation.",
			support: "He was conceived, born, suffered, crucified, died, buried: none of these things could be said of someone who was not physically present on earth.",
		});
		deck.proofs({
			title: "The Apostles’ Creed and the Scriptures",
			pages: 1,
			rows: [
				{ text: "I believe in God the Father almighty,", refs: "Isaiah 63:16; Matthew 6:9; 23:9; Luke 11:2" },
				{ text: "the creator of heaven and earth.", refs: "Psalm 89:11–13; Genesis 2:4; Exodus 31:17; Acts 4:24; 14:15; Ephesians 3:9" },
				{ text: "I believe in Jesus Christ, his only Son, our Lord,", refs: "Psalm 2:7; John 1:1–4, 14; 3:16; 16:28; Acts 13:33; Hebrews 5:5; 1 John 4:9" },
				{ text: "who was conceived by the Holy Spirit, born of the Virgin Mary,", refs: "Isaiah 7:14; Matthew 1:20–23; Luke 1:30–35; John 1:14; Galatians 4:4; 1 John 4:2" },
				{ text: "suffered under Pontius Pilate, was crucified,", refs: "Luke 23:33–34; John 19:18; Acts 4:10, 27; Isaiah 53:4–5" },
				{ text: "died,", refs: "Matthew 27:50; Mark 15:37; Luke 23:46; John 19:30; Acts 4:10" },
				{ text: "and was buried.", refs: "Matthew 27:57–61; Mark 15:42–47; Luke 23:50–56; John 19:38–42" },
			],
		});
		deck.statement({
			text: "These creeds and confessions *do draw heavily on Scripture*.",
			support: "Only Scripture alone is inspired and authoritative for our faith.",
			notes: "The Apostles’ Creed later says Jesus “descended into hell,” which I do not believe Scripture teaches, so we reject that portion on the grounds that it is not biblical.",
		});
		deck.interlude({
			movement: INCARNATION,
			kicker: "CREED 2 OF 3",
			title: "The Nicene Creed",
			items: [
				{ label: "WRITTEN", head: "AD 325 · 381" },
				{ label: "IN RESPONSE TO", head: "Arius" },
			],
		});
		deck.quote({
			text: "The Nicene Creed is perhaps the most famous and influential creed in the history of the church, because it settled the question of how Christians can *worship one God* and also claim that this God is *three persons*.",
			attribution: "Justin S. Holcomb",
			source: `${HOLCOMB}  ·  p. 33`,
		});
		deck.quote({
			text: "I believe… in one Lord Jesus Christ, the only-begotten Son of God, begotten of the Father before all worlds; *God of God*, Light of Light, *very God of very God*; begotten, not made, *being of one substance with the Father*, by whom all things were made. Who, for us men and for our salvation, came down from heaven, and was incarnate by the Holy Spirit of the virgin Mary, and was made man; and was crucified also for us under Pontius Pilate; He suffered and was buried; and the third day He rose again, according to the Scriptures",
			attribution: "The Nicene Creed",
			source: "AD 325 · 381  ·  on the Son",
		});
		deck.statement({
			text: "It did affirm the Apostles’ Creed assertions that Jesus was truly man, but went further to assert Jesus as *also being truly God*.",
		});
		deck.proofs({
			title: "The Nicene Creed and the Scriptures",
			pages: 2,
			rows: [
				{ text: "And in one Lord Jesus Christ,", refs: "2 Corinthians 1:3; 1 Thessalonians 1:1; Romans 13:14" },
				{ text: "the only-begotten Son of God, begotten of the Father before all ages;", refs: "John 3:16; Hebrews 1:6; Matthew 14:33; Revelation 1:8" },
				{ text: "God of God, Light of Light, true God of true God; begotten, not made,", refs: "John 1:1; 1 John 1:5; John 8:12; 20:28; 1 John 5:20; Psalm 2:7; Hebrews 1:5; John 14:9" },
				{ text: "being of one substance with the Father;", refs: "John 10:30; Isaiah 44:6; Revelation 1:8; Philippians 2:6; John 10:38; Colossians 2:9" },
				{ text: "by whom all things were made.", refs: "John 1:1–3, 10, 14; 1 Corinthians 8:6; Colossians 1:15–17" },
				{ text: "Who, for us and for our salvation, came down from heaven,", refs: "1 Thessalonians 5:9; Acts 4:12; 2 Timothy 3:15; John 6:51; 6:38; Matthew 1:18; Luke 1:27, 35; Philippians 2:6–7; Romans 1:3" },
				{ text: "and was crucified also for us under Pontius Pilate. He suffered", refs: "Luke 23:33–34; John 19:18; Acts 4:10, 27; Isaiah 53:4–5" },
				{ text: "and was buried; and the third day He rose again, in accordance with the Scriptures;", refs: "Matthew 16:21; 27:57–61; Mark 15:42–47; Luke 23:50–56; John 19:38–42; Luke 24:5–7; 1 Corinthians 15:3–4" },
			],
		});
		deck.statement({
			text: "Even though it isn’t literally Scripture, it *clearly articulates Scriptural truths accurately*.",
		});
		deck.interlude({
			movement: INCARNATION,
			kicker: "CREED 3 OF 3",
			title: "The Definition of Chalcedon",
			items: [
				{ label: "WRITTEN", head: "AD 451" },
				{ label: "IN RESPONSE TO", head: "Eutyches" },
			],
		});
		deck.quote({
			text: "The Definition of Chalcedon itself is a statement of both simplicity and great depth, aiming to set out a coherent christological position that walked the line between the Nestorian heresy (*two persons in Christ*) on the one hand and the Eutychean heresy (*only one nature in Christ*) on the other.",
			attribution: "Justin S. Holcomb",
			source: HOLCOMB,
		});
		deck.quote({
			text: "Therefore, following the holy Fathers, we all with one accord teach men to acknowledge one and the same Son, our Lord Jesus Christ, at once complete in Godhead and complete in manhood, truly God and truly man, consisting also of a reasonable soul and body; of one substance [homoousios] with the Father as regards his Godhead, and at the same time of one substance with us as regards his manhood; like us in all respects, apart from sin; as regards his Godhead, begotten of the Father before all ages, but yet as regards his manhood begotten, for us men and for our salvation, of Mary the Virgin, the God-bearer [Theotokos]; one and the same Christ, Son, Lord, Only-begotten, recognized in two natures, without confusion, without change, without division, without separation; the distinction of natures being in no way annulled by the union, but rather the characteristics of each nature being preserved and coming together to form one person and subsistence [hypostasis], not as parted or separated into two persons, but one and the same Son and Only-begotten God the Word, Lord Jesus Christ; even as the prophets from earliest times spoke of him, and our Lord Jesus Christ himself taught us, and the creed of the Fathers has handed down to us.",
			attribution: "The Definition of Chalcedon",
			source: "AD 451",
		});
		deck.statement({
			text: "Chalcedon did not define *how* the union took place, but clearly articulates the limits in which we can and can’t talk about the union of Christ’s natures in the incarnation.",
		});
		deck.statement({
			text: "Since AD 451, the church has not needed to produce a single new writing to clarify or develop our shared understanding of the nature of Christ.",
			support: "That’s a remarkable testimony to our God, who has empowered the church to be faithful to His revealed Word.",
		});
		deck.proofs({
			title: "The Definition of Chalcedon and the Scriptures",
			pages: 2,
			rows: [
				{ text: "…one and the same Son, our Lord Jesus Christ, at once complete in Godhead", refs: "Colossians 2:9" },
				{ text: "and complete in manhood,", refs: "Hebrews 2:14–17" },
				{ text: "truly God and truly man, consisting also of a reasonable soul", refs: "Matthew 26:38; John 11:33; 12:27" },
				{ text: "and body;", refs: "Luke 24:39; Hebrews 10:5" },
				{ text: "of one substance with the Father as regards his Godhead,", refs: "John 1:1; 10:30" },
				{ text: "and at the same time of one substance with us as regards his manhood;", refs: "Philippians 2:7; Hebrews 2:17" },
				{ text: "like us in all respects, apart from sin;", refs: "Hebrews 4:15" },
				{ text: "as regards his Godhead, begotten of the Father before all ages,", refs: "John 1:18; 17:5" },
				{ text: "but yet as regards his manhood begotten, for us men and for our salvation,", refs: "Galatians 4:4–5; 1 Timothy 1:15" },
				{ text: "of Mary the Virgin, the God-bearer;", refs: "Luke 1:35, 43" },
				{ text: "one and the same Christ, Son, Lord,", refs: "1 Corinthians 8:6" },
				{ text: "Only-begotten,", refs: "John 1:14; 3:16" },
				{ text: "recognized in two natures, without confusion,", refs: "John 1:1, 14" },
				{ text: "without change,", refs: "Hebrews 13:8" },
				{ text: "without division,", refs: "John 1:14; Philippians 2:5–7" },
				{ text: "without separation;", refs: "John 1:1, 14, 18" },
				{ text: "the distinction of natures being in no way annulled by the union,", refs: "Philippians 2:6–7" },
				{ text: "but rather the characteristics of each nature being preserved and coming together to form one person and subsistence,", refs: "John 1:1, 14" },
				{ text: "not as parted or separated into two persons, but one and the same Son and Only-begotten God the Word, Lord Jesus Christ;", refs: "John 1:1, 14, 18" },
				{ text: "even as the prophets from earliest times spoke of him,", refs: "Isaiah 9:6; Luke 24:27" },
				{ text: "and our Lord Jesus Christ himself taught us,", refs: "John 8:58; 10:30" },
				{ text: "and the creed of the Fathers has handed down to us." },
			],
		});

		// ── conclusion
		deck.section("Conclusion");
		deck.compare({
			title: "Keep reading",
			columns: [
				{ label: "JUSTIN S. HOLCOMB", head: "Know the Creeds and Councils", body: ["The history of the major creeds and councils, digestible and easy to read"] },
				{ label: "CARL R. TRUEMAN", head: "Crisis of Confidence", body: ["Why the church today should embrace its creeds, confessions and catechisms"] },
			],
		});
		deck.conclusion({
			movement: INCARNATION,
			statement: "As the church, we should eagerly embrace the history of the Church as it aligns with the ultimate authority: Scripture.",
			groundedIn: ["Matthew 15:3–6", "1 Timothy 3:15", "Jude 3"],
		});
		deck.discussion({
			label: "DISCUSSION  ·  THE INCARNATION",
			questions: [
				{
					text: "Each creed answered a different error. Gnosticism said Jesus wasn’t truly man, Arius said he wasn’t truly God, and Eutyches blended the two natures together.",
					sub: [
						"Which of these errors do you think shows up most today, even in the church?",
						"What would we lose about the gospel if Jesus were not fully God and fully man?",
					],
				},
				{
					text: "We looked at how the creeds are built line by line on Scripture. Pick one line from the Apostles’ or Nicene Creed and think of Scripture that backs it as a group (your notes/photos are acceptable for this assignment).",
					sub: ["How does knowing those references change how you feel about reciting the creed in service with the rest of the church?"],
				},
			],
		});
		deck.nextWeek(SERIES, "02");
		// end on the series cover while groups talk
		deck.cover();
	},
};
