import unittest

from rag import INSUFFICIENT_ANSWER, RAGService, SearchResult


def result(chunk_id="chunk-1", similarity=0.9):
    return SearchResult(chunk_id, "source-1", "Question: Tools?\nAnswer: Figma.",
                        "ui_ux_designer", "junior", ["tools"], similarity)


class FakeAI:
    def __init__(self, generated=None):
        self.generated = generated or {
            "answer": "The interview mentions Figma [chunk-1].",
            "citations": ["chunk-1"], "insufficient_evidence": False,
        }

    def embed(self, text):
        return [0.1, 0.2]

    def answer(self, question, evidence):
        return self.generated


class FakeRetriever:
    def __init__(self, rows):
        self.rows = rows
        self.call = None

    def search(self, vector, role_family, limit, seniority=None):
        self.call = (vector, role_family, limit, seniority)
        return self.rows


class RAGTests(unittest.TestCase):
    def test_search_passes_role_and_seniority_filters(self):
        retriever = FakeRetriever([result()])
        rows = RAGService(FakeAI(), retriever).search("tools?", "ui_ux_designer", "junior")
        self.assertEqual("chunk-1", rows[0].chunk_id)
        self.assertEqual(([0.1, 0.2], "ui_ux_designer", 5, "junior"), retriever.call)

    def test_chat_returns_grounded_answer_and_only_cited_source(self):
        response = RAGService(FakeAI(), FakeRetriever([result(), result("chunk-2", 0.8)])).chat(
            "What tools?", "ui_ux_designer"
        )
        self.assertFalse(response["insufficient_evidence"])
        self.assertEqual(["chunk-1"], response["citations"])
        self.assertEqual(1, len(response["sources"]))

    def test_low_similarity_refuses_without_generation(self):
        response = RAGService(FakeAI(), FakeRetriever([result(similarity=0.2)]), threshold=0.5).chat(
            "What salary?", "ui_ux_designer"
        )
        self.assertTrue(response["insufficient_evidence"])
        self.assertEqual(INSUFFICIENT_ANSWER, response["answer"])

    def test_unretrieved_citation_is_rejected(self):
        ai = FakeAI({"answer": "Unsupported", "citations": ["made-up"],
                     "insufficient_evidence": False})
        with self.assertRaises(RuntimeError):
            RAGService(ai, FakeRetriever([result()])).chat("tools?", "ui_ux_designer")


if __name__ == "__main__":
    unittest.main()
