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
            'amount'      : formArray[2].value,
            'type'        : formArray[3].value,
            'date'        : new Date(year,month-1,day),
            'year'        : year,
            'month'       : month,
            'day'         : day,
            'createdAt'   : new Date(),
            'endDate'     : getEndDate(formArray[3].value)
        };
        return data;
    };


    var getEndDate = function(value) {
        if(value == "Fijo") {
            return new Date("9999-12-31T22:00:00Z");
        }
        else {
            return new Date();
        }
    };

    var dataIsValid = function(data) {
        var valid = true;
        var reDate = /^(01|02|03|04|05|06|07|08|09|10|11|12|13|14|15|16|17|18|19|20|21|22|23|24|25|26|27|28|29|30|31)\/(01|02|03|04|05|06|07|08|09|10|11|12)\/([0-9]{4})$/;
        var dateString = data.day + "/" + data.month + "/" + data.year;
        if(!reDate.test(dateString)) {
            swal("Error", "Fecha no válida", "error");
            valid = false;
        }
        else if(!(/^(\d+(,\d{2})?)$/.test(data.amount))) {
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

        settings: function() {
            // var categories = Categories;
            return {
                position: "top",
                limit: 5,
                rules: [
                    {
                        collection: Categories,
                        field: "name",
                        options: '',
                        matchAll: true,
                        template: Template.transactionCategory,
                        noMatchTemplate: Template.transactionNotFoundCategory
                    }
                ]
            };
        }
    });

    Template.transactionNotFoundCategory.helpers({
        text: function() {
            return $('#tCategory').val();
        }
    });

    Template.addTransaction.categories = function(){
	var c = Categories.find().fetch().map(function(it){ return it.name; });
        console.log(c);
        return c;
    };

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
                    Meteor.call('createIncomeEntry', transactionData,
                                function(error,result) { 
                                    if(error) {
                                        console.log('Error: ' + error);
                                    }
                                    else {
                                        swal("Hecho", "El ingreso se ha guardado correctamente","success");
                                    }
                                });

                }
            }
        },

        'click #csv-button': function(event) {
            event.preventDefault();
            // var file = $('#csv-uploader')[0].files[0];
            $('#csv-uploader').parse({
	        config: {
	                delimiter: "	",	// auto-detect
	                newline: "",	// auto-detect
                        complete: function(results, file) {
	                    console.log("Parsing complete:", results, file);
                            var data = results.data;
                            _.each(data, function(row) {
                                // Save row
                                console.log(row);
                                var transaction = row[7];
                                var transactionData = {
                                    'description': row[0],
                                    'category': row[1],
                                    'day': row[2],
                                    'month': row[3],
                                    'year': row[4],
                                    'amount': row[5],
                                    'type': row[6],
                                    'date': new Date(row[4],Number(row[3])-1,row[2]),
                                    'createdAt': new Date(),
                                    'endDate' : getEndDate(row[6])
                                }
                                if(transaction == '0') {
                                    Meteor.call('createExpenseEntry', transactionData,
                                                function(error,result) { 
                                                    if(error) {
                                                        console.log('Error: ' + error);
                                                    }
                                                    else {
                                                        // 
                                                    }
                                                });
                                }
                                else {
                                    Meteor.call('createIncomeEntry', transactionData,
                                                function(error,result) { 
                                                    if(error) {
                                                        console.log('Error: ' + error);
                                                    }
                                                    else {
                                                        //
                                                    }
                                                });

                                }
	                    });
                        }
	            },
	            before: function(file, inputElem)
	            {
                        //
	            },
	            error: function(err, file, inputElem, reason)
	            {
		        console.log("Error: ");
		        console.log(err);
		        console.log(reason);
	            },
	            complete: function()
	            {
		        console.log("Fin");
	            }
            });
        },
        'click .new': function(event) {
            var newCategory = $(event.currentTarget).children();
            console.log(newCategory);
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
