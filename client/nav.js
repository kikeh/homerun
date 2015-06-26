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

    Session.set('years',[]);
    
    Template.nav.helpers({
        years: function() {
            var years = [];
            Meteor.call('getActiveYearsAndMonths', function(error, result) {
                if(!error) {
                    Session.set('years', result);
                }
                else {
                    console.log("Error: " + error);
                }
            });
            return Session.get('years');
        },
        total: function() {
            return Expenses.find().count();
        }

    });
    
}
