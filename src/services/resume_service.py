import json
from src.config.database import db
from src.models.resume import ResumeDraft

class ResumeService:
    """Service handling Resume Draft creation, multi-step session updates, retrieval, and deletion"""

    @staticmethod
    def create_draft(user_id, title=None):
        """Creates a new empty resume draft for a user"""
        draft = ResumeDraft(
            user_id=user_id,
            title=title or "Untitled Resume",
            current_session_step=1
        )
        db.session.add(draft)
        db.session.commit()
        return True, "Resume draft created successfully", draft.to_dict()

    @staticmethod
    def get_user_drafts(user_id):
        """Retrieves all resume drafts belonging to a specific user"""
        drafts = ResumeDraft.query.filter_by(user_id=user_id).order_by(ResumeDraft.updated_at.desc()).all()
        return True, "User resume drafts retrieved", [d.to_dict() for d in drafts]

    @staticmethod
    def get_draft_by_id(draft_id, user_id=None):
        """Retrieves a single resume draft by ID"""
        query = ResumeDraft.query.filter_by(id=draft_id)
        if user_id:
            query = query.filter_by(user_id=user_id)
        draft = query.first()
        if not draft:
            return False, "Resume draft not found", None
        return True, "Resume draft retrieved", draft.to_dict()

    @staticmethod
    def update_draft(draft_id, data, user_id=None):
        """Updates base metadata of a resume draft (title, template, current_step)"""
        query = ResumeDraft.query.filter_by(id=draft_id)
        if user_id:
            query = query.filter_by(user_id=user_id)
        draft = query.first()
        if not draft:
            return False, "Resume draft not found", None

        if "title" in data and data["title"] is not None:
            draft.title = data["title"]
        if "selected_template" in data and data["selected_template"] is not None:
            draft.selected_template = data["selected_template"]
        if "current_session_step" in data and data["current_session_step"] is not None:
            draft.current_session_step = data["current_session_step"]

        db.session.commit()
        return True, "Resume draft updated successfully", draft.to_dict()

    @staticmethod
    def update_session_step(draft_id, step, data, user_id=None):
        """Updates session-specific step data for a draft (Step 1 to 4)"""
        query = ResumeDraft.query.filter_by(id=draft_id)
        if user_id:
            query = query.filter_by(user_id=user_id)
        draft = query.first()
        if not draft:
            return False, "Resume draft not found", None

        def serialize_field(val):
            if isinstance(val, (dict, list)):
                return json.dumps(val)
            return str(val) if val is not None else None

        if step == 1:
            if "targeted_roles" in data:
                draft.targeted_roles = serialize_field(data["targeted_roles"])
            if "education_data" in data:
                draft.education_data = serialize_field(data["education_data"])
        elif step == 2:
            if "technical_skills" in data:
                draft.technical_skills = serialize_field(data["technical_skills"])
            if "external_links" in data:
                draft.external_links = serialize_field(data["external_links"])
        elif step == 3:
            if "experience_data" in data:
                draft.experience_data = serialize_field(data["experience_data"])
            if "certifications_data" in data:
                draft.certifications_data = serialize_field(data["certifications_data"])
        elif step == 4:
            if "additional_certs" in data:
                draft.additional_certs = serialize_field(data["additional_certs"])
            if "target_companies" in data:
                draft.target_companies = serialize_field(data["target_companies"])
        else:
            return False, f"Invalid session step '{step}'. Allowed steps: 1 to 4", None

        draft.current_session_step = max(draft.current_session_step, step)
        db.session.commit()

        return True, f"Session step {step} updated successfully", draft.to_dict()

    @staticmethod
    def delete_draft(draft_id, user_id=None):
        """Deletes a resume draft"""
        query = ResumeDraft.query.filter_by(id=draft_id)
        if user_id:
            query = query.filter_by(user_id=user_id)
        draft = query.first()
        if not draft:
            return False, "Resume draft not found", None

        db.session.delete(draft)
        db.session.commit()
        return True, "Resume draft deleted successfully", {"id": draft_id}
