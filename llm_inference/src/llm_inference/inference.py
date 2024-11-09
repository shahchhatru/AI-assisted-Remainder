import logging.config
import asyncio
from helper_functions import PromptProcessor, load_html_file

# Configuration file paths
config_path = "src/llm_inference/configs/configs.json"
html_file_path = "src\llm_inference\html_for_testing\Buy second hand Toyota Avanza 1300CC Petrol 2012 RWD 7 Seater Car in SanoThimi-Tershatar-Kaushaltar Road, Danfe Tole, सानो थिमि, Madhyapur Thimi-02, Madhyapur Thimi, मध्यपुर थिमि नगरपालिका, भक्तपुर, बाग्मती प्रदेश, 42600, नेप.html"
prompt_path = r"src\llm_inference\prompts\extract_from_html.txt"

# Load HTML content
html_file = load_html_file(file_path=html_file_path)

# Configure logging
logging_config_path = r"src\llm_inference\configs\logging.conf"
logging.config.fileConfig(logging_config_path)

# Get logger
logger = logging.getLogger(__name__)

# Initialize the LLM processor
llm = PromptProcessor(config_path=config_path)

# Define an asynchronous function to run the prompt
async def run_prompt():
    # Await the async prompt method
    return await llm._async_prompting(content=html_file, prompt_file_path=prompt_path, logger=logger)

# Run the asynchronous function
if __name__ == "__main__":
    print(asyncio.run(run_prompt()))