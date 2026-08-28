import re

class ATSService:
    """Service handling ATS Resume Match Scoring, Keyword Analysis, and Feedback Generation"""

    STOPWORDS = {
        'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with',
        'by', 'about', 'against', 'between', 'into', 'through', 'during', 'before',
        'after', 'above', 'below', 'from', 'up', 'down', 'in', 'out', 'off', 'over',
        'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where',
        'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other',
        'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too',
        'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'
    }

    ACTION_VERBS = [
        "architected", "engineered", "optimized", "spearheaded", "accelerated",
        "streamlined", "orchestrated", "implemented", "designed", "scaled",
        "developed", "built", "managed", "created", "led"
    ]

    @staticmethod
    def evaluate_match(resume_text, job_description):
        """Calculates ATS Match percentage and detailed feedback report"""
        if not resume_text or not job_description:
            return False, "Resume text and job description are required", None

        # Clean & Tokenize text
        resume_words = set(re.findall(r'\b[a-zA-Z]{2,}\b', resume_text.lower())) - ATSService.STOPWORDS
        jd_words = set(re.findall(r'\b[a-zA-Z]{2,}\b', job_description.lower())) - ATSService.STOPWORDS

        if not jd_words:
            return False, "Invalid or empty job description text", None

        # Keyword match evaluation
        matched_words = resume_words.intersection(jd_words)
        missing_words = jd_words - resume_words
        keyword_match_percent = round((len(matched_words) / len(jd_words)) * 100, 1)

        # Action verb density check
        resume_verbs_found = [verb for verb in ATSService.ACTION_VERBS if verb in resume_text.lower()]
        verb_score = min(len(resume_verbs_found) * 10, 100)

        # Quantitative metrics check (numbers, percentages, $, etc.)
        has_metrics = bool(re.search(r'\d+%', resume_text) or re.search(r'\$\d+', resume_text) or re.search(r'\b\d+\b', resume_text))
        metrics_score = 100 if has_metrics else 50

        # Weighted final ATS score calculation
        overall_score = round(
            (keyword_match_percent * 0.6) + (verb_score * 0.25) + (metrics_score * 0.15),
            1
        )

        # Compile suggestions
        suggestions = []
        if keyword_match_percent < 70:
            top_missing = list(missing_words)[:8]
            suggestions.append(f"Incorporate missing key technical terms: {', '.join(top_missing)}.")
        if len(resume_verbs_found) < 3:
            suggestions.append("Use strong action verbs like 'Engineered', 'Architected', 'Optimized' at the start of experience bullet points.")
        if not has_metrics:
            suggestions.append("Add quantitative results (e.g. 'Improved speed by 35%', 'Increased users by 10k').")

        return True, "ATS evaluation completed successfully", {
            "overall_score": min(overall_score, 100),
            "keyword_match_percent": keyword_match_percent,
            "matched_keywords": list(matched_words)[:15],
            "missing_keywords": list(missing_words)[:15],
            "action_verbs_found": resume_verbs_found,
            "suggestions": suggestions if suggestions else ["Excellent match! Your resume aligns well with this job description."]
        }
