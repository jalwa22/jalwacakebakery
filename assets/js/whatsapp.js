document.addEventListener('DOMContentLoaded', () => {
    // WhatsApp Configuration
    const whatsappNumber = '918271631474'; // Format: CountryCode + Number

    // Handle Contact Form Submission to Netlify & WhatsApp
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            
            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerText = 'Sending...';

            // Collect form data for Netlify
            const formData = new FormData(contactForm);

            // 1. Submit to Netlify via AJX/Fetch
            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            })
            .then(() => {
                // 2. Clear loading state
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;

                // 3. Prepare data for WhatsApp redirection
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const phone = document.getElementById('phone')?.value || 'Not provided';
                const service = document.getElementById('service').value;
                const message = document.getElementById('message').value;

                const text = `*New Order/Inquiry from Website*\n\n` +
                             `*Name:* ${name}\n` +
                             `*Email:* ${email}\n` +
                             `*Phone:* ${phone}\n` +
                             `*Interest:* ${service}\n` +
                             `*Message:* ${message}`;

                // 4. Redirect to WhatsApp
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
                window.open(whatsappUrl, '_blank');
                
                // 5. Reset form
                contactForm.reset();
                alert('Thank you! Your message has been sent to our email and WhatsApp.');
            })
            .catch((error) => {
                console.error('Form submission error:', error);
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
                alert('Sorry, there was an error sending your message. Please try again or contact us directly on WhatsApp.');
            });
        });
    }
});
