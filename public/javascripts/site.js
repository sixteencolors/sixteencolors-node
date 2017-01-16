Vue.component('years', {
  template: '#years-template',
  data: function () {
      return {
          message: 'Packs not yet loaded',
          packs: {}
      }
  },
  created: function() {
      this.get();
  },
  methods: {
      get: function () {
          this.$http.get('/data/site.json')
            .then(function (data) {
                this.$set(this.packs, 'items', data.body);
                this.$set(this, 'message', 'Packs loaded');
            },function(err) {
                this.$set('message', 'There was an error');
            });
      },
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

const routes = [
  { path: '/year', component: Vue.component('years') },
]

const router = new VueRouter({
  routes // short for routes: routes
})

const app = new Vue({
  router
}).$mount('#app')


// $(document).ready(function(){
//     // for right now this seems like a bit much
//     // $.protip({
//     //     defaults: {
//     //         position: 'top',
//     //         skin: 'square',
//     //         size: 'tiny'
//     //     }
//     // });
// });