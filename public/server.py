class Server :
    def __init__(self,url_auth):
        self.url_auth = url_auth
   
    def getAccessTokenByCode(code):
        return "acces_token"
    @staticmethod
    def getAction(self, module_name,data):
        conf = {}
        print( module_name,data)
        if module_name == "getAccessTokenByCode":
            return self.getAccessTokenByCode(123)
       

    def getAnswerFromComponent(self, conf):
    
        
        return self.getAction(conf["action"],conf["data"])