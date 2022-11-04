const cardsContainer = document.getElementById("cards-container");

cardsContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('add_cart')){
       let id = e.target.id;
       let product = {
            id: id,
       };
       fetch('/api/carts', {
        method: "POST",
        body: JSON.stringify(product),
        headers: {
            "Content-Type": "application/json"
        }
        }).then(resp => resp.json())
            .then(data => console.log(data))
    }
})


  