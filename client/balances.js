if (Meteor.isClient) {

    var INCOMES = 'incomes';
    var EXPENSES = 'expenses';
    
    var getTransactions = function(transactionType, year, month) {
        if(transactionType == "expenses")
            var Transactions = Expenses;
        else
            var Transactions = Incomes;

        if(month != null)
            var transactions = Transactions.find({'year' : year, 'month' : month});
        else
            var transactions = Transactions.find({'year' : year});

        return transactions;
    }
    
    var totalIncomeByYear = function(year) {
        var incomes = getTransactions(INCOMES, year).fetch();
        var total = 0;
        _.each(incomes, function(income) {
            total += parseFloat(income.amount.replace(',','.'));
        });
        return total;
    };

    var totalExpenseByYear = function(year) {
        var expenses = getTransactions(EXPENSES, year).fetch();
        var total = 0;
        _.each(expenses, function(expense) {
            total += parseFloat(expense.amount.replace(',','.'));
        });
        return total;
    };
    
    var totalIncomeByMonth = function(month, year) {
        var incomes = getTransactions(INCOMES, year, month).fetch();
        var total = 0;
        _.each(incomes, function(income) {
            total += parseFloat(income.amount.replace(',','.'));
        });
        return total;
    };

    var totalExpenseByMonth = function(month, year) {
        var expenses = getTransactions(EXPENSES, year, month).fetch();
        var total = 0;
        _.each(expenses, function(expense) {
            total += parseFloat(expense.amount.replace(',','.'));
        });
        return total;
    };

    Template.tableBalance.helpers({
        totalBalance: function() {
            if(this.month != null) {
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
            if(this.month != null)
                return (totalIncomeByMonth(this.month, this.year)).toString().replace('.',',');
            else
                return (totalIncomeByYear(this.year)).toString().replace('.',',');
        },

        totalExpenses: function() {
            if(this.month != null)
                return (totalExpenseByMonth(this.month, this.year)).toString().replace('.',',');
            else
                return (totalExpenseByYear(this.year)).toString().replace('.',',');
        },

        balanceResult: function() {
            if(this.month != null) {
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
            if(this.month != null) {
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
