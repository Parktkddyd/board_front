<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <!-- Notification -->
    <div
      v-if="notification.show"
      :class="[
        'fixed top-4 right-4 p-4 rounded-md shadow-lg max-w-sm z-50 transition-all duration-300',
        notification.type === 'error'
          ? 'bg-red-50 text-red-900'
          : 'bg-green-50 text-green-900',
      ]"
    >
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <!-- Error Icon -->
          <svg
            v-if="notification.type === 'error'"
            class="h-6 w-6 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium">
            {{ notification.title }}
          </h3>
          <div class="mt-2 text-sm">
            {{ notification.message }}
          </div>
        </div>
        <div class="ml-4 flex-shrink-0 flex">
          <button
            @click="closeNotification"
            class="inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <span class="sr-only">닫기</span>
            <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path
                fill-rule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          아이디 유효성 검사
        </h3>
        <p class="text-gray-600 mb-6">
          {{
            isCheckingUserId
              ? "아이디 유효성 검사 중입니다.."
              : userIdAvailable
              ? "아이디를 사용할 수 있습니다."
              : "중복된 아이디 입니다."
          }}
        </p>
        <div class="flex justify-end">
          <button
            @click="handleModalClose"
            :disabled="isCheckingUserId"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ isCheckingUserId ? "닫기" : "닫기" }}
          </button>
        </div>
      </div>
    </div>

    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">회원가입</h1>
        <p class="text-gray-600 mt-2">빈칸에 정보를 입력하십시오</p>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Username with duplicate check -->
        <div>
          <label class="block text-sm font-medium text-gray-700">아이디</label>
          <div class="mt-1 flex space-x-2">
            <input
              v-model="form.userId"
              type="text"
              required
              :disabled="userIdConfirmed"
              class="flex-1 appearance-none block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:text-gray-500"
              :class="{ 'border-red-300': errors.userId }"
            />
            <button
              type="button"
              @click="initiateUserIdCheck"
              :disabled="!form.userId || isCheckingUserId || userIdConfirmed"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <span v-if="isCheckingUserId">확인 중...</span>
              <span v-else-if="userIdConfirmed">완료</span>
              <span v-else>확인</span>
            </button>
          </div>
          <p v-if="errors.userId" class="mt-2 text-sm text-red-600">
            {{ errors.userId }}
          </p>
          <p v-if="userIdConfirmed" class="mt-2 text-sm text-green-600">
            사용할 수 있는 아이디 입니다.
          </p>
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >비밀번호</label
          >
          <div class="mt-1">
            <input
              v-model="form.password"
              type="password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.password }"
            />
            <p v-if="errors.password" class="mt-2 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <!-- Password Verification -->
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >비밀번호 확인</label
          >
          <div class="mt-1">
            <input
              v-model="form.passwordVerification"
              type="password"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.passwordVerification }"
            />
            <p
              v-if="form.password && form.passwordVerification"
              :class="passwordsMatch ? 'text-green-600' : 'text-red-600'"
              class="mt-2 text-sm"
            >
              {{
                passwordsMatch ? "비밀번호가 일치합니다!" : "비밀번호가 일치하지 않습니다"
              }}
            </p>
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700">이메일</label>
          <div class="mt-1">
            <input
              v-model="form.email"
              type="email"
              required
              class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              :class="{ 'border-red-300': errors.email }"
            />
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>
        </div>

        <!-- Phone Number -->
        <div>
          <label class="block text-sm font-medium text-gray-700"
            >전화 번호</label
          >
          <div class="mt-1 flex items-center space-x-2">
            <select
              v-model="form.phoneArea"
              class="block w-24 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            >
              <option value="010">010</option>
              <option value="011">011</option>
              <option value="016">016</option>
              <option value="017">017</option>
              <option value="018">018</option>
              <option value="019">019</option>
            </select>
            <span class="text-gray-500">-</span>
            <input
              v-model="form.phoneMiddle"
              type="text"
              maxlength="4"
              class="block w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @input="formatPhoneNumber('middle')"
            />
            <span class="text-gray-500">-</span>
            <input
              v-model="form.phoneLast"
              type="text"
              maxlength="4"
              class="block w-20 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              @input="formatPhoneNumber('last')"
            />
          </div>
          <p v-if="errors.phone" class="mt-2 text-sm text-red-600">
            {{ errors.phone }}
          </p>
        </div>

        <!-- Submit Button -->
        <div>
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
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
              계정 생성중...
            </template>
            <template v-else>계정 생성</template>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>

export default {
  name: "SignupForm",
  data() {
    return {
      form: {
        userId: "",
        email: "",
        password: "",
        passwordVerification: "",
        phoneArea: "010",
        phoneMiddle: "",
        phoneLast: "",
      },
      errors: {
        userId: "",
        email: "",
        password: "",
        passwordVerification: "",
        phone: "",
      },
      isLoading: false,
      isCheckingUserId: false,
      userIdAvailable: false,
      showModal: false,
      userIdConfirmed: false,
      notification: {
        show: false,
        type: "error",
        title: "",
        message: "",
        timeout: null,
      },
    };
  },
  computed: {
    passwordsMatch() {
      return (
        this.form.password &&
        this.form.passwordVerification &&
        this.form.password === this.form.passwordVerification
      );
    },
    isFormValid() {
      return (
        this.form.userId &&
        this.form.email &&
        this.form.password &&
        this.passwordsMatch &&
        this.form.phoneMiddle &&
        this.form.phoneLast &&
        this.userIdConfirmed &&
        !this.isCheckingUserId
      );
    },
  },
  methods: {
    initiateUserIdCheck() {
      if (!this.form.userId) return;

      this.isCheckingUserId = true;
      this.showModal = true;
      this.userIdAvailable = false;
      this.errors.userId = "";

      this.checkUserId();
    },
    async checkUserId() {
      try {
        const response = await this.$axios.post("/api/v1/users/signup/duplicate",
          {
            user_id: this.form.userId,
          }
        );

        const isDuplicate = response.data.data.duplicate;

        this.userIdAvailable = !isDuplicate;
        if (isDuplicate) {
          this.errors.userId = "중복된 아이디 입니다.";
        }
      } catch (error) {
        this.errors.userId = "사용할 수 없는 아이디 입니다.";
        this.userIdAvailable = false;
      } finally {
        this.isCheckingUserId = false;
      }
    },
    handleModalClose() {
      if (this.isCheckingUserId) return;

      this.showModal = false;
      if (this.userIdAvailable) {
        this.userIdConfirmed = true;
      }
    },
    formatPhoneNumber(field) {
      // Remove non-numeric characters
      if (field === "middle") {
        this.form.phoneMiddle = this.form.phoneMiddle.replace(/\D/g, "");
      } else if (field === "last") {
        this.form.phoneLast = this.form.phoneLast.replace(/\D/g, "");
      }
    },
    validateForm() {
      let isValid = true;
      this.errors = {
        userId: "",
        email: "",
        password: "",
        passwordVerification: "",
        phone: "",
      };

      // UserId validation
      if (!this.form.userId) {
        this.errors.userId = "아이디는 필수 입력 사항입니다.";
        isValid = false;
      }

      // Email validation
      if (!this.form.email) {
        this.errors.email = "Email is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(this.form.email)) {
        this.errors.email = "올바른 형식의 이메일 주소를 입력해 주십시오.";
        isValid = false;
      }

      // Password validation
      if (!this.form.password) {
        this.errors.password = "비밀번호는 필수 입력 사항입니다.";
        isValid = false;
      } else if (this.form.password.length < 6) {
        this.errors.password = "비밀번호는 최소 6자리 이상입니다.";
        isValid = false;
      }

      // Password verification
      if (!this.form.passwordVerification) {
        this.errors.passwordVerification = "비밀번호를 다시 확인해 주십시오.";
        isValid = false;
      } else if (!this.passwordsMatch) {
        this.errors.passwordVerification = "비밀번호가 일치하지 않습니다.";
        isValid = false;
      }

      // Phone validation
      if (!this.form.phoneMiddle || !this.form.phoneLast) {
        this.errors.phone = "빈칸을 모두 입력해 주십시오.";
        isValid = false;
      }

      return isValid;
    },
    showNotification(type, title, message, duration = 5000) {
      // Clear any existing timeout
      if (this.notification.timeout) {
        clearTimeout(this.notification.timeout);
      }

      // Show new notification
      this.notification = {
        show: true,
        type,
        title,
        message,
        timeout: null,
      };

      // Auto-hide after duration
      this.notification.timeout = setTimeout(() => {
        this.closeNotification();
      }, duration);
    },

    closeNotification() {
      this.notification.show = false;
      if (this.notification.timeout) {
        clearTimeout(this.notification.timeout);
      }
    },
    async handleSubmit() {
      if (!this.validateForm()) return;

      this.isLoading = true;

      try {
        //API call
        const response = await this.$axios.post("/api/v1/users/signup",
          {
            user_id: this.form.userId,
            user_password: this.form.password,
            user_email: this.form.email,
            user_phone:
              this.form.phoneArea + this.form.phoneMiddle + this.form.phoneLast,
          }
        );

        if (response.data.header.customStatusCode === "ACCOUNT-SIGNUP-201") {
          this.$router.push("/signup/success");
        } else {
          // Handle different error codes
          switch (response.data.header.customStatusCode) {
            case "ACCOUNT-VAL-400":
              this.showNotification(
                "error",
                "Validation Error",
                response.data.message || "입력한 정보를 다시 확인해 주십시오."
              );
              break;
            case "D-001":
              this.showNotification(
                "error",
                "Conflict",
                "이미 존재하는 아이디 입니다. 아이디 중복 검사를 다시 수행해 주십시오."
              );
              break;
            default:
              this.showNotification(
                "error",
                "Error",
                "알 수 없는 오류가 발생했습니다. 다시 시도해 주십시오."
              );
          }
        }
      } catch (error) {
        console.error("Signup error:", error);
      } finally {
        this.isLoading = false;
      }
    },
  },
  watch: {
    "form.userId"() {
      // Reset states when userId changes
      if (this.userIdConfirmed) {
        this.userIdConfirmed = false;
        this.userIdAvailable = false;
      }
    },
  },
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter,
.modal-leave-to {
  opacity: 0;
}
/* Add notification animations */
.notification-enter-active,
.notification-leave-active {
  transition: all 0.3s ease;
}

.notification-enter,
.notification-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>