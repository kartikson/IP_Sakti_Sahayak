# IP-SAKTI Sahayak

**A multilingual, RAG-based, source-cited AI assistant for Intellectual Property and regulatory guidance in Ayurveda, across national and international regimes.**

Team **KG-FORGE** | **TEKATHON 5.0 (2026)** | Problem Statement **SIH26092** | Theme: MedTech / BioTech / HealthTech | Category: Software

> **Disclaimer:** IP-SAKTI Sahayak provides information, not legal advice. For case-specific decisions, consult a qualified IP professional or an IP facilitator.

---

## Table of Contents
- [The Problem](#the-problem)
- [What It Does](#what-it-does)
- [How It Works](#how-it-works)
- [Tech Stack](#tech-stack)
- [Knowledge Corpus](#knowledge-corpus)
- [Project Status and Roadmap](#project-status-and-roadmap)
- [Getting Started](#getting-started)
- [Evaluation](#evaluation)
- [Privacy and Safety](#privacy-and-safety)
- [Team](#team)

---

## The Problem

Protecting and commercialising an Ayurvedic product means dealing with many overlapping regimes at once: patents, geographical indications (GI), trademarks, copyright, designs, trade secrets and plant-variety rights; Access and Benefit Sharing (ABS) duties under the Biological Diversity Act; and drug regulation that decides whether a product is a classical medicine, proprietary medicine, new drug, phytopharmaceutical, Ayurveda-Aahar product or cosmetic.

AYUSH startups, MSMEs, practitioners and cultivators struggle with this. Genuine innovation stays under-protected, and India's traditional knowledge (TK) remains exposed to misappropriation abroad. No authoritative, plain-language tool exists for the AYUSH community.

## What It Does

- **Jurisdiction switch (India | International):** two visibly separate, cited answer sets, so national and international law are never mixed.
- **Formulation classifier:** asks the minimum clarifying questions and classifies the product as *classical, proprietary, new drug, phytopharmaceutical, Ayurveda-Aahar/nutraceutical* or *cosmetic*, then states that category's regulatory requirements and IP/ABS posture. For example, a classical formulation faces the Section 3(p) patent bar and is defended through TKDL, while a new drug has patent potential but needs clinical evidence.
- **Seven-regime IP routing:** Patents, GI, Trademarks, Designs, Copyright, Plant Varieties and Trade Secrets.
- **ABS-compliance helper and TKDL prior-art pointer:** takes the user from a question to the right registry, record or form.
- **Clause-level source-cited RAG:** every answer cites the specific statute, rule, treaty article or record it relies on.
- **Multilingual text and voice** through Bhashini.
- **Trust layer:** confidence indicator, safe abstention on out-of-scope or uncertain queries, and escalation to a human IP facilitator.

## How It Works

```
User query (any Indian language)
   -> Language detection and translation
   -> Formulation classification + jurisdiction (India | International)
   -> Hybrid retrieval (vector + keyword) and reranking over the versioned corpus
   -> LLM answer with mandatory clause-level citations
   -> Evidence sufficient?
        Yes -> Cited answer + confidence score (translated back)
        No  -> Safe abstention + escalation to a human IP facilitator
```

**Model:** Understand -> Classify -> Route -> Retrieve -> Cite -> Guide -> Escalate

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS |
| Backend | Python, FastAPI, REST APIs |
| Database | PostgreSQL + pgvector |
| AI / NLP | LLM, multilingual embeddings, reranking, query classifier |
| Multilingual | Bhashini (translation, ASR, TTS) |
| DevOps | Docker, AWS |

> The frontend is built. Backend, database and AI components above are the planned architecture.

## Knowledge Corpus

The corpus will be built from open, authoritative public sources and version-tracked:

| Source | Used for |
|---|---|
| [India Code](https://indiacode.nic.in) | Statutes and rules |
| [IP India](https://ipindia.gov.in) | Patents / InPASS, trade marks, designs, GI Registry |
| [National Biodiversity Authority](https://nbaindia.org) | ABS and Biological Diversity Act material |
| [TKDL](https://tkdl.res.in) | Traditional knowledge and prior art |
| [WIPO](https://wipo.int) | International treaties |

**Regulatory scope**
- **India:** Patents Act and Rules 2024, GI Act, Trade Marks Act, Designs Act, Copyright Act, PPVFR Act, Biological Diversity Act (2023 amendment) and Rules 2024, Drugs and Cosmetics Act, Drugs and Magic Remedies (Objectionable Advertisements) Act, FSSAI Ayurveda-Aahar regulations.
- **International:** TRIPS, CBD and Nagoya Protocol, WIPO GRATK Treaty (2024), PCT, Madrid, Hague, Budapest Treaty.

## Project Status and Roadmap

| Stage | Scope | Status |
|---|---|---|
| Frontend | React + Tailwind UI prototype | Done |
| Backend | FastAPI service, PostgreSQL + pgvector schema | Planned |
| Corpus ingestion | India Code, IP India, NBA/ABS, TKDL | Planned |
| Classifier + RAG | Formulation classification, cited retrieval | Planned |
| Integration | API wired to frontend | Planned |

**Build phases**
1. **Phase 1 (MVP):** citation-grounded RAG, jurisdiction switch, formulation classifier.
2. **Phase 2:** knowledge graph and agentic multi-source orchestration.
3. **Phase 3:** paid-source connectors (only with explicit, logged user permission) and full multilingual and voice experience.

## Getting Started

The frontend prototype is available now. The backend is under development.

### Run the frontend
```bash
git clone https://github.com/kartikson/IP_Sakti_Sahayak.git
cd IP_Sakti_Sahayak/frontend

npm install
npm run dev
```
Then open the local address shown in the terminal.

### Backend
Coming soon. Setup instructions will be added once the API is ready.

## Evaluation

Quality will be measured on a golden question set across four metrics:

- **Answer accuracy**
- **Citation correctness**
- **Safe abstention** on out-of-scope or uncertain queries
- **Multilingual quality**

## Privacy and Safety

- Standing "information, not legal advice" notice on every answer.
- Mandatory citations; the system abstains when evidence is insufficient.
- DPDP-aligned consent, encryption and audit logs.
- User data is not used to train models.
- Paid databases are accessed only with the user's explicit, logged permission.

## Team

**KG-FORGE**

| Name | Role |
|---|---|
| Kartik Soni | Team Leader |
| Gifty | Team Member |
| Akash Kumar | Team Member |
| Sonali Sharma | Team Member |
| Vanshika | Team Member |
| Samarth Kumar | Team Member |

---

*Built for the Ministry of AYUSH problem statement SIH26045, SIH (2026).*
