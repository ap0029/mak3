function het_team() {

    function populate_emploees(employees) {
        try {
            $.each(employees, function (i, employee) {
                log(employee);
                var employee_section = $(".repeat-employee:first").clone();
                if ( isset( employee.image_url.length ) && employee.image_url )
                    $('#image img', employee_section).attr({
                        src: employee.image_url,
                        alt: employee.name,
                    });
                $('#name', employee_section).html(employee.name);
                $('#city', employee_section).html(employee.city);
                $('#title', employee_section).html(employee.title);
                $('#details', employee_section).html(employee.background_details);
                $('#mail', employee_section).attr('href', 'mailto:' + employee.email);

                $('#cell' , employee_section).on('click', function () {
                    var contacts = [
                        { text: 'Telefoonnummer', label: true },
                        { text: 'Kantoornummer: ' + employee.phone, bold: true , onClick: function(){
                            window.open('tel:' + employee.phone , '_system');
                        }},
                        { text: 'Mobiel: '+ (isset(employee.mobilePhone) && employee.mobilePhone != '' ? employee.mobilePhone : 'Niet beschikbaar'), bold: true , onClick: function(){
                            window.open('tel:' + employee.mobilePhone , '_system');
                        }}
                    ];
                    var cancel = [ { text: 'Cancel', color: 'red' }];
                    main_app.actions([contacts, cancel]);
                });

                employee_section.show().appendTo($('#employees-list'));
            });
            hide_indicator();
        } catch (e) {
            log('populate_employees()');
            log(e);
        }
    }

    try {

        if ( isset(get_global_var(global_vars.COMPANY_EMPLOYEES)) && get_global_var(global_vars.COMPANY_EMPLOYEES) ) {
            var employees_data = JSON.parse(get_global_var(global_vars.COMPANY_EMPLOYEES));
            populate_emploees(employees_data);
        } else
            fetch_record(db_tables.EMPLOYEE_TABLE, {}, 'fax', function (data) {
                log('fetch_employees()');
                log(data.result);
                // set_global_var(global_vars.COMPANY_EMPLOYEES, JSON.stringify(data.result));
                populate_emploees(data.result);
            });
    } catch (e) {
        log("team page");
        log(e);
    }
}

// for initial load
het_team();