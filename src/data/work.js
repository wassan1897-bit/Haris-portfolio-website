// Content of the project pages and the Selected work listings, word for word from the brief.
export const WORK = [
	{
		"slug": "signal-engine",
		"kind": "case",
		"category": "signal-intelligence",
		"title": "Finding buyers at the exact moment they need help",
		"description": "38,548 businesses watched. 51 qualified leads in the first four days.",
		"tag": "Signal intelligence",
		"client": "Lead-generation company",
		"sub": "38,548 businesses watched. 51 qualified leads in the first four days.",
		"stats": [
			[
				"38,548",
				"business listings monitored"
			],
			[
				"51",
				"qualified leads in the first four days"
			],
			[
				"4.5x",
				"higher trigger rate in the highest-risk tenth"
			]
		],
		"shot": {
			"src": "/projects/img/p-signal-engine.webp",
			"width": 1600,
			"height": 900
		},
		"sections": [
			{
				"heading": "The situation",
				"blocks": [
					{
						"type": "p",
						"text": "My client sells to local businesses at one specific moment: right after something goes wrong with their public listing. Reach them a day late and a competitor has the deal. Reach them on a false alarm and you've burned the lead, and your name with it."
					}
				]
			},
			{
				"heading": "What I built",
				"blocks": [
					{
						"type": "p",
						"text": "A monitor that watches 38,548 business listings around the clock. When it spots the trigger, it doesn't raise the alarm. It holds the lead, checks again independently, and only then hands it to sales with the business details attached. Nothing reaches a rep that hasn't been confirmed twice. On top of that sits a weekly risk model that predicts which businesses are most likely to hit the trigger next, so the team can get ahead of it instead of reacting to it. And when a business signs, its record flows into the CRM pipeline in about two seconds, with nothing typed twice."
					}
				]
			},
			{
				"heading": "What changed",
				"blocks": [
					{
						"type": "p",
						"text": "The engine produced a 51-lead pipeline in its first four days, every lead confirmed twice. In testing, the risk model's highest-risk tenth triggered 4.5 times more often than average. Sales now works a ranked list of real opportunities, and the whole system runs unattended."
					}
				]
			}
		],
		"under": "Postgres, headless browser verification, Python, statistical risk scoring, n8n orchestration.",
		"prev": {
			"slug": "growth-engine",
			"title": "Turning a product into its own growth engine"
		},
		"next": {
			"slug": "research-cascade",
			"title": "Researching 80,000 leads without paying for 80,000 deep dives"
		}
	},
	{
		"slug": "research-cascade",
		"kind": "case",
		"category": "research-and-enrichment-agents",
		"title": "Researching 80,000 leads without paying for 80,000 deep dives",
		"description": "The cheapest source that can answer always goes first.",
		"tag": "Research and enrichment, outbound",
		"client": "Outbound campaign",
		"sub": "The cheapest source that can answer always goes first.",
		"stats": [
			[
				"80,000+",
				"leads per campaign"
			],
			[
				"29",
				"data points researched per lead"
			],
			[
				"4",
				"tiers, each used only when needed"
			]
		],
		"shot": {
			"src": "/projects/img/p-research-cascade.webp",
			"width": 1600,
			"height": 900
		},
		"sections": [
			{
				"heading": "The situation",
				"blocks": [
					{
						"type": "p",
						"text": "An outbound campaign needed more than 80,000 leads researched to 29 data points each, starting from little more than a name and a website. No single data provider had all 29 fields. Running every lead through every expensive tool would have cost more than the campaign was worth, and guessing the gaps would have wrecked the sender's reputation inside a week."
					}
				]
			},
			{
				"heading": "What I built",
				"blocks": [
					{
						"type": "p",
						"text": "A cascade. Every lead starts at the cheapest source. After each step, the system measures how complete the record is. If it's good enough, it stops there and costs nothing more. If not, only the missing fields move down to the next, more powerful source: a waterfall of data providers, then an agent that reads the organization's own website and public filings, then a research agent with live web search."
					},
					{
						"type": "p",
						"text": "That last agent is built to leave a field blank rather than invent an answer. Finished records go straight into sequencing, and the moment someone replies or bounces, the system stops spending on them."
					}
				]
			},
			{
				"heading": "What changed",
				"blocks": [
					{
						"type": "p",
						"text": "Decision-maker-level data at campaign scale, with cost tied to how hard each lead is rather than how many leads there are, and a system designed never to make a field up."
					}
				]
			}
		],
		"under": "Apollo, Clay, Firecrawl, Claude research agents, Instantly, n8n orchestration.",
		"prev": {
			"slug": "signal-engine",
			"title": "Finding buyers at the exact moment they need help"
		},
		"next": {
			"slug": "uk-broadband",
			"title": "Revenue agents for a UK broadband provider"
		}
	},
	{
		"slug": "growth-engine",
		"kind": "case",
		"category": "research-and-enrichment-agents",
		"title": "Turning a product into its own growth engine",
		"description": "Brands found my client in their own analytics, then reached out.",
		"tag": "Demand generation, signup qualification",
		"client": "Calendar marketing SaaS",
		"sub": "Brands found my client in their own analytics, then reached out.",
		"stats": [
			[
				"9",
				"production pipelines, one connected system"
			],
			[
				"14",
				"industry groups classified on every signup"
			],
			[
				"20+",
				"verified fields written back per signup"
			]
		],
		"shot": {
			"src": "/projects/img/p-growth-engine.webp",
			"width": 1600,
			"height": 900
		},
		"sections": [
			{
				"heading": "The situation",
				"blocks": [
					{
						"type": "p",
						"text": "A calendar marketing platform wanted more of the right companies using it, without building an outbound team to chase them. It had a second problem too: new signups arrived every day, and sales had no way of telling which ones were worth a call."
					}
				]
			},
			{
				"heading": "What I built",
				"blocks": [
					{
						"type": "p",
						"text": "Two engines. The first finds brands that run events, reads their websites and social pages, and builds each brand a ready-made public calendar on the platform. AI writes every event description so it ranks in search and gets cited in AI answers, and every event links back to the brand's own site, tagged so the visit is traced to my client. The engine re-checks every brand on a schedule, and a person approves each event before it goes live."
					},
					{
						"type": "p",
						"text": "The second engine reads every new signup the moment it lands. It sets personal email addresses aside, then research agents establish the company's industry, which of the platform's three products it would realistically use, and the role and company size of the person who signed up. Every answer comes with evidence and a confidence score, so sales can act on it without checking."
					}
				]
			},
			{
				"heading": "What changed",
				"blocks": [
					{
						"type": "p",
						"text": "Brands started seeing traffic from my client in their own analytics, and some came to them asking about the product. That's outbound in reverse: the value arrives first and the conversation starts on the buyer's side. Meanwhile, sales stopped working a raw list of signups and started working a ranked pipeline."
					}
				]
			}
		],
		"under": "AI research agents, GPT-4o, Firecrawl, Webflow CMS, attribution tagging, Zapier and Apps Script orchestration.",
		"prev": {
			"slug": "sell-side-buyers",
			"title": "Finding every credible buyer for a sell-side deal"
		},
		"next": {
			"slug": "signal-engine",
			"title": "Finding buyers at the exact moment they need help"
		}
	},
	{
		"slug": "sell-side-buyers",
		"kind": "case",
		"category": "signal-triggered-outbound",
		"title": "Finding every credible buyer for a sell-side deal",
		"description": "A 530-acquirer universe, delivered the day of the brief.",
		"tag": "Account intelligence, M&A outreach",
		"client": "Investment bank, sell-side M&A",
		"sub": "A 530-acquirer universe, delivered the day of the brief.",
		"stats": [
			[
				"530",
				"potential acquirers mapped"
			],
			[
				"16",
				"buyer categories"
			],
			[
				"3",
				"prioritized outreach waves"
			]
		],
		"shot": {
			"src": "/projects/img/p-sell-side-buyers.webp",
			"width": 1600,
			"height": 900
		},
		"sections": [
			{
				"heading": "The situation",
				"blocks": [
					{
						"type": "p",
						"text": "An investment bank running a sell-side process needed to know every company that might realistically buy its client, who inside those companies would make the call, and in what order to approach them. It needed all of it fast, and it needed it to the standard a banker would sign."
					}
				]
			},
			{
				"heading": "What I built",
				"blocks": [
					{
						"type": "p",
						"text": "I started by putting research agents on comparable deals, to understand what buyers had actually paid for and why. From there I built a universe of 530 potential acquirers across 16 categories, ranked into three outreach waves, with the exact roles to contact at each one and a specification ready to load into the bank's enrichment tools."
					},
					{
						"type": "p",
						"text": "Alongside it, I built a signal agent that reads acquisition press releases to find companies that are actively buying, and pulls out the decision makers on the buying side. Two different AI models check every match before it counts."
					}
				]
			},
			{
				"heading": "What changed",
				"blocks": [
					{
						"type": "p",
						"text": "A buyer universe the bank could start working the same day, with the roles to contact at every one of 530 companies, and a repeatable way to spot acquirers while they're still active."
					}
				]
			}
		],
		"under": "Claude research agents, Perplexity, DeepSeek, Clay.",
		"prev": {
			"slug": "instant-quotes",
			"title": "A priced quote in 45 seconds, for eight brands"
		},
		"next": {
			"slug": "growth-engine",
			"title": "Turning a product into its own growth engine"
		}
	},
	{
		"slug": "who-actually-buys",
		"kind": "detail",
		"category": "signal-triggered-outbound",
		"title": "Who actually buys",
		"description": "I rebuilt an event venue's ideal customer profile from 344 inquiries and 106 booked events. Its most lucrative format closed less than 1 in 5, while happy hours closed 33 to 44%, so outreach now leads with the easy yes.",
		"tag": "Signal-triggered outbound",
		"client": "Event venue client",
		"sub": "I rebuilt an event venue's ideal customer profile from 344 inquiries and 106 booked events. Its most lucrative format closed less than 1 in 5, while happy hours closed 33 to 44%, so outreach now leads with the easy yes.",
		"stats": [
			[
				"344",
				"Venue inquiries"
			],
			[
				"106",
				"booked events behind the ICP"
			],
			[
				"Under 1 in 5",
				"Close rate of the most lucrative format"
			]
		],
		"shot": {
			"src": "/projects/img/p-who-actually-buys.webp",
			"width": 1600,
			"height": 900
		},
		"sections": [
			{
				"heading": "What I built",
				"blocks": [
					{
						"type": "p",
						"text": "Built a data-driven ideal-customer-profile model for an event venue by analysing 344 historical booking enquiries against 106 confirmed events, then translated it into concrete prospecting filters and lookalike seeds to produce ready-to-use outbound lists."
					},
					{
						"type": "ul",
						"items": [
							"Found that the lower-value event format closes at two to three times the rate of the highest-revenue format, and rebuilt outbound targeting priority around close rate rather than headline deal size"
						]
					}
				]
			}
		],
		"under": "Prospecting platform · CRM booking-data analysis",
		"prev": {
			"slug": "sell-side-buyers",
			"title": "Finding every credible buyer for a sell-side deal"
		},
		"next": {
			"slug": "instant-quotes",
			"title": "A priced quote in 45 seconds, for eight brands"
		}
	},
	{
		"slug": "instant-quotes",
		"kind": "case",
		"category": "inbound-conversion",
		"title": "A priced quote in 45 seconds, for eight brands",
		"description": "The first company to give a price usually wins the job.",
		"tag": "Inbound conversion",
		"client": "Home-service brands",
		"sub": "The first company to give a price usually wins the job.",
		"stats": [
			[
				"~45 sec",
				"from photo to priced quote"
			],
			[
				"8",
				"brands on one estimator"
			],
			[
				"2",
				"channels: web and phone"
			]
		],
		"shot": {
			"src": "/projects/img/p-instant-quotes.webp",
			"width": 1600,
			"height": 900
		},
		"sections": [
			{
				"heading": "The situation",
				"blocks": [
					{
						"type": "p",
						"text": "In home services, the first company to give a price usually wins the job. But pricing a tree job normally means sending someone out to look at it, and by then the homeowner has called three competitors."
					}
				]
			},
			{
				"heading": "What I built",
				"blocks": [
					{
						"type": "p",
						"text": "I engineered and run an AI estimator that prices a job from a single photo. It's deployed across eight tree-service brands, each under its own name. A homeowner uploads a picture on the website and gets a branded quote by email and text in about 45 seconds, while the lead drops into the company's CRM."
					},
					{
						"type": "p",
						"text": "For people who would rather call, a voice agent answers, asks them to text a photo, and replies with a price. And because no estimator is perfect on day one, I built a loop that compares the AI's quotes with what each job actually sold for, company by company, so the pricing learns."
					}
				]
			},
			{
				"heading": "What changed",
				"blocks": [
					{
						"type": "p",
						"text": "Instant quotes on the web and on the phone, no lead ever left without an answer, and an estimator built to get closer to each company's real prices with every job it sells."
					}
				]
			}
		],
		"under": "GPT-5 vision, voice agents, Twilio, CRM integration, Supabase, n8n orchestration.",
		"prev": {
			"slug": "uk-broadband",
			"title": "Revenue agents for a UK broadband provider"
		},
		"next": {
			"slug": "sell-side-buyers",
			"title": "Finding every credible buyer for a sell-side deal"
		}
	},
	{
		"slug": "speed-to-quote",
		"kind": "detail",
		"category": "inbound-conversion",
		"title": "Speed to quote",
		"description": "For a translation firm, every email and web form is classified, matched to the client record and turned into a drafted quote, with a hard check that stops a wrong number before it ever reaches a customer.",
		"tag": "Inbound conversion",
		"client": null,
		"sub": "For a translation firm, every email and web form is classified, matched to the client record and turned into a drafted quote, with a hard check that stops a wrong number before it ever reaches a customer.",
		"stats": [],
		"shot": {
			"src": "/projects/img/p-speed-to-quote.webp",
			"width": 1600,
			"height": 900
		},
		"sections": [
			{
				"heading": "What I built",
				"blocks": [
					{
						"type": "p",
						"text": "A production system that handles the full first-response lifecycle for a company receiving a high volume of client document requests: it classifies inbound email and web-form enquiries, files attachments, updates a live CRM ledger, and writes ready-to-send replies for human review. Built as two coordinated workflows, a 224-node email pipeline and a 38-node web-intake pipeline, sharing one CRM, one document store and one set of business-rule documents."
					}
				]
			},
			{
				"heading": "Architecture: eight reasoning paths behind a three-layer safety net",
				"blocks": [
					{
						"type": "fig",
						"src": "/work/img/email-pipeline.webp",
						"width": 1108,
						"height": 254,
						"caption": "Each AI call is narrowly scoped and schema-constrained. The final gate is deliberately not a model, so a bad draft can be stopped by logic rather than by judgment."
					},
					{
						"type": "fig",
						"src": "/work/img/email-workflow.webp",
						"width": 1042,
						"height": 348,
						"caption": "The live email workflow, zoomed out: 224 nodes across eight reasoning paths, fanning out from a single intake and converging on one drafting and compliance path. Node labels are illegible at this scale by design, the point is the shape."
					}
				]
			},
			{
				"heading": "Design decisions",
				"blocks": [
					{
						"type": "ul",
						"items": [
							"Eight separate reasoning paths, each with its own tightly scoped model call, instead of one large catch-all prompt",
							"Business rules live in an editable reference document the AI layers read at runtime, so staff can change behaviour without a deployment",
							"Thread-aware state matching across mailbox and CRM, so a reply three weeks later still lands on the right record"
						]
					}
				]
			},
			{
				"heading": "Production engineering",
				"blocks": [
					{
						"type": "ul",
						"items": [
							"Root-caused and fixed an infinite-retry loop, a JSON-injection bug from unescaped input, and a lifecycle gap that could have billed a client twice",
							"Direct API-level integration work to guarantee correct message threading in cases the standard connector could not handle"
						]
					}
				]
			},
			{
				"heading": "Result",
				"blocks": [
					{
						"type": "p",
						"text": "Live in production on a real client inbox, with a phased rollout planned across the company's remaining mailboxes."
					}
				]
			}
		],
		"under": "n8n · Microsoft Graph, Outlook and OneDrive · GPT-5-class models",
		"prev": {
			"slug": "instant-quotes",
			"title": "A priced quote in 45 seconds, for eight brands"
		},
		"next": {
			"slug": "voice-agents",
			"title": "Voice AI Agents for Service Businesses"
		}
	},
	{
		"slug": "voice-agents",
		"kind": "detail",
		"category": "inbound-conversion",
		"title": "Voice AI Agents for Service Businesses",
		"description": "Inbound voice agents for small trades and home-services businesses: they answer, classify the caller's need, qualify it, and either transfer to the right human or close the loop by text.",
		"tag": "Inbound conversion",
		"client": "Multiple independent client deployments",
		"sub": "Inbound voice agents for small trades and home-services businesses: they answer, classify the caller's need, qualify it, and either transfer to the right human or close the loop by text. One deployment layers voice onto an existing vision-based pricing engine, so a caller receives a ballpark estimate by SMS minutes after hanging up.",
		"stats": [],
		"shot": {
			"src": "/projects/img/p-voice-agents.webp",
			"width": 1600,
			"height": 900
		},
		"sections": [
			{
				"heading": "Architecture: qualify on the call, price after it",
				"blocks": [
					{
						"type": "flow",
						"steps": [
							"Inbound call",
							"Voice agent classifies need",
							"Qualification checks"
						],
						"branches": [
							{
								"label": "no fit",
								"steps": [
									"Politely closed"
								]
							},
							{
								"label": "human",
								"steps": [
									"Warm transfer"
								]
							},
							{
								"label": "pricable",
								"steps": [
									"SMS asks for a photo",
									"Vision pricing engine",
									"Estimate by text"
								]
							}
						]
					}
				]
			},
			{
				"heading": "What I built",
				"blocks": [
					{
						"type": "ul",
						"items": [
							"A reusable split between generic agent rules and business-specific rules, which let a proven agent design be cloned into a new vertical by editing only seven items, adding a fifth agent to an existing four-agent deployment with no redesign",
							"Deliberate guard rails on what the agent will not price, so ambiguous jobs route to a human instead of producing a number the business cannot honour"
						]
					}
				]
			}
		],
		"under": "Voice AI platform · Telephony · n8n",
		"prev": {
			"slug": "speed-to-quote",
			"title": "Speed to quote"
		},
		"next": {
			"slug": "uk-broadband",
			"title": "Revenue agents for a UK broadband provider"
		}
	},
	{
		"slug": "uk-broadband",
		"kind": "case",
		"category": "retention-and-expansion",
		"title": "Revenue agents for a UK broadband provider",
		"description": "731 new prospects captured, roughly £110k a year in pipeline.",
		"tag": "Inbound capture, retention",
		"client": "UK broadband provider",
		"sub": "731 new prospects captured, roughly £110k a year in pipeline.",
		"stats": [
			[
				"8,700+",
				"tickets handled by AI"
			],
			[
				"79,000+",
				"agent minutes saved (estimated)"
			],
			[
				"731",
				"new prospects captured"
			],
			[
				"~£110k",
				"annual pipeline created"
			]
		],
		"shot": {
			"src": "/projects/img/p-uk-broadband.webp",
			"width": 1600,
			"height": 900
		},
		"sections": [
			{
				"heading": "The situation",
				"blocks": [
					{
						"type": "p",
						"text": "A UK broadband provider had two leaks. Support was so busy that sales opportunities slipped through the cracks, and customers who asked to leave were simply processed out the door, with nobody learning why."
					}
				]
			},
			{
				"heading": "What I built",
				"blocks": [
					{
						"type": "p",
						"text": "The AI agent that now handles their customer conversations. In the middle of a chat it checks the customer's account and any live outages, routes the issue to the right one of seven departments, and when someone new asks about service, checks their address and creates them as a prospect for sales."
					},
					{
						"type": "p",
						"text": "Then a second agent for the moment a customer asks to switch away. It checks consent, picks a personalized offer from the provider's real price list, reaches the customer on WhatsApp, and hands anyone interested to the retention team with the context already attached."
					}
				]
			},
			{
				"heading": "What changed",
				"blocks": [
					{
						"type": "p",
						"text": "More than 8,700 tickets handled by AI and an estimated 79,000+ agent minutes given back to the team. 731 new prospects captured, worth roughly £110k a year in pipeline. And for the first time, the company knows why its customers leave."
					}
				]
			}
		],
		"under": "Voiceflow, n8n, WhatsApp Cloud API, CRM integration, Airtable analytics.",
		"prev": {
			"slug": "research-cascade",
			"title": "Researching 80,000 leads without paying for 80,000 deep dives"
		},
		"next": {
			"slug": "instant-quotes",
			"title": "A priced quote in 45 seconds, for eight brands"
		}
	},
	{
		"slug": "household-investing",
		"kind": "detail",
		"category": "product-and-platform-engineering",
		"title": "Financial Operating System for Household Investing",
		"description": "Co-founding engineer on a consumer fintech product: portfolio tracking, investment research, retirement projection, rebalancing and a natural-language interface backed by a tool-using AI agent that reasons over a household's real financial position.",
		"tag": "Product and platform engineering",
		"client": "Founding engineer",
		"sub": "Co-founding engineer on a consumer fintech product: portfolio tracking, investment research, retirement projection, rebalancing and a natural-language interface backed by a tool-using AI agent that reasons over a household's real financial position. Built as a monorepo of independently deployed apps sharing one design system and one typed database layer, with a confidentiality boundary enforced by the build itself.",
		"stats": [],
		"shot": {
			"src": "/projects/img/p-household-investing.webp",
			"width": 1600,
			"height": 900
		},
		"sections": [
			{
				"heading": "Architecture: trust boundary and agent layer",
				"blocks": [
					{
						"type": "fig",
						"src": "/work/img/household-architecture.webp",
						"width": 2000,
						"height": 487,
						"caption": "The two databases are separate projects, and a lint rule makes it structurally impossible for the public app to import the private data client."
					}
				]
			},
			{
				"heading": "Engineering highlights",
				"blocks": [
					{
						"type": "ul",
						"items": [
							"Hard confidentiality boundary enforced at the dependency-graph level rather than by convention, so a privacy mistake fails the build instead of reaching production",
							"A live tool-using agent that answers questions against a customer's real financial data and shows the evidence behind each answer",
							"Automated safety tooling in CI, including a pre-commit scanner that blocks confidential figures from ever reaching public-facing code",
							"Security and compliance groundwork ahead of a regulated open-banking data integration: consent architecture, access-control hardening, runtime monitoring"
						]
					}
				]
			},
			{
				"heading": "How it is built",
				"blocks": [
					{
						"type": "ul",
						"items": [
							"Engineered almost entirely through AI-native development workflows: every change reviewed by a fresh-context AI pass before merge, shipped through a sequential rebase-per-PR merge queue, and verified against a real running build rather than tests alone",
							"Two AI development agents now contribute to the same production codebase in parallel, which required explicit ownership and coordination protocols",
							"Hundreds of pull requests and database migrations shipped to a live system over several months of continuous iteration"
						]
					}
				]
			},
			{
				"heading": "Status",
				"blocks": [
					{
						"type": "p",
						"text": "Live in production and onboarding its first outside beta customers, with real legal, security and compliance groundwork underway for regulated financial-data access."
					}
				]
			}
		],
		"under": "Next.js / React monorepo · Postgres · Vercel",
		"prev": {
			"slug": "uk-broadband",
			"title": "Revenue agents for a UK broadband provider"
		},
		"next": {
			"slug": "marketplace-app",
			"title": "Two-Sided Marketplace App, Shipped to Both Stores"
		}
	},
	{
		"slug": "marketplace-app",
		"kind": "detail",
		"category": "product-and-platform-engineering",
		"title": "Two-Sided Marketplace App, Shipped to Both Stores",
		"description": "Took an existing web marketplace app connecting homeowners with contractors to native mobile and published it to both app stores, working solo from a Windows machine with no Mac hardware anywhere in the pipeline.",
		"tag": "Product and platform engineering",
		"client": "Live on both stores",
		"sub": "Took an existing web marketplace app connecting homeowners with contractors to native mobile and published it to both app stores, working solo from a Windows machine with no Mac hardware anywhere in the pipeline.",
		"stats": [],
		"shot": {
			"src": "/projects/img/p-marketplace-app.webp",
			"width": 1600,
			"height": 900
		},
		"sections": [
			{
				"heading": "Build and release pipeline",
				"blocks": [
					{
						"type": "fig",
						"src": "/work/img/marketplace-pipeline.webp",
						"width": 1022,
						"height": 163,
						"caption": "The compliance pass is drawn as a gate because it is what actually decides whether a build ships. Most rejections happen there, not in the code."
					},
					{
						"type": "fig",
						"src": "/work/img/marketplace-screens.webp",
						"width": 928,
						"height": 642,
						"caption": "Shipped build: the contractor home screen, a live session with photo exchange, and the ported AI feature turning a finished job into a written, SEO-tagged page."
					}
				]
			},
			{
				"heading": "Engineering highlights",
				"blocks": [
					{
						"type": "ul",
						"items": [
							"Ported an AI content-generation feature from a sister product, where a voice note and job photos become a written write-up, social posts and a review request, and fixed real defects in its outbound integration contract along the way",
							"Diagnosed platform-specific failure modes invisible from the web codebase: a browser API call that works fine in a browser can silently terminate the native iOS process unless the native permission manifest is updated in parallel",
							"Built and owned the entire signed release pipeline, build signing, versioning, store metadata and review submission, with no local Apple hardware"
						]
					}
				]
			},
			{
				"heading": "Result",
				"blocks": [
					{
						"type": "p",
						"text": "Approved by Apple on the first submission, in a case where an earlier app from the same publisher had been rejected three times. Live on both stores, with the first real business customer onboarded to the AI content feature and verified end to end after launch."
					}
				]
			}
		],
		"under": "React / TypeScript · Capacitor native shell · Postgres backend · Cloud macOS CI",
		"prev": {
			"slug": "household-investing",
			"title": "Financial Operating System for Household Investing"
		},
		"next": {
			"slug": "compliance-ai-platform",
			"title": "Enterprise GRC and Compliance AI Platform"
		}
	},
	{
		"slug": "compliance-ai-platform",
		"kind": "detail",
		"category": "product-and-platform-engineering",
		"title": "Enterprise GRC and Compliance AI Platform",
		"description": "Core AI engineering on a governance, risk and compliance platform for an enterprise client.",
		"tag": "Product and platform engineering",
		"client": "Bilingual EN/AR",
		"sub": "Core AI engineering on a governance, risk and compliance platform for an enterprise client. I built the retrieval and reasoning layer behind a multi-persona AI consultant system used for regulatory guidance, where a wrong answer is not an inconvenience but a compliance exposure.",
		"stats": [],
		"shot": {
			"src": "/projects/img/p-compliance-ai-platform.webp",
			"width": 1600,
			"height": 900
		},
		"sections": [
			{
				"heading": "Architecture: hybrid retrieval with permissions enforced at the retrieval layer",
				"blocks": [
					{
						"type": "fig",
						"src": "/work/img/grc-architecture.webp",
						"width": 2000,
						"height": 1250,
						"caption": "Filtering by permission before reranking rather than after means a user can never influence, or infer the existence of, a document they are not entitled to see."
					}
				]
			},
			{
				"heading": "Engineering highlights",
				"blocks": [
					{
						"type": "ul",
						"items": [
							"Hybrid retrieval combining dense vector search with lexical search plus a cross-encoder reranking stage, rather than vector similarity alone",
							"Three-tier multi-tenant permission model enforced inside the retrieval path",
							"Structure-aware chunking with precedence and freshness rules for weighting conflicting source documents"
						]
					}
				]
			},
			{
				"heading": "Evaluation work",
				"blocks": [
					{
						"type": "ul",
						"items": [
							"Benchmarked 16 candidate local models across persona adherence, retrieval quality and hallucination risk before selecting a production model, which surfaced one high-scoring model that was also the most dangerous on hallucination"
						]
					}
				]
			},
			{
				"heading": "Result",
				"blocks": [
					{
						"type": "p",
						"text": "Core retrieval architecture shipped into a production compliance platform, with a sanitized write-up published publicly under written client authorization."
					}
				]
			}
		],
		"under": ".NET backend · Angular frontend · Hybrid retrieval with reranking",
		"prev": {
			"slug": "marketplace-app",
			"title": "Two-Sided Marketplace App, Shipped to Both Stores"
		},
		"next": {
			"slug": "compliance-tooling",
			"title": "Compliance Operations Tooling and Full-Stack Platform"
		}
	},
	{
		"slug": "compliance-tooling",
		"kind": "detail",
		"category": "product-and-platform-engineering",
		"title": "Compliance Operations Tooling and Full-Stack Platform",
		"description": "For a regulated youth-services organisation, I built both the automation and the tooling needed to manage it safely.",
		"tag": "Product and platform engineering",
		"client": "Regulated nonprofit",
		"sub": "For a regulated youth-services organisation, I built both the automation and the tooling needed to manage it safely. The platform they were on could only be edited through a limited web designer, which meant no version control, no review and no diffing. So I built a command-line tool that talks to its management API directly.",
		"stats": [],
		"shot": {
			"src": "/projects/img/p-compliance-tooling.webp",
			"width": 1600,
			"height": 900
		},
		"sections": [
			{
				"heading": "Operations tooling: turning a GUI-only platform into reviewable code",
				"blocks": [
					{
						"type": "fig",
						"src": "/work/img/tooling-architecture.webp",
						"width": 2000,
						"height": 349,
						"caption": "The point of the tool is the review step in the middle, which the vendor's own interface made impossible."
					}
				]
			},
			{
				"heading": "What I built",
				"blocks": [
					{
						"type": "ul",
						"items": [
							"A separate full-stack compliance web application with role-based access control across seven distinct staff roles, built to meet the organisation's regulatory data-handling obligations",
							"Automated absence detection and multi-channel escalation layered on top of their existing case-management workflow"
						]
					}
				]
			}
		],
		"under": "PowerShell CLI · Azure AD OAuth2 with PKCE · Next.js full-stack app",
		"prev": {
			"slug": "compliance-ai-platform",
			"title": "Enterprise GRC and Compliance AI Platform"
		},
		"next": {
			"slug": "signal-engine",
			"title": "Finding buyers at the exact moment they need help"
		}
	}
]
