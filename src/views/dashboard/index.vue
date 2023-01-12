<template>
  <div class="page-show">
    <div class="page-title">概览</div>
    <div class="box-content">
      <div class="box-item">
        <div class="box-item-right">
          <span class="box-item-right-title">总条数</span>
          <span class="box-item-right-num">{{ recharge_total }}</span>
        </div>
      </div>

      <div class="box-item">
        <div class="box-item-right">
          <span class="box-item-right-title">消耗数</span>
          <span class="box-item-right-num">{{ consume_total }}</span>
        </div>
      </div>

      <div class="box-item">
        <div class="box-item-right">
          <span class="box-item-right-title">余额</span>
          <span class="box-item-right-num">{{ surplus_total }}</span>
        </div>
      </div>

      <div class="box-item">
        <div class="box-item-right">
          <span class="box-item-right-title">今日消耗</span>
          <span class="box-item-right-num">{{ consume_today }}</span>
        </div>
      </div>
    </div>

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
      flag: false,
      surplus_total: 0,
      consume_total: 0,
      recharge_total: 0,
      consume_today: 0
    }
  },
  created() {
    const { data } = JSON.parse(getItem('info'))
    this.flag = data.enable_wechat == true ? true : false
    this.surplus_total = data.surplus_total
    this.consume_total = data.consume_total
    this.recharge_total = data.recharge_total
    this.consume_today = data.consume_today
  }
}
</script>

<style lang="scss" scoped>
.page-show {
  margin-top: 20px;
  .page-title {
    border-bottom: 1px solid #ddd;
    background-color: #fff;
    height: 70px;
    line-height: 70px;
    padding: 0 20px;
    font-size: 24px;
  }

  .box-content {
    background: #ffffff;
    height: 200px;
    display: flex;
    justify-content: space-between;
    align-content: center;
    align-items: center;
    .box-item {
      width: 25%;
      height: 58px;
      .box-item-right {
        .box-item-right-title {
          font-size: 12px;
          font-weight: 400;
          text-align: center;
          color: #555555;
          line-height: 18px;
          display: block;
        }
        .box-item-right-num {
          font-size: 32px;
          font-weight: 700;
          text-align: center;
          color: #555555;
          line-height: 48px;
          display: block;
        }
      }
    }
  }

  .dashboard-container {
    margin-top: 15px;
    background-color: #fff;
    padding: 40px 0px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .con-left {
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
}
</style>
