<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="hover">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <span class="user-name">{{ username }}</span>
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <el-dropdown-item @click.native="modifyPassword">
            <span style="display: block">修改密码</span>
          </el-dropdown-item>
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <ModifyPassword :visible.sync="modifyPasswordVisible" />
  </div>
</template>

<script>
import avatar from '@/assets/default.png'
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import ModifyPassword from '@/components/ModifyPassword'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    ModifyPassword
  },
  data() {
    return {
      avatar,
      modifyPasswordVisible: false
    }
  },
  computed: {
    ...mapGetters(['sidebar', 'username'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    logout() {
      this.$confirm('确认要退出登录吗?', {
        type: 'warning',
        showClose: false
      }).then(() => {
        this.$store.dispatch('user/resetToken').then(() => {
          this.$router.push('/login')
        })
      })
    },
    modifyPassword() {
      this.modifyPasswordVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-name {
          font-size: 14px;
          color: #000000;
          cursor: pointer;
          position: relative;
          top: -5px;
          margin-left: 5px;
        }

        .user-avatar {
          cursor: pointer;
          width: 28px;
          height: 28px;
          border-radius: 20px;
          position: relative;
          top: 3px;
        }
      }
    }
  }
}
</style>
