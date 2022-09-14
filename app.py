from io import BytesIO
from keras.models import model_from_json
from PIL import Image
import numpy as np
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
# from fastapi.responses import ORJSONResponse
import tensorflow as tf

app = FastAPI(docs_url='/')

origins = [
    "http://localhost:3000",
    "localhost:3000"
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)


class_names=['daisy', 'dandelion', 'roses', 'sunflowers', 'tulips']

# @app.get("/predict",response_class=ORJSONResponse)
# async def get_image():
#     return ORJSONResponse

json_file = open('./model/flower_model.json', 'r')
loaded_model_json = json_file.read()
json_file.close()
model = model_from_json(loaded_model_json)

model.load_weights("./model/flower_model.h5")

@app.post('/prediction/')
async def get_flower_class(file: bytes = File(...)):
    image1=Image.open(BytesIO(file))
    image=image1.resize((180,180))
    image=image.convert('RGB')
    image_array = np.array(image)
    image_array= np.expand_dims(image_array, axis=0)
    predictions=model.predict(image_array)
    score = tf.nn.softmax(predictions[0])
    return {"class": class_names[np.argmax(score)], "confidence": f"{round(100 * np.max(score))}%"}