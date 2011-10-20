Joshfire.define(['joshfire/class', 'joshfire/utils/datasource'],function(Class,DataSource) {
  
  
  return Class({

      __constructor:function() {
          this.datasource = new DataSource();
      },

      request:function(url,callback) {
          return this.datasource.request({
              "url":url,
              "dataType":"jsonp",
              "cache":true
          },function(err,data) {
              callback(err,data);
          });
      },
      
      tweetsFromUser:function(user,query,callback) {
        
        this.request("http://twitter.com/status/user_timeline/"+user+".json?count="+query.limit+"&page="+(query.skip?parseInt(query.limit/query.skip)+1:1),callback);
        
        
        //this.request("http://search.twitter.com/search.json?q=from%3A"+username,callback);
        
      }
      
      
  });
     
});