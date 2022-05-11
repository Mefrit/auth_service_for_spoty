from flask import Flask, request, render_template, jsonify

app = Flask(__name__)
import requests

@app.route('/play')
def static_file():
    return render_template("play.html")

@app.route("/", methods=['GET', 'POST'])
def start():
    if(request.method == "POST"):
        print("\n\n PoST ---------------->>>>>>>>>>>>> ",request.args, request.args.get("code"), request.json)
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
        result["status"] = "ok"
        result["access_token"] = x.text
        return jsonify(result)

    return render_template("index.html")


if __name__ == "__main__":
    url = "https://api.jamendo.com/v3.0/oauth/grant";
    myobj = {
        'code':"2289d4e160ac8667a19b2c43c2e383ea737ead32",
        'grant_type':'authorization_code',
        'redirect_uri':'http://localhost:3000/',
        'client_secret':'188d6185dc588dc181d326af289fb4be',
        'client_id':'cf25482b'
    }
    x = requests.post(url, data = myobj)
    app.run(port=4567)
