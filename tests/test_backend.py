import os
import sys
import unittest
import json

# Add root directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from src.app import create_app
from src.config.database import db

class BackendTestCase(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_health_check(self):
        """Test API Health Check endpoint"""
        res = self.client.get('/api/v1/health')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['success'])

    def test_resume_draft_workflow(self):
        """Test creating, step-updating, fetching, and deleting a resume draft"""
        # 1. Create Draft
        res = self.client.post('/api/v1/resumes', json={"title": "Test Resume"})
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 201)
        self.assertTrue(data['success'])
        draft_id = data['data']['id']

        # 2. Update Session Step 1
        res = self.client.put(
            f'/api/v1/resumes/{draft_id}/session/step-1',
            json={
                "targeted_roles": ["Full Stack Engineer"],
                "education_data": [{"degree": "B.S. CS", "school": "MIT"}]
            }
        )
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)

        # 3. Get Draft
        res = self.client.get(f'/api/v1/resumes/{draft_id}')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(data['data']['title'], "Test Resume")

        # 4. Delete Draft
        res = self.client.delete(f'/api/v1/resumes/{draft_id}')
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)

    def test_ai_enhance_api(self):
        """Test AI text enhancement API endpoint"""
        res = self.client.post(
            '/api/v1/ai/enhance',
            json={
                "text": "Built web applications for users.",
                "type": "summary",
                "target_role": "Senior Frontend Developer"
            }
        )
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['success'])
        self.assertIn("enhanced", data['data'])

    def test_ats_score_api(self):
        """Test ATS Matcher score calculation API endpoint"""
        resume_text = "Architected micro-services with Python, Flask, PostgreSQL, and Docker. Reduced latency by 35%."
        job_description = "Seeking a Senior Python Developer with experience in Flask, Docker, and PostgreSQL optimization."

        res = self.client.post(
            '/api/v1/ats/score',
            json={
                "resume_text": resume_text,
                "job_description": job_description
            }
        )
        data = json.loads(res.data)
        self.assertEqual(res.status_code, 200)
        self.assertTrue(data['success'])
        self.assertGreater(data['data']['overall_score'], 0)

    def test_frontend_routes(self):
        """Test that static feature module routes return 200"""
        res_login = self.client.get('/')
        self.assertEqual(res_login.status_code, 200)

        res_builder = self.client.get('/builder')
        self.assertEqual(res_builder.status_code, 200)

        res_ats = self.client.get('/ats')
        self.assertEqual(res_ats.status_code, 200)

if __name__ == '__main__':
    unittest.main()
