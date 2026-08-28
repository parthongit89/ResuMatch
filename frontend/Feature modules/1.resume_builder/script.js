/**
 * MODULE 1: RESUME BUILDER ENGINE
 * Live data-binding, dynamic experience lists, and print PDF export
 */



"use strict";

const BuilderModule = {
    data: {
        name: "Alex Rivera",
        title: "Senior Frontend Developer",
        email: "alex@example.com",
        phone: "+1 (555) 349-2041",
        location: "San Francisco, CA",
        links: "linkedin.com/in/alex",
        summary: "Results-driven Frontend Engineer with expertise in building scalable, accessible, and high-conversion web applications using React, TypeScript, and modern CSS architecture.",
        skillsLang: "React, TypeScript, JavaScript, HTML5, CSS3",
        skillsTools: "Docker, Git, PostgreSQL, Redis, Jest",
        experience: [
            {
                title: "Senior Frontend Engineer",
                company: "Apex Cloud",
                dates: "2023 - Present",
                bullets: "Architected micro-frontend architecture with React and TypeScript.\nReduced bundle size by 35% and improved LCP Core Web Vitals to 1.1s."
            }
        ]
    },

    init() {
        this.bindInputs();
        this.renderAll();

        document.getElementById('addExpBtn')?.addEventListener('click', () => this.addExp());
        document.getElementById('loadSampleBtn')?.addEventListener('click', () => this.loadSample());
        document.getElementById('clearBtn')?.addEventListener('click', () => this.clear());
        document.getElementById('printPdfBtn')?.addEventListener('click', () => window.print());
        document.getElementById('aiEnhanceBtn')?.addEventListener('click', () => this.aiEnhance());
    },

};