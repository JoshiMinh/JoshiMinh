import cv2
import os
import numpy as np

# Initialize video capture and face cascade
cap = cv2.VideoCapture(0)
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

# Ensure FaceData folder exists
face_data_folder = 'FaceData'
os.makedirs(face_data_folder, exist_ok=True)

def load_existing_faces():
    return {f: cv2.imread(os.path.join(face_data_folder, f), cv2.IMREAD_GRAYSCALE) 
            for f in os.listdir(face_data_folder) if f.endswith('.jpg')}

existing_faces = load_existing_faces()

while cap.isOpened():
    ret, frame = cap.read()
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 5, minSize=(30, 30))
    
    for (x, y, w, h) in faces:
        face_img = gray[y:y+h, x:x+w]
        match_found = False
        
        # Compare detected face with saved faces
        for file_name, saved_face in existing_faces.items():
            res = cv2.matchTemplate(face_img, saved_face, cv2.TM_CCOEFF_NORMED)
            if np.max(res) > 0.8:  # Threshold for matching
                cv2.putText(frame, file_name[:-4], (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (255, 0, 0), 2)
                match_found = True
                break
        
        # If no match, save the new face
        if not match_found:
            new_face_name = f"face_{len(existing_faces)+1}.jpg"
            new_face_path = os.path.join(face_data_folder, new_face_name)
            cv2.imwrite(new_face_path, face_img)
            existing_faces[new_face_name] = face_img
            cv2.putText(frame, new_face_name[:-4], (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (0, 255, 0), 2)
        
        cv2.rectangle(frame, (x, y), (x+w, y+h), (255, 0, 0), 2)
    
    cv2.imshow('Facial Recognition', frame)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()