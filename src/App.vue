<template>
  <div id="app">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h1 id="top">Vue.JS Bootstrap Advanced Select</h1>
        </div>
      </div>
      <div class="row">
      <div class="col-md-2">
        <nav class="bs-docs-sidebar hidden-print hidden-sm hidden-xs affix-top"
          data-spy="affix" data-offset-top="70" data-offset-bottom="200">
          <ul class="nav bs-docs-sidenav">
            <li><a href="#basic">Basic</a></li>
            <li><a href="#multiple">Multiple</a></li>
            <li><a href="#search">Search</a></li>
          </ul>
          <a class="back-to-top" href="#top">Back to top</a>
        </nav>
      </div>
      <div class="col-md-10 form">
        <div class="well">
          <p>Every example would require the following plus the example specifics</p>
          <pre>&lt;advanced-select
  v-model="value"
  :options="options"
  /&gt;</pre>
        <pre>import AdvancedSelect from '@/components/AdvancedSelect.vue';

export default {
  components: {
    AdvancedSelect,
  },
  data: () => ({
    // the list of options to display
    options: [],
    // the value to preselect
    value: null,
  }),
};</pre>
        </div>
        <Basic id="basic" />
        <Multiple id="multiple" />
        <Search id="search" />
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import 'bootstrap/dist/js/bootstrap';
import 'bootstrap/less/bootstrap.less';
import Basic from './examples/Basic.vue';
import Multiple from './examples/Multiple.vue';
import Search from './examples/Search.vue';

export default {
  components: {
    Basic,
    Multiple,
    Search,
  },
};
</script>

<style lang="less">

/*
 * Side navigation - Bootstrap docs copy
 *
 * Scrollspy and affixed enhanced navigation to highlight sections and secondary
 * sections of docs content.
 */

/* By default it's not affixed in mobile views, so undo that */
.bs-docs-sidebar.affix {
  position: static;
}
@media (min-width: 768px) {
  .bs-docs-sidebar {
    padding-left: 20px;
  }
}

/* First level of nav */
.bs-docs-sidenav {
  margin-top: 20px;
  margin-bottom: 20px;
}

/* All levels of nav */
.bs-docs-sidebar .nav > li > a {
  display: block;
  padding: 4px 20px;
  font-size: 13px;
  font-weight: 500;
  color: #767676;
}
.bs-docs-sidebar .nav > li > a:hover,
.bs-docs-sidebar .nav > li > a:focus {
  padding-left: 19px;
  color: #563d7c;
  text-decoration: none;
  background-color: transparent;
  border-left: 1px solid #563d7c;
}
.bs-docs-sidebar .nav > .active > a,
.bs-docs-sidebar .nav > .active:hover > a,
.bs-docs-sidebar .nav > .active:focus > a {
  padding-left: 18px;
  font-weight: bold;
  color: #563d7c;
  background-color: transparent;
  border-left: 2px solid #563d7c;
}

/* Nav: second level (shown on .active) */
.bs-docs-sidebar .nav .nav {
  display: none; /* Hide by default, but at >768px, show it */
  padding-bottom: 10px;
}
.bs-docs-sidebar .nav .nav > li > a {
  padding-top: 1px;
  padding-bottom: 1px;
  padding-left: 30px;
  font-size: 12px;
  font-weight: normal;
}
.bs-docs-sidebar .nav .nav > li > a:hover,
.bs-docs-sidebar .nav .nav > li > a:focus {
  padding-left: 29px;
}
.bs-docs-sidebar .nav .nav > .active > a,
.bs-docs-sidebar .nav .nav > .active:hover > a,
.bs-docs-sidebar .nav .nav > .active:focus > a {
  padding-left: 28px;
  font-weight: 500;
}

/* Back to top (hidden on mobile) */
.back-to-top,
.bs-docs-theme-toggle {
  display: none;
  padding: 4px 10px;
  margin-top: 10px;
  margin-left: 10px;
  font-size: 12px;
  font-weight: 500;
  color: #999;
}
.back-to-top:hover,
.bs-docs-theme-toggle:hover {
  color: #563d7c;
  text-decoration: none;
}
.bs-docs-theme-toggle {
  margin-top: 0;
}

@media (min-width: 768px) {
  .back-to-top,
  .bs-docs-theme-toggle {
    display: block;
  }
}

/* Show and affix the side nav when space allows it */
@media (min-width: 992px) {
  .bs-docs-sidebar .nav > .active > ul {
    display: block;
  }
  /* Widen the fixed sidebar */
  .bs-docs-sidebar.affix,
  .bs-docs-sidebar.affix-bottom {
    width: 213px;
  }
  .bs-docs-sidebar.affix {
    position: fixed; /* Undo the static from mobile first approach */
    top: 20px;
  }
  .bs-docs-sidebar.affix-bottom {
    position: absolute; /* Undo the static from mobile first approach */
  }
  .bs-docs-sidebar.affix-bottom .bs-docs-sidenav,
  .bs-docs-sidebar.affix .bs-docs-sidenav {
    margin-top: 0;
    margin-bottom: 0;
  }
}
@media (min-width: 1200px) {
  /* Widen the fixed sidebar again */
  .bs-docs-sidebar.affix-bottom,
  .bs-docs-sidebar.affix {
    width: 263px;
  }
}
</style>
