if (Meteor.isClient) {
    
    Template.registerHelper('formatDate', function(date) {
        return moment(date).format('YYYY');
    });

    Template.registerHelper('formatPercentage', function(value) {
        return numeral.language('es')(value).format('0.00%');
    });

    var totalIncomeByYear = function(year) {
        var incomes = Incomes.find({'year': year}).fetch();
        var total = 0;
        _.each(incomes, function(income) {
            total += parseFloat(income.amount.replace(',','.'));
        });
        return total;
    };

    var totalExpenseByYear = function(year) {
        var expenses = Expenses.find({'year': year}).fetch();
        var total = 0;
        _.each(expenses, function(expense) {
            total += parseFloat(expense.amount.replace(',','.'));
        });
        return total;
    };
    
    var totalIncomeByMonth = function(month, year) {
        var incomes = Incomes.find({'month': month, 'year': year}).fetch();
        var total = 0;
        _.each(incomes, function(income) {
            total += parseFloat(income.amount.replace(',','.'));
        });
        return total;
    };

    var totalExpenseByMonth = function(month, year) {
        var expenses = Expenses.find({'month': month, 'year': year}).fetch();
        var total = 0;
        _.each(expenses, function(expense) {
            total += parseFloat(expense.amount.replace(',','.'));
        });
        return total;
    };

    Template.tableBalance.helpers({
        totalBalance: function() {
            console.log(this.period);
            console.log(this.month);
            console.log(this.year);
            if(this.period == "month") {
                var totalIncomes = totalIncomeByMonth(this.month, this.year);
                var totalExpenses = totalExpenseByMonth(this.month, this.year);
            }
            else {
                var totalIncomes = totalIncomeByYear(this.year);
                var totalExpenses = totalExpenseByYear(this.year);
            }
            
            return (totalIncomes - totalExpenses).toString().replace('.',',');
        },

        totalIncomes: function() {
            if(this.period == "month")
                return (totalIncomeByMonth(this.month, this.year)).toString().replace('.',',');
            else
                return (totalIncomeByYear(this.year)).toString().replace('.',',');
        },

        totalExpenses: function() {
            if(this.period == "month")
                return (totalExpenseByMonth(this.month, this.year)).toString().replace('.',',');
            else
                return (totalExpenseByYear(this.year)).toString().replace('.',',');
        },

        balanceResult: function() {
            if(this.period == "month") {
                var totalIncomes = totalIncomeByMonth(this.month, this.year);
                var totalExpenses = totalExpenseByMonth(this.month, this.year);
            }
            else {
                var totalIncomes = totalIncomeByYear(this.year);
                var totalExpenses = totalExpenseByYear(this.year);
            }
                   
            var result = totalIncomes - totalExpenses;
            if(result > 0) {
                return "positive";
            }
            else {
                return "negative";
            }
        },
        
        empty: function() {
            if(this.period == "month") {
                var totalIncomes = totalIncomeByMonth(this.month, this.year);
                var totalExpenses = totalExpenseByMonth(this.month, this.year);
            }
            else {
                var totalIncomes = totalIncomeByYear(this.year);
                var totalExpenses = totalExpenseByYear(this.year);
            }
            return (totalIncomes == 0) && (totalExpenses == 0);
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
