import unittest
from sqlmodel import Session, SQLModel, create_engine
from models import Provider, ExtractedIntent
from orchestrator import extract_intent, rank_providers, generate_ai_reasoning, orchestrate


class TestOrchestrator(unittest.TestCase):
    def setUp(self):
        self.engine = create_engine("sqlite:///:memory:")
        SQLModel.metadata.create_all(self.engine)
        self.session = Session(self.engine)
        
        # Seed test providers
        p1 = Provider(
            name="Ali Electrician",
            category="electrician",
            neighborhood_zone="Gulshan",
            rating=4.9,
            completion_rate=0.98,
            available_now=True
        )
        p2 = Provider(
            name="Tariq Plumber",
            category="plumber",
            neighborhood_zone="Gulshan",
            rating=4.8,
            completion_rate=0.95,
            available_now=True
        )
        p3 = Provider(
            name="Usman Painter",
            category="painter",
            neighborhood_zone="DHA",
            rating=4.7,
            completion_rate=0.90,
            available_now=True
        )
        self.session.add_all([p1, p2, p3])
        self.session.commit()

    def tearDown(self):
        self.session.close()

    def test_service_intent_extraction_and_matching(self):
        prompt = "Need a plumber in Gulshan tomorrow"
        res = orchestrate(prompt, self.session)
        
        self.assertTrue(res.intent.is_service_request)
        self.assertEqual(res.intent.service, "plumber")
        self.assertEqual(res.intent.location, "Gulshan")
        self.assertIsNotNone(res.top_provider)
        self.assertEqual(res.top_provider.name, "Tariq Plumber")
        self.assertGreater(len(res.all_matches), 0)

    def test_greeting_prompt_no_service_intent(self):
        prompt = "Hello, how are you?"
        res = orchestrate(prompt, self.session)
        
        self.assertFalse(res.intent.is_service_request)
        self.assertIsNone(res.top_provider)
        self.assertEqual(len(res.all_matches), 0)
        self.assertTrue("Karachi" in res.aiReasoning.summary or "assistant" in res.aiReasoning.summary)

    def test_general_question_no_service_intent(self):
        prompt = "What is 2 + 2?"
        res = orchestrate(prompt, self.session)
        
        self.assertFalse(res.intent.is_service_request)
        self.assertIsNone(res.top_provider)
        self.assertEqual(len(res.all_matches), 0)
        summary_lower = res.aiReasoning.summary.lower()
        self.assertTrue("couldn't detect" in summary_lower or "service" in summary_lower)

    def test_out_of_scope_service_prompt(self):
        prompt = "I need a heart specialist doctor in Clifton"
        res = orchestrate(prompt, self.session)
        
        self.assertIsNone(res.top_provider)
        self.assertEqual(len(res.all_matches), 0)
        summary_lower = res.aiReasoning.summary.lower()
        self.assertTrue("plumbing" in summary_lower or "electrician" in summary_lower or "database" in summary_lower or "available" in summary_lower)


if __name__ == "__main__":
    unittest.main()

