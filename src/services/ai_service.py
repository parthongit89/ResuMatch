import os
import requests

class AIService:
    """Service handling AI Text Enhancement & Template Analysis using Google Gemini API & Fallback Engine"""

    ACTION_VERBS = [
        "Architected", "Engineered", "Optimized", "Spearheaded", "Accelerated",
        "Streamlined", "Orchestrated", "Implemented", "Designed", "Scaled"
    ]

    @staticmethod
    def enhance_text(text, enhance_type="summary", target_role=None):
        """Enhances input text (summary, bullet point, or skills) for professional ATS impact"""
        if not text or not text.strip():
            return False, "Input text cannot be empty", None

        original_text = text.strip()

        # 1. Try Google Gemini AI
        gemini_enhanced = AIService.enhance_via_gemini(original_text, enhance_type, target_role)
        if gemini_enhanced:
            return True, "Enhanced using Google Gemini AI Engine", {
                "original": original_text,
                "enhanced": gemini_enhanced,
                "type": enhance_type,
                "provider": "Gemini AI"
            }

        # 2. Try OpenAI API if key exists
        openai_key = os.getenv('OPENAI_API_KEY')
        if openai_key:
            enhanced = AIService._enhance_via_openai(original_text, enhance_type, target_role, openai_key)
            if enhanced:
                return True, "Enhanced using OpenAI API", {
                    "original": original_text,
                    "enhanced": enhanced,
                    "type": enhance_type,
                    "provider": "OpenAI"
                }

        # 3. Contextual Rule-based Engine Fallback
        enhanced_text = AIService._rule_based_enhancer(original_text, enhance_type, target_role)
        return True, "Enhanced using ResuMatch AI Optimization Engine", {
            "original": original_text,
            "enhanced": enhanced_text,
            "type": enhance_type,
            "provider": "ResuMatch Engine"
        }

    @staticmethod
    def enhance_via_gemini(text, enhance_type="summary", target_role=None):
        """Invokes Google Gemini API to analyze and enhance resume text & templates"""
        gemini_key = os.getenv('GEMINI_API_KEY') or os.getenv('GOOGLE_API_KEY')
        if not gemini_key:
            return None

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={gemini_key}"
            prompt = (
                f"You are an expert ATS recruiter and resume strategist. "
                f"Enhance the following resume {enhance_type} for a targeted role as '{target_role or 'Software Developer'}'. "
                f"Make it ATS-friendly, professional, impact-driven with strong action verbs, and concise:\n\n{text}"
            )

            payload = {
                "contents": [{
                    "parts": [{"text": prompt}]
                }]
            }
            res = requests.post(url, json=payload, timeout=6)
            if res.status_code == 200:
                data = res.json()
                candidates = data.get('candidates', [])
                if candidates:
                    parts = candidates[0].get('content', {}).get('parts', [])
                    if parts:
                        return parts[0].get('text', '').strip()
        except Exception as e:
            print(f"[Gemini API Error]: {e}")
        return None

    @staticmethod
    def _rule_based_enhancer(text, enhance_type, target_role):
        """Internal rule-based text optimization engine"""
        role_label = target_role or "Software Engineer"

        if enhance_type == "summary":
            if "Results-driven" in text or "Specializing in" in text:
                return text

            return (
                f"Results-driven {role_label} with proven expertise in building scalable, high-conversion, "
                f"and resilient web applications. {text.rstrip('.')} with a focus on performance optimization, "
                f"modern architecture, and delivering high business impact."
            )

        elif enhance_type == "bullet":
            lines = [line.strip() for line in text.split('\n') if line.strip()]
            enhanced_lines = []
            for i, line in enumerate(lines):
                verb = AIService.ACTION_VERBS[i % len(AIService.ACTION_VERBS)]
                first_word = line.split()[0] if line.split() else ""
                if first_word.capitalize() in AIService.ACTION_VERBS:
                    enhanced_lines.append(f"{line.rstrip('.')} resulting in a 35% improvement in system efficiency.")
                else:
                    clean_line = line[0].lower() + line[1:] if len(line) > 1 else line
                    enhanced_lines.append(f"{verb} {clean_line.rstrip('.')} with modern standards, slashing latency by 40% and increasing user engagement.")

            return "\n".join(enhanced_lines)

        elif enhance_type == "skills":
            skills_list = [s.strip() for s in text.split(',') if s.strip()]
            keywords = ["TypeScript", "React", "Docker", "PostgreSQL", "CI/CD Pipeline", "RESTful APIs", "Redis"]
            for kw in keywords:
                if kw.lower() not in [s.lower() for s in skills_list]:
                    skills_list.append(kw)
                    if len(skills_list) >= 8:
                        break
            return ", ".join(skills_list)

        return text

    @staticmethod
    def _enhance_via_openai(text, enhance_type, target_role, api_key):
        """Helper to invoke OpenAI API when key is available"""
        try:
            headers = {
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            }
            prompt = f"Enhance this resume {enhance_type} for a {target_role or 'software developer'}: {text}. Keep it concise, high impact, with action verbs."
            payload = {
                "model": "gpt-3.5-turbo",
                "messages": [{"role": "user", "content": prompt}],
                "max_tokens": 200,
                "temperature": 0.7
            }
            res = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=5)
            if res.status_code == 200:
                return res.json()['choices'][0]['message']['content'].strip()
        except Exception:
            pass
        return None
