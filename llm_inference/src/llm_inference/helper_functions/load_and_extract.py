import json
import os


def load_prompt(file_path: str) -> str:
    with open(file_path, "r", encoding="utf-8") as file:
        return file.read()


def save_responses_to_file(
    responses: str,
    filename: str,
    directory: str,
):
    if not os.path.exists(directory):
        os.makedirs(directory)

    filepath = os.path.join(directory, filename)

    with open(filepath, "w") as file:
        for i, response in enumerate(responses):
            file.write(f"Response Number {i}:\n")

            # Convert response to JSON string
            if isinstance(response, dict):
                response_str = json.dumps(
                    response, indent=4
                )  # Format the dict as a JSON string
            else:
                response_str = str(response)  # Handle other types (e.g., strings)

            file.write(response_str + "\n\n")


def load_config(config_path: str):
    """Load configuration from a JSON file."""
    try:
        with open(config_path, "r") as file:
            config = json.load(file)
        return config
    except FileNotFoundError:
        raise FileNotFoundError(f"Configuration file not found: {config_path}")
    except json.JSONDecodeError:
        raise ValueError(f"Error decoding JSON from the file: {config_path}")
    

def load_html_file(file_path:str):
    """
    Loads the content of an HTML file from the given file path.

    Args:
        file_path (str): The path to the HTML file.

    Returns:
        str: The content of the HTML file as a string.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            html_content = file.read()
        return html_content
    except FileNotFoundError:
        print(f"Error: The file at path '{file_path}' was not found.")
        return None
    except Exception as e:
        print(f"Error: An unexpected error occurred - {e}")
        return None
