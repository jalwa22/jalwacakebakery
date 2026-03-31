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

    // 3. Checkout Flow Logic
    const buyNowBtn = document.getElementById('buy-now-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = document.getElementById('close-checkout-modal');
    
    const qrModal = document.getElementById('qr-modal');
    const closeQrBtn = document.getElementById('close-qr-modal');
    const qrAmountDisplay = document.getElementById('qr-amount-display');
    
    const optionOnlinePay = document.getElementById('option-online-pay');
    const optionCod = document.getElementById('option-cod');
    const paidConfirmBtn = document.getElementById('paid-confirm-btn');

    // Phone number for WhatsApp
    const whatsappNum = '918271631474';

    // Helper to open a modal with fade & slide
    const openModal = (modal) => {
        modal.style.display = 'flex';
        // Small delay to allow display flex to apply before animating opacity/transform
        setTimeout(() => {
            modal.style.opacity = '1';
            const content = modal.querySelector('.modal-content');
            if (content) {
                content.style.transform = modal.id === 'qr-modal' ? 'scale(1)' : 'translateY(0)';
            }
        }, 10);
    };

    // Helper to close a modal with fade & slide
    const closeModal = (modal) => {
        modal.style.opacity = '0';
        const content = modal.querySelector('.modal-content');
        if (content) {
            content.style.transform = modal.id === 'qr-modal' ? 'scale(0.9)' : 'translateY(100%)';
        }
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Matches CSS transition duration
    };

    // Helper to send WhatsApp message
    const proceedToWhatsApp = (paymentMethod) => {
        let paymentText = paymentMethod === 'PREPAID' ? '✅ *Payment: Done Online via UPI*\n(Payment Screenshot uploaded on website)' : '💵 *Payment: Cash on Delivery*';
        
        const message = `Hi Jalwa Cake Bakery! I want to place an order:\n\n` +
                        `*Product:* ${product.name}\n` +
                        `*Price:* ₹${product.price}\n` +
                        `${paymentText}\n\n` +
                        `*Link:* ${window.location.href}`;
                        
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${whatsappNum}?text=${encodedMessage}`, '_blank');
        
        // Close modals after redirecting
        closeModal(qrModal);
        closeModal(checkoutModal);
    };

    // Event Listeners for Modals & Options
    if (buyNowBtn && checkoutModal) {
        buyNowBtn.addEventListener('click', () => openModal(checkoutModal));
    }
    
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', () => closeModal(checkoutModal));
    if (closeQrBtn) closeQrBtn.addEventListener('click', () => closeModal(qrModal));
    
    // Close modal when clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === checkoutModal) closeModal(checkoutModal);
        if (e.target === qrModal) closeModal(qrModal);
    });

    // Select Online Payment
    if (optionOnlinePay && qrModal) {
        optionOnlinePay.addEventListener('click', () => {
            closeModal(checkoutModal);
            if (qrAmountDisplay) qrAmountDisplay.textContent = `₹${product.price}`;
            
            // Wait slightly before opening next modal for smooth transition
            setTimeout(() => openModal(qrModal), 300);
        });
    }

    // Select Cash on Delivery
    if (optionCod) {
        optionCod.addEventListener('click', () => {
            proceedToWhatsApp('COD');
        });
    }

    // I Have Paid Button (Form Submit Logic)
    const paymentForm = document.getElementById('payment-form');
    const screenshotInput = document.getElementById('payment-screenshot');
    
    if (screenshotInput && paidConfirmBtn) {
        screenshotInput.addEventListener('change', function() {
            if (this.files && this.files.length > 0) {
                paidConfirmBtn.disabled = false;
                paidConfirmBtn.style.opacity = '1';
                paidConfirmBtn.style.cursor = 'pointer';
            } else {
                paidConfirmBtn.disabled = true;
                paidConfirmBtn.style.opacity = '0.6';
                paidConfirmBtn.style.cursor = 'not-allowed';
            }
        });
    }

    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Set hidden field values
            document.getElementById('form-product-name').value = product.name;
            document.getElementById('form-product-price').value = product.price;
            
            // Visual loading state
            const originalText = paidConfirmBtn.innerHTML;
            paidConfirmBtn.disabled = true;
            paidConfirmBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
            
            const formData = new FormData(paymentForm);
            
            fetch("/", {
                method: "POST",
                body: formData
            })
            .then(() => {
                alert("Screenshot uploaded successfully! Redirecting to WhatsApp to confirm order...");
                paidConfirmBtn.innerHTML = originalText;
                proceedToWhatsApp('PREPAID');
            })
            .catch(error => {
                console.error("Submission error:", error);
                // Fallback: Proceed anyway since WhatsApp is the main channel
                alert("Redirecting to WhatsApp to confirm order...");
                paidConfirmBtn.innerHTML = originalText;
                proceedToWhatsApp('PREPAID');
            });
        });
    } else if (paidConfirmBtn) {
        // Fallback if form not found
        paidConfirmBtn.addEventListener('click', () => {
            proceedToWhatsApp('PREPAID');
        });
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
