
              {
                id: 'videodetail',
                type: Panel,
                hideOnBlur: true,
                template: "<div id='myTED__detailswrapper'><div style='display:none;' class='josh-type-<%=type%> josh-id-<%=id%>' id='<%= htmlId %>' data-josh-ui-path='<%= path %>'><%= htmlOuter %></div></div>",
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
                    label: 'Back',
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
                      '<%= data.talker ? "<h2>by "+data.talker.name+"</h2>" : "" %>'
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
                          '<h1 class="label">Summary</h1>'+
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