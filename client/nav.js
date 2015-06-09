if (Meteor.isClient) {

    Template.registerHelper('getMonthName', function(month) {
        if(month == '01')
            return 'Enero';
        else if(month == '02')
            return 'Febrero';
        else if(month == '03')
            return 'Marzo';
        else if(month == '04')
            return 'Abril';
        else if(month == '05')
            return 'Mayo';
        else if(month == '06')
            return 'Junio';
        else if(month == '07')
            return 'Julio';
        else if(month == '08')
            return 'Agosto';
        else if(month == '09')
            return 'Septiembre ';
        else if(month == '10')
            return 'Octubre';
        else if(month == '11')
            return 'Noviembre';
        else if(month == '12')
            return 'Diciembre';
    });

    Template.nav.helpers({
        years: function() {
            var monthsAndYears = Expenses.find({}, { sort: {'year': 1}, fields: {'year': true, 'month' : true} }).map(function(x) { return { 'year': x.year, 'month' : x.month} });
            var distinctYears  = _.uniq(Expenses.find({}, { sort: {'year': 1}, fields: {'year': true} }).map(function(x) { return x.year }));
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
        },
        total: function() {
            return Expenses.find().count();
        }

    });
    
}
