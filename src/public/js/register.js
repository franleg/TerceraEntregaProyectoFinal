const form = document.getElementById('registerForm');

form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    fetch('/api/sessions/register', {
        method: "POST",
        body: formData,
    }).then(resp => resp.json())
        .then(data => {
            console.log(data)
            if (data.status === "success") window.location.assign('/login');
            else window.location.assign('/registerfail');
        })
})