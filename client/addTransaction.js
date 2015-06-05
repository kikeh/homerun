if (Meteor.isClient) {

    var getExpenseInfo = function() {
        var formArray = $('.add-expense-form').serializeArray();
        var expenseDateFigures = formArray[3].value.split("/");
        var day   = expenseDateFigures[0];
        var month = expenseDateFigures[1];
        var year  = expenseDateFigures[2];
        var data = {
            'description' : formArray[0].value,
            'category'    : formArray[1].value,
            'amount'      : Number(formArray[2].value.replace(",",".")),
            'year'        : year,
            'month'       : month,
            'day'         : day,
            'createdAt'   : new Date()
        };
        return data;
    };

    var dataIsValid = function(data) {
        var valid = true;
        var reDate = /^(01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31)\/(01|02|03|04|05|06|07|08|09|10|11|12)\/([0-9]{4})$/;
        var dateString = data.day + "/" + data.month + "/" + data.year;
        if(!reDate.test(dateString)) {
            swal("Error", "Fecha no válida", "error");
            valid = false;
        }
        else if(data.amount <= 0 || !(/^(\d+(.\d{2})?)$/.test(data.amount))) {
            swal("Error", "Cantidad no válida", "error");
            valid = false;
        }
        else if(data.description == "") {
            swal("Error", "Descripción no válida", "error");
            valid = false;
        }
        else if(data.category == "") {
            swal("Error", "Categoría no válida", "error");
            valid = false;
        }
        return valid;
    };
    
    Template.addTransaction.helpers({
        type: function() {
            if(this.type == "expense")
                return "Gasto"
            else if(this.type == "income")
                return "Ingreso"
            else
                return "No"
        },
    });
    
    Template.addTransaction.events({
        'click #add-expense': function (event) {
            event.preventDefault();
            var expenseData = getExpenseInfo();
            if(dataIsValid(expenseData)){
                Meteor.call('createExpenseEntry', expenseData,
                            function(error,result) { 
                                if(error) {
                                    console.log('Error: ' + error);
                                }
                                else {
                                    swal("Hecho", "El gasto se ha guardado correctamente","success");
                                }
                            });
            }
        }        
    });

    Template.addTransaction.rendered = function() {
        $('#datepicker').datepicker({
            format: "dd/mm/yyyy",
            todayBtn: "linked",
            language: "es"
        });
    }
}

