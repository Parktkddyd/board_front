<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">로그인</h1>
        <p class="text-gray-600 mt-2">계정 정보를 입력해 주십시오</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Id Input -->
        <div>
          <label for="id" class="block text-sm font-medium text-gray-700">
            아이디
          </label>
          <div class="mt-1">
            <input
              id="id"
              v-model="form.userId"
              type="id"
              required
              :class="[
                'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                errors.userId ? 'border-red-300' : 'border-gray-300',
              ]"
            />
            <p v-if="errors.userId" class="mt-2 text-sm text-red-600">
              {{ errors.userId }}
            </p>
          </div>
        </div>

        <!-- Password Input -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            비밀번호
          </label>
          <div class="mt-1 relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              :class="[
                'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                errors.password ? 'border-red-300' : 'border-gray-300',
              ]"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <span v-if="showPassword" class="text-gray-500">숨기기</span>
              <span v-else class="text-gray-500">보기</span>
            </button>
            <p v-if="errors.password" class="mt-2 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <!--Forgot Password -->
        <div class="flex items-center justify-between">
          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
              아이디를 잊으셨나요?
            </a>
          </div>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <template v-if="isLoading">
              <svg
                class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              로그인 중...
            </template>
            <template v-else>로그인</template>
          </button>
        </div>

        <!-- Error Message -->
        <div v-if="globalError" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ globalError }}
              </h3>
            </div>
          </div>
        </div>
      </form>

      <!-- Sign Up Link -->
      <p class="mt-8 text-center text-sm text-gray-600">
        회원이 아니십니까?
        <router-link
          to="/signup"
          class="font-medium text-blue-600 hover:text-blue-500"
        >
          회원가입
        </router-link>
      </p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginPage",
  data() {
    return {
      form: {
        userId: "",
        password: "",
      },
      errors: {
        userId: "",
        password: "",
      },
      globalError: "",
      isLoading: false,
      showPassword: false,
    };
  },
  methods: {
    validateForm() {
      let isValid = true;
      this.errors.userId = "";
      this.errors.password = "";
      this.globalError = "";

      if (!this.form.userId) {
        this.errors.userId = "아이디를 입력해 주세요";
        isValid = false;
      }

      if (!this.form.password) {
        this.errors.password = "비밀번호를 입력해 주세요";
        isValid = false;
      }
      return isValid;
    },
    async handleSubmit() {
      if (!this.validateForm()) return;

      this.isLoading = true;
      this.globalError = "";

      try {
        const response = await axios.post(
          process.env.VUE_APP_BACK_URL + "/users/login",
          {
            user_id: this.form.userId,
            user_password: this.form.password,
          }
        );

        if (response.data.header.customStatusCode === "ACCOUNT-LOGIN-200") {
          this.$router.push("/");
          this.$emit("/");
        } else {
          // Handle different error codes
          switch (response.data.header.customStatusCode) {
            case "ACCOUNT-LOGIN-400-1":
              this.globalError =
                "존재하지 않는 아이디 입니다. 다시 시도해 주십시오.";
              break;
            case "ACCOUNT-LOGIN-400-2":
              this.globalError =
                "비밀번호가 일치하지 않습니다. 다시 시도해 주십시오.";
              break;
            default:
              this.globalError =
                "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주십시오.";
          }
        }
        this.$emit("login-success");
      } catch (error) {
        this.globalError =
          "알 수 없는 오류가 발생했습니다. 잠시 후 다시 시도해 주십시오.";
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style scoped>
/* Add any additional custom styles here */
</style>