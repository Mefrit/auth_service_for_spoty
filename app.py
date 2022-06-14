from flask import Flask, request, render_template, jsonify
import requests
app = Flask(__name__)


@app.route('/play')
def play():
    return render_template("play.html")

@app.route('/search')
def search():
    return render_template("search.html")
@app.route("/setTrackToLover", methods=['GET', 'POST'])
def setTrackToLover():
    if(request.method == "POST"):
        url = "https://api.jamendo.com/v3.0/setuser/favorite/?client_id=cf25482b&track_id={track_id}&format=jsonpretty&access_token={access_token}"
        conf2 = {
            'client_id':'cf25482b',
            'track_id': request.json["trackId"],
            'format': 'jsonpretty',
            'access_token': request.json["accessToken"]
        }
        headers = {'content-type': 'application/json', 'Accept-Charset': 'UTF-8'}
        requests.post(url.format(track_id=request.json["trackId"],access_token=request.json["accessToken"]), data=conf2, headers=headers)
        result={}
        result["result"] = True
        return jsonify(result)

@app.route("/", methods=['GET', 'POST'])
def start():
    if(request.method == "POST"):
        url = "https://api.jamendo.com/v3.0/oauth/grant"
        conf = {
            'code':  request.json["code"],
            'grant_type':'authorization_code',
            'redirect_uri':'http://localhost:4567/',
            'client_secret':'188d6185dc588dc181d326af289fb4be',
            'client_id':'cf25482b'
        }
        x = requests.post(url, data = conf)
        result={}
        result["result"] = True
        result["accessToken"] = x.text

        return jsonify(result)

    return render_template("index.html")


if __name__ == "__main__":
    app.run(port=4567)
