if (Meteor.isClient) {

    Template.registerHelper('formatDate', function(date) {
        return moment(date).format('YYYY');
    });
    
    Template.expenses.helpers({
        years: function() {
            var distinctEntries = _.uniq(Expenses.find({}, { sort: {'year': 1}, fields: {'year': true} }).fetch().map(function(x) {
                return x.myField;
            }), true);
            console.log(distinctEntries);
            return distinctEntries;
        },
        total: function() {
            return Expenses.find().count();
        },
    });

    Template.expensesByYear.rendered = function() {
        numeral.language('es', {
            delimiters: {
                thousands: '',
                decimal: ','
            }
        });
        
        $('table').dataTable( {
            "paging":   false,
            "info":     false,
            "filter": false,
            "order": [[2, 'asc']],
            "columnDefs": [
                {
                    "render": function ( data, type, row ) {
                        return moment(data).format('YYYY-MM-DD');
                    },
                    "targets": 2
                }],
            "footerCallback": function ( row, data, start, end, display ) {
                var api = this.api(), data;
                
                // Remove the formatting to get integer data for summation
                var intVal = function ( i ) {
                    return typeof i === 'string' ?
                        i.replace(',','.')*1 :
                        typeof i === 'number' ?
                        i : 0;
                };

                var total = 0;
                
                if(api.column(3).data().length) {
                    total = api
                        .column( 3 )
                        .data()
                        .reduce( function (a, b) {
                            return intVal(a) + intVal(b);
                        } );
                }
                console.log(total);
                // Update footer
                $( api.column( 3 ).footer() ).html(
                    numeral(total).format('0[.]00 €')
                );
            }
        } );
    };
    
    Template.expensesByYear.helpers({
        totalAmount: function() {
            var year = this.year;
            var expenses = Expenses.find({'year' : year });
            var total = 0;
            _.each(expenses, function(expense) {
                total = total + expense.amount;
            });
            return total;
        },

        empty: function() {
            var year = this.year;
            var total = Expenses.find({'year' : year}).count();
            return total == 0;
        },

        yearExpenses: function() {
            var year  = this.year;
            // return function() {
            //     var expenses = Expenses.find({'year' : year}).fetch();
            //     return expenses;
            // };
            return Expenses.find({'year' : year}).fetch();
        },

        yearExpensesOptions: function() {
            var optionsObject = {
                bFilter: false,
                bInfo: false,
                bPaginate: false,
                className: 'compact',
                'order': [[2, 'asc']],
                "columnDefs": [
                    {
                        "render": function ( data, type, row ) {
                            return moment(data).format('YYYY-MM-DD');
                        },
                        "targets": 2
                    }],
                columns: [{
                    title: 'Descripción',
                    data: 'description',
                },{
                    title: 'Categoría',
                    data: 'category'
                },{
                    title: 'Fecha',
                    data: 'date',
                    type: 'string'
                },{
                    title: 'Cantidad (€)',
                    data: 'amount',
                    type: "num-fmt",
                    className: 'right'
                }]
            }
            return optionsObject;
        },

    });
    
    Template.expensesByMonth.helpers({
        empty: function() {
            var year = this.year;
            var month = this.month;
            var total = Expenses.find({'month' : month, 'year' : year}).count();
            return total == 0;
        },
        
        total: function() {
            var year = this.year;
            var month = this.month;
            var total = Expenses.find({'month' : month, 'year' : year}).count();
            if(total == 0)
                total = "No se han encontrado resultados para este mes."
            return total;
        },

        monthExpenses: function() {
            var month = this.month;
            var year  = this.year;
            return function() {
                var expenses = Expenses.find({'month' : month, 'year' : year}).fetch();
                return expenses;
            };
        },

        monthExpensesOptions: function() {
            var optionsObject = {
                bFilter: false,
                bInfo: false,
                bPaginate: false,
                className: 'compact hover stripes',
                'order': [[2, 'asc']],
                'order': [[2, 'asc']],
                "columnDefs": [
                    {
                        "render": function ( data, type, row ) {
                            return moment(data).format('YYYY-MM-DD');
                        },
                        "targets": 2
                    },{
                        "render": function(data,type,row) {
                            return (Number(data.replace(",","."))*100/1500) + ' %';
                        },
                        "targets": 4
                    }],
                columns: [{
                    title: 'Descripción',
                    data: 'description',
                },{
                    title: 'Categoría',
                    data: 'category'
                },{
                    title: 'Fecha',
                    data: 'date',
                    type: 'date'
                },{
                    title: 'Cantidad (€)',
                    data: 'amount',
                    type: "num-fmt",
                    className: 'right'
                },{
                    title: '% gasto',
                    data: 'amount',
                    className: 'right'
                }],
                "footerCallback": function ( row, data, start, end, display ) {
                    var api = this.api(), data;
                    
                    // Remove the formatting to get integer data for summation
                    var intVal = function ( i ) {
                        return Number(i.replace(',','.'));
                    };

                    var total = 0;
                    
                    if(api.column(3).data().length) {
                        total = api
                            .column( 3 )
                            .data()
                            .reduce( function (a, b) {
                                return intVal(a) + intVal(b);
                            } );
                    }
                    console.log(total);
                    // Update footer
                    $( api.column( 3 ).footer() ).html(
                        total + ' €'
                    );
                }
            }
            return optionsObject;
        },

        // totalExpensesAmount: function() {
        //     var year = this.year;
        //     var month = this.month;
        //     var total = [];
        //     var expenses = Expenses.find({'month' : month, 'year' : year});
        //     expenses.forEach(function(p, index) {
        //         p.position = index;
        //         total.push(p)
        //     });

        //     var total = 0;
        //     expenses.forEach(function(e) {
        //         total = total + e.amount;
        //     });
        //     return total;
        // },
        
        // expensesInMonth: function() {
        //     var year = this.year;
        //     var month = this.month;
        //     var total = [];
        //     var expenses = Expenses.find({'month' : month, 'year' : year}).fetch();
        //     expenses.forEach(function(p, index) {
        //         p.position = index;
        //         total.push(p)
        //     });
        //     return total;
        // },
        
        monthName: function() {
            var month = this.month;
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
        }
        
    });
    
}
