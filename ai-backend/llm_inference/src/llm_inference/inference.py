import logging.config
from helper_functions import PromptProcessor, load_html_file
import os
import json
import asyncio

# Configuration file paths
config_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "configs", "configs.json"))
# html_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "html_for_testing", "test.html"))
html_parser_prompt_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "prompts", "extract_from_html.txt"))
comparision_prompt_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "prompts", "comparision.txt"))
extract_product_information_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "prompts", "extract_product_info.txt"))
extract_user_req_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "prompts", "extract_user_req.txt"))

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
    



async def extract_product_info(content: str, user_req: str) -> dict:
    """
    Parameters:
        content (str): The relevant information extracted from the webpage.
        user_req (str): The product or information the user is requesting.

    Returns:
        dict: The relevant information about the user request in JSON format,
        containing the product name, price, unit or any other relevant data.
    """
    # Prepare the prompt for the LLM
    prompt = f"""
    Website Content: {content}
    User Requested Product: {user_req}
    
    Extract the relevant information from the website content related to the product the user has requested. 
    Return the result in JSON format with the following structure:
    """

    try:
        # Send the prompt to the LLM asynchronously
        product_info = await llm._async_prompting(
            content=prompt, 
            prompt_file_path=extract_product_information_path, 
            logger=logger
        )
        logger.info(f"Output from product info extractor: {product_info}")

        # Attempt to parse the LLM response as JSON
        try:
            extracted_info = json.loads(product_info)
            # Log the successful extraction
            logger.info("Successfully extracted product information from the webpage.")
            return extracted_info
        except json.JSONDecodeError as json_error:
            logger.fatal(f"Failed to parse LLM response as JSON. Error: {json_error}")
            raise ValueError("Unexpected response format from LLM. Expected valid JSON.")

    except Exception as e:
        # Log and raise an error for any unexpected issues in the process
        logger.fatal(f"An error occurred while processing the prompt: {e}")
        raise ValueError(f"Unexpected error: {e}")
    

async def extract_user_req(content: str) -> dict:
    """
    Parameters:
        content (str): The text the user initially gives to the LLM.

    Returns:
        dict: The demands of the user in JSON format.
    """

    try:
        # Send the prompt to the LLM asynchronously
        user_req = await llm._async_prompting(
            content=content, 
            prompt_file_path=extract_user_req_path, 
            logger=logger
        )
        logger.info(f"Output from user req extractor: {user_req}")

        # Attempt to parse the LLM response as JSON
        try:
            extracted_info = json.loads(user_req)
            # Log the successful extraction
            logger.info("Successfully extracted product information from the webpage.")
            return extracted_info
        except json.JSONDecodeError as json_error:
            logger.fatal(f"Failed to parse LLM response as JSON. Error: {json_error}")
            raise ValueError("Unexpected response format from LLM. Expected valid JSON.")

    except Exception as e:
        # Log and raise an error for any unexpected issues in the process
        logger.fatal(f"An error occurred while processing the prompt: {e}")
        raise ValueError(f"Unexpected error: {e}")



# Run the asynchronous function
# if __name__ == "__main__":
#     user_req = """Look for a cheap puppy of Labrador breed, at less than 10000 Rs
#     """
#     print(asyncio.run(extract_user_req(content=user_req)))