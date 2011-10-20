Joshfire.define(['joshfire/utils/datasource','joshfire/vendor/underscore'], function(DataSource,_) {
  var datasource = new DataSource(),
  
  // This API is also open source on github : http://github.com/joshfire/ted-api
  // It is only temporary since TED is supposed to release an API mid-2011.
  APIROOT_TED = 'http://ted-api.appspot.com/rest/v1/json/';

  var urlserialize = function(obj) {
    var str = [];
    for (var p in obj) {
      str.push(p + '=' + encodeURIComponent(obj[p]));
    }
    return str.join('&');
  };

  var API = {
    query: function(url,callback) {
      datasource.request({
        url: APIROOT_TED+url, 
        dataType: 'jsonp',
        cache: 'no',
        jsonp: 'callback'
      },
      function (error, json) {
        if (error) {
          return callback(error, null);
        }
        return callback(null, json);
      });
    },

    completeTalks: function(talks, callback) {

      API.query('Talker?page_size=200&fin_key=' + encodeURIComponent(_.pluck(talks, 'talker').join(',')), function(error, json) {
        if (error) return callback(error);
        if (json.list.Talker && !_.isArray(json.list.Talker))
          json.list.Talker = [json.list.Talker];
        _.each(talks,function(talk) {
          _.each(json.list.Talker, function(talker) {
            if (talk.talker == talker.key) {
              talk.talker = talker;
            }
          });
        });
        callback(null,talks);
      });
    },
    
    
    getTalks:function(query,callback) {
      
      var qs = {
        'page_size': query.limit,
        'offset': query.skip
      };

      if (query.filter) {
        if (query.filter.theme) {
          //First fetch TalkTheme ids, then ask for these ids.
          API.query('TalkTheme?' + urlserialize(qs) + '&feq_theme=' + encodeURIComponent(query.filter.theme), function(error, json) {
            if (error) return callback(error);
            delete query.filter.theme;

            query.filter.id = (json.list.TalkTheme ? (_.isArray(json.list.TalkTheme) ? _.pluck(json.list.TalkTheme, 'talk') : json.list.TalkTheme.talk) : null);
            API.getTalks(query, callback);
          });
          return;
        }

        if (query.filter.id) {
          if (_.isArray(query.filter.id)) {
            qs['fin_key'] = query.filter.id.join(',');
          } else {
            qs['feq_key'] = query.filter.id;
          }
        }
      }

      if (query.sort && query.sort.date) {
        //TODO are talks always released in order?
        qs['ordering'] = (query.sort.date == -1 ? '-' : '') + 'tedid';
      }

      //Send the query
      API.query('Talk?' + urlserialize(qs), function(error, json) {
        if (error) return callback(error);
        API.completeTalks(_.isArray(json.list.Talk) ? json.list.Talk : [json.list.Talk], function(error2, talks) {
          //console.warn('got talks', talks);
          if (error2) return callback(error);
          //Format talks for the tree
          callback(null, _.map(talks, function(item) {
            return {
              id: item.tedid,
              label: ((item.name.indexOf(': ') == -1) ? item.name : item.name.substring(item.name.indexOf(': ') + 2)),
              summary: item.shortsummary,
              image: item.image,
              talker: item.talker,
              key: item.key,
              duration: item.duration_postad
            };
          }));
        });
      });
      
    },
    
    getThemes:function(query,callback) {
      
      API.query('Theme?page_size=' + query.limit + '&offset=' + query.skip, function(error, json) {
        if (error) return callback(error);
        childCallback(null, _.map(json.list.Theme, function(theme) {

          return {
            'id': theme.key,
            'label': theme.name,
            'image': theme.image,
            
          };
        }), {'cache': 3600*24});
      });
      
    },

    getVideo: function(talk, callback){
      API.query('Video?feq_talk=' + talk, function(error, json) {
        if (error) return callback(error);
        callback(null, json.list.Video);
      });
    }
  };
  
  return API;
});
