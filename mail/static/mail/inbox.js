document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';

  document.querySelector('#compose-form').onsubmit = (e) => { 

    e.preventDefault();
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
          recipients: document.querySelector('#compose-recipients').value,
          subject: document.querySelector('#compose-subject').value,
          body: document.querySelector('#compose-body').value
      })
    })
    .then(response => response.json())
    .then(result => {
        // Print result
        alert(result.message)
        load_mailbox('inbox')
    });
  }
}


function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').innerHTML = `
  <div id="emails-title"></div>
  <div id="main">
      <table id="inbox_table">
      </table>
  </div>`;
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

  // Show the mailbox name
  document.querySelector('#emails-title').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      table = document.querySelector('#inbox_table');
      table.innerHTML = "<tr><th>ID</th><th>Sender</th><th>Subject</th><th>Body</th><th>Time</th></tr>";
      if(mailbox == "sent")
      {
        table.innerHTML = "<tr><th>ID</th><th>Recipients</th><th>Subject</th><th>Body</th><th>Time</th></tr>";
      }
      if (emails.length == 0)
      {
        table = document.querySelector('#emails-view');
        p = document.createElement("p");
        p.innerHTML = "Inbox is Empty"
        table.appendChild(p);
      }
      else
      {
        for (i = 0; i < emails.length; i++)
        {
          tr = document.createElement("tr");
          tr.setAttribute('data-page', emails[i].id);
          tr.setAttribute('class', 'email-link');
          tr.addEventListener('click', function() {
            fetch(`/emails/${this.dataset.page}`)
              .then(response => response.json())
              .then(email => {
                var main = document.querySelector('#emails-view')
                main.innerHTML = `
                <div>
                    <h4 class="email-title">${email.subject}</h4>
                    <p class="email-from">From: ${email.sender}</p>
                    <p class="email-from">To: ${email.recipients}</p>
                    <p class="email-time">${email.timestamp}</p>
                    <p class="email-body">${email.body}</p>
                </div>
                `
              });
          });
          if(mailbox == "sent")
          {
            tr.innerHTML = `<td> ${emails[i].id} </td><td> ${emails[i].recipients} </td><td> ${emails[i].subject} </td><td> ${emails[i].body} </td><td> ${emails[i].timestamp} </td>`
          }
          else
          {
            tr.innerHTML = `<td> ${emails[i].id} </td><td> ${emails[i].sender} </td><td> ${emails[i].subject} </td><td> ${emails[i].body} </td><td> ${emails[i].timestamp} </td>`
          }
          table.appendChild(tr);
        }
      }
  });
}