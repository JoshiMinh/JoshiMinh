import cv2
import os
import numpy as np

# Constants
FACE_DATA_FOLDER = 'FaceData'
MATCH_THRESHOLD = 0.8
FONT = cv2.FONT_HERSHEY_SIMPLEX

# Ensure FaceData folder exists
os.makedirs(FACE_DATA_FOLDER, exist_ok=True)

def load_existing_faces(folder):
    """Load all grayscale face images from the folder."""
    return {
        f: cv2.imread(os.path.join(folder, f), cv2.IMREAD_GRAYSCALE)
        for f in os.listdir(folder) if f.endswith('.jpg')
    }

def save_new_face(face_img, existing_faces, folder):
    """Save a new face image and update the dictionary."""
    new_face_name = f"face_{len(existing_faces) + 1}.jpg"
    new_face_path = os.path.join(folder, new_face_name)
    cv2.imwrite(new_face_path, face_img)
    existing_faces[new_face_name] = face_img
    return new_face_name

def recognize_faces(frame, gray, faces, existing_faces):
    """Recognize or save faces and annotate the frame."""
    for (x, y, w, h) in faces:
        face_img = gray[y:y+h, x:x+w]
        match_found = False

        for file_name, saved_face in existing_faces.items():
            if saved_face is None or saved_face.shape != face_img.shape:
                continue
            res = cv2.matchTemplate(face_img, saved_face, cv2.TM_CCOEFF_NORMED)
            if np.max(res) > MATCH_THRESHOLD:
                label = file_name[:-4]
                color = (255, 0, 0)
                match_found = True
                break
        else:
            label = save_new_face(face_img, existing_faces, FACE_DATA_FOLDER)[:-4]
            color = (0, 255, 0)

        cv2.rectangle(frame, (x, y), (x+w, y+h), color, 2)
        cv2.putText(frame, label, (x, y-10), FONT, 0.9, color, 2)

def main():
    cap = cv2.VideoCapture(0)
    face_cascade = cv2.CascadeClassifier(
        cv2.data.haarcascades + 'haarcascade_frontalface_default.xml'
    )
    existing_faces = load_existing_faces(FACE_DATA_FOLDER)

    while cap.isOpened():
        ret, frame = cap.read()
        if not ret:
            break
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        faces = face_cascade.detectMultiScale(
            gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30)
        )

        recognize_faces(frame, gray, faces, existing_faces)

        cv2.imshow('Facial Recognition', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

if __name__ == "__main__":
    main()