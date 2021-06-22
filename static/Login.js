function oauthPrompt(){
    console.log("request backend for auth url");
    window.api.loginApi.openLoginUrlOnBrowser();
    window.api.loginApi.getLoginUrl().then(
      (url) => {
        console.log("Url: ", url);
      }
    );
}

function storeAccessToken(){
  var accesstoken = document.getElementById("accesstokeninput").value;
      if (accesstoken) {
        console.log("access_token received ", accesstoken);
        window.api.loginApi.sendAccessToken(accesstoken);
        window.api.loginApi.getLoginStatus().then(
          (isLoggedIn) => {
            if(!isLoggedIn){
              document.getElementById("accesstokeninput").value="";
              alert("Authentication Failed");
            }
          }
        );
      }
    }