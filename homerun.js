Incomes  = new Mongo.Collection("incomes");
Expenses = new Mongo.Collection("expenses");

if (Meteor.isClient) {

    Router.configure({
        layoutTemplate: 'layout'  //can be any template name
    });
    
    Router.route('/', function () {
        this.render('home');
    });

    Router.route('/add/:_type', function() {
        var type = this.params._type;
        if(type == "expense" || type == "income") {
            this.render('addTransaction', { data: { type: type } });
        }
        else {
            this.render('404');
        }
                
    });

    Router.route('/expenses');

    Router.route('expensesByYear', {
        path: '/expenses/:_year',
        data: function() {
            _year = this.params._year;
            templateData = {
                year : _year,
            };
            return templateData;
        }
    });

    Router.route('expensesByMonth', {
        path: '/expenses/:_year/:_month',
        data: function() {
            templateData = {
                year  : this.params._year,
                month : this.params._month
            };
            return templateData;
        }
    });

    Router.route('/incomes');

    Router.route('incomesByYear', {
        path: '/incomes/:_year',
        data: function() {
            _year = this.params._year;
            templateData = {
                year : _year,
            };
            return templateData;
        }
    });

    Router.route('incomesByMonth', {
        path: '/incomes/:_year/:_month',
        data: function() {
            templateData = {
                year  : this.params._year,
                month : this.params._month
            };
            return templateData;
        }
    });

    
    /* Loading */
    
    Router.configure({
        loadingTemplate: 'loading',
        notFoundTemplate: '404'
    });
    
    Template.loading.rendered = function () {
        if ( ! Session.get('loadingSplash') ) {
            this.loading = window.pleaseWait({
                logo: '/images/Meteor-logo.png',
                backgroundColor: '#7f8c8d',
                loadingHtml: message + spinner
            });
            Session.set('loadingSplash', true); // just show loading splash once
        }
    };

    Template.loading.destroyed = function () {
        if ( this.loading ) {
            this.loading.finish();
        }
    };

    var message = '<p class="loading-message">Loading Message</p>';
    var spinner = '<div class="sk-spinner sk-spinner-rotating-plane"></div>';
    
    Template.home.helpers({
        counter: function () {
            return Session.get('counter');
        }
    });

    Template.home.events({
        'click button': function () {
            // increment the counter when button is clicked
            Session.set('counter', Session.get('counter') + 1);
        }
    });
}

if (Meteor.isServer) {

    Meteor.methods({
        'createExpenseEntry' : function(data) {
            Expenses.insert(data);
        },
        'getExpensesByYear' : function(year) {
            return Expenses.find({$where : 'return this.date.getYear() == 115'}).count();
        },
        'createIncomeEntry' : function(data) {
            Incomes.insert(data);
        },
        'getIncomesByYear' : function(year) {
            return Incomes.find({$where : 'return this.date.getYear() == 115'}).count();
        }
    });
    
    Meteor.startup(function () {

    });
}
