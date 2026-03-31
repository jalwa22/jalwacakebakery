document.addEventListener('DOMContentLoaded', () => {
    // 1. Get Product ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Use window.PRODUCTS as fallback if PRODUCTS is not directly accessible
    const productsData = window.PRODUCTS || (typeof PRODUCTS !== 'undefined' ? PRODUCTS : null);

    if (!productId || !productsData || !productsData[productId]) {
        console.error('Product not found or Data missing. ID:', productId);
        // Show error message instead of immediate redirect
        const container = document.querySelector('.details-sheet');
        if (container) {
            container.innerHTML = `
                <div style="text-align:center; padding: 50px 20px;">
                    <h2>Product Not Found</h2>
                    <p style="color:rgba(255,255,255,0.6); margin:10px 0 25px;">The item you requested is at a different party!</p>
                    <a href="index.html" class="primary-btn" style="display:inline-flex; width:auto; padding:12px 30px;">Go Back Home</a>
                </div>`;
        }
        return;
    }

    const product = productsData[productId];

    // 2. Update Page Content
    document.title = `${product.name} - Jalwa Cake Bakery`;
    
    // Core Elements
    const nameEl = document.getElementById('product-name');
    const imgEl = document.getElementById('product-image');
    const priceEl = document.getElementById('product-price');
    const bottomPriceEl = document.getElementById('bottom-price');
    const originalPriceEl = document.getElementById('product-original-price');
    const discountEl = document.getElementById('product-discount');
    const ratingEl = document.getElementById('product-rating-value');
    const reviewsEl = document.getElementById('product-reviews');
    const descEl = document.getElementById('product-description');
    const deliveryBadge = document.getElementById('product-delivery-badge');

    // Populate
    if (nameEl) nameEl.textContent = product.name;
    if (imgEl) {
        imgEl.src = product.image;
        imgEl.alt = product.name;
    }
    if (priceEl) priceEl.textContent = `₹${product.price}`;
    if (bottomPriceEl) bottomPriceEl.textContent = `₹${product.price}`;
    if (originalPriceEl) originalPriceEl.textContent = `₹${product.originalPrice}`;
    if (discountEl) discountEl.textContent = product.discount;
    if (ratingEl) ratingEl.textContent = product.rating;
    if (reviewsEl) reviewsEl.textContent = `${product.reviews} reviews`;
    if (descEl) descEl.textContent = product.description;
    
    // Delivery Info Update
    if (deliveryBadge) {
        deliveryBadge.textContent = product.deliveryInfo || "Today Delivery";
    }

    // Veg/Non-Veg Badge
    const vegBadge = document.getElementById('product-veg-icon');
    if (vegBadge) {
        vegBadge.style.display = product.veg ? 'block' : 'none';
        // Non-veg could have a red theme if we wanted
    }

    // Features List (Highlights)
    const featuresList = document.getElementById('product-features');
    if (featuresList) {
        featuresList.innerHTML = '';
        (product.features || []).forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
            featuresList.appendChild(li);
        });
    }

    // 3. Update WhatsApp Link
    const whatsappBtn = document.getElementById('whatsapp-order-btn');
    if (whatsappBtn) {
        const message = `Hi Jalwa Cake Bakery! I want to order:\n\n*Product:* ${product.name}\n*Price:* ₹${product.price}\n*Link:* ${window.location.href}`;
        const encodedMessage = encodeURIComponent(message);
        whatsappBtn.href = `https://wa.me/918271631474?text=${encodedMessage}`;
    }

    // 4. Scroll listener for "Sheet Handle" or Header effects
    const sheet = document.querySelector('.details-sheet');
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const heroHeight = document.querySelector('.hero-image-container').offsetHeight;
        
        // Example: Change header opacity or scale image
        if (scrolled < heroHeight) {
            document.querySelector('.hero-image-container img').style.transform = `scale(${1 + (scrolled/2000)})`;
        }
    });

    // 5. Native Share API (Defined in HTML, reinforcing here if needed)
});
