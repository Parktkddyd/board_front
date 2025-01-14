<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gray-900">Welcome back</h1>
        <p class="text-gray-600 mt-2">Please sign in to your account</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Email Input -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">
            Email address
          </label>
          <div class="mt-1">
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              :class="[
                'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                errors.email ? 'border-red-300' : 'border-gray-300'
              ]"
            />
            <p v-if="errors.email" class="mt-2 text-sm text-red-600">
              {{ errors.email }}
            </p>
          </div>
        </div>

        <!-- Password Input -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">
            Password
          </label>
          <div class="mt-1 relative">
            <input
              id="password"
              v-model="form.password"
              :type="showPassword ? 'text' : 'password'"
              required
              :class="[
                'appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm',
                errors.password ? 'border-red-300' : 'border-gray-300'
              ]"
            />
            <button
              type="button"
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <span v-if="showPassword" class="text-gray-500">Hide</span>
              <span v-else class="text-gray-500">Show</span>
            </button>
            <p v-if="errors.password" class="mt-2 text-sm text-red-600">
              {{ errors.password }}
            </p>
          </div>
        </div>

        <!-- Remember Me & Forgot Password -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.rememberMe"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Remember me
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
              Forgot your password?
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
              Signing in...
            </template>
            <template v-else>Sign in</template>
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
        Not a member?
        <a href="#" class="font-medium text-blue-600 hover:text-blue-500">
          Start a 14 day free trial
        </a>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPage',
  data() {
    return {
      form: {
        email: '',
        password: '',
        rememberMe: false
      },
      errors: {
        email: '',
        password: ''
      },
      globalError: '',
      isLoading: false,
      showPassword: false
    }
  },
  methods: {
    validateForm() {
      let isValid = true
      this.errors.email = ''
      this.errors.password = ''
      this.globalError = ''

      // Email validation
      if (!this.form.email) {
        this.errors.email = 'Email is required'
        isValid = false
      } else if (!/\S+@\S+\.\S+/.test(this.form.email)) {
        this.errors.email = 'Please enter a valid email address'
        isValid = false
      }

      // Password validation
      if (!this.form.password) {
        this.errors.password = 'Password is required'
        isValid = false
      } else if (this.form.password.length < 6) {
        this.errors.password = 'Password must be at least 6 characters'
        isValid = false
      }

      return isValid
    },
    async handleSubmit() {
      if (!this.validateForm()) return

      this.isLoading = true
      this.globalError = ''

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        // Here you would typically make your actual API call
        // const response = await this.$http.post('/api/login', this.form)
        
        // For demo purposes, we'll just log the form data
        console.log('Form submitted:', this.form)
        
        // Redirect or handle successful login
        this.$emit('login-success')
      } catch (error) {
        this.globalError = 'Invalid email or password. Please try again.'
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style scoped>
/* Add any additional custom styles here */
</style>