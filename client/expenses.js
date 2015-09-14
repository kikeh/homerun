if (Meteor.isClient) {
    
    Template.registerHelper('formatDate', function(date) {
        return moment(date).format('YYYY');
    });

    Template.registerHelper('formatPercentage', function(value) {
        return numeral.language('es')(value).format('0.00%');
    });

    Template.registerHelper('formatAmount', function(value) {
        if(parseFloat(value.replace(',','.')) % 1 === 0) {
            return value + ",00";
        }
        else {
            return value;
        }
    });

    Template.expensesByYear.rendered = function() {
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
            return Expenses.find({'year' : year}).fetch();
        },
    });
    
    Template.expensesByMonth.rendered = function() {
    };

    var totalIncomeMonth = function(month, year) {
        var incomes = Incomes.find({'month': month, 'year': year}).fetch();
        var total = 0;
        _.each(incomes, function(income) {
            total = total + Number(income.amount.replace(',','.'));
        });
        return total;
    };

    var totalExpenseMonth = function(month, year) {
        var expenses = Expenses.find({'month': month, 'year': year}).fetch();
        var total = 0;
        _.each(expenses, function(expense) {
            total = total + Number(expense.amount.replace(',','.'));
        });
        return total;
    };
    
    Template.expensesByMonth.helpers({
        totalAmount: function() {
            var year = this.year;
            var month = this.month;
            var expenses = Expenses.find({'year' : year , 'month' : month }).fetch();
            var total = 0;
            _.each(expenses, function(expense) {
                total = total + parseFloat(expense.amount.replace(',','.'));
            });
            return total.toString().replace('.',',');
        },
        
        empty: function() {
            var year = this.year;
            var month = this.month;
            var total = Expenses.find({'month' : month, 'year' : year}).count();
            return total == 0;
        },

        monthExpenses: function() {
            var month = this.month;
            var year  = this.year;
            var totalExpense = totalExpenseMonth(month,year);
            var expenses = Expenses.find({'month' : month, 'year' : year}).fetch();
            _.each(expenses, function(e) {
                // e['totalIncome'] = totalIncome;
                // e['expensePercentage'] = (Number(e['amount'].replace(',','.')) / totalExpense);
            });
            return expenses;
        },
        
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
