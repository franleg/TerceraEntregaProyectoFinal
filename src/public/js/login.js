const form = document.getElementById('loginForm');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const obj = {};
    data.forEach((value, key) => obj[key] = value);
    fetch('/api/sessions/login', {
        method: "POST",
        body: JSON.stringify(obj),
        headers: {
            "Content-Type": "application/json"
        }
    }).then(resp => resp.json())
        .then(data => {
            if (data.status === "success") window.location.assign('/');
            else window.location.assign('/loginfail');
        })
})