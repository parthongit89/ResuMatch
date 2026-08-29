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