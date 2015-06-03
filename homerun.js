Incomes  = new Mongo.Collection("incomes");
Expenses = new Mongo.Collection("expenses");

if (Meteor.isClient) {

    Router.configure({
        layoutTemplate: 'layout'  //can be any template name
    });
    
    Router.route('/', function () {
        this.render('home');
    });

    Router.route('/addExpense');

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
        }
    });
    
    Meteor.startup(function () {

    });
}
