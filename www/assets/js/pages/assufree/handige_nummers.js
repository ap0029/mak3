function handige_nummer() {
    try {
        var filter = { type: 'single', where: [{ type: 'none', clauses: [{ action: '=', clause: { column: 'name', value: 'pagina_3' } },] }] };
        fetch_record("Pagina", filter, '', function (data) {
            $('.phone-book').html(decode_data(data.result[0].htmlpagina));
            $(".phone-book ul li").each(function() {
                $('a',$(this)).html("<i class='fa fa-phone'></i><span class='company-name'>" + $('a',$(this)).html() + "</span>");
            });
            hide_indicator();
        });
    } catch (e) {
        log("team page");
        log(e);
    }
}

// for initial load
handige_nummer();