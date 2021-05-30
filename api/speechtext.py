import requests
import json
import time

def runner_function(request):
    # Set CORS headers for the preflight request
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type
        # header and caches preflight response for an 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    # Set CORS headers for the main request
    headers = {
        'Content-Type':'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
    }
    access_token = get_access_token()
    link = request.get_json()["link"]
    print(link)
    result = get_text(link, access_token)

    # END CORS
    return ({"result": result}, 200, headers)


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

def get_conversation_id (link, access_token):
    url = "https://api.symbl.ai/v1/process/audio/url"

    payload = {
            'url': link
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

def get_text(link, access_token):
    convoId = get_conversation_id(link, access_token)
    time.sleep(10)
    url = "https://api.symbl.ai/v1/conversations/" + convoId + "/messages"

    headers = {
        'Authorization': 'Bearer ' + access_token,
        'Content-Type': 'application/json'
    }

    params = {
        'verbose': True,  # <Optional, boolean| Gives you word level timestamps of each sentence.>
        'sentiment': True  # <Optional, boolean| Give you sentiment analysis on each message.>
    }

    responses = {
        401: 'Unauthorized. Please generate a new access token.',
        404: 'The conversation and/or it\'s metadata you asked could not be found, please check the input provided',
        500: 'Something went wrong! Please contact support@symbl.ai'
    }

    response = requests.request("GET", url, headers=headers)

    if response.status_code == 200:
        # Successful API execution
        print("messages => " + str(response.json()[
                                       'messages']))  # messages is a list of id, text, from, startTime, endTime, conversationId, words, phrases, sentiment
    elif response.status_code in responses.keys():
        print(responses[response.status_code])  # Expected error occurred
    else:
        print("Unexpected error occurred. Please contact support@symbl.ai" + ", Debug Message => " + str(response.text))

    result = ""
    for i in response.json()["messages"]:
        result += i["text"] + " "
    return result