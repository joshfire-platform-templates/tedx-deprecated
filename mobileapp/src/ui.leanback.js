Joshfire.define(["joshfire/tree.ui","joshfire/class"],
  function(TreeUI,Class) {


  return Class(TreeUI,{
    
    setup:function(callback) {
    
      
      self.subscribe('afterInsert', function(ev, info) {

        self.activitymonitor = new ActivityMonitor(self, {
         'uiActive': ['/videolist', '/controls'],
         'delay': 5000
       });    

        self.ui.element('/videolist').subscribe('fresh', function() {
         self.activitymonitor.activate();
        });
      });
 
    
      callback();
    },
    
    buildTree:function() {
    
      return [{
       id: 'player',
       type: 'video.youtube',
       autoShow: true,
       options: {
         forceAspectRatio: false,
         //width:window.innerWidth,
         height: window.innerHeight
       }
      },
      {
       id: 'controls',
       type: 'mediacontrols',
       media: '/player',
      }];
      
    }
  });


});