//== Class definition

var DatatableRole = function () {
    //== Private functions

    // basic demo
    var roleTable = function () {

        var datatable = $('.m_datatable').mDatatable({
            // datasource definition
            data: {
                type: 'remote',
                source: {
                    read: {
                        url: 'https://keenthemes.com/metronic/preview/inc/api/datatables/demos/default.php'
                    }
                },
                pageSize: 10,
                serverPaging: true,
                serverFiltering: false,
                serverSorting: true
            },

            // layout definition
            layout: {
                theme: 'default', // datatable theme
                class: '', // custom wrapper class
                scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
                height: null, // datatable's body's fixed height
                footer: false // display/hide footer
            },

            // column sorting
            sortable: true,

            pagination: true,

            search: {
                input: $('#generalSearch')
            },

            // columns definition
            columns: [{
                field: "RecordID",
                title: "#",
                sortable: false, // disable sort for this column
                width: 40,
                selector: {class: 'm-checkbox--solid m-checkbox--brand'}
            }, {
                field: "OrderID",
                title: "Order ID",
                sortable: 'asc', // default sort
                filterable: false, // disable or enable filtering,
                width: 150
            }, {
                field: "ShipCity",
                title: "Ship City"
            }, {
                field: "ShipName",
                title: "Ship Name",
                width: 150
            }, {
                field: "CompanyEmail",
                title: "Email",
                width: 150
            }, {
                field: "CompanyAgent",
                title: "Agent"
            }, {
                field: "Department",
                title: "Department"
            }, {
                field: "ShipDate",
                title: "Ship Date"
            }]
        });
    };

    return {
        // public functions
        init: function () {
            roleTable();
        }
    };
}();

jQuery(document).ready(function () {
    DatatableRole.init();
});