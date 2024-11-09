import logging.config
import asyncio
from .helper_functions import PromptProcessor, load_html_file
import os

# Configuration file paths
config_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "configs", "configs.json"))
# html_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "html_for_testing", "test.html"))
prompt_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "prompts", "extract_from_html.txt"))

# Load HTML content
# html_file = load_html_file(file_path=html_file_path)

# Configure logging
logging_config_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "configs", "logging.conf"))
logging.config.fileConfig(logging_config_path)

# Get logger
logger = logging.getLogger(__name__)

# Initialize the LLM processor
llm = PromptProcessor(config_path=config_path)

# Define an asynchronous function to run the prompt
async def run_prompt(content: str):
    # Await the async prompt method
    return await llm._async_prompting(content=content, prompt_file_path=prompt_path, logger=logger)

# Run the asynchronous function
# if __name__ == "__main__":
#     print(asyncio.run(run_prompt(content=html_file)))