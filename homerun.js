Incomes  = new Mongo.Collection("incomes");
Expenses = new Mongo.Collection("expenses");

if (Meteor.isClient) {

    /* ROUTER */
    
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

    Router.route('balanceByYear', {
        path: '/balance/:_year',
        data: function() {
            _year = this.params._year;
            templateData = {
                year : _year,
            };
            return templateData;
        }
    });

    Router.route('balanceByMonth', {
        path: '/balance/:_year/:_month',
        data: function() {
            templateData = {
                year  : this.params._year,
                month : this.params._month
            };
            return templateData;
        }
    });

    
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

    /* Basic templates */

    var getTodayData = function() {
        var today = new Date();
        var data = { 'year'  : (today.getYear() + 1900).toString(),
                     'month' : today.getMonth() < 10 ? '0' + (today.getMonth()+1) : (today.getMonth()+1).toString(),
                     'day'   : today.getDate().toString() };
        return data;
    };
    
    var createNewFixedIncome = function(entry, year, month) {
        var data = {
            'description' : entry.description,
            'category'    : entry.category,
            'amount'      : entry.amount,
            'type'        : entry.type,
            'date'        : new Date(year,month-1,entry.day),
            'year'        : year,
            'month'       : month,
            'day'         : entry.day,
            'createdAt'   : new Date(),
            'endDate'     : entry.endDate
        };
        return data;
    };

    Template.home.rendered = function() {        
        var today = new Date();
        // var fixedExpenses = Expenses.find({'type':'Fijo' /*, 'endDate': { '$gte' : today }} */}).fetch();
        var fixedIncomes = Incomes.find({'type':'Fijo', 'endDate': { '$gte' : today }}).fetch();
        if(fixedIncomes) {
            var todayData = getTodayData();
            _.each(fixedIncomes, function(i) {
                // console.log(i);
                var description = i.description;
                var currentMonth = Incomes.find({ 'type' : 'Fijo',
                                                  'description' : description,
                                                  'month' : todayData.month,
                                                  'year' : todayData.year}).fetch();
                if(currentMonth.length == 0) {
                    var transactionData = createNewFixedIncome(i,todayData.year,todayData.month);
                    Meteor.call('createIncomeEntry', transactionData,
                                function(error,result) { 
                                    if(error) {
                                        console.log('Error: ' + error);
                                    }
                                    else {
                                        console.log('Actualizados ingresos fijos mensuales');
                                    }
                                });
                }
            });
        }
    },

            
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
        },        
        'getActiveYearsAndMonths' : function() {
            var monthsAndYears = Expenses.find({}, { sort: {'year': 1}, fields: {'year': true, 'month' : true} }).map(function(x) { return { 'year': x.year, 'month' : x.month} });
            var monthsAndYearsIncomes = Incomes.find({}, { sort: {'year': 1}, fields: {'year': true, 'month' : true} }).map(function(x) { monthsAndYears.push({ 'year': x.year, 'month' : x.month}); });
            var distinctYears  = _.uniq(Expenses.find({}, { sort: {'year': 1}, fields: {'year': true} }).map(function(x) { return x.year }));
            var distinctYearsIncomes  = _.uniq(Incomes.find({}, { sort: {'year': 1}, fields: {'year': true} }).map(function(x) { distinctYears.push(x.year) }));
            distinctYears = _.uniq(distinctYears.sort());
            console.log(distinctYears);
            var years = [];
            _.each(distinctYears, function(year) {
                var objectYear = {};
                objectYear['year'] = year;
                objectYear['months'] = [];
                _.each(monthsAndYears, function(entry) {
                    if(entry.year == year) {
                        if(objectYear['months'].indexOf(entry.month) == -1)
                            objectYear['months'].push(entry.month);
                    }
                });
                objectYear['months'].sort();
                years.push(objectYear);
            });
            return years;
        }
    });
    
    Meteor.startup(function () {

    });
}
