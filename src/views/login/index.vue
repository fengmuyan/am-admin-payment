<template>
  <div class="login">
    <div class="login-center">
      <el-form
        class="login-form"
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">好 多 果</h3>
        </div>
        <div class="content">
          <el-form-item prop="username">
            <div class="tip">账号</div>
            <el-input
              name="username"
              auto-complete="off"
              type="text"
              v-model="loginForm.username"
              placeholder="手机号"
            />
          </el-form-item>
          <el-form-item class="pw-item" prop="password">
            <div class="tip">密码</div>
            <el-input
              name="password"
              type="password"
              auto-complete="off"
              v-model="loginForm.password"
              placeholder="密码"
            />
          </el-form-item>
          <el-form-item>
            <el-button class="verify-btn" id="Captcha">
              <span :class="['verify-box',captchaStatus === 2 ? 'ac-verify-box' : '']">
                <img v-if="captchaStatus === 0" src="../../assets/image/index02.png" alt="icon" />
                <img v-if="captchaStatus === 2" src="../../assets/image/index01.png" alt="icon" />
                点击完成验证
              </span>
              <div v-if="captchaTip" class="el-form-item__error">请完成验证</div>
            </el-button>
          </el-form-item>
        </div>
        <el-button
          type="primary"
          class="submit"
          :loading="loading"
          v-throttle="{callback:handleLogin}"
        >登 录</el-button>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  name: "login",
  data() {
    return {
      loginForm: {
        username: "",
        password: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "用户名不能为空" }
        ],
        password: [{ required: true, trigger: "blur", message: "密码不能为空" }]
      },
      loading: false,
      redirect: undefined,
      captchaStatus: 0,
      randstr: "",
      ticket: "",
      captchaTip: false
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  mounted() {
    if (typeof window.TencentCaptcha !== "function") {
      const URL = "https://ssl.captcha.qq.com/TCaptcha.js";
      const scriptHeat = document.createElement("script");
      scriptHeat.type = "text/javascript";
      scriptHeat.src = URL;
      document.body.appendChild(scriptHeat);
      scriptHeat.onload = () => {
        this.tencentCaptchaInit();
      };
    } else {
      this.tencentCaptchaInit();
    }
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid && this.captchaStatus === 2) {
          this.loading = true;
          const {
            randstr,
            ticket,
            loginForm: { username, password }
          } = this;
          this.$store
            .dispatch("Login", { randstr, ticket, username, password })
            .then(() => {
              this.loading = false;
              this.$router.push({ path: this.redirect || "/" });
            })
            .catch(() => {
              this.captchaStatus = 0;
              this.loading = false;
            });
        } else {
          this.captchaTip = true;
          return false;
        }
      });
    },
    tencentCaptchaInit() {
      new TencentCaptcha(
        document.getElementById("Captcha"),
        "2075840643",
        async ({ ret, randstr, ticket }) => {
          if (ret === 0) {
            this.captchaStatus = 2;
            this.captchaTip = false;
            this.randstr = randstr;
            this.ticket = ticket;
          }
        }
      );
    }
  }
};
</script>
