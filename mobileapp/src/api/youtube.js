Joshfire.define(['joshfire/class', 'joshfire/utils/datasource'],function(Class,DataSource) {
  
  
  return Class({

      __constructor:function() {
          this.datasource = new DataSource();
      },

      request:function(url,callback) {
          return this.datasource.request({
              "url":"http://gdata.youtube.com/feeds/api/"+url,
              "dataType":"jsonp",
              "cache":true
          },function(err,data) {
              callback(err,data);
          });
      },
      
      formatVideos:function(videos) {
        //Map YouTube's data structure to a simplier JSON array
         for (var i = 0, l = videos.length; i < l; i++) {
           videos[i] = {
             'id': videos[i].id.$t.replace(/^.*\//, ''),
             'type': 'video',
             'source':'youtube',
             'summary': videos[i].content.$t,
             'label': videos[i].title.$t,
             'image': videos[i].media$group.media$thumbnail ? videos[i].media$group.media$thumbnail[0].url : '',
             'url': videos[i].link[0].href.replace('http://www.youtube.com/watch?v=', '').replace(/\&.*$/, '')
           };
         }
         
         return videos;
        
      },

      getPlaylistVideos:function(playlistId,callback) {
        var self = this;
        
        this.request("playlists/"+playlistId+"?alt=json-in-script&max-results=50",function(error,data) { //start-index
          if (error) return callback(error,data);
          
          callback(null, self.formatVideos(data.feed.entry));
        });
      },
       
       getUserVideos:function(userName,callback) {
         var self = this;
         
         this.request('/users/' + userName + '/uploads?alt=json-in-script&max-results=50',function(error,data) {
           if (error) return callback(error,data);

           callback(null, self.formatVideos(data.feed.entry));
         });

       } 

  
     });
     
});