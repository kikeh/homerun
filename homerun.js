Incomes    = new Mongo.Collection("incomes");
Expenses   = new Mongo.Collection("expenses");
Categories = new Mongo.Collection("categories");

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

    Router.route('/chart', function () {
        this.render('chart');
    });

    Template.chart.rendered = function() {
        var margin = {top: 20, right: 20, bottom: 30, left: 50},
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var parseDate = d3.time.format("%d-%b-%y").parse;

        var x = d3.time.scale()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([height, 0]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left");

        var line = d3.svg.line()
            .x(function(d) { return x(d.date); })
            .y(function(d) { return y(d.amount); });

        var svg = d3.select('#myChart')
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Deps.autorun(function () {

        // var dataO = Expenses.find({}).fetch();
        
        var dataO = [
            { "amount" : "1893,00", "date" : new Date("2015-08-01T22:00:00Z") },
            { "amount" : "1293,00", "date" : new Date("2015-08-02T22:00:00Z") },
            { "amount" : "1146,99", "date" : new Date("2015-08-03T22:00:00Z") },
            { "amount" : "1098,38", "date" : new Date("2015-08-04T22:00:00Z") },
            { "amount" : "999,34", "date" : new Date("2015-08-05T22:00:00Z") },
            { "amount" : "725,13", "date" : new Date("2015-08-06T22:00:00Z") }
        ];

        var data = [];
        
        dataO.forEach(function(d) {
            var format = d3.time.format("%e-%b-%y");
            var date = format(new Date(d.date));
            var amount = d.amount.replace(',','.');
            var value = { 'date' : date, 'amount' : amount };
            data.push(value);
        });

        data.forEach(function(d) {
            d.date = parseDate(d.date);
            d.amount = +d.amount;
        });
        
        console.log(data);
        
        x.domain(d3.extent(data, function(d) { return d.date; }));
        y.domain(d3.extent(data, function(d) { return d.amount; }));

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .text("Gasto (€)");

        svg.append("path")
            .datum(data)
            .attr("class", "line")
            .attr("d", line);
              //});
        // });
    };
    
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
        var fixedExpenses = Expenses.find({'type':'Fijo', 'endDate': { '$gte' : today }}).fetch();
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

        if(fixedExpenses) {
            var todayData = getTodayData();
            _.each(fixedExpenses, function(i) {
                // console.log(i);
                var description = i.description;
                var currentMonth = Expenses.find({ 'type' : 'Fijo',
                                                  'description' : description,
                                                  'month' : todayData.month,
                                                  'year' : todayData.year}).fetch();
                if(currentMonth.length == 0) {
                    var transactionData = createNewFixedIncome(i,todayData.year,todayData.month);
                    Meteor.call('createExpenseEntry', transactionData,
                                function(error,result) { 
                                    if(error) {
                                        console.log('Error: ' + error);
                                    }
                                    else {
                                        console.log('Actualizados gastos fijos mensuales');
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
        'createNewCategory' : function(category) {
            Categories.insert({'name' : category});
        },        
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
        // Start typeahead
        // Meteor.typeahead.inject();        
    });
}
