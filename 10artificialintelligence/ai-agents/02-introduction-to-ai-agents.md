# AI Agents — Unit 2: Introduction to AI Agents

This unit covers the spectrum of agent designs used in robotics, from simple rule-based reactive agents to LLM-driven agents that plan with natural language, and introduces Retrieval-Augmented Generation (RAG) as a way to ground those agents in facts they weren't trained on.

## Rule-based agents
The simplest agent is a lookup table or a chain of `if`/`elif` statements mapping sensed state to an action. These are fast, fully predictable, and easy to verify — which is exactly why safety-critical low-level behaviors (e.g. "stop if obstacle_distance < 0.3m") are almost always implemented this way, even in agents that use an LLM for higher-level reasoning.

```python
def rule_based_agent(state: dict) -> str:
    if state["obstacle_distance"] < 0.3:
        return "stop"
    if state["battery_pct"] < 15:
        return "return_to_dock"
    return "continue"
```

The limitation: rules don't generalize. Every new situation needs a new branch, and the branches can conflict as the table grows. This is the motivation for the next step.

## LLM-driven agents
An LLM-driven agent replaces (or augments) the hand-written rule table with a call to a language model that receives the current state as text and returns a decision — often as structured output (JSON) rather than free text, so the calling code can act on it reliably.

```python
import json

SYSTEM_PROMPT = """You control a mobile robot. Given the sensor state,
respond with JSON: {"action": "stop"|"continue"|"return_to_dock", "reason": str}"""

def llm_agent(state: dict, client) -> dict:
    response = client.messages.create(
        model="claude-sonnet-4-5",
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": json.dumps(state)}],
        max_tokens=200,
    )
    return json.loads(response.content[0].text)
```

The advantage is generalization: the model can reason about novel combinations of sensor readings without you writing a new branch. The cost is latency (an API round-trip instead of a comparison), non-determinism, and the need for validation — always check the model's output shape before trusting it, and keep a rule-based fallback for anything safety-critical.

## Retrieval-Augmented Generation (RAG)
An LLM only knows what was in its training data plus what you put in the prompt. RAG closes that gap: before calling the model, you retrieve relevant documents (a map annotation, a maintenance log, a facility's operating procedure) from a store and inject them into the prompt as context.

A minimal RAG pipeline has three stages:

1. **Index** — split your documents into chunks, embed each chunk into a vector, store them (a simple in-memory list of `(vector, text)` pairs is enough to start; libraries like FAISS or a vector database scale it up).
2. **Retrieve** — embed the current query/state, find the nearest stored chunks by cosine similarity.
3. **Augment** — insert the retrieved text into the prompt before calling the LLM.

```python
import numpy as np

def cosine_sim(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

def retrieve(query_vec, index, top_k=3):
    scored = [(cosine_sim(query_vec, vec), text) for vec, text in index]
    scored.sort(reverse=True, key=lambda x: x[0])
    return [text for _, text in scored[:top_k]]
```

For a robot, RAG is what lets an agent answer "is this room safe to enter?" by pulling in a facility hazard log rather than hallucinating an answer from general training knowledge.

## Try it yourself
Extend the `llm_agent` snippet above so it first calls a `retrieve()` function against a small hard-coded list of three "facility notes" (e.g. `"Room 4 floor is wet"`, `"Battery charger is in Bay 2"`), includes the top match in the prompt, and only then asks the model to decide the next action. Confirm with a print statement that the retrieved note actually changes the model's decision when you swap it out.
