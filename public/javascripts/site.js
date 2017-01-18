Vue.component('breadcrumbs', {
    template: '#breadcrumbs-template',
    data: function() {
        return { path: [] }
    }, methods: {
        get: function() {
            var path = [];
            if (this.$route.params.year !== undefined) {
                path.push( { title: 'Packs', url: '/' });
                path.push( { title: this.$route.params.year, url: '/year/' + this.$route.params.year } );
            }
            if (this.$route.params.pack !== undefined) path.push( { title: this.$route.params.pack, url: '/year/' + this.$route.params.year + '/' + this.$route.params.pack } );
            if (this.$route.params.file !== undefined) path.push( { title: this.$route.params.file, url: '/year/' + this.$route.params.year + '/' + this.$route.params.pack + '/' + this.$route.params.file } );

            this.$set(this, 'path', path);
        }
    }, created: function() {
        this.get();
    }, watch: {
        '$route': 'get'
    }
});
Vue.component('year', {
    template: '#year-template',
    data: function() {
        return {
            // TODO: Use vuex to manage state rather than grabbing each time
            message: this.$route.params.year + ' loading',
            packs: {}
        }
    },
    created: function() {
        this.get();
    }, updated: function() {
        this.$set(this, 'loaded', true);
        
    },
    methods: {
        get: function() {
            this.$http.get('/data/sixteencolors.json')
                .then(function(data) {
                    this.$set(this, 'packs', data.body[this.$route.params.year]);
                    this.$set(this, 'message', this.$route.params.year + ' loaded');
                    this.$set(this, 'loaded', true);
                }, function(err) {
                    this.$set('message', 'There was an error: ' + err);
                    this.$set(this, 'loaded', true);
                });
        },
        expandPack: function(event) {
            var el = $(event.target).parent('li');
            // if there is ever an issue loading a pack, it is possible it is because it has a file extension
            // that is not 3 characters
            router.push({ name: 'pack', params:  { year: this.$route.params.year, pack: el.data('pack').slice(0, -4) } });
        }
    }
});
Vue.component('pack', {
    template: '#pack-template',
    data: function() {
        return {
            // TODO: Use vuex to manage state rather than grabbing each time
            message: this.$route.params.pack + ' loading',
            files: {},
            filename: '',
            loaded: false
        }
    },
    created: function() {
        this.get();
    },
    updated: function() {
        this.$set(this, 'loaded', true);
    },
    watch: {
        '$route': 'changeSelected'
    },
    methods: {
        get: function() {
            this.$http.get('/data/sixteencolors.json')
                .then(function(data) {
                    this.$set(this, 'filename', this.getFullFilename( data.body[this.$route.params.year], this.$route.params.pack));
                    this.$set(this, 'files', data.body[this.$route.params.year][this.filename].files);

                    for (file in this.files) {
                        // if we are on the root pack, send us to the first file
                        if (this.$route.params.file === undefined) {
                            router.push({ name: 'pack-file', params:  { year: this.$route.params.year, pack: this.$route.params.pack, file: file } });
                        }
                        this.$set(this.files[file], 'active', false);
                        this.$set(this.files[file], 'selected', false);
                    }

                    if (this.$route.params.file !== undefined) {
                        this.$set(this.files[this.$route.params.file], 'selected', true);
                    } 
                    this.$set(this, 'message', this.$route.params.pack + ' loaded');
                    this.$set(this, 'loaded', true);
                }, function(err) {
                    this.$set('message', 'There was an error: ' + err);
                    this.$set(this, 'loaded', true);
                });
        },
        getFullFilename: function(prop, value) {
            for (var p in prop) {
                if (p.indexOf(value) == 0) {
                    return p;
                }
            }
            return undefined;
        }, changeSelected: function() {
            for (file in this.files) {
                this.$set(this.files[file], 'active', false);
                this.$set(this.files[file], 'selected', false);
            }

            if (this.$route.params.file !== undefined) {
                this.$set(this.files[this.$route.params.file], 'selected', true);
            }
        }
    }, computed: {
        selected: function() {
            for (var file in this.files) {
                if (this.files[file].selected) {
                    this.files[file].filename = file;
                    return this.files[file];
                }
            }
            return undefined;
        }
    }
});

Vue.component('packFile', {
    props: ['file', 'filename', 'selected'],
    template: '#pack-file-template',
    methods: {
        select: function() {
          if (event.target.nodeName == "LI") {
            el = $(event.target);
          } else {
            el = $(event.target).parents('li');
          }
          router.push({ name: 'pack-file', params:  { year: this.$route.params.year, pack: this.$route.params.pack, file: el.find('span').text() } });
            
        }
    }
});
Vue.component('years', {
  template: '#years-template',
  data: function () {
      return {
          message: 'Years loading',
          years: {}
      }
  },
  created: function() {
      this.get();
  },
  updated: function() {
    this.$set(this, 'loaded', true);
  },
  methods: {
      get: function () {
          this.$http.get('/data/site.json')
            .then(function (data) {
                this.$set(this, 'years', data.body);
                this.$set(this, 'message', 'Years loaded');
                this.$set(this, 'loaded', true);
            },function(err) {
                this.$set('message', 'There was an error');
                this.$set(this, 'loaded', true);
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
  { path: '/', name: 'years', component: Vue.component('years'), alias: '/year' },
  { path: '/year/:year', name: 'year', component: Vue.component('year') },
  { path: '/year/:year/:pack', name: 'pack', component: Vue.component('pack') },
  { path: '/year/:year/:pack/:file', name: 'pack-file', component: Vue.component('pack') },
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