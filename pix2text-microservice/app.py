from pix2text import Pix2Text
import gradio as gr

# Initialize Pix2Text
p2t = Pix2Text()

def extract_text(image):
    try:
        # Extract text from the image
        result = p2t.recognize(image)
        return result
    except Exception as e:
        return f"Error: {str(e)}"

# Create a Gradio interface
interface = gr.Interface(
    fn=extract_text,
    inputs=gr.Image(type="filepath", label="Upload Image"),
    outputs=gr.Textbox(label="Extracted Text"),
    title="Pix2Text Microservice",
    description="Upload an image to extract text and math formulas.",
)

# Launch the interface
interface.launch()