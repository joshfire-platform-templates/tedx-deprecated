Joshfire.define(['joshfire/class', 'joshfire/tree.ui','joshfire/uielements/list', 'joshfire/uielements/panel', 'joshfire/uielements/panel.manager', 'joshfire/uielements/button', './api/ted','./api/joshfire.me', 'joshfire/vendor/underscore','templates_compiled/js/about'], function(Class, UITree, List, Panel, PanelManager, Button, TEDApi,JoshmeAPI,  _, TemplateAbout) {
  window._ = _;

  return Class(UITree, {     
    buildTree: function() {
      // UI specialization : the video list scrolls from top to bottom only on iOS
      var bVerticalList = (Joshfire.adapter === 'ios') ? true : false;

      var app = this.app;
      
      if (!TEDXID) {
        app.mainVideoListDataPath = "/talks/latest/";
      }

      // our UI definition
      var aUITree = [
        {
          id: 'toolbar',
          type: Panel,
          hideOnBlur: false,
          content: '<h1>myTED.tv</h1>',
          children: [
          {
            id: 'loginButton',
            type: Panel,
            autoShow:!TEDXID,
            content:'Wait...'
          }],
          onAfterInsert: function(ui) {
            //register onclick on login button
            //iPad browser blocks facebook popup when coming from ..subscribe('input') :-(
              
              //  app.fbLogin();
              // ... Forget that ...
              // Works fine in iOS Safari.. but not in a web app = launched from home screen
              // Let's try direct link
              //ui.htmlEl.onclick = function() {};
          }
        },
        {
          id: 'main',
          type: PanelManager,
          uiMaster: '/footer',
          children: [
          {
            id: 'home',
            type: Panel,
            onAfterShow: function(ui) {
              // propagate event to child list for scroller refresh
              app.ui.element('/main/home/videodetail').publish('afterShow');
              app.ui.element('/main/home/videolistpanel/videolist').publish('afterShow');
            },
            children:[
              {
                id: 'videolistpanel',
                type: Panel,
                onAfterShow: function(ui) {
                  // propagate event to child list for scroller refresh
                  app.ui.element('/main/home/videolistpanel/videolist').publish('afterShow');
                },
                children: [
                  {
                    id: 'videolisttitle',
                    type: Panel,
                    innerTemplate: '<p class="theme-title"><%= data.label ? data.label : "Latest videos"  %></p>'
                  },
                  {
                    id: 'videolist',
                    type: List,
                    loadingTemplate: '<div style="padding:40px;">Loading...</div>',
                    dataPath: app.mainVideoListDataPath,
                    incrementalRefresh: true,
                    lastItemInnerTemplate: "<button class='more'>Show more!</button>",
                    onLastItemSelect: function(me) {
                      $('#' + me.htmlId + '___lastItem button', $('#' + me.htmlId)).html("Loading...");
                      app.data.fetch(me.dataPath, {skip: me.data.length}, function(newData) {
                          if (!newData || newData.length == 0){
                            $('#' + me.htmlId + '___lastItem', $('#' + me.htmlId)).remove();
                          }
                      });
                    },
                    onState:function(ui,ev,data) {
                      
                      //When dataPath changes, select the first item.
                      if (data[0] == 'dataPath') {
                        if (BUILDNAME != 'iphone' && BUILDNAME != 'androidphone') {
                          var token = ui.subscribe("data",function() {
                            ui.unsubscribe(token);
                            ui.selectByIndex(0);
                          });
                        }

                        // No "show more" for TEDx
                        if (data[1].match(/^\/tedx/)) {
                          ui.options.lastItemInnerTemplate = false;
                        } else {
                          ui.options.lastItemInnerTemplate = "<button class='more'>Show more!</button>";
                        }

                        app.ui.element("/main/home/videolistpanel/videolisttitle").setDataPath(data[1].substring(0,data[1].length-1));
                      }
                    },
                    onSelect: function(ui, type, data) {
                      if (BUILDNAME == 'iphone' || BUILDNAME == 'androidphone') {
                          app.ui.element('/main/home/videodetail/videoshortdesc').hide();
                          app.ui.element('/main/home/videodetail').show();
                          app.ui.element('/main/home/videodetail/close').show();
                          app.ui.element('/main/home/videolistpanel').hide();
                         
                          //Wait for data to update. TODO remove the setTimeout with a more precise event.
                          setTimeout(function() {
                            app.ui.element('/main/home/videodetail/videoshortdesc').onState("fresh",true,function() {
                              app.ui.element('/main/home/videodetail/videoshortdesc').show();
                            });
                          },250);
                        
                      }
                    },
                    autoShow: true,
                    // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                    itemInnerTemplate: '<figure><img src="<%= item.image %>"/><figcaption><%= item.label %><br><span class="talker"><%= item.talker?"par "+item.talker.name:"" %></span></figcaption></figure>',
                    scroller: true,
                    scrollOptions: {
                      // do scroll in only one direction
                      vScroll: bVerticalList,
                      hScroll: !bVerticalList
                    },
                    scrollBarClass: 'scrollbar',
                    autoScroll: true
                  }
                ]
              },
              {
                id: 'videodetail',
                type: Panel,
                hideOnBlur: true,
                template: "<div id='myTED__detailswrapper'><div style='display:none;' class='josh-type-<%=type%> josh-id-<%=id%>' id='<%= htmlId %>' data-josh-ui-path='<%= path %>'><div id='video-logo-ted'></div><%= htmlOuter %></div></div>",
                uiDataMaster: '/main/home/videolistpanel/videolist',
                autoShow: (BUILDNAME != 'iphone' && BUILDNAME != 'androidphone'),
                forceDataPathRefresh: true,
                onAfterShow: function(ui) {
                  var selected = app.ui.element('/footer').htmlEl.querySelector('.selected');
                  if (selected) {
                    var currentPanel = selected.getAttribute('id').replace(/(.*)_/, '');
                    if (currentPanel == 'home' && (BUILDNAME != 'iphone' && BUILDNAME != 'androidphone')) {
                      app.ui.element('/main/home/videodetail/close').hide();
                    } else {
                      app.ui.element('/main/home/videodetail/close').show();
                    }
                  }
                },
                onData: function(ui) {
                  var player = app.ui.element('/main/home/videodetail/player');
                  var playerYT = app.ui.element('/main/home/videodetail/player.youtube');
                  
                  if (ui.data) {
                    if (ui.data.source=="youtube") {
                      playerYT.show();
                      player.hide();
                      player.stop();
                      app.ui.element('/main/home/videodetail/info/videoinfo').htmlEl.style.width="100%";
                      app.ui.element('/main/home/videodetail/info/talkerinfo').hide();
                      app.ui.element('/main/home/videodetail/like').hide();
                      
                      playerYT.playWithStaticUrl(ui.data);
                    } else {
                      var player = app.ui.element('/main/home/videodetail/player'),
                          play = function() {
                            player.playWithStaticUrl(ui.data.video['240']);
                            player.pause();
                          };
                          
                      player.show();
                      playerYT.hide();
                      playerYT.stop();
                      app.ui.element('/main/home/videodetail/info/videoinfo').htmlEl.style.width="50%";
                      app.ui.element('/main/home/videodetail/info/talkerinfo').show();
                      
                      if (!TEDXID) app.ui.element('/main/home/videodetail/like').show();
                      
                      if (ui.data.video) {
                        play();
                      } else {
                        TEDApi.getVideo(ui.data.key, function(error, vdata) {
                          ui.data.video = _.reduce(vdata, function(m, v) { m[v.format] = { url: v.url }; return m; }, {});
                          play();
                        });
                      }
                    }
                    
                    //like icon
                    if (app.userSession && app.userSession.mytv && app.userSession.mytv.favorites){
                       if (!app.data.get('/talks/favorites/')){
                         //Update my favs
                          app.data.set('/talks/favorites/', 
                          _.select(app.data.get('/talks/all/'), 
                             function (item){
                               return _.contains(app.userSession.mytv.favorites, item.id);
                             }
                           )
                          );
                        }
                      
                      if (_.include(app.userSession.mytv.favorites, ui.data.id)){
                         $('#'+app.ui.element('/main/home/videodetail/like').htmlId).addClass('liked');
                      }
                      else{
                        $('#'+app.ui.element('/main/home/videodetail/like').htmlId).removeClass('liked');
                      }
                    } else {
                      $('#'+app.ui.element('/main/home/videodetail/like').htmlId).removeClass('liked');
                    }
                  }

                  app.ui.element('/main/favorites/favlist').setDataPath('/talks/favorites');
                  
                },
                children:[
                  {
                    id: 'like',
                    type: Button,
                    autoShow:!TEDXID, //no favorites in TEDx mode
                    label: ''
                  },
                  {
                    id: 'close',
                    type: Button,
                    label: 'Retour',
                    autoShow: false,
                    onSelect: function(ui, type, data, token) {
                      app.ui.element('/main/home/videodetail/player').pause();
                      if (BUILDNAME == 'iphone' || BUILDNAME == 'androidphone') {
                        app.ui.element('/main/home/videodetail').hide();
                        app.ui.element('/main/home/videolistpanel').show();
                      }
                      var currentPanel = app.ui.element('/footer').getState('selection')[0];
                      app.ui.element('/main').switchTo(currentPanel);
                    }
                  },
                  {
                    id: 'player',
                    type: 'video.mediaelement',
                    autoShow: true,
                    controls: true,
                    noAutoPlay: false,
                    onAfterInsert: function(self) {
                      (function timer_daemon() {
                        setTimeout(function() {
                        var video = self.app.ui.element('/main/home/videodetail/player').htmlEl.querySelector('video');
                        if (self.app.userSession && video && !video.paused){
                           //Do your thing
                           var video_id=self.app.ui.element('/main/home/videodetail').dataPath.match(/[0-9]+$/)[0];
                            JoshmeAPI.setData(self.app,self.app.userSession.uid, {currentVideo:video_id, time:Math.floor(video.currentTime*100)/100}, function (err, retour){
                          });
                           
                           
                        }
                         timer_daemon();
                        } , 1000);
                      })();
                    }
                  },
                  {
                    id: 'player.youtube',
                    type: 'video.youtube',
                    autoShow: true,
                    controls: true,
                    noAutoPlay: false,
                    width:(BUILDNAME == 'ipad') ? 460 : false,
                    onAfterInsert:function(self){}
                  },
                  {
                    id: 'videoshortdesc',
                    type: Panel,
                    uiDataSync: '/main/home/videodetail',
                    innerTemplate:
                      '<h1><%= data.label %></h1>'+
                      '<%= data.talker ? "<h2>par "+data.talker.name+"</h2>" : "" %>'
                  },
                  {
                    id: 'info',
                    type: Panel,
                    uiDataSync:'/main/home/videodetail',
                    children: [
                      {
                        id: 'videoinfo',
                        type: Panel,
                        uiDataSync:'/main/home/videodetail',
                        innerTemplate:
                          '<h1 class="label"></h1>'+
                          '<p class="description"><%= data.summary %></p>'
                      },
                      {
                        id: 'talkerinfo',
                        type: Panel,
                        uiDataSync:'/main/home/videodetail',
                        innerTemplate:
                          '<h1 class="name"><%= data.talker ? data.talker.name : "" %></h1>'+
                          '<p class="description"><%= data.talker ? data.talker.shortsummary : "" %></p>'
                      }
                    ]
                  }
                ]//fin children videodetail
              }//fin video detail
            ]//fin children home
            },//fin home
            {
              id: 'themes',
              type: Panel,
              content: '',
              autoShow:false,
              onAfterShow: function(ui) {
                // propagate event to child list for scroller refresh
                app.ui.element('/main/themes/themeslist').publish('afterShow');
              },
              children: [{
                id: 'themeslist',
                type: List,
                dataPath: '/themes/',
                incrementalRefresh: true,
                autoShow: true,
                // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                itemInnerTemplate: '<figure data-id="<%= item.id %>"><img src="<%= item.image ? item.image : "http://placehold.it/208x142" %>"/><figcaption><%= item.label %></figcaption></figure>',
                scroller: true,
                scrollOptions: {
                  // do scroll in only one direction
                  vScroll: bVerticalList,
                  hScroll: !bVerticalList
                },
                scrollBarClass: 'scrollbar',
                autoScroll: true,
                onSelect: function(ui, evt, data) {
                  var videolist = app.ui.element('/main/home/videolistpanel/videolist');
                  videolist.setDataPath('/themes/' + data[0]);
                  
                  app.ui.element('/main').switchTo("home");
                  
                }
              }]
            },
            {
              id: 'tedx',
              type: Panel,
              content: '',
              autoShow:false,
              onAfterShow: function(ui) {
                // propagate event to child list for scroller refresh
                app.ui.element('/main/tedx/tedxlist').publish('afterShow');
              },
              children: [{
                id: 'tedxlist',
                type: List,
                dataPath: '/tedx/',
                incrementalRefresh: true,
                autoShow: true,
                // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                itemInnerTemplate: '<figure data-id="<%= item.id %>"><img src="<%= item.image ? item.image : "http://placehold.it/208x142" %>"/><figcaption><%= item.label %></figcaption></figure>',
                scroller: true,
                scrollOptions: {
                  // do scroll in only one direction
                  vScroll: bVerticalList,
                  hScroll: !bVerticalList
                },
                scrollBarClass: 'scrollbar',
                autoScroll: true,
                onSelect: function(ui, evt, data) {
                  var videolist = app.ui.element('/main/home/videolistpanel/videolist');
                  videolist.setDataPath('/tedx/' + data[0]);
                  
                  app.ui.element('/main').switchTo("home");
            
                }
              }]
            },
            
            {
              id: 'twitter',
              type: Panel,
              content: '',
              autoShow:false,
              onAfterShow: function(ui) {
                // propagate event to child list for scroller refresh
                app.ui.element('/main/tedx/tedxlist').publish('afterShow');
              },
              children: [{
                id: 'twitterlist',
                type: List,
                dataPath: false,
                incrementalRefresh: true,
                autoShow: true,
                // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                //itemInnerTemplate: '<figure data-id="<%= item.id %>"><img src="<%= item.image ? item.image : "http://placehold.it/208x142" %>"/><figcaption><%= item.label %></figcaption></figure>',
                scroller: true,
                scrollOptions: {
                  // do scroll in only one direction
                  vScroll: bVerticalList,
                  hScroll: !bVerticalList
                },
                scrollBarClass: 'scrollbar',
                autoScroll: true
              }]
            },
            
            {
              id: 'favorites',
              type: Panel,
              autoShow:false,
              onAfterShow: function(ui) {
                // propagate event to child list for scroller refresh
                app.ui.element('/main/favorites/favlist').publish('afterShow');
              },
              children: [
                {
                  id: 'mytitle',
                  type: Panel,
                  innerTemplate: '<div class="title-wrapper"><p class="theme-title">My favorites</p></div><div class="fav-not-connected"><h3>You should be connected !</a></h3></div><div class="fav-zero-favs"><h3>No favorites yet !</a></h3></div>'
                },
                {
                  id: 'favlist',
                  type: List,
                  autoShow: true,
                  loadingTemplate: '<div style="padding:40px;">...No favorites yet...</div>',
                  
                  // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                  itemInnerTemplate: '<figure><img src="<%= item.image %>"/><figcaption><%= item.label %><br><span class="talker"><%= item.talker?"par "+item.talker.name:"" %></span></figcaption></figure>',
                  scroller: true,
                  scrollOptions: {
                    // do scroll in only one direction
                    vScroll: bVerticalList,
                    hScroll: !bVerticalList
                  },
                  scrollBarClass: 'scrollbar',
                  autoScroll: true,
                  onSelect:function(ui,event, data){
                    var video_id = data[0][0],path='/talks/latest/';
                    //Change videolist dataPath
                     var videolist = app.ui.element('/main/home/videolistpanel/videolist');
                      videolist.setDataPath('/talks/favorites');

                    //Change video dataPath
                    var video = app.data.get(path+video_id);
                    if (!video){
                      path='/talks/all/';
                      video = app.data.get(path+video_id);
                    }
                    if (!video){
                      alert('An error occured - unable to play video '+video_id);
                      return false;
                    }

                    app.ui.element('/main/home/videodetail').setDataPath(path+video_id);
                    //Change main view
                    
                    app.ui.element('/main').switchTo("home");
                    
                  }
                }
              ],
              onAfterShow:function(ui){
                  app.ui.element('/main/home/videodetail/player').player.pause();
                  if (!app.getState('auth')) {
                    $('#'+ui.htmlId+' .fav-zero-favs').hide();
                    app.fbLogin();
                  } else {
                    $('#'+ui.htmlId+' .fav-not-connected').hide();
                    if (app.ui.element('/main/favorites/favlist').data && app.ui.element('/main/favorites/favlist').data .length>0){
                      $('#'+ui.htmlId+' .fav-zero-favs').hide();
                    }
                    //OK here come your videos
                   // app.ui.element('/main/favorites').htmlEl.innerHTML = '<h3>Favs to show</h3>'+JSON.stringify(app.userSession.mytv.favorites);
                  }
              }
            },
            {
              id:"about",
              type:Panel,
              content:TemplateAbout()
            }
          ]//fin children main
        },//main
        {
          id: 'footer',
          type: List,
          hideOnBlur: false,
          content: '',
          onSelect: function(ids) {
            
            if (ids[0]!="home" && app.mainVideoListDataPath) {
              app.ui.element('/main/home/videolistpanel/videolist').setDataPath(app.mainVideoListDataPath);
            }
            
            if (ids[0]!="home") {
              app.ui.element('/main/home/videodetail/player').pause();
            }
            
          },
          data: []
        }
      ];
      // UI specialization : the video control bar is useless on environments without a mouse
      //console.log(Joshfire.adapter);
      if (Joshfire.adapter === 'browser') {
        aUITree.push({
          id: 'controls',
          type: 'mediacontrols',
          media: '/player',
          hideDelay: 5000
        });
      }
      return aUITree;
    }
  });
});
