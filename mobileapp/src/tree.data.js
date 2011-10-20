Joshfire.define(['joshfire/class', 'joshfire/tree.data', 'joshfire/vendor/underscore', './api/ted','./api/tedx','./api/youtube','./api/twitter','joshfire/utils/datasource'], function(Class, DataTree, _, TEDAPI,TEDxAPI, YoutubeAPI, TwitterAPI, DataSource) {

  var youtubeAPI = new YoutubeAPI();
  
  var twitterAPI = new TwitterAPI();
  
  var ds = new DataSource();
  
  return Class(DataTree, {
    buildTree: function() {
      var self = this;
      var app = this.app;
      var me = app.data;

      return [
      {
        
        id: 'ted',
        children:[{
          
          id: 'themes',
          children: function(query, callback) {
            TEDAPI.getThemes(query,function(err,themes) {
              if (err) return callback(err,themes);
              
              callback(null,_.map(themes,function(theme) {
                
                theme.children = function(q, cb) {
                  query['filter'] = {'theme': theme.id};
                  me.fetch('/ted/talks/all/', q, function(e, data) {
                    cb(e, data, {'cache': 3600});
                  });
                };
                
                return theme;
                
              }), {'cache': 3600*24});
              
            });
          }
          
        },{
          
          id: 'talks',
          children: [
            {
              'id': 'latest',
              'children': function(query, cb) {
                query['sort'] = {'date': -1};
                me.fetch('/ted/talks/all/', query, function(err,data) {
                  cb(err,data,{"cache":3600});
                });
              }
            },
            {
              id: 'favorites',
              label:'Favorites',
              children:function(query, cb){
                if(!app.userSession || !app.userSession.mytv || !app.userSession.mytv.favorites ||!app.data.get('/ted/talks/favorites/') ||!app.data.get('/ted/talks/favorites/').length){
                  return cb('No favorites yet', null);
                }
                cb(null, app.data.get('/ted/talks/favorites/'));
              }
            },
            {
              'id': 'all',
              'children': function(query, callback) {
                TEDAPI.getTalks(query,callback);
              }
            }
          ]
        }]
        
      },

      {
        id: 'twitter',
        children:function(query,callback) {
          twitterAPI.tweetsFromUser(app.tedxmeta.twitter,query,callback);
        }
      },
      
      {
        id: 'tedx',
        children:function(query,callback) {
          
          
          var gotList = function(err,data) {
            if (err) return callback(err,data);
            
            if (!data.length) return callback("no TEDx event");
            
            if (TEDXID) {
              app.setTEDxMode(data[0].meta);
            }
            
            callback(null,_.map(data,function(talk) {
              
              talk.children = function(q,cb) {
                youtubeAPI.getPlaylistVideos(talk.meta.youtube,function(err,videos) {
                  cb(err,_.sortBy(
                    _.map(videos,TEDxAPI.formatTalkDataFromYoutube),
                    function (t){ return t.weight||99}
                    )
                  );
                  
                });
              }
              return talk;
              
            }),{"cache":3600});
            
          };

          // Static TEDx list provided in config.js
          if (TEDXLIST) {
            gotList(null,TEDXLIST);
          } else {
            TEDxAPI.getTEDxList(TEDXID?{"filter":{"id":TEDXID}}:{},gotList);
          }

          
          
          
        }
      }
    ];
    
  }
}
  
  );
});
