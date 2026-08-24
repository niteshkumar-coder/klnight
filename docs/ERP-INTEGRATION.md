# KL University ERP Integration Specification

This document details the authorized ERP integration architecture, required endpoint contracts, security policies, and migration guidelines for connecting this application to official KL University student management gateways.

---

## 1. Security Architecture & Privacy Policy

> [!CRITICAL]
> **Zero Password Storage & Token Protection**
> - The application **NEVER stores raw ERP passwords** in databases, localStorage, sessionStorage, or application logs.
> - Client browsers communicate only with internal proxy endpoints (`/api/*`) via secure, `HttpOnly`, `SameSite=Lax` session cookies.
> - Real ERP credentials are sent directly through secure HTTPS TLS channels to the backend server, normalized, exchanged for short-lived session tokens, and immediately discarded from memory.
> - Scraping, reverse engineering, CAPTCHA bypassing, or unauthorized access attempts are **strictly prohibited**.

---

## 2. ERP Provider Architecture

The integration follows a pluggable Provider Pattern:

```
Browser Client (React UI)
    │
    ▼ (Internal /api routes + HttpOnly session)
Express Application Server
    │
    ▼
ERP Provider Interface (ERPProvider)
    ├── MockERPProvider (Default Demo Mode)
    └── AuthorizedUniversityERPProvider (Production ERP Gateway)
```

---

## 3. Configuration & Environment Variables

To activate the authorized ERP provider in production, configure the following variables in your hosting environment:

| Variable Name | Description | Default / Example |
|---|---|---|
| `USE_MOCK_ERP` | Toggle demo mock adapter (`true`) or real ERP (`false`) | `"true"` |
| `ERP_BASE_URL` | Base URL of official authorized ERP REST API | `https://erp.kluniversity.in/api/v1` |
| `ERP_API_KEY` | Server-to-server API authentication key | `sec_erp_live_xxxxxx` |
| `ERP_CLIENT_ID` | OAuth2 / Client Application Identifier | `kl_timetable_app_prod` |
| `ERP_CLIENT_SECRET` | OAuth2 Secret for service authorization | `live_secret_xxxxxx` |
| `SESSION_SECRET` | Secret key for signing internal student session cookies | `random-32-byte-hex-key` |

---

## 4. Required ERP API Endpoints & Contracts

When implementing an authorized provider or connecting to an institution API, the endpoint contract expectations are:

### A. Authentication
- **Endpoint**: `POST /api/v1/student/auth`
- **Request Body**:
  ```json
  {
    "universityId": "2400032717",
    "password": "...",
    "semester": "Odd",
    "academicYear": "2026-27"
  }
  ```
- **Expected 200 Response**:
  ```json
  {
    "sessionToken": "erp_tok_99182312",
    "expiresInSeconds": 86400,
    "student": {
      "studentId": "2400032717",
      "name": "Nitesh Kumar",
      "program": "B.Tech",
      "branch": "Computer Science and Engineering",
      "section": "S-1-A",
      "semester": "Odd",
      "academicYear": "2026-27",
      "email": "2400032717@kluniversity.in",
      "cgpa": 9.18
    }
  }
  ```

### B. Timetable Schedule
- **Endpoint**: `GET /api/v1/student/timetable?semester=Odd&academicYear=2026-27`
- **Headers**: `Authorization: Bearer <sessionToken>`, `X-ERP-Api-Key: <key>`
- **Expected 200 Response**: Array of timetable items containing `day`, `slot`, `startTime`, `endTime`, `courseCode`, `courseName`, `classType` (L/T/P/S), `room`, `section`, `faculty`.

### C. Attendance Records
- **Endpoint**: `GET /api/v1/student/attendance`
- **Expected 200 Response**:
  ```json
  {
    "overall": {
      "percentage": 86.4,
      "totalClasses": 110,
      "attended": 95,
      "absent": 15
    },
    "subjects": [
      {
        "courseCode": "26SC1101",
        "courseName": "Problem Solving Using Programming (Java)",
        "faculty": "Dr. P. V. Ramana",
        "totalClasses": 48,
        "attended": 42,
        "absent": 6,
        "percentage": 87.5
      }
    ]
  }
  ```

### D. Registered Courses
- **Endpoint**: `GET /api/v1/student/courses`
- **Expected 200 Response**: Array of course metadata (`code`, `name`, `credits`, `type`, `faculty`, `weeklyClasses`).

---

## 5. Rate Limiting & Caching Protocol

- **Timetable Cache TTL**: 12 hours (refreshed explicitly on "Sync Now").
- **Attendance Cache TTL**: 15 minutes.
- **Client Auto-Refresh**: Default 10 minutes interval, configurable via user settings.
- **Circuit Breaker**: Returns cached timetable with `OFFLINE` status when connection fails or ERP server is down.
