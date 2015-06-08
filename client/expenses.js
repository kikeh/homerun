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
    });

    ex = function(month, year) {
        var expenses = Expenses.find({'month' : '06', 'year' : '2015'}).fetch();
        return expenses;
    };
    
    Template.expensesByMonth.helpers({        
        total: function() {
            var year = this.year;
            var month = this.month;
            var total = Expenses.find({'month' : month, 'year' : year}).count();
            if(total == 0)
                total = "No se han encontrado resultados para este mes."
            return total;
        },

        totalExpensesAmount: function() {
            var year = this.year;
            var month = this.month;
            var total = [];
            var expenses = Expenses.find({'month' : month, 'year' : year});
            expenses.forEach(function(p, index) {
                p.position = index;
                total.push(p)
            });

            var total = 0;
            expenses.forEach(function(e) {
                total = total + e.amount;
            });
            return total;
        },
        
        expensesInMonth: function() {
            var year = this.year;
            var month = this.month;
            var total = [];
            var expenses = Expenses.find({'month' : month, 'year' : year}).fetch();
            expenses.forEach(function(p, index) {
                p.position = index;
                total.push(p)
            });
            return total;
        },

        monthExpenses: function() {
            return ex('06','2015');
        },

        monthExpensesOptions: function() {
            var optionsObject = {
                bFilter: false,
                bInfo: false,
                bPaginate: false,
                columns: [{
                    title: 'Descripción',
                    data: 'description'
                },{
                    title: 'Categoría',
                    data: 'category'
                },{
                    title: 'Cantidad',
                    data: 'amount',
                }]
            }
            return optionsObject;
        },
        
        odd: function() {
            return !(this.position % 2 === 0);
        },
        
        even: function() {
            return (this.position % 2 === 0);
        }
    });
    
}
