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
      console.log(emails);
      console.log(emails.length);
      table = document.querySelector('#inbox_table');
      table.innerHTML = "<tr><th>ID</th><th>Sender</th><th>Subject</th><th>Body</th><th>Time</th></tr>";
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
          console.log(emails[i].id)
          tr = document.createElement("tr");
          tr.innerHTML = `<td> ${emails[i].id} </td><td> ${emails[i].sender} </td><td> ${emails[i].subject} </td><td> ${emails[i].body} </td><td> ${emails[i].timestamp} </td>`
          table.appendChild(tr);
        }
      }
      
      // ... do something else with emails ...
  });
  // if (mailbox == 'sent')
  // {
  //   fetch('/emails', {
  //     method: 'POST',
  //     body: JSON.stringify({
  //         recipients: 'ymmy@example.com',
  //         subject: 'Meeting hour',
  //         body: 'How about we meet tomorrow at 31pm?'
  //     })
  //   })
  //   .then(response => response.json())
  //   .then(result => {
  //       // Print result
  //       console.log(result);
  //   });
  // }
  
}