<template>
  <div class="dashboard-container" v-if="flag">
    <div class="con-left">
      <b style="font-size: 24px">温馨提示</b><br /><br />
      <p>1： 扫码关注</p>
      <p>2：点击表单，登录绑定账号</p>
      <p>3：有新的线索会推送到手机上</p>
    </div>
    <div class="con-right">
      <img :src="wechatImg" title="公众号二维码图片" style="width: 147px" />
    </div>
  </div>
  <div class="dashboard-container" v-else>
    <div class="con-left">
      <b style="font-size: 24px">温馨提示</b><br /><br />
      <p class="left-tip">欢迎 {{ username }} 登录超量数据管理系统</p>
    </div>
  </div>
</template>

<script>
import wechatImg from '@/assets/wechat.png'
import { getItem } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters(['username'])
  },
  data() {
    return {
      wechatImg,
      flag: false
    }
  },
  created() {
    const { data } = JSON.parse(getItem('info'))
    this.flag = data.enable_wechat == true ? true : false
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  margin-top: 15px;
  background-color: #fff;
  padding: 40px 0px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .con-left {
    height: 160px;
    background-color: #f2dede;
    border-color: #ebcdcd;
    color: #b94a48;
    width: 70%;
    padding: 15px;
    p {
      font-size: 13px;
    }
    .left-tip {
      font-size: 20px;
    }
  }
  .con-right {
    height: 160px;
    padding: 5px;
  }
}
</style>
