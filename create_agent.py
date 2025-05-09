from phi.agent import Agent
from phi.model.groq import Groq

# Create a simple agent with Groq
agent = Agent(
    model=Groq(model="llama3-70b-8192"),
    description="You help people with their health and fitness goals.",
    instructions=[
        "Provide personalized health and fitness advice.",
        "Suggest workout routines based on user goals.",
        "Recommend healthy meal plans.",
        "Always prioritize safety and recommend consulting professionals for medical advice."
    ]
)

# Example usage
print("=== Health and Fitness Agent ===")
response = agent.run("I want to start working out but I don't have much time. Any suggestions?")
print(response)

# Create a Python coding agent
python_agent = Agent(
    model=Groq(model="llama3-70b-8192"),
    description="You help people with Python programming.",
    instructions=[
        "Provide clear and concise Python code examples.",
        "Explain code in a way that's easy to understand.",
        "Follow best practices and PEP 8 style guidelines.",
        "Suggest improvements to user's code when appropriate."
    ]
)

# Example usage
print("\n=== Python Coding Agent ===")
response = python_agent.run("How do I read a CSV file in Python?")
print(response)
