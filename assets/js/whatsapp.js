document.addEventListener('DOMContentLoaded', () => {
    // WhatsApp Configuration
    const whatsappNumber = '918271631474'; // Format: CountryCode + Number

    // Handle Contact Form Redirection if it exists
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Collect form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone')?.value || 'Not provided';
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;

            // Construct WhatsApp message
            const text = `*New Order/Inquiry from Website*\n\n` +
                         `*Name:* ${name}\n` +
                         `*Email:* ${email}\n` +
                         `*Phone:* ${phone}\n` +
                         `*Interest:* ${service}\n` +
                         `*Message:* ${message}`;

            // Create WhatsApp URL
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;

            // Redirect to WhatsApp
            window.open(whatsappUrl, '_blank');
            
            // Optionally clear form
            contactForm.reset();
        });
    }

    // You can add more WhatsApp related logic here if needed
});
