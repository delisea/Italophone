// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('signin', {
    url: '/signin',
    templateUrl: 'templates/signin.html',
    controller: 'signinCtrl'
  })

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // setup an abstract state for the tabs directive
    .state('edit', {
    url: '/edit',
    abstract: true,
    templateUrl: 'templates/edits.html'
  })






/**
*   Menu Édition
**/
  .state('edit.lesson', {
    url: '/lesson',
    views: {
      'edit-lesson': {
        templateUrl: 'templates/edition/edit-menu.html',
        controller: 'editMenuCtrl'
      }
    }
  })
  .state('edit.lessonmenu', {
    url: '/lesson/:lesson',
    views: {
      'edit-lesson': {
        templateUrl: 'templates/edition/edit-lesson.html',
        controller: 'editLessonCtrl'
      }
    }
  })
  .state('edit.shownotions', {
    url: '/lesson/:lesson/edit',
    views: {
      'edit-lesson': {
        templateUrl: 'templates/edition/edit-shownotions.html',
        controller: 'shownotionsCtrl'
      }
    }
  })
  .state('edit.showexp', {
    url: '/lesson/:lesson/edit/:id',
    views: {
      'edit-lesson': {
        templateUrl: 'templates/edition/edit-showexp.html',
        controller: 'shownotionCtrl'
      }
    }
  })




  // Each tab has its own nav history stack:

  .state('tab.dash', {
    url: '/dash',
    views: {
      'tab-dash': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('tab.report', {
      url: '/report',
      views: {
        'tab-report': {
          templateUrl: 'templates/tab-report.html',
          controller: 'ReportCtrl'
        }
      }
    })

  .state('tab.chats', {
      url: '/chats',
      views: {
        'tab-chats': {
          templateUrl: 'templates/tab-chats.html',
          controller: 'ChatsCtrl'
        }
      }
    })
    .state('tab.chat-detail', {
      url: '/chats/:chatId',
      views: {
        'tab-chats': {
          templateUrl: 'templates/chat-detail.html',
          controller: 'ChatDetailCtrl'
        }
      }
    })

  .state('tab.mytab', {
    url: '/mytab',
    views: {
      'tab-mytab': {
        templateUrl: 'templates/tab-mytab.html',
        controller: 'MytabCtrl'
      }
    }
  })

  .state('edit.editdata', {
    url: '/editdata',
    views: {
      'edit-editdata': {
        templateUrl: 'templates/edit-editdata.html',
        controller: 'EditCtrl'
      }
    }
  })

  .state('tab.selectform', {
    url: '/selectform',
    views: {
      'tab-selectform': {
        templateUrl: 'templates/tab-selectform.html',
        controller: 'SelectFormCtrl'
      }
    }
  })

  .state('tab.account', {
    url: '/account',
    views: {
      'tab-account': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/signin');

});
