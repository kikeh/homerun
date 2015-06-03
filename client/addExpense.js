if (Meteor.isClient) {

    var getExpenseInfo = function() {
        var formArray = $('.add-expense-form').serializeArray();
        var expenseDateFigures = formArray[3].value.split("/");
        var day   = expenseDateFigures[0];
        var month = Number(expenseDateFigures[1])-1;
        var year  = expenseDateFigures[2];
        var data = {
            'description' : formArray[0].value,
            'category'    : formArray[1].value,
            'amount'      : formArray[2].value,
            'date'        : new Date(year,month,day)
        };
        return data;
    }
    
    Template.addExpense.events({
        'click #add-expense': function (event) {
            event.preventDefault();
            var expenseData = getExpenseInfo();
            console.log(expenseData);
            Meteor.call('createExpenseEntry', expenseData,
                        function(error,result) { 
                            if(error) {
                                console.log('Error: ' + error);
                            }
                            else {
                                console.log('Data saved: ' + result);
                            }
                        });
        }        
    });

    Template.addExpense.rendered = function() {
        $('#datepicker').datepicker({
            format: "dd/mm/yyyy",
            todayBtn: "linked",
            language: "es"
        });
    }
}

