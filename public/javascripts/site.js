Vue.component('year', {
    template: '#year-template',
    data: function() {
        return {
            // TODO: Use vuex to manage state rather than grabbing each time
            message: 'Year loaded',
            packs: {}
        }
    },
    created: function() {
        this.get();
    },
    methods: {
        get: function() {
            this.$http.get('/data/site.json')
                .then(function(data) {
                    this.$set(this, 'packs', data.body[this.$route.params.year]);
                    this.$set(this, 'message', 'Packs loaded');
                }, function(err) {
                    this.$set('message', 'There was an error');
                });
        },
        expandPack: function(event) {
            var el = $(event.target).parent('li');
            router.push({ name: 'pack', params:  { year: this.$route.params.year, pack: el.data('pack') } });
        }
    }
});
Vue.component('pack', {
    template: '#pack-template',
    data: function() {
        return {
            // TODO: Use vuex to manage state rather than grabbing each time
            message: 'Pack not loaded',
            files: {}
        }
    },
    created: function() {
        this.get();
    },
    methods: {
        get: function() {
            this.$http.get('/data/sixteencolors.json')
                .then(function(data) {
                    this.$set(this, 'files', data.body[this.$route.params.year][this.$route.params.pack].files);
                    this.$set(this, 'message', 'Pack loaded');
                }, function(err) {
                    this.$set('message', 'There was an error: ' + err);
                });
        }
    }
});
Vue.component('years', {
  template: '#years-template',
  data: function () {
      return {
          message: 'Packs not yet loaded',
          years: {}
      }
  },
  created: function() {
      this.get();
  },
  updated: function() {
  },
  methods: {
      get: function () {
          this.$http.get('/data/site.json')
            .then(function (data) {
                this.$set(this, 'years', data.body);
                this.$set(this, 'message', 'Years loaded');
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
          router.push({ name: 'year', params:  { year: el.data('year') } });
          
      },
        expandPack: function(event) {
            var el = $(event.target).parent('li');
            el.toggleClass('expanded');
            var yearEl = el.parents('ol.year > li');
            router.push({ name: 'pack', params:  { year: yearEl.data('year'), pack: el.data('pack') } });
        }
  }
});

const routes = [
  { path: '/year', name: 'years', component: Vue.component('years') },
  { path: '/year/:year', name: 'year', component: Vue.component('year') },
  { path: '/year/:year/pack/:pack', name: 'pack', component: Vue.component('pack') }
]

const router = new VueRouter({
  mode: 'history',
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

// detect back button
$(window).bind('popstate',  
    function(event) {
        console.log('pop: ' + event.state);
    });