// File: js/contact.js

document.addEventListener('DOMContentLoaded', () => {
    // Find the form on the page
    const contactForm = document.getElementById('contact-form-mailto');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            // Prevent the form from submitting the traditional way
            event.preventDefault();

            // Get the values from the form fields
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const subject = document.getElementById('subject').value;
            const message = document.getElementById('message').value;

            // This is your email address
            const myEmail = 'jeffmartin.photos@gmail.com';

            // We'll pre-fill the body with the person's name and email for your convenience
            const emailBody = `
Name: ${name}
Email: ${email}
-----------------------------------

${message}
            `;

            // Use encodeURIComponent to make sure special characters in the subject/body work correctly
            const encodedSubject = encodeURIComponent(subject);
            const encodedBody = encodeURIComponent(emailBody);

            // Construct the mailto link
            const mailtoLink = `mailto:${myEmail}?subject=${encodedSubject}&body=${encodedBody}`;

            // Open the user's default email client
            window.location.href = mailtoLink;
        });
    }
});