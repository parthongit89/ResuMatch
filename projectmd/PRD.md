# ResuMatch - Product Requirements Document (PRD)

## 1. Project Context & Problem Statement
Job seekers and students frequently face rejections due to poorly structured, non-ATS compliant, or aesthetically unappealing resumes. Designing a professional resume manually in traditional word processors is time-consuming, prone to formatting errors, and lacks standard industry guidance.

**ResuMatch** solves this problem by offering a guided, session-based multi-step resume builder. Users input their details step-by-step in dedicated sessions, choose from curated professional designs, and download instant high-quality ATS-friendly resumes.

---

## 2. Architecture Modules Breakdown (As per `Modules/` Architecture Diagrams)

### 2.1 Verification Module (`Verification_arc.png`)
- **Landing Page (`Landing.html`)**: Entry point for all users.
- **Authentication Options**:
  1. Standard **Email/Password Signup & Login**.
  2. **Google OAuth (`Login with google`)**: Powered by **Firebase API (Free Tier)**.
- **OTP Verification Flow**:
  - Email Signup & Login trigger an OTP code sent via **SendGrid API (Free Tier)** / **SMTP OTP Email**.
  - `OTP user session` handles expiration and verification checks.
  - If **Expired**: User is routed back to Login.
  - If **Verified**: User is redirected to `home.html` (Dashboard).

### 2.2 Features Module (`features.png`)
- **Dashboard (`home.html`) - Authenticated Users Only**:
  - **Overview**: Central hub displaying user stats and active drafts.
  - **Create New Resume**: Triggers the `Resume Gateway` to start session building.
  - **Downloads**: View and re-download previously generated resumes.
  - **Notifications**: System alerts, tips, and update notifications.
  - **Subscription**: Subscription tier and plan status.
  - **Logout**: Clears JWT/Session and returns to Landing page.

### 2.3 Session Module (`Session architecture.png`)
The Resume Builder consists of **4 core sessions** incorporating **8 targeted inputs**:

```mermaid
flowchart TD
    subgraph Session 1
        I1[Input 1: Targeted jobs / role / position]
        I2[Input 2: Education - Course, College, Year]
    end

    subgraph Session 2
        I3[Input 3: Technical Skills]
        I4[Input 4: External Links - GitHub, LinkedIn, Portfolio]
    end

    subgraph Session 3
        I5[Input 5: Experience & Internships]
        I6[Input 6: Certifications & Courses]
    end

    subgraph Session 4
        I7[Input 7: Additional Certifications & Courses]
        I8[Input 8: Target Companies]
    end

    Session 1 -- SI-1 --> Session 2
    Session 2 -- SI-2 --> Session 3
    Session 3 -- SI-3 --> Session 4
    Session 4 -- SI-4 --> Submit[Submit & Select Template Layout]
```

---

## 3. Team & Role Distribution
- **Backend Developer**: Responsible for Flask API, Database ORM (SQLAlchemy), OTP Email Verification (SendGrid/SMTP), Firebase Auth Integration, Session State Engine, and PDF Generation service.
- **Frontend Developer**: Responsible for UI/UX (Landing page, Auth & OTP modals, Dashboard with Overview/Downloads/Notifications/Subscription/Logout, 4-Session Wizard, Live Preview Renderer, Template selector, PDF downloader).

---

## 4. Key User Journey
1. **Landing Page (`Landing.html`)**: Features showcase & CTAs.
2. **Verification**: Signup/Login -> OTP sent via SendGrid/SMTP -> OTP Verification -> `home.html` (or Google OAuth via Firebase).
3. **Dashboard**: Navigate Overview -> Click **"Create New Resume"** -> Enter `Resume Gateway`.
4. **4-Session Form Builder**:
   - **Session 1**: Targeted Roles + Education details.
   - **Session 2**: Technical Skills + External Links.
   - **Session 3**: Experience/Internships + Certifications.
   - **Session 4**: Additional Certifications + Target Companies.
5. **Submit & Export**: Select design template layout and download PDF.
