/**
 * MODULE 2: ATS KEYWORD SCANNER & RADIAL SCORE ENGINE
 */

"use strict";


const ScannerModule = {
    skillsList: [
        'React', 'React.js', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'Tailwind CSS',
        'Next.js', 'Node.js', 'Express', 'Python', 'FastAPI', 'REST APIs', 'GraphQL',
        'Docker', 'Kubernetes', 'AWS', 'PostgreSQL', 'MongoDB', 'Redis', 'Git', 'CI/CD',
        'Jest', 'Testing', 'Web Vitals', 'Performance Optimization', 'Redux'
    ],

    sampleJob: `Senior Frontend Developer (React & TypeScript)
Requirements:
- 3+ years experience with React.js, TypeScript, Next.js, and modern CSS.
- Solid experience in REST APIs, Docker containerization, and Git.
- Unit testing with Jest and Web Vitals performance optimization.`,

    sampleResume: `Alex Rivera - Senior Frontend Developer
Skills: React.js, TypeScript, JavaScript, HTML5, CSS3, Tailwind CSS, REST APIs, Git, Next.js`,

    init() {
        document.getElementById('jobInput').value = this.sampleJob;
        document.getElementById('resumeInput').value = this.sampleResume;

        document.getElementById('scanBtn')?.addEventListener('click', () => this.runScan());
        document.getElementById('loadSampleJobBtn')?.addEventListener('click', () => {
            document.getElementById('jobInput').value = this.sampleJob;
        });

        this.runScan();
    },

    // 
    // UPGRADE HOOK: CONNECT GOOGLE GEMINI 1.5 FLASH / FASTAPI BACKEND HERE(for PARTH)
    // 
    async runScan() {
        const jobText = document.getElementById('jobInput')?.value || "";
        const resumeText = document.getElementById('resumeInput')?.value || "";

        if (!jobText.trim()) {
            alert('Please paste a Job Description.');
            return;
        }

        /* 
        // Example Remote AI Call (Future Upgrade):
        const res = await fetch('http://localhost:8000/api/ats/score', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ job: jobText, resume: resumeText })
        });
        const data = await res.json();
        */

        // Client-side extraction logic
        const lowerJob = jobText.toLowerCase();
        const lowerResume = resumeText.toLowerCase();

        const required = this.skillsList.filter(s => {
            const pattern = new RegExp(`\\b${s.toLowerCase().replace('.', '\\.')}\\b`, 'i');
            return pattern.test(lowerJob);
        });

        const matched = [];
        const missing = [];

        required.forEach(s => {
            const pattern = new RegExp(`\\b${s.toLowerCase().replace('.', '\\.')}\\b`, 'i');
            if (pattern.test(lowerResume)) {
                matched.push(s);
            } else {
                missing.push(s);
            }
        });

        const total = matched.length + missing.length;
        const score = total > 0 ? Math.round((matched.length / total) * 100) : 80;

        this.renderOutput(score, matched, missing);
    },

    renderOutput(score, matched, missing) {
        document.getElementById('scoreVal').textContent = `${score}%`;

        // SVG circumference for r=50 is ~314.15
        const circle = document.getElementById('scoreCircle');
        if (circle) {
            const offset = 314.15 - (score / 100) * 314.15;
            circle.style.strokeDashoffset = offset;
            circle.style.stroke = score >= 80 ? 'var(--match)' : (score >= 60 ? 'var(--warn)' : 'var(--miss)');
        }

        document.getElementById('matchCount').textContent = matched.length;
        document.getElementById('missCount').textContent = missing.length;

        document.getElementById('matchedChips').innerHTML = matched.map(s => `
            <span class="chip chip-match"><i class='bx bx-check'></i> ${s}</span>
        `).join('') || '<span style="font-size:0.8rem;color:#888;">None</span>';

        document.getElementById('missingChips').innerHTML = missing.map(s => `
            <span class="chip chip-miss"><i class='bx bx-x'></i> ${s}</span>
        `).join('') || '<span style="font-size:0.8rem;color:#888;">No gaps detected!</span>';

        const recs = document.getElementById('recsList');
        if (recs) {
            if (missing.length > 0) {
                recs.innerHTML = `<li>Add <b>${missing.slice(0, 3).join(', ')}</b> to your technical skills to improve ATS pass rates.</li>`;
            } else {
                recs.innerHTML = `<li>Excellent! Your resume matches all extracted keywords from this job post.</li>`;
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    ScannerModule.init();
});
