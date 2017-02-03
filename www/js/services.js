angular.module('starter.services', [])

.factory('TWords', function() {

  var words = []/* = [{
    It: 'il filo',
    Fr: 'le fil',
    id: 0
  }, {
    It: "l'amo",
    Fr: "l'hameçon",
    id: 1
  }, {
    It: "l'Europa",
    Fr: "l'Europe",
    id: 2
  }]*/

  return {
    WRandom: function(){
      var max = 3;
      var min = 0;
      var wordId = Math.floor(Math.random() * (max - min)) + min;
      /*for (var i = 0; i < words.length; i++) {
        if (words[i].id === parseInt(wordId)) {
          return words[i];
        }
      }
      return null;*/
      return words[wordId];
      //Wget(WgetRandomInt(0,2));
    },
    WgetRandomInt: function(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    },
    LPush: function(lesson) {
      words = lesson;
    },
    WgetIt: function(wordIt) {
      for (var i = 0; i < words.length; i++) {
        if (words[i].id === wordIt) {
          return words[i];
        }
      }
      return null;
    },
    Weval: function(wordT, trads) {
      /*var strcmp = function(w1, w2) {
        if(w1.length != w2.length)
          return false;
        for (var j = 0; j <  w1.length; j++)
          if(w1.charAt(j) != w2.charAt(j))
            {console.log("f:"+w1.charAt(j)+"|"+w2.charAt(j));
          console.log("f:"+w1.charCodeAt(j)+"|"+w2.charCodeAt(j))
          console.log("f:"+j);return false;}    
        return true;
      }*/
      for (var i = 0; i < trads.length; i++) {
        if(wordT === trads[i])
          return true;
        /*if(strcmp(wordT, trads[i]))
          return true;*/
      }
      return false;
    }
  }
})

.factory('BDD', function($http) {

  return {
    GLessons: function() {/*
      $http.get("http://closed.power-heberg.com/ItaloPhone/test.php?query=5", {/* params: { "key1": "value1", "key2": "value2" } *//*})
      .success(function(data) {
          console.log("SUCCES"+data/*data.lessons[0].label*//*);
          return data;
      })
      .error(function(data, error) {
        console.log("ERROR: " + error);
      })*/
      return $http.get("http://closed.power-heberg.com/ItaloPhone/test.php", { params: { "key1": "value1", "key2": "value2" } });
    /*.success(function(data) {
        //alert("SUCCESS!");
        console.log(data.lessons[0]);
        return data.lessons;*/
        /*$cordovaFile.writeFile( 'file.txt', data, {'append':false} ).then( function(result) {
                alert("FSUCCESS!");
        }, function(err) {
          alert("FERROR!"+err);
        });
    })
    .error(function(data, error) {
      console.log("ERROR: " + error);
    })*/
    }
  }
})


.factory("$Phapi", function($http) {

    var link = 'http://closed.power-heberg.com/ItaloPhone/tp.php';
    //var link3 = 'http://localhost/mm/ItaloPhone/tp.php';
    var session = undefined;
    var app_version = "b1.0.1";

    return {

        query: function($params){
          if(session != undefined) {
            $params["session"] = session;
          }
          return $http.post(link, $params).then(function (res){
            if(res != undefined)
              return res;
            else {
              $state.go("signin");
              return undefined;
            }
          });
        },

        signin: function($login, $mdp) {
          var params = {query : 7, login: $login, password: $mdp};
          return $http.post(link, params).then(function (res){
            if(res.data.User.idU>0) {
              console.log(res.data.User.idU);
              console.log(res.data.User.session);
              session = res.data.User.session;
              return res.data.User.idU
            }
            return -1;
          });
        },

        ssignin: function($params) {
          return $http.post(link, $params).then(function (res){
            if(res.data != undefined && res.data.User != undefined && res.data.User.idU>0) {
              console.log(res.data.User.idU);
              console.log(res.data.User.session);
              session = res.data.User.session;
              if(res.data.User.version != app_version)
                window.alert("Nouvelle version: "+res.data.User.version+"\nActuelle: "+app_version);
              return res.data.User
            }
            else
              return undefined; // res.return
          });
          //  .catch(error => { console.log(error) });
        }

    };

    //return File;

})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
});
