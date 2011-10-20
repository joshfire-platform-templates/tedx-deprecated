
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
                  itemInnerTemplate: '<figure><img src="<%= item.image %>"/><figcaption><%= item.label %><br><span class="talker"><%= item.talker?"by "+item.talker.name:"" %></span></figcaption></figure>',
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
            