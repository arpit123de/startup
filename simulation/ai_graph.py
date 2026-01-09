from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
import os
from dotenv import load_dotenv
load_dotenv()
# -------------------------------------------------
# LLM CONFIG
# -------------------------------------------------
llm = ChatGroq(
    api_key=os.getenv("GROQ_API_KEY"),
    model="llama-3.1-8b-instant",
    temperature=0.3,
    max_tokens=150,
)

# -------------------------------------------------
# SINGLE-MESSAGE AGENT PROMPT
# -------------------------------------------------
AGENT_PROMPT = """
You are the {role} in a startup discussion.

Startup idea:
{idea}

Message from previous agent:
{message}

Rules:
- 2–3 short lines
- Simple words
- Add new value only
- No repetition

Reply:
"""

# -------------------------------------------------
# AGENT FACTORY
# -------------------------------------------------
def create_agent(role: str):
    prompt = PromptTemplate(
        template=AGENT_PROMPT,
        input_variables=["idea", "message", "role"],
    )

    chain = prompt | llm | StrOutputParser()

    def run(state: dict):
        """
        Runs exactly ONE agent.
        Mutates state safely.
        """

        output = chain.invoke({
            "idea": state["idea"],
            "message": state["current_message"],
            "role": role,
        }).strip()

        # Store output
        state["history"].append({
            "agent": role,
            "output": output,
        })

        # Pass output forward
        state["current_message"] = output

        return state

    return run

# -------------------------------------------------
# AGENT REGISTRY (IMPORTANT)
# -------------------------------------------------
agents = {
    "Customer": create_agent("Customer"),
    "CEO": create_agent("CEO"),
    "Marketing": create_agent("Marketing"),
    "Finance": create_agent("Finance"),
    "Tech": create_agent("Tech"),
}

# -------------------------------------------------
# AGENT ORDER (USED BY VIEW)
# -------------------------------------------------
AGENT_ORDER = ["Customer", "CEO", "Marketing", "Finance", "Tech"]
