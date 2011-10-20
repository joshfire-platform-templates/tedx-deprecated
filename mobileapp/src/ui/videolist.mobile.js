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
                    autoShow: true,
                    // modify default content of the <li>. item correspond to the childrens of videos/ in the data tree
                    itemInnerTemplate: '<figure><img src="<%= item.image %>"/><figcaption><%= item.label %><br><span class="talker"><%= item.talker?"by "+item.talker.name:"" %></span></figcaption></figure>',
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