if (Meteor.isClient) {

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
    
    Template.transactionsByPeriod.helpers({
        
        transactionName: function() {
            if(this.transactionType == "expenses")
                return "Gastos";
            else
                return "Ingresos";
        },

        monthly: function() {
            if(this.month != null)
                return true;
            else
                return false;
        },

        totalAmount: function() {
            var transactions = getTransactions(this.transactionType, this.year, this.month).fetch();
            var total = 0;
            _.each(transactions, function(transaction) {
                total = total + parseFloat(transaction.amount.replace(',','.'));
            });
            return total.toString().replace('.',',');
        },
        
        empty: function() {
            var total = getTransactions(this.transactionType, this.year, this.month).count();
            return total == 0;
        },

        transactions: function() {
            var transactions = getTransactions(this.transactionType, this.year, this.month).fetch();

            return transactions;
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
