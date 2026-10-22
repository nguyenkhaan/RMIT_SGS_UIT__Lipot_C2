
# REQUIREMENTS SPECIFICATION

**Hackathon:** UNLOCKED Challenge (RMIT x Tide)
**Core Paradigm:** Emergent Authority via TideCloak Integration

Link Hackathon Challenge: [tide.org/unlocked#start](https://tide.org/unlocked#start)

## 1. Executive Summary & Objective

This project builds a functional prototype addressing a critical real-world **Trust Bottleneck**—a scenario where progress, collaboration, or user data security is constrained because a central authority (admin, database manager, single cloud server, or AI agent) holds unilateral power to access data or override rules.

By integrating **TideCloak**, the application shifts from centralized trust to **Emergent Authority**, ensuring that sensitive operations and data decryption can only occur when explicit user consent, cryptographic policies, and multi-party approvals align. No single actor—including application administrators or the AI itself—holds a master key.

---

## 2. Technical & Architecture Requirements

### 2.1 TideCloak & IAM Setup

* **TideCloak Container / SDK Integration:**
  * The application must use the official `@tidecloak/react` or `@tidecloak/nextjs` SDK (or standard TideCloak OIDC adapter) for user identity, authentication, and permission management.
  * TideCloak must run against a TideCloak dev container/server or Tide's Cybersecurity Fabric network.
* **Emergent Authority Enforcers:**
  * Define explicit policy gates for high-risk/sensitive actions (e.g., viewing unmasked personally identifiable information [PII], executing transactions, revealing whistleblowing submissions, or accessing cross-institutional health records).
  * Sensitive data must remain encrypted at rest and in transit. Access tokens and decryption authority must emerge dynamically based on strict policy conditions rather than static database permissions.

### 2.2 Prototype Functional Scope

* **Focused Interactive Scenario:** Demonstrate **ONE clear, compelling core interaction loop** where an action is attempted, evaluated by TideCloak policy gates, and executed only when authorized.
* **Role-Based Visualization:** Implement UI perspectives for at least two roles (e.g., Data Owner/User vs. Administrator/Auditor/Third-Party) to visually prove that an Administrator cannot unilaterally bypass permissions or inspect private payload data.
* **Mocked Data Strategy:** Use synthetic, mocked JSON structures or local client-side state. Complex backend databases are unnecessary as long as authorization flows through TideCloak.

---

## 3. Non-Functional & Hackathon Compliance Rules

* **TideCloak Criticality Rule:** The project must **NOT** be easily replacable by standard OAuth 2.0 / Firebase / Auth0 setups. TideCloak must materially alter the app's capability by guaranteeing that no master key exists in the backend database or backend server.
* **Repository Layout:** Public GitHub Repository containing:
  * Clean, runnable source code (e.g., Next.js / React + Vite / Node.js).
  * `README.md` containing the official < 300-word template at the very top.
  * A two-minute video demo saved as `demo.mp4` (< 100MB).
  * Setup instructions clearly separated from the submission overview.

---

## 4. Deliverables Architecture & Checklist

```text
.
├── README.md               # Includes top 300-word submission overview
├── requirements.md         # This specification file for AI Coding Agents
├── demo.mp4                # <2-min screen recording (<100MB)
├── package.json            # Setup & runner scripts (npm run dev)
└── src/
    ├── config/             # tidecloak.json adapter configuration
    ├── components/         # Auth Gate UI & Protected Feature Components
    └── App.tsx / page.tsx  # Core interactive user loop
```


## 5. README.md Template Framework (< 300 Words)

The top section of README.md must strictly answer these 5 prompts:


Vision & originality: What new product, service, or experience are you proposing?

Trust constraint insight: What trust/privacy problem holds this back today, and what becomes possible when removed?

Value & impact: Who benefits, and what is a concrete example of the real-world improvement?

Why TideCloak matters: How does TideCloak's Emergent Authority specifically enable this app where traditional auth fails?

Prototype & storytelling: What primary interaction should judges look for when testing the prototype?

## 6. AI Agent Execution Directive

When an AI Coding Agent (Claude Code, Cursor, Windsurf, VS Code via Tide MCP) executes this project:

Analyze Project Domain: Pick a concrete scenario (e.g., Blind Tenant Application Passport, Cross-Hospital Research Vault, AI Executive Assistant Guardrails, or Whistleblower Vault).

Scaffold Frontend: Generate a React/Next.js client using standard TideCloak adapter patterns.

Wire Authorization Hooks: Use useTideCloak() hooks or auth middleware to guard sensitive routes and actions.

Provide Clear Visual Feedback: Ensure the UI explicitly shows "Access Denied / Awaiting Emergent Authority" when unauthorized, and displays decrypted content/executed actions only after TideCloak policy validation succeeds.
