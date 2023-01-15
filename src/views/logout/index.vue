<template>
  <div>
    <div class="home-con">
      <div class="home-title">管理员用户</div>
      <div class="home-item">
        <div class="home-text">充值总数：{{ recharge_total }}</div>
        <div class="home-text">消耗数：{{ consume_total }}</div>
        <div class="home-text">余额：{{ surplus_total }}</div>
      </div>
    </div>
    <div class="btn-text">
      <el-button type="danger" size="small" @click="handleLogout"
        >退出</el-button
      >
    </div>
  </div>
</template>

<script>
import { logoutCode } from '@/api/user'
import { getItem } from '@/utils/auth'
export default {
  name: 'LoginOut',
  data() {
    return {
      code: '',
      userId: '',
      surplus_total: 0,
      consume_total: 0,
      recharge_total: 0
    }
  },
  created() {
    const { data } = JSON.parse(getItem('info'))
    this.surplus_total = data.surplus_total
    this.consume_total = data.consume_total
    this.recharge_total = data.recharge_total

    this.userId = parseInt(getItem('userid'))
    this.code = getItem('code')
  },
  methods: {
    handleLogout() {
      const params = {
        openid: this.code
      }
      logoutCode(this.userId, params)
        .then(() => {})
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.home-con {
  border: 1px solid #3f7ab6;
  width: 100%;
  border-radius: 5px;
  .home-title {
    height: 40px;
    background-color: #3f7ab6;
    color: #fff;
    text-align: center;
    line-height: 40px;
  }
  .home-item {
    padding: 20px 40px;
  }
  .home-text {
    font-size: 16px;
    line-height: 32px;
  }
}
.btn-text {
  margin-top: 20px;
  ::v-deep .el-button {
    width: 100%;
  }
}
</style>
