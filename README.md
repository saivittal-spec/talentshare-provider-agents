# talentshare-provider-agents

TalentShare Provider Acquisition Agents
Status: Active development — foundational backend services implemented; end-to-end acquisition automation is not yet complete.

1. Project Overview
TalentShare Provider Acquisition Agents is a modular, TypeScript-based backend project intended to help TalentShare identify, research, evaluate, and engage potential talent providers in a controlled, evidence-based workflow.
Initial focus: English and Maths providers in the United States, including tutors, teachers, instructors, mentors, coaches, and other professionals with teachable expertise. The initial business objective is to make relevant providers aware of TalentShare and encourage them to join. A later phase will place greater emphasis on talent seekers.
The system is designed to reduce repetitive acquisition work while retaining human oversight of consequential decisions and external communications.
Important distinction: The repository currently contains foundational provider-processing components. It does not yet autonomously discover providers online, determine final outreach eligibility, or send invitations.
2. Business Objectives
- Build a repeatable process for finding potential English and Maths talent providers.
- Consolidate information from permitted sources into consistent provider records.
- Preserve source evidence and provenance for review and auditability.
- Identify possible duplicates before creating unnecessary records or outreach.
- Support transparent provider qualification and segmentation.
- Prepare personalized outreach based on supported facts.
- Require human approval and contact eligibility checks before any message is sent.
- Track responses, provider onboarding, and acquisition performance.
- Keep the architecture extensible to additional subjects and provider categories.
3. Intended End-to-End Workflow
Prospect Discovery
       |
       v
Research / Enrichment
       |
       v
Structured Provider Features
       |
       v
Provider Qualification
       |
       v
Segmentation / Prioritization
       |
       v
Personalized Outreach Drafting
       |
       v
Contact Eligibility + Human Approval
       |
       v
Approved Outreach Execution
       |
       v
Response Tracking
       |
       v
Measurement and Optimization
The stages above describe the target workflow, not a claim that every stage is implemented today. Deduplication, evidence handling, suppression checks, and persistence are supporting capabilities that operate across relevant stages.
Workflow responsibilities
Stage	Responsibility	Current state
Prospect discovery	Identify potential providers using permitted sources, APIs, referrals, or manual lists	Automated discovery planned; manual import implemented
Research and enrichment	Add verified details and supporting evidence	Basic enrichment implemented
Deduplication	Identify possible repeated provider records	Basic matching implemented
Structured features	Convert provider data into consistent qualification inputs	Planned
Qualification	Apply explainable provider-fit criteria	Planned
Segmentation	Group by subject, expertise, persona, and priority	Planned
Personalization	Draft evidence-grounded invitation messages	Planned
Contact eligibility and human approval	Block ineligible outreach and require approval	Planned; related status fields exist in the model
Outreach execution	Send only authorized, approved communications	Planned
Response tracking	Record replies and update provider status	Planned
Measurement and optimization	Report outcomes and improve acquisition	Planned


4. Current Implementation
Development has been organized into small PA (Provider Acquisition) tickets, implemented and reviewed incrementally.
Foundation — PA-001 through PA-007
The initial work established the project structure and core contracts, including:
- Provider domain types and record structure.
- Subject and provider-type definitions.
- Evidence and source-provenance concepts.
- Workflow and qualification status structures.
- Zod-based provider validation.
- Repository abstraction for provider operations.
- Initial database migration groundwork.
These are foundational contracts; the existence of a repository interface or migration does not establish that a production database is deployed or connected.
PA-008 — Manual Provider Import
The manual import service converts supplied provider information into a standardized, validated provider record. This supports a controlled pilot using manually researched English and Maths prospects without depending on automated website discovery.
PA-009 — Provider Deduplication
The deduplication service checks for possible duplicate providers using normalized names together with shared source URLs or overlapping subjects. It returns a matching assessment for review rather than automatically deleting records or assuming that two similar names identify the same person.
PA-010 — Basic Provider Enrichment
The enrichment service updates provider records with additional supported details, including specializations, geography, experience information, and new source evidence. It validates the result and preserves existing provider identity and decision-related fields.
Verified development result
The latest development run shared by the project developer showed:
- 45 automated tests passing across 7 test files.
- npx tsc --noEmit completing without reported errors.
These are historical local verification results, not a live CI badge or guarantee that every environment currently passes. Re-run the commands below after pulling the latest changes.
5. Provider Data Model
A provider prospect record includes information such as:
Field or group	Purpose
id, displayName	Provider identity within the system
providerType	Tutor, teacher, instructor, mentor, coach, and related categories
subjects	Initial subject scope: english and math
specializations	More specific teaching or expertise areas
geography	Geographic context, when known
teachingExperienceYears	Known teaching experience
subjectExperienceYears	Known subject-matter experience
evidence	Supporting facts, sources, and observation timestamps
qualificationStatus, qualificationScore	Future provider-fit decision state
priorityTier, qualificationPolicyVersion	Prioritization and decision traceability
contactEligibilityStatus	Separate status for whether contact is permitted
isSuppressed	Flag for preventing outreach
createdAt, updatedAt	Record timestamps


Provider fit and permission to contact are separate questions. A qualified provider must not automatically become eligible for outreach.
6. Technical Architecture
The intended architecture is modular, with one orchestration layer coordinating independently testable services and persistent provider state.
                Permitted Provider Sources
          (manual imports, referrals, APIs,
              public-web research)
                         |
                         v
                 Discovery / Import
                         |
                         v
               Validation + Evidence
                         |
                         v
             Deduplication + Enrichment
                         |
                         v
             Qualification + Segmentation
                         |
                         v
              Outreach Draft Preparation
                         |
                         v
              Eligibility + Human Review
                         |
                         v
                Approved Sending Only
                         |
                         v
              Responses + Measurements
                         |
                         v
                Persistent Data Store
This diagram is a target architecture, not a currently deployed integration diagram.
Design principles
- Modularity: Small services with clear responsibilities and tests.
- Traceability: Store evidence and source provenance where available.
- Explainability: Keep provider qualification criteria inspectable and reproducible.
- Human control: Require explicit approval before external messages are sent.
- Safety: Respect suppression, contact eligibility, and source restrictions.
- Source independence: Avoid depending on one provider directory or discovery API.
- Cost awareness: Prefer a staged rollout suitable for a startup with limited funding.
7. Technology Stack
Used in the current development work
Technology	Role
TypeScript	Typed backend services and domain contracts
Node.js / npm	Runtime and package management
Zod	Runtime schema validation
Vitest	Automated tests
Git / GitHub	Version control, branches, and pull requests
GitHub Codespaces	Cloud development environment


Planned or under evaluation — not necessarily integrated
Technology / service	Potential role	Status
PostgreSQL / Supabase	Persistent provider records and workflow state	Integration planned
Vercel	Web application hosting and deployment	Planned deployment context
Typesafe AI Jev	Possible explainable provider qualification engine	Evaluation / future decision
Search API (for example, Brave Search)	Compliant public-web discovery	Under consideration
AI API	Evidence extraction or outreach drafting	Under consideration
Resend or another approved email provider	Sending approved outreach	Planned
HubSpot	Optional CRM view and synchronization	Planned / optional


Jev design decision: If Jev is adopted for provider qualification, it should replace LLM-based qualification decisions, not be followed by a second LLM qualification decision. AI may still assist with evidence extraction and drafting.
No API keys, subscriptions, or external accounts are required merely to run the current unit tests.
8. Repository Organization
Key paths from the development work include:
talentshare-provider-agents/
├── README.md
├── src/
│   ├── models/
│   │   ├── provider.ts
│   │   ├── provenance.ts
│   │   └── workflow.ts
│   ├── schema/
│   │   └── provider.schema.ts
│   ├── repositories/
│   │   └── provider.repository.ts
│   └── services/
│       ├── manual-provider-import.ts
│       ├── provider-deduplication.ts
│       └── provider-enrichment.ts
├── tests/
│   ├── manual-provider-import.test.ts
│   ├── provider-deduplication.test.ts
│   └── provider-enrichment.test.ts
└── db/
    └── migrations/
This is a simplified guide to known files, not an exhaustive snapshot of every file in the repository.
9. Getting Started
Prerequisites
- Git
- Node.js and npm compatible with the repository's package.json
- A terminal or GitHub Codespaces environment
Clone the repository
git clone https://github.com/saivittal-spec/talentshare-provider-agents.git
cd talentshare-provider-agents
If the repository is private, GitHub access is required.
Install dependencies
npm install
Run tests
npm test
Check TypeScript
npx tsc --noEmit
Check repository status
git status
Current limitation: These commands validate the existing code. They do not launch a completed provider-discovery web application or trigger outreach.
10. Example Provider Processing Scenario
Consider two fictional demo records:
Name	Subject	Example experience
Sarah Johnson	English	5 years teaching
Michael Brown	Maths	8 years teaching


A developer can use these records to test the implemented components:
1. Manual import: Convert supplied details into validated provider records with evidence.
2. Deduplication: Compare records with existing prospects and flag possible matches.
3. Enrichment: Add newly researched specializations or experience details with evidence.
4. Review: Inspect the resulting provider records before any qualification or outreach decision.
This is an illustrative scenario, not a claim that the repository currently includes a runnable end-to-end demo command. A dedicated demonstration script or UI is a useful next milestone.
What is not demonstrated yet
- Searching the internet automatically for real English or Maths providers.
- Automatically verifying the identity or contactability of a provider.
- Sending invitations or tracking real email replies.
- Confirming that any real provider has joined TalentShare.
11. Security, Compliance, and Responsible Outreach
The intended acquisition system follows these requirements:
1. Use public-web information, permitted APIs, directories, referrals, and authorized manual imports.
2. Do not perform unauthorized scraping of social platforms or bypass website restrictions.
3. Record source provenance and supporting evidence when available.
4. Minimize personal information and protect stored provider data.
5. Separate provider qualification from contact eligibility.
6. Respect suppression and opt-out decisions.
7. Require human approval before sending external outreach.
8. Send messages only through approved, authorized channels.
9. Do not contact children as acquisition prospects.
10. Avoid fabricated qualifications, unsupported personalization, and duplicate outreach.
These are requirements for the completed system. The present repository should not be treated as having implemented all controls merely because status fields or documentation exist.
12. Development Roadmap
The following is a proposed small-ticket roadmap for the initial MVP. Ticket numbers after PA-010 are planning labels and may be revised as the team prioritizes a demo or changes implementation order.
Ticket	Proposed work	Status
PA-001–PA-007	Foundation, domain contracts, validation, repository and migration groundwork	Implemented in initial development phase
PA-008	Manual provider import	Implemented
PA-009	Provider deduplication	Implemented
PA-010	Basic provider enrichment	Implemented
PA-011	Structured provider feature extraction	Planned
PA-012	Configurable qualification rules	Planned
PA-013	Provider segmentation	Planned
PA-014	Contact eligibility rules	Planned
PA-015	Database integration	Planned
PA-016	Workflow orchestration	Planned
PA-017	Outreach draft generation	Planned
PA-018	Human approval workflow	Planned
PA-019	Approved outreach execution	Planned
PA-020	Response tracking	Planned
PA-021	Suppression management	Planned
PA-022	Optional CRM integration	Planned
PA-023	Provider onboarding tracking	Planned
PA-024	Analytics and reporting	Planned
PA-025	End-to-end integration testing	Planned


Additional work to schedule: A runnable English/Maths provider demonstration and compliant automated discovery capability. These should be prioritized explicitly rather than assumed to be covered by the ticket count above.
Near-term milestones
Milestone A — Working demo: Connect existing import, deduplication, and enrichment services in a runnable example using fictional and then permitted real-world provider data.
Milestone B — Decision pipeline: Add structured features, qualification, segmentation, eligibility checks, and persistence.
Milestone C — Controlled outreach: Add drafting, human approval, guarded sending, suppression, and response tracking.
Milestone D — Pilot and optimization: Measure real acquisition outcomes and improve the workflow before scaling.
13. Collaboration and Contribution Workflow
To keep changes reviewable, contributors should work on one small ticket at a time.
git switch main
git pull origin main
git switch -c feature/pa-011-provider-features
After implementing a ticket:
npm test
npx tsc --noEmit
git diff --check
Then commit the focused changes, push the branch, and open a GitHub pull request for review. Merge only after the team checks the implementation, tests, and any conflicts.
Suggested conventions:
- Keep pull requests small and clearly scoped.
- Explain what changed, why, and how it was tested.
- Avoid committing secrets, credentials, or personal prospect data.
- Coordinate file ownership when multiple contributors are working concurrently.
- Do not merge AI-generated code without understanding and reviewing it.
14. How to Evaluate Progress
Project progress should be demonstrated using evidence rather than ticket counts alone:
- Merged pull requests and reviewed code changes.
- Passing automated tests and TypeScript checks.
- Runnable examples showing actual service behavior.
- Successful integration with persistence and approved external systems, once built.
- Real pilot outcomes such as qualified providers, approved invitations, replies, and sign-ups, once outreach is authorized.
Current assessment: The provider-processing foundation has been implemented and tested. The full acquisition workflow and production deployment still require additional development and verification.
15. Project Links
- Repository: https://github.com/saivittal-spec/talentshare-provider-agents
- Pull requests: https://github.com/saivittal-spec/talentshare-provider-agents/pulls
- Issues: https://github.com/saivittal-spec/talentshare-provider-agents/issues
TalentShare Provider Acquisition Agents — Building an evidence-based, modular, human-supervised process for bringing qualified talent providers onto TalentShare.
