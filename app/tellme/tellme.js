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
  var welcomeEvent = {type: 'welcome', status: start, text: 'A Dr. will be with you shortly, average wait time is 10 minutes'};
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
    },
    type: function() {
      if (this.type !== 'welcome') {
        return this.type;
      } else {
        return '';
      }
    }
  })

  Template.control.events({
    'click button#newPatient': function() {
      Meteor.call('removeAll');
      // var url='http://download.bytesizedsolutions.com/UnityService.aspx?method=getpatient&patientid=500200';
      // HTTP.get(url, {}, function(error,result) {
      //   console.log(result.data);
      //   // Patients.insert({name: "John Smith"});
      // });
      Patients.insert({name: "John Smith"});
      Meteor.call('updateEvent', 'welcome', start, 'A Dr. will be with you shortly.');
    },
    'click button#labsOrdered': function() {
      updateEvent('Labs', start, 'Waiting for tech, average wait time is 15 minutes.');
    },
    'click button#labsSent': function() {
      updateEvent('Labs', middle, 'Waiting for results, average wait time is 45 minutes.');
    },
    'click button#labResultsReceived': function() {
      updateEvent('Labs', end, 'A physician will be with you shortly.');
    },
    'click button#imagingOrdered': function() {
      updateEvent('Imaging', start, 'Waiting for tech, average wait time is 15 minutes.');
    },
    'click button#imagingTaken': function() {
      updateEvent('Imaging', middle, 'Waiting for review, average wait time is an hour and a half.');
    },
    'click button#imagingReviewed': function() {
      updateEvent('Imaging', end, 'A physician will be with you shortly.');
    },
    'click button#treatmentOrdered': function() {
      updateEvent('Treatment', end, 'Treatment will be administered shortly.');
    },
    'click button#consultOrdered': function() {
      updateEvent('Consultation', end, 'A consulting physician will be with you momentarily.');
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

  var patient_fixture = {"Success":true,"Message":"","Data":{"getpatientinfo":[{"ID":500200.0,"LastName":"Williams","Firstname":"Bernadette","middlename":"","gender":"Female","dateofbirth":"1967-03-22T23:00:00","ssn":"","Addressline1":"1234 Smithville Rd.","AddressLine2":"","City":"DETROIT","State":"Michigan","ZipCode":"48215","HomePhone":"","WorkPhone":"","CellPhone":"","PhoneNumber":"","age":"47y","Email":"","patientpix":null,"PrimaryInsurance":"","HomeEmail":"","Race":"","Ethnicity":"","Language":"","MaritalStatus":"","PhysLastName":"","PhysFirstName":"","PhysUserName":"","PhysPhone":"","mrn":"100005","Occupation":"","Employer":""}]}}
  var provider_fixture = {"Success":true,"Message":"","Data":{"getproviderinfo":[{"lastname":"10Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"10james","EntryMnemonic":"10james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":25201190.0,"UserID":"10james"},{"lastname":"11Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"11james","EntryMnemonic":"11james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":25301190.0,"UserID":"11james"},{"lastname":"12Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"12james","EntryMnemonic":"12james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":25401190.0,"UserID":"12james"},{"lastname":"13Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"13james","EntryMnemonic":"13james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":25501190.0,"UserID":"13james"},{"lastname":"14Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"14james","EntryMnemonic":"14james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":25601190.0,"UserID":"14james"},{"lastname":"15Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"15james","EntryMnemonic":"15james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":25701190.0,"UserID":"15james"},{"lastname":"16Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"16james","EntryMnemonic":"16james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":25801190.0,"UserID":"16james"},{"lastname":"17Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"17james","EntryMnemonic":"17james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":25901190.0,"UserID":"17james"},{"lastname":"18Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"18james","EntryMnemonic":"18james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":26001190.0,"UserID":"18james"},{"lastname":"19Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"19james","EntryMnemonic":"19james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":26101190.0,"UserID":"19james"},{"lastname":"1Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"1james","EntryMnemonic":"1james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":22301190.0,"UserID":"1james"},{"lastname":"20Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"20james","EntryMnemonic":"20james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":27201190.0,"UserID":"20james"},{"lastname":"2Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"2james","EntryMnemonic":"2james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":22401190.0,"UserID":"2james"},{"lastname":"3Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"3james","EntryMnemonic":"3james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":22501190.0,"UserID":"3james"},{"lastname":"4Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"4james","EntryMnemonic":"4james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":22601190.0,"UserID":"4james"},{"lastname":"5Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"5james","EntryMnemonic":"5james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":22701190.0,"UserID":"5james"},{"lastname":"6Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"6james","EntryMnemonic":"6james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":22801190.0,"UserID":"6james"},{"lastname":"7Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"7james","EntryMnemonic":"7james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":22901190.0,"UserID":"7james"},{"lastname":"8Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"8james","EntryMnemonic":"8james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":23001190.0,"UserID":"8james"},{"lastname":"9Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"9james","EntryMnemonic":"9james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":23101190.0,"UserID":"9james"},{"lastname":"Ames","firstname":"Joan","middlename":null,"suffixname":"","prefixname":"","TitleName":null,"EntryCode":"james","EntryMnemonic":"james","providerkeyext":"","NPI":null,"AddressLine1":null,"AddressLine2":null,"City":null,"State":null,"ZipCode":null,"fax":null,"specialty":"MD","ProviderIsActive":true,"DEA":null,"ProviderID":17201190.0,"UserID":"JAMES"}]}};
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
