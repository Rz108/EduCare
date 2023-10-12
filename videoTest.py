import cv2
import os
import numpy as np 
from keras.models import model_from_json
from keras.preprocessing import image
from tensorflow.keras.utils import img_to_array
cap = cv2.VideoCapture(0)
def test():
    model = model_from_json(open("./face_models/fer.json", 'r').read())
    model.load_weights('fer.h5')
    face_haar = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')


    count_a = 0
    count_des = 0
    count_normal = 0

    while True:
        frame, image = cap.read()
        if not frame:
            continue
        g_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

        detected = face_haar.detectMultiScale(g_image, 1.32, 5)

        for (x,y,w,h) in detected:
            cv2.rectangle(image, (x,y), (x+w, y+h), (255,0,0), thickness=3)
            roi_gray = g_image[y:y+w:x+h]
            roi_gray = cv2.resize(roi_gray, (48,48))
            image_p = img_to_array(roi_gray)
            image_p = image_p / 255
            prediction = model.predict(image_p)
            max_index = np.argmax(prediction[0])


            emotions = ('angry', 'disgust', 'Anxiety', 'happy', 'Depressed', 'surprise', 'neutral')
            prediction_e = emotions[max_index]
            if prediction_e == 'Anxiety':
                count_a += 1
            elif prediction_e == 'Depressed':
                count_des += 1
            else:
                count_normal += 1
            cv2.putText(image, prediction_e, (int(x), int(y)), cv2.FONT_HERSHEY_COMPLEX_SMALL, 1 , (0,0,255),2)

        resized_img = cv2.resize(image, (1000, 700))

        cv2.imshow('Emotion Analysis', resized_img)
        cv2.setWindowProperty('Emotion Analysis', cv2.WND_PROP_TOPMOST,1)

        if cv2.waitKey(10) == ord('q'):
            if count_a > count_des:
                if count_a > count_des:
                    res='Anxious'
                elif count_des > count_a:
                    res = 'Depressed'
                else:
                    res='Normal'
            else:
                if count_normal > count_des:
                    res='Normal'
                elif count_normal > count_a:
                    res = 'Normal'
                else:
                    res='Depressed'
            return res




