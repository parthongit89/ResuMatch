/**
 * MODULE 3: JOB BOARD CONTROLLER
 * Category filtering, check ATS fit triggers, and apply simulation
 */

"use strict";

const JobsModule = {
    jobsList: [
        {
            id: '1',
            title: 'Senior Frontend Engineer',
            company: 'Stripe Partner',
            logo: 'S',
            category: 'frontend',
            location: 'Remote',
            salary: '$140k - $170k',
            desc: 'Architect modern design systems, optimize web vitals performance using React, TypeScript, and Tailwind CSS.',
            skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Web Vitals']
        },
        {
            id: '2',
            title: 'Backend Systems Engineer',
            company: 'HyperScale Systems',
            logo: 'H',
            category: 'backend',
            location: 'Austin, TX',
            salary: '$130k - $160k',
            desc: 'Develop high-throughput REST APIs and data indexing with Node.js, PostgreSQL, and Redis.',
            skills: ['Node.js', 'PostgreSQL', 'Docker', 'Redis']
        },
        {
            id: '3',
            title: 'AI Platform Engineer',
            company: 'Intelligence Labs',
            logo: 'I',
            category: 'ai',
            location: 'San Francisco, CA',
            salary: '$155k - $190k',
            desc: 'Deploy vector databases and LLM orchestration with Python, FastAPI, and Google Gemini API.',
            skills: ['Python', 'FastAPI', 'Gemini API', 'Docker']
        }
    ],

    init() {
        this.renderJobs('all');
        this.bindFilters();
    },

    bindFilters() {
        const pills = document.querySelectorAll('.filter-pills .pill');
        pills.forEach(p => {
            p.addEventListener('click', () => {
                pills.forEach(btn => btn.classList.remove('active'));
                p.classList.add('active');
                this.renderJobs(p.dataset.cat);
            });
        });
    },

    // 
    // UPGRADE HOOK: CONNECT SUPABASE / POSTGRES JOB DATABASE HERE
    // 
    async fetchJobsFromBackend() {
        /*
        const res = await fetch('/api/jobs');
        this.jobsList = await res.json();
        this.renderJobs('all');
        */
    },

    renderJobs(cat = 'all') {
        const grid = document.getElementById('jobsGrid');
        if (!grid) return;

        const filtered = cat === 'all' ? this.jobsList : this.jobsList.filter(j => j.category === cat);

        grid.innerHTML = filtered.map(job => `
            <div class="job-card">
                <div class="card-head">
                    <div class="logo-badge">${job.logo}</div>
                    <div>
                        <div class="title">${job.title}</div>
                        <div class="company">${job.company}</div>
                    </div>
                </div>
                <div class="loc-salary">${job.location} • <span style="color:var(--match);font-weight:600;">${job.salary}</span></div>
                <p class="desc">${job.desc}</p>
                <div class="tags">
                    ${job.skills.map(s => `<span class="tag">${s}</span>`).join('')}
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="JobsModule.openApplyModal('${job.title}', '${job.company}')">Quick Apply</button>
                    <button class="btn btn-outline" onclick="alert('ATS Check: Matches ${job.skills.slice(0, 2).join(', ')}!')">Check Fit</button>
                </div>
            </div>
        `).join('');
    },

    openApplyModal(title, company) {
        document.getElementById('modalJobInfo').textContent = `${title} at ${company}`;
        document.getElementById('applyModal').style.display = 'flex';
    },

    closeModal() {
        document.getElementById('applyModal').style.display = 'none';
    },

    submitApplication() {
        alert('🎉 Application submitted with your ATS-optimized resume!');
        this.closeModal();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    JobsModule.init();
});
