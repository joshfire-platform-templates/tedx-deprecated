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
        },
      
//list onSelect

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
                        