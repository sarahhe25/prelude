# tests openai api key connection and embedding generation
# generates a small embedding vector for a test string and prints its dimensions and first five values

from openai import OpenAI

client = OpenAI()

response = client.embeddings.create(
    model="text-embedding-3-small",
    input="Test OpenAI API connection",
)

vector = response.data[0].embedding

print("Embedding dimensions:", len(vector))
print("First five values:", vector[:5])