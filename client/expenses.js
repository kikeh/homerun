if (Meteor.isClient) {

    Template.registerHelper('formatDate', function(date) {
        return moment(date).format('DD-MM-YYYY');
    });
    
    Template.expenses.helpers({
        total: function() {
            return Expenses.find().count();
        },
    });

    Template.expensesByYear.helpers({
        total: function() {
            var startYear = 1900;
            var year = this.year - startYear;
            var query = 'this.date.getYear() == ' + year;
            var total = Expenses.find({$where : query }).count();
            if(total == 0)
                total = "No se han encontrado resultados para este año."
            return total;
        },
    });

    Template.expensesByMonth.helpers({
        total: function() {
            var startYear = 1900;
            var year = this.year - startYear;
            var month = this.month - 1;
            var query = 'this.date.getYear() == ' + year + '&& this.date.getMonth() == ' + month;
            var total = Expenses.find({$where : query }).count();
            if(total == 0)
                total = "No se han encontrado resultados para este mes."
            return total;
        },

        expensesInMonth: function() {
            var startYear = 1900;
            var year = this.year - startYear;
            var month = this.month - 1;
            var query = 'this.date.getYear() == ' + year + '&& this.date.getMonth() == ' + month;
            var total = [];
            Expenses.find({$where : query }).forEach(function(p, index) {
                p.position = index;
                total.push(p)
            });
            return total;
        },

        odd: function() {
            return !(this.position % 2 === 0);
        },
        
        even: function() {
            return (this.position % 2 === 0);
        }
    });
    
}
