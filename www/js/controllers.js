angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $Phapi) {
  $scope.mLesson = {val : {}};
  
  $scope.$on('$ionicView.enter', function(){
      $Phapi.query({query : 375}).then(function (res){
        $scope.mLesson.val = res.data;
      });
  });
})
.controller('EditCtrl', function($scope, $Phapi) {
  $scope.Lessons = [];
  $scope.Words = [];
  $scope.StateMachine = {val: 0};
  $scope.StateMachineAddSens = {val: 0};
  $scope.StateMachineEditLess = {val: -1};
  $scope.lessonNew = {val: ""};
  $scope.wordLessonChoosen={val: ""};
  $scope.wordLanguage={val: "Fr"};
  $scope.expressionNew={val: ""};
  $scope.lessonEdit={val: ""};

  $scope.isState = function($state) {
      var s = $scope.StateMachine.val;
      if($state != 0)
        for(; $state%10==0; $state=($state-($state%10))/10)
          s=(s-(s%10))/10;
      return s==$state;
  }

  $scope.refreshLesson = function($id) {
      $Phapi.query({query : 5}).then(function (res){
        $scope.Lessons = res.data.lessons;
        var i = 0;
        $scope.Lessons.forEach(function(entry) {
            entry.id = i;
            i++;
        });
      })
  }
  $scope.refreshWord = function() {

    $Phapi.query({query : 303, lesson: $scope.wordLessonChoosen.val}).then(function (res){

        var find = function($id, $table) {
          var i = 0;
          for(i = $table.length-1; i>=0; i--) {
            if($table[i].id == $id)
              return i;
          };
          return -1;
        }/*
        mettre en place le edit
        mettre des icones pour manipuler les mots*/

        $scope.Words = [];
        var pos;
        var maxid = 0;
        for(i = res.data.words.length-1; i>=0; i--) {
          pos = find(res.data.words[i].idE, $scope.Words);
          if(pos==-1) {
            $scope.Words.push({id: res.data.words[i].idE, syn: [{label: res.data.words[i].label, idSY: Number(res.data.words[i].idSY), lg: res.data.words[i].language}]});
            if(res.data.words[i].language == "Fr") {
              $scope.Words[$scope.Words.length-1].SYFr = Number(res.data.words[i].idSY);
              $scope.Words[$scope.Words.length-1].SYIt = 0;
            }
            else {
              $scope.Words[$scope.Words.length-1].SYFr = 0;
              $scope.Words[$scope.Words.length-1].SYIt = Number(res.data.words[i].idSY);
            }
          }
          else {
            $scope.Words[pos].syn.push({label: res.data.words[i].label, idSY: Number(res.data.words[i].idSY), lg: res.data.words[i].language});
            if(res.data.words[i].language == "Fr")
              $scope.Words[pos].SYFr = (Number(res.data.words[i].idSY)>$scope.Words[pos].SYFr)?Number(res.data.words[i].idSY):$scope.Words[pos].SYFr;
            if(res.data.words[i].language == "It")
              $scope.Words[pos].SYIt = (Number(res.data.words[i].idSY)>$scope.Words[pos].SYIt)?Number(res.data.words[i].idSY):$scope.Words[pos].SYIt;
          }
          if(maxid<res.data.words[i].idE) maxid = res.data.words[i].idE;
        };
      })
  }
  $scope.lessonEdit = function($id, $newlabel) {
      $Phapi.query({query : 102, label: $scope.Lessons[$id].label, newlabel: $newlabel}).then(function (res){
        if(res.data.return == 1)
          $scope.refreshLesson();
      });
      $scope.StateMachine.val = 1110;
  };
  $scope.lessonDelete = function($id) {
      $Phapi.query({query : 202, label: $scope.Lessons[$id].label}).then(function (res){
        if(res.data.return == 1)
          $scope.refreshLesson();
      });
  };
  $scope.lessonAdd = function() {
      $scope.StateMachine.val = 1120;
  };
  $scope.lessonPush = function() {
      $scope.StateMachine.val = 1110;
      if($scope.lessonNew.val != "")
      $Phapi.query({query : 2, label: $scope.lessonNew.val}).then(function (res){
        if(res.data.return == 1)
          $scope.refreshLesson();
      });
  };
  $scope.expressionEdit = function($word, $syno, $nlg, $newlabel) {
      if($newlabel == "") $newlabel = $syno.label;
      var nidSY = ($nlg == $syno.lg)?$syno.idSY:Number(($nlg == "Fr")?$word.SYFr:$word.SYIt)+1;
      $http.post(link, {query : 103, idE : Number($word.id), idSY : $syno.idSY, language: $syno.lg, nidSY : nidSY, nlanguage : $nlg, newlabel: $newlabel}).then(function (res){
        if(res.data.return == 1)
          $scope.refreshWord();
      });
      $scope.StateMachine.val = 2211;
  };
  $scope.expressionDelete = function($id, $lg, $idsy) {
      $Phapi.query({query : 203, idE: $id, language: $lg, idSY: $idsy}).then(function (res){
        if(res.data.return == 1)
          $scope.refreshWord();
      });
  };
  $scope.expressionAdd = function($ide) {
      $scope.StateMachineAddSens.val = $ide;
  };
  $scope.expressionPush = function($n, $w) {
    if($n) {
      if($scope.expressionNew.val != "")
      $Phapi.query({query : 403, lesson: $scope.wordLessonChoosen.val, label: $scope.expressionNew.val, language: $scope.wordLanguage.val, idSY: 1}).then(function (res){
        if(res.data.return == 1)
          $scope.refreshWord();
        else
          console.log("Create return "+res.data.return);
      });
      $scope.StateMachineAddSens.val = 0;
    }
    else {
      $scope.StateMachineAddSens.val = 0;
      //console.log($scope.words[$scope.StateMachineAddSens.val].id);
      console.log($w);
      if($scope.expressionNew.val != "")
      $Phapi.query({query : 3, lesson: $scope.wordLessonChoosen.val, label: $scope.expressionNew.val, idE: $w.id, language: $scope.wordLanguage.val, idSY: ($scope.wordLanguage.val == "It")?$w.SYIt+1:$w.SYFr+1}).then(function (res){
        if(res.data.return == 1)
          $scope.refreshWord();
        else
          console.log("Create return "+res.data.return);
      });
    }
  };
  $scope.wordChoseLesson = function($id) {
    $scope.wordLessonChoosen.val=$scope.Lessons[$id].label;
    $scope.refreshWord();
    $scope.StateMachine.val = 2210;
  };


  $scope.lessonChange = function($id) {
      console.log('testToggle changed to ' + $id);
      $scope.wordEditShow.val=false;
      $scope.wordEditShow.val=false;
  };
})



.controller('signinCtrl', function($scope, $state, $Phapi) {
  $scope.i_login = {val: ""};
  $scope.i_password = {val: ""};
  $scope.connect = function() {
    //var link = 'http://closed.power-heberg.com/ItaloPhone/tp.php';
    //var link3 = 'http://localhost/mm/ItaloPhone/tp.php';
    $Phapi.ssignin({query : 7, login: $scope.i_login.val, password: $scope.i_password.val}).then(function (User) {
      console.log(User);
      if(User != undefined) {
        window.localStorage.setItem("idU", User.idU);
        window.localStorage.setItem("login", $scope.i_login.val);
        window.localStorage.setItem("password", $scope.i_password.val);
        $state.go("tab.dash");
      }
      else console.log("connection failed");
    //$http.post(link, {query : 7, login: $scope.i_login.val, password: $scope.i_password.val}).then(function (res){
      //console.debug(res.data.User);
      //console.log($scope.i_login.val);
      //console.debug(res.data);
//console.debug(res.data.User.idU);
      /*console.log(res.data.User);
      if(res.data.User.idU>0)
      {
        console.log(res.data.User.idU);
        console.log(res.data.User.session);
        window.localStorage.setItem("idU", res.data.User.idU);
        window.localStorage.setItem("login", $scope.i_login.val);
        window.localStorage.setItem("password", $scope.i_password.val);
        window.localStorage.setItem("session", res.data.User.session);
        $state.go("tab.dash");
      }*/
    })
  };
  

  $scope.subnonyme = function() {
    $Phapi.ssignin({query : 701}).then(function (User){
      if(User != undefined)
      {
        console.log(User.idU);
        window.localStorage.setItem("idU", User.idU);
        window.localStorage.setItem("login", User.login);
        window.localStorage.setItem("password", User.password);
        $state.go("tab.dash");
      }
    });
  };


  $scope.sub = function() {
    $Phapi.ssignin({query : 801, login : $scope.i_login.val, password : $scope.i_password.val}).then(function (User){
      if(User != undefined)
      {
        console.log(User.idU);
        window.localStorage.setItem("idU", User.idU);
        window.localStorage.setItem("login", $scope.i_login.val);
        window.localStorage.setItem("password", $scope.i_password.val);
        $state.go("tab.dash");
      }
    });
  };


  if(window.localStorage.getItem("login") !== undefined)
  if(window.localStorage.getItem("password") !== undefined)
  {
    $scope.i_login.val = window.localStorage.getItem("login");
    $scope.i_password.val = window.localStorage.getItem("password");
    $scope.connect();
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

/*.controller('ResultsCtrl', function($scope, $state, $stateParams) {
    $scope.results = $stateParams.result;
})*/

.controller('MytabCtrl', function($scope, $state, $ionicGesture, $Phapi, $ionicModal, TWords) {
  $scope.Wtest = [];
  $scope.WQuizz = [];
  var WTPush = function(wordA, wordB, note, lvl, idE, idSY, mcnt)
  {
    $scope.Wtest.push({
      wa: {Fr: wordA.Fr, It: wordA.It},
      wb: wordB,
      nt: note,
      lvl: lvl,
      idE: idE,
      idSY: idSY,
      mcnt: mcnt
    });
  }
// pense à verrouiller le valider tant que pas pret
  $scope.wordP = {It: "Wait Please", Fr: {}, lvl: 0};//TWords.Wrandom();
  $scope.wordR = {val: ""};

  var lesson = "";



$scope.dready = false;
function onDeviceReady() { $scope.dready = true; console.log("device is ready"); }
document.addEventListener("deviceready", onDeviceReady, false);
$scope.tilt = function() { if($scope.dready) navigator.vibrate(100); }
  /*if(ionic.Platform.isAndroid()){
      lesson = "/android_asset/www/";
  }*/
  //$http.get(lesson+'lesson/lesson1.json').success(function(response){ /*$scope.wordR.val = response.words;*/ TWords.LPush(response.words); $scope.wordP=TWords.WRandom(); });
  

  //lesson1.json
/*$http.get("http://closed.power-heberg.com/ItaloPhone/test.php?query=6", { params: { "key1": "value1", "key2": "value2" } })
    .success(function(data) {*/
        //alert("SUCCESS!");
        //$scope.wordR.val = data;
        //console.log(data);
        /*$cordovaFile.writeFile( 'file.txt', data, {'append':false} ).then( function(result) {
                alert("FSUCCESS!");
        }, function(err) {
          alert("FERROR!"+err);
        });*//*
    })
    .error(function(data, error) {
      console.log("ERROR: " + error);
    })*/




console.log(window.localStorage.getItem("lessonSelected"));
$scope.submit = function(){
        $Phapi.query({query : 8, 'idU' : window.localStorage.getItem("idU"), lessons : JSON.parse(window.localStorage.getItem("lessonSelected"))}).then(function (res){
            $scope.WQuizz = res.data.Quizz;
            $scope.wordP.It=$scope.WQuizz[0].label;
            $scope.wordP.Fr=$scope.WQuizz[0].trads;
            $scope.wordP.lvl=$scope.WQuizz[0].level;
            $scope.wordR.val="";
            //console.log(res.data.Quizz[0].trads);
        });
    };
  

$scope.$on('$ionicView.enter', function(){
	 if(window.localStorage.getItem("lessonSelected") == undefined || window.localStorage.getItem("lessonSelected").length == "[]")
		$state.go("tab.selectform");
	 else
	    $scope.fstart();
  })

  $scope.fstart = function() {
    $scope.wordP = {It: "Wait Please", Fr: {}, lvl: 0};
    $scope.wordR = {val: ""};
    $scope.Wtest = [];
    $scope.WQuizz = [];
    $scope.submit();

    /*document.getElementById("keyboard").addEventListener("mouseup", function($e){
      console.log("up"+$e.target.nodeName);
    });

    document.getElementById("keyboard").addEventListener("mousedown", function($e){
      if($e.target.nodeName == "TD") {
        console.log("down"+$e.target.textContent);
        document.getElementById("Atooltip").style.left = $e.target.offsetLeft+'px';
      }
    });*/
  }

  /*$scope.onon = function($e){
    if($e.target.nodeName == "TD") {
      console.log("down"+$e.target.textContent);
      document.getElementById("Atooltip").style.left = $e.target.offsetLeft+'px';
    }
  }*/
  /*$scope.count = {val : 42};
  $ionicGesture.on("dragstart", function (event) {
      $scope.count.val = $scope.count.val+1;
    }, document.getElementById("keyboard"));*/
//var lastMove = null;
var pointerCoord = function(event) {
  // This method can get coordinates for both a mouse click
  // or a touch depending on the given event
  var c = { x:0, y:0 };
  if(event) {
    var touches = event.touches && event.touches.length ? event.touches : [event];
    var e = (event.changedTouches && event.changedTouches[0]) || touches[0];
    if(e) {
      c.x = e.clientX || e.pageX || 0;
      c.y = e.clientY || e.pageY || 0;
      //console.log(c.x + " " + c.y);
      return c;
    }
  }
  return undefined;
}

$scope.$on('$ionicView.loaded', function(event) {
  //mParent = getParent();
  console.log(document.getElementById("keyboard"));
  document.getElementById("keyboard").addEventListener('touchstart', function(e){
    e.preventDefault();$scope.onon(e);//console.log("tsat");
  });

  console.log(document.getElementById("keyboard"));
  document.getElementById("keyboard").addEventListener('touchend', function(e){
    /*e.preventDefault();*/$scope.outout(e);//console.log("tend");
  });
  document.getElementById("keyboard").addEventListener('touchcancel', function(e){
    /*e.preventDefault();*/$scope.outout(e);//console.log("tend");
  });

  /*console.log(document.getElementById("keyboard"));
  document.getElementById("keyboard").addEventListener('touchmove', function(e){
    lastMove = e;
    pointerCoord(e);
  });*/
});

/*$scope.lastEventCalled = 'Try to Drag the content up, down, left or rigth';
  var element = angular.element(document.querySelector('#eventPlaceholder'));
  var events = [{
    event: 'dragup',
    text: 'You dragged me UP!'
  },{
    event: 'dragdown',
    text: 'You dragged me Down!'
  },{
    event: 'dragleft',
    text: 'You dragged me Left!'
  },{
    event: 'dragright',
    text: 'You dragged me Right!'
  },{
    event: 'dragstart',
    text: 'start!'
  },{
    event: 'dragend',
    text: 'end!'
  }];
  
  angular.forEach(events, function(obj){
    $ionicGesture.on(obj.event, function (event) {
      $scope.$apply(function () {
        $scope.lastEventCalled = obj.text;
      });
    }, element);
  });*/



  $scope.Acurr = "";
  $scope.onon = function($e){
    if($e.target.nodeName != "TD" || $e.target.textContent == "")
      return;
    $scope.Acurr = $e.target.textContent;
    if($e.target.nodeName == "TD" && ("aceinouy").indexOf($e.target.textContent) >= 0) {
      //console.log("down"+$e.target.textContent);
      $scope.Acurr = $e.target.textContent;
      //document.getElementById("Atooltip").style.left = $e.target.offsetLeft+'px';
      document.getElementById("Adefault").style.display = "none";
      document.getElementById("A"+$e.target.textContent).style.display = "table-row";
      //$e.target.offsetLeft+'px'
    }
  }// nbspace
  $scope.outout = function($e){
    /*for(var propName in $e) {
    console.log(propName);
  }*/
    var c = pointerCoord($e);
    Tout = document.elementFromPoint(c.x, c.y);
    //console.log(c.x + " " + c.y);
    //Tout = document.elementFromPoint(lastMove.targetTouches[0].pageX, $e.targetTouches[0].pageY);
    //console.log($e.targetTouches[0].pageX + $e.targetTouches[0].pageY);
    //console.log(Tout.nodeName + Tout.textContent.charAt(0));
    if(Tout.nodeName != "TD" || Tout.textContent == "")
      return;
    //console.log(Tout.nodeName + Tout.textContent.charAt(0));
    if(("azertyuiopqsdfghjklmwxcvbn\u00A0;' ").indexOf(Tout.textContent.charAt(0)) == -1 || Tout.textContent == $scope.Acurr) {
      //console.log("up"+Tout.textContent.charAt(0)+"f");
      $scope.wordR.val = $scope.wordR.val + Tout.textContent.charAt(0);
      $scope.$digest();
      $scope.tilt();
    }

    if(("aceinouy").indexOf($scope.Acurr) >= 0) {
      //console.log("up"+Tout.textContent/*$e.gesture.center.pageX+"\n"+JSON.stringify($e.gesture)*/);
      document.getElementById("Adefault").style.display = "table-row";
      document.getElementById("A"+$scope.Acurr).style.display = "none";
    }
    $scope.Acurr = "";
  }

  // define create account view
  $ionicModal.fromTemplateUrl('templates/tab-results.html', {
     scope: $scope,
     animation: 'slide-in-up',
     controller: 'ResultsCtrl'
  }).then(function(modal) {
      $scope.loginModal = modal;
  });


  $scope.Weval = function() {
    WTPush($scope.wordP, $scope.wordR.val, TWords.Weval($scope.wordR.val, $scope.wordP.Fr), $scope.wordP.lvl, $scope.WQuizz[$scope.Wtest.length].idE, $scope.WQuizz[$scope.Wtest.length].idSY, $scope.WQuizz[$scope.Wtest.length].mcnt);
    if($scope.Wtest.length < 5) {
      $scope.wordP.It=$scope.WQuizz[$scope.Wtest.length].label;//TWords.WRandom();
      $scope.wordP.Fr=$scope.WQuizz[$scope.Wtest.length].trads;
      $scope.wordP.lvl=$scope.WQuizz[$scope.Wtest.length].level;
      $scope.wordR.val="";
    }
    else {

        var data = [];
        $scope.Wtest.forEach(function(res) {
          data.push({'idU' : window.localStorage.getItem("idU"), 'idE' : res.idE, 'idSY' : res.idSY, 'language' : "It", 'level' : parseFloat(res.lvl)*0.9+((res.nt)?0:1)/*((res.nt)?Math.max(Number(res.lvl)-10, 1):Math.min(Number(res.lvl)*2+5,100))*/, 'cnt' : (Number(res.mcnt) + 1)});
          //console.log(res.nt);
          //console.log(res.wa.Fr);
          //console.log(res.wa.It);
          //console.log(res.wb);
        });
        $Phapi.query({query : 4, rows : data}).then(function (res){
            console.log(res.data.return);
        });
        var i;
        var note = 0;
        for(i=0; $scope.Wtest[i]; i++)
          if($scope.Wtest[i].nt)
            note++;
        $scope.note = note; 
        $scope.SURnote = i; 
        $scope.loginModal.show();
    }
    //$state.go('tabs.search-results', {result: data});
  };
})











.controller('SelectFormCtrl', function($scope, BDD, $Phapi) {
  $scope.Lessons = [];
  /*$scope.$on('$ionicView.enter', function(){
    console.log("enter");.leave
  })*/
         //var link = 'http://closed.power-heberg.com/ItaloPhone/tp.php';
        //var link3 = 'http://localhost/mm/ItaloPhone/tp.php';
 
    $Phapi.query({query : 5}).then(function (res){
      $scope.Lessons = res.data.lessons;
        var i = 0;
        $scope.Lessons.forEach(function(entry) {
            entry.id = i;
            i++;
        });
        (JSON.parse(window.localStorage.getItem("lessonSelected")) || []).forEach(function(entry) {
            var j;
            for(j = 0; $scope.Lessons[j] && $scope.Lessons[j].label != entry; j++);
              if($scope.Lessons[j])
                $scope.Lessons[j].value = true;
        });
    })
  //$scope.Lessons.val = BDD.GLessons($http);
  /*BDD.GLessons().success(function(response) {
                // transforms the http response into an array of likes
                console.log(response);
                $scope.Lessons = response.lessons;
            });*/
  //$http.get("http://closed.power-heberg.com/ItaloPhone/test.php", { params: { "key1": "value1", "key2": "value2" } })
    /*.success(function(data) {
        //alert("SUCCESS!");
        console.log(data);
        /*$cordovaFile.writeFile( 'file.txt', data, {'append':false} ).then( function(result) {
                alert("FSUCCESS!");
        }, function(err) {
          alert("FERROR!"+err);
        });*//*
    })
    .error(function(data, error) {
      console.log("ERROR: " + error);
    })*/

  //[{id: 1, label: "label1"}, {id: 2, label: "label2"}];
  $scope.lessonChange = function($id) {
      /*if ($scope.value == false) {
          $scope.value = true;
      } else
          $scope.value = false;*/
      console.log('testToggle ' + $id + ' changed to ' + $scope.Lessons[$id].value);
      var s = "";
      var b = false; var t = [];
      $scope.Lessons.forEach(function(entry) {
        if(entry.value)
          t.push(entry.label);
          /*if(b)
            s = s + ", \"" + entry.label + "\"";
          else {
            b = true;
            s = s + "\"" + entry.label + "\"";
          }*/
      });
      window.localStorage.setItem("lessonSelected", JSON.stringify(t));
      //console.log('testToggle changed to ' + $scope.label2);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('ReportCtrl', function($scope, $Phapi) {
  $scope.msg = {val: ""};
  $scope.report_bug = function() {
    $Phapi.query({query : 99, report : $scope.msg.val}).then(function() {
      $scope.msg.val = "";
    });
  }
})

.controller('AccountCtrl', function($scope, $state, $ionicModal) {
  $scope.disconnect = function() {
    window.localStorage.removeItem("login");
    window.localStorage.removeItem("password");
    $state.go("signin");
    ///*loginModal.show()*/
  }
  $scope.settings = {
    enableFriends: true
  };
  // define create account view
  $ionicModal.fromTemplateUrl('templates/login.html', {
     scope: $scope,
     animation: 'slide-in-up'
  }).then(function(modal) {
      $scope.loginModal = modal;
  });
})

































.controller('editMenuCtrl', function($scope, $state, $Phapi) {
  $scope.Lessons = [];

  $scope.$on('$ionicView.enter', function(){
      $Phapi.query({query : 5}).then(function (res){
      $scope.Lessons = res.data.lessons;
    });
  });
})
.controller('editLessonCtrl', function($scope, $state, $stateParams) {
  $scope.lesson = {val : ""};

  $scope.$on('$ionicView.enter', function(){
      $scope.lesson.val = $stateParams.lesson;
      console.log($stateParams);
  });
})
.controller('shownotionsCtrl', function($scope, $state, $stateParams, $Phapi) {
  $scope.lesson = {val : ""};
  $scope.notions = {val : []};

  $scope.$on('$ionicView.enter', function(){
      $scope.lesson.val = $stateParams.lesson;

      $Phapi.query({query : 303, lesson : $scope.lesson.val}).then(function (res){
      $scope.Lessons = res.data.lessons;


      var find = function($id, $table) {
        var i = 0;
        for(i = $table.length-1; i>=0; i--) {
          if($table[i].id == $id)
            return i;
        };
        return -1;
      }

      $scope.notions.val = [];
      var pos;
      for(i = res.data.words.length-1; i>=0; i--) {
        pos = find(res.data.words[i].idE, $scope.notions.val);
        if(pos==-1) {
          $scope.notions.val.push({
            id: res.data.words[i].idE,
            fr: (res.data.words[i].language == "Fr")?
              [{
                label: res.data.words[i].label,
                idSY: Number(res.data.words[i].idSY)
              }] : [],
            it: (res.data.words[i].language != "Fr")?
              [{
                label: res.data.words[i].label,
                idSY: Number(res.data.words[i].idSY)
              }] : []
            });
        }
        else {
          if(res.data.words[i].language == "Fr")
            $scope.notions.val[pos].fr.push({
              label: res.data.words[i].label,
              idSY: Number(res.data.words[i].idSY)
            });
          else
            $scope.notions.val[pos].it.push({
              label: res.data.words[i].label,
              idSY: Number(res.data.words[i].idSY)
            });
        }
      };
      for(i = $scope.notions.val.length-1; i>=0; i--) {
        if($scope.notions.val[i].fr.length > 1) {
          $scope.notions.val[i].label = $scope.notions.val[i].fr[0].label;
          for(j = $scope.notions.val[i].fr.length-1; j>0; j--) {
            $scope.notions.val[i].label = $scope.notions.val[i].label + ", " + $scope.notions.val[i].fr[j].label;
          }
        }
        else
          $scope.notions.val[i].label = $scope.notions.val[i].fr[0].label;


        if($scope.notions.val[i].it.length > 1) {
          $scope.notions.val[i].label = $scope.notions.val[i].label + " | " + $scope.notions.val[i].it[0].label;
          for(j = $scope.notions.val[i].it.length-1; j>0; j--) {
            $scope.notions.val[i].label = $scope.notions.val[i].label + ", " + $scope.notions.val[i].it[j].label;
          }
        }
        else
          $scope.notions.val[i].label = $scope.notions.val[i].label + " | " + $scope.notions.val[i].it[0].label;
      };
    });
  });
})
.controller('shownotionCtrl', function($scope, $state, $stateParams, $Phapi) {
  $scope.lesson = {val : ""};
  $scope.id = {val : 0};
  $scope.notion = {val : []};
  $scope.Nstate = {val : 0};
  $scope.wordLanguage = {val :"Fr"};
  $scope.text = {val : ""};

  $scope.$on('$ionicView.enter', function(){
      $scope.lesson.val = $stateParams.lesson;
      $scope.id.val = $stateParams.id;
      
      if($scope.id.val != -1)
        $Phapi.query({query : 503, lesson : $scope.lesson.val, idE : $scope.id.val}).then(function (res){
          $scope.notion.val = res.data.notion;
        });
      else
        $Phapi.query({query : 376}).then(function (res){
          $scope.id.val = res.data.idE;
          $stateParams.id = res.data.idE;
        });
  });

  $scope.expressionAdd = function(txt, lg) {
    var msy = 0;
    for(i = $scope.notion.val.length-1; i>=0; i--)
      if($scope.notion.val[i].language == lg && Number($scope.notion.val[i].idSY) > msy)
        msy = Number($scope.notion.val[i].idSY);

    $Phapi.query({query : 3, lesson : $scope.lesson.val, idE : $scope.id.val, label : txt, language : lg, idSY : msy+1}).then(function (res){
      console.log(res.data.return);
      if(res.data.return == 1)
        $state.go($state.current, $stateParams, {reload: true, inherit: false});
      else
        window.alert("L'ajout à échoué.");
      $scope.Nstate.val = 0;
      $scope.text.val = "";
    });
  };

  $scope.setState = function(idsy, lg) {
    return Number(idsy)*2+((lg=="Fr")?1:0);
  };

  $scope.editword = function(idsy, lg, lg2, lbl) {
    $scope.Nstate = 0;
    if($scope.text.val != "" || lg != lg2) {
      if($scope.text.val == "")
        $scope.text.val = lbl;
      $Phapi.query({query : 103/*, lesson: $scope.lesson.val*/, newlabel: $scope.text.val, idE: $scope.id.val, language: lg, nlanguage: lg2, idSY: idsy, nidSY: idsy}).then(function (res){
        if(res.data.return == 1)
          $state.go($state.current, $stateParams, {reload: true, inherit: false});
        else
          window.alert("L'édition à échoué.");
      });
    }
  };

  $scope.deleteword = function(idsy, lg) {
    $scope.Nstate = 0;
    $Phapi.query({query : 203/*, lesson: $scope.lesson.val*/, idE: $scope.id.val, language: lg, idSY: idsy}).then(function (res){
      if(res.data.return == 1)
        $state.go($state.current, $stateParams, {reload: true, inherit: false});
      else
        window.alert("L'édition à échoué.");
    });
  };
});
