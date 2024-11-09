from dotenv import load_dotenv
import asyncio
import logging
from groq import Groq

from .load_and_extract import load_config, load_prompt


class PromptProcessor:
    def __init__(self, config_path: str):
        # Load environment variables
        load_dotenv()
        # Load configuration
        self.config = load_config(config_path)
        # Initialize the LLM
        self.client = Groq()

    async def _async_prompting(
        self,
        content: str,
        prompt_file_path: str,
        logger: logging.Logger,
    ):
        logger = logging.getLogger(__name__)
        try:
            try:
                # Load the prompt
                prompt = load_prompt(file_path=prompt_file_path)
            except Exception as e:
                logger.fatal(f"Failed to load prompt: {e}")
                raise

            chat_completion = self.client.chat.completions.create(
                model=self.config.get("model_name"),
                temperature=self.config.get("temperature"),
                messages=[
                    {
                        "role": "system",
                        "content": prompt,
                    },
                    {
                        "role": "user",
                        "content": content
                    }

                ]
            )

            response = chat_completion.choices[0].message.content
            logger.info("Result: Output received")
            return response
        except Exception as e:
            logger.error(f"Error in _async_prompting: {repr(e)}")
            return e

    async def prompting_with_timeout(
        self,
        prompt_path: str,
        data_string: str,
        logger: logging.Logger,
        timeout: int = 500,
    ):
        logger = logging.getLogger(__name__)
        try:
            # Call the async prompt function with a timeout
            output = await asyncio.wait_for(
                self._async_prompting(
                    content=data_string,
                    prompt_file_path=prompt_path,
                    logger=logger
                ),
                timeout,
            )
            return output
        except asyncio.TimeoutError:
            logger.warning("Result: Operation timed out")
        except Exception as e:
            logger.warning(f"Unexpected error: {e}")


# Usage Example
if __name__ == "__main__":
    config_path = "src/post_ocr_extraction/configs/config.json"
    processor = PromptProcessor(config_path)
    prompt_path = "path/to/prompt/file"
    data_string = "Your data string here"
    timeout = 10  # seconds

    # Run the asynchronous method
    async def run():
        result = await processor.prompting_with_timeout(
            prompt_path, data_string, timeout
        )
        print(result)

    asyncio.run(run())
