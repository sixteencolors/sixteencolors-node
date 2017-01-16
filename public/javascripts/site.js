var app = new Vue({
  el: '#app',
  data: {
    message: 'Loading',
    packs: {
        get: function() {
            $.ajax('/data/site.json')
                .done(function(data) {
                    app.message ='Done';
                    app.packs.items = data;
                    
                })
                .fail(function() {
                    app.message = 'An error ocurred';
                })
        },
        items: {}
    },
    years : []
  },
  methods: {
      expandYear: function(event) {
          if ($(event.target).parents('ol').hasClass('packContents')) return true; // if clicking a child, don't close it

          var el;
          if (event.target.nodeName == "LI") {
              el = $(event.target);
          } else {
            el = $(event.target).parents('li');
          }
          el.toggleClass('expanded');
          $("ol.year > li:not([data-year='" + el.data('year') + "'])").removeClass('expanded');

          // close all packs just in case
          $("ol.packContents > li").removeClass('expanded');
          
      },
      expandPack: function(event) {
          var el = $(event.target).parent('li');
          el.toggleClass('expanded');
          $("ol.packContents > li:not([data-pack='" + el.data('pack') + "'])").removeClass('expanded');

          var yearEl = el.parents('ol.year > li');
          yearEl.addClass('expanded');          
          $("ol.year > li:not([data-year='" + yearEl.data('year') + "'])").removeClass('expanded');
      }
  }
});

app.packs.get();

$(document).ready(function(){
    // for right now this seems like a bit much
    // $.protip({
    //     defaults: {
    //         position: 'top',
    //         skin: 'square',
    //         size: 'tiny'
    //     }
    // });
});