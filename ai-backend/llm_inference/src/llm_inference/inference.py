import logging.config
import asyncio
from .helper_functions import PromptProcessor, load_html_file
import os

# Configuration file paths
config_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "configs", "configs.json"))
# html_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "html_for_testing", "test.html"))
html_parser_prompt_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "prompts", "extract_from_html.txt"))
comparision_prompt_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "prompts", "comparision.txt"))

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
async def html_parser(content: str) -> str:
    """
    Parameters:
        content: This is the html content from which the LLM extracts relevant
        information.
    Output:
        The relevant information in str format.
    """
    # Await the async prompt method
    return await llm._async_prompting(content=content, prompt_file_path=html_parser_prompt_path, logger=logger)

async def required_content_bool(content: str, user_req: str) -> bool:
    """
    Parameters:
        content: The relevant information extracted from the webpage.
        user_req: The product/information the user requested
    Output:
        True or False indicating whether the webpage contains the product/information requested by the user
    """
    # Format the input for the LLM
    prompt = f"""
    Website Content: {content}
    User Query: {user_req}
    
    Compare the website content with the user's query and determine whether the website contains the requested information.
    Your response should be either "yes" or "no".
    """
    comparision_output = await llm._async_prompting(content=prompt, prompt_file_path=comparision_prompt_path, logger=logger)

    # Check the LLM response and map to boolean
    if comparision_output.strip().lower() == "yes":
        logger.info("Returned positive boolean")
        return True
    elif comparision_output.strip().lower() == "no":
        logger.info("Returned negative boolean")
        return False
    else:
        logger.fatal("Did not return a boolean, raising value error")
        raise ValueError("Unexpected response from LLM. Expected 'yes' or 'no'.")


# Run the asynchronous function
# if __name__ == "__main__":
#     print(asyncio.run(required_content_bool(content="This website contains information aboout dogs", user_req="I want cats")))