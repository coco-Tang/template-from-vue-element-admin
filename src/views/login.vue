<template>
  <div class="login">
    <div class="title">
      <div class="co">
        <div class="cn">声纹识别系统</div>
        <div class="en">NATIONAL VOICEPRINT CENTER</div>
      </div>
    </div>
    <div class="content">
      <div class="ulang-voice">
        <img src="../assets/images/ulang.png" alt="">
      </div>
      <div class="login-module">
        <div class="login-title">声纹识别系统</div>
        <div class="login-content">
          <el-form ref="loginForm" :model="loginForm" class="login-form">
            <div class="form-error" v-if="errorMsg !== 0">{{errorMsg}}</div>

            <el-form-item :class="{'form-item-error': showUsernameError}" prop="username">
              <span class="svg-container">
                <svg-icon icon-class="user" />
              </span>
              <el-input
                ref="username"
                v-model="loginForm.username"
                placeholder="用户名"
                name="username"
                type="text"
                tabindex="1"
                auto-complete="on"
              />
              <span>
                <svg-icon icon-class="" />
              </span>
            </el-form-item>

            <el-tooltip v-model="capsTooltip" content="大写键盘已打开" placement="right" manual>
              <el-form-item prop="password">
                <span class="svg-container">
                  <svg-icon icon-class="password" />
                </span>
                <el-input
                  :key="passwordType"
                  ref="password"
                  v-model="loginForm.password"
                  :type="passwordType"
                  placeholder="密码"
                  name="password"
                  tabindex="2"
                  auto-complete="on"
                  @keyup.native="checkCapslock"
                  @blur="capsTooltip = false"
                  @keyup.enter.native="loginSubmit"
                />
                <span class="show-pwd" @click="showPwd">
                  <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
                </span>
              </el-form-item>
            </el-tooltip>

            <el-form-item class="form-item-remember">
              <el-checkbox v-model="loginForm.rememberPassword">记住密码</el-checkbox>
            </el-form-item>

            <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="loginSubmit">登录</el-button>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
        rememberPassword: true
      },
      errorMsg: "",
      errorCode: "",
      passwordType: "password",
      capsTooltip: false,
      loading: false
    };
  },
  computed: {
    showUsernameError() {
      return this.errorCode === 1 || this.errorCode === 3;
    },
    showPasswordError() {
      return this.errorCode === 2 || this.errorCode === 3;
    }
  },
  directives: {
    focus: {
      inserted: function(el) {
        el.focus();
      }
    }
  },
  mounted() {
    // if (getCookie('username') && getCookie('password')) {
    //   this.loginForm.username = getCookie('username');
    //   this.loginForm.password = getCookie('password');
    // }
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= "a" && key <= "z")) ||
          (!shiftKey && (key >= "A" && key <= "Z"))
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    loginSubmit() {
      // let username = this.loginForm.username;
      // let password = new MD5().update(this.loginForm.password).digest('hex');
      let { username, password } = this.loginForm;
      if (username === "") {
        this.errorMsg = "用户名/邮箱不能为空";
        this.errorCode = 1;
        return;
      } else {
        this.errorMsg = "";
        this.errorCode = 0;
      }
      if (password === "") {
        this.errorMsg = "密码不能为空";
        this.errorCode = 2;
        return;
      } else {
        this.errorMsg = "";
        this.errorCode = 0;
      }

      this.loading = true;
      this.$store
        .dispatch("user/login", this.loginForm)
        .then(() => {
          console.log('login.vue登录成功')
          this.$router.push({ path: this.redirect || "/" });
          this.loading = false;
        })
        .catch(() => {
          console.log('login.vue登录失败')
          this.loading = false;
        });
    }
  }
};
</script>
<style lang="scss">
.el-input__inner {
  border: none;
}
</style>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
// @import "../assets/less/var.less";
$error-color: rgb(255, 98, 68);
$dark_gray: #889aa4;
$light_gray: #eee;

.login {
  width: 100%;
  min-height: 100%; //保证高度填充整个浏览器可视区高度
  display: flex;
  flex-direction: column;

  .title {
    width: 100%;
    color: #202336;
    box-shadow: 3px 3px 11px 0px rgba(48, 163, 255, 0.52);
    .co {
      width: 340px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      .cn {
        font-size: 30px;
        font-family: FZDHTK--GBK1-0;
      }
      .en {
        font-size: 12px;
        font-family: BankGothicBT-Medium;
      }
    }
  }

  .content {
    width: 100%;
    min-height: 100%;
    flex: 1;
    background-image: url("../assets/images/login-bg.png");
    background-size: cover;
    display: flex;
    justify-content: space-around;
    align-items: center;

    .login-module {
      width: 520px;
      max-width: 100%;
      padding: 0px 35px 0;//保持在手机，pad屏幕下处于居中状态
      height: 410px;
      border-radius: 4px;

      .login-title {
        // padding-left: 20px;
        height: 50px;
        line-height: 50px;
        background-color: #262927;
        border-radius: 4px 4px 0px 1px;
        color: #fff;
        text-align: center;
        font-size: 17px;
      }

      .login-content {
        background-color: rgba(233, 233, 233, 0.2);
        padding: 16px;
        height: 360px;
        border-radius: 0 0 4px 4px;
        text-align: center;
        position: relative;


        .login-form {
          background-color: #fff;
          border-radius: 3px;
          height: 328px;
          padding: 33px;

          .form-error {
            color: $error-color;
          }

          .el-form-item {
            border-bottom: 1px solid $light_gray;
            &:nth-of-type(n+4) {
              border: none;
            }
            .el-input {
              display: inline-block;
              height: 47px;
              width: 85%;
              input {
                background: transparent;
                border: 0px;
                -webkit-appearance: none;
                border-radius: 0px;
                padding: 12px 5px 12px 15px;
                color: $light_gray;
                height: 47px;
                // caret-color: $cursor;

                &:-webkit-autofill {
                  // box-shadow: 0 0 0px 1000px $bg inset !important;
                  // -webkit-text-fill-color: $cursor !important;
                }
              }
            }
            margin-bottom: 0;
            margin-top: 18px;
            // background-color: rgb(232, 240, 254);
            &:first-child {
              margin-top: 0;
            }
            &:focus {
              box-shadow: none;
            }
            &.form-item-remember {
              // margin-top: 30px;
              .el-form-item__content {
                border-bottom: 1px solid red;
                vertical-align: middle;
                font-size: 22px;
              }
            }

            .btn-login {
              width: 100%;
              height: 40px;
              background-color: #3a77e9;
              border-radius: 3px;
              border: none;
              color: #fff;
              font-size: 22px;
            }
            &.form-item-error {
              .form-input {
                border-bottom-color: $error-color;
              }
              &:after {
                content: "×××";
                color: $error-color;
                position: absolute;
                right: 10px;
                font-size: 14px;
              }
              .input-wrapper {
                // display: flex;
              }
            }
          }

          .svg-container {
            color: $dark_gray;
          }
        }
      }
    }

    @media only screen and (max-width: 1200px) {
      .ulang-voice {
        display: none;
      }
    }
  }
}
</style>
