import cv2
from flask import Flask, jsonify
import threading
from flask_cors import CORS
import time
import tkinter as tk
import requests

sleep_counter = 0
threshold = 30
status = {"sleeping": False}
alert_triggered = False

app = Flask(__name__)
CORS(app)

@app.route('/status')
def get_status():
    return jsonify(status)

def detect_sleep():
    global sleep_counter, status, alert_triggered

    eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_eye.xml')

    while True:
        cap = cv2.VideoCapture(0)
        if not cap.isOpened():
            print("[ERROR] Camera not accessible. Retrying in 5 seconds...")
            cap.release()
            time.sleep(5)
            continue
        print("[INFO] Camera started successfully.")
        while True:
            ret, frame = cap.read()
            if not ret:
                print("[WARN] Camera frame not received. Retrying...")
                break  # Try to re-open the camera
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            eyes = eye_cascade.detectMultiScale(gray, 1.3, 5)
            if len(eyes) == 0:
                sleep_counter += 1
            else:
                sleep_counter = 0
            sleeping_now = sleep_counter > threshold
            if sleeping_now and not status["sleeping"]:
                print("[INFO] Sleep detected!")
                alert_triggered = True
            status["sleeping"] = sleeping_now
            time.sleep(0.1)
        cap.release()
        print("[WARN] Lost camera access. Attempting to reconnect...")
        time.sleep(2)

def start_flask_server():
    app.run(host="127.0.0.1", port=5001)

def start_gui():
    window = tk.Tk()
    window.title("Sleep Detection Status")
    window.geometry("300x150")

    status_label = tk.Label(window, text="Status: Unknown", font=("Arial", 18))
    status_label.pack(pady=20)

    def update_status():
        try:
            response = requests.get("http://127.0.0.1:5001/status")
            if response.status_code == 200:
                data = response.json()
                if data["sleeping"]:
                    status_label.config(text="Status: Sleeping 😴", fg="red")
                else:
                    status_label.config(text="Status: Awake 😀", fg="green")
        except Exception as e:
            print("[ERROR] Could not fetch status:", e)
            status_label.config(text="Status: Error", fg="gray")
        window.after(1000, update_status)  # Update every 1 second

    update_status()
    window.mainloop()

# Start Flask server in a separate thread
threading.Thread(target=start_flask_server, daemon=True).start()

# Start sleep detection in a separate thread
threading.Thread(target=detect_sleep, daemon=True).start()

# Start GUI in the main thread
start_gui()
