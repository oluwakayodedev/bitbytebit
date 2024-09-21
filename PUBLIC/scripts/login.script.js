document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const errorMessage = document.getElementById('error-message');

  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    window.location.href = '/publishBlog';
  }

  loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const response = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('authToken', data.token);
        window.location.href = '/publishBlog';
      } else {
        const errorData = await response.json();
        errorMessage.textContent = errorData.message || 'Login failed. Please try again.';
      }
    } catch (error) {
      errorMessage.textContent = 'An error occurred. Please try again later.';
    }
  });
});