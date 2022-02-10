//Get the scroll uparrow button:
mybutton = document.getElementById("myBtn");

// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    }
    else {
        mybutton.style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}




// contact form

// { <form
//     id="#contact"
//     onsubmit={(e) => {
//         e.preventDefault()
//         const form = e.currentTarget.id
//         return sendMail(form)
//     }}
// >
//     <Input
//         type="text"
//         name="sender"
//         label="Name"
//     />
//     <Input
//         type="email"
//         name="email"
//         label="Email"
//     />
//     <Input
//         type="text"
//         name="subject"
//         label="Subject"
//     />
//     <Textarea
//         label="Message"
//         name="message"
//     />
//     <input
//         type="hidden"
//         name="*honeypot"
//     />
//     <Button label="Submit" />
// </form>

// const sendMail = form => {
//     const mailForm = document.forms[form]
//     const sender = mailForm.elements["sender"].value.trim()
//     const email = mailForm.elements["email"].value.trim()
//     const subject = mailForm.elements["subject"].value.trim()
//     const message = mailForm.elements["message"].value.trim()
//     const trap = mailForm.elements["*honeypot"].value

//     const formData = {
//         sender,
//         email,
//         subject,
//         message
//     }

//     formData["*reply"] = "email"
//     formData["*subject"] = "Nouveau message depuis ton site"
//     formData["*default_email"] = process.env.ENFORMED_SEND_MAIL_TO

//     if (
//         process.env.NODE_ENV === "production" &&
//         trap === "" &&
//         mailForm.checkValidity() &&
//         sender !== "" &&
//         email !== "" &&
//         subject !== null &&
//         message !== null
//     ) {
//         fetch(`https://www.enformed.io/${process.env.ENFORMED_KEY}/`,
//         {
//             method: "POST",
//             headers:
//             {
//                 "Content-Type": "application/json",
//                 Accept: "application/json",
//             },
//             body: JSON.stringify(formData),
//         })
//             .then((response) => response.json())
//             .then((data) =>
//             {
//                 mailForm.elements["sender"].value = ""
//                 mailForm.elements["email"].value = ""
//                 mailForm.elements["subject"].value = ""
//                 mailForm.elements["message"].value = ""
//             })
//             .catch((err) => console.log(err))
//     }
// }
// }

