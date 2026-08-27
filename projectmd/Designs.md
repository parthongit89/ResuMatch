# ResuMatch - UI/UX Design System & Resume Templates

## 1. UI Flow & Module Architecture

```
[Landing Page - Landing.html]
   │
   ├── Verification Module
   │     ├── Email Login Form (Triggers SendGrid OTP Email)
   │     ├── Email Signup Form (Triggers SendGrid OTP Email)
   │     ├── Google OAuth ("Login with google" via Firebase API)
   │     └── OTP Verification Modal (6-Digit OTP, Expiration Timer)
   │
[Dashboard - home.html (Authenticated User Only)]
   │
   ├── Overview (User stats & recent resume drafts)
   ├── Create New Resume -> Resume Gateway -> Session Builder
   ├── Downloads (Previous resume downloads history)
   ├── Notifications
   ├── Subscription (Free tier / Pro tier status)
   └── Logout
   │
[Session Module - 4-Step Builder (8 Inputs)]
   │
   ├── Session 1:
   │     ├── Input 1: Targeted jobs / role / position
   │     └── Input 2: Education (Course, College, Graduation Year)
   ├── Session 2:
   │     ├── Input 3: Technical Skills
   │     └── Input 4: External Links (GitHub, LinkedIn, Portfolio)
   ├── Session 3:
   │     ├── Input 5: Experience & Internships
   │     └── Input 6: Certification & Courses
   ├── Session 4:
   │     ├── Input 7: Additional Certification & Courses
   │     └── Input 8: Target Companies
   └── Submit Button -> Template Selection & Export
```

---

## 2. Session Form Inputs Breakdown (`Session architecture.png`)

| Session Step | Input Field | Component & Description | Validation Rules |
|---|---|---|---|
| **Session 1** | **Input 1: Targeted jobs/role/position** | Text input / Tag selector for desired target job roles | Required (e.g. "Full Stack Developer", "Data Analyst") |
| | **Input 2: Education** | Dynamic form list: Degree/Course, College/University, Passing Year, Grade/CGPA | Required at least 1 education entry |
| **Session 2** | **Input 3: Technical Skills** | Tag input with categories (Languages, Frameworks, Developer Tools, Databases) | Minimum 3 skills required |
| | **Input 4: External Links** | Input fields for GitHub URL, LinkedIn Profile URL, Portfolio Website URL | URL Regex format validation |
| **Session 3** | **Input 5: Experience & Internships** | Dynamic list: Role, Company, Location, Start/End Date, Is Current, Accomplishments (Bullet points) | Required for non-fresher profiles |
| | **Input 6: Certification & Courses** | Dynamic list: Certificate Title, Issuing Organization, Issue Date, Credential URL | Optional / Recommended |
| **Session 4** | **Input 7: Additional Certifications** | Supplementary certifications, workshops, or specialized training courses | Optional |
| | **Input 8: Target Companies** | Input tags for target companies/industries to tailor ATS keyword optimization | Optional |
