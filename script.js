const products = [
  { id: 'phone', name: 'iPhone 16 Pro Max', price: 1200, image: 'images/product-1.png' },
  { id: 'adapter', name: 'Apple 30W USB-C Power Adapter', price: 40, image: 'images/product-2.png' },
  { id: 'charger', name: 'Apple MagSafe Charger, 2 m', price: 50, image: 'images/product-3.png' },
  { id: 'airpods', name: 'AirPods 4', price: 130, image: 'images/product-4.png' },
  { id: 'watch', name: 'Apple Watch Series 10', price: 399, image: 'images/product-5.png' },
  { id: 'macbook', name: 'MacBook Pro 16 inch M4', price: 2849, image: 'images/product-6.png' },
];

const MAX_QUANTITY_PER_PRODUCT = 5;
let cart = {};

function initializeProductSelection() {
  const productList = document.getElementById('product-list');
  products.forEach((product) => {
    const productHTML = `
      <div class="bg-white rounded-xl shadow-lg overflow-hidden">
        <img src="${product.image}" alt="${product.name}" class="w-full h-48 object-cover">
        <div class="p-6">
          <h5 class="text-lg font-semibold text-gray-800">${product.name}</h5>
          <p class="text-sm text-gray-500">$${product.price}</p>
          <button id="add-${product.id}" class="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
            Add to Cart
          </button>
        </div>
      </div>
    `;
    productList.innerHTML += productHTML;
  });

  products.forEach((product) => {
    document.getElementById(`add-${product.id}`).addEventListener('click', () => {
      addToCart(product);
    });
  });
}

function addToCart(product) {
  if (cart[product.id]) {
    if (cart[product.id].quantity >= MAX_QUANTITY_PER_PRODUCT) {
      alert(`You can only add a maximum of ${MAX_QUANTITY_PER_PRODUCT} units of ${product.name} to the cart.`);
      return;
    }
    cart[product.id].quantity += 1;
  } else {
    cart[product.id] = { ...product, quantity: 1 };
  }

  updateCartUI();
}

function updateCartUI() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';

  Object.values(cart).forEach((product) => {
    const productHTML = `
      <div class="p-6 border-b border-gray-200 hover:bg-gray-50 transition-colors duration-200">
        <div class="flex flex-col md:flex-row items-center justify-between">
          <div class="flex items-center space-x-6">
            <img src="${product.image}" alt="${product.name}" class="w-20 h-20 object-cover rounded-lg">
            <div>
              <h5 class="text-lg font-semibold text-gray-800">${product.name}</h5>
              <p class="text-sm text-gray-500">$${product.price}</p>
            </div>
          </div>
          <div class="flex items-center space-x-6 mt-4 md:mt-0">
            <div class="flex items-center bg-gray-100 rounded-lg p-2">
              <button id="${product.id}-minus" class="text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-colors duration-200">
                <i class="fas fa-minus"></i>
              </button>
              <input id="${product.id}-number" type="number" min="0" max="${MAX_QUANTITY_PER_PRODUCT}" class="w-16 text-center bg-transparent text-gray-800 font-semibold" value="${product.quantity}">
              <button id="${product.id}-plus" class="text-gray-600 hover:text-gray-900 p-2 rounded-lg transition-colors duration-200">
                <i class="fas fa-plus"></i>
              </button>
            </div>
            <h5 class="text-lg font-semibold text-gray-800">$<span id="${product.id}-total">${(product.quantity * product.price).toFixed(2)}</span></h5>
            <button id="remove-${product.id}" class="text-gray-400 hover:text-red-500 transition-colors duration-200">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    cartItems.innerHTML += productHTML;
  });

  if (cartItems.classList.contains('hidden')) {
    cartItems.classList.remove('hidden');
  }

  calculateTotal();

  Object.values(cart).forEach((product) => {
    document.getElementById(`${product.id}-plus`).addEventListener('click', () => {
      updateProductQuantity(product.id, 1);
    });
    document.getElementById(`${product.id}-minus`).addEventListener('click', () => {
      updateProductQuantity(product.id, -1);
    });
    document.getElementById(`remove-${product.id}`).addEventListener('click', () => {
      removeProduct(product.id);
    });
  });

  scrollToCart();
}

function updateProductQuantity(productId, change) {
  const product = cart[productId];
  if (!product) return;

  const newQuantity = product.quantity + change;

  if (newQuantity < 1) {
    removeProduct(productId);
  } else if (newQuantity > MAX_QUANTITY_PER_PRODUCT) {
    alert(`You can only add a maximum of ${MAX_QUANTITY_PER_PRODUCT} units of ${product.name} to the cart.`);
  } else {
    product.quantity = newQuantity;
    updateCartUI();
  }
}

function removeProduct(productId) {
  delete cart[productId];
  updateCartUI();
}

function getTotalProductsInCart() {
  return Object.values(cart).reduce((total, product) => total + product.quantity, 0);
}

function calculateTotal() {
  let subTotal = Object.values(cart).reduce((total, product) => total + product.quantity * product.price, 0);
  const tax = subTotal * 0.1;
  const totalPrice = subTotal + tax;

  document.getElementById('sub-total').innerText = subTotal.toFixed(2);
  document.getElementById('tax-amount').innerText = tax.toFixed(2);
  document.getElementById('total-price').innerText = totalPrice.toFixed(2);
}

function scrollToCart() {
  const cartSection = document.querySelector('#cart-items').closest('section');
  cartSection.scrollIntoView({ behavior: 'smooth' });
}

document.getElementById('send-message').addEventListener('click', () => {
  if (getTotalProductsInCart() === 0) {
    alert('Your cart is empty. Please add products before sending a message.');
    return;
  }

  let message = 'Purchase Details:\n';
  Object.values(cart).forEach((product) => {
    message += `${product.name} x ${product.quantity} = $${(product.quantity * product.price).toFixed(2)}\n`;
  });
  message += `Subtotal: $${document.getElementById('sub-total').innerText}\n`;
  message += `Tax: $${document.getElementById('tax-amount').innerText}\n`;
  message += `Total: $${document.getElementById('total-price').innerText}`;

  alert(message);
});

document.addEventListener('DOMContentLoaded', () => {
  initializeProductSelection();
});