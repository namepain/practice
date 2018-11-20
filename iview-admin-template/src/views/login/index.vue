<template>
  <div class="login-container">
    <Form class="login-form" ref="loginForm" :rules="loginRules" :model="loginForm">
      <h3 class="title">admin-iview-template</h3>
      <formItem prop="username">
        <span class="svg-container svg-container_user">
          <svg-icon icon-class="user" />
        </span>
        <Input type="text" v-model.trim="loginForm.username" placeholder="username"/>
      </formItem>
      <formItem prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password" />
        </span>
        <Input
          :type="pwdType"
          v-model="loginForm.password"
          @keyup.enter.native="handleLogin"
          placeholder="password"/>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye" />
        </span>
      </formItem>
      <formItem>
        <Button type="primary" :loading="loading" @click.native.prevent="handleLogin" style="width:100%">
          Sign In
        </Button>
      </formItem>
    </Form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length < 2) {
        callback(new Error('用户名不能小于2位'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      pwdType: 'password',
      redirect: null,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      }
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = 'text'
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            this.$router.push({ path: this.redirect || '/' })
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.warn('validate error!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login-container {
  position: fixed;
  width: 100%;
  height: 100%;

  .login-form {
    margin: 200px auto 0;
    width: 300px;
    text-align: center;
  }

  .title {
    margin-bottom: 20px;
    font-size: 20px;
  }

  .svg-container {
    position: absolute;
    font-size: 16px;
    padding-left: 6px;
    color: #d2d2d2;
    z-index: 1;

    &_user {
      padding-left: 4px;
      font-size: 20px
    }
  }

  .show-pwd {
    position: absolute;
    right: 8px;
    cursor: pointer;
  }

  /deep/ .ivu-input {
    padding-left: 28px;
    line-height: 36px;
    height: 36px;
  }
}
</style>
