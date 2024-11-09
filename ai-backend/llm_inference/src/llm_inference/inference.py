import logging.config
from .helper_functions import PromptProcessor, load_html_file
import os
import json
import asyncio

# Configuration file paths
config_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "configs", "configs.json"))
# html_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "html_for_testing", "test.html"))
html_parser_prompt_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "prompts", "extract_from_html.txt"))
comparision_prompt_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "prompts", "comparision.txt"))
extract_product_information_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "prompts", "extract_product_info.txt"))

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
    



async def extract_product_info(content: str, user_req: str):
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
            logger.fatal(f"Failed to parse LLM response as JSON. Error: {str(json_error)}")
            raise ValueError("Unexpected response format from LLM. Expected valid JSON.")

    except Exception as e:
        # Log and raise an error for any unexpected issues in the process
        logger.fatal(f"An error occurred while processing the prompt: {str(e)}")
        raise ValueError(f"Unexpected error: {str(e)}")



# Run the asynchronous function
# if __name__ == "__main__":
#     article = """The All-New 2024 Velocity X5: A Game-Changer in Automotive
#     Innovation
#     The 2024 Velocity X5 is not just another car; it’s a bold statement
#     in the world of automotive design and performance. Combining cutting-edge
#     technology with sleek aesthetics, the Velocity X5 is built to captivate car
#     enthusiasts and everyday drivers alike.
#     Under the hood, the Velocity X5 boasts a 3.0L turbocharged V6 engine that
#     delivers an impressive 400 horsepower, allowing it to accelerate from
#     0 to 60 mph in just 4.5 seconds. Whether you’re cruising on the highway or
#     taking tight corners, the X5’s responsive handling and adaptive suspension
#     system make every drive an exhilarating experience.
#     Inside, the car is just as impressive. The cabin is outfitted with premium
#     materials, including leather upholstery and real wood accents. A 12.3-inch
#     touchscreen display serves as the command center, offering seamless
#     integration with Apple CarPlay, Android Auto, and a state-of-the-art
#     navigation system. For those who love their music, the Velocity X5 comes
#     equipped with a 15-speaker Harman Kardon sound system, making every drive
#     feel like a concert.
#     Safety is also a top priority with the Velocity X5, featuring an array of
#     advanced driver-assist technologies. These include automatic emergency
#     braking, ane-keeping assist, and adaptive cruise control. The car’s robust structure,
#     combined with airbags and crumple zones, provides an extra layer of protection
#     for its occupants. The 2024 Velocity X5 is available in several trims,
#     including the Sport, Luxury and Performance editions, each offering a
#     unique set of features tailored to different driving preferences. Starting
#     at $55,000, it’s a luxury vehicle that offers outstanding value, making it
#     a compelling choice for anyone looking for a blend of style, power, and
#     cutting-edge tech. Whether you’re looking for a daily driver or a
#     performance powerhouse, the Velocity X5 delivers on all fronts. It’s the
#     car that sets new standards in both innovation and driving pleasure, and
#     it’s ready to take the road by storm.
#     """
#     print(asyncio.run(extract_product_info(content=article, user_req="I want to buy a velocity car")))