function pdf_document_listing() {
    try {
		var pdf_document_type = $( '#pdf_document' ).data( 'document' );
        fetch_record(db_tables.BROCHURES_TABLE, { type: 'single', where: [{ type: 'none', clauses: [{ action: '=', clause: { column: 'type_pdf_document', value: pdf_document_type } },] }] }, 'Description', function (data) {
            var icon = PDFicon;
            var list_type = "pdf";
            var list_options = parse_list_options(data.result , 'Description', 'Image_url', icon );
            populate_list_options(list_options, list_type , $(".repeat-pdf-document:first") , $('#pdf_document_listing'));
        });
        hide_indicator();
    } catch (e) {
        console.log('pdf_document_listing');
        console.log(e);
    }
}

// for initial load
pdf_document_listing();