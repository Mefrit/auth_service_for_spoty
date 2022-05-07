# from flask import Flask, request, render_template, jsonify
# app = Flask(__name__)
# @app.route("/", methods=['GET', 'POST'])
# def hello():
#     return render_template('index.html') #"Hello World!"
# if __name__ == "__main__":
#     app.run()


from flask import Flask, request, render_template, jsonify
# from public.server.main import Server
app = Flask(__name__)
import requests

@app.route('/play')
def static_file():
    print("P_LAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAYYYYYYYYYYYYYYYYYYYY -------->>>. ")
    return render_template("play.html")

@app.route("/", methods=['GET', 'POST'])
def start():
    if(request.method == "POST"):
        print("\n\n PoST ---------------->>>>>>>>>>>>> ",request.args, request.args.get("code"), request.json)
        # PATH2DB = "base.db"
        # conf = {}
        # main_server = Server(PATH2DB)
        # conf["module"] = request.args.get("module")
        # conf["action"] = request.args.get("action")
        # conf["data"] = request.json
        url = "https://api.jamendo.com/v3.0/oauth/grant";
        # url = "https://api.jamendo.com/v3.0/oauth/grant?client_id=cf25482b&code=d9582222ad5e8a87d2e83adabfeda461611082ea&client_secret=188d6185dc588dc181d326af289fb4be&grant_type=authorization_code&redirect_uri=http://localhost:3000/";
        # url = "https://api.jamendo.com/v3.0//playlists?client_id=59320324&format=jsonpretty&access_token=fde2fb4864bd9b690aaf13802574547f1c468a1d"
        print("\n\n ==>> s",request.json,  request.json["code"])

        myobj = {
            'code':  request.json["code"],
            'grant_type':'authorization_code',
            'redirect_uri':'http://localhost:4567/',
            'client_secret':'188d6185dc588dc181d326af289fb4be',
            'client_id':'cf25482b'
        }
        # url = 'https://api.jamendo.com/v3.0/oauth/authorize?client_id=cf25482b&redirect_uri=http://localhost:3000/&response_type=code'
        #    <a href={`https://api.jamendo.com/v3.0/oauth/authorize?client_id=${conf._client_id}&redirect_uri=http://localhost:3000/&response_type=code`}>Регистрация</a>
        # x = requests.get(url)
        x = requests.post(url, data = myobj)
        # url = 'https://api.jamendo.com/v3.0/oauth/authorize?client_id=cf25482b'
        # x = requests.get(url, data = myobj)
        print(x.text)
        result={}
        result["status"] = "ok"
        result["access_token"] = x.text
        # result = main_server.getAnswerFromComponent(conf)
        print("result",result)
        return jsonify(result)

    return render_template("index.html")


if __name__ == "__main__":
    # const conf = {
    #     // _client_id: "cf25482b",
    #     _client_id: "59320324",
    #     _api_key: "188d6185dc588dc181d326af289fb4be",
    #     _secret: "6b8f1bb64f106a4f520b3bf98717e06e",
    #     _api_base: "https://api.jamendo.com/v3.0/",
    #     _code: "4fc6741c3be9f6fb9c13c9be0e8c2f9889e98396"
    # }
    url = "https://api.jamendo.com/v3.0/oauth/grant";
    # url = "https://api.jamendo.com/v3.0/oauth/grant?client_id=cf25482b&code=d9582222ad5e8a87d2e83adabfeda461611082ea&client_secret=188d6185dc588dc181d326af289fb4be&grant_type=authorization_code&redirect_uri=http://localhost:3000/";
    # url = "https://api.jamendo.com/v3.0//playlists?client_id=59320324&format=jsonpretty&access_token=fde2fb4864bd9b690aaf13802574547f1c468a1d"
    print(url)
    myobj = {
        'code':"2289d4e160ac8667a19b2c43c2e383ea737ead32",
        'grant_type':'authorization_code',
        'redirect_uri':'http://localhost:3000/',
        'client_secret':'188d6185dc588dc181d326af289fb4be',
        'client_id':'cf25482b'
    }
    # url = 'https://api.jamendo.com/v3.0/oauth/authorize?client_id=cf25482b&redirect_uri=http://localhost:3000/&response_type=code'
    #    <a href={`https://api.jamendo.com/v3.0/oauth/authorize?client_id=${conf._client_id}&redirect_uri=http://localhost:3000/&response_type=code`}>Регистрация</a>
    # x = requests.get(url)
    x = requests.post(url, data = myobj)
    # url = 'https://api.jamendo.com/v3.0/oauth/authorize?client_id=cf25482b'
    # x = requests.get(url, data = myobj)
    print(x.text)
    app.run(port=4567)
