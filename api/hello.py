import requests
import json
from flask import Flask, request, Response

app = Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def runner_function():
    baseText = request.data
    toneAnalysis = call_tone_analyzer(baseText)
    combinedSentences = sentence_combiner(toneAnalysis)
    topicAnalysis = topic_analysis(combinedSentences)
    return json.dumps(topicAnalysis)


def call_tone_analyzer(baseText):
    baseText = str(baseText)
    print("base text is of type: " + str(type(baseText)))
    headers = {
        'Content-Type': 'application/json',
    }
    params = (
        ('version', '2017-09-21'),
    )
    data = {"text": baseText}
    response = requests.post('https://api.us-south.tone-analyzer.watson.cloud.ibm.com/instances/93270fda-dd2a-4e0f-8bff-eda70cf06ca0/v3/tone', headers=headers, params=params, json=data, auth=('apikey', 'DBfc2gfNcSQ77nGIuZhwKIxkHTgh8T0MzDMo1iX7aGXt'))
    print(response)
    return response.json()


def sentence_combiner(toneAnalysis):
    mydict = {}
    count = []
    for i in toneAnalysis["sentences_tone"]:
        for j in i["tones"]:
            key = j["tone_name"]
            if (key in mydict.keys()):
                mydict.update({key: {"sentence": mydict[key]["sentence"] + " " + i["text"],
                                     "confidence": mydict[key]["confidence"] + j["score"]}})
                count[list(mydict.keys()).index(key)] += 1
            else:
                mydict.update({key: {"sentence": i["text"], "confidence": j["score"]}})
                count.append(1)
    index = 0;
    keys = list(mydict.keys())
    for i in keys:
        mydict[i]["confidence"] /= count[index]
        index += 1
    return mydict
    '''
    return {
            "Confident": {
                    "sentence": "Please consider this - you have to clear out the main bedroom to use that bathroom.",
                    "confidence": 0.7893,
            },
            "Analytical": {
                "sentence": "Please consider this - you have to clear out the main bedroom to use that bathroom. Stairs - lots of them - some had slightly bending wood which caused a minor injury.",
                "confidence": 0.6758,
            },
            "Sadness": {
                "sentence": "Signs all over the apartment - there are signs everywhere - some helpful - some telling you rules.",
                "confidence": 0.8765,
            },
            "Tentative": {
                "sentence": "Signs all over the apartment - there are signs everywhere - some helpful - some telling you rules. Perhaps some people like this but It negatively affected our enjoyment of the accommodation. Stairs - lots of them - some had slightly bending wood which caused a minor injury.",
                "confidence": 0.5683,
            }
    }
    '''


def topic_analysis(combinedSentences):
    allEmotionsSentences = combinedSentences.keys()
    allEmotionsTopics = combinedSentences.copy()
    for i in allEmotionsSentences:
        topics = single_sentence_analysis_api(combinedSentences[i]["sentence"])
        allEmotionsTopics[i]["topics"] = topics
    return allEmotionsTopics


def get_access_token():
    urlAuth = "https://api.symbl.ai/oauth2/token:generate"

    appId = "4e745949614163637a556c4967486552344436684e33466d6b744d38314a3077"  # App Id found in your platform
    appSecret = "47455a6e737778767343547657714b545f6b626d4758576f566151446d7166305836466b54436f574b49395f556f357a73665756374b4d4b4547447a67445374"  # App Id found in your platform

    payload = {
        "type": "application",
        "appId": appId,
        "appSecret": appSecret
    }
    headers = {
        'Content-Type': 'application/json'
    }

    authresponse = requests.request("POST", urlAuth, headers=headers, data=json.dumps(payload))
    # set your access token here. See https://docs.symbl.ai/docs/developer-tools/authentication
    return authresponse.json()["accessToken"]


def get_conversation_id(sentence, access_token):
    url = "https://api.symbl.ai/v1/process/text"

    payload = {
        "detectPhrases": True,
        # <Optional,boolean| It shows Actionable Phrases in each sentence of conversation. These sentences can be found using the Conversation's Messages API. Default value is false.>

        "messages": [
            {
                "payload": {
                    "content": str(sentence),
                    "contentType": "text/plain"
                },
            }
        ]
    }

    headers = {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
    }

    responses = {
        400: 'Bad Request! Please refer docs for correct input fields.',
        401: 'Unauthorized. Please generate a new access token.',
        404: 'The conversation and/or it\'s metadata you asked could not be found, please check the input provided',
        429: 'Maximum number of concurrent jobs reached. Please wait for some requests to complete.',
        500: 'Something went wrong! Please contact support@symbl.ai'
    }

    response = requests.request("POST", url, headers=headers, data=json.dumps(payload))

    if response.status_code == 201:
        # Successful API execution
        print("conversationId => " + response.json()['conversationId'])  # ID to be used with Conversation API.
        print("jobId => " + response.json()['jobId'])  # ID to be used with Job API.
    elif response.status_code in responses.keys():
        print(responses[response.status_code])  # Expected error occurred
    else:
        print("Unexpected error occurred. Please contact support@symbl.ai" + ", Debug Message => " + str(response.text))
    return response.json()["conversationId"]


def single_sentence_analysis_api(sentence):
    access_token = get_access_token()
    convoId = get_conversation_id(sentence, access_token)
    print(convoId)

    baseUrl = f"https://api.symbl.ai/v1/conversations/{convoId}/topics"
    print(baseUrl)
    conversationId = convoId  # Generated using Submit text end point

    # set your access token here. See https://docs.symbl.ai/docs/developer-tools/authentication
    access_token = access_token

    headers = {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
    }

    params = {
        'sentiment': True,  # <Optional, boolean| Give you sentiment analysis on each topic in conversation.>
        'parentRefs': True,  # <Optional, boolean| Gives you topic hierarchy.>
    }

    responses = {
        401: 'Unauthorized. Please generate a new access token.',
        404: 'The conversation and/or it\'s metadata you asked could not be found, please check the input provided',
        500: 'Something went wrong! Please contact support@symbl.ai'
    }

    response = requests.request("GET", baseUrl, headers=headers, params=json.dumps(params))

    if response.status_code == 200:
        # Successful API execution
        print("topics => " + str(response.json()['topics']))  # topics object containing topics id, text, type, score, messageIds, sentiment object, parentRefs
    elif response.status_code in responses.keys():
        print(responses[response.status_code])  # Expected error occurred
    else:
        print("Unexpected error occurred. Please contact support@symbl.ai" + ", Debug Message => " + str(response.text))
    topicsList = []
    for i in response.json()['topics']:
        topicsList.append(i["text"])
    return topicsList


if __name__ == '__main__':
    app.debug = True
    app.run()
