# CivicFlow

CivicFlow is a no-AI community and campus issue coordination platform built for the Nexforge hackathon. It turns scattered feedback into a transparent workflow for reporting, voting, assigning, tracking, and measuring real-world problems.

## Core Value

- Submit facility, safety, service, environment, and activity issues.
- Vote once per issue per browser to surface community demand.
- Track issue status from submission to resolution.
- Manage owners, priorities, status changes, and public announcements.
- Review impact metrics including active cases, resolution rate, category distribution, status pipeline, and area heat map.

## No-AI Constraint

This project intentionally does not use AI, machine learning, automated recommendation, or intelligent classification. Categories, priorities, ownership, and workflow changes are rule-based or manually controlled to keep accountability clear.

## Tech Stack

- React
- Vite
- Lucide React icons
- Local browser storage for lightweight persistence
- Node static server for stable local preview without Vite HMR dependency errors

## Run Locally

```bash
npm install
npm run build
npm run preview
```

Open:

```text
http://127.0.0.1:5173
```
