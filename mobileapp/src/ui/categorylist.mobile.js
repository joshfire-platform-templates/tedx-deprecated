//todo make function that also returns for /tedx/

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
            