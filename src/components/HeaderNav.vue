<template>
  <div class="header-nav">
    {{permission_routes}}
    <div v-for="(item, index) in permission_routes" :key="index">{{item}}</div>
    <Menu 
      mode="horizontal" 
      :theme="theme" 
      @on-select="clickNav">
        <MenuItem :name="item.path" v-for="(item, index) in permission_routes" :key="index" 
        :class="[{'is-active': item.active && item.active($route.path)}]">
            <div class="nav-wrap">
              <div :class="[{'is-active': item.active && item.active($route.path),'border-color': borderColor}]">{{item.name}}</div>
            </div>
        </MenuItem>
    </Menu>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: "headernav",
  computed: {
    ...mapGetters([
      "permission_routes"
    ])
  },
  props: {
    theme: { type: String, default: 'dark' },
    borderColor: { type: Boolean, default: true }
  },
  methods: {
    clickNav (name) {
      this.$router.push(name);
      // console.log(this.$route)
    }
  }
};
</script>

<style lang="scss" scoped>
// @import "../assets/less/var.less";
.ivu-menu-dark {
    background: none;
}
.ivu-menu .ivu-menu-dark .ivu-menu-horizontal {
  // width: 100%;
}
.ivu-menu-horizontal {
  height: 50px;
}
.ivu-menu-dark.ivu-menu-horizontal .ivu-menu-item, 
.ivu-menu-dark.ivu-menu-horizontal .ivu-menu-submenu {
  color: #8c90b3;
  // font-size: @large_font_size;
  &.is-active {
    color: #fff;
  }
}

.ivu-menu-light.ivu-menu-horizontal .ivu-menu-item, 
.ivu-menu-light.ivu-menu-horizontal .ivu-menu-submenu {
  color: #000;
  // font-size: @small_font_size;
  &.is-active {
    // color: @theme_color;
  }
}
.header-nav {
  background-color: #373842;
  width: 100px;
  display: flex;
  // padding: 20px 0;
  justify-content: center;
  // height: @_header_height;
  // line-height: @_header_height;
  .border-color {
    border-bottom:2px solid transparent;
    // &:hover {
    //   border-bottom:2px solid #558960;
    //   color: #fff;
    // }
    &.is-active {
      border-bottom:2px solid #558bdc;
    }
  }
}
</style>
