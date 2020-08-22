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
      // Creating Table of email list
      table = document.querySelector('#inbox_table');
      table.innerHTML = "<tr><th></th><th>Sender</th><th>Subject</th><th>Body</th><th>Time</th><th>∞</th></tr>";
      if(mailbox == "sent")
      {
        table.innerHTML = "<tr><th></th><th>Recipients</th><th>Subject</th><th>Body</th><th>Time</th><th>∞</th></tr>";
      }
      if (emails.length == 0)
      {
        // Empty Inbox
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
          // tr.setAttribute('class', 'email-link');
          button = document.createElement("button");
          button.setAttribute('class', 'btn btn-primary');
          button.setAttribute('id', 'reply');
          button.innerHTML="Reply"
          
          if(mailbox == "sent")
          {
            tr.innerHTML = `<td data-page="${emails[i].id}"class="email-link">  </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].recipients} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].subject} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].body} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].timestamp} </td><td data-page="${emails[i].id}"class="archive_bin"> <i class="fa fa-trash" aria-hidden="true"></i> </td>`
          }
          if(mailbox == "archive")
          {
            if(emails[i].read)
            {
              tr.innerHTML = `<td data-page="${emails[i].id}"class="email-link">  </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].sender} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].subject} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].body} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].timestamp} </td><td data-page="${emails[i].id}"class="unarchive_bin"> <i class="fa fa-trash-o" aria-hidden="true"></i> </td>`
            }
            else
            {
              tr.setAttribute('class', 'unread');
              tr.innerHTML = `<td data-page="${emails[i].id}"class="email-link"> <i class="fa fa-circle" aria-hidden="true"></i> </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].sender} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].subject} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].body} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].timestamp} </td><td data-page="${emails[i].id}"class="unarchive_bin"> <i class="fa fa-trash-o" aria-hidden="true"></i> </td>`              
            }
          }
          else
          {
            if(emails[i].read)
            {
              tr.innerHTML = `<td data-page="${emails[i].id}"class="email-link">  </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].sender} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].subject} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].body} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].timestamp} </td><td data-page="${emails[i].id}"class="archive_bin"> <i class="fa fa-trash" aria-hidden="true"></i> </td>`
            }
            else
            {
              tr.setAttribute('class', 'unread');
              tr.innerHTML = `<td data-page="${emails[i].id}"class="email-link"> <i class="fa fa-circle" aria-hidden="true"></i> </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].sender} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].subject} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].body} </td><td data-page="${emails[i].id}"class="email-link"> ${emails[i].timestamp} </td><td data-page="${emails[i].id}"class="archive_bin"> <i class="fa fa-trash" aria-hidden="true"></i> </td>`
            }
            
          }
          table.appendChild(tr);
          // Clicking Archiving Bin
          document.querySelectorAll('.archive_bin').forEach(link => {
            link.onclick = () => {
              console.log("clicked Archived " + link.dataset.page)
              fetch(`/emails/${link.dataset.page}`, {
                //Marking email archive
                method: 'PUT',
                body: JSON.stringify
                ({
                    archived: true
                })
              })
              // Giving some time to mark it unread before returning to main page
              setTimeout(function(){ 

                load_mailbox('inbox')
            }, 50);
              };
            });

            // Clicking Unarchiving Bin
          document.querySelectorAll('.unarchive_bin').forEach(link => {
            link.onclick = () => {
              console.log("clicked Unarchived " + link.dataset.page)
              fetch(`/emails/${link.dataset.page}`, {
                //Marking email archive
                method: 'PUT',
                body: JSON.stringify
                ({
                    archived: false
                })
              })
              // Giving some time to mark it unread before returning to main page
              setTimeout(function(){ 

                load_mailbox('archive')
            }, 50);
              };
            });


          // Clicking on email
          document.querySelectorAll('.email-link').forEach(link => {
            link.onclick = () => {
              fetch(`/emails/${link.dataset.page}`, {
                //Marking email read
                method: 'PUT',
                body: JSON.stringify
                ({
                    read: true
                })
              })
              // Creating email look
              fetch(`/emails/${link.dataset.page}`)
              .then(response => response.json())
              .then(email => {
                var main = document.querySelector('#emails-view')
                main.innerHTML = `
                <div>
                    <h4 class="email-subject">${email.subject}</h4>
                    <span>From: <p class="email-from">${email.sender}</p></span>
                    <span>To: <p class="email-to">${email.recipients}</p></span>
                    <p class="email-time">${email.timestamp}</p>
                    <p class="email-body">${email.body}</p>
                </div>
                `;
                button.setAttribute('data-page', link.dataset.page);
                // Adding Reply Button
                main.appendChild(button);

                // Adding Archive Button
                button = document.createElement("button");
                button.setAttribute('class', 'btn btn-danger');
                button.setAttribute('data-page', link.dataset.page);
                if (!email.archived)
                {
                  button.setAttribute('id', 'archive');
                  button.innerHTML="Archive"
                }
                else
                {
                  button.setAttribute('id', 'unarchive');
                  button.innerHTML="Unarchive"
                }

                
                main.appendChild(button);

                // Adding Make Unread Button
                button = document.createElement("button");
                button.setAttribute('class', 'btn btn-success');
                button.setAttribute('data-page', link.dataset.page);
                button.setAttribute('id', 'unread');
                button.innerHTML="Mark Unread"
                main.appendChild(button);

                // Clicking Reply
                document.querySelector('#reply').addEventListener('click', function() {
                  document.querySelector('#reply').style.display = 'none'
                  form = document.createElement('form')
                  form.setAttribute('id', 'reply-form')
                  textarea = document.createElement('textarea')
                  textarea.value = `

    ------ On ${email.timestamp} ${email.sender} wrote:

      ${email.body}
    `
                  submit = document.createElement('input')
                  submit.setAttribute('type', 'Submit')
                  form.appendChild(textarea)
                  form.appendChild(submit)
                  main.appendChild(form)
                  document.querySelector('textarea').focus();
                  document.querySelector('textarea').setSelectionRange(0,0);
                  
                  document.querySelector('textarea').scrollTop = 0;
                  
                  document.querySelector('#reply-form').onsubmit = (e) => { 

                    e.preventDefault();
                    console.log(mailbox)
                    if (mailbox == 'inbox')
                    {
                      recipients = document.querySelector('.email-from').innerHTML
                    }
                    if (mailbox == 'sent')
                    {
                      recipients = document.querySelector('.email-to').innerHTML
                    }
                    fetch('/emails', {
                      method: 'POST',
                      body: JSON.stringify({
                        recipients: recipients,
                        subject: `RE: ${document.querySelector('.email-subject').innerHTML}`,
                        body: document.querySelector('textarea').value
                      })
                    })
                    .then(response => response.json())
                    .then(result => {
                        // Print result
                        console.log(result)
                        alert(result['message'])
                        load_mailbox('inbox')
                    });
                  }
                });
                if(mailbox == 'archive')
                {
                  // Clicking Unarchive
                document.querySelector('#unarchive').addEventListener('click', function() {
                  fetch(`/emails/${link.dataset.page}`, {
                    //Marking email unarchive
                    method: 'PUT',
                    body: JSON.stringify
                    ({
                        archived: false
                    })
                  })
                  // Giving some time to mark it unread before returning to main page
                  setTimeout(function(){ 

                    load_mailbox('inbox')
                }, 50);
                });
                }
                else
                {
                  // Clicking Archive
                  document.querySelector('#archive').addEventListener('click', function() {
                  fetch(`/emails/${link.dataset.page}`, {
                    //Marking email archive
                    method: 'PUT',
                    body: JSON.stringify
                    ({
                        archived: true
                    })
                  })
                  // Giving some time to mark it unread before returning to main page
                  setTimeout(function(){ 

                    load_mailbox('inbox')
                }, 50);
                  });
                }
                
                  // Clicking Make Unread
                  document.querySelector('#unread').addEventListener('click', function() {
                  fetch(`/emails/${link.dataset.page}`, {
                    //Marking email read
                    method: 'PUT',
                    body: JSON.stringify
                    ({
                        read: false
                    })
                  })
                  // Giving some time to mark it unread before returning to main page
                  setTimeout(function(){ 

                    load_mailbox('inbox')
                }, 50);  
                  
                })
              });
            };
          }
          )}
      }
    });
}