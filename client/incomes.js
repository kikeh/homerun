if (Meteor.isClient) {
    
    Template.registerHelper('formatDate', function(date) {
        return moment(date).format('YYYY');
    });

    Template.registerHelper('formatPercentage', function(value) {
        return numeral.language('es')(value).format('0.00%');
    });

    Template.incomesByYear.rendered = function() {
        numeral.language('es', {
            delimiters: {
                thousand: '',
                decimal: ','
            },
            currency: {
                symbol: '€'
            }
        });
        
        $('.incomes').dataTable( {
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

                // Update footer
                $( api.column( 3 ).footer() ).html(
                    numeral.language('fr')(total).format('0[.]00 $')
                );
            }
        } );
    };
    
    Template.incomesByYear.helpers({
        totalAmount: function() {
            var year = this.year;
            var incomes = Incomes.find({'year' : year });
            var total = 0;
            _.each(incomes, function(income) {
                total = total + income.amount;
            });
            return total;
        },

        empty: function() {
            var year = this.year;
            var total = Incomes.find({'year' : year}).count();
            return total == 0;
        },

        yearIncomes: function() {
            var year  = this.year;
            return Incomes.find({'year' : year}).fetch();
        },
    });
    
    Template.incomesByMonth.rendered = function() {
        numeral.language('es', {
            delimiters: {
                thousand: '',
                decimal: ','
            },
            currency: {
                symbol: '€'
            }
        });
        
        $('.incomes').dataTable( {
            "paging":   false,
            "info":     false,
            "filter": false,
            "order": [[2, 'asc']],
            // "columnDefs": [
            //     {
            //         "render": function ( data, type, row ) {
            //             return moment(data).format('YYYY-MM-DD');
            //         },
            //         "targets": 2
            //     }],
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

                // Update footer
                $( api.column( 3 ).footer() ).html(
                    numeral.language('es')(total).format('0[.]00 $')
                );
            }
        } );
    };
    
    Template.incomesByMonth.helpers({
        totalAmount: function() {
            var year = this.year;
            var incomes = Incomes.find({'year' : year });
            var total = 0;
            _.each(incomes, function(income) {
                total = total + income.amount;
            });
            return total;
        },
        
        empty: function() {
            var year = this.year;
            var month = this.month;
            var total = Incomes.find({'month' : month, 'year' : year}).count();
            return total == 0;
        },

        monthIncomes: function() {
            var month = this.month;
            var year  = this.year;
            var incomes = Incomes.find({'month' : month, 'year' : year}).fetch();
            return incomes;
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

// if (Meteor.isClient) {

//     Template.registerHelper('formatDate', function(date) {
//         return moment(date).format('DD-MM-YYYY');
//     });
    
//     Template.incomes.helpers({
//         years: function() {
//             var distinctEntries = _.uniq(Incomes.find({}, { sort: {'year': 1}, fields: {'year': true} }).fetch().map(function(x) {
//                 return x.myField;
//             }), true);
//             console.log(distinctEntries);
//             return distinctEntries;
//         },
//         total: function() {
//             return Incomes.find().count();
//         },
//     });

//     Template.incomesByYear.helpers({
//         total: function() {
//             var year = this.year;
//             var total = Incomes.find({'year' : year }).count();
//             if(total == 0)
//                 total = "No se han encontrado resultados para este año."
//             return total;
//         },

//         empty: function() {
//             var year = this.year;
//             var total = Incomes.find({'year' : year}).count();
//             return total == 0;
//         },

//         yearIncomes: function() {
//             var year  = this.year;
//             return function() {
//                 var incomes = Incomes.find({'year' : year}).fetch();
//                 return incomes;
//             };
//         },

//         yearIncomesOptions: function() {
//             var optionsObject = {
//                 bFilter: false,
//                 bInfo: false,
//                 bPaginate: false,
//                 className: 'compact',
//                 'order': [[2, 'asc']],
//                 "columnDefs": [
//                     {
//                         "render": function ( data, type, row ) {
//                             return moment(data).format('YYYY-MM-DD');
//                         },
//                         "targets": 2
//                     }],
//                 columns: [{
//                     title: 'Descripción',
//                     data: 'description',
//                 },{
//                     title: 'Categoría',
//                     data: 'category'
//                 },{
//                     title: 'Fecha',
//                     data: 'date',
//                     type: 'string'
//                 },{
//                     title: 'Cantidad (€)',
//                     data: 'amount',
//                     type: "num-fmt",
//                     className: 'right'
//                 }]
//             }
//             return optionsObject;
//         },

//     });
    
//     Template.incomesByMonth.helpers({
//         empty: function() {
//             var year = this.year;
//             var month = this.month;
//             var total = Incomes.find({'month' : month, 'year' : year}).count();
//             return total == 0;
//         },
        
//         total: function() {
//             var year = this.year;
//             var month = this.month;
//             var total = Incomes.find({'month' : month, 'year' : year}).count();
//             if(total == 0)
//                 total = "No se han encontrado resultados para este mes."
//             return total;
//         },

//         monthIncomes: function() {
//             var month = this.month;
//             var year  = this.year;
//             return function() {
//                 var incomes = Incomes.find({'month' : month, 'year' : year}).fetch();
//                 return incomes;
//             };
//         },

//         monthIncomesOptions: function() {
//             var optionsObject = {
//                 bFilter: false,
//                 bInfo: false,
//                 bPaginate: false,
//                 className: 'compact',
//                 'order': [[2, 'asc']],
//                 'order': [[2, 'asc']],
//                 "columnDefs": [
//                     {
//                         "render": function ( data, type, row ) {
//                             return moment(data).format('YYYY-MM-DD');
//                         },
//                         "targets": 2
//                     }],
//                 columns: [{
//                     title: 'Descripción',
//                     data: 'description',
//                 },{
//                     title: 'Categoría',
//                     data: 'category'
//                 },{
//                     title: 'Fecha',
//                     data: 'date',
//                     type: 'date'
//                 },{
//                     title: 'Cantidad (€)',
//                     data: 'amount',
//                     type: "num-fmt",
//                     className: 'right'
//                 }]
//             }
//             return optionsObject;
//         },

//         // totalIncomesAmount: function() {
//         //     var year = this.year;
//         //     var month = this.month;
//         //     var total = [];
//         //     var incomes = Incomes.find({'month' : month, 'year' : year});
//         //     incomes.forEach(function(p, index) {
//         //         p.position = index;
//         //         total.push(p)
//         //     });

//         //     var total = 0;
//         //     incomes.forEach(function(e) {
//         //         total = total + e.amount;
//         //     });
//         //     return total;
//         // },
        
//         // incomesInMonth: function() {
//         //     var year = this.year;
//         //     var month = this.month;
//         //     var total = [];
//         //     var incomes = Incomes.find({'month' : month, 'year' : year}).fetch();
//         //     incomes.forEach(function(p, index) {
//         //         p.position = index;
//         //         total.push(p)
//         //     });
//         //     return total;
//         // },
        
//         monthName: function() {
//             var month = this.month;
//             if(month == '01')
//                 return 'Enero';
//             else if(month == '02')
//                 return 'Febrero';
//             else if(month == '03')
//                 return 'Marzo';
//             else if(month == '04')
//                 return 'Abril';
//             else if(month == '05')
//                 return 'Mayo';
//             else if(month == '06')
//                 return 'Junio';
//             else if(month == '07')
//                 return 'Julio';
//             else if(month == '08')
//                 return 'Agosto';
//             else if(month == '09')
//                 return 'Septiembre ';
//             else if(month == '10')
//                 return 'Octubre';
//             else if(month == '11')
//                 return 'Noviembre';
//             else if(month == '12')
//                 return 'Diciembre';
//         }
        
//     });
    
// }
