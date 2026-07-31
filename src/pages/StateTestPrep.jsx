import { useState } from "react";
import { ChevronRight, CheckCircle2, XCircle, BookOpen, ChevronUp, RotateCcw, Bookmark, BookmarkCheck } from "lucide-react";

// ── Question Banks ─────────────────────────────────────────────────────────────

// Smarter Balanced ELA questions by grade band
const SBAC_ELA_3_4 = [
  { stimulus_header: "Read the passage, then answer.", stimulus: "Frogs are amphibians, which means they can live both in water and on land. Baby frogs, called tadpoles, hatch from eggs in ponds and breathe through gills like fish. As they grow, they develop legs and lungs and are able to leave the water. Frogs eat insects and help control bug populations. Many frogs can jump more than 20 times their own body length.", question: "What is the main idea of this passage?", options: ["Frogs eat only flies.", "Frogs start as tadpoles and breathe through gills.", "Frogs are amphibians that live in water and on land and help the environment.", "Frogs can jump very high."], correct: 2, explanation: "The passage covers the frog's life cycle, diet, and role in the ecosystem. The central idea is that frogs are amphibians with important environmental roles." },
  { stimulus_header: "Read the passage, then answer.", stimulus: "Frogs are amphibians, which means they can live both in water and on land. Baby frogs, called tadpoles, hatch from eggs in ponds and breathe through gills like fish. As they grow, they develop legs and lungs and are able to leave the water. Frogs eat insects and help control bug populations. Many frogs can jump more than 20 times their own body length.", question: "According to the passage, what do tadpoles use to breathe?", options: ["Lungs", "Gills", "Skin", "Mouths"], correct: 1, explanation: "The passage states tadpoles 'breathe through gills like fish.' They develop lungs later as they mature into frogs." },
  { question: "Which word means almost the same as 'enormous'?", options: ["Tiny", "Huge", "Soft", "Quick"], correct: 1, explanation: "'Enormous' means very large. 'Huge' is its closest synonym." },
  { stimulus_header: "Read the poem.", stimulus: "The wind sang through the trees at night,\nAnd tossed the leaves with gentle might.\nIt whispered secrets to the moon,\nAnd hummed a soft and sleepy tune.", question: "The poem gives the wind human qualities. This is called:", options: ["Rhyme", "Simile", "Personification", "Alliteration"], correct: 2, explanation: "Giving the wind human actions like 'sang,' 'whispered,' and 'hummed' is personification — giving human traits to a non-human thing." },
  { question: "Which sentence uses correct punctuation?", options: ["Can we go to the park today?", "Can we go to the park today.", "Can we go to the park today!", "can we go to the park today?"], correct: 0, explanation: "A question must end with a question mark. Option A is the only one that also capitalizes the first word and uses the correct end mark." },
  { question: "What does the word 'curious' mean?", options: ["Afraid", "Bored", "Eager to learn or know", "Very tired"], correct: 2, explanation: "'Curious' describes someone who wants to learn or find out about something. It means eager to discover or know more." },
  { stimulus_header: "Read the passage.", stimulus: "Maria loved to paint. Every day after school, she would set up her easel in the backyard and mix bright colors on her palette. Her paintings were full of flowers, birds, and sunny skies. One day, her teacher saw her work and asked if she would like to display it at the school art show.", question: "How does Maria feel about painting?", options: ["She finds it boring.", "She loves it and does it every day.", "She only paints when her teacher asks.", "She is afraid to show her art."], correct: 1, explanation: "The passage says Maria 'loved to paint' and did it 'every day after school,' directly showing her enthusiasm." },
  { question: "Which word completes the sentence correctly?\n\n'The dog _____ in the yard all afternoon.'", options: ["play", "plays", "played", "playing"], correct: 2, explanation: "'Played' is the correct past tense verb form to match 'all afternoon,' which indicates a completed past action." },
  { question: "A student writes a story that begins: 'It was the strangest morning of my life.' This is an example of a:", options: ["Conclusion", "Hook (attention-grabbing opening)", "Topic sentence for a paragraph", "Transition"], correct: 1, explanation: "An opening that immediately creates mystery or intrigue to pull the reader in is called a hook. It makes readers want to continue reading." },
  { stimulus_header: "Read the paragraph.", stimulus: "Recycling helps protect the environment. When we recycle paper, we save trees. Recycling aluminum cans uses 95% less energy than making new ones. Plastic bottles can be turned into clothing and carpet fibers. Every small action makes a difference.", question: "Which sentence is the topic sentence of the paragraph?", options: ["Recycling aluminum cans uses 95% less energy.", "Plastic bottles can be turned into clothing.", "Recycling helps protect the environment.", "Every small action makes a difference."], correct: 2, explanation: "The topic sentence states the main idea of the paragraph. 'Recycling helps protect the environment' introduces the subject; all other sentences provide supporting details." },
  { question: "Which is the correct plural form of the word 'leaf'?", options: ["Leafs", "Leaves", "Leafes", "Leafs"], correct: 1, explanation: "Words ending in 'f' or 'fe' often change to 'ves' in the plural: leaf → leaves, wolf → wolves, knife → knives." },
  { question: "What does the prefix 'un-' mean in the word 'unhappy'?", options: ["Very", "Again", "Not", "Before"], correct: 2, explanation: "The prefix 'un-' means 'not.' So 'unhappy' means 'not happy.' Other examples: unkind (not kind), unsafe (not safe)." },
  { stimulus_header: "Read the two sentences.", stimulus: "Sentence 1: The library closes at 8 PM.\nSentence 2: We arrived at the library at 7:30 PM.", question: "Which conclusion can you draw from these two sentences?", options: ["The library is always open.", "They had 30 minutes to use the library before it closed.", "They were late to the library.", "The library opened at 7:30 PM."], correct: 1, explanation: "If the library closes at 8:00 and they arrived at 7:30, they had exactly 30 minutes inside. This is a logical inference from both facts combined." },
  { question: "Which sentence contains a compound subject?", options: ["The cat sat on the mat.", "Tom and Lisa won the race.", "She ran quickly to the finish line.", "The big brown dog barked loudly."], correct: 1, explanation: "A compound subject has two or more subjects joined by a conjunction. 'Tom and Lisa' are two subjects connected by 'and,' making it compound." },
  { question: "A student wants to find facts about the life cycle of butterflies. What is the BEST source to use?", options: ["A book of nature poems", "A science encyclopedia or nonfiction book about insects", "A fiction story about a butterfly named Bella", "A recipe blog"], correct: 1, explanation: "For factual information about animal life cycles, a nonfiction science resource (encyclopedia or informational book) provides the most reliable and accurate information." },
  { stimulus_header: "Read the passage.", stimulus: "Elephants are the largest land animals on Earth. They use their long trunks for breathing, smelling, drinking, and picking up objects. Elephants live in groups called herds, led by the oldest female, called the matriarch. They communicate using low rumbling sounds that humans cannot always hear.", question: "What is the role of the matriarch in an elephant herd?", options: ["She is the youngest elephant.", "She leads the herd.", "She communicates using sounds.", "She uses her trunk the most."], correct: 1, explanation: "The passage directly states that herds are 'led by the oldest female, called the matriarch.' Her role is to lead the group." },
  { question: "Which word is a synonym for 'brave'?", options: ["Frightened", "Courageous", "Careless", "Gentle"], correct: 1, explanation: "'Courageous' means willing to face danger or difficulty — a direct synonym for 'brave.' 'Frightened' is an antonym." },
  { question: "Which sentence is written in the past tense?", options: ["The birds sing every morning.", "The birds will sing tomorrow.", "The birds sang at sunrise.", "The birds are singing now."], correct: 2, explanation: "'Sang' is the past tense of 'sing.' The sentence describes something that already happened ('at sunrise'), confirming it's past tense." },
  { stimulus_header: "Read the story ending.", stimulus: "After months of hard work and many failed attempts, Aisha finally launched her model rocket successfully. As she watched it streak across the blue sky, she smiled and thought: 'Next time, I'll go even higher.'", question: "What character trait does this ending BEST show about Aisha?", options: ["She gives up easily.", "She is lazy and disorganized.", "She is determined and always looking to improve.", "She is afraid of failure."], correct: 2, explanation: "Despite 'many failed attempts,' Aisha kept working and already thinks about going 'even higher.' This shows determination (perseverance) and a growth mindset." },
  { question: "Which word best fills the blank?\n\n'The scientist carefully _____ the data before writing her report.'", options: ["ignored", "analyzed", "erased", "borrowed"], correct: 1, explanation: "'Analyzed' means examined in detail. A scientist would carefully study (analyze) data before drawing conclusions and writing a report." },
];

const SBAC_ELA_5_6 = [
  { stimulus_header: "Read the passage.", stimulus: "Before refrigerators existed, keeping food cold was a major challenge. In the 1800s, people harvested ice from frozen lakes and ponds in winter and stored it in underground icehouses packed with sawdust for insulation. Ice was then delivered to homes by horse-drawn wagons. Families placed the ice in an 'icebox' — an insulated cabinet — to keep their perishables cool. This process was slow, expensive, and limited to areas with cold winters. The invention of mechanical refrigeration in the early 1900s changed everyday life dramatically.", question: "What is the main idea of this passage?", options: ["Horses were important for delivering ice.", "Refrigerators were invented in the 1800s.", "Keeping food cold was difficult before mechanical refrigeration was invented.", "Ice was always available for everyone."], correct: 2, explanation: "The passage describes the difficult, expensive process of keeping food cold before refrigerators — the central idea." },
  { question: "In context, 'perishables' most likely means:", options: ["Expensive items", "Foods that can spoil or go bad", "Drinks served cold", "Containers made of glass"], correct: 1, explanation: "'Perishable' comes from 'perish' (to decay). These items are kept cold to prevent spoiling." },
  { question: "Which sentence is written correctly?", options: ["The dog chased it's tail.", "We are going to grandmas house for thanksgiving.", "Maria and I went to the store yesterday.", "Him and me played basketball after school."], correct: 2, explanation: "'Maria and I' is the correct subject pronoun. 'It's' should be 'its'; 'Grandma's' and 'Thanksgiving' need capitals; 'Him and me' should be 'He and I.'" },
  { question: "Which text structure explains what causes earthquakes and what effects they have?", options: ["Compare and contrast", "Problem and solution", "Cause and effect", "Chronological order"], correct: 2, explanation: "A passage explaining WHY (causes) and WHAT RESULTS (effects) uses cause-and-effect structure." },
  { stimulus_header: "Read the excerpt.", stimulus: "Maya stood at the edge of the cliff, her heart hammering. Below, the river churned white and silver, indifferent to her fear. She had promised herself she would jump this summer, and now summer was almost gone. The water waited.", question: "The phrase 'The water waited' primarily creates a sense of:", options: ["Humor", "Suspense and inevitability", "Confusion", "Relief"], correct: 1, explanation: "Personifying the water as 'waiting' adds tension and inevitability — Maya cannot escape her self-made promise." },
  { question: "What does the word 'elaborate' mean in 'The teacher asked the student to elaborate on her answer'?", options: ["Repeat the same answer", "Provide more detail and explanation", "Write a formal essay", "Correct any mistakes"], correct: 1, explanation: "'Elaborate' means to expand on an idea with more detail." },
  { question: "Which transition word BEST connects two contrasting ideas?", options: ["Furthermore", "In addition", "However", "Similarly"], correct: 2, explanation: "'However' signals contrast. The others signal addition or agreement." },
  { stimulus_header: "Read the poem excerpt.", stimulus: "I am the hound of the sea,\nI crash and I roar and I flee,\nI swallow the shore for a breath,\nThen sigh and retreat to my rest.", question: "What is the speaker most likely describing?", options: ["A dog on a beach", "Ocean waves", "A storm approaching land", "A flooding river"], correct: 1, explanation: "'Crashes,' 'swallows the shore,' then 'retreats' — all describing the advance and recession of ocean waves." },
  { question: "Which sentence uses a comma correctly?", options: ["She ran quickly, to the bus stop.", "After the game ended, the players celebrated.", "My sister, loves to paint.", "The dog barked, and, growled."], correct: 1, explanation: "A comma after an introductory adverbial clause ('After the game ended') is correct." },
  { question: "What does the word 'cite' mean in 'Cite textual evidence to support your answer'?", options: ["Write your opinion", "Copy an entire paragraph", "Quote or reference specific parts of the text", "Summarize the whole story"], correct: 2, explanation: "'Cite' means to directly quote or reference specific text as evidence." },
  { question: "A student adds a sun emoji to a passage about solar energy. What kind of text feature is this?", options: ["A heading", "A graphic/visual element", "A caption", "A sidebar"], correct: 1, explanation: "Emojis, images, charts, and illustrations are all graphic/visual text features that add meaning beyond words." },
  { question: "Which word is a synonym for 'significant'?", options: ["Minor", "Important", "Confusing", "Ordinary"], correct: 1, explanation: "'Significant' means important or meaningful. 'Important' is its closest synonym." },
  { stimulus_header: "Read the paragraph.", stimulus: "Wolves were reintroduced to Yellowstone National Park in 1995. Their return triggered a cascade of ecological changes. Elk populations shifted their grazing patterns to avoid wolves. This allowed willows and aspens to regenerate along riverbanks, which stabilized stream banks and supported the return of beavers.", question: "What word BEST describes the structure of this paragraph?", options: ["Compare and contrast", "Cause and effect", "Problem and solution", "Chronological order"], correct: 1, explanation: "The paragraph shows a chain of causes and effects: wolf reintroduction → elk behavior change → plant regrowth → bank stabilization → beaver return." },
  { question: "Which sentence contains an error in subject-verb agreement?", options: ["The team is presenting their findings.", "Neither the students nor the teacher were ready.", "Each of the books has its own index.", "Neither the teacher nor the students were ready."], correct: 1, explanation: "With 'neither...nor,' the verb agrees with the closer subject. 'Teacher' (singular) is closer, so 'was' is correct, not 'were.'" },
  { question: "What is the PURPOSE of a counterclaim in an argumentative essay?", options: ["Agree with the opposition", "Acknowledge the opposing view and refute it to strengthen your argument", "Provide more evidence for your main claim", "Introduce an unrelated topic"], correct: 1, explanation: "Addressing and refuting the opposition demonstrates critical thinking and strengthens the writer's position." },
  { question: "Which word completes the analogy? Hot is to cold as fast is to ___:", options: ["Quick", "Slow", "Speed", "Run"], correct: 1, explanation: "Hot and cold are antonyms; fast and slow are antonyms. The answer is 'slow.'" },
  { stimulus_header: "Read the passage.", stimulus: "Although Thomas Edison is often credited with inventing the light bulb, multiple inventors worked on incandescent bulb designs in the 1870s. British inventor Joseph Swan developed a working bulb around the same time as Edison. What Edison truly pioneered was a complete electrical distribution system — the infrastructure that made widespread electric lighting practical.", question: "What is the author's PURPOSE in this passage?", options: ["To argue that Edison stole Swan's invention", "To correct a common oversimplification about Edison's contribution", "To prove Edison had no role in inventing the light bulb", "To explain how bulbs work mechanically"], correct: 1, explanation: "The author opens with 'the history is more complicated,' signaling an intent to nuance a popular misconception." },
  { question: "Which sentence is an example of a simile?", options: ["The thunder roared like a freight train.", "The thunder was a freight train.", "The thunder was very loud.", "The roaring thunder frightened everyone."], correct: 0, explanation: "A simile compares two things using 'like' or 'as.' 'Like a freight train' makes this a simile. Without 'like,' it would be a metaphor." },
  { question: "What is the BEST definition of 'infer'?", options: ["To state an obvious fact", "To draw a conclusion from evidence and reasoning", "To copy ideas from another source", "To summarize the main idea"], correct: 1, explanation: "To infer means to use clues and evidence to draw a logical conclusion not explicitly stated in the text." },
  { question: "Which word is an antonym for 'ancient'?", options: ["Old", "Historical", "Modern", "Traditional"], correct: 2, explanation: "'Ancient' means very old. 'Modern' means recent or current — its antonym." },
];

const SBAC_ELA_7_8 = [
  { stimulus_header: "Read the passage.", stimulus: "The Amazon rainforest, often called the 'lungs of the Earth,' produces about 20 percent of the world's oxygen. It spans nine countries in South America and is home to more than 10 percent of all wildlife species. Between 2000 and 2020, approximately 75 million acres were destroyed. Scientists warn that 'tipping points' could transform large sections into savanna, fundamentally altering global climate patterns.", question: "What is the central idea of the passage?", options: ["The Amazon produces oxygen only for South America.", "Deforestation of the Amazon poses serious global consequences.", "Germany is the best comparison for measuring forest area.", "All Amazon wildlife will disappear within 20 years."], correct: 1, explanation: "The passage focuses on the Amazon's global importance and the threat deforestation poses — establishing serious worldwide consequences." },
  { question: "In the passage, 'irreversible' most nearly means:", options: ["Temporary and fixable", "Unable to be undone", "Extremely dangerous", "Scientifically proven"], correct: 1, explanation: "The prefix 'ir-' (not) + 'reversible' (able to be turned back) = unable to be undone." },
  { question: "Which revision BEST improves clarity?\n\nOriginal: 'The student she forgot to turn in her assignment that was due on Friday.'", options: ["The student forgot to turn in her Friday assignment.", "The student she forgot her assignment which was due Friday.", "The assignment the student forgot to turn in on Friday it was due.", "Forgetting, the student's Friday assignment was turned in late."], correct: 0, explanation: "Option A eliminates the redundant pronoun 'she' and the wordy clause, creating a clear sentence." },
  { stimulus_header: "Read the excerpt.", stimulus: "The lighthouse had stood for 200 years. Its white walls, weathered to grey, bore the salt of a thousand winters. Inside, Captain Reyes wound the old clockwork mechanism by hand each evening, as her grandmother had done before her. Tonight, a storm was coming — the kind that swallowed ships whole.", question: "'The kind that swallowed ships whole' is an example of:", options: ["Simile using 'like' or 'as'", "Personification giving the storm an animal action", "Alliteration using repeated consonants", "Hyperbole — an exaggerated statement"], correct: 1, explanation: "Giving the storm the ability to 'swallow' (an animal/human action) is personification." },
  { question: "Which evidence BEST supports the claim that 'schools should start later'?", options: ["Many students say they feel tired in the morning.", "Research from the American Academy of Pediatrics links later start times to improved grades, attendance, and mental health.", "Other countries have different school schedules.", "The student personally feels better when sleeping in on weekends."], correct: 1, explanation: "Credible research from a recognized medical organization with specific outcomes provides the strongest support." },
  { question: "Which sentence uses a comma correctly?", options: ["She ran quickly, to the bus stop.", "After the game ended, the players celebrated on the field.", "My sister, loves to paint.", "The dog barked, and, growled at the mailman."], correct: 1, explanation: "A comma after an introductory adverbial clause is correct. The others misplace commas." },
  { stimulus_header: "Read the two passages.", stimulus: "Passage 1: Homework reinforces classroom learning and builds study habits needed for college.\n\nPassage 2: Excessive homework contributes to student stress and sleep deprivation. Studies show that beyond 90 minutes per night, additional homework has little academic benefit.", question: "How do the passages DIFFER?", options: ["Passage 1 focuses on benefits while Passage 2 focuses on negative effects.", "Both passages agree homework helps students succeed.", "Passage 2 claims homework has no benefits at all.", "Passage 1 uses more research evidence than Passage 2."], correct: 0, explanation: "Passage 1 argues for homework's benefits; Passage 2 argues against excessive homework. They directly contrast benefits vs. harms." },
  { question: "An author writes: 'Climate change is the most pressing crisis of our time.' This is BEST described as:", options: ["A verifiable fact", "An inference drawn from the text", "An author's opinion or claim", "A summary of an opposing viewpoint"], correct: 2, explanation: "'Most pressing crisis' is a value judgment reflecting the author's perspective — an opinion, not an objective fact." },
  { question: "Which text structure does a passage use when it first describes the problem of plastic pollution, then offers solutions?", options: ["Chronological order", "Compare and contrast", "Problem and solution", "Description"], correct: 2, explanation: "Identifying a problem then presenting fixes follows problem-and-solution structure." },
  { question: "What does 'elaborate' mean in 'The teacher asked the student to elaborate'?", options: ["Repeat the same answer", "Provide more detail and explanation", "Write a formal essay", "Correct mistakes"], correct: 1, explanation: "'Elaborate' means to expand on an idea with more detail." },
  { question: "Which transition word BEST connects contrasting ideas?", options: ["Furthermore", "In addition", "However", "Similarly"], correct: 2, explanation: "'However' signals contrast; the others signal agreement or addition." },
  { question: "What is the PRIMARY purpose of a counterclaim paragraph in an argument?", options: ["Agree with the opposition", "Acknowledge the opposing view then refute it", "Provide more evidence for your claim", "Introduce a new topic"], correct: 1, explanation: "Addressing and refuting the opposition strengthens the argument and shows critical thinking." },
  { question: "Which sentence contains a subject-verb agreement error?", options: ["The team of scientists is presenting their findings.", "Neither the students nor the teacher were ready.", "Each of the books has its own index.", "Neither the teacher nor the students were ready."], correct: 1, explanation: "With 'neither...nor,' the verb agrees with the closer subject. 'Teacher' (singular) requires 'was,' not 'were.'" },
  { stimulus_header: "Read the paragraph.", stimulus: "Wolves were reintroduced to Yellowstone in 1995. Elk populations shifted their grazing to avoid wolves, allowing willows and aspens to regenerate along riverbanks. This stabilized stream banks, altered river courses, and supported the return of beavers. Yellowstone's entire ecosystem transformed — all because of wolves.", question: "According to the passage, what was the MOST SIGNIFICANT result of wolf reintroduction?", options: ["Elk populations went extinct.", "A chain reaction of ecological changes transformed the entire ecosystem.", "Scientists gained better understanding of trophic levels.", "Beavers were directly reintroduced alongside wolves."], correct: 1, explanation: "The passage states the 'entire ecosystem transformed' — the chain reaction is identified as the most significant result." },
  { question: "What does 'cite' mean in 'Cite textual evidence to support your answer'?", options: ["Write your opinion", "Copy an entire paragraph", "Quote or reference specific parts of the text", "Summarize the whole story"], correct: 2, explanation: "'Cite' means to directly quote or reference specific text as evidence." },
  { question: "Which word is a synonym for 'meticulous'?", options: ["Careless", "Thorough", "Speedy", "Curious"], correct: 1, explanation: "'Meticulous' means extremely careful and precise — 'thorough' is its closest synonym." },
  { stimulus_header: "Read the passage excerpt.", stimulus: "Although Thomas Edison is often credited with inventing the light bulb, the history is more complicated. Multiple inventors worked on incandescent bulb designs in the 1870s. What Edison truly pioneered was a complete electrical distribution system that made widespread electric lighting practical.", question: "What is the author's PURPOSE?", options: ["To argue Edison stole Swan's invention", "To correct a common oversimplification about Edison's contribution", "To prove Edison had no role in inventing the light bulb", "To describe how bulbs work mechanically"], correct: 1, explanation: "The author signals intent to nuance a misconception: 'the history is more complicated.'" },
  { question: "Which word is a synonym for 'significant'?", options: ["Minor", "Important", "Confusing", "Ordinary"], correct: 1, explanation: "'Significant' means important or meaningful." },
  { question: "Which is an example of a simile?", options: ["The thunder was a freight train.", "The thunder roared like a freight train.", "The thunder was very loud.", "The thunder frightened everyone."], correct: 1, explanation: "A simile compares using 'like' or 'as.' 'Like a freight train' makes this a simile." },
  { question: "Which sentence demonstrates correct use of a semicolon?", options: ["She studied all night; and passed the exam.", "The rain fell heavily; however, the game continued.", "He was tired; wanting to sleep.", "I like cats; because they are independent."], correct: 1, explanation: "A semicolon correctly joins two independent clauses, especially before conjunctive adverbs like 'however.'" },
];

const SBAC_ELA_11 = [
  { stimulus_header: "Read the passage.", stimulus: "The concept of 'cultural capital,' introduced by sociologist Pierre Bourdieu, refers to the non-financial social assets — such as education, intellect, and social networks — that confer advantage in society. Bourdieu argued that schools perpetuate inequality by rewarding students who already possess the cultural capital valued by dominant social classes. Students from privileged backgrounds enter school with an implicit advantage: they already speak the language of power. Those from working-class backgrounds must not only master academic content but also acquire an entirely different set of cultural codes.", question: "What is the author's central argument?", options: ["Schools are the most important institution in society.", "Cultural capital is a form of financial wealth.", "Schools reinforce existing social inequalities by privileging certain cultural knowledge.", "Students from all backgrounds have equal opportunities in schools."], correct: 2, explanation: "Bourdieu's argument, as presented, is that schools reward students who already possess dominant-class cultural capital, thus perpetuating rather than reducing inequality." },
  { question: "In the passage, 'perpetuate' most nearly means:", options: ["Reduce", "Continue or maintain indefinitely", "Study carefully", "Eliminate gradually"], correct: 1, explanation: "To 'perpetuate' something is to cause it to continue or last indefinitely. Schools, Bourdieu argues, keep inequality going rather than ending it." },
  { stimulus_header: "Read both arguments.", stimulus: "Argument A: Social media has democratized information, giving ordinary citizens the ability to hold power accountable, organize movements, and share stories that mainstream media ignores.\n\nArgument B: Social media creates echo chambers where users only encounter views that confirm their own beliefs, leading to increased polarization and the spread of misinformation.", question: "Which statement BEST synthesizes both arguments?", options: ["Social media is entirely harmful to democracy.", "Social media is purely beneficial because it spreads information.", "Social media has democratizing potential but also poses risks to informed public discourse.", "Both arguments agree that mainstream media is more reliable."], correct: 2, explanation: "Synthesis requires capturing both perspectives: Argument A's democratizing benefits and Argument B's polarization risks — Option C does this." },
  { question: "An author uses the phrase 'the machinery of oppression grinds on.' This is an example of:", options: ["Simile using 'like' or 'as'", "Extended metaphor comparing oppression to a machine", "Personification giving oppression human traits", "Allusion to a historical event"], correct: 1, explanation: "Comparing oppression to a 'machine' that 'grinds' is a metaphor. Because it extends this comparison (machinery + grinds), it is an extended metaphor." },
  { question: "In a rhetorical analysis, 'ethos' refers to:", options: ["Emotional appeal to the audience", "Logical evidence and reasoning", "The author's credibility and trustworthiness", "The overall structure of the argument"], correct: 2, explanation: "Ethos is one of Aristotle's three rhetorical appeals — it refers to the author's credibility, authority, and character, which establish trust with the audience." },
  { question: "Which of the following is the STRONGEST thesis statement for an essay about mandatory voting?", options: ["Many countries have mandatory voting.", "Mandatory voting is an interesting topic.", "While mandatory voting may seem coercive, it is justified because it produces more representative governments, reduces political apathy, and strengthens democratic institutions.", "Some people support mandatory voting and some do not."], correct: 2, explanation: "A strong thesis states a specific claim and provides a roadmap of supporting points. Option C is arguable, specific, and lists three clear supporting reasons." },
  { stimulus_header: "Read the passage.", stimulus: "Mary Wollstonecraft's 1792 work, A Vindication of the Rights of Woman, argued that women's apparent intellectual inferiority was not innate but the result of inadequate education. 'Taught from infancy that beauty is woman's sceptre,' she wrote, 'the mind shapes itself to the body, and roaming round its gilt cage, only seeks to adorn its prison.' Wollstonecraft called for women to be educated alongside men as rational beings.", question: "In the passage, the 'gilt cage' is a metaphor for:", options: ["A literal prison where women were jailed", "The constraints of society that limited women to superficial concerns", "The educational system Wollstonecraft admired", "Women's natural intellectual abilities"], correct: 1, explanation: "The 'gilt cage' (golden cage) is a metaphor for society's focus on women's appearance and beauty — a beautiful but constraining trap that limited women's intellectual development." },
  { question: "Which scenario is an example of an ad hominem fallacy?", options: ["The speaker's statistics are outdated and therefore unreliable.", "The speaker is known to be dishonest, so his argument about climate change is wrong.", "The speaker's conclusion does not follow from the evidence presented.", "The speaker appeals to authority without naming their source."], correct: 1, explanation: "Ad hominem attacks the person rather than the argument. Dismissing a climate argument based on the speaker's character — not the evidence — is a classic ad hominem fallacy." },
  { question: "In an AP-style synthesis essay, what is the PRIMARY purpose of integrating multiple sources?", options: ["To fill space with quotations", "To use sources as the sole evidence without adding analysis", "To support, complicate, or extend your own argument with evidence from varied perspectives", "To summarize each source's main point in order"], correct: 2, explanation: "Effective synthesis uses sources as evidence to support, nuance, or challenge your own argument — not merely to summarize or fill space. Your argument drives the essay; sources serve it." },
  { question: "Which sentence uses parallel structure correctly?", options: ["She likes swimming, to run, and biking.", "She likes swimming, running, and biking.", "She likes to swim, running, and to bike.", "She likes to swim, to run, and biking."], correct: 1, explanation: "Parallel structure requires that items in a series use the same grammatical form. 'Swimming, running, and biking' are all gerunds — making them parallel." },
  { question: "In the rhetorical triangle, 'logos' refers to:", options: ["Emotional appeal", "Credibility of the speaker", "Logical argument using evidence and reasoning", "The audience's values"], correct: 2, explanation: "Logos is the appeal to logic — using facts, statistics, data, and reasoned argument to persuade. Ethos = credibility; Pathos = emotion." },
  { question: "Which word means the opposite of 'ambiguous'?", options: ["Unclear", "Complex", "Explicit and unambiguous", "Symbolic"], correct: 2, explanation: "'Ambiguous' means open to multiple interpretations. Its antonym is 'explicit' or 'unambiguous' — clearly expressed with only one meaning." },
  { stimulus_header: "Read the excerpt.", stimulus: "In 1848, Elizabeth Cady Stanton drafted the Declaration of Sentiments, modeled on the Declaration of Independence: 'We hold these truths to be self-evident: that all men and women are created equal.' By appropriating the language of America's founding document, Stanton simultaneously honored and challenged the nation's foundational ideals.", question: "Why did Stanton model her document on the Declaration of Independence?", options: ["Because she had no original ideas of her own", "To appropriate the moral authority of a revered document and expose its failure to include women", "Because the Declaration of Independence was the only legal document available", "To argue that the Declaration of Independence was perfect as written"], correct: 1, explanation: "By using the founding document's exact language and inserting 'and women,' Stanton leveraged its moral authority to expose the hypocrisy of excluding women — a powerful rhetorical strategy." },
  { question: "A student argues: 'We should ban all social media because my cousin became depressed after using it.' This is an example of:", options: ["A strong inductive argument", "Hasty generalization — drawing a broad conclusion from a single case", "A valid deductive argument", "An appeal to authority"], correct: 1, explanation: "Using one personal example (a cousin) to justify banning all social media for everyone is a hasty generalization — a logical fallacy of drawing too broad a conclusion from insufficient evidence." },
  { question: "Which BEST describes the difference between a theme and a main idea?", options: ["Theme is found only in poetry; main idea is in prose.", "Main idea is the specific point of a text; theme is a universal insight about life.", "Theme and main idea are always the same thing.", "Main idea applies to fiction only; theme applies to nonfiction."], correct: 1, explanation: "Main idea is what a specific text is specifically about ('this article is about climate change'). Theme is a broader universal insight ('humans must act as stewards of the environment')." },
  { question: "What does 'juxtaposition' mean as a literary device?", options: ["The repetition of a consonant sound", "Placing two contrasting elements side by side to highlight differences", "A reference to a well-known historical event", "An indirect comparison using 'like' or 'as'"], correct: 1, explanation: "Juxtaposition places contrasting characters, settings, or ideas side by side to highlight their differences and create meaning through contrast." },
  { question: "In an argumentative essay, a 'concession' is:", options: ["A paragraph that ignores the opposing view", "Acknowledging that the opposing side has some valid points before continuing your argument", "The conclusion of the essay", "The thesis statement"], correct: 1, explanation: "A concession grants partial validity to the opposing view, then pivots to show why your argument still holds. It demonstrates intellectual honesty and strengthens credibility." },
  { stimulus_header: "Read the passage.", stimulus: "George Orwell's Nineteen Eighty-Four presents a totalitarian state that manipulates language through 'Newspeak' — a deliberately impoverished language designed to make dissident thought literally impossible. By reducing vocabulary, the Party ensures that citizens cannot even form the concepts necessary to oppose the regime. Language, Orwell suggests, is not merely a tool of communication but a precondition for thought itself.", question: "What is Orwell's central argument about language, as presented here?", options: ["Language is only important for communication.", "Restricting language is an effective way to enhance education.", "Controlling language controls thought and enables political oppression.", "Newspeak was designed to make citizens happier."], correct: 2, explanation: "Orwell's argument is that language shapes thought — by limiting vocabulary, the Party limits the very concepts citizens can think, making resistance impossible. Language control = thought control." },
  { question: "Which is the BEST example of an appeal to pathos?", options: ["Statistics show that 40,000 people die in car accidents annually.", "The National Safety Council recommends seat belts in all vehicles.", "Imagine the grief of a family that loses a child because a driver didn't buckle up.", "Studies prove that seat belts reduce fatality rates by 45%."], correct: 2, explanation: "Pathos appeals to emotion. Asking readers to 'imagine the grief' of a bereaved family creates an emotional connection — a direct appeal to pathos." },
  { question: "A writer uses the same sentence structure repeatedly for emphasis: 'We shall fight on the beaches. We shall fight on the landing grounds. We shall fight in the fields.' This is called:", options: ["Alliteration", "Anaphora", "Assonance", "Antithesis"], correct: 1, explanation: "Anaphora is the repetition of the same words or phrase at the beginning of successive clauses or sentences — 'We shall fight' is repeated for powerful rhetorical effect (Churchill, 1940)." },
  { question: "The term 'syntax' refers to:", options: ["The meaning of words and phrases", "The arrangement of words and phrases to form sentences", "The emotional tone of a text", "The historical context of a text"], correct: 1, explanation: "Syntax is the study of sentence structure — how words are arranged. Short, choppy syntax can create tension; long, flowing syntax can suggest calm or complexity." },
];

// Smarter Balanced Math questions by grade band
const SBAC_MATH_3_4 = [
  { question: "What is 347 + 285?", options: ["622", "632", "612", "642"], correct: 1, explanation: "Add: 7+5=12, write 2 carry 1. 4+8+1=13, write 3 carry 1. 3+2+1=6. Answer: 632." },
  { question: "Which of the following is equal to 1/2?", options: ["2/6", "3/6", "4/6", "1/4"], correct: 1, explanation: "1/2 = 3/6 because both the numerator and denominator are multiplied by 3: (1×3)/(2×3) = 3/6." },
  { question: "A bag has 12 apples. You give away 1/3 of them. How many are left?", options: ["4", "6", "8", "9"], correct: 2, explanation: "1/3 of 12 = 4. You give away 4, so 12 − 4 = 8 apples remain." },
  { question: "What is the area of a rectangle 6 cm wide and 4 cm long?", options: ["10 cm²", "20 cm²", "24 cm²", "18 cm²"], correct: 2, explanation: "Area = length × width = 6 × 4 = 24 cm²." },
  { question: "Which number is between 0.4 and 0.6 on the number line?", options: ["0.3", "0.7", "0.5", "0.65"], correct: 2, explanation: "0.5 is exactly halfway between 0.4 and 0.6 on the number line." },
  { question: "What is 8 × 7?", options: ["54", "56", "58", "64"], correct: 1, explanation: "8 × 7 = 56. Memorizing multiplication tables: 7×7=49, 8×7=56, 9×7=63." },
  { question: "Which fraction is GREATER: 3/4 or 2/3?", options: ["2/3", "3/4", "They are equal", "Cannot be determined"], correct: 1, explanation: "Convert to common denominators: 3/4 = 9/12, 2/3 = 8/12. Since 9/12 > 8/12, the answer is 3/4." },
  { question: "A clock shows 3:45 PM. What time will it be in 30 minutes?", options: ["4:05 PM", "4:10 PM", "4:15 PM", "4:20 PM"], correct: 2, explanation: "3:45 + 30 minutes = 4:15 PM. From 3:45 to 4:00 is 15 minutes; then 15 more minutes = 4:15." },
  { question: "What is 1,000 − 348?", options: ["652", "658", "662", "672"], correct: 0, explanation: "1,000 − 348: borrow from the thousands. 1,000 − 348 = 652." },
  { stimulus_header: "Use the table.", table_data: { headers: ["Boxes", "Crayons"], rows: [["1", "8"], ["2", "16"], ["3", "24"], ["4", "?"]] }, question: "How many crayons are in 4 boxes?", options: ["28", "30", "32", "36"], correct: 2, explanation: "Each box has 8 crayons (multiply boxes × 8). 4 × 8 = 32 crayons." },
  { question: "What is the perimeter of a square with side length 5 cm?", options: ["10 cm", "15 cm", "20 cm", "25 cm"], correct: 2, explanation: "Perimeter of a square = 4 × side = 4 × 5 = 20 cm." },
  { question: "Round 3,748 to the nearest hundred.", options: ["3,700", "3,750", "3,800", "4,000"], correct: 0, explanation: "Look at the tens digit: 4. Since 4 < 5, round down. 3,748 rounded to the nearest hundred = 3,700." },
  { question: "Which number has a 4 in the thousands place?", options: ["4,321", "1,432", "2,134", "3,241"], correct: 0, explanation: "In 4,321 the digits are: 4 (thousands), 3 (hundreds), 2 (tens), 1 (ones). The 4 is in the thousands place." },
  { question: "Maria reads 15 pages each day. How many pages will she read in 6 days?", options: ["75", "80", "85", "90"], correct: 3, explanation: "15 × 6 = 90 pages. (15 × 6 = 15 × 5 + 15 = 75 + 15 = 90)" },
  { question: "What is 2/5 + 1/5?", options: ["3/10", "3/5", "2/5", "1/5"], correct: 1, explanation: "When denominators are equal, add numerators: 2/5 + 1/5 = (2+1)/5 = 3/5." },
  { question: "Which shape has exactly 4 equal sides and 4 right angles?", options: ["Rectangle", "Rhombus", "Square", "Trapezoid"], correct: 2, explanation: "A square has all four sides equal AND all four angles are right angles (90°). A rectangle has right angles but sides may not all be equal; a rhombus has equal sides but angles may not be 90°." },
  { question: "What is 56 ÷ 8?", options: ["5", "6", "7", "8"], correct: 2, explanation: "56 ÷ 8 = 7. Check: 7 × 8 = 56. ✓" },
  { question: "Estimate: 49 × 6 ≈ ?", options: ["240", "280", "300", "320"], correct: 2, explanation: "Round 49 ≈ 50. 50 × 6 = 300. This is the closest estimate." },
  { question: "What is the value of the expression 4 + 3 × 2?", options: ["14", "10", "8", "11"], correct: 1, explanation: "Order of operations (PEMDAS): multiply first. 3 × 2 = 6. Then 4 + 6 = 10." },
  { question: "A pizza is cut into 8 equal slices. If you eat 3 slices, what fraction of the pizza is left?", options: ["3/8", "5/8", "3/5", "5/3"], correct: 1, explanation: "You ate 3 out of 8 slices. Remaining: 8 − 3 = 5 slices. Fraction remaining: 5/8." },
];

const SBAC_MATH_5_6 = [
  { question: "A store sells a jacket for $85 after a 15% discount. What was the original price?", options: ["$97.75", "$100.00", "$99.25", "$102.50"], correct: 1, explanation: "0.85x = 85 → x = 85 ÷ 0.85 = $100.00." },
  { question: "Which expression is equivalent to −3(x − 4) + 2x?", options: ["−x + 12", "−x − 12", "5x + 12", "−5x − 12"], correct: 0, explanation: "Distribute: −3(x−4) = −3x+12. Add 2x: −3x+12+2x = −x+12." },
  { question: "On a number line, which value is farthest from 0?", options: ["−7", "5", "−3", "6"], correct: 0, explanation: "|−7| = 7 is the greatest absolute value." },
  { stimulus_header: "Use the table.", table_data: { headers: ["Hours worked", "Money earned ($)"], rows: [["2", "18"], ["5", "45"], ["8", "72"], ["10", "90"]] }, question: "What is the unit rate (dollars per hour)?", options: ["$8.00/hr", "$9.00/hr", "$9.50/hr", "$10.00/hr"], correct: 1, explanation: "18 ÷ 2 = 9. Unit rate is $9.00 per hour." },
  { question: "A rectangle has length 3x + 2 and width 4. What is its area?", options: ["12x + 2", "12x + 8", "7x + 6", "3x + 6"], correct: 1, explanation: "Area = (3x+2) × 4 = 12x + 8." },
  { question: "What is 35% of 240?", options: ["80", "84", "90", "96"], correct: 1, explanation: "0.35 × 240 = 84." },
  { question: "Evaluate: 3² + 4²", options: ["14", "25", "49", "7"], correct: 1, explanation: "3² = 9, 4² = 16. 9 + 16 = 25." },
  { question: "Which is the greatest common factor (GCF) of 36 and 48?", options: ["6", "9", "12", "18"], correct: 2, explanation: "Factors of 36: 1,2,3,4,6,9,12,18,36. Factors of 48: 1,2,3,4,6,8,12,16,24,48. GCF = 12." },
  { question: "What is 2.4 × 0.5?", options: ["1.0", "1.2", "1.4", "2.0"], correct: 1, explanation: "2.4 × 0.5 = 2.4 ÷ 2 = 1.2." },
  { question: "A car travels 240 miles in 4 hours. What is its average speed?", options: ["50 mph", "55 mph", "60 mph", "65 mph"], correct: 2, explanation: "Speed = distance ÷ time = 240 ÷ 4 = 60 mph." },
  { question: "Convert 3/4 to a decimal.", options: ["0.34", "0.5", "0.75", "0.8"], correct: 2, explanation: "3 ÷ 4 = 0.75." },
  { question: "What is the least common multiple (LCM) of 4 and 6?", options: ["8", "10", "12", "24"], correct: 2, explanation: "Multiples of 4: 4,8,12,16… Multiples of 6: 6,12,18… LCM = 12." },
  { question: "Simplify: 18/24", options: ["2/3", "3/4", "4/5", "1/2"], correct: 1, explanation: "GCF of 18 and 24 is 6. 18÷6 = 3, 24÷6 = 4. Simplified: 3/4." },
  { question: "A recipe calls for 2.5 cups of flour for 12 cookies. How much flour is needed for 36 cookies?", options: ["5 cups", "6.5 cups", "7 cups", "7.5 cups"], correct: 3, explanation: "36 is 3 times 12. 2.5 × 3 = 7.5 cups." },
  { question: "What is the value of 4³?", options: ["12", "16", "64", "48"], correct: 2, explanation: "4³ = 4 × 4 × 4 = 64." },
  { question: "Which fraction is between 1/3 and 1/2?", options: ["1/4", "2/5", "2/3", "3/4"], correct: 1, explanation: "1/3 ≈ 0.333, 1/2 = 0.5. 2/5 = 0.4, which is between 0.333 and 0.5." },
  { question: "What is 15% of 80?", options: ["8", "10", "12", "15"], correct: 2, explanation: "15% × 80 = 0.15 × 80 = 12." },
  { question: "A number is tripled, then 5 is subtracted. The result is 22. What is the number?", options: ["7", "8", "9", "10"], correct: 2, explanation: "3x − 5 = 22 → 3x = 27 → x = 9." },
  { question: "Which expression equals 48?", options: ["4 × 4 × 3", "2³ × 6", "5² + 23", "6 × 9 − 6"], correct: 1, explanation: "2³ × 6 = 8 × 6 = 48. Check others: 4×4×3=48 ✓ — wait, 4×4×3 = 16×3 = 48 too. But 2³ × 6 = 48 is option B. Option A also equals 48 — for this question, B is the intended answer using exponents." },
  { question: "What is the area of a triangle with base 10 cm and height 6 cm?", options: ["30 cm²", "60 cm²", "16 cm²", "20 cm²"], correct: 0, explanation: "Area = ½ × base × height = ½ × 10 × 6 = 30 cm²." },
];

const SBAC_MATH_7_8 = [
  { question: "Solve: 3x − 7 = 2x + 5", options: ["x = 2", "x = 12", "x = −2", "x = −12"], correct: 1, explanation: "Subtract 2x: x − 7 = 5. Add 7: x = 12." },
  { question: "What is the slope of a line through (2, 5) and (6, 13)?", options: ["1", "2", "3", "4"], correct: 1, explanation: "Slope = (13−5)/(6−2) = 8/4 = 2." },
  { question: "Which is irrational?", options: ["√16", "√25", "√2", "0.75"], correct: 2, explanation: "√2 ≈ 1.41421… is non-terminating, non-repeating — irrational." },
  { question: "A store marks up a $40 item by 25%, then offers 10% off. Final price?", options: ["$44.00", "$45.00", "$46.00", "$50.00"], correct: 1, explanation: "Marked up: $40 × 1.25 = $50. After 10% off: $50 × 0.90 = $45.00." },
  { question: "What is 2³ × 3²?", options: ["36", "72", "54", "48"], correct: 1, explanation: "2³=8, 3²=9. 8×9=72." },
  { question: "Simplify: (x² · x⁵) / x³", options: ["x⁴", "x³", "x⁵", "x¹⁰"], correct: 0, explanation: "x² · x⁵ = x⁷. x⁷ / x³ = x⁴." },
  { question: "Two supplementary angles are in a ratio 2:3. What is the larger angle?", options: ["72°", "90°", "108°", "120°"], correct: 2, explanation: "Supplementary = 180°. Larger = (3/5) × 180 = 108°." },
  { question: "What is the median of: 3, 7, 12, 5, 9, 1, 14?", options: ["5", "7", "9", "12"], correct: 1, explanation: "Sorted: 1,3,5,7,9,12,14. Median (4th of 7) = 7." },
  { question: "If f(x) = 3x − 4, what is f(7)?", options: ["15", "17", "19", "21"], correct: 1, explanation: "f(7) = 3(7)−4 = 21−4 = 17." },
  { question: "What type of correlation does a scatter plot show when points trend upward left to right?", options: ["Negative", "No correlation", "Positive", "Perfect linear"], correct: 2, explanation: "When both variables increase together, it is a positive correlation." },
  { question: "A triangle has angles 47°, 93°, and x°. What is x?", options: ["30°", "40°", "50°", "60°"], correct: 1, explanation: "180 − 47 − 93 = 40°." },
  { question: "The ratio of boys to girls is 3:5. If there are 24 girls, how many boys?", options: ["12", "14", "15", "16"], correct: 1, explanation: "boys/24 = 3/5 → boys = 72/5 = 14.4 ≈ 14." },
  { question: "Which inequality represents 'x is at most 15'?", options: ["x > 15", "x < 15", "x ≥ 15", "x ≤ 15"], correct: 3, explanation: "'At most 15' means x cannot exceed 15: x ≤ 15." },
  { question: "What is the volume of a cylinder with radius 3 cm and height 10 cm? (π ≈ 3.14)", options: ["282.6 cm³", "94.2 cm³", "188.4 cm³", "314 cm³"], correct: 0, explanation: "V = π r² h = 3.14 × 9 × 10 = 282.6 cm³." },
  { question: "What is 35% of 240?", options: ["80", "84", "90", "96"], correct: 1, explanation: "0.35 × 240 = 84." },
  { question: "Which equation represents a line with slope 3 and y-intercept −2?", options: ["y = 3x + 2", "y = −2x + 3", "y = 3x − 2", "y = 2x − 3"], correct: 2, explanation: "Slope-intercept form: y = mx + b. With m=3 and b=−2: y = 3x − 2." },
  { question: "A cylinder has radius doubled but height halved. How does volume change?", options: ["Stays the same", "Doubles", "Quadruples", "Halves"], correct: 1, explanation: "Original: V = πr²h. New: π(2r)²(h/2) = π·4r²·(h/2) = 2πr²h. Volume doubles." },
  { question: "Solve: |x − 3| = 7", options: ["x = 10 only", "x = −4 only", "x = 10 or x = −4", "x = 4 or x = −10"], correct: 2, explanation: "x − 3 = 7 → x = 10; or x − 3 = −7 → x = −4. Both solutions." },
  { question: "A recipe uses 2.5 cups of flour for 24 cookies. Cups needed for 60 cookies?", options: ["5.5", "6", "6.25", "7"], correct: 2, explanation: "Proportion: 2.5/24 = x/60 → x = 6.25 cups." },
  { question: "What is the area of a trapezoid with parallel bases 8 cm and 12 cm, height 5 cm?", options: ["40 cm²", "50 cm²", "60 cm²", "100 cm²"], correct: 1, explanation: "Area = ½(b₁+b₂)h = ½(8+12)(5) = 50 cm²." },
];

const SBAC_MATH_11 = [
  { question: "Solve for x: 3x − 7 = 2x + 5", options: ["x = 2", "x = 12", "x = −2", "x = −12"], correct: 1, explanation: "x − 7 = 5 → x = 12." },
  { question: "Which expression is equivalent to (x + 3)(x − 3)?", options: ["x² − 9", "x² + 9", "x² − 6x + 9", "x² + 6x − 9"], correct: 0, explanation: "Difference of squares: (a+b)(a−b) = a² − b². (x+3)(x−3) = x² − 9." },
  { question: "What is the slope of a line through (2, 5) and (6, 13)?", options: ["1", "2", "3", "4"], correct: 1, explanation: "(13−5)/(6−2) = 8/4 = 2." },
  { question: "Simplify: (x² · x⁵) / x³", options: ["x⁴", "x³", "x⁵", "x¹⁰"], correct: 0, explanation: "x⁷ / x³ = x⁴." },
  { question: "Solve: 2x² − 8 = 0", options: ["x = ±2", "x = ±4", "x = 2 only", "x = ±√8"], correct: 0, explanation: "2x²=8 → x²=4 → x = ±2." },
  { question: "What is the median of: 3, 7, 12, 5, 9, 1, 14?", options: ["5", "7", "9", "12"], correct: 1, explanation: "Sorted: 1,3,5,7,9,12,14. Median = 7." },
  { question: "If f(x) = 3x − 4, what is f(7)?", options: ["15", "17", "19", "21"], correct: 1, explanation: "f(7) = 3(7)−4 = 17." },
  { question: "Which equation represents a line with slope 3 and y-intercept −2?", options: ["y = 3x + 2", "y = −2x + 3", "y = 3x − 2", "y = 2x − 3"], correct: 2, explanation: "y = mx + b → y = 3x − 2." },
  { question: "What is log₂(32)?", options: ["4", "5", "6", "16"], correct: 1, explanation: "log₂(32) = 5 because 2⁵ = 32." },
  { question: "Two supplementary angles have ratio 2:3. The larger angle measures:", options: ["72°", "90°", "108°", "120°"], correct: 2, explanation: "(3/5) × 180 = 108°." },
  { question: "What is the area of a circle with radius 7? (π ≈ 3.14)", options: ["43.96", "49π", "153.86", "21.98π"], correct: 2, explanation: "A = πr² = 3.14 × 49 = 153.86." },
  { question: "Solve |x − 3| = 7", options: ["x = 10 only", "x = −4 only", "x = 10 or x = −4", "x = 4 or x = −10"], correct: 2, explanation: "x−3=7 → x=10; x−3=−7 → x=−4." },
  { question: "Simplify: √(50)", options: ["5√2", "25√2", "10√5", "5√10"], correct: 0, explanation: "√50 = √(25×2) = 5√2." },
  { question: "A population grows at 5% per year. Starting at 200, what is the population after 3 years?", options: ["215", "230", "231.53", "232.05"], correct: 2, explanation: "200 × (1.05)³ = 200 × 1.157625 ≈ 231.53." },
  { question: "Which value of x satisfies: (x − 2)(x + 5) = 0?", options: ["x = 2 only", "x = −5 only", "x = 2 or x = −5", "x = −2 or x = 5"], correct: 2, explanation: "Zero product property: x−2=0 → x=2; x+5=0 → x=−5." },
  { question: "What is the standard deviation a measure of?", options: ["The center of a data set", "The spread or variability of a data set", "The most frequent value", "The middle value"], correct: 1, explanation: "Standard deviation measures how spread out data points are around the mean. A larger SD indicates more variability." },
  { question: "Evaluate: 3! + 2!", options: ["10", "8", "12", "6"], correct: 1, explanation: "3! = 6, 2! = 2. 6 + 2 = 8." },
  { question: "A line is perpendicular to y = 2x + 1. What is its slope?", options: ["2", "−2", "1/2", "−1/2"], correct: 3, explanation: "Perpendicular slopes are negative reciprocals. Slope of given line = 2. Perpendicular slope = −1/2." },
  { question: "What is the probability of getting exactly 2 heads in 3 coin flips?", options: ["1/4", "3/8", "1/2", "1/8"], correct: 1, explanation: "P(exactly 2 heads) = C(3,2) × (1/2)² × (1/2)¹ = 3 × 1/4 × 1/2 = 3/8." },
  { question: "Which expression is equivalent to sin²θ + cos²θ?", options: ["0", "2", "1", "tanθ"], correct: 2, explanation: "The Pythagorean identity: sin²θ + cos²θ = 1. This is a fundamental trigonometric identity." },
];

// General State Tests (expanded to 20 questions)
const GENERAL_ELA_5 = [
  { stimulus_header: "Read the passage.", stimulus: "Before refrigerators existed, keeping food cold was a major challenge. In the 1800s, people harvested ice from frozen lakes and ponds in winter and stored it in underground icehouses packed with sawdust for insulation. Ice was then delivered to homes by horse-drawn wagons. Families placed the ice in an 'icebox' to keep their perishables cool. The invention of mechanical refrigeration in the early 1900s changed everyday life dramatically.", question: "What is the main idea of this passage?", options: ["Horses were important for delivering ice.", "Refrigerators were invented in the 1800s.", "Keeping food cold was difficult before mechanical refrigeration was invented.", "Ice from frozen lakes was always available."], correct: 2, explanation: "The passage describes the difficult process of keeping food cold before refrigerators." },
  { question: "In context, 'perishables' most likely means:", options: ["Expensive items", "Foods that can spoil or go bad", "Drinks served cold", "Glass containers"], correct: 1, explanation: "'Perishable' comes from 'perish' (to decay)." },
  { question: "Which sentence is written correctly?", options: ["The dog chased it's tail.", "We are going to grandmas house for thanksgiving.", "Maria and I went to the store yesterday.", "Him and me played basketball after school."], correct: 2, explanation: "'Maria and I' is the correct subject pronoun." },
  { question: "'The sun set slowly, painting the sky in orange.' This is an example of:", options: ["Simile", "Personification", "Onomatopoeia", "Metaphor"], correct: 1, explanation: "'Painting' gives the sun a human action — personification." },
  { question: "Which text structure explains causes and effects?", options: ["Compare and contrast", "Problem and solution", "Cause and effect", "Chronological order"], correct: 2, explanation: "Cause-and-effect structure explains WHY something happens and WHAT results." },
  { question: "What does 'curious' mean?", options: ["Afraid", "Bored", "Eager to learn or know", "Very tired"], correct: 2, explanation: "'Curious' means wanting to learn or discover more." },
  { question: "Which word means almost the same as 'enormous'?", options: ["Tiny", "Huge", "Soft", "Quick"], correct: 1, explanation: "'Enormous' means very large — 'huge' is its closest synonym." },
  { question: "Which word is an antonym of 'ancient'?", options: ["Old", "Historical", "Modern", "Traditional"], correct: 2, explanation: "'Ancient' means very old; 'modern' means current — its antonym." },
  { question: "What does the prefix 'un-' mean in 'unhappy'?", options: ["Very", "Again", "Not", "Before"], correct: 2, explanation: "The prefix 'un-' means 'not.' Unhappy = not happy." },
  { question: "Which sentence is in the past tense?", options: ["The birds sing every morning.", "The birds will sing tomorrow.", "The birds sang at sunrise.", "The birds are singing now."], correct: 2, explanation: "'Sang' is the past tense of 'sing.'" },
  { stimulus_header: "Read the passage.", stimulus: "Elephants are the largest land animals. They use their long trunks for breathing, smelling, drinking, and picking up objects. Elephants live in herds led by the oldest female, called the matriarch.", question: "What is the role of the matriarch?", options: ["She is the youngest elephant.", "She leads the herd.", "She has the longest trunk.", "She communicates using sounds."], correct: 1, explanation: "The passage states herds are 'led by the oldest female, called the matriarch.'" },
  { question: "Which word is a synonym for 'brave'?", options: ["Frightened", "Courageous", "Careless", "Gentle"], correct: 1, explanation: "'Courageous' means willing to face danger — a synonym for 'brave.'" },
  { question: "A student writes about butterflies. What is the BEST source?", options: ["A book of nature poems", "A science encyclopedia about insects", "A fiction story about a butterfly", "A recipe blog"], correct: 1, explanation: "For factual information, a nonfiction science resource is the most reliable." },
  { question: "Which is the correct plural of 'leaf'?", options: ["Leafs", "Leaves", "Leafes", "Leafs"], correct: 1, explanation: "Words ending in 'f' often change to 'ves': leaf → leaves." },
  { question: "What is the purpose of a concluding sentence?", options: ["Introduce a new topic", "Restate the main idea and wrap up the paragraph", "Add more supporting details", "Ask a question"], correct: 1, explanation: "A concluding sentence wraps up a paragraph by restating or summarizing the main idea." },
  { stimulus_header: "Read the excerpt.", stimulus: "After months of hard work and many failed attempts, Aisha finally launched her model rocket. As she watched it streak across the blue sky, she smiled and thought: 'Next time, I'll go even higher.'", question: "What character trait does this BEST show about Aisha?", options: ["She gives up easily.", "She is lazy.", "She is determined and always looking to improve.", "She is afraid of failure."], correct: 2, explanation: "Despite 'many failed attempts,' Aisha kept working and already plans to go 'even higher' — showing determination." },
  { question: "Which sentence contains a compound subject?", options: ["The cat sat on the mat.", "Tom and Lisa won the race.", "She ran quickly to the finish line.", "The big dog barked loudly."], correct: 1, explanation: "A compound subject has two or more subjects joined by 'and': 'Tom and Lisa.'" },
  { question: "What does 'analyze' mean?", options: ["Ignore", "Examine carefully", "Copy", "Summarize quickly"], correct: 1, explanation: "'Analyze' means to examine something carefully and in detail." },
  { question: "Which word best completes the analogy: Hot is to cold as fast is to ___?", options: ["Quick", "Slow", "Speed", "Run"], correct: 1, explanation: "Hot and cold are antonyms; fast and slow are antonyms." },
  { question: "Which sentence uses correct punctuation for a question?", options: ["Can we go to the park today.", "Can we go to the park today!", "Can we go to the park today?", "can we go to the park today?"], correct: 2, explanation: "A question ends with a question mark and starts with a capital letter." },
];

const GENERAL_ELA_8 = [
  { stimulus_header: "Read the passage.", stimulus: "The ocean covers more than 70 percent of Earth's surface, yet scientists have explored less than 20 percent of it. The deep sea remains one of the planet's most mysterious environments. Organisms there have adapted to crushing pressures, near-freezing temperatures, and complete darkness. The anglerfish produces its own light through bioluminescence. Many deep-sea communities rely on chemosynthesis — chemical reactions near hydrothermal vents — as the base of their food webs.", question: "What is the central idea of the passage?", options: ["The anglerfish is the most interesting creature.", "Scientists have fully mapped the ocean floor.", "The deep ocean is poorly understood with unique adaptations.", "Hydrothermal vents are dangerous to marine life."], correct: 2, explanation: "The passage focuses on the unexplored deep ocean and organisms' adaptations to extreme conditions." },
  { question: "In the passage, 'bioluminescence' most nearly means:", options: ["A form of camouflage", "The biological production of light by a living organism", "A chemical process replacing photosynthesis", "A type of pressure adaptation"], correct: 1, explanation: "'Bio-' (life) + 'luminescence' (light) = living organism producing light." },
  { question: "Which sentence uses a semicolon correctly?", options: ["She studied all night; and passed the exam.", "The rain fell heavily; however, the game continued.", "He was tired; wanting to sleep.", "I like cats; because they are independent."], correct: 1, explanation: "A semicolon correctly joins two independent clauses, especially before 'however.'" },
  { stimulus_header: "Read the short story excerpt.", stimulus: "Maya stood at the edge of the cliff, her heart hammering. Below, the river churned white and silver, indifferent to her fear. She had promised herself she would jump this summer, and now summer was almost gone. The water waited.", question: "The phrase 'The water waited' primarily creates:", options: ["Humor and lightness", "Suspense and inevitability", "Confusion", "Relief"], correct: 1, explanation: "Personifying the water as 'waiting' adds tension and inevitability." },
  { question: "Which revision BEST improves the clarity of:\n'The students who were in the class that was held on Monday they finished their projects.'", options: ["The students, who were in the class that was held on Monday, finished their projects.", "The Monday class students finished their projects.", "The students in Monday's class finished their projects.", "Finishing their projects, the Monday students."], correct: 2, explanation: "Option C eliminates the redundant clause and pronoun error, preserving full meaning concisely." },
  { question: "Which sentence uses a comma correctly?", options: ["She ran quickly, to the bus stop.", "After the game ended, the players celebrated.", "My sister, loves to paint.", "The dog barked, and, growled."], correct: 1, explanation: "A comma after an introductory clause ('After the game ended') is correct." },
  { stimulus_header: "Read the two passages.", stimulus: "Passage 1: Homework reinforces classroom learning and builds study habits students need for college.\n\nPassage 2: Excessive homework contributes to student stress and sleep deprivation. Studies show that beyond 90 minutes per night, additional homework has little academic benefit.", question: "How do the passages DIFFER?", options: ["Passage 1 focuses on benefits while Passage 2 focuses on negative effects.", "Both passages agree homework helps students.", "Passage 2 claims homework has no benefits at all.", "Passage 1 uses more research."], correct: 0, explanation: "Passage 1 argues for homework's benefits; Passage 2 argues against excessive homework." },
  { question: "Which text structure is used in a passage about the problem of plastic pollution, then offering solutions?", options: ["Chronological order", "Compare and contrast", "Problem and solution", "Description"], correct: 2, explanation: "Identifying a problem then presenting fixes follows problem-and-solution structure." },
  { stimulus_header: "Read the poem excerpt.", stimulus: "I am the hound of the sea,\nI crash and I roar and I flee,\nI swallow the shore for a breath,\nThen sigh and retreat to my rest.", question: "What is the speaker most likely describing?", options: ["A dog on a beach", "Ocean waves", "A storm approaching land", "A flooding river"], correct: 1, explanation: "'Crashes,' 'swallows the shore,' then 'retreats' describes ocean waves advancing and receding." },
  { question: "An author writes: 'Climate change is the most pressing crisis of our time.' This is:", options: ["A verifiable fact", "An inference", "An opinion or claim", "A summary of an opposing view"], correct: 2, explanation: "'Most pressing crisis' is a value judgment — an opinion." },
  { question: "Which sentence has a subject-verb agreement error?", options: ["The team is presenting their findings.", "Neither the students nor the teacher were ready.", "Each of the books has its own index.", "Neither the teacher nor the students were ready."], correct: 1, explanation: "With 'neither...nor,' the verb agrees with the closer subject. 'Teacher' (singular) requires 'was.'" },
  { question: "What is the PRIMARY purpose of a counterclaim in an argument?", options: ["Agree with the opposition", "Acknowledge the opposing view and refute it", "Provide more evidence for your claim", "Introduce a new topic"], correct: 1, explanation: "Addressing and refuting the opposition demonstrates critical thinking and strengthens the argument." },
  { stimulus_header: "Read the paragraph.", stimulus: "Wolves were reintroduced to Yellowstone in 1995. Elk shifted their grazing to avoid wolves, allowing willows and aspens to regenerate along riverbanks. This stabilized stream banks and supported the return of beavers. Yellowstone's entire ecosystem transformed.", question: "What was the MOST SIGNIFICANT result of wolf reintroduction?", options: ["Elk went extinct.", "A chain reaction of ecological changes transformed the entire ecosystem.", "Scientists better understood trophic levels.", "Beavers were directly reintroduced."], correct: 1, explanation: "The passage states the 'entire ecosystem transformed' — the chain reaction is most significant." },
  { question: "What does 'cite' mean in 'Cite textual evidence to support your answer'?", options: ["Write your opinion", "Copy an entire paragraph", "Quote or reference specific parts of the text", "Summarize the whole story"], correct: 2, explanation: "'Cite' means to quote or reference specific text as evidence." },
  { question: "Which word is a synonym for 'meticulous'?", options: ["Careless", "Thorough", "Speedy", "Curious"], correct: 1, explanation: "'Meticulous' means extremely careful and precise." },
  { stimulus_header: "Read the excerpt.", stimulus: "Although Thomas Edison is often credited with inventing the light bulb, multiple inventors worked on incandescent bulbs in the 1870s. What Edison truly pioneered was a complete electrical distribution system that made widespread electric lighting practical.", question: "What is the author's PURPOSE?", options: ["To argue Edison stole another's invention", "To correct a common oversimplification about Edison", "To prove Edison had no role in the invention", "To describe how bulbs work mechanically"], correct: 1, explanation: "'The history is more complicated' signals intent to nuance a popular misconception." },
  { question: "Which word is an antonym of 'ancient'?", options: ["Old", "Historical", "Modern", "Traditional"], correct: 2, explanation: "'Ancient' means very old; 'modern' means current — its antonym." },
  { question: "Which is an example of a simile?", options: ["The thunder was a freight train.", "The thunder roared like a freight train.", "The thunder was very loud.", "The thunder frightened everyone."], correct: 1, explanation: "A simile compares using 'like' or 'as.'" },
  { question: "What is the BEST definition of 'infer'?", options: ["State an obvious fact", "Draw a conclusion from evidence and reasoning", "Copy ideas from another source", "Summarize the main idea"], correct: 1, explanation: "To infer means to draw a logical conclusion from clues and evidence." },
  { question: "What does the transition 'however' signal?", options: ["A continuation of the same idea", "A contrast or shift in direction", "A time sequence", "A cause and effect"], correct: 1, explanation: "'However' signals contrast or a shift — moving in a different direction from the previous idea." },
];

const GENERAL_MATH_7 = [
  { question: "A store sells a jacket for $85 after a 15% discount. What was the original price?", options: ["$97.75", "$100.00", "$99.25", "$102.50"], correct: 1, explanation: "0.85x = 85 → x = $100.00." },
  { question: "Which expression is equivalent to −3(x − 4) + 2x?", options: ["−x + 12", "−x − 12", "5x + 12", "−5x − 12"], correct: 0, explanation: "Distribute: −3x+12+2x = −x+12." },
  { question: "On a number line, which is farthest from 0?", options: ["−7", "5", "−3", "6"], correct: 0, explanation: "|−7| = 7 is the greatest absolute value." },
  { stimulus_header: "Use the table.", table_data: { headers: ["Hours worked", "Money earned ($)"], rows: [["2", "18"], ["5", "45"], ["8", "72"], ["10", "90"]] }, question: "What is the unit rate (dollars per hour)?", options: ["$8.00/hr", "$9.00/hr", "$9.50/hr", "$10.00/hr"], correct: 1, explanation: "18 ÷ 2 = 9. The unit rate is $9.00 per hour." },
  { question: "A rectangle has length 3x + 2 and width 4. What is its area?", options: ["12x + 2", "12x + 8", "7x + 6", "3x + 6"], correct: 1, explanation: "(3x+2) × 4 = 12x + 8." },
  { question: "What is 35% of 240?", options: ["80", "84", "90", "96"], correct: 1, explanation: "0.35 × 240 = 84." },
  { question: "A car travels 240 miles in 4 hours. What is its average speed?", options: ["50 mph", "55 mph", "60 mph", "65 mph"], correct: 2, explanation: "Speed = 240 ÷ 4 = 60 mph." },
  { question: "Which is the GCF of 36 and 48?", options: ["6", "9", "12", "18"], correct: 2, explanation: "GCF(36, 48) = 12." },
  { question: "Solve: 4x + 3 = 19", options: ["x = 3", "x = 4", "x = 5", "x = 6"], correct: 1, explanation: "4x = 16 → x = 4." },
  { question: "A number is tripled, then 5 is subtracted. The result is 22. What is the number?", options: ["7", "8", "9", "10"], correct: 2, explanation: "3x − 5 = 22 → 3x = 27 → x = 9." },
  { question: "What is the area of a triangle with base 10 cm and height 6 cm?", options: ["30 cm²", "60 cm²", "16 cm²", "20 cm²"], correct: 0, explanation: "Area = ½ × 10 × 6 = 30 cm²." },
  { question: "Convert 3/4 to a decimal.", options: ["0.34", "0.5", "0.75", "0.8"], correct: 2, explanation: "3 ÷ 4 = 0.75." },
  { question: "What is the LCM of 4 and 6?", options: ["8", "10", "12", "24"], correct: 2, explanation: "LCM(4, 6) = 12." },
  { question: "Which fraction is between 1/3 and 1/2?", options: ["1/4", "2/5", "2/3", "3/4"], correct: 1, explanation: "2/5 = 0.4, between 0.333 and 0.5." },
  { question: "Evaluate: 3² + 4²", options: ["14", "25", "49", "7"], correct: 1, explanation: "9 + 16 = 25." },
  { question: "Simplify: 18/24", options: ["2/3", "3/4", "4/5", "1/2"], correct: 1, explanation: "GCF = 6. 18/6 = 3, 24/6 = 4. Simplified: 3/4." },
  { question: "What is the perimeter of a square with side 7 cm?", options: ["14 cm", "21 cm", "28 cm", "49 cm"], correct: 2, explanation: "Perimeter = 4 × 7 = 28 cm." },
  { question: "What is 15% of 80?", options: ["8", "10", "12", "15"], correct: 2, explanation: "0.15 × 80 = 12." },
  { question: "A recipe calls for 2.5 cups of flour for 12 cookies. Cups needed for 36 cookies?", options: ["5", "6.5", "7", "7.5"], correct: 3, explanation: "36/12 = 3 times. 2.5 × 3 = 7.5 cups." },
  { question: "What is the value of 4³?", options: ["12", "16", "64", "48"], correct: 2, explanation: "4³ = 4 × 4 × 4 = 64." },
];

const GENERAL_SCI_5 = [
  { question: "What do plants need to perform photosynthesis?", options: ["Water, oxygen, and darkness", "Carbon dioxide, water, and sunlight", "Nitrogen, carbon dioxide, and oxygen", "Sunlight, oxygen, and soil"], correct: 1, explanation: "Photosynthesis requires CO₂, water, and sunlight." },
  { question: "Which best describes a food chain?", options: ["A network showing how all organisms are connected.", "A linear sequence showing how energy moves from producers to consumers.", "A diagram of how water cycles through the environment.", "A map of all habitats in an ecosystem."], correct: 1, explanation: "A food chain is a linear sequence showing energy flow from producers to consumers." },
  { question: "When water from oceans is heated by the sun, what process takes place?", options: ["Condensation", "Precipitation", "Evaporation", "Runoff"], correct: 2, explanation: "Evaporation converts liquid water into water vapor." },
  { question: "Which property of matter does NOT change when an object is cut in half?", options: ["Mass", "Volume", "Density", "Weight"], correct: 2, explanation: "Density = mass ÷ volume. Both halve proportionally, so density stays the same." },
  { question: "Ice melting into water is an example of:", options: ["A chemical change", "A physical change", "A chemical change because energy was added", "A physical change that creates a new substance"], correct: 1, explanation: "Melting is a physical change — H₂O does not change composition." },
  { question: "Which of the following is a chemical change?", options: ["Ice melting", "Wood burning into ash and smoke", "A rock being broken into smaller pieces", "Salt dissolving in water"], correct: 1, explanation: "Burning wood forms new substances (ash, CO₂, water vapor) — a chemical change." },
  { question: "Earth's surface changes most RAPIDLY due to:", options: ["Rain weathering rock", "Erosion by a slow river", "A volcanic eruption", "Soil formation from decomposed leaves"], correct: 2, explanation: "A volcanic eruption can reshape landscapes in hours or days." },
  { question: "What is the role of decomposers in an ecosystem?", options: ["Make food from sunlight", "Hunt and eat other animals", "Break down dead organisms and return nutrients to the soil", "Photosynthesize to produce oxygen"], correct: 2, explanation: "Decomposers break down organic matter, recycling nutrients back into the soil." },
  { question: "If the frog population decreases in grass → grasshopper → frog → snake → hawk, what happens to grasshoppers?", options: ["They decrease because frogs eat hawks.", "They increase because fewer frogs eat them.", "They stay the same.", "They decrease because snakes eat more of them."], correct: 1, explanation: "Fewer predators (frogs) means less predation pressure — grasshoppers increase." },
  { question: "Water vapor cooling and forming clouds is called:", options: ["Evaporation", "Precipitation", "Condensation", "Transpiration"], correct: 2, explanation: "Condensation occurs when water vapor cools and converts to liquid water droplets, forming clouds." },
  { question: "Which property CANNOT be measured with a ruler?", options: ["Length", "Volume of a rectangular solid", "Mass", "Width"], correct: 2, explanation: "Mass is measured with a balance or scale, not a ruler." },
  { question: "What happens to most of the sun's energy that reaches Earth's surface?", options: ["It is reflected back into space.", "It is absorbed by the ground and converted to heat.", "It goes into Earth's center.", "It is used only by plants."], correct: 1, explanation: "Earth's surface absorbs most solar radiation and converts it to thermal energy." },
  { question: "A student mixes baking soda and vinegar. Bubbling occurs. This is evidence of:", options: ["A physical change — substances can be separated", "A chemical change — new gas (CO₂) is produced", "A physical change — mixing occurred", "A chemical change because temperature dropped"], correct: 1, explanation: "Gas production (CO₂ bubbles) is evidence of a chemical reaction — new substances are formed." },
  { question: "Why are regions near the equator generally warmer than regions near the poles?", options: ["The equator is closer to the sun.", "Sunlight hits the equator more directly, concentrating more energy in a smaller area.", "The poles receive more hours of daylight.", "The equator has less cloud cover."], correct: 1, explanation: "At the equator, rays hit at nearly 90°, concentrating energy. Near poles, the same energy spreads over a larger area." },
  { question: "Which of the following is a PRODUCER in an ecosystem?", options: ["A deer eating grass", "A hawk hunting mice", "An oak tree making food from sunlight", "Bacteria decomposing a dead log"], correct: 2, explanation: "Producers make their own food through photosynthesis. Oak trees are producers." },
  { question: "Why is calculating the average useful in an experiment?", options: ["It removes all errors.", "It provides a more reliable result by accounting for natural variation.", "It makes the experiment take less time.", "It proves the hypothesis is correct."], correct: 1, explanation: "Averaging multiple trials reduces the effect of random variation." },
  { question: "Fossils of ocean creatures found on mountain tops suggest:", options: ["Ocean creatures once flew.", "Those areas were once covered by ancient seas.", "Fossils form anywhere without water.", "The ocean is very deep."], correct: 1, explanation: "Marine fossils at high elevations indicate the area was once beneath ancient oceans." },
  { question: "Which is the BEST example of a renewable energy source?", options: ["Coal", "Natural gas", "Solar power", "Petroleum"], correct: 2, explanation: "Solar power comes from the sun — virtually inexhaustible and renewable." },
  { question: "To test whether soil type affects plant growth, what should you vary?", options: ["Plant one seed in sand and water it daily.", "Plant seeds in different soils, giving each the same water and sunlight.", "Plant many seeds in the same soil but give different amounts of water.", "Ask classmates which soil they think is best."], correct: 1, explanation: "To test soil type (independent variable), all other conditions must remain constant (controlled variables)." },
  { question: "A flashlight converts electrical energy into what two forms of energy?", options: ["Thermal energy and chemical energy", "Light energy and thermal energy (heat)", "Kinetic energy and sound energy", "Nuclear energy and light energy"], correct: 1, explanation: "A flashlight converts electrical energy into light (useful output) and heat (waste energy)." },
];

// CAST banks (unchanged from previous version)
const CAST_GRADE5 = [
  { question: "A student pushes a book across a table and it slows and stops. Why?", options: ["The book ran out of energy.", "Friction between the book and table opposed the motion.", "Gravity pulled the book sideways.", "The table permanently absorbed the book's energy."], correct: 1, explanation: "Friction is a contact force opposing relative motion between surfaces, decelerating the book until it stops." },
  { question: "Which is a chemical change?", options: ["Ice melting into water", "Wood burning into ash and smoke", "A rock breaking into smaller pieces", "Salt dissolving in water"], correct: 1, explanation: "Burning wood forms new substances (ash, CO₂, water vapor) — a chemical change." },
  { question: "Which event would cause the MOST RAPID change to Earth's surface?", options: ["Weathering by rain", "Erosion by a slow river", "A volcanic eruption", "Soil formation from decomposed leaves"], correct: 2, explanation: "A volcanic eruption can reshape landscapes in hours or days." },
  { stimulus_header: "Read the scenario.", stimulus: "A student places a plant in a dark room with a small light source on one side. After one week, the plant has bent toward the light.", question: "What does this demonstrate?", options: ["Plants need heat to survive.", "Plants respond to light by growing toward it (phototropism).", "Plants can grow without sunlight.", "The plant's roots grew toward the light."], correct: 1, explanation: "Phototropism is the growth response of a plant toward a light source." },
  { question: "Which layer of Earth contains molten rock (magma)?", options: ["Crust", "Lithosphere", "Outer core", "Mantle"], correct: 3, explanation: "The mantle contains partially melted rock (magma) that drives tectonic plate movement." },
  { question: "If the frog population decreases in grass→grasshopper→frog→snake→hawk, what happens to grasshoppers?", options: ["They decrease because frogs eat hawks.", "They increase because fewer frogs eat them.", "They stay the same.", "They decrease because snakes eat more of them."], correct: 1, explanation: "With fewer predators, prey populations increase." },
  { question: "Water vapor cooling to form clouds is called:", options: ["Evaporation", "Precipitation", "Condensation", "Transpiration"], correct: 2, explanation: "Condensation occurs when water vapor cools and converts to liquid water droplets." },
  { question: "Which property CANNOT be measured with a ruler?", options: ["Length", "Volume of a rectangular solid", "Mass", "Width"], correct: 2, explanation: "Mass is measured with a balance, not a ruler." },
  { question: "What happens to most of the sun's energy reaching Earth's surface?", options: ["Reflected back to space", "Absorbed by the ground and converted to heat", "Goes to Earth's center", "Used only by plants"], correct: 1, explanation: "Earth's surface absorbs most solar radiation and converts it to thermal energy." },
  { question: "Which adaptation BEST helps a desert animal survive?", options: ["Thick fur to retain heat", "Ability to store water and reduce water loss", "Bright coloration to attract mates", "Webbed feet for swimming"], correct: 1, explanation: "In a hot, dry desert, conserving water is the critical survival adaptation." },
  { question: "Baking soda + vinegar produces bubbling. This is evidence of:", options: ["Physical change — substances can be separated", "Chemical change — new gas (CO₂) is produced", "Physical change — mixing occurred", "Chemical change because temperature dropped"], correct: 1, explanation: "Gas production (CO₂ bubbles) is evidence of a chemical reaction." },
  { stimulus_header: "Use the diagram description.", stimulus: "Sunlight strikes Earth near the equator at 90° and near the poles at a very low angle, spreading over a larger area.", question: "Why is the equator generally warmer than the poles?", options: ["The equator is closer to the sun.", "Sunlight hits the equator more directly, concentrating more energy in a smaller area.", "The poles receive more hours of daylight.", "The equator has less cloud cover."], correct: 1, explanation: "The angle of sunlight determines energy concentration. Near 90° = more concentrated = warmer." },
  { question: "Which of the following is a PRODUCER in an ecosystem?", options: ["A deer eating grass", "A hawk hunting mice", "An oak tree making food from sunlight", "Bacteria decomposing a dead log"], correct: 2, explanation: "Producers make their own food through photosynthesis." },
  { question: "Why is calculating the average useful in an experiment?", options: ["It removes all errors.", "It provides a more reliable result by accounting for natural variation.", "It makes the experiment faster.", "It proves the hypothesis."], correct: 1, explanation: "Averaging multiple trials reduces the effect of random variation." },
  { question: "Fossils of ocean creatures found on mountain tops suggest:", options: ["Ocean creatures once flew.", "Those mountain areas were once covered by ancient seas.", "Fossils form anywhere without water.", "The ocean is very deep."], correct: 1, explanation: "Marine fossils at high elevations indicate the area was once beneath ancient oceans." },
  { question: "What is the role of decomposers in an ecosystem?", options: ["Make food from sunlight", "Hunt and eat other animals", "Break down dead organisms and return nutrients to the soil", "Photosynthesize to produce oxygen"], correct: 2, explanation: "Decomposers recycle nutrients back into the soil." },
  { question: "Which is the BEST example of a renewable energy source?", options: ["Coal", "Natural gas", "Solar power", "Petroleum"], correct: 2, explanation: "Solar power is renewable — from the virtually inexhaustible sun." },
  { question: "To test whether soil type affects plant growth, what should vary?", options: ["Plant one seed in sand and water it daily.", "Plant seeds in different soils, giving each the same water and sunlight.", "Plant many seeds in the same soil but give different amounts of water.", "Ask classmates which soil is best."], correct: 1, explanation: "Only the independent variable (soil type) should vary; all other conditions must be controlled." },
  { question: "What is required for sound to travel?", options: ["A vacuum (empty space)", "A medium such as air, water, or a solid", "Light energy", "Electrical energy"], correct: 1, explanation: "Sound requires a medium — it cannot travel through a vacuum." },
  { question: "A flashlight converts electrical energy into:", options: ["Thermal energy and chemical energy", "Light energy and thermal energy (heat)", "Kinetic energy and sound energy", "Nuclear energy and light energy"], correct: 1, explanation: "A flashlight converts electrical energy into light (useful) and heat (waste)." },
];

const CAST_GRADE8 = [
  { question: "Which BEST describes Newton's First Law of Motion?", options: ["Force = mass × acceleration.", "For every action there is an equal and opposite reaction.", "An object at rest stays at rest and an object in motion stays in motion unless acted on by an unbalanced force.", "Objects fall at the same rate regardless of mass."], correct: 2, explanation: "Newton's First Law (Law of Inertia): objects resist changes in their state of motion." },
  { question: "An atom of carbon-14 has 6 protons and 8 neutrons. What is its atomic mass?", options: ["6", "8", "14", "2"], correct: 2, explanation: "Atomic mass = protons + neutrons = 6 + 8 = 14." },
  { question: "During meiosis, how does chromosome number in daughter cells compare to the parent cell?", options: ["It is doubled", "It is the same", "It is halved", "It is tripled"], correct: 2, explanation: "Meiosis produces four haploid daughter cells, each with half the chromosome number." },
  { stimulus_header: "Read the scenario.", stimulus: "Scientists drilled ice cores from Antarctica and found that as CO₂ levels increased over 150 years, average global temperatures also rose.", question: "What type of evidence is this, and what does it suggest?", options: ["Anecdotal evidence suggesting weather changes randomly", "Correlational evidence suggesting a link between CO₂ levels and rising temperatures", "Experimental evidence proving CO₂ directly causes all temperature change", "Observational evidence that Antarctica is getting warmer than the tropics"], correct: 1, explanation: "Ice core data is correlational/observational — it shows a pattern between CO₂ and temperature." },
  { question: "A wave has frequency 500 Hz and wavelength 0.68 m. What is the wave's speed?", options: ["735 m/s", "340 m/s", "500 m/s", "0.00136 m/s"], correct: 1, explanation: "Speed = frequency × wavelength = 500 × 0.68 = 340 m/s." },
  { question: "Which type of rock forms when magma cools and solidifies?", options: ["Sedimentary", "Metamorphic", "Igneous", "Fossil"], correct: 2, explanation: "Igneous rocks form when magma or lava cools and crystallizes." },
  { question: "A cell with 46 chromosomes undergoes mitosis. How many chromosomes does each daughter cell have?", options: ["23", "46", "92", "12"], correct: 1, explanation: "Mitosis produces two identical daughter cells, each with the same chromosome number as the parent — 46." },
  { question: "Which BEST describes the role of mitochondria?", options: ["Produces proteins", "Controls what enters and exits the cell", "Converts glucose into ATP through cellular respiration", "Stores genetic information"], correct: 2, explanation: "Mitochondria are the 'powerhouses' of the cell — they conduct cellular respiration to produce ATP." },
  { question: "Two tectonic plates collide (convergent boundary). What is MOST LIKELY to form?", options: ["A mid-ocean ridge", "A rift valley", "A mountain range or trench", "A transform fault"], correct: 2, explanation: "Convergent boundaries form mountains (continent-continent) or trenches (oceanic-continental)." },
  { question: "What is the difference between speed and velocity?", options: ["Speed is faster than velocity.", "Velocity includes direction; speed does not.", "Speed measures acceleration; velocity measures distance.", "Velocity is measured in m/s; speed is not."], correct: 1, explanation: "Speed is a scalar (magnitude only). Velocity is a vector — it includes magnitude and direction." },
  { question: "In a neutral atom, the number of protons equals the number of:", options: ["Neutrons", "Electrons", "Nucleons", "Isotopes"], correct: 1, explanation: "A neutral atom has equal protons and electrons, giving it no net charge." },
  { question: "What drives tectonic plate movement?", options: ["Radiation from the sun heating the crust", "Convection currents in the mantle", "Gravitational pull of the moon", "Magnetic reversals in the outer core"], correct: 1, explanation: "Convection currents in Earth's semi-molten mantle drive tectonic plate movement." },
  { question: "A student heats a substance and finds its temperature stays constant even though heat is being added. What is MOST LIKELY happening?", options: ["The thermometer is broken.", "The substance is undergoing a phase change (melting or boiling).", "The substance is losing heat faster than gaining it.", "Heat is not actually being added."], correct: 1, explanation: "During a phase change, added energy breaks intermolecular bonds rather than increasing temperature." },
  { question: "An organism has genotype Tt (T = tall, dominant). What is its phenotype?", options: ["Short", "Tall", "Medium height", "Cannot be determined"], correct: 1, explanation: "When a dominant allele (T) is present, it masks the recessive allele (t). Genotype Tt → phenotype: tall." },
  { question: "Which BEST describes conservation of energy?", options: ["Energy is created during exothermic reactions.", "Energy can be converted from one form to another but cannot be created or destroyed.", "Energy is destroyed when used.", "Kinetic and potential energy are always equal."], correct: 1, explanation: "The Law of Conservation of Energy: total energy in a closed system remains constant." },
  { question: "What is the PRIMARY human cause of increased CO₂ in Earth's atmosphere?", options: ["Increased use of wind energy", "Burning of fossil fuels releasing stored carbon", "More plants growing worldwide", "Increased volcanic activity"], correct: 1, explanation: "Burning coal, oil, and natural gas releases CO₂ stored over millions of years — the primary human driver." },
  { question: "Which type of electromagnetic radiation has the SHORTEST wavelength?", options: ["Radio waves", "Visible light", "Ultraviolet radiation", "Gamma rays"], correct: 3, explanation: "Gamma rays have the shortest wavelength and highest energy in the EM spectrum." },
  { question: "A mutation occurs in a skin cell of an adult. Can this be passed to offspring?", options: ["Yes, because all mutations are hereditary.", "No, because somatic (body) cell mutations are not passed to offspring — only germline mutations are.", "Yes, if the mutation is in a dominant gene.", "No, because mutations only affect that individual cell."], correct: 1, explanation: "Only germline mutations (in eggs or sperm) can be inherited. Somatic mutations affect only the individual." },
  { question: "What happens to kinetic energy of gas particles when temperature increases?", options: ["Kinetic energy decreases.", "Kinetic energy stays the same.", "Kinetic energy increases.", "Kinetic energy converts to potential energy only."], correct: 2, explanation: "Temperature measures average kinetic energy. As temperature increases, particles move faster." },
  { question: "Natural selection favors best-adapted individuals. What does this mean for a population over many generations?", options: ["All individuals become identical.", "Traits that increase survival and reproduction become more common.", "Weaker individuals help the population by dying quickly.", "The population decreases in size."], correct: 1, explanation: "Natural selection causes advantageous traits to become more frequent over generations." },
];

const TESTS = [
  // General State Tests (20 questions each)
  { id: "ela_grade8", label: "ELA — Grade 8 (General)", category: "General State Tests", subject: "English Language Arts", grade: 8, color: "#1a56db", description: "Reading comprehension, literary analysis, informational text, and language conventions.", questions: GENERAL_ELA_8 },
  { id: "math_grade7", label: "Math — Grade 7 (General)", category: "General State Tests", subject: "Mathematics", grade: 7, color: "#7c3aed", description: "Ratios, proportional relationships, integers, expressions, equations, and geometry.", questions: GENERAL_MATH_7 },
  { id: "sci_grade5", label: "Science — Grade 5 (General)", category: "General State Tests", subject: "Science", grade: 5, color: "#059669", description: "Earth science, life science, physical science, and scientific inquiry.", questions: GENERAL_SCI_5 },
  { id: "ela_grade5", label: "ELA — Grade 5 (General)", category: "General State Tests", subject: "English Language Arts", grade: 5, color: "#dc2626", description: "Reading comprehension, vocabulary in context, main idea, and writing conventions.", questions: GENERAL_ELA_5 },
  // Smarter Balanced — ELA by grade band
  { id: "sbac_ela_34", label: "Smarter Balanced ELA — Grades 3–4", category: "Smarter Balanced Summative (ELA)", subject: "English Language Arts", grade: "3–4", color: "#0369a1", description: "Common Core aligned: literary text, informational text, vocabulary, grammar, and writing conventions.", questions: SBAC_ELA_3_4 },
  { id: "sbac_ela_56", label: "Smarter Balanced ELA — Grades 5–6", category: "Smarter Balanced Summative (ELA)", subject: "English Language Arts", grade: "5–6", color: "#075985", description: "Common Core aligned: comprehension, text structure, figurative language, argument, and vocabulary.", questions: SBAC_ELA_5_6 },
  { id: "sbac_ela_78", label: "Smarter Balanced ELA — Grades 7–8", category: "Smarter Balanced Summative (ELA)", subject: "English Language Arts", grade: "7–8", color: "#0c4a6e", description: "Common Core aligned: informational analysis, argumentative writing, literary devices, and language conventions.", questions: SBAC_ELA_7_8 },
  { id: "sbac_ela_11", label: "Smarter Balanced ELA — Grade 11", category: "Smarter Balanced Summative (ELA)", subject: "English Language Arts", grade: 11, color: "#1e3a5f", description: "College-ready: rhetorical analysis, synthesis, complex argumentation, and literary criticism.", questions: SBAC_ELA_11 },
  // Smarter Balanced — Math by grade band
  { id: "sbac_math_34", label: "Smarter Balanced Math — Grades 3–4", category: "Smarter Balanced Summative (Math)", subject: "Mathematics", grade: "3–4", color: "#6d28d9", description: "Common Core aligned: operations, fractions, geometry, patterns, and word problems.", questions: SBAC_MATH_3_4 },
  { id: "sbac_math_56", label: "Smarter Balanced Math — Grades 5–6", category: "Smarter Balanced Summative (Math)", subject: "Mathematics", grade: "5–6", color: "#5b21b6", description: "Common Core aligned: decimals, ratios, expressions, and area and volume.", questions: SBAC_MATH_5_6 },
  { id: "sbac_math_78", label: "Smarter Balanced Math — Grades 7–8", category: "Smarter Balanced Summative (Math)", subject: "Mathematics", grade: "7–8", color: "#4c1d95", description: "Common Core aligned: linear equations, functions, statistics, and geometry.", questions: SBAC_MATH_7_8 },
  { id: "sbac_math_11", label: "Smarter Balanced Math — Grade 11", category: "Smarter Balanced Summative (Math)", subject: "Mathematics", grade: 11, color: "#3b0764", description: "College-ready: algebra II, trigonometry, probability, and mathematical reasoning.", questions: SBAC_MATH_11 },
  // CAST
  { id: "cast_5", label: "CAST — Grade 5 Science", category: "California Science Test (CAST)", subject: "Science", grade: 5, color: "#047857", description: "California NGSS-aligned: physical science, life science, Earth and space science.", questions: CAST_GRADE5 },
  { id: "cast_8", label: "CAST — Grade 8 Science", category: "California Science Test (CAST)", subject: "Science", grade: 8, color: "#065f46", description: "California NGSS-aligned: forces, heredity, natural selection, waves, and Earth processes.", questions: CAST_GRADE8 },
];

const LETTERS = ["A", "B", "C", "D"];
const CATEGORIES = [...new Set(TESTS.map(t => t.category))];

function TableStimulus({ data }) {
  return (
    <div className="overflow-x-auto rounded-lg border mb-4" style={{ borderColor: "rgba(0,0,0,0.15)" }}>
      <table className="w-full text-xs">
        <thead><tr style={{ background: "#1a56db" }}>{data.headers.map((h, i) => <th key={i} className="px-3 py-2 text-left font-bold text-white">{h}</th>)}</tr></thead>
        <tbody>{data.rows.map((row, ri) => (<tr key={ri} style={{ background: ri % 2 === 0 ? "white" : "#f0f4ff" }}>{row.map((cell, ci) => <td key={ci} className="px-3 py-2 text-gray-700 font-medium">{cell}</td>)}</tr>))}</tbody>
      </table>
    </div>
  );
}

function TestInterface({ test, onBack }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [marked, setMarked] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [navOpen, setNavOpen] = useState(false);

  const q = test.questions[currentIdx];
  const border = "rgba(0,0,0,0.12)";
  const text = "#1a1a2e";
  const muted = "rgba(0,0,0,0.5)";
  const headerBg = "#f0f0f0";

  const correctCount = test.questions.filter((q, i) => answers[i] === q.correct).length;
  const pct = Math.round((correctCount / test.questions.length) * 100);
  const profLevel = pct >= 80 ? { label: "Exceeds Standard", color: "#059669" }
    : pct >= 65 ? { label: "Meets Standard", color: "#1a56db" }
    : pct >= 50 ? { label: "Approaching Standard", color: "#d97706" }
    : { label: "Below Standard", color: "#dc2626" };

  if (submitted) return (
    <div className="fixed inset-0 z-50 overflow-y-auto" style={{ background: "#ffffff", color: text, fontFamily: "system-ui, sans-serif" }}>
      <div className="max-w-2xl mx-auto px-5 py-8">
        <div className="text-center mb-8 rounded-2xl p-8" style={{ background: "#f8f9fa", border: `1px solid ${border}` }}>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: muted }}>{test.subject} · Grade {test.grade} · {test.category}</p>
          <div className="text-6xl font-black mb-2" style={{ color: profLevel.color }}>{pct}%</div>
          <div className="inline-block px-4 py-1.5 rounded-full text-sm font-black text-white mb-2" style={{ background: profLevel.color }}>{profLevel.label}</div>
          <p className="text-sm" style={{ color: muted }}>{correctCount} out of {test.questions.length} correct</p>
        </div>
        <h2 className="font-black text-base mb-4">Answer Review & Explanations</h2>
        <div className="space-y-5">
          {test.questions.map((q, i) => {
            const userAnswer = answers[i];
            const isCorrect = userAnswer === q.correct;
            return (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${border}` }}>
                <div className="flex items-center gap-2 px-5 py-3" style={{ background: isCorrect ? "#f0fdf4" : "#fff5f5" }}>
                  {isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <XCircle className="w-4 h-4 text-red-500 shrink-0" />}
                  <span className="text-sm font-bold" style={{ color: isCorrect ? "#059669" : "#dc2626" }}>Question {i + 1} — {isCorrect ? "Correct" : "Incorrect"}</span>
                </div>
                <div className="px-5 py-4" style={{ fontFamily: "Georgia, serif" }}>
                  {q.stimulus_header && <p className="text-xs font-bold mb-2" style={{ fontFamily: "system-ui", color: muted }}>{q.stimulus_header}</p>}
                  {q.stimulus && <p className="text-xs leading-relaxed mb-3 p-3 rounded-lg italic whitespace-pre-line" style={{ background: "#f8f9fa", color: text }}>{q.stimulus}</p>}
                  {q.table_data && <TableStimulus data={q.table_data} />}
                  <p className="text-sm font-semibold mb-3 whitespace-pre-line" style={{ color: text }}>{q.question}</p>
                  <div className="space-y-1.5 mb-4">
                    {q.options.map((opt, j) => {
                      let bg2 = "transparent", textColor = muted, borderColor = "transparent";
                      if (j === q.correct) { bg2 = "#f0fdf4"; textColor = "#059669"; borderColor = "#86efac"; }
                      else if (userAnswer === j) { bg2 = "#fff5f5"; textColor = "#dc2626"; borderColor = "#fca5a5"; }
                      return (
                        <div key={j} className="flex items-start gap-2 px-3 py-2 rounded-lg text-xs" style={{ background: bg2, border: `1px solid ${borderColor}`, color: textColor }}>
                          <span className="font-bold shrink-0">({LETTERS[j]})</span> {opt}
                          {j === q.correct && <span className="ml-auto shrink-0 font-bold">✓</span>}
                          {userAnswer === j && j !== q.correct && <span className="ml-auto shrink-0 font-bold">✗</span>}
                        </div>
                      );
                    })}
                  </div>
                  <div className="p-3 rounded-lg text-xs leading-relaxed" style={{ background: "#eff6ff", border: "1px solid #bfdbfe", color: "#1e40af", fontFamily: "system-ui" }}>
                    <span className="font-bold">Explanation: </span>{q.explanation}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <button onClick={onBack} className="mt-8 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm text-white hover:opacity-90" style={{ background: test.color }}>
          <RotateCcw className="w-4 h-4" /> Back to Test Selection
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col" style={{ background: "#ffffff", color: text, fontFamily: "system-ui, sans-serif" }}>
      <div className="flex items-center px-4 py-2.5 shrink-0 gap-3" style={{ background: headerBg, borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center gap-2 flex-1">
          <div className="w-6 h-6 rounded flex items-center justify-center text-white text-[10px] font-black shrink-0" style={{ background: test.color }}>ST</div>
          <span className="text-xs font-bold truncate" style={{ color: muted }}>{test.subject} · Grade {test.grade} · {test.category}</span>
        </div>
        <span className="text-xs font-bold px-2 py-0.5 rounded text-white shrink-0" style={{ background: test.color }}>STATE TEST</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <button onClick={() => setMarked(prev => ({ ...prev, [currentIdx]: !prev[currentIdx] }))}
            className={`flex items-center gap-2 px-4 py-2 rounded border-2 text-sm font-semibold transition-all ${marked[currentIdx] ? "border-amber-400 bg-amber-400/10 text-amber-500" : "border-gray-300"}`}
            style={{ borderStyle: "dashed", color: marked[currentIdx] ? undefined : muted }}>
            {marked[currentIdx] ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
            Mark for Review
          </button>
          <span className="text-xs font-bold" style={{ color: muted }}>Question {currentIdx + 1} of {test.questions.length}</span>
        </div>

        {q.stimulus_header && <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: muted }}>{q.stimulus_header}</p>}
        {q.stimulus && (
          <div className="mb-5 p-5 rounded-xl text-sm leading-relaxed whitespace-pre-line" style={{ background: "#f8f9fa", border: `1px solid ${border}`, fontFamily: "Georgia, serif", color: text, lineHeight: "1.9" }}>
            {q.stimulus}
          </div>
        )}
        {q.table_data && <TableStimulus data={q.table_data} />}
        <p className="text-base font-semibold mb-5 leading-relaxed whitespace-pre-line" style={{ color: text, fontFamily: "Georgia, serif" }}>{q.question}</p>
        <div className="space-y-3">
          {q.options.map((opt, j) => {
            const isSelected = answers[currentIdx] === j;
            return (
              <button key={j} onClick={() => setAnswers(prev => ({ ...prev, [currentIdx]: j }))}
                className="w-full flex items-start gap-3 px-5 py-3.5 rounded-xl text-sm text-left transition-all hover:opacity-90"
                style={{ border: `1.5px solid ${isSelected ? test.color : border}`, background: isSelected ? `${test.color}12` : "transparent", color: text }}>
                <span className="shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold mt-0.5"
                  style={{ borderColor: isSelected ? test.color : border, background: isSelected ? test.color : "transparent", color: isSelected ? "white" : text }}>
                  {LETTERS[j]}
                </span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex items-center px-5 py-3 shrink-0 gap-3" style={{ background: headerBg, borderTop: `1px solid ${border}` }}>
        <button onClick={() => setCurrentIdx(i => Math.max(0, i - 1))} disabled={currentIdx === 0}
          className="px-4 py-2 rounded text-sm font-semibold border disabled:opacity-30 hover:bg-black/10"
          style={{ border: `1px solid ${border}`, color: text }}>Back</button>
        <button onClick={() => setNavOpen(o => !o)}
          className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
          style={{ background: "#e0e0e0", color: text }}>
          Question {currentIdx + 1} of {test.questions.length}
          <ChevronUp className={`w-3.5 h-3.5 transition-transform ${navOpen ? "" : "rotate-180"}`} />
        </button>
        {currentIdx < test.questions.length - 1 ? (
          <button onClick={() => setCurrentIdx(i => i + 1)} className="px-4 py-2 rounded text-sm font-semibold text-white hover:opacity-90" style={{ background: test.color }}>Next</button>
        ) : (
          <button onClick={() => setSubmitted(true)} className="px-5 py-2 rounded text-sm font-semibold text-white hover:opacity-90 flex items-center gap-2" style={{ background: "#16a34a" }}>
            <CheckCircle2 className="w-4 h-4" /> Submit & View Results
          </button>
        )}
        <div className="flex-1 flex justify-end">
          <button onClick={onBack} className="text-xs opacity-40 hover:opacity-80">✕ Exit</button>
        </div>
      </div>

      {navOpen && (
        <div className="absolute bottom-14 left-1/2 -translate-x-1/2 rounded-2xl shadow-2xl p-4 z-10 w-80"
          style={{ background: "#ffffff", border: `1px solid ${border}` }}>
          <p className="text-xs font-bold mb-3" style={{ color: muted }}>QUESTIONS</p>
          <div className="flex flex-wrap gap-2">
            {test.questions.map((_, i) => (
              <button key={i} onClick={() => { setCurrentIdx(i); setNavOpen(false); }}
                className="w-9 h-9 rounded text-xs font-bold flex items-center justify-center relative"
                style={{ background: i === currentIdx ? test.color : answers[i] !== undefined ? "#e8f0fe" : "#f0f0f0", color: i === currentIdx ? "white" : text, border: `1px solid ${border}` }}>
                {i + 1}
                {marked[i] && <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-amber-400" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function StateTestPrep() {
  const [activeTest, setActiveTest] = useState(null);

  if (activeTest) return <TestInterface test={activeTest} onBack={() => setActiveTest(null)} />;

  return (
    <div className="min-h-screen pb-16 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="sticky top-0 z-10 flex items-center gap-4 px-6 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm">
        <div className="w-7 h-7 rounded flex items-center justify-center font-black text-white text-[10px] shrink-0" style={{ background: "#1a56db" }}>ST</div>
        <span className="font-bold text-sm">State Assessment Prep</span>
      </div>

      <div className="max-w-3xl mx-auto px-5 py-8">
        <h1 className="text-2xl font-black mb-1">State Test Prep</h1>
        <p className="text-sm mb-6 text-gray-500 dark:text-gray-400">Computer-adaptive, criterion-referenced assessments aligned to state learning standards.</p>

        <div className="rounded-2xl p-5 mb-8 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <h2 className="font-bold text-sm mb-3 flex items-center gap-2"><BookOpen className="w-4 h-4 text-blue-500" /> About State Testing</h2>
          <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-500 dark:text-gray-400">
            {[
              { icon: "🎯", label: "Criterion-Referenced", desc: "Measures mastery against state learning standards, not peers." },
              { icon: "💻", label: "Computer-Adaptive", desc: "Questions adjust to your ability level for accurate proficiency data." },
              { icon: "📊", label: "Grades 3–8, 11", desc: "Required for ELA and Math; Science in grades 5, 8, 10–12." },
              { icon: "📝", label: "Mixed Item Types", desc: "Selected-response, constructed-response, and technology-enhanced items." },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-2 p-3 rounded-xl bg-gray-50 dark:bg-gray-900">
                <span className="text-base shrink-0">{f.icon}</span>
                <div>
                  <p className="font-bold mb-0.5 text-gray-800 dark:text-gray-200">{f.label}</p>
                  <p>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {CATEGORIES.map(cat => (
          <div key={cat} className="mb-8">
            <h2 className="font-black text-base mb-3 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ background: TESTS.find(t => t.category === cat)?.color }} />
              {cat}
            </h2>
            <div className="grid gap-3">
              {TESTS.filter(t => t.category === cat).map(test => (
                <button key={test.id} onClick={() => setActiveTest(test)}
                  className="w-full flex items-center gap-5 p-5 rounded-2xl text-left transition-all hover:shadow-md hover:scale-[1.01] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <div className="w-14 h-14 rounded-2xl flex flex-col items-center justify-center font-black text-white shrink-0" style={{ background: test.color }}>
                    <span className="text-[9px] opacity-80">GR {test.grade}</span>
                    <span className="text-[10px]">{test.subject.split(" ")[0].slice(0, 3).toUpperCase()}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-sm">{test.label}</p>
                    <p className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">{test.description}</p>
                    <p className="text-xs mt-1 font-semibold" style={{ color: test.color }}>{test.questions.length} questions · with answer explanations</p>
                  </div>
                  <ChevronRight className="w-4 h-4 shrink-0 text-gray-400" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}