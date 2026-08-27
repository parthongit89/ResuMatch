# ResuMatch - UI/UX Design System & Resume Templates

## 1. UI Flow & Page Architecture

```
[Landing Page]
   │
   ├── Hero Section ("Build ATS-Friendly Resumes in Minutes")
   ├── Features Grid (Session-based, Instant PDF, Professional Templates)
   ├── Template Carousel / Gallery
   └── Footer & CTA ("Get Started")
   │
[Auth Page / Modal]
   │
   ├── Login Form (Email, Password)
   └── Signup Form (Full Name, Email, Password)
   │
[Dashboard]
   │
   ├── Saved Resumes Grid
   └── Button: "+ Create New Resume"
   │
[Multi-Step Session Builder]
   │
   ├── Stepper Progress Bar (Step 1 of 7)
   ├── Session Input Form (Left Pane)
   └── Live Preview Pane (Right Pane / Toggle on Mobile)
   │
[Template Selector & Export]
   │
   ├── Template Layout Grid (Modern, Executive, Tech ATS, Creative)
   ├── Color Palette Selector (Navy, Emerald, Charcoal, Royal Blue)
   └── Download PDF Button
```

---

## 2. Resume Template Layout Types

### Template 1: Modern Minimalist
- **Target Audience**: General job seekers, Software Engineers, Product Managers.
- **Layout**: Single column, clean typography, left border accents on section headings.
- **Features**: Highly readable, ATS-optimized.

### Template 2: Executive Classic
- **Target Audience**: Finance, Business Analytics, Management, Legal.
- **Layout**: Centered header, subtle horizontal divider lines, traditional serif/sans-serif combination.
- **Features**: Professional, formal, high text density capability.

### Template 3: Creative Tech (Two-Column)
- **Target Audience**: Designers, Developers, Data Scientists.
- **Layout**: 30% Left Sidebar (Contact info, Skills, Languages) + 70% Right Column (Experience, Projects, Education).
- **Features**: Visual contrast, efficient space usage.

---

## 3. Session Form Fields & Validation Rules

| Session Step | Input Components | Validation Rules |
|---|---|---|
| **Step 1: Personal Info** | Full Name, Professional Title, Email, Phone, City/Country, LinkedIn, GitHub, Portfolio | Email regex, required Name & Email |
| **Step 2: Summary** | Rich Text / Plain Text summary box (150-300 words recommended) | Min 30 characters |
| **Step 3: Work Experience** | Dynamic List: Job Title, Company, Location, Start Date, End Date, Is Current, Key Accomplishments (Bullet points) | Required Title & Company |
| **Step 4: Education** | Dynamic List: Degree, Institution, Location, Graduation Year, Grade/GPA | Required Degree & Institution |
| **Step 5: Projects** | Dynamic List: Project Title, Tech Stack, Live Link, GitHub Link, Description bullets | Required Title |
| **Step 6: Skills** | Categorized Tag Inputs: Technical Skills, Frameworks, Tools, Soft Skills, Languages | Min 3 skills |
| **Step 7: Template** | Visual Template Card Selector, Primary Color Picker, Font Selector | Required Template Selection |
