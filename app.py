from re import split
from flask_bootstrap import Bootstrap
import test
import voiceAnalyzer
import time
import pyaudio
import os
import wave
from flask_socketio import SocketIO
import os
import cv2
import numpy as np
from tensorflow.keras.models import model_from_json
from tensorflow.keras.preprocessing import image
import json
from flask import Flask, render_template, Response, jsonify, request
import gradio as gr


cap = cv2.VideoCapture(0)
res = ''
def exp():
    global res
    #load model
    model = model_from_json(open("fer.json", "r").read())
    #load weights
    model.load_weights('fer.h5')


    face_haar_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')


    cap=cv2.VideoCapture(0)
    count_anx=0
    count_desp=0
    count_normal=0

    while True:
        ret,test_img=cap.read()# captures frame and returns boolean value and captured image
        if not ret:
            continue
        gray_img= cv2.cvtColor(test_img, cv2.COLOR_BGR2GRAY)

        faces_detected = face_haar_cascade.detectMultiScale(gray_img, 1.32, 5)

        predicted_emotion = ''
        for (x,y,w,h) in faces_detected:
            cv2.rectangle(test_img,(x,y),(x+w,y+h),(255,0,0),thickness=3)
            roi_gray=gray_img[y:y+w,x:x+h]#cropping region of interest i.e. face area from  image
            roi_gray=cv2.resize(roi_gray,(48,48))
            img_pixels = image.img_to_array(roi_gray)
            img_pixels = np.expand_dims(img_pixels, axis = 0)
            img_pixels /= 255 #normalizing

            predictions = model.predict(img_pixels)

            #find max indexed array
            max_index = np.argmax(predictions[0])

            emotions = ('angry', 'disgust', 'Anxiety', 'happy', 'Depressed', 'surprise', 'neutral')
            predicted_emotion = emotions[max_index]
            if predicted_emotion=='Anxiety':
                count_anx=count_anx+1
            elif predicted_emotion=='Depressed':
                count_desp=count_desp+1
            else:
                count_normal=count_normal+1
            # cv2.putText(test_img, predicted_emotion, (int(x), int(y)), cv2.FONT_HERSHEY_SIMPLEX, 1, (0,0,255), 2)

        resized_img = cv2.resize(test_img, (1000, 700))
        
        # cv2.imshow('Facial emotion analysis ',resized_img)
        # cv2.setWindowProperty("Facial emotion analysis ", cv2.WND_PROP_TOPMOST, 1)
        if count_anx>count_desp:
            if count_anx>count_desp:
                res='Anxious'
            else:
                res='Normal'
        else:
            if count_normal>count_desp:
                res='Normal'
            else:
                res='Depressed'
        _, buffer = cv2.imencode('.jpg', test_img)
        test_img = buffer.tobytes()
        
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + test_img + b'\r\n')

        if cv2.waitKey(10) == ord('q'):#wait until 'q' key is pressed
            print('here')
            data = {'emotion':res}
            return jsonify(data)


app = Flask(__name__, template_folder='templates')
Bootstrap(app)
socketio = SocketIO(app)
@app.route('/')
def index():
    return render_template("index.html")

@app.route('/home')
def inde():
    return render_template("index.html")

@app.route('/qstn')
def phq():
    return render_template("phq9.html",data="Anxiety and Depression Detection")

@app.route('/expression') 
def expression():
    p=exp()
    return Response(p, mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/face') 
def face():
    return render_template("face.html",data = "Anxiety and Depression Detection")

@app.route('/science')
def science():
    return render_template("science.html",data='science')

@app.route('/english')
def english():
    return render_template("english.html",data='science')

@app.route('/math')
def scimathence():
    return render_template("math.html",data='science')

@app.route('/chinese')
def chinese():
    return render_template("chinese.html",data='science')


@app.route('/courses')
def courses():
    return render_template("course.html",data='courses')

@app.route('/contact')
def contact():
    return render_template("contact.html",data='courses')

@app.route('/info')
def info():
    return render_template("info.html",data='courses')


@app.route('/stop_video', methods=['GET'])
def stop_video():
    global res  # Access the global emotion_result variable
    cap.release()
    cv2.destroyAllWindows()
    data = {'emotion': res}
    return jsonify(data)

import openai

openai.api_key = "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"

# Flask route for chatbot interaction
@app.route('/chat_science',methods=['GET'])
def chat_web1():
    return render_template('chat.html')

@app.route('/chat_chinese',methods=['GET'])
def chat_web2():
    return render_template('chat2.html')

@app.route('/chat_english',methods=['GET'])
def chat_web3():
    return render_template('chat3.html')

@app.route('/chat_math',methods=['GET'])
def chat_web4():
    return render_template('chat4.html')

@app.route('/teacher',methods=['GET'])
def teacher():
    return render_template('teacher.html')

@app.route('/teacherStudent',methods=['GET'])
def teacherStudent():
    return render_template('teacherStudent.html')

@app.route('/chat_stress',methods=['GET'])
def chat_web5():
    return render_template('chat5.html')

@app.route('/profile',methods=['GET'])
def profile():
    return render_template('Student.html')

messages = [{"role": "system", "content": "Science question expert"}]

@app.route('/chat_science', methods=['POST'])
def chat1():
    user_input = request.get_json().get('message')
    messages.append({"role": "user", "content": user_input})

    # Response
    response = openai.ChatCompletion.create(
        model = "gpt-4",
        messages = messages
    )
    # Reply
    reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": reply})
    return jsonify({"reply": reply})

messages = [{"role": "system", "content": "Chinese question expert"}]

@app.route('/chat_chinese', methods=['POST'])
def chat2():
    user_input = request.get_json().get('message')
    messages.append({"role": "user", "content": user_input})

    # Response
    response = openai.ChatCompletion.create(
        model = "gpt-4",
        messages = messages
    )
    # Reply
    reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": reply})
    return jsonify({"reply": reply})

messages = [{"role": "system", "content": "English question expert"}]

@app.route('/chat_english', methods=['POST'])
def chat3():
    user_input = request.get_json().get('message')
    messages.append({"role": "user", "content": user_input})

    # Response
    response = openai.ChatCompletion.create(
        model = "gpt-4",
        messages = messages
    )
    # Reply
    reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": reply})
    return jsonify({"reply": reply})

messages = [{"role": "system", "content": "Math question expert"}]

@app.route('/chat_math', methods=['POST'])
def chat4():
    user_input = request.get_json().get('message')
    messages.append({"role": "user", "content": user_input})

    # Response
    response = openai.ChatCompletion.create(
        model = "gpt-4",
        messages = messages
    )
    # Reply
    reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": reply})
    return jsonify({"reply": reply})

messages = [{"role": "system", "content": "Mental health stress support psycological support full on support"}]

@app.route('/chat_stress', methods=['POST'])
def chat5():
    user_input = request.get_json().get('message')
    messages.append({"role": "user", "content": user_input})

    # Response
    response = openai.ChatCompletion.create(
        model = "gpt-4",
        messages = messages
    )
    # Reply
    reply = response["choices"][0]["message"]["content"]
    messages.append({"role": "assistant", "content": reply})
    return jsonify({"reply": reply})


if __name__ == "__main__":
    socketio.run(app, debug=True)