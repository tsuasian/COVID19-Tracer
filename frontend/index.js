$(document).ready(function() {
  var ls = window.localStorage
  var user;
  var allContacts;

  try {
    user = JSON.parse(ls.getItem("token"))
    console.log("token", JSON.parse(ls.getItem("token")))
  } catch {
    console.log("user not logged in")
  }


  function compare(a, b) {
    if (a.firstName.toUpperCase() < b.firstName.toUpperCase()) {
      return -1
    } else if (a.firstName.toUpperCase() > b.firstName.toUpperCase()) {
      return 1
    }
    return 0
  }

  function compareE(a, b) {
    if (a.location.toUpperCase() < b.location.toUpperCase()) {
      return -1
    } else if (a.location.toUpperCase() > b.location.toUpperCase()) {
      return 1
    }
    return 0
  }

  var pullContacts = function() {
    axios.post('https://damp-forest-68597.herokuapp.com/contacts/retrieve',
    {
      user: user.user
    })
    .then(function(resp) {
      // console.log("contacts axios", resp)
      var contacts = resp.data.contacts
      contacts = contacts.sort(compare)
      var contactList = $('#contact-list-group')
      contactList.empty()
      for (var i=0; i<contacts.length; i++) {
        contactList.append(`
          <li class="list-group-item">
            <a href=#${contacts[i].firstName}-${contacts[i].lastName} data-toggle="modal" data-target="#${contacts[i].firstName}-${contacts[i].lastName}">${contacts[i].firstName} ${contacts[i].lastName}</a>
          </li>
          `)
          contactList.after(`
            <div class="modal fade" id="${contacts[i].firstName}-${contacts[i].lastName}" role="dialog" tabindex="-1" role="dialog" aria-labelledby="myModal" aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">${contacts[i].firstName} ${contacts[i].lastName}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <p>Edit Contact Information</p>
                    <div class="input-group mb-3">
                      <input type="text" class="form-control" id="contact-edit-firstName" placeholder="${contacts[i].firstName}">
                    </div>
                    <div class="input-group mb-3">
                      <input type="text" class="form-control" id="contact-edit-lastName" placeholder="${contacts[i].lastName}">
                    </div>
                    <div class="input-group mb-3">
                      <input type="text" class="form-control" id="contact-edit-phone" placeholder="${contacts[i].phone}">
                    </div>
                    <div class="input-group mb-3">
                      <input type="email" class="form-control" id="contact-edit-email" placeholder="${contacts[i].email}">
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button type="button" class="btn btn-danger mr-auto contact-delete-btn" id="delete-btn" data-dismiss="modal">Delete</button>
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-primary" id="contact-modal-save">Save changes</button>
                  </div>
                </div>
              </div>
            </div>
            `)
      }
    })
    .catch(function(err) {
      console.log("Error req contacts", err)
    })
  }

  var pullEventContactList = function() {
    axios.post('https://damp-forest-68597.herokuapp.com/contacts/retrieve',
    {
      user: user.user
    })
    .then(function(resp) {
      // console.log("contacts axios event", resp)
      var contacts = resp.data.contacts
      contacts = contacts.sort(compare)
      // console.log("contacts pulled", contacts)
      allContacts = contacts.sort(compare)
      var contactPicker = $('#contact-picker')
      contactPicker.empty()
      for (var i=0; i<contacts.length; i++) {
        contactPicker.append(`
          <option value="${contacts[i].firstName} ${contacts[i].lastName}">${contacts[i].firstName} ${contacts[i].lastName}</option>
          `)
      }
      contactPicker.selectpicker("refresh")

    })
    .catch(function(err) {
      console.log("err fetch contact events", err)
    })
  }

  var pullNotifContactList = function() {
    axios.post('https://damp-forest-68597.herokuapp.com/contacts/retrieve',
    {
      user: user.user
    })
    .then(function(resp) {
      // console.log("contacts axios event", resp)
      var contacts = resp.data.contacts
      contacts = contacts.sort(compare)
      // console.log("contacts pulled", contacts)
      allContacts = contacts.sort(compare)
      var contactPicker = $('#contact-picker-notif')
      contactPicker.empty()
      for (var i=0; i<contacts.length; i++) {
        contactPicker.append(`
          <option value="${contacts[i].firstName} ${contacts[i].lastName}">${contacts[i].firstName} ${contacts[i].lastName}</option>
          `)
      }
      contactPicker.selectpicker("refresh")

    })
    .catch(function(err) {
      console.log("err fetch contact events", err)
    })
  }

  var pullNotifEventList = function() {
    axios.post('https://damp-forest-68597.herokuapp.com/event/retrieve',
    {
      user: user.user
    })
    .then(function(resp) {
      console.log("pull notif location")
      var events = resp.data.events
      events = events.sort(compareE)
      var location = $('#location-picker')
      location.empty()
      for (var i=0; i<events.length; i++) {
        location.append(`
          <option value="${events[i].location}">${events[i].location}</option>
          `)
      }
      location.selectpicker("refresh")

    })
    .catch(function(err) {
      console.log("err fetch location events", err)
    })
  }

  var pullEventList = function() {
    console.log("user", user)
    axios.post('https://damp-forest-68597.herokuapp.com/event/retrieve', {
      user: user.user
    })
    .then(function(resp) {
      var events = resp.data.events
      events = events.sort(compareE)
      console.log("events from db", events)
      var eventList = $('#event-list-group')
      eventList.empty()
      eventList.nextAll().remove();
      $('.modal-backdrop').remove();
      for (var i=0; i<events.length; i++) {
        eventID = events[i].location.replace(/\s/g, '')
        eventList.append(`
          <li class="list-group-item">
            <a href=#${eventID} data-toggle="modal" data-target="#${eventID}">${events[i].location}</a>
          </li>
          `)
        eventList.after(`
          <div class="modal fade" id="${eventID}" role="dialog" tabindex="-1" role="dialog" aria-labelledby="myModal" aria-hidden="true">
            <div class="modal-dialog" role="document">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="exampleModalLabel">${events[i].location}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                <div class="modal-body">
                  <p>Edit Location Information</p>
                  <div>
                    <h5>Current Contacts Associated:</h5>
                    <ul class="${eventID}${eventID}">
                    </ul>
                  </div>
                  <div class="input-group mb-3">
                    <input type="text" class="form-control" id="event-edit-location" placeholder="${events[i].location}">
                  </div>
                  <div class="input-group mb-3">
                    <select class="selectpicker ${eventID}" multiple data-size="5" data-actions-box="true" data-width="100%" data-live-search="true" id="event-picker">
                    </select>
                  </div>
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-danger mr-auto delete-btn-event" id="delete-btn-event" data-dismiss="modal">Delete</button>
                  <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary" id="event-modal-save" data-dismiss="modal">Save changes</button>
                </div>
              </div>
            </div>
          </div>
          `)

        for (var j=0; j<events[i].contacts.length; j++) {
          $(`.${eventID}${eventID}`).append(`
            <li>${events[i].contacts[j]}</li>
          `)
        }

        //ASYNC PROBLEMS WITH EVENT PULL CONTACTS -- GLOBAL VAR
        console.log("all contacts in creation", allContacts)
        for (var j=0; j<allContacts.length; j++) {
          $(`.${eventID}`).append(`
            <option value="${allContacts[j].firstName} ${allContacts[j].lastName}">${allContacts[j].firstName} ${allContacts[j].lastName}</option>
          `)
        }
        $(`.${eventID}`).selectpicker('refresh')

      }

    })
    .catch(function(err) {
      console.log("error fetching events", err)
    })
  }

  //notification retrieve function
  var retrieveNotifcations = function() {
    console.log('hello in ret notif!!!!!!!!!!!!!!!!!')
    axios.post('https://damp-forest-68597.herokuapp.com/notification/retrieve', {
      user: user.name
    })
    .then(function(resp) {
      console.log("succ ret notif", resp)
      //update notif modal
      var notifications = resp.data.notifs
      var notifList = $('#nav-notif-list')
      for (var i=0; i<notifications.length; i++) {
        for (var j=0; j<notifications[i].location.length; j++) {
          notifList.append(`
            <li>
              <p>Location: ${notifications[i].location[j]}</p>
              <p>From: ${notifications[i].from}</p>
            </li>
            `)
        }
      }
    })
    .catch(function(err) {
      console.log("err in ret notif", err)
    })
  }

  if (ls.getItem("token")) {
    $('.login').addClass('invisible')
    $('.grandma').addClass('invisible')
    $('.main-container').removeClass('invisible')
    $('#navbar-items').append(`
      <span class="navbar-text" id="user-nav">
        Welcome ${JSON.parse(ls.getItem("token")).name}
      </span>
      <li class="nav-item">
        <a class="nav-link" href="#nav-notif-modal" id="nav-notifications" data-toggle="modal" data-target="#nav-notif-modal">
          Notifications
        </a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#myModal" id="nav-profile" data-toggle="modal" data-target="#myModal">
          Profile
        </a>
      </li>`)
    var user = JSON.parse(ls.getItem("token"))
    var firstName = user.firstName
    var lastName = user.lastName
    var email = user.user
    $('#profile-edit-firstName').attr("placeholder", firstName)
    $('#profile-edit-lastName').attr("placeholder", lastName)
    $('#profile-edit-email').attr("placeholder", email)
    pullContacts()
    pullEventContactList()
    pullNotifContactList()
    pullEventList()
    pullNotifEventList()
    retrieveNotifcations()
  }

  $('#registerLogin').on('click', function() {
    console.log('');
    $('.registration').addClass('invisible')
    $('.login').removeClass('invisible')
  });

  $('#goRegis').click(function() {
    $('.login').addClass('invisible')
    $('.registration').removeClass('invisible')
  });

  $('#logout-btn').click(function() {
    ls.clear()
    // $('.main-container').css("display", "none")
    $('.main-container').addClass("invisible")
    $('.login').removeClass('invisible')
    $('.grandma').removeClass('invisible')

    $('#navbar-items').empty()
  });

  $('#registerbtn').click(function() {
    let firstName = $('#fname').val()
    let lastName = $('#lname').val()
    let email = $('#email').val()
    let password = $('#password').val()
    console.log(firstName, lastName, email, password)
    axios.post('https://damp-forest-68597.herokuapp.com/registration', {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    })
    .then(function (resp) {
      console.log("Registration Response", resp)
      $('.login').removeClass('invisible')
      $('.registration').addClass('invisible')
    })
    .catch(function (err) {
      console.log("Error in registration", err)
    })
  });

  $('#loginfr').click(function() {
    let email = $('#emailLog').val()
    let password = $('#passwordLog').val()
    axios.post('https://damp-forest-68597.herokuapp.com/login', {
      email: email,
      password: password
    })
    .then(function(resp) {
      console.log("Login success", resp)
      if (resp.status == 200) {
        ls.setItem("token", JSON.stringify(resp.data))
        console.log("token", ls.getItem("token"))
        console.log("great success")
        // USER INFO SENT TO FRONT HERE
        $('.login').addClass('invisible')
        $('.grandma').addClass('invisible')
        $('.main-container').removeClass('invisible')
        $('#navbar-items').append(`
          <span class="navbar-text" id="user-nav">
            Welcome ${resp.data.name}
          </span>
          <li class="nav-item">
            <a class="nav-link" href="#nav-notif-modal" id="nav-notifications" data-toggle="modal" data-target="#nav-notif-modal">
              Notifications
            </a>
          </li>
          <li class="nav-item">
            <a class="nav-link" href="#myModal" id="nav-profile" data-toggle="modal" data-target="#myModal">
              Profile
            </a>
          </li>`)
          var user = JSON.parse(ls.getItem("token"))
          var firstName = user.firstName
          var lastName = user.lastName
          var email = user.user
          $('#profile-edit-firstName').attr("placeholder", firstName)
          $('#profile-edit-lastName').attr("placeholder", lastName)
          $('#profile-edit-email').attr("placeholder", email)
          pullContacts()
          pullEventContactList()
          pullNotifContactList()
          pullEventList()
          pullNotifEventList()
          retrieveNotifcations()
      }
    })
    .catch(function(err) {
      console.log("Error in login", err)
    })
  });

  $('#contact-button').click(function() {
    let firstName = $('#contact-firstName')
    let lastName = $('#contact-lastName')
    let phone = $('#contact-phone')
    let email = $('#contact-email')
    console.log(firstName, lastName, phone, email)
    axios.post('https://damp-forest-68597.herokuapp.com/contact/add', {
      firstName: firstName.val(),
      lastName: lastName.val(),
      phone: phone.val(),
      email: email.val(),
      rel: JSON.parse(ls.getItem("token")).user
    })
    .then(function(resp) {
      console.log("Success add contact", resp)
      firstName = $('#contact-firstName').val('')
      let lastName = $('#contact-lastName').val('')
      let phone = $('#contact-phone').val('')
      let email = $('#contact-email').val('')
      pullContacts()
      pullEventContactList()
      pullNotifContactList()
    })
    .catch(function(err) {
      console.log("Error adding contact", err)
    })
  });

  $('#event-button').click(function() {
    var location = $('#event-location').val()
    var contacts = $('[data-id=contact-picker]').attr("title")
    contacts = contacts.split(",")
    $('#event-location').val('')
    // console.log(contacts)
    axios.post('https://damp-forest-68597.herokuapp.com/event/add', {
      location: location,
      contacts: contacts,
      user: user.user
    })
    .then(function(resp) {
      console.log("succ add event", resp)
      pullEventContactList()
      pullNotifContactList()
      pullEventList()
      pullNotifEventList()
    })
    .catch(function(err) {
      console.log("error adding event", err)
    })

  })

  $('#modal-save').click(function(e) {
    e.preventDefault()
    var userLocal = JSON.parse(ls.getItem("token"))
    var ogEmail = userLocal.user
    console.log("modal save clicked")
    axios.post('https://damp-forest-68597.herokuapp.com/profile/update', {
      ogEmail: ogEmail,
      ogfname : userLocal.firstName,
      oglname: userLocal.lastName,
      ogpwd: userLocal.password,
      firstName: $('#profile-edit-firstName').val(),
      lastName: $('#profile-edit-lastName').val(),
      email: $('#profile-edit-email').val(),
      password: $('#profile-edit-password').val()
    })
    .then(function(resp) {
      console.log("Updated profile", resp)
      user.firstName = resp.data.profile.firstName
      user.lastName = resp.data.profile.lastName
      user.name = `${resp.data.profile.firstName} ${resp.data.profile.lastName}`
      console.log("user  updated", user)
      ls.setItem("token", JSON.stringify(user))
      $('#user-nav').text(`${resp.data.profile.firstName} ${resp.data.profile.lastName}`)
    })
    .catch(function(err) {
      console.log("Error updating profile", err)
    })
  })

  $(document).on("click", "#contact-modal-save", function(e) {
    e.preventDefault()
    console.log("clicking")
    var inputs = $(this).parents().siblings(".modal-body")
    var ogfname = inputs.find("#contact-edit-firstName").attr("placeholder")
    var firstName = inputs.find("#contact-edit-firstName").val()
    var oglname = inputs.find("#contact-edit-lastName").attr("placeholder")
    var lastName = inputs.find("#contact-edit-lastName").val()
    var ogphone = inputs.find("#contact-edit-phone").attr("placeholder")
    var phone = inputs.find("#contact-edit-phone").val()
    var ogemail = inputs.find("#contact-edit-email").attr("placeholder")
    var email = inputs.find("#contact-edit-email").val()

    axios.post('https://damp-forest-68597.herokuapp.com/contacts/edit',  {
      ogfname: ogfname,
      firstName: firstName,
      oglname: oglname,
      lastName: lastName,
      ogphone: ogphone,
      phone: phone,
      ogEmail: ogemail,
      email: email
    })
    .then(function(resp) {
      console.log("Sucesss updating contact", resp)
      pullContacts()
    })
    .catch(function(err) {
      console.log("Error in updating cona")
    })
  });

  $(document).on("click", ".contact-delete-btn", function(e) {
    e.preventDefault()
    var inputs = $(this).parents().siblings(".modal-body")
    var ogfname = inputs.find("#contact-edit-firstName").attr("placeholder")
    var oglname = inputs.find("#contact-edit-lastName").attr("placeholder")
    var ogphone = inputs.find("#contact-edit-phone").attr("placeholder")
    var ogemail = inputs.find("#contact-edit-email").attr("placeholder")

    axios.post('https://damp-forest-68597.herokuapp.com/contacts/delete', {
      firstName: ogfname,
      lastName: oglname,
      email: ogemail
    })
    .then(function(resp) {
      console.log("del succ", resp)
      pullContacts()
    })
    .catch(function(err) {
      console.log("err del", err)
    })
  });

  $(document).on("click", "#event-modal-save", function(e) {
    e.preventDefault()
    var inputs = $(this).parents().siblings(".modal-body")
    var contacts = inputs.find('[data-id=event-picker]').attr("title")
    contacts = contacts.split(",")
    var location = inputs.find('#event-edit-location').val()
    var ogLocation = inputs.find('#event-edit-location').attr("placeholder")

    axios.post('https://damp-forest-68597.herokuapp.com/event/edit', {
      ogLocation: ogLocation,
      location: location,
      contacts: contacts
    })
    .then(function(resp) {
      console.log("succ edit event", resp)
      pullEventList()
      pullNotifEventList()
    })
    .catch(function(err) {
      console.long("failed edit event", err)
    })
  });

  $(document).on("click", ".delete-btn-event", function(e) {
    e.preventDefault()
    var inputs = $(this).parents().siblings(".modal-body")
    var ogLocation = inputs.find("#event-edit-location").attr("placeholder")
    console.log('og loc', ogLocation)

    axios.post('https://damp-forest-68597.herokuapp.com/event/delete', {
      location: ogLocation
    })
    .then(function(resp) {
      console.log("del succ event", resp)
      pullEventList()
      pullNotifEventList()
    })
    .catch(function(err) {
      console.log("err del", err)
    })
  });

  $('#notif-send').click(function() {
    var locations = $('[data-id=location-picker]').attr("title")
    var contacts = $('[data-id=contact-picker-notif]').attr("title")
    locations = locations.split(',')
    contacts = contacts.split(',')
    console.log(locations, contacts)
    console.log(user.name)
    if (locations[0] !== "Nothing Selected" && contacts[0] !== "Nothing Selected") {
      axios.post('https://damp-forest-68597.herokuapp.com/notification/send', {
        locations: locations,
        from: user.name,
        to: contacts
      })
      .then(function(resp) {
        console.log("succ notif send", resp)
      })
      .catch(function(err) {
        console.log("fail send notif", err)
      })
    }
  });




});
