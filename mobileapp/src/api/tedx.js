Joshfire.define(['joshfire/utils/datasource','joshfire/vendor/underscore'], function(DataSource,_) {
  
  var datasource = new DataSource();
  
  return {

    getTEDxList: function(query, callback) {
      
      var tedxid=false;
      if (query.filter && query.filter.id) {
        tedxid=query.filter.id;
      }
      
      datasource.request({
        
        // Email sylvain _at_ joshfire.com to get an invite on this spreadsheet to add your TEDx events.
        "url":"https://spreadsheets.google.com/feeds/list/0ArnpnObxnz4RdHJhSVlURUlFdk9pc09jOHkxLWRHa1E/od6/public/values?hl=fr&alt=json-in-script",
        "dataType":"jsonp",
        "cache":3600
      },function(err,data) {
        if (err) return callback(err);
      
        //TODO manage query.limit & query.skip

        var matches = [];
        _.each(data.feed.entry,function(tedx,i) {
          
          if (tedx.gsx$tedxname.$t==tedxid || !tedxid) {
            
            // Show TEDx locations when in global mode
            if (!tedxid) {
              var eventlabel = tedx.gsx$formattedname.$t+" "+tedx.gsx$eventname.$t;
            } else {
              var eventlabel = tedx.gsx$eventname.$t;
            }
            
            var playlistId = tedx.gsx$youtubeplaylist.$t;
            
            var wasAnUrl = playlistId.match(/list\=PL([0-9A-Z]+)/);
            if (wasAnUrl) {
              playlistId = wasAnUrl[1];
            }
            var wasAnUrl = playlistId.match(/view_play_list\?p\=([0-9A-Z]+)/);
            if (wasAnUrl) {
              playlistId = wasAnUrl[1];
            }
            
            matches.push({
              "id":i,
              "image":tedx.gsx$eventimage.$t,
              "label":eventlabel,
              "meta":{
                "title":tedx.gsx$formattedname.$t,
                "website":tedx.gsx$website.$t,
                "twitter":tedx.gsx$twitteraccount.$t,
                "youtube":playlistId
              }
            });
          }
        });
        
        callback(null,matches);
      
        
      });
      
    },
    
    // Beautify the labels from YouTube
    formatTalkDataFromYoutube:function(talk) {
    
      var label = talk.label;
    
      //strip "TEDx XYZ 20xx"
      label = label.replace(/tedx( )?([a-z0-9]+)( 20[0-9]{2})?/ig,"");
    
      //strip dates
      label = label.replace(/[0-9]{2,4}\/[0-9]{2}\/[0-9]{2,4}/g,"");
    
      //Trim
      label = label.replace(/^[ \-\:]+/,"");
      label = label.replace(/[ \-\:]+$/,"");
    
      //Try to extract talker name, before the first " - "
      if (label.indexOf(" - ")>0) {
        talk.talker = {name:label.substring(0,label.indexOf(" - "))};
        label = label.substring(label.indexOf(" - ")+3);
      }
    
      //Trim again
      label = label.replace(/^[ \-\:]+/,"");
      label = label.replace(/[ \-\:]+$/,"");
    
    
      talk.label = label;


      /* Dirty fixes for apple commercial */
      //Fix Vinvin
      talk.summary = talk.summary.replace(/Vinvin \(alias Cyrille Delasteyrie\)/, 'Cyrille de Lasteyrie, alias Vinvin, ');
      
      //Fix order by
      var weights = {
          'Vinvin':1,
          'Jean-Louis Servan-Schreiber':2,
          'Bruno Giussani':3,
          'Etienne Klein':4,
          'Etienne Parizot':5,
          'Djazia Satour':6
        };
        talk.weight = weights[talk.talker ? talk.talker.name : talk.label]
      return talk;
    
    
    }
  };
});
