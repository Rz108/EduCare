import openai
import gradio

openai.api_key = ""

messages = [{"role": "system", "content": "You are a financial experts that specializes in real estate investment and negotiation"}]

def chat(user_input):
    messages.append({"role": "user", "content": user_input})

    # Response
    response = openai.ChatCompletion.create(
        model = "gpt-4",
        messages = messages
    )
    # Reply
    reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": reply})
    return reply

demo = gradio.Interface(fn=chat, inputs = "text", outputs = "text", title = "Subject Expert")

demo.launch(share=True)
