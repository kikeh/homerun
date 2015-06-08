if (Meteor.isClient) {

    var getTransactionInfo = function() {
        var formArray = $('.add-transaction-form').serializeArray();
        var transactionDateFigures = formArray[4].value.split("/");
        var day   = transactionDateFigures[0];
        var month = transactionDateFigures[1];
        var year  = transactionDateFigures[2];
        var data = {
            'description' : formArray[0].value,
            'category'    : formArray[1].value,
            'amount'      : Number(formArray[2].value.replace(",",".")),
            'type'        : formArray[3].value,
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
        'click #add-transaction': function (event) {
            event.preventDefault();
            var transactionData = getTransactionInfo();
            if(dataIsValid(transactionData)){
                if(this.type == "expense") {
                    Meteor.call('createExpenseEntry', transactionData,
                                function(error,result) { 
                                    if(error) {
                                        console.log('Error: ' + error);
                                    }
                                    else {
                                        swal("Hecho", "El gasto se ha guardado correctamente","success");
                                    }
                                });
                }
                else {
                    swal("Ups!", "Todavía no se pueden crear ingresos","warning");
                }
            }
        }        
    });

    Template.addTransaction.rendered = function() {
        $('#datepicker').datepicker({
            format: "dd/mm/yyyy",
            todayBtn: "linked",
            language: "es"
        });
        $('#datepicker').datepicker('setDate', new Date());
    }

    Template.addTransaction.onRendered(function() {
        //
    });
}

