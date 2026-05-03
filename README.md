# CivicFlow Project Specification

## Project Overview

CivicFlow is a community and campus issue coordination system designed to help organizations collect, prioritize, assign, track, and review real-world operational problems. The platform focuses on transparent collaboration between residents, students, service teams, and administrators.

The system is intentionally built without artificial intelligence. All categorization, prioritization, assignment, and workflow decisions are based on explicit user input, rule-based logic, and administrative control. This keeps the process auditable, explainable, and suitable for environments where accountability matters.

## Objectives

- Provide a structured channel for reporting facilities, safety, service, environment, and activity-related issues.
- Improve visibility into community demand through one-time voting per issue.
- Support administrators with a clear operations desk for status updates, ownership assignment, priority control, and public announcements.
- Present measurable impact through resolution metrics, category distribution, workflow pipeline, and area-level activity.
- Maintain a lightweight, browser-based MVP that is easy to run, inspect, and extend.

## Target Users

- Community members or students who need to report and track local problems.
- Operations teams responsible for reviewing and resolving reported issues.
- Administrators who need visibility into demand, workload, and service performance.
- Organizers who need a transparent record of what has been reported, assigned, and resolved.

## Core Features

### Issue Reporting

Users can submit issues with a title, category, area, description, and optional image evidence. Newly submitted issues enter the workflow with a default status and an initial rule-based priority.

### Voting Control

Each browser can vote only once per issue. The application stores voting records locally to prevent repeated voting after refreshes within the same browser environment.

### Issue Tracking

Users can browse issues, filter by status or category, search by keyword, inspect issue details, and add public comments or clarifications.

### Operations Management

Administrators can update issue status, change priority, assign owners, and maintain a public announcement visible across the application.

### Impact Dashboard

The dashboard summarizes operational performance through total issues, active cases, resolved rate, average resolution time, category distribution, status pipeline, and area heat map.

## System Design

The application is implemented as a React single-page application with local state and browser storage. It uses a static Node server to serve the production build and avoid development-server dependency optimization issues.

### Frontend

- React renders the user portal, operations desk, and impact dashboard.
- Lucide React provides consistent interface icons.
- CSS defines the responsive layout, navigation, panels, tables, forms, charts, and mobile behavior.

### Persistence

- Browser `localStorage` stores submitted issues, public announcements, and per-issue voting records.
- This persistence model is suitable for local MVP usage and can be replaced by an API-backed database in a production deployment.

### Hosting

- Vite builds the production bundle.
- `server.cjs` serves the generated files from `dist/` at `http://127.0.0.1:5173`.

## Workflow

1. A user submits an issue with category, location, and description.
2. The system creates the issue with an initial status and rule-based priority.
3. Community members can vote once to indicate demand.
4. Administrators review the issue, assign an owner, and update the workflow state.
5. Comments and history provide context for follow-up.
6. Dashboard metrics update from the current issue data.

## No-AI Policy

CivicFlow does not use AI, machine learning, automated recommendation, automated classification, or generative content. Its decision model is intentionally transparent:

- Categories are selected by users.
- Priorities are rule-based or manually changed.
- Ownership is assigned by administrators.
- Status changes are controlled by administrators.
- Metrics are calculated directly from issue data.

## Technology Stack

- React
- Vite
- JavaScript
- CSS
- Lucide React
- Node.js static server
- Browser localStorage

## Local Setup

Install dependencies:

```bash
npm install
```

Build the application:

```bash
npm run build
```

Start the local server:

```bash
npm run preview
```

Open the application:

```text
http://127.0.0.1:5173
```

## Project Structure

```text
.
├── index.html
├── package.json
├── public/
│   └── favicon.svg
├── server.cjs
├── src/
│   ├── main.jsx
│   └── styles.css
└── vite.config.js
```

## Current Limitations

- Data is stored locally in the browser and is not shared across devices.
- Authentication and role-based access control are not included in the current MVP.
- Image uploads are represented as selected file names rather than persisted uploaded files.
- The current server is intended for local preview rather than production hosting.

## Future Enhancements

- Add backend APIs and database storage.
- Add authentication for users and administrators.
- Support real image upload and file storage.
- Add issue audit logs with timestamps.
- Add department-level dashboards and exportable reports.
- Add notification channels for status changes and announcements.
