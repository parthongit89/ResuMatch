/* ==========================================================================
   RESUMATCH — CORE JAVASCRIPT APPLICATION ENGINE
   State Management, Live Renderers, 4-Session Wizard, ATS Scanner & Exporter
   ========================================================================== */

"use strict";

// API Base URL (Local Flask Server / Production Render Backend)
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://127.0.0.1:5000/api/v1'
    : 'https://resumatch-api.onrender.com/api/v1';

/* ==========================================================================
   1. TOAST NOTIFICATION SYSTEM
   ========================================================================== */
const Toast = {
    container: null,

    init() {
        this.container = document.getElementById('toastContainer');
    },

    show(message, type = 'info', duration = 3500) {
        if (!this.container) this.init();
        if (!this.container) return;

        const toast = document.createElement('div');
        toast.className = `toast-message ${type}`;

        let icon = "<i class='bx bx-info-circle' style='color:var(--primary-light);font-size:1.25rem;'></i>";
        if (type === 'success') {
            icon = "<i class='bx bx-check-circle' style='color:var(--match-green);font-size:1.25rem;'></i>";
        } else if (type === 'error') {
            icon = "<i class='bx bx-error-circle' style='color:var(--missing-red);font-size:1.25rem;'></i>";
        }

        toast.innerHTML = `${icon}<span>${message}</span>`;
        this.container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(15px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => {
                if (toast.parentNode) toast.parentNode.removeChild(toast);
            }, 300);
        }, duration);
    }
};

/* ==========================================================================
   2. THEME MANAGER
   ========================================================================== */
const ThemeManager = {
    storageKey: 'resumatch_theme',

    init() {
        const saved = localStorage.getItem(this.storageKey) || 'dark';
        this.setTheme(saved);
    },

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        this.setTheme(next);
        Toast.show(`Switched to ${next} theme`, 'info', 1800);
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(this.storageKey, theme);
    }
};

/* ==========================================================================
   3. HERO INTERACTIVE SCANNER DEMO CONTROLLER
   ========================================================================== */
const HeroDemo = {
    score: 92,
    addedSkills: [],

    toggleChip(skillName) {
        const chipId = `chip${skillName}`;
        const chip = document.getElementById(chipId);
        if (!chip) return;

        if (!this.addedSkills.includes(skillName)) {
            this.addedSkills.push(skillName);
            chip.className = 'scan-chip match';
            chip.innerHTML = `<i class='bx bx-check'></i> ${skillName}`;
            this.score = Math.min(100, this.score + 4);
            Toast.show(`Simulated adding ${skillName} — Score boosted to ${this.score}%!`, 'success', 3000);
        } else {
            this.addedSkills = this.addedSkills.filter(s => s !== skillName);
            chip.className = 'scan-chip missing';
            chip.innerHTML = `<i class='bx bx-x'></i> ${skillName}`;
            this.score = Math.max(90, this.score - 4);
            Toast.show(`Removed ${skillName} simulation`, 'info', 2000);
        }

        const pctEl = document.getElementById('heroMatchPct');
        if (pctEl) pctEl.textContent = `${this.score}%`;

        const recEl = document.getElementById('heroAiRecText');
        if (recEl) {
            if (this.score >= 100) {
                recEl.innerHTML = `<b>AI Recommendation:</b> Perfect <b>100% match</b> achieved! Ready to apply.`;
            } else if (this.score >= 96) {
                recEl.innerHTML = `<b>AI Recommendation:</b> Add <i>GraphQL</i> APIs to achieve full <b>100% fit</b>.`;
            } else {
                recEl.innerHTML = `<b>AI Recommendation:</b> Add <i>Docker</i> containerization experience to reach <b>98% fit</b>.`;
            }
        }

        // Also reflect in main resume state
        ResumeState.addSkill(skillName);
    },

    testLiveDemo() {
        Toast.show('Loading live Senior Frontend Engineer test profile...', 'info', 2000);
        ResumeState.loadSampleProfile('software_engineer');
        AppNav.switchView('builder');
        Wizard.goToStep(1);
    }
};

/* ==========================================================================
   4. RESUME DATA STORE & STATE ENGINE
   Aligned with backend `src/models/resume.py` schema
   ========================================================================== */
const ResumeState = {
    currentDraftId: 'draft-default',
    data: {
        id: 'draft-default',
        title: 'Software Engineer Resume',
        target_role: 'Senior Full Stack Engineer',
        full_name: 'Alex Rivera',
        headline: 'Senior Frontend & Cloud Architect',
        email: 'alex.rivera@example.com',
        phone: '+1 (555) 234-5678',
        location: 'San Francisco, CA',
        summary: 'Accomplished Software Engineer with 5+ years of experience designing scalable microservices, high-throughput cloud infrastructure, and modern web applications. Proven track record reducing system latency by 35% and mentoring agile engineering teams.',
        
        // Session 1: Education
        education_data: [
            {
                id: 1,
                degree: 'B.S. in Computer Science',
                institution: 'University of California, Berkeley',
                year: '2019 - 2023',
                gpa: '3.85 / 4.0',
                location: 'Berkeley, CA'
            }
        ],

        // Session 2: Technical Skills & Links
        technical_skills: [
            'React.js', 'TypeScript', 'REST APIs', 'Tailwind CSS', 'Performance Optimization',
            'Python', 'Node.js', 'PostgreSQL', 'Docker', 'AWS', 'GraphQL', 'CI/CD'
        ],
        external_links: {
            linkedin: 'https://linkedin.com/in/alexrivera',
            github: 'https://github.com/alexrivera',
            portfolio: 'https://alexrivera.dev'
        },

        // Session 3: Experience & Certifications
        experience_data: [
            {
                id: 1,
                role: 'Senior Frontend Developer',
                company: 'Apex Cloud Solutions',
                location: 'San Francisco, CA',
                start_date: '2023',
                end_date: 'Present',
                is_current: true,
                bullets: [
                    'Architected React & TypeScript micro-frontends processing 5M+ daily page views with 99.99% reliability.',
                    'Engineered Tailwind UI design system that reduced developer handoff time by 45%.',
                    'Spearheaded automated CI/CD pipeline deployment via GitHub Actions and Docker, reducing release cycle by 40%.'
                ]
            },
            {
                id: 2,
                role: 'Frontend Engineer Intern',
                company: 'TechFlow Systems',
                location: 'San Jose, CA',
                start_date: '2022',
                end_date: '2023',
                is_current: false,
                bullets: [
                    'Developed reusable component library used across 4 internal enterprise applications.',
                    'Implemented OAuth2 authentication and JWT session validation protecting 50,000+ active user accounts.'
                ]
            }
        ],
        certifications_data: [
            {
                id: 1,
                title: 'AWS Certified Solutions Architect – Associate',
                issuer: 'Amazon Web Services',
                issue_date: '2024',
                url: 'https://aws.amazon.com/verification'
            }
        ],

        // Session 4: Additional & Tailoring
        target_companies: 'Google, Stripe, Microsoft, OpenAI',
        additional_certs: 'Winner of HackSilicon 2024 (1st Place out of 120 teams); Open source maintainer of micro-cache library (1.2k GitHub stars).',

        // Template & Design Config
        selected_template: 'template-corporate',
        theme_color: '#4f46e5',
        font_family: 'Inter',
        updated_at: new Date().toISOString()
    },

    savedDrafts: [],

    init() {
        this.loadSavedDrafts();
        this.populateFormFields();
        ResumeRenderer.render();
        ATSScanner.updateScores();
        this.renderDraftsCards();
        setTimeout(() => ATSScanner.populateSavedResumesDropdown(), 300);
    },

    loadSavedDrafts() {
        const stored = localStorage.getItem('resumatch_drafts');
        if (stored) {
            try {
                this.savedDrafts = JSON.parse(stored);
            } catch (e) {
                this.savedDrafts = [];
            }
        }
        if (!this.savedDrafts || this.savedDrafts.length < 2) {
            this.savedDrafts = [
                JSON.parse(JSON.stringify(this.data)),
                {
                    id: 'draft-parth-sonavane',
                    title: 'Parth Sonavane - Full Stack Developer',
                    target_role: 'Full Stack Developer',
                    full_name: 'Parth Sonavane',
                    headline: 'Senior Full Stack & AI Systems Developer',
                    email: 'parth.sonavane@example.com',
                    phone: '+91 98765 43210',
                    location: 'Mumbai, India',
                    summary: 'Innovative Full Stack Developer specializing in building high-throughput web architectures, automated ATS resume scanners, Flask REST APIs, and responsive UI/UX systems. Passionate about AI-driven career tools.',
                    education_data: [
                        {
                            id: 1,
                            degree: 'B.Tech in Computer Engineering',
                            institution: 'Mumbai Institute of Technology',
                            year: '2020 - 2024',
                            gpa: '9.2 / 10.0',
                            location: 'Mumbai, India'
                        }
                    ],
                    technical_skills: ['Python', 'Flask', 'React.js', 'PostgreSQL', 'SQLAlchemy', 'Firebase OAuth', 'Docker', 'RESTful APIs', 'Tailwind CSS', 'JavaScript', 'Git', 'OpenAI API'],
                    external_links: {
                        linkedin: 'https://linkedin.com/in/parthsonavane',
                        github: 'https://github.com/parthongit89',
                        portfolio: 'https://parthsonavane.dev'
                    },
                    experience_data: [
                        {
                            id: 1,
                            role: 'Lead Full Stack Engineer',
                            company: 'ResuMatch Platform',
                            location: 'Remote',
                            start_date: '2023',
                            end_date: 'Present',
                            is_current: true,
                            bullets: [
                                'Architected session-based 4-step resume builder platform supporting 10 recruiter-approved templates.',
                                'Engineered PostgreSQL database pre-ping pool recycling to maintain zero connection dropouts.',
                                'Integrated Google Gemini AI API for real-time ATS keyword matching and candidate scoring.'
                            ]
                        }
                    ],
                    certifications_data: [
                        {
                            id: 1,
                            title: 'Meta Certified Full Stack Engineer',
                            issuer: 'Meta',
                            issue_date: '2024',
                            url: 'https://meta.com/credentials'
                        }
                    ],
                    target_companies: 'Google, Microsoft, Amazon, Swiggy, Razorpay',
                    additional_certs: 'Published ResuMatch Open Source Platform; Winner of National AI Hackathon 2024.',
                    selected_template: 'template-corporate',
                    theme_color: '#4f46e5',
                    font_family: 'Inter',
                    updated_at: new Date().toISOString()
                }
            ];
            this.persistDrafts();
        }
    },

    persistDrafts() {
        localStorage.setItem('resumatch_drafts', JSON.stringify(this.savedDrafts));
        this.renderDraftsCards();
        ATSScanner.populateSavedResumesDropdown();
    },

    saveCurrentToDrafts() {
        const currentData = JSON.parse(JSON.stringify(this.data));
        currentData.updated_at = new Date().toISOString();
        
        const existingIdx = this.savedDrafts.findIndex(d => d.full_name === currentData.full_name && d.target_role === currentData.target_role);
        if (existingIdx >= 0) {
            this.savedDrafts[existingIdx] = currentData;
        } else {
            this.savedDrafts.unshift(currentData);
        }
        
        this.persistDrafts();
        
        // Save asynchronously to PostgreSQL / Neon DB
        fetch('/api/v1/resumes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentData)
        }).catch(err => console.log('PostgreSQL / Neon DB sync offline:', err));
    },

    populateFormFields() {
        const d = this.data;
        const setVal = (id, val) => {
            const el = document.getElementById(id);
            if (el) el.value = val || '';
        };

        setVal('inputTargetRole', d.target_role);
        setVal('inputFullName', d.full_name);
        setVal('inputHeadline', d.headline);
        setVal('inputEmail', d.email);
        setVal('inputPhone', d.phone);
        setVal('inputLocation', d.location);
        setVal('inputSummary', d.summary);
        setVal('linkLinkedin', d.external_links?.linkedin);
        setVal('linkGithub', d.external_links?.github);
        setVal('linkPortfolio', d.external_links?.portfolio);
        setVal('inputTargetCompanies', d.target_companies);
        setVal('inputAdditionalCerts', d.additional_certs);

        this.renderDynamicEducation();
        this.renderDynamicSkills();
        this.renderDynamicExperience();
        this.renderDynamicCerts();
    },

    updateField(field, value) {
        this.data[field] = value;
        ResumeRenderer.render();
        ATSScanner.updateScores();
    },

    updateLink(platform, value) {
        if (!this.data.external_links) this.data.external_links = {};
        this.data.external_links[platform] = value;
        ResumeRenderer.render();
    },

    /* --- Dynamic Education Handlers --- */
    renderDynamicEducation() {
        const container = document.getElementById('educationListContainer');
        if (!container) return;
        container.innerHTML = '';

        this.data.education_data.forEach((edu, idx) => {
            const card = document.createElement('div');
            card.className = 'dynamic-card-item';
            card.innerHTML = `
                <div class="dynamic-card-top">
                    <span class="dynamic-card-title">Education #${idx + 1}</span>
                    <button type="button" class="btn-remove-dynamic" onclick="ResumeState.removeEducation(${idx})" title="Remove Education">&times;</button>
                </div>
                <div class="form-grid-2">
                    <div class="form-group">
                        <label>Degree / Major</label>
                        <input type="text" class="form-input" value="${edu.degree || ''}" placeholder="e.g. B.S. Computer Science" oninput="ResumeState.data.education_data[${idx}].degree=this.value; ResumeRenderer.render();">
                    </div>
                    <div class="form-group">
                        <label>Institution / University</label>
                        <input type="text" class="form-input" value="${edu.institution || ''}" placeholder="e.g. UC Berkeley" oninput="ResumeState.data.education_data[${idx}].institution=this.value; ResumeRenderer.render();">
                    </div>
                </div>
                <div class="form-grid-2">
                    <div class="form-group">
                        <label>Graduation Year</label>
                        <input type="text" class="form-input" value="${edu.year || ''}" placeholder="e.g. 2019 - 2023" oninput="ResumeState.data.education_data[${idx}].year=this.value; ResumeRenderer.render();">
                    </div>
                    <div class="form-group">
                        <label>GPA / Honors (Optional)</label>
                        <input type="text" class="form-input" value="${edu.gpa || ''}" placeholder="e.g. 3.85 / 4.0" oninput="ResumeState.data.education_data[${idx}].gpa=this.value; ResumeRenderer.render();">
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    },

    addEducation() {
        this.data.education_data.push({
            id: Date.now(),
            degree: '',
            institution: '',
            year: '',
            gpa: '',
            location: ''
        });
        this.renderDynamicEducation();
        ResumeRenderer.render();
        Toast.show('New education entry added', 'info', 2000);
    },

    removeEducation(idx) {
        if (this.data.education_data.length <= 1) {
            Toast.show('Keep at least one education entry', 'error', 2500);
            return;
        }
        this.data.education_data.splice(idx, 1);
        this.renderDynamicEducation();
        ResumeRenderer.render();
    },

    /* --- Dynamic Skills Handlers --- */
    renderDynamicSkills() {
        const container = document.getElementById('skillsChipsContainer');
        if (!container) return;
        container.innerHTML = '';

        this.data.technical_skills.forEach((skill, idx) => {
            const chip = document.createElement('div');
            chip.className = 'skill-chip active';
            chip.innerHTML = `
                <span>${skill}</span>
                <span class="remove-chip" onclick="ResumeState.removeSkill(${idx})">&times;</span>
            `;
            container.appendChild(chip);
        });
    },

    addSkill(skillName) {
        const trimmed = (skillName || '').trim();
        if (!trimmed) return;
        if (this.data.technical_skills.includes(trimmed)) {
            return;
        }
        this.data.technical_skills.push(trimmed);
        this.renderDynamicSkills();
        ResumeRenderer.render();
        ATSScanner.updateScores();
    },

    removeSkill(idx) {
        this.data.technical_skills.splice(idx, 1);
        this.renderDynamicSkills();
        ResumeRenderer.render();
        ATSScanner.updateScores();
    },

    /* --- Dynamic Experience Handlers --- */
    renderDynamicExperience() {
        const container = document.getElementById('experienceListContainer');
        if (!container) return;
        container.innerHTML = '';

        this.data.experience_data.forEach((exp, idx) => {
            const card = document.createElement('div');
            card.className = 'dynamic-card-item';
            const bulletText = (exp.bullets || []).join('\n');
            card.innerHTML = `
                <div class="dynamic-card-top">
                    <span class="dynamic-card-title">Experience #${idx + 1}</span>
                    <button type="button" class="btn-remove-dynamic" onclick="ResumeState.removeExperience(${idx})" title="Remove Experience">&times;</button>
                </div>
                <div class="form-grid-2">
                    <div class="form-group">
                        <label>Job Title / Role</label>
                        <input type="text" class="form-input" value="${exp.role || ''}" placeholder="e.g. Senior Software Engineer" oninput="ResumeState.data.experience_data[${idx}].role=this.value; ResumeRenderer.render();">
                    </div>
                    <div class="form-group">
                        <label>Company Name</label>
                        <input type="text" class="form-input" value="${exp.company || ''}" placeholder="e.g. Google" oninput="ResumeState.data.experience_data[${idx}].company=this.value; ResumeRenderer.render();">
                    </div>
                </div>
                <div class="form-grid-2">
                    <div class="form-group">
                        <label>Dates (Start - End)</label>
                        <input type="text" class="form-input" value="${exp.start_date || ''} - ${exp.end_date || 'Present'}" placeholder="e.g. 2023 - Present" oninput="ResumeState.updateExpDates(${idx}, this.value)">
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <input type="text" class="form-input" value="${exp.location || ''}" placeholder="e.g. San Francisco, CA" oninput="ResumeState.data.experience_data[${idx}].location=this.value; ResumeRenderer.render();">
                    </div>
                </div>
                <div class="form-group">
                    <label>Bullet Achievements (One per line with action verbs)</label>
                    <textarea class="form-textarea" placeholder="• Scaled backend throughput by 40%..." oninput="ResumeState.updateExpBullets(${idx}, this.value)">${bulletText}</textarea>
                </div>
            `;
            container.appendChild(card);
        });
    },

    updateExpDates(idx, val) {
        const parts = val.split('-');
        this.data.experience_data[idx].start_date = (parts[0] || '').trim();
        this.data.experience_data[idx].end_date = (parts[1] || 'Present').trim();
        ResumeRenderer.render();
    },

    updateExpBullets(idx, text) {
        const lines = text.split('\n').map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(l => l.length > 0);
        this.data.experience_data[idx].bullets = lines;
        ResumeRenderer.render();
        ATSScanner.updateScores();
    },

    addExperience() {
        this.data.experience_data.push({
            id: Date.now(),
            role: 'Software Developer',
            company: 'Tech Corp',
            location: 'Remote',
            start_date: '2023',
            end_date: 'Present',
            is_current: true,
            bullets: ['Built scalable web applications and collaborated with cross-functional teams.']
        });
        this.renderDynamicExperience();
        ResumeRenderer.render();
        Toast.show('New experience added', 'info', 2000);
    },

    removeExperience(idx) {
        this.data.experience_data.splice(idx, 1);
        this.renderDynamicExperience();
        ResumeRenderer.render();
    },

    /* --- Dynamic Certifications Handlers --- */
    renderDynamicCerts() {
        const container = document.getElementById('certsListContainer');
        if (!container) return;
        container.innerHTML = '';

        this.data.certifications_data.forEach((cert, idx) => {
            const card = document.createElement('div');
            card.className = 'dynamic-card-item';
            card.innerHTML = `
                <div class="dynamic-card-top">
                    <span class="dynamic-card-title">Certification #${idx + 1}</span>
                    <button type="button" class="btn-remove-dynamic" onclick="ResumeState.removeCertification(${idx})">&times;</button>
                </div>
                <div class="form-grid-2">
                    <div class="form-group">
                        <label>Certification Name</label>
                        <input type="text" class="form-input" value="${cert.title || ''}" placeholder="e.g. AWS Certified Solutions Architect" oninput="ResumeState.data.certifications_data[${idx}].title=this.value; ResumeRenderer.render();">
                    </div>
                    <div class="form-group">
                        <label>Issuing Organization</label>
                        <input type="text" class="form-input" value="${cert.issuer || ''}" placeholder="e.g. Amazon Web Services" oninput="ResumeState.data.certifications_data[${idx}].issuer=this.value; ResumeRenderer.render();">
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    },

    addCertification() {
        this.data.certifications_data.push({
            id: Date.now(),
            title: '',
            issuer: '',
            issue_date: new Date().getFullYear().toString(),
            url: ''
        });
        this.renderDynamicCerts();
        ResumeRenderer.render();
    },

    removeCertification(idx) {
        this.data.certifications_data.splice(idx, 1);
        this.renderDynamicCerts();
        ResumeRenderer.render();
    },

    /* --- Preset Profile Loader --- */
    loadSampleProfile(type) {
        if (type === 'software_engineer') {
            this.data.target_role = 'Senior Frontend Engineer';
            this.data.full_name = 'Alex Rivera';
            this.data.headline = 'Senior Frontend & Cloud Architect';
            this.data.email = 'alex.rivera@example.com';
            this.data.phone = '+1 (555) 234-5678';
            this.data.location = 'San Francisco, CA';
            this.data.summary = 'Senior Frontend Engineer with 5+ years building high-performance web applications, modern micro-frontends, and scalable UI architectures. Proven track record reducing bundle sizes by 40% and optimizing Core Web Vitals.';
            this.data.technical_skills = ['React.js', 'TypeScript', 'REST APIs', 'Tailwind CSS', 'Performance Optimization', 'Python', 'Node.js', 'Docker', 'AWS', 'GraphQL'];
        } else if (type === 'data_scientist') {
            this.data.target_role = 'Lead Data Scientist / ML Engineer';
            this.data.full_name = 'Dr. Maya Patel';
            this.data.headline = 'Generative AI & Predictive Modeling Specialist';
            this.data.email = 'maya.patel@example.com';
            this.data.phone = '+1 (555) 876-5432';
            this.data.location = 'New York, NY';
            this.data.summary = 'Ph.D. in Computational Data Science with 6+ years deploying deep learning, LLM fine-tuning, and production analytics models yielding $4.2M in annual operational efficiencies.';
            this.data.technical_skills = ['Python', 'PyTorch', 'TensorFlow', 'SQL', 'BigQuery', 'Snowflake', 'Scikit-Learn', 'MLflow', 'Docker'];
        } else if (type === 'product_manager') {
            this.data.target_role = 'Senior Technical Product Manager';
            this.data.full_name = 'Marcus Vance';
            this.data.headline = 'AI & Enterprise SaaS Product Leader';
            this.data.email = 'marcus.vance@example.com';
            this.data.phone = '+1 (555) 443-2211';
            this.data.location = 'Austin, TX';
            this.data.summary = 'Data-driven Technical Product Manager with 7+ years scaling SaaS products from $1M to $18M ARR. Expert in user journey optimization, roadmapping, and agile cross-functional leadership.';
            this.data.technical_skills = ['Product Strategy', 'Agile / Scrum', 'A/B Testing', 'SQL', 'Mixpanel', 'Figma', 'Jira', 'User Research'];
        }

        UI.closePresetMenu();
        this.populateFormFields();
        ResumeRenderer.render();
        ATSScanner.updateScores();
        Toast.show(`Loaded ${this.data.target_role} profile preset`, 'success', 3000);
    },

    resetForm() {
        if (!confirm('Are you sure you want to clear all form fields?')) return;
        this.data.full_name = '';
        this.data.headline = '';
        this.data.target_role = '';
        this.data.email = '';
        this.data.phone = '';
        this.data.location = '';
        this.data.summary = '';
        this.data.technical_skills = [];
        this.data.education_data = [{ id: 1, degree: '', institution: '', year: '', gpa: '', location: '' }];
        this.data.experience_data = [];
        this.data.certifications_data = [];
        this.data.target_companies = '';
        this.data.additional_certs = '';

        UI.closePresetMenu();
        this.populateFormFields();
        ResumeRenderer.render();
        ATSScanner.updateScores();
        Toast.show('Form cleared', 'info', 2000);
    },

    saveDraft() {
        this.data.updated_at = new Date().toISOString();
        const existingIdx = this.savedDrafts.findIndex(d => d.id === this.data.id);
        if (existingIdx >= 0) {
            this.savedDrafts[existingIdx] = JSON.parse(JSON.stringify(this.data));
        } else {
            this.data.id = 'draft-' + Date.now();
            this.savedDrafts.unshift(JSON.parse(JSON.stringify(this.data)));
        }
        this.persistDrafts();
        Toast.show('Resume draft saved locally!', 'success', 3000);
    },

    renderDraftsCards() {
        const container = document.getElementById('draftsGridContainer');
        const downloadsContainer = document.getElementById('allDownloadsGrid');
        if (!container && !downloadsContainer) return;

        const html = this.savedDrafts.map((draft, idx) => `
            <div class="draft-card">
                <div>
                    <div class="draft-header">
                        <div class="draft-title-area">
                            <h4>${draft.full_name || 'Untitled Draft'}</h4>
                            <span class="draft-role-tag">${draft.target_role || 'Target Role'}</span>
                        </div>
                        <span class="draft-ats-pill">94% ATS</span>
                    </div>
                    <div class="draft-meta-info">
                        <span><i class='bx bx-time'></i> ${new Date(draft.updated_at).toLocaleDateString()}</span>
                        <span><i class='bx bx-palette'></i> ${draft.selected_template.replace('template-', '')}</span>
                    </div>
                </div>
                <div class="draft-actions-bar">
                    <button type="button" class="draft-btn primary" style="flex:1;" onclick="ResumeState.loadDraft(${idx})">
                        <i class='bx bx-edit-alt'></i> Edit Resume
                    </button>
                    <button type="button" class="draft-btn icon-only" onclick="ResumeState.deleteDraft(${idx})" title="Delete Draft">
                        <i class='bx bx-trash'></i>
                    </button>
                </div>
            </div>
        `).join('');

        if (container) container.innerHTML = html;
        if (downloadsContainer) downloadsContainer.innerHTML = html;

        const statCount = document.getElementById('statDraftCount');
        if (statCount) statCount.textContent = this.savedDrafts.length.toString();
    },

    loadDraft(idx) {
        if (this.savedDrafts[idx]) {
            this.data = JSON.parse(JSON.stringify(this.savedDrafts[idx]));
            this.populateFormFields();
            ResumeRenderer.render();
            AppNav.switchView('builder');
            Toast.show(`Opened "${this.data.full_name}" resume draft`, 'success', 2500);
        }
    },

    downloadDraftPDF(idx) {
        if (!this.savedDrafts[idx]) return;
        this.data = JSON.parse(JSON.stringify(this.savedDrafts[idx]));
        this.populateFormFields();
        ResumeRenderer.render();
        Toast.show(`Preparing PDF export for "${this.data.full_name}"...`, 'info', 1800);
        setTimeout(() => {
            ResumeExporter.downloadPDF();
        }, 150);
    },

    deleteDraft(idx) {
        if (this.savedDrafts.length <= 1) {
            Toast.show('Must keep at least one draft', 'info', 2500);
            return;
        }
        if (confirm('Delete this resume draft?')) {
            this.savedDrafts.splice(idx, 1);
            this.persistDrafts();
            Toast.show('Draft deleted', 'info', 2000);
        }
    }
};

/* ==========================================================================
   5. RESUME LIVE RENDER ENGINE
   Renders Executive Corporate, Modern Tech Indigo, & Emerald Minimalist
   ========================================================================== */
const ResumeRenderer = {
    paper: null,

    init() {
        this.paper = document.getElementById('liveResumePaper');
    },

    setTemplate(templateClass, btn) {
        let tClass = templateClass;
        if (!tClass.startsWith('template-')) {
            tClass = `template-${tClass}`;
        }
        ResumeState.data.selected_template = tClass;
        if (this.paper) {
            this.paper.className = `resume-paper ${tClass}`;
        }
        const select = document.getElementById('liveTemplateSelect');
        if (select) select.value = tClass;
        this.render();
        Toast.show(`Applied Free Template: ${tClass.replace('template-', '').toUpperCase()}`, 'info', 2000);
    },

    setColor(colorHex, dot) {
        ResumeState.data.theme_color = colorHex;
        if (this.paper) {
            this.paper.style.setProperty('--theme-color', colorHex);
        }
        document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
        if (dot) dot.classList.add('active');
        Toast.show('Theme color updated', 'info', 1500);
    },

    applyTemplateFromGallery(templateClass) {
        this.setTemplate(templateClass);
        AppNav.switchView('builder');
    },

    render() {
        if (!this.paper) this.init();
        if (!this.paper) return;

        const d = ResumeState.data;
        this.paper.className = `resume-paper ${d.selected_template || 'template-corporate'}`;
        this.paper.style.setProperty('--theme-color', d.theme_color || '#4f46e5');

        // Education HTML
        const eduHtml = d.education_data.map(edu => `
            <div class="res-item">
                <div class="res-item-row">
                    <span>${edu.institution || ''}</span>
                    <span>${edu.year || ''}</span>
                </div>
                <div class="res-item-sub">
                    <span>${edu.degree || ''}</span>
                    <span>${edu.gpa ? 'GPA: ' + edu.gpa : ''}</span>
                </div>
            </div>
        `).join('');

        // Skills HTML
        const skillsPills = d.technical_skills.map(s => `
            <span class="res-pill-tag">${s}</span>
        `).join('');
        const skillsText = d.technical_skills.join(' • ');

        // Experience HTML
        const expHtml = d.experience_data.map(exp => `
            <div class="res-item">
                <div class="res-item-row">
                    <span>${exp.company || ''}</span>
                    <span>${exp.start_date || ''} - ${exp.end_date || 'Present'}</span>
                </div>
                <div class="res-item-sub">
                    <span>${exp.role || ''}</span>
                    <span>${exp.location || ''}</span>
                </div>
                <ul class="res-bullets">
                    ${(exp.bullets || []).map(b => `<li>${b}</li>`).join('')}
                </ul>
            </div>
        `).join('');

        // Certifications HTML
        const certsHtml = d.certifications_data.map(c => `
            <div class="res-item">
                <div class="res-item-row">
                    <span>${c.title || ''}</span>
                    <span>${c.issue_date || ''}</span>
                </div>
                <div class="res-item-sub">
                    <span>${c.issuer || ''}</span>
                </div>
            </div>
        `).join('');

        // Contacts HTML
        const contactParts = [];
        if (d.email) contactParts.push(`<a href="mailto:${d.email}">${d.email}</a>`);
        if (d.phone) contactParts.push(`<span>${d.phone}</span>`);
        if (d.location) contactParts.push(`<span>${d.location}</span>`);
        if (d.external_links?.linkedin) contactParts.push(`<a href="${d.external_links.linkedin}" target="_blank">LinkedIn</a>`);
        if (d.external_links?.github) contactParts.push(`<a href="${d.external_links.github}" target="_blank">GitHub</a>`);
        if (d.external_links?.portfolio) contactParts.push(`<a href="${d.external_links.portfolio}" target="_blank">Portfolio</a>`);

        // Assemble Full Resume DOM
        this.paper.innerHTML = `
            <header class="res-header">
                <h1 class="res-name">${d.full_name || 'Your Full Name'}</h1>
                <div class="res-headline">${d.headline || d.target_role || 'Professional Headline'}</div>
                <div class="res-contacts">
                    ${contactParts.join(' | ')}
                </div>
            </header>

            ${d.summary ? `
            <section class="res-section">
                <h2 class="res-section-title">Professional Summary</h2>
                <p style="font-size:11.5px;line-height:1.55;">${d.summary}</p>
            </section>
            ` : ''}

            ${d.technical_skills.length > 0 ? `
            <section class="res-section">
                <h2 class="res-section-title">Technical Skills</h2>
                ${d.selected_template === 'template-tech' 
                    ? `<div style="margin-top:4px;">${skillsPills}</div>`
                    : `<p class="res-skills-list">${skillsText}</p>`
                }
            </section>
            ` : ''}

            ${d.experience_data.length > 0 ? `
            <section class="res-section">
                <h2 class="res-section-title">Work Experience</h2>
                ${expHtml}
            </section>
            ` : ''}

            ${d.education_data.length > 0 ? `
            <section class="res-section">
                <h2 class="res-section-title">Education</h2>
                ${eduHtml}
            </section>
            ` : ''}

            ${d.certifications_data.length > 0 ? `
            <section class="res-section">
                <h2 class="res-section-title">Certifications & Credentials</h2>
                ${certsHtml}
            </section>
            ` : ''}

            ${d.additional_certs ? `
            <section class="res-section">
                <h2 class="res-section-title">Honors & Key Projects</h2>
                <p style="font-size:11.5px;line-height:1.55;">${d.additional_certs}</p>
            </section>
            ` : ''}
        `;
    }
};

/* ==========================================================================
   6. 4-SESSION WIZARD CONTROLLER
   ========================================================================== */
const Wizard = {
    currentStep: 1,
    totalSteps: 4,

    goToStep(stepNum) {
        this.currentStep = stepNum;
        
        // Update Step Panes
        document.querySelectorAll('.session-step-pane').forEach((p, idx) => {
            p.classList.toggle('active-step', idx + 1 === stepNum);
        });

        // Update Stepper Nodes
        document.querySelectorAll('.step-node').forEach((node, idx) => {
            const step = idx + 1;
            node.classList.toggle('active', step === stepNum);
            node.classList.toggle('completed', step < stepNum);
        });

        // Update Progress Line Fill
        const progressFill = document.getElementById('stepperProgressFill');
        if (progressFill) {
            const pct = ((stepNum - 1) / (this.totalSteps - 1)) * 100;
            progressFill.style.width = `${pct}%`;
        }

        // Update Prev/Next Buttons
        const prevBtn = document.getElementById('btnWizardPrev');
        const nextBtn = document.getElementById('btnWizardNext');
        if (prevBtn) prevBtn.style.visibility = stepNum === 1 ? 'hidden' : 'visible';
        if (nextBtn) {
            nextBtn.innerHTML = stepNum === this.totalSteps 
                ? `<span>Finish & Preview</span><i class='bx bx-check-double'></i>`
                : `<span>Next Session</span><i class='bx bx-right-arrow-alt'></i>`;
        }
    },

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.goToStep(this.currentStep + 1);
            Toast.show(`Advanced to Session ${this.currentStep}`, 'info', 1800);
        } else {
            ResumeState.saveCurrentToDrafts();
            Toast.show('All 4 Sessions completed! Resume saved to My Resumes, loaded into ATS Scanner, & synced to Database.', 'success', 4000);
        }
    },

    prevStep() {
        if (this.currentStep > 1) {
            this.goToStep(this.currentStep - 1);
        }
    }
};

/* ==========================================================================
   7. REAL-TIME ATS SCORER & KEYWORD SCANNER
   ========================================================================== */
const ATSScanner = {
    updateScores() {
        const d = ResumeState.data;
        let score = 50;

        if (d.full_name && d.email && d.phone) score += 10;
        if (d.target_role) score += 10;
        if (d.technical_skills.length >= 5) score += 10;
        if (d.experience_data.length >= 1) score += 10;
        if (d.education_data.length >= 1) score += 10;

        const statAts = document.getElementById('statAtsScore');
        if (statAts) statAts.textContent = `${score}%`;

        const statRole = document.getElementById('statTargetRoles');
        if (statRole) statRole.textContent = d.target_role || 'General Role';
    },

    analyzeFromBuilder(jobDesc) {
        const feedbackEl = document.getElementById('builderAtsFeedback');
        if (!feedbackEl || !jobDesc.trim()) {
            if (feedbackEl) feedbackEl.textContent = '';
            return;
        }

        const keywords = ['react', 'typescript', 'docker', 'aws', 'kubernetes', 'python', 'graphql', 'rest', 'api', 'tailwind'];
        const matched = keywords.filter(kw => jobDesc.toLowerCase().includes(kw) && ResumeState.data.technical_skills.map(s => s.toLowerCase()).includes(kw));
        
        feedbackEl.innerHTML = `<i class='bx bx-check-circle'></i> Matched ${matched.length} core technical keywords from Job Description!`;
    },

    runFullScan(jobDesc) {
        if (!jobDesc || !jobDesc.trim()) {
            Toast.show('Please paste a job description first', 'info', 2500);
            return;
        }

        const commonTechKeywords = [
            'react.js', 'typescript', 'rest apis', 'docker', 'tailwind css', 'graphql', 'performance optimization',
            'python', 'javascript', 'node.js', 'flask', 'postgresql', 'aws', 'ci/cd', 'agile'
        ];

        const lowerDesc = jobDesc.toLowerCase();
        const resumeSkillsLower = ResumeState.data.technical_skills.map(s => s.toLowerCase());

        const matched = [];
        const missing = [];

        commonTechKeywords.forEach(kw => {
            if (lowerDesc.includes(kw)) {
                if (resumeSkillsLower.includes(kw)) {
                    matched.push(kw);
                } else {
                    missing.push(kw);
                }
            }
        });

        const score = Math.min(100, Math.max(45, Math.round((matched.length / Math.max(1, matched.length + missing.length)) * 100)));

        const gauge = document.getElementById('scannerGaugeCircle');
        if (gauge) gauge.setAttribute('data-gauge-score', score.toString());

        const matchedContainer = document.getElementById('matchedKeywordsContainer');
        if (matchedContainer) {
            matchedContainer.innerHTML = matched.map(kw => `<span class="skill-chip active" style="background:var(--match-green);color:#fff;">${kw}</span>`).join('') || '<span style="font-size:12px;color:var(--text-muted);">None detected</span>';
        }

        const missingContainer = document.getElementById('missingKeywordsContainer');
        if (missingContainer) {
            missingContainer.innerHTML = missing.map(kw => `<span class="skill-chip" style="border-color:var(--missing-red);color:var(--missing-red);">${kw}</span>`).join('') || '<span style="font-size:12px;color:var(--text-muted);">No missing keywords!</span>';
        }

        const matchedCount = document.getElementById('matchedCount');
        const missingCount = document.getElementById('missingCount');
        if (matchedCount) matchedCount.textContent = matched.length.toString();
        if (missingCount) missingCount.textContent = missing.length.toString();

        Toast.show(`ATS Match Analysis Complete: ${score}% match rate`, 'success', 3500);
    },

    loadSampleJobDesc() {
        const sampleJD = `We are seeking a Senior Frontend Engineer with deep expertise in React.js, TypeScript, REST APIs, Tailwind CSS, and Performance Optimization. You will collaborate on high-scale web platforms. Experience with Docker containerization and GraphQL is a major plus.`;
        const input = document.getElementById('scannerJobInput');
        if (input) {
            input.value = sampleJD;
            this.runFullScan(sampleJD);
        }
    },

    populateSavedResumesDropdown() {
        const select = document.getElementById('atsSavedResumeSelect');
        if (!select) return;
        if (!ResumeState.savedDrafts || ResumeState.savedDrafts.length === 0) {
            select.innerHTML = '<option value="0">Current Active Resume (Alex Rivera)</option>';
            return;
        }
        select.innerHTML = ResumeState.savedDrafts.map((draft, idx) => `
            <option value="${idx}">${draft.full_name || 'Resume'} – ${draft.target_role || draft.headline || 'General Role'}</option>
        `).join('');
    },

    loadSavedResumeForScan(idx) {
        const selectedIndex = parseInt(idx, 10);
        if (isNaN(selectedIndex) || !ResumeState.savedDrafts[selectedIndex]) return;
        ResumeState.data = JSON.parse(JSON.stringify(ResumeState.savedDrafts[selectedIndex]));
        ResumeState.populateFormFields();
        ResumeRenderer.render();
        Toast.show(`Loaded '${ResumeState.data.full_name || 'Resume'}' into active scanner!`, 'info', 2000);
        const jobInput = document.getElementById('scannerJobInput');
        if (jobInput && jobInput.value.trim()) {
            this.runFullScan(jobInput.value);
        }
    }
};

/* ==========================================================================
   8. RESUME EXPORT & PDF GENERATION UTILITIES
   ========================================================================== */
const ResumeExporter = {
    downloadPDF() {
        ResumeRenderer.render();
        Toast.show('Preparing high-resolution vector ATS PDF...', 'info', 1800);
        setTimeout(() => {
            window.print();
        }, 150);
    },

    exportJSON() {
        const jsonStr = JSON.stringify(ResumeState.data, null, 2);
        const blob = new Blob([jsonStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(ResumeState.data.full_name || 'Resume').replace(/\s+/g, '_')}_ResuMatch.json`;
        a.click();
        URL.revokeObjectURL(url);
        Toast.show('Exported JSON matching backend schema', 'success', 3000);
    },

    copyPlainText() {
        const d = ResumeState.data;
        let text = `${d.full_name.toUpperCase()}\n${d.headline}\n${d.email} | ${d.phone} | ${d.location}\n\n`;
        text += `SUMMARY:\n${d.summary}\n\n`;
        text += `TECHNICAL SKILLS:\n${d.technical_skills.join(', ')}\n\n`;
        text += `EXPERIENCE:\n`;
        d.experience_data.forEach(exp => {
            text += `${exp.role} - ${exp.company} (${exp.start_date} - ${exp.end_date})\n`;
            (exp.bullets || []).forEach(b => text += `• ${b}\n`);
            text += `\n`;
        });
        text += `EDUCATION:\n`;
        d.education_data.forEach(edu => {
            text += `${edu.degree}, ${edu.institution} (${edu.year})\n`;
        });

        navigator.clipboard.writeText(text).then(() => {
            Toast.show('Plaintext copied to clipboard for ATS job boards!', 'success', 3000);
        });
    }
};

/* ==========================================================================
   9. NAVIGATION & UI CONTROLLER
   ========================================================================== */
const AppNav = {
    switchView(viewName) {
        document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active-view'));
        const target = document.getElementById(`view-${viewName}`);
        if (target) target.classList.add('active-view');

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.getAttribute('data-view') === viewName);
        });

        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
};

const UI = {
    togglePresetMenu(event) {
        if (event) event.stopPropagation();
        const menu = document.getElementById('presetMenu');
        if (menu) menu.classList.toggle('open');
    },

    closePresetMenu() {
        const menu = document.getElementById('presetMenu');
        if (menu) menu.classList.remove('open');
    }
};

// Global click listener to close dropdowns
window.addEventListener('click', () => {
    UI.closePresetMenu();
});

// Silent Backend Warm-Up Ping on Load
function silentBackendWarmup() {
    fetch(`${API_BASE_URL}/health`, { method: 'GET', mode: 'cors' })
        .then(res => res.json())
        .then(data => console.log('[ResuMatch API] Server status:', data.message))
        .catch(() => console.log('[ResuMatch API] Standing by in standalone mode...'));
}

/* ==========================================================================
   10. INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    Toast.init();
    ResumeRenderer.init();
    ResumeState.init();
    silentBackendWarmup();
});