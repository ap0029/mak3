function populate_emploees(employees) {
    try {
        $.each(employees, function (i, employee) {
            console.log(employee);
            var employee_section = $(".repeat-employee:first").clone();
            if ( isset( employee.image_url.length ) && employee.image_url )
                $('#image img', employee_section).attr({
                    src: employee.image_url,
                    alt: employee.name,
                });
            $('#name', employee_section).html(employee.name);
            employee_section.show().appendTo($('#employees-list'));
        });
        
        $('#demo').jplist({
            itemsBox: '.list',
            itemPath: '.list-item',
            panelPath: '.jplist-panel'
        });
        $('.jplist-panel').fadeIn(200);
        hide_indicator();
    } catch (e) {
        log('populate_employees()');
        log(e);
    }
}

function favorieten() {
    try {
        fetch_record(db_tables.EMPLOYEE_TABLE, {}, 'name', function (data) {
            populate_emploees(data.result);
        });
    } catch (e) {
        show_alert(e);
    }
}

// For Initial loading
favorieten();