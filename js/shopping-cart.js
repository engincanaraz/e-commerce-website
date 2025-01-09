const cart = {
    items: [],
    total: 0   
};

document.addEventListener('DOMContentLoaded', () => {
    loadCart();
    updateCartUI();
});

function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        Object.assign(cart, JSON.parse(savedCart));
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(productId, name, price, image) {
    const existingItem = cart.items.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({
            productId,
            name,
            price,
            image,
            quantity: 1
        });
    }
    
    updateCartTotal();
    saveCart();
    updateCartUI();
    showNotification('Ürün sepete eklendi');
}

function removeFromCart(productId) {
    cart.items = cart.items.filter(item => item.productId !== productId);
    updateCartTotal();
    saveCart();
    updateCartUI();
    showNotification('Ürün sepetten çıkarıldı');
}

function updateQuantity(productId, quantity) {
    const item = cart.items.find(item => item.productId === productId);
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartTotal();
            saveCart();
            updateCartUI();
        }
    }
}

function updateCartTotal() {
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function updateCartUI() {
    const cartBadge = document.querySelector('.badge-color');
    if (cartBadge) {
        cartBadge.textContent = cart.items.reduce((total, item) => total + item.quantity, 0);
    }

    const cartList = document.querySelector('.shopping-cart');
    if (cartList) {
        renderCartItems(cartList);
        updateCartSummary();
    }
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'alert alert-success notification';
    notification.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 1000;';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2000);
}

function updateCartSummary() {
    const subtotalElement = document.querySelector('[data-summary="subtotal"]');
    const taxElement = document.querySelector('[data-summary="tax"]');
    const totalElement = document.querySelector('[data-summary="total"]');
    
    if (subtotalElement && taxElement && totalElement) {
        const subtotal = cart.total;
        const tax = subtotal * 0.20;
        
        subtotalElement.textContent = `${subtotal.toFixed(2)} TL`;
        taxElement.textContent = `${tax.toFixed(2)} TL (Dahil)`;
        totalElement.textContent = `${subtotal.toFixed(2)} TL`;
    }
}

function renderCartItems(cartList) {
    cartList.innerHTML = cart.items.map(item => `
        <li class="py-3 mb-2 border-top list-group-item">
            <div class="row g-2 align-items-center">
                <div class="col-12 col-md-8">
                    <div class="d-flex align-items-center">
                        <img src="${item.image}" class="cart-img me-3" alt="${item.name}" style="width: 80px; height: 80px; object-fit: cover;">
                        <div class="flex-grow-1">
                            <h6 class="mb-1 text-break">${item.name}</h6>
                            <div class="text-muted mb-2">Birim Fiyat: ${item.price.toFixed(2)} TL</div>
                            <a href="#" onclick="removeFromCart('${item.productId}'); return false;" 
                               class="text-danger d-inline-block">
                                <i class="fa-solid fa-trash-can"></i> Sil
                            </a>
                        </div>
                    </div>
                </div>
                <div class="col-6 col-md-2">
                    <label class="d-block d-md-none small mb-1">Adet:</label>
                    <select class="form-select form-select-sm" onchange="updateQuantity('${item.productId}', this.value)">
                        ${[1,2,3,4,5].map(num => 
                            `<option value="${num}" ${item.quantity === num ? 'selected' : ''}>${num}</option>`
                        ).join('')}
                    </select>
                </div>
                <div class="col-6 col-md-2 text-end">
                    <label class="d-block d-md-none small mb-1">Toplam:</label>
                    <span class="fw-bold">${(item.price * item.quantity).toFixed(2)} TL</span>
                </div>
            </div>
        </li>
    `).join('');
} 