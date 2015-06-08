if (Meteor.isClient) {

    Template.registerHelper('formatDate', function(date) {
        return moment(date).format('DD-MM-YYYY');
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

    Template.expensesByYear.helpers({
        total: function() {
            var year = this.year;
            var total = Expenses.find({'year' : year }).count();
            if(total == 0)
                total = "No se han encontrado resultados para este año."
            return total;
        },

        empty: function() {
            var year = this.year;
            var total = Expenses.find({'year' : year}).count();
            return total == 0;
        },

        yearExpenses: function() {
            var year  = this.year;
            return function() {
                var expenses = Expenses.find({'year' : year}).fetch();
                return expenses;
            };
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
                className: 'compact',
                'order': [[2, 'asc']],
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
                }]
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
