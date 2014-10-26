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
  var welcomeEvent = {type: 'welcome', status: start, text: 'Welcome to our ED, a Dr. will be with you shortly'};
  var dischargeEvent = {type: 'discharge', status: end, text: 'Discharge pending, have a nice day'};

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
      // Session.set("patient", "John Smith");
      Patients.insert({name: "John Smith"});
      Meteor.call('updateEvent', 'welcome', start, 'Welcome to our ED, a Dr. will be with you shortly');
    },
    'click button#labsOrdered': function() {
      updateEvent('Labs', start, 'Waiting for tech');
    },
    'click button#labsSent': function() {
      updateEvent('Labs', middle, 'Waiting for results');
    },
    'click button#labResultsReceived': function() {
      updateEvent('Labs', end, 'Waiting for physician');
    },
    'click button#imagingOrdered': function() {
      updateEvent('Imaging', start, 'Waiting for tech');
    },
    'click button#imagingTaken': function() {
      updateEvent('Imaging', middle, 'Waiting for review');
    },
    'click button#imagingReviewed': function() {
      updateEvent('Imaging', end, 'Waiting for physician');
    },
    'click button#treatmentOrdered': function() {
      updateEvent('Treatment', end, 'Treatment Requested');
    },
    'click button#consultOrdered': function() {
      updateEvent('Consultation', end, 'Consult Requested');
    },
    'click button#discharge': function() {
      Session.set("patient", "");
      Meteor.call('removeAll');
    }
  });

  var updateEvent = function(type, status, text) {
    if (Patients.findOne({})) {
      removeWelcomeEvent();
      Meteor.call('updateEvent', type, status, text);
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
      var welcomeEvent = Items.findOne({type: 'welcome'})
      if (welcomeEvent) {
        Items.remove(welcomeEvent._id);
      }
    },
    updateEvent: function(type, status, text) {
      Items.upsert({type: type}, {$set: {status: status, text: text}})
    },
    removeAll: function() {
      Items.remove({});
      Patients.remove({});
    }
  });
}
