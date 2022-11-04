const socket = io();

let formAdd = document.getElementById('form-addProduct');
let formDelete = document.getElementById('form-deleteProduct');
let inputDelete = document.getElementById('input-deleteProduct');
let formUpdate = document.getElementById("form-updateProduct");
let inputUpdate = document.getElementById("input-updateProduct");
let formGetProduct = document.getElementById("form-getProduct");
let inputGetProduct = document.getElementById("input-getProduct");
let listProducts = document.getElementById('list-products');
let listContainer = document.getElementById('list-container');

// ADD NEW PRODUCT
formAdd.addEventListener('submit', (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    fetch('/api/products', { 
        method: 'POST',
        body: formData
    }).then(res => res.json())
        .then(json => {
            if (!json.error) socket.emit('client: add product', json)
            else {
                let messageError = document.createElement('div');
                messageError.innerHTML = `<p style="color:red">${json.error}</p>`
                formAdd.appendChild(messageError);
            }
        })
});

socket.on('server: new product', data => {
    if (!listProducts) {
        listContainer.innerHTML = `<div id="table-container" class="table-container">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Nombre</th>
                                                    <th>Precio</th>
                                                    <th>Foto</th>
                                                </tr>
                                            </thead>
                                            <tbody id="list-products">
                                                <td>${data.name}</td>
                                                <td>$${data.price}</td>
                                                <td><img src="../img/${data.thumbnail}" class="img-fluid img-product" alt="imagen"></td>
                                            </tbody>
                                        </table>
                                    </div>`      
    }else {
        let newProduct = document.createElement('tr');
        newProduct.innerHTML = `<td>${data.name}</td>
                                <td>$${data.price}</td>
                                <td><img src="../img/${data.thumbnail}" class="img-fluid img-product" alt="imagen"></td>`
        listProducts.appendChild(newProduct)  
    }                      
})

// DELETE PRODUCT BY ID
formDelete.addEventListener('submit', (e) => {
    e.preventDefault();
    let id = inputDelete.value;
    fetch (`/api/products/${id}`, {
        method: 'DELETE'
    }).then(res => res.json())
        .then (json => {
            if (!json.error) socket.emit('client: delete product', json)
            else {
                let messageError = document.createElement('div');
                messageError.innerHTML = `<p style="color:red">${json.error}</p>`
                formDelete.appendChild(messageError);
            }
        })
    inputDelete.value = "";
});

socket.on('server: products', data => {
    let listProducts = document.getElementById('list-products');
    listProducts.innerHTML = "";
    let products = "";
    data.forEach(product => {
        products += `<tr>
                        <td>${product.name}</td>
                        <td>$${product.price}</td>
                        <td><img src="../img/${product.thumbnail}" class="img-fluid img-product" alt="imagen"></td>
                    </tr>`
    }) 
    listProducts.innerHTML = products;  
    if (data.length === 0){
        listContainer.innerHTML = "<p>No hay productos disponibles</p>"
    }
})

// UPDATE PRODUCT BY ID
formUpdate.addEventListener('submit', (e) => {
    e.preventDefault();
    let id = inputUpdate.value;
    let formData = new FormData(e.target);
    fetch(`/api/products/${id}`, { 
        method: 'PUT',
        body: formData
    }).then(res => res.json())
        .then(json => {
            if (!json.error) socket.emit('client: update product', json)
            else {
                let messageError = document.createElement('div');
                messageError.innerHTML = `<p style="color:red">${json.error}</p>`
                formUpdate.appendChild(messageError);
            }
        })
});

socket.on('server: productsUpdated', data => {
    listProducts.innerHTML = "";
    let products = "";
    data.forEach(product => {
        products += `<tr>
                        <td>${product.name}</td>
                        <td>$${product.price}</td>
                        <td><img src="../img/${product.thumbnail}" class="img-fluid img-product" alt="imagen"></td>
                    </tr>`
    }) 
    listProducts.innerHTML = products;
})

// GET PRODUCT BY ID
formGetProduct.addEventListener('submit', (e) => {
    e.preventDefault();
    let id = inputGetProduct.value;
    fetch(`/api/products/${id}`, { 
        method: 'GET',
    }).then(res => res.json())
        .then(json => {
            if (!json.error) socket.emit('client: get product', json)
            else {
                let messageError = document.createElement('div');
                messageError.innerHTML = `<p style="color:red">${json.error}</p>`
                formGetProduct.appendChild(messageError);
            }
        })
});

socket.on('server: product', data => {
    let product = document.createElement('div');
    product.className = "product-table"
    product.innerHTML = `<div id="table-container" class="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nombre</th>
                                        <th>Descripción</th>
                                        <th>Stock</th>
                                        <th>Precio</th>
                                        <th>Foto</th>
                                    </tr>
                                </thead>
                                <tbody id="list-products">
                                        <tr>
                                            <td>${data.name}</td>
                                            <td>${data.description}</td>
                                            <td>${data.stock}</td>
                                            <td>$${data.price}</td>
                                            <td><img src="../img/${data.thumbnail}" class="img-fluid img-product" alt="imagen"></td>
                                        </tr>
                                </tbody>
                            </table>
                        </div>`
    formGetProduct.appendChild(product);
})