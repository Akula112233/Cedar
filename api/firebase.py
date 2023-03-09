import json
import firebase_admin
from firebase_admin import credentials, auth, firestore
import requests
import datetime
from flask import Flask, request, Response

app = Flask(__name__)

cred = credentials.Certificate("cedar-b2b1f-0a801dae6d5f.json")
# cred = credentials.Certificate("cedar-b2b1f-firebase-adminsdk-3x51w-0a9678a7de.json")
firebase_admin.initialize_app(cred)
db = firestore.client()

@app.route('/write', methods=['POST'])
def writer_function():
    entry = request.get_json()
    userid = entry["uid"]
    # userid = "sFdFB7Xo71eHYOtAPGY3iPATWb92"

    entry["date"] = datetime.datetime.now()
    allemotions = entry["emotions"].keys()
    temparr = []
    for i in allemotions:
        temparr.append(entry["emotions"][i])
    entry["emotions"] = temparr
    x = 0
    for i in allemotions:
        entry["emotions"][x]["emotion"] = i
        x = x+1
    # print(entry)
    db.collection('entries').add(entry)
    return "Success!"

@app.route('/read', methods=['POST'])
def reader_function():
    entry = request.get_json()
    date = entry['date']
    month = int(date[0:2])
    day1 = int(date[3:5])
    day2 = day1+1
    year = int(date[6:])
    print(month)
    print(day1)
    print(day2)
    print(year)
    userid = entry["uid"]

    # userid = "sFdFB7Xo71eHYOtAPGY3iPATWb92"
    # docs = db.collection('persons').document('VNuSj9KrAZ7p4n56S4JY').get()
    # if docs.exists:
    #     print(docs.to_dict())
    #docs = db.collection('entries').where("uid", "==", userid).where("date", ">=", datetime.datetime(year, month, day1)).where("date", "<=", datetime.datetime(year, month, day2)).get()

    docs = db.collection('entries').where("uid", "==", userid).where("date", ">=", datetime.datetime(year, month, day1, 5)).where("date", "<=", datetime.datetime(year, month, day2, 5)).get()
    for doc in docs:
        print(doc.to_dict())
    if(len(docs) > 0):
        return docs[0].to_dict()
    else:
        return {}

def readertest():
    userid = "sFdFB7Xo71eHYOtAPGY3iPATWb92"
    docs = db.collection('entries').where("uid", "==", userid).where("date", ">=", datetime.datetime(2021, 5, 30)).where("date", "<=", datetime.datetime(2021, 5, 31)).get()
    for i in docs:
        print(i)


if __name__ == '__main__':
    # writer_function()
    # readertest()
    app.run()
