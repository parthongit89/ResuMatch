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
        if (this.savedDrafts.length === 0) {
            this.savedDrafts = [JSON.parse(JSON.stringify(this.data))];
            this.persistDrafts();
        }
    },

    persistDrafts() {
        localStorage.setItem('resumatch_drafts', JSON.stringify(this.savedDrafts));
        this.renderDraftsCards();
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
                    <button type="button" class="draft-btn primary" onclick="ResumeState.loadDraft(${idx})">
                        <i class='bx bx-edit-alt'></i> Edit
                    </button>
                    <button type="button" class="draft-btn" onclick="ResumeExporter.downloadPDF()">
                        <i class='bx bx-download'></i> PDF
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
        ResumeState.data.selected_template = templateClass;
        if (this.paper) {
            this.paper.className = `resume-paper ${templateClass}`;
        }
        document.querySelectorAll('.template-btn').forEach(b => b.classList.remove('active'));
        if (btn) btn.classList.add('active');
        this.render();
        Toast.show(`Template switched to ${templateClass.replace('template-', '')}`, 'info', 2000);
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
            Toast.show('All 4 Sessions completed! Review your live ATS resume.', 'success', 3500);
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
    }
};

/* ==========================================================================
   8. RESUME EXPORT & PDF GENERATION UTILITIES
   ========================================================================== */
const ResumeExporter = {
    downloadPDF() {
        Toast.show('Generating high-resolution ATS Print / PDF...', 'info', 2000);
        window.print();
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

        if (viewName === 'jobs' && typeof JobsModule !== 'undefined') {
            JobsModule.render();
        }

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
   10. JOB BOARD MODULE CONTROLLER (EXPANDED ROLES & CAREER MATCHING)
   ========================================================================== */
const JobsModule = {
    jobsList: [
        {
            id: '1',
            title: 'Senior Frontend Engineer',
            company: 'Stripe Partner',
            logo: 'S',
            logoBg: 'linear-gradient(135deg, #6366f1, #4f46e5)',
            category: 'frontend',
            location: 'Remote',
            isRemote: true,
            salary: '$140k - $170k',
            salaryNum: 155000,
            experience: '5+ years',
            desc: 'Architect modern design systems, optimize web vitals performance using React, TypeScript, Next.js, and Tailwind CSS.',
            details: 'As a Senior Frontend Engineer, you will drive front-end architecture, improve core Web Vitals, implement responsive micro-frontends, and build component libraries used by millions of global developers.',
            skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Web Vitals', 'Redux']
        },
        {
            id: '2',
            title: 'Backend Systems Engineer',
            company: 'HyperScale Systems',
            logo: 'H',
            logoBg: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
            category: 'backend',
            location: 'Austin, TX',
            isRemote: false,
            salary: '$130k - $160k',
            salaryNum: 145000,
            experience: '4+ years',
            desc: 'Develop high-throughput REST APIs, microservices, and distributed data indexing with Node.js, Go, PostgreSQL, and Redis.',
            details: 'You will design resilient backend services capable of scaling to hundreds of thousands of requests per second, managing fault-tolerant database clusters and caching topologies.',
            skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis', 'Go', 'Microservices']
        },
        {
            id: '3',
            title: 'AI Platform & LLM Lead',
            company: 'Intelligence Labs',
            logo: 'I',
            logoBg: 'linear-gradient(135deg, #a855f7, #9333ea)',
            category: 'ai',
            location: 'San Francisco, CA',
            isRemote: true,
            salary: '$165k - $200k',
            salaryNum: 182500,
            experience: '5+ years',
            desc: 'Deploy vector databases, RAG architecture, and generative LLM orchestration with Python, PyTorch, FastAPI, and Google Gemini API.',
            details: 'Lead AI integration across customer products by engineering vector search pipelines, fine-tuning domain models, managing GPU deployments, and evaluating model metrics.',
            skills: ['Python', 'FastAPI', 'Gemini API', 'PyTorch', 'Vector DBs', 'LangChain']
        },
        {
            id: '4',
            title: 'Staff Full Stack Engineer',
            company: 'Vercel Ecosystem',
            logo: 'V',
            logoBg: 'linear-gradient(135deg, #10b981, #059669)',
            category: 'fullstack',
            location: 'Remote',
            isRemote: true,
            salary: '$160k - $195k',
            salaryNum: 177500,
            experience: '6+ years',
            desc: 'Build full-stack cloud applications from DB schema to edge middleware using Next.js 14, React, Node.js, GraphQL, and Prisma.',
            details: 'Bridge frontend user experiences with backend cloud services. You will establish coding standards, review PRs, build serverless edge APIs, and improve DX for engineering teams.',
            skills: ['Next.js', 'React', 'Node.js', 'TypeScript', 'GraphQL', 'Prisma']
        },
        {
            id: '5',
            title: 'iOS & Mobile Architect',
            company: 'SwiftPay Mobility',
            logo: 'M',
            logoBg: 'linear-gradient(135deg, #f43f5e, #e11d48)',
            category: 'mobile',
            location: 'New York, NY',
            isRemote: false,
            salary: '$135k - $165k',
            salaryNum: 150000,
            experience: '4+ years',
            desc: 'Craft ultra-fluid native iOS applications with Swift, SwiftUI, Combine, and secure mobile payment gateways.',
            details: 'Spearhead mobile application architecture for over 2 million monthly active users. Focus on smooth animations, offline state sync, biometrics, and modular Swift codebases.',
            skills: ['Swift', 'SwiftUI', 'iOS SDK', 'Combine', 'Mobile Security', 'CI/CD']
        },
        {
            id: '6',
            title: 'Cloud Infrastructure & DevOps Lead',
            company: 'CloudNative Works',
            logo: 'C',
            logoBg: 'linear-gradient(135deg, #f59e0b, #d97706)',
            category: 'devops',
            location: 'Remote',
            isRemote: true,
            salary: '$145k - $175k',
            salaryNum: 160000,
            experience: '5+ years',
            desc: 'Architect multi-cloud Kubernetes clusters, Terraform infrastructure-as-code pipelines, and zero-downtime automated deployments.',
            details: 'Manage automated infrastructure provisioning across AWS and GCP, build GitOps release workflows with ArgoCD, and enforce enterprise cloud security policies.',
            skills: ['Kubernetes', 'Terraform', 'AWS', 'Docker', 'CI/CD', 'Prometheus']
        },
        {
            id: '7',
            title: 'Lead SDET & QA Automation Specialist',
            company: 'QualityScale Tech',
            logo: 'Q',
            logoBg: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            category: 'qa',
            location: 'Chicago, IL',
            isRemote: true,
            salary: '$115k - $145k',
            salaryNum: 130000,
            experience: '3+ years',
            desc: 'Build enterprise E2E automation frameworks using Playwright, Cypress, Python, and CI/CD quality gates.',
            details: 'Design scalable test suites for web, mobile, and REST APIs. Integrate automated regression suites into pull requests to ensure zero critical bugs hit production.',
            skills: ['Playwright', 'Cypress', 'Selenium', 'Python', 'CI/CD Pipelines', 'Jest']
        },
        {
            id: '8',
            title: 'Principal Product Designer (UI/UX)',
            company: 'DesignCraft Studio',
            logo: 'D',
            logoBg: 'linear-gradient(135deg, #ec4899, #db2777)',
            category: 'design',
            location: 'Remote',
            isRemote: true,
            salary: '$130k - $160k',
            salaryNum: 145000,
            experience: '5+ years',
            desc: 'Lead end-to-end product design, craft comprehensive Figma design systems, user journeys, and high-fidelity micro-interactions.',
            details: 'Transform complex user workflows into intuitive visual interface systems. Conduct UX research, usability testing, and partner with front-end engineers to implement design tokens.',
            skills: ['Figma', 'Design Systems', 'User Research', 'Prototyping', 'UI/UX', 'CSS Architecture']
        },
        {
            id: '9',
            title: 'Senior Technical Product Manager',
            company: 'Apex Growth AI',
            logo: 'A',
            logoBg: 'linear-gradient(135deg, #14b8a6, #0d9488)',
            category: 'pm',
            location: 'San Francisco, CA',
            isRemote: false,
            salary: '$150k - $185k',
            salaryNum: 167500,
            experience: '4+ years',
            desc: 'Define product vision, drive sprint execution, and translate customer metrics into scalable AI platform features.',
            details: 'Own product roadmap execution, partner with engineering leads and AI researchers, define success KPIs, and deliver user-centric software releases.',
            skills: ['Product Roadmap', 'Agile/Scrum', 'Data Analytics', 'User Stories', 'A/B Testing']
        },
        {
            id: '10',
            title: 'Data Engineer & Big Data Specialist',
            company: 'DataFlow Systems',
            logo: 'D',
            logoBg: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            category: 'ai',
            location: 'Remote',
            isRemote: true,
            salary: '$135k - $165k',
            salaryNum: 150000,
            experience: '4+ years',
            desc: 'Build real-time ETL/ELT data pipelines, data warehouses with Snowflake, BigQuery, PySpark, and Airflow.',
            details: 'Engineer scalable data streaming and transformation pipelines handling terabytes of analytics data for machine learning models and executive dashboards.',
            skills: ['Python', 'PySpark', 'Snowflake', 'BigQuery', 'Airflow', 'dbt']
        },
        {
            id: '11',
            title: 'Cybersecurity & AppSec Lead',
            company: 'ShieldGate Security',
            logo: 'S',
            logoBg: 'linear-gradient(135deg, #ef4444, #dc2626)',
            category: 'backend',
            location: 'Washington, DC',
            isRemote: true,
            salary: '$150k - $180k',
            salaryNum: 165000,
            experience: '5+ years',
            desc: 'Perform vulnerability assessments, penetration testing, IAM enforcement, and application security audits.',
            details: 'Protect cloud infrastructure and SaaS applications from modern threats. Implement SOC2 controls, automated static/dynamic code analysis (SAST/DAST), and Zero Trust networking.',
            skills: ['Penetration Testing', 'OWASP', 'AppSec', 'OAuth2', 'Cloud Security', 'Python']
        },
        {
            id: '12',
            title: 'Machine Learning Research Engineer',
            company: 'NeuralDynamics',
            logo: 'N',
            logoBg: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            category: 'ai',
            location: 'Boston, MA',
            isRemote: false,
            salary: '$165k - $210k',
            salaryNum: 187500,
            experience: '5+ years',
            desc: 'Research and deploy state-of-the-art computer vision models, fine-tune transformers, and optimize CUDA kernels.',
            details: 'Advance core ML capabilities by training deep learning architectures, publishing research findings, and scaling model inference with TensorRT and Triton server.',
            skills: ['PyTorch', 'TensorFlow', 'Computer Vision', 'MLOps', 'CUDA', 'Python']
        },
        {
            id: '13',
            title: 'Cross-Platform Mobile Lead (Flutter)',
            company: 'OmniApp Technologies',
            logo: 'O',
            logoBg: 'linear-gradient(135deg, #0284c7, #0369a1)',
            category: 'mobile',
            location: 'Remote',
            isRemote: true,
            salary: '$125k - $155k',
            salaryNum: 140000,
            experience: '3+ years',
            desc: 'Develop multi-platform mobile and web applications with Flutter, Dart, Firebase, and clean architecture.',
            details: 'Ship high-performing iOS and Android apps from a single codebase. Maintain high test coverage, state management architecture, and smooth 60fps UI renders.',
            skills: ['Flutter', 'Dart', 'Firebase', 'REST APIs', 'State Management', 'Mobile UI']
        },
        {
            id: '14',
            title: 'Site Reliability Engineer (SRE)',
            company: 'InfraScale Global',
            logo: 'I',
            logoBg: 'linear-gradient(135deg, #10b981, #047857)',
            category: 'devops',
            location: 'Seattle, WA',
            isRemote: false,
            salary: '$140k - $170k',
            salaryNum: 155000,
            experience: '4+ years',
            desc: 'Ensure 99.99% uptime for distributed microservices with automated telemetry, Grafana, Linux, and incident response.',
            details: 'Monitor service level indicators (SLIs/SLOs), lead root cause analysis for infrastructure incidents, build automated self-healing scripts, and reduce operational toil.',
            skills: ['Linux', 'Python/Go', 'Grafana', 'Distributed Systems', 'Kubernetes', 'Incident Response']
        },
        {
            id: '15',
            title: 'Growth Product Manager',
            company: 'SaaS Velocity',
            logo: 'S',
            logoBg: 'linear-gradient(135deg, #f59e0b, #b45309)',
            category: 'pm',
            location: 'Remote',
            isRemote: true,
            salary: '$130k - $160k',
            salaryNum: 145000,
            experience: '3+ years',
            desc: 'Optimize user onboarding funnels, conversion rates, and retention loops through data-driven product experiments.',
            details: 'Analyze user behavior telemetry using Mixpanel and SQL. Design A/B tests to optimize activation rates, free-to-paid conversion, and viral referral loops.',
            skills: ['Growth Hacking', 'Mixpanel', 'Conversion Funnels', 'SQL', 'Product Strategy', 'A/B Testing']
        }
    ],

    savedJobs: [],
    appliedJobs: [],
    currentCategory: 'all',
    searchQuery: '',
    sortBy: 'default',
    selectedJobId: null,

    init() {
        this.bindEvents();
        this.render();
    },

    bindEvents() {
        const searchInput = document.getElementById('jobsSearchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase().trim();
                this.render();
            });
        }

        const sortSelect = document.getElementById('jobsSortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.sortBy = e.target.value;
                this.render();
            });
        }

        const filterPills = document.querySelectorAll('.filter-pills .pill');
        filterPills.forEach(pill => {
            pill.addEventListener('click', () => {
                filterPills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.currentCategory = pill.dataset.cat;
                this.render();
            });
        });
    },

    getFilteredJobs() {
        let list = [...this.jobsList];

        if (this.currentCategory === 'saved') {
            list = list.filter(j => this.savedJobs.includes(j.id));
        } else if (this.currentCategory !== 'all') {
            list = list.filter(j => j.category === this.currentCategory);
        }

        if (this.searchQuery) {
            list = list.filter(j => 
                j.title.toLowerCase().includes(this.searchQuery) ||
                j.company.toLowerCase().includes(this.searchQuery) ||
                j.desc.toLowerCase().includes(this.searchQuery) ||
                j.location.toLowerCase().includes(this.searchQuery) ||
                j.skills.some(s => s.toLowerCase().includes(this.searchQuery))
            );
        }

        if (this.sortBy === 'salary-high') {
            list.sort((a, b) => b.salaryNum - a.salaryNum);
        } else if (this.sortBy === 'salary-low') {
            list.sort((a, b) => a.salaryNum - b.salaryNum);
        } else if (this.sortBy === 'title') {
            list.sort((a, b) => a.title.localeCompare(b.title));
        } else if (this.sortBy === 'ats-fit') {
            list.sort((a, b) => this.calculateFitScore(b.skills) - this.calculateFitScore(a.skills));
        }

        return list;
    },

    calculateFitScore(jobSkills) {
        const userSkills = (ResumeState.data && ResumeState.data.technical_skills && ResumeState.data.technical_skills.length > 0) 
            ? ResumeState.data.technical_skills.map(s => s.toLowerCase()) 
            : ['react.js', 'typescript', 'tailwind css', 'rest apis'];
        
        if (!jobSkills || jobSkills.length === 0) return 75;

        let matchCount = 0;
        jobSkills.forEach(skill => {
            if (userSkills.some(us => us.includes(skill.toLowerCase()) || skill.toLowerCase().includes(us))) {
                matchCount++;
            }
        });

        const score = Math.round((matchCount / jobSkills.length) * 100);
        return Math.max(45, Math.min(98, score));
    },

    updateSummaryStats(filteredList) {
        const totalElem = document.getElementById('jobsTotalCount');
        const avgSalaryElem = document.getElementById('jobsAvgSalary');
        const remoteElem = document.getElementById('jobsRemoteCount');
        const topCatElem = document.getElementById('jobsTopCategory');

        if (totalElem) totalElem.textContent = filteredList.length.toString();

        if (avgSalaryElem) {
            if (filteredList.length === 0) {
                avgSalaryElem.textContent = '$0';
            } else {
                const totalSal = filteredList.reduce((acc, j) => acc + j.salaryNum, 0);
                const avg = Math.round(totalSal / filteredList.length / 1000);
                avgSalaryElem.textContent = `$${avg}k`;
            }
        }

        if (remoteElem) {
            const remoteCount = filteredList.filter(j => j.isRemote).length;
            remoteElem.textContent = remoteCount.toString();
        }

        if (topCatElem) {
            const catMap = {};
            filteredList.forEach(j => {
                catMap[j.category] = (catMap[j.category] || 0) + 1;
            });
            let topCat = 'Tech Roles';
            let maxCount = 0;
            for (let c in catMap) {
                if (catMap[c] > maxCount) {
                    maxCount = catMap[c];
                    topCat = c.toUpperCase();
                }
            }
            topCatElem.textContent = topCat;
        }
    },

    render() {
        const grid = document.getElementById('jobsGridContainer');
        if (!grid) return;

        const filtered = this.getFilteredJobs();
        this.updateSummaryStats(filtered);

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="jobs-empty-state" style="grid-column:1/-1;text-align:center;padding:48px 20px;background:var(--bg-card);border:1px solid var(--border-subtle);border-radius:var(--radius-md);">
                    <i class='bx bx-briefcase-alt-2' style="font-size:3rem;color:var(--text-muted);margin-bottom:12px;"></i>
                    <h4 style="font-size:1.1rem;font-weight:700;color:var(--text-main);">No Openings Found</h4>
                    <p style="font-size:0.85rem;color:var(--text-muted);margin-top:4px;">Try adjusting your search query or choosing another role category.</p>
                    <button class="action-pill-btn primary" onclick="JobsModule.resetFilters()" style="margin-top:16px;">Reset Filters</button>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(job => {
            const isSaved = this.savedJobs.includes(job.id);
            const isApplied = this.appliedJobs.includes(job.id);
            const fitScore = this.calculateFitScore(job.skills);

            return `
                <div class="job-card-modern ${isApplied ? 'applied' : ''}">
                    <div class="job-card-top">
                        <div class="job-logo-box" style="background:${job.logoBg};">
                            ${job.logo}
                        </div>
                        <div class="job-header-meta">
                            <div class="job-title-row">
                                <h4 class="job-title" onclick="JobsModule.openDetailModal('${job.id}')">${job.title}</h4>
                                <button class="btn-bookmark ${isSaved ? 'saved' : ''}" onclick="JobsModule.toggleBookmark('${job.id}', event)" title="${isSaved ? 'Remove Bookmark' : 'Bookmark Job'}">
                                    <i class='bx ${isSaved ? 'bxs-bookmark' : 'bx-bookmark'}'></i>
                                </button>
                            </div>
                            <div class="job-company">${job.company} • <span class="job-loc">${job.location}</span></div>
                        </div>
                    </div>

                    <div class="job-badge-row">
                        <span class="job-pill salary"><i class='bx bx-dollar-circle'></i> ${job.salary}</span>
                        <span class="job-pill exp"><i class='bx bx-time-five'></i> ${job.experience}</span>
                        <span class="job-pill fit-score ${fitScore >= 80 ? 'high' : 'medium'}">
                            <i class='bx bx-check-shield'></i> ${fitScore}% ATS Match
                        </span>
                    </div>

                    <p class="job-desc-snippet">${job.desc}</p>

                    <div class="job-skill-tags">
                        ${job.skills.slice(0, 4).map(s => `<span class="job-tag">${s}</span>`).join('')}
                        ${job.skills.length > 4 ? `<span class="job-tag more">+${job.skills.length - 4}</span>` : ''}
                    </div>

                    <div class="job-card-footer">
                        <button class="btn-job-action primary ${isApplied ? 'applied' : ''}" onclick="${isApplied ? "Toast.show('Already applied to this role!', 'info')" : `JobsModule.openApplyModal('${job.id}')`}">
                            <i class='bx ${isApplied ? 'bx-check-double' : 'bx-send'}'></i>
                            <span>${isApplied ? 'Applied' : 'Quick Apply'}</span>
                        </button>
                        <button class="btn-job-action outline" onclick="JobsModule.checkFitModal('${job.id}')" title="Check ATS score alignment against your current resume">
                            <i class='bx bx-scan'></i>
                            <span>Check Fit</span>
                        </button>
                        <button class="btn-job-action icon-only" onclick="JobsModule.openDetailModal('${job.id}')" title="View Full Job Details">
                            <i class='bx bx-info-circle'></i>
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    },

    resetFilters() {
        this.searchQuery = '';
        this.currentCategory = 'all';
        this.sortBy = 'default';
        const searchInput = document.getElementById('jobsSearchInput');
        if (searchInput) searchInput.value = '';
        const sortSelect = document.getElementById('jobsSortSelect');
        if (sortSelect) sortSelect.value = 'default';
        const filterPills = document.querySelectorAll('.filter-pills .pill');
        filterPills.forEach(p => p.classList.toggle('active', p.dataset.cat === 'all'));
        this.render();
    },

    toggleBookmark(id, e) {
        if (e) e.stopPropagation();
        if (this.savedJobs.includes(id)) {
            this.savedJobs = this.savedJobs.filter(jId => jId !== id);
            Toast.show('Removed job from bookmarks', 'info', 2000);
        } else {
            this.savedJobs.push(id);
            Toast.show('Job saved to bookmarks!', 'success', 2000);
        }
        this.render();
    },

    openDetailModal(id) {
        const job = this.jobsList.find(j => j.id === id);
        if (!job) return;

        const modal = document.getElementById('jobDetailModal');
        if (!modal) return;

        const fitScore = this.calculateFitScore(job.skills);

        document.getElementById('detailJobTitle').textContent = job.title;
        document.getElementById('detailJobCompany').textContent = `${job.company} • ${job.location}`;
        document.getElementById('detailJobSalary').textContent = job.salary;
        document.getElementById('detailJobExp').textContent = job.experience;
        document.getElementById('detailJobFitBadge').textContent = `${fitScore}% ATS Match`;
        document.getElementById('detailJobOverview').textContent = job.details || job.desc;

        const skillsContainer = document.getElementById('detailJobSkills');
        if (skillsContainer) {
            skillsContainer.innerHTML = job.skills.map(s => `<span class="job-tag" style="font-size:0.8rem;padding:4px 10px;">${s}</span>`).join('');
        }

        const applyBtn = document.getElementById('detailApplyBtn');
        if (applyBtn) {
            applyBtn.onclick = () => {
                this.closeDetailModal();
                this.openApplyModal(id);
            };
        }

        modal.style.display = 'flex';
    },

    closeDetailModal() {
        const modal = document.getElementById('jobDetailModal');
        if (modal) modal.style.display = 'none';
    },

    checkFitModal(id) {
        const job = this.jobsList.find(j => j.id === id);
        if (!job) return;

        const userSkills = (ResumeState.data && ResumeState.data.technical_skills && ResumeState.data.technical_skills.length > 0) 
            ? ResumeState.data.technical_skills 
            : ['React.js', 'TypeScript', 'Tailwind CSS', 'REST APIs'];
        const userSkillsLower = userSkills.map(s => s.toLowerCase());

        const matched = [];
        const missing = [];

        job.skills.forEach(s => {
            if (userSkillsLower.some(us => us.includes(s.toLowerCase()) || s.toLowerCase().includes(us))) {
                matched.push(s);
            } else {
                missing.push(s);
            }
        });

        const score = Math.round((matched.length / Math.max(1, job.skills.length)) * 100);

        const modal = document.getElementById('jobFitModal');
        if (!modal) {
            alert(`ATS Compatibility for ${job.title} at ${job.company}:\nMatch Score: ${score}%\n\nMatched: ${matched.join(', ') || 'None'}\nMissing: ${missing.join(', ') || 'None'}`);
            return;
        }

        document.getElementById('fitModalTitle').textContent = `ATS Fit Analysis: ${job.title}`;
        document.getElementById('fitModalCompany').textContent = `${job.company} (${job.location})`;
        document.getElementById('fitScoreDisplay').textContent = `${score}%`;

        const matchedEl = document.getElementById('fitMatchedContainer');
        if (matchedEl) {
            matchedEl.innerHTML = matched.map(m => `<span class="scan-chip match"><i class='bx bx-check'></i> ${m}</span>`).join('') || '<span style="font-size:0.8rem;color:var(--text-muted);">None detected</span>';
        }

        const missingEl = document.getElementById('fitMissingContainer');
        if (missingEl) {
            missingEl.innerHTML = missing.map(m => `<span class="scan-chip missing"><i class='bx bx-x'></i> ${m}</span>`).join('') || '<span style="font-size:0.8rem;color:var(--match-green);">All required skills matched!</span>';
        }

        const recText = document.getElementById('fitRecText');
        if (recText) {
            if (missing.length > 0) {
                recText.innerHTML = `<b>AI Recommendation:</b> Add <i>${missing.slice(0, 2).join(', ')}</i> to your resume skills to reach <b>95%+ fit</b>!`;
            } else {
                recText.innerHTML = `<b>AI Recommendation:</b> Outstanding skill match! Your resume is highly competitive for this role.`;
            }
        }

        modal.style.display = 'flex';
    },

    closeFitModal() {
        const modal = document.getElementById('jobFitModal');
        if (modal) modal.style.display = 'none';
    },

    openApplyModal(id) {
        const job = this.jobsList.find(j => j.id === id);
        if (!job) return;

        this.selectedJobId = id;
        const modal = document.getElementById('jobApplyModal');
        if (!modal) {
            this.submitApplicationDirect(id);
            return;
        }

        document.getElementById('applyModalJobInfo').textContent = `${job.title} at ${job.company}`;
        
        const nameInput = document.getElementById('applyApplicantName');
        if (nameInput) nameInput.value = ResumeState.data.full_name || 'Alex Rivera';
        
        const emailInput = document.getElementById('applyApplicantEmail');
        if (emailInput) emailInput.value = ResumeState.data.email || 'alex.rivera@example.com';
        
        const skillsBox = document.getElementById('applyModalSkills');
        if (skillsBox) {
            skillsBox.innerHTML = job.skills.map(s => `<span class="job-tag">${s}</span>`).join('');
        }

        modal.style.display = 'flex';
    },

    closeApplyModal() {
        const modal = document.getElementById('jobApplyModal');
        if (modal) modal.style.display = 'none';
    },

    submitApplication() {
        if (this.selectedJobId) {
            if (!this.appliedJobs.includes(this.selectedJobId)) {
                this.appliedJobs.push(this.selectedJobId);
            }
        }
        Toast.show('🎉 Application submitted with your ATS-optimized resume!', 'success', 4000);
        this.closeApplyModal();
        this.render();
    },

    submitApplicationDirect(id) {
        if (!this.appliedJobs.includes(id)) {
            this.appliedJobs.push(id);
        }
        Toast.show('🎉 Application submitted with your ATS-optimized resume!', 'success', 4000);
        this.render();
    }
};

/* ==========================================================================
   11. INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    Toast.init();
    ResumeRenderer.init();
    ResumeState.init();
    if (typeof JobsModule !== 'undefined') JobsModule.init();
    silentBackendWarmup();
});