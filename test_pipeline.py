import argparse
import tempfile
import unittest
from pathlib import Path

import pipeline


SAMPLE = """Interview Transcript: Project Manager
Interviewer: What is a typical day?
PM: I check Jira, then join standup.
Interviewer: What tools do you use?
PM: Jira and Confluence.
"""


class PipelineTests(unittest.TestCase):
    def test_parse_pairs(self):
        pairs = pipeline.parse_transcript(SAMPLE, "Interviewer", "PM")
        self.assertEqual(2, len(pairs))
        self.assertEqual("What is a typical day?", pairs[0][0])

    def test_missing_answer_fails(self):
        with self.assertRaises(ValueError):
            pipeline.parse_transcript("Interviewer: Question only", "Interviewer", "PM")

    def test_stable_records_and_optional_seniority(self):
        pairs = pipeline.parse_transcript(SAMPLE, "Interviewer", "PM")
        args = argparse.Namespace(
            source_id=None, role_family="Project Manager", role_title="Project Manager",
            seniority=None, input=Path("sample.txt"), evidence_status="synthetic",
            review_status="approved_for_demo",
        )
        first = pipeline.make_records(pairs, args, "a" * 64)
        second = pipeline.make_records(pairs, args, "a" * 64)
        self.assertEqual(first, second)
        self.assertIsNone(first[0].seniority)
        self.assertIn("day_in_the_life", first[0].topics)

    # def test_end_to_end_without_embeddings(self):
    #     with tempfile.TemporaryDirectory() as temp:
    #         base = Path(temp)
    #         source, output = base / "source.txt", base / "out"
    #         raw = source.read_text(encoding="utf-8")
    #         source_hash = pipeline.digest(raw)
    #         source.write_text(SAMPLE, encoding="utf-8")
    #         args = argparse.Namespace(
    #             input=source, output=output, role_family="project_manager",
    #             role_title="Project Manager", source_id="pm-demo-001", seniority=None,
    #             interviewer_label="Interviewer", speaker_label="PM",
    #             evidence_status="synthetic", review_status="approved_for_demo",
    #             embedding_model=None, batch_size=64,
    #         )
    #         self.assertEqual(0, pipeline.ingest(args))
    #         self.assertEqual(2, len((output / f"{args.role_family}_records_{source_hash[:8]}.jsonl").read_text().splitlines()))
    #         self.assertTrue((output / f"{args.role_family}_chunks_{source_hash[:8]}.jsonl").exists())
    #         self.assertTrue((output / f"{args.role_family}_validation_report_{source_hash[:8]}.json").exists())


if __name__ == "__main__":
    unittest.main()

