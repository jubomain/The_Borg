from phi.workflow import Workflow
from phi.agent import Agent
from phi.model.groq import Groq

# Define a simple blog post generator workflow
class BlogPostGenerator(Workflow):
    # Define an Agent that will research a topic
    researcher = Agent(
        model=Groq(model="llama3-70b-8192"),
        description="You research topics and gather information.",
        instructions=[
            "Given a topic, research and gather key information.",
            "Focus on facts and reliable information.",
            "Organize information in a structured way."
        ]
    )
    
    # Define an Agent that will write the blog post
    writer = Agent(
        model=Groq(model="llama3-70b-8192"),
        description="You write engaging blog posts.",
        instructions=[
            "Write engaging and informative blog posts.",
            "Use a conversational tone.",
            "Include an introduction, body, and conclusion.",
            "Break content into sections with headings."
        ]
    )
    
    def run(self, topic):
        """Execute the workflow to generate a blog post."""
        print(f"Generating blog post about: {topic}")
        
        # Step 1: Research the topic
        print("Step 1: Researching the topic...")
        research_results = self.researcher.run(f"Research the following topic: {topic}")
        
        # Step 2: Write the blog post
        print("Step 2: Writing the blog post...")
        blog_post = self.writer.run(
            f"Write a blog post about {topic} using this research: {research_results}"
        )
        
        return blog_post

# Create and run the workflow
workflow = BlogPostGenerator()
result = workflow.run("The benefits of meditation")
print("\n=== Generated Blog Post ===\n")
print(result)
