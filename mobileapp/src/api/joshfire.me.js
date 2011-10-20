Joshfire.define(['joshfire/utils/datasource', 'joshfire/vendor/underscore'], function(DataSource,_) {
  var datasource = new DataSource();
  var TRUE_APIROOT_JOSHME = 'http://joshfire.com:40008/data/';
  var APIROOT_JOSHME = '/proxy/';

  return {
    query: function(url, data, callback) {
      datasource.request({
        url: APIROOT_JOSHME,
        data: {'data': data, 'url': TRUE_APIROOT_JOSHME + url},
        type: 'POST',
        cache: 'no',
        jsonp: 'callback'
      },
      function (error, data) {
        if (error) {
          return callback(error, null);
        }
        var json = {};
        try {
          json = JSON.parse(data);
        } catch(e) {
          console.warn('invalid json', data);
        }
        return callback(null, json);
      });
    },

    getData: function(app, user_id, callback){
      this.query('get', {appId: app.id, userId: user_id}, callback);
    },

    setData: function(app, user_id, data, callback){
      this.query('set', {appId: app.id, userId: user_id, data: data}, function() {
        callback();
      });
    }
  };
});