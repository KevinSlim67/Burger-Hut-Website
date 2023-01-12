const list = document.querySelector('#faq-list');

const questions = [
    {
        question: `What are the hours of operation for Burger Hut?`,
        answer: `Burger Hut is open from 10:00 am to 11:00 pm every day.`
    },
    {
        question: `Does Burger Hut have any vegetarian options?`,
        answer: `Yes, Burger Hut offers a range of vegetarian options including a veggie burger and a grilled vegetable wrap.`
    },
    {
        question: `Does Burger Hut have a kids' menu?`,
        answer: `Yes, Burger Hut has a special kids' menu with smaller portions and kid-friendly options such as chicken nuggets and a mini burger.`
    },
    {
        question: `Does Burger Hut offer catering services?`,
        answer: `Yes, Burger Hut does offer catering services for events and parties. You can contact your local Burger Hut to place a catering order or visit our website for more information.`
    },
    {
        question: `Does Burger Hut have any deals or promotions?`,
        answer: `Yes, Burger Hut frequently offers promotions and deals such as discounted menu items, combo deals, and limited-time offers. You can check out the latest deals and promotions on our website or through the Burger Hut app.`
    },
    {
        question: `Does Burger Hut have a drive-thru?`,
        answer: `Most Burger Hut locations have a drive-thru option for customers who want to place an order and pick it up without leaving their car.`
    },
    {
        question: `Does Burger Hut offer delivery?`,
        answer: `Yes, Burger Hut offers delivery through our website and through third-party delivery services such as Grubhub and DoorDash.`
    },
    {
        question: `Can I customize my order at Burger Hut?`,
        answer: `Yes, Burger Hut allows you to customize your order by choosing from a variety of toppings, sauces, and sides. You can also request to have your burger or sandwich made "your way" by asking for specific ingredients to be added or left off.`
    },
    {
        question: `How do I apply for employment at Burger Hut?`,
        answer: `To apply for a job at Burger Hut, visit the Contact Us page, and use the contact form to send us your CV, and tell us about yourself.`
    },
];

questions.forEach((q) => {
    list.appendChild(createQuestion(q));
})

collapsiblesFunction();


function createQuestion(q) {
    const { question, answer } = q;
    const box = document.createElement('li');
    box.classList.add('question');
    box.innerHTML = `
    <button type="button" class="collapsible">${question}</button>
    <div class="content">
      <p>${answer}</p>
    </div>
    `;
    return box;
}

function collapsiblesFunction() {
    const collapsibles = document.getElementsByClassName("collapsible");
  
    for (let i = 0; i < collapsibles.length; i++) {
      collapsibles[i].addEventListener("click", function() {
        this.classList.toggle("active");
        const content = this.nextElementSibling;
        if (content.style.maxHeight) {
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = '8rem';
          animateCollapse(content);
        }
      });
    }
  }
  
  function animateCollapse(content) {
    const targetHeight = content.scrollHeight + "px";
    let currentHeight = "0px";
    let animationFrame;
  
    const step = () => {
      currentHeight = (currentHeight + (targetHeight - currentHeight) * 0.2) + "px";
      content.style.maxHeight = currentHeight;
  
      if (currentHeight !== targetHeight) {
        animationFrame = requestAnimationFrame(step);
      } else {
        cancelAnimationFrame(animationFrame);
      }
    };
  
    requestAnimationFrame(step);
  }
  

function sendEmail(e) {
    e.preventDefault();

    const email = document.contact.email.value;
    const messageType = document.contact.type.value;
    const message = document.contact.message.value;

    fetch(`${url}/email/send-to-company`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: email,
            username: sessionStorage.getItem('firstName'),
            emailType: messageType,
            message: message
        }),
    })
        .then((res) => res.json())
        .then((res) => {
            popup.setAttribute('status', 'success');
            popup.setAttribute('text', `Email successfully sent.`);
        })
        .catch((err) => {
            popup.setAttribute('status', 'error');
            popup.setAttribute('text', `Email could not be sent.`);
        });

    return false;
}