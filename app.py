from flask import Flask, request, render_template, jsonify

app = Flask(__name__)
import requests

@app.route('/play')
def play():
    return render_template("play.html")

@app.route('/search')
def search():
    return render_template("search.html")

@app.route("/", methods=['GET', 'POST'])
def start():
    if(request.method == "POST"):
      
        url = "https://api.jamendo.com/v3.0/oauth/grant";
        myobj = {
            'code':  request.json["code"],
            'grant_type':'authorization_code',
            'redirect_uri':'http://localhost:4567/',
            'client_secret':'188d6185dc588dc181d326af289fb4be',
            'client_id':'cf25482b'
        }
        x = requests.post(url, data = myobj)
        result={}
        result["result"] = True
        result["accessToken"] = x.text
        return jsonify(result)

    return render_template("index.html")


if __name__ == "__main__":
    app.run(port=4567)
