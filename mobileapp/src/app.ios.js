
Joshfire.define(['./app', 'joshfire/class', 'joshfire/vendor/underscore', './api/joshfire.me','./vendor/add2home'], function(App, Class, _, JoshmeAPI,addToHome) {
  return Class(App, {

    id: 'myTED',


    fullscreenCheck:function() {
      if (!addToHome.needed) return;
      
      Joshfire.onReady(function() {
        
        addToHome.ready();
        
        //TODO catch load / already loaded
        addToHome.loaded();
      });
    },
    
    setup: function(callback) {
      var self = this;
      
      self.fullscreenCheck();

      this.__super(function() {

        var likeButton = self.ui.element('/main/home/videodetail/like');
        
        likeButton.subscribe('input', function(ev, id) {

          $('#' + likeButton.htmlId).toggleClass('liked');

          if (!self.userSession){
            //Should be connected. Prompt ?
            return false;
          }

          var favorites = _.extend([], self.userSession.mytv.favorites),
              videoid = '' + self.ui.element('/main/home/videodetail').dataPath.match(/[0-9]+$/)[0];

          if (_.include(favorites, videoid)) {
            //unfavorite
            favorites = _.without(favorites, videoid);
          } else{
            //favorite
            favorites.push(videoid);
          }

          JoshmeAPI.setData(self, self.userSession.uid, {favorites: favorites}, function (err, retour) {
            self.userSession.mytv.favorites = favorites;

            //Update my favs
              self.data.update('/talks/favorites/', 
              _.select(self.data.get('/talks/all/'), 
                function (item){
                  return _.contains(self.userSession.mytv.favorites, item.id);
                }
              )
              );
            
          });
        });

        self.fbInit(callback);
      });
    },

    fbInit: function(callback) {
      var self = this;
      
      //No FB support yet in TEDx mode
      if (TEDXID) return callback();
      
      window.fbAsyncInit = function() {
        FB.init({appId: 214358631942957, status: true, cookie: true, xfbml: true});

        // TODO on iPad this is not fired sometimes.
        FB.getLoginStatus(function(response) {

          var loginButton = self.ui.element('/toolbar/loginButton').htmlEl;

          if (response.session) {
            // logged in and connected user, someone you know
            self.userSession = response.session;
            self.setState('auth', true);
            loginButton.innerHTML = 'Logout';
            loginButton.onclick = self.fbLogout;

            console.warn('self.userSession', self.userSession);

            /* Get myTV data */
            JoshmeAPI.getData(self, self.userSession.uid, function (err, data) {
              console.warn("getData(self …", err, data);
              if (!err && data) {
                self.userSession.mytv = data;
              } else {
                self.userSession.mytv = {'favorites': []};
              }
              
              
              //some more info
              FB.api('/me', function(me){
                self.userSession.name = me.name;
                self.data.get('/talks/favorites').label = me.name+"'s favorites";
              });
            });
          } else {
            // no user session available, someone you dont know
            self.setState('auth', false);
            loginButton.innerHTML = '<a href="http://www.facebook.com/dialog/oauth?client_id=214358631942957&redirect_uri=' + window.location + '&display=touch&scope=read_stream,publish_stream,offline_access">Login</a>';
          }
        });
      };

      var e = document.createElement('script');
      e.async = true;
      e.src = 'http://connect.facebook.net/en_US/all.js'; // + (Joshfire.debug?'//static.ak.fbcdn.net/connect/en_US/core.debug.js':'//connect.facebook.net/en_US/all.js');
      document.getElementById('fb-root').appendChild(e);

      callback();
    },

    fbLogin:function() {
      var self = this;
      
      if (!FB) return;
      FB.login(function(response) {
        if (response.session) {
          if (response.perms) {
            
            // user is logged in and granted some permissions.
            // perms is a comma separated list of granted permissions
            self.userSession = response.session;
            self.setState("auth",true);
          } else {
            // user is logged in, but did not grant any permissions
          }
        } else {
          // user is not logged in
        }
      }, {perms:'read_stream,publish_stream,offline_access'});
    },
    fbLogout: function() {
      FB.logout(function() {
        window.location = window.location;
      });
    }
  });
});
