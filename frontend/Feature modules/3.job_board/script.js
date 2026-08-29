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

    activeCategory: 'all',
    searchQuery: '',

    async init() {
        this.bindFilters();
        this.bindSearch();
        await this.fetchJobsFromBackend('all');
    },

    bindFilters() {
        const pills = document.querySelectorAll('.filter-pills .pill');
        pills.forEach(p => {
            p.addEventListener('click', async () => {
                pills.forEach(btn => btn.classList.remove('active'));
                p.classList.add('active');
                this.activeCategory = p.dataset.cat;
                await this.fetchJobsFromBackend(this.activeCategory, this.searchQuery);
            });
        });
    },

    bindSearch() {
        const searchInput = document.getElementById('jobSearchInput');
        if (searchInput) {
            let debounceTimer;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(async () => {
                    this.searchQuery = e.target.value.trim();
                    await this.fetchJobsFromBackend(this.activeCategory, this.searchQuery);
                }, 300);
            });
        }
    },

    /**
     * FETCH LIVE JOBS FROM FLASK BACKEND API (/api/v1/jobs)
     */
    async fetchJobsFromBackend(category = 'all', query = '') {
        const grid = document.getElementById('jobsGrid');
        if (grid) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">
                <i class='bx bx-loader-alt bx-spin' style="font-size:32px; color: var(--brand);"></i>
                <p style="margin-top:12px;">Fetching live job postings...</p>
            </div>`;
        }

        try {
            const params = new URLSearchParams();
            if (category && category !== 'all') params.append('category', category);
            if (query) params.append('query', query);

            const res = await fetch(`/api/v1/jobs?${params.toString()}`);
            if (res.ok) {
                const payload = await res.json();
                if (payload.success && Array.isArray(payload.data)) {
                    this.jobsList = payload.data;
                    this.renderJobs();
                    return;
                }
            }
        } catch (err) {
            console.warn('[JobsModule] Backend API unreachable, rendering offline jobs dataset:', err);
        }

        // Fallback rendering
        this.renderJobs();
    },

    renderJobs() {
        const grid = document.getElementById('jobsGrid');
        if (!grid) return;

        if (this.jobsList.length === 0) {
            grid.innerHTML = `<div style="grid-column: 1/-1; text-align:center; padding: 40px; color: var(--text-muted);">
                <i class='bx bx-search-alt' style="font-size:40px;"></i>
                <p style="margin-top:12px;">No live jobs found matching your search criteria.</p>
            </div>`;
            return;
        }

        grid.innerHTML = this.jobsList.map(job => `
            <div class="job-card">
                <div class="card-head">
                    <div class="logo-badge">${job.logo || 'J'}</div>
                    <div>
                        <div class="title">${job.title}</div>
                        <div class="company">${job.company}</div>
                    </div>
                </div>
                <div class="loc-salary">${job.location || 'Remote'} • <span style="color:var(--match);font-weight:600;">${job.salary || 'Competitive'}</span></div>
                <p class="desc">${job.desc}</p>
                <div class="tags">
                    ${(job.skills || []).map(s => `<span class="tag">${s}</span>`).join('')}
                </div>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="JobsModule.openApplyModal('${job.title.replace(/'/g, "\\'")}', '${job.company.replace(/'/g, "\\'")}', '${job.url || '#'}')">Quick Apply</button>
                    <button class="btn btn-outline" onclick="alert('ATS Keyword Match: Strong alignment for ${(job.skills || ['React', 'Python']).slice(0, 2).join(', ')}!')">Check Fit</button>
                </div>
            </div>
        `).join('');
    },

    openApplyModal(title, company, url = '#') {
        document.getElementById('modalJobInfo').innerHTML = `<strong>${title}</strong> at <strong>${company}</strong>`;
        const applyBtn = document.getElementById('confirmApplyBtn');
        if (applyBtn) {
            applyBtn.onclick = () => {
                if (url && url !== '#') {
                    window.open(url, '_blank');
                }
                this.submitApplication();
            };
        }
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
