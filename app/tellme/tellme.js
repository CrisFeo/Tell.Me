// Collections
Items = new Mongo.Collection("items");
Patients = new Mongo.Collection("patients");

// Routes
Router.configure({
  layoutTemplate: 'Layout'
});
Router.route('/', function () {
  this.render('Home');
});
Router.route('/patient');
Router.route('/provider');

if (Meteor.isClient) {

  // states
  var start = 'created';
  var middle = 'inProgress';
  var end = 'resolved';

  // images
  var images = {
    Labs: 'beaker',
    Imaging: 'camera',
    Treatment: 'pill',
    Consultation: 'stethoscope'
  }

  // Events
  var welcomeEvent = {type: 'Room Assigned', status: start, text: 'Welcome to our ED, a Dr. will be with you shortly', list: []};
  var dischargeEvent = {type: 'Discharge', status: end, text: 'Discharge pending, have a nice day', list: []};

  Session.setDefault("patient", "");

  Template.patient.helpers({
    patient: function () {
      return Patients.findOne({});
    }
  });

  Template.items.helpers({
    items: function() {
      return Items.find({});
    }
  });

  Template.item.helpers({
    image: function() {
      if (images[this.type]) {
        return "img/" + images[this.type] + ".png";
      }
      else {
        return 0;
      }
    }
  })

  Template.control.events({
    'click button#newPatient': function() {
      Meteor.call('removeAll');
      Patients.insert({name: "John Smith"});
      Meteor.call('updateEvent', 'Welcome', start, 'A member of your clinical team will be with you shortly', '', []);
    },
    'click button#labsOrdered': function() {
      updateEvent('Labs', start, 'Waiting for collection', '15 minutes', []);
    },
    'click button#labsSent': function() {
      updateEvent('Labs', middle, 'Waiting for results', '1 hour 20 minutes', []);
    },
    'click button#labResultsReceived': function() {
      updateEvent('Labs', end, 'Results are starting to arrive', '45 minutes', []);
    },
    'click button#imagingOrdered': function() {
      updateEvent('Imaging', start, 'Waiting for transportation', '5 minutes', []);
    },
    'click button#imagingTaken': function() {
      updateEvent('Imaging', middle, 'Awaiting review', '1 hour', []);
    },
    'click button#imagingReviewed': function() {
      updateEvent('Imaging', end, 'Under review', '30 minutes', []);
    },
    'click button#treatmentOrdered': function() {
      updateEvent('Treatment', "", 'Ordered', '5 minutes', []);
    },
    'click button#consultOrdered': function() {
      updateEvent('Consultation', "", 'Requested', '1 hour 10 minutes', [/*
        {label: 'Nephrologist Requested', status: ""},
        {label: 'General Surgery Requested', status: ""}
      */]);
    },
    'click button#discharge': function() {
      Session.set("patient", "");
      Meteor.call('removeAll');
    }
  });

  var updateEvent = function(type, status, text, time, list) {
    if (Patients.findOne({})) {
      removeWelcomeEvent();
      Meteor.call('updateEvent', type, status, text, time, list);
    }
  }

  var removeWelcomeEvent = function() {
    Meteor.call('removeWelcomeEvent');
  }

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

  Meteor.methods({
    removeWelcomeEvent: function() {
      var welcomeEvent = Items.findOne({type: 'Welcome'})
      if (welcomeEvent) {
        Items.remove(welcomeEvent._id);
      }
    },
    updateEvent: function(type, status, text, time, list) {
      Items.upsert({type: type}, {$set: {status: status, text: text, time: time, list: list}})
    },
    removeAll: function() {
      Items.remove({});
      Patients.remove({});
    }
  });
}
