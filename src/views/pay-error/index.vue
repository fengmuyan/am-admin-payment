<template>
  <div class="register">
    <div class="header-top">
      <div class="center-wrap">
        <h2>好多果平台</h2>
      </div>
    </div>
    <div class="center-wrap">
      <div class="mid-content">
        <div>
          <div class="block">
            <div class="suc-box">
              <i class="el-icon-error" style="font-size:75px;color:#f56c6c"></i>
              <div class="suc-title">支付失败~</div>
              <el-button class="suc-btn" @click.native="$router.replace({path: '/'})">返回列表</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
</script>
