// Client specific JS
var theme = "deeppurple"; // deeppurple, blue, green
var app_name = "makelaardij"; // CareFree, Notaris, AssuFree, makelaardij
var servicename = "makelaardij"; // CareFree, Notaris, AssuFree, makelaardij
var newsarchiveName = "makelaardij"; // carefree, notaris, assufree, makelaardij
var db_api_key = 'jdnfpspij74ng4dg'; // Production: pinapphfkcaocbdk9o38v, Un-Known: y3iklfgifv5bqo30, CareFree: 5wwzwq8gyeeedhl2, Notaris: 3bxfnofwonecrbhi, AssuFree: z4d4a0cfuuxjhohk
var landingPage = "registration"; //
var my_app_id = "xxxxx-xxxx-xxxx";
var containerUrl = "https://media.yes-co.com/api/media/original/";
var promootlink = "http://www.accountantapp.nl/accountants/landsmeer/spoelstra-scherer/?mode=share";
var client_name = "Accountantskantoor Spoelstra & Scherer";
var hexheaderColor = "#ffffff";
var hexheaderBgColor = "#2196f3"; // deeppurple: #003399, blue: #2196f3, green: #178c82
var android_sender_id = '297209432890';
var url_scheme = 'https';
var secure_mode = true;
var logo = ""; // path of logo
var dynamic_links = false;
var MainSliderEffect = "slide";     // Could be "slide", "fade", "cube", "coverflow"
var MainSliderSpaceBetween = 0;     // number of pixels between slides
var IconSliderSpaceBetween = 10;     // number of pixels between slides
var IconSliderSlidesPerView= 3;     // number of icon-columns (Home)
var IconSliderSlidesPerColumn= 3;   // number of icon per columns (Home)

var KennisbankAutoFiscus = 1;
var KennisbankPersoneel = 1;
var KennisbankBedrijf = 1;

var PDFicon="flaticon-file-1";  // eg. "fa fa-file-pdf-o" "flaticon-document"

// Setup Theme Before Anything Loads
//document.getElementsByTagName( "BODY" )[0].className += " theme-" + theme;
//document.getElementById( "loader-logo" ).className += " " + app_name;

var new_customer_pages = [
    //{ name: 'New page 1', icon: 'fa fa-file', catagory: 'link', url: 'http://archief.verzekeringsadviseurapp.nl/share.php?id=5' },
    //{ name: 'New page 2', icon: 'fa fa-file', catagory: 'page', url: 'pages/notaris/documenten.html' },
    //{ name: 'kennisbanken', icon: 'flaticon-archive-1', catagory: 'page', url: 'pages/kennisbanken.html' }
    { name: 'applogins', icon: 'fa fa-file', catagory: 'page', url: 'pages/applogins.html' },
];

var backLink;
var pageID;
function editPageDetails() {
	if ( $('.left .icon.icon-back').length ) {      //Arange the backbuttons


        if(pageID =="white_papers" || pageID =="formulieren" || pageID =="brochures"){
			$('.left a').attr('href', 'pages/documenten.html');  //Alter to match template
        }
        else
        if((pageID =="stel_een_vraag" || pageID =="offerteaanvraag") && app_name!="makelaardij"){
			$('.left a').attr('href', 'pages/over_ons.html');  //Alter to match template
        }
        else
        if( backLink=="pages/meer.html" || pageID =="over_ons"){ //to home instead of meer
			$('.left a').attr('href', 'pages/'+app_name.toLowerCase()+'/home.html');  //Alter to match template
        }else
        if(pageID =="meer" || pageID.match("^dm_")){
		 //Do nothing
        }
        else
        {
            $('.left a').attr('href', "javascript:void(0);").addClass('HistoryBack');
        }
        if ( isset( get_global_var( global_vars.HIDE_LOADER ) ) && eval( get_global_var( global_vars.HIDE_LOADER ) ) ) {
        $('.left a').removeClass( 'open-indicator');
		}
	}
                                                                            //Page specific details
    if( pageID =="kennisbank"){$( '.navbar .center').html('Kennisbanken');}
    if( pageID =="overons"){$( '.navbar .center').html('Kantoor');}
    if( pageID =="white_papers"){$( '.navbar .center').html('Berichten');}
    if( pageID =="meer"){$( '.navbar .center').html('Logins');} // ten behoeve van misbruiken meerpagina voor logins/applogins
//    if( pageID =="pagina_2"){
//        $( '.navbar .center').html('RegioBank');
 //       $( '.content-block img').attr('src','assets/images/regiobank.png');
//        }
}



// panelcontent
$(function() {
 //   $('.panel-left').addClass('panel-right').removeClass('panel-left');   //uncomment fot right-side panel

    if(app_name.toLowerCase() == "carefree"){
        $('#panelcontent').load('pages/sidebar.html');
    } else{
        $('#panelcontent').load('pages/'+app_name.toLowerCase()+'/sidebar.html');
    }
});

// app logins
var isAndroid = /(android)/i.test(navigator.userAgent);

    if (isAndroid) {
//var ExactAppUrl="https://play.google.com/store/apps/details?id=com.exact&hl=nl";
var apploginlinks_data = {
 	client_online_app: {"name":"Client Online","icon":"flaticonbrands-playstore","catagory":"link","url":"https://play.google.com/store/apps/details?id=nl.pinkweb.clientonlineandroid"},
 	visma_scanner_app: {"name":"Visma Scanner","icon":"flaticonbrands-playstore","catagory":"link","url":"https://play.google.com/store/apps/details?id=com.visma.blue"},
    }
      }else {
//var ExactAppUrl="https://itunes.apple.com/nl/app/exact-online/id433619246?mt=8";
var apploginlinks_data = {
 	visionplanner_app: {"name":"Visionplanner","icon":"flaticonbrands-apple","catagory":"link","url":"https://itunes.apple.com/nl/app/visma-scanner/id564141518?mt=8"},
 	client_online_app: {"name":"Client Online","icon":"flaticonbrands-apple","catagory":"link","url":"https://itunes.apple.com/nl/app/client-online/id572839040?mt=8"},
 	visma_scanner_app: {"name":"Visma Scanner","icon":"flaticonbrands-apple","catagory":"link","url":"https://itunes.apple.com/nl/app/visma-scanner/id564141518?mt=8"},
    }
}

//function openAppInBrowser(){ //direct exact-app-icon
//app_browser(ExactAppUrl, 'Exact Online');
//}
// icon:  <div class="home-icon swiper-slide"><a href="javascript:openAppInBrowser()" ><i class="flaticon-login"></i><div class="icon-caption">Exact App</div></a></div>



var documenten = [
                {"url":"pages/checklists.html","name":"Checklisten","icon":"flaticon-folder-1","catagory":"page"},
                // {"url":"pages/checklisten.html","name":"Checklisten","icon":"flaticon-folder-1","catagory":"page"},
                {"url":"pages/formulieren.html","name":"Formulieren","icon":"flaticon-folder-1","catagory":"page"},
                {"url":"pages/brochures.html","name":"Brochures","icon":"flaticon-folder-1","catagory":"page"},
               // {"url":"pages/white_papers.html","name":"Berichten","icon":"flaticon-folder-1","catagory":"page"},
                ];


var client_links = {
    ios: {
	unit_4_app: "https://itunes.apple.com/nl/app/unit4-multivers-crm/id655590630?mt=8",
	client_online_app: "https://itunes.apple.com/nl/app/client-online/id572839040?mt=8",
	exact_online_app: "https://itunes.apple.com/app/exact-online/id433619246",
    polismap_app: "https://itunes.apple.com/nl/app/polismap/id891637189?l=en&mt=8",
    },
    android: {
	unit_4_app: "https://play.google.com/store/apps/details?id=com.unit4.multivers.CRM",
	client_online_app: "https://play.google.com/store/apps/details?id=nl.pinkweb.clientonlineandroid",
	exact_online_app: "https://play.google.com/store/apps/details?id=com.exact",
    polismap_app: "https://play.google.com/store/apps/details?id=com.voogd.polismap&hl=nl",
    }
};



var forms_data = [
                {"url":"pages/afspraak.html","name":"Afspraak","icon":"flaticon-calendar-1","catagory":"page"},
                {"url":"pages/carefree/stel_een_vraag.html","name":"Stel een vraag","icon":"flaticon-checked","catagory":"page"},
                {"url":"pages/carefree/offerteaanvraag.html","name":"Offerteaanvraag","icon":"flaticon-calculator-1","catagory":"page"},
                {"url":"pages/enquete.html","name":"Enquete","icon":"flaticon-edit-1","catagory":"page"},
                ];


var kennisbanken = [{"url":"http://kb-accountantapp.testapptomorrow.nl/home/" + KennisbankPersoneel + "","name":"Personeel","icon":"flaticon-archive-1","catagory":"link"},
                {"url":"http://kb-accountant.testapptomorrow.nl/home/" + KennisbankBedrijf + "","name":"Bedrijf","icon":"flaticon-archive-1","catagory":"link"},
                {"url":"http://kennisbank.testapptomorrow.nl/home/" + KennisbankAutoFiscus + "","name":"Auto & Fiscus","icon":"flaticon-calculator-1","catagory":"link"},
                {"url":"pages/kwartaal_updates.html","name":"Kwartaalupdates Auto","icon":"flaticon2-smartphone-1","catagory":"page"}
 ];

/*
    var overons_data = {
	    mobilelistitem_1: {"name":"Ons kantoor","icon":"fa fa-home","catagory":"page","url":"pages/ons_kantoor.html"},
        mobilelistitem_2: {"name":"Onze diensten","icon":"fa fa-list","catagory":"page","url":"pages/onze_diensten.html"},
        mobilelistitem_3: {"name":"Het team uitgebreid","icon":"fa fa-users","catagory":"page","url":"pages/notaris/het_team.html"},
        mobilelistitem_4: {"name":"Het team","icon":"fa fa-users","catagory":"page","url":"pages/het_team.html"},
        mobilelistitem_5: {"name":"Over deze app","icon":"fa fa-info","catagory":"page","url":"pages/over_deze_app.html"},
        mobilelistitem_6: {"name":"Disclaimer","icon":"fa fa-exclamation","catagory":"page","url":"pages/disclaimer.html"},
    }
*/
   var overons_data = {
	    mobilelistitem_1: {"name":"Ons kantoor","icon":"flaticon-home-1","catagory":"page","url":"pages/ons_kantoor.html"},
        mobilelistitem_2: {"name":"Onze diensten","icon":"flaticon-menu-3","catagory":"page","url":"pages/onze_diensten.html"},
//        mobilelistitem_3: {"name":"Het team uitgebreid","icon":"flaticon-users-1","catagory":"page","url":"pages/notaris/het_team.html"},
        mobilelistitem_4: {"name":"Het team","icon":"flaticon-users-1","catagory":"page","url":"pages/het_team.html"},
        mobilelistitem_5: {"name":"Over deze app","icon":"flaticon-info","catagory":"page","url":"pages/over_deze_app.html"},
        mobilelistitem_6: {"name":"Privacy/Disclaimer","icon":"flaticon-folder-17","catagory":"page","url":"pages/disclaimer.html"},
        mobilelistitem_7: {"name":"Contact/Route","icon":"flaticon-street-1","catagory":"page","url":"pages/kantoren.html"},
        mobilelistitem_8: {"name":"Noab Lid","icon":"flaticon-umbrella","catagory":"page","url":"pages/pagina_2.html"},
    }



var login_data = {
    CareFree: {
	mobilelistitem_101: { name: 'Visionplanner', icon: 'fa fa-cloud', catagory: 'link', url: 'https://cloud.visionplanner.nl/#logon' },
	mobilelistitem_102: { name: 'Exact Online', icon: 'fa fa-cloud', catagory: 'link', url: 'https://start.exactonline.nl/docs/Login.aspx' },
	mobilelistitem_103: { name: 'Twinfield', icon: 'fa fa-cloud', catagory: 'link', url: 'https://login.twinfield.com' },
	mobilelistitem_104: { name: 'Securelogin', icon: 'fa fa-pencil-square-o', catagory: 'link', url: 'https://apptomorrow.securelogin.nu/login' },
	mobilelistitem_105: { name: 'Samenwerken', icon: 'fa fa-question', catagory: 'link', url: 'https://wt.portal4collaboration.nl/' },
	mobilelistitem_106: { name: 'Client Online', icon: 'fa fa-cloud', catagory: 'link', url: 'https://www.clientonline.nl/' },
	mobilelistitem_107: { name: 'Klantenportaal', icon: 'fa fa-cloud', catagory: 'link', url: 'https://intermediairsso.acceptatie-ds.nl/mobile/tasks' },
	mobilelistitem_108: { name: 'iMuis', icon: 'fa fa-share-alt', catagory: 'link', url: 'https://online.berveling.nl/iMUIS_net/inlogscherm.aspx' },
	mobilelistitem_109: { name: 'Digizeker', icon: 'fa fa-mobile-phone', catagory: 'link', url: 'https://mijn.digizeker.nl/login' },
	mobilelistitem_110: { name: 'Afas', icon: 'fa fa-comments-o', catagory: 'link', url: 'https://klant.afas.nl/login?url=%2f%3f_ga%3d1.38674467.160281012.1430995057' },
	mobilelistitem_111: { name: 'Yuki Works', icon: 'fa fa-comments-o', catagory: 'link', url: 'https://www.yukiworks.nl/docs/Login.aspx?Central=1' }
    },
    Notaris: {
	mobilelistitem_101: { name: 'Mijn Polismap', icon: 'fa fa-cloud', catagory: 'link', url: 'https://www.polismap.nl' },
	mobilelistitem_102: { name: 'Digizeker', icon: 'fa fa-mobile-phone', catagory: 'link', url: 'https://mijn.digizeker.nl/login' },
    }
};

var social_data = {
    CareFree: {
	mobilelistitem_201: { name: 'Facebook', icon: 'flaticonbrands-facebook', catagory: 'link', url: 'https://www.facebook.com/AppTomorrow' },
	mobilelistitem_202: { name: 'Twitter', icon: 'flaticonbrands-twitter', catagory: 'link', url: 'https://twitter.com/apptomorrow' },
	mobilelistitem_203: { name: 'LinkedIn', icon: 'flaticonbrands-linkedin', catagory: 'link', url: 'https://www.linkedin.com/company/apptomorrow' }
    },
    Notaris: {
	mobilelistitem_201: { name: 'Facebook', icon: 'fa fa-facebook', catagory: 'link', url: 'https://www.facebook.com/AppTomorrow' },
	mobilelistitem_202: { name: 'Twitter', icon: 'fa fa-twitter', catagory: 'link', url: 'https://twitter.com/apptomorrow' },
	mobilelistitem_203: { name: 'LinkedIn', icon: 'fa fa-linkedin', catagory: 'link', url: 'https://www.linkedin.com/company/apptomorrow' }
    },
    AssuFree: {
	mobilelistitem_201: { name: 'Facebook', icon: 'fa fa-facebook', catagory: 'link', url: 'https://www.facebook.com/AppTomorrow' },
	mobilelistitem_202: { name: 'Twitter', icon: 'fa fa-twitter', catagory: 'link', url: 'https://twitter.com/apptomorrow' },
	mobilelistitem_203: { name: 'LinkedIn', icon: 'fa fa-linkedin', catagory: 'link', url: 'https://www.linkedin.com/company/apptomorrow' }
    }
};

var videos_data = {
    CareFree: {
	mobilelistitem_301: { name: 'Exact Online', icon: 'flaticonbrands-youtube', catagory: 'video', url: 'http://www.youtube.com/watch?v=0_o43v4t5-U' },
	mobilelistitem_302: { name: 'Online Samenwerken', icon: 'flaticonbrands-youtube', catagory: 'video', url: 'http://www.youtube.com/watch?v=y-TRarvizMg' },
	mobilelistitem_303: { name: 'Twinfield', icon: 'flaticonbrands-youtube', catagory: 'video', url: 'http://www.youtube.com/watch?v=JBWV82ImGsE' },
	mobilelistitem_304: { name: 'Visionplanner', icon: 'flaticonbrands-youtube', catagory: 'video', url: 'http://www.youtube.com/watch?v=s_WLP2zs6Cc' }
    },
    Notaris: {
	business:{
        'Exact Online Boekhouden': [
		{ name: 'Exact Online Boekhouden', icon: 'fa fa-youtube', catagory: 'video', url: 'https://youtu.be/0_o43v4t5-U' },
	    ]
    },
	featured: {
	    'Trouwen of Samenwonen': [
		{ name: 'Trouwen', icon: 'fa fa-youtube', catagory: 'video', url: 'https://www.youtube.com/watch?v=EOWiggGWFzQ' },
		{ name: 'Geregistreerd Partnerschap', icon: 'fa fa-youtube', catagory: 'video', url: 'https://www.youtube.com/watch?v=dSYkuRR6RfE' },
		{ name: 'Samenlevingscontract', icon: 'fa fa-youtube', catagory: 'video', url: 'https://www.youtube.com/watch?v=xXkbFEpjD50' },
	    ],
	    'Schenken, erven en nalaten': [
		{ name: 'Erfenis', icon: 'fa fa-youtube', catagory: 'video', url: 'https://www.youtube.com/watch?v=u-3wmFtgg_E' },
		{ name: 'Testament', icon: 'fa fa-youtube', catagory: 'video', url: 'https://www.youtube.com/watch?v=Ebi7PJdphQk' },
	    ],
	    'Levenstestament en volmacht': [
		{ name: 'Dementie en dan...', icon: 'fa fa-youtube', catagory: 'video', url: 'https://www.youtube.com/watch?v=ItqNQwmDA_w' },
		{ name: 'Volmacht', icon: 'fa fa-youtube', catagory: 'video', url: 'https://www.youtube.com/watch?v=oFfgYQbjx5w' },
		{ name: 'Levenstestament', icon: 'fa fa-youtube', catagory: 'video', url: 'https://www.youtube.com/watch?v=rXz8FyUXJuo' },
	    ],
	    'Een woning kopen of verkopen': [
		{ name: 'Een huis kopen', icon: 'fa fa-youtube', catagory: 'video', url: 'https://www.youtube.com/watch?v=ee7bSuy1B-A' },
		{ name: 'Een huis verkopen', icon: 'fa fa-youtube', catagory: 'video', url: 'https://www.youtube.com/watch?v=6OANh5mrvK8' },
	    ],
	},
    }
};

    var meer_data = {
	AssuFree: {
	    mobilelistitem_123: { name: 'Deel deze App', icon: 'fa fa-share-alt', catagory: 'function', url: 'javascript:share_app()' },
	    mobilelistitem_3: { name: 'Mijn berichtenprofiel', icon: 'fa fa-cogs', catagory: 'page', url: 'pages/assufree/berichten_profiel.html' },
	    mobilelistitem_5: { name: 'Mijn alerts', icon: 'fa fa-exclamation-triangle', catagory: 'page', url: 'pages/assufree/alerts.html' },
	    mobilelistitem_hn: { name: 'Handige Nummers', icon: 'fa fa-phone', catagory: 'page', url: 'pages/assufree/handige_nummers.html' },
	    mobilelistitem_162: { name: 'Mijn Schademelder', icon: 'fa fa-file-image-o', catagory: 'page', url: 'pages/assufree/mijn_schademelder.html' },
	    mobilelistitem_11: { name: 'Mijn Adviezen', icon: 'fa fa-file-text', catagory: 'page', url: 'pages/adviezen.html' },
	    mobilelistitem_prw: { name: 'Productwijzers', icon: 'fa fa-file-text', catagory: 'page', url: 'pages/assufree/productwijzers.html' },
	    mobilelistitem_sf: { name: 'Schadeformulieren', icon: 'fa fa-file-text', catagory: 'page', url: 'pages/assufree/schadeformulieren.html' },
	    mobilelistitem_190: { name: 'Kennisbank Particulier', icon: 'fa fa-book', catagory: 'link', url: 'http://kb-verzekering-particulier.testapptomorrow.nl/home/1' },
	    mobilelistitem_200: { name: 'Kennisbank Zakelijk', icon: 'fa fa-book', catagory: 'link', url: 'http://kb-verzekering-zakelijk.testapptomorrow.nl/home/1' },
	    mobilelistitem_15: { name: 'Videos Particulier', icon: 'fa fa-youtube', catagory: 'page', url: 'pages/assufree/video.html' },
	    mobilelistitem_250: { name: 'Videos Zakelijk', icon: 'fa fa-youtube', catagory: 'page', url: 'pages/assufree/video.html' },
	    mobilelistitem_kbh: { name: 'Kennisbank Hypotheken', icon: 'fa fa-book', catagory: 'link', url: 'http://kb-hypotheken.testapptomorrow.nl/home/15' },
	    mobilelistitem_btc: { name: 'Bijtellingscalculator', icon: 'fa fa-car', catagory: 'link', url: 'http://www.bijtelling.testapptomorrow.nl/#' },
	    mobilelistitem_cl: { name: 'Checklisten', icon: 'fa fa-check-square-o', catagory: 'page', url: 'pages/assufree/checklisten.html' },
	    mobilelistitem_13: { name: 'Brochures', icon: 'fa fa-file-pdf-o', catagory: 'page', url: 'pages/brochures.html' },
	    mobilelistitem_189: { name: 'Formulieren', icon: 'fa fa-file-o', catagory: 'page', url: 'pages/formulieren.html' },
	    mobilelistitem_186: { name: 'Whitepapers', icon: 'fa fa-file-pdf-o', catagory: 'page', url: 'pages/white_papers.html' },
	    mobilelistitem_184: { name: 'Nieuwbrieven', icon: 'fa fa-file-pdf-o', catagory: 'page', url: 'pages/nieuwsbrieven.html' },
	    mobilelistitem_260: { name: 'Polismap App', icon: 'fa fa-cloud', catagory: 'link', url: 'https://play.google.com/store/apps/details?id=com.voogd.polismap&hl=nl' },
	    mobilelistitem_17: { name: 'Polismap Online', icon: 'fa fa-cloud', catagory: 'page', url: 'pages/assufree/polismap.html' },
	    mobilelistitem_27: { name: 'Steleenvraag', icon: 'fa fa-question', catagory: 'page', url: 'pages/assufree/stel_een_vraag.html' },
	    mobilelistitem_23: { name: 'Afspraak', icon: 'fa fa-calendar', catagory: 'page', url: 'pages/assufree/afspraak.html' },
	    // mobilelistitem_23: { name: 'Klanttevredenheid', icon: 'fa fa-edit', catagory: 'page', url: 'pages/assufree/klanttevredenheid.html' },
	    // mobilelistitem_3: { name: 'Deel App via sms of mail', icon: 'fa fa-mobile', catagory: 'page', url: 'pages/deel_app.html' },
	    mobilelistitem_136: { name: 'Social Media', icon: 'fa fa-comments-o', catagory: 'page', url: 'pages/social_media.html' },
	    mobilelistitem_164: { name: 'Mijn Berichtenarcheif', icon: 'fa fa-file-o', catagory: 'page', url: 'pages/mijn_berichtenarchief.html' },
	    // mobilelistitem_3: { name: 'Ik ontvang geen berichten', icon: 'fa fa-gear', catagory: 'page', url: 'pages/ik_ontvang_geen_berichten.html' },
	    mobilelistitem_270: { name: 'Schade melden app', icon: 'fa fa-cloud', catagory: 'link', url: 'https://play.google.com/store/apps/details?id=nl.abz.os&hl=nl' },
	    mobilelistitem_280: { name: 'Schade melden online', icon: 'fa fa-cloud', catagory: 'link', url: 'http://kb-notaris.testapptomorrow.nl/home/1' },
	    mobilelistitem_210: { name: 'extra-1', icon: 'fa fa-file-o', catagory: 'link', url: '' },
	    mobilelistitem_220: { name: 'extra-2', icon: 'fa fa-file-o', catagory: 'link', url: '' },
	    mobilelistitem_230: { name: 'extra-3', icon: 'fa fa-file-o', catagory: 'link', url: '' },
        mobilelistitem_231: { name: 'Stuur voice berichten', icon: 'fa fa-play-circle', catagory: 'page', url: 'pages/recordvoice.html' },
        mobilelistitem_232: { name: 'Maak Notities', icon: 'fa fa-pencil-square', catagory: 'page', url: 'pages/createnotes.html' },
        mobilelistitem_233: { name: 'QR scanner', icon: 'fa fa-camera', catagory: 'function', url: 'javascript:scanqr()' },
	    mobilelistitem_240: { name: 'extra-4', icon: 'fa fa-file-o', catagory: 'link', url: '' },
	},
	CareFree: {
	    mobilelistitem_3: { name: 'Mijn berichtenprofiel', icon: 'fa fa-cogs', catagory: 'page', url: 'pages/carefree/berichten_profiel.html' },
	    mobilelistitem_5: { name: 'Mijn alerts', icon: 'fa fa-exclamation-triangle', catagory: 'page', url: 'pages/carefree/alerts.html' },
	    mobilelistitem_kp: { name: 'Kennisbank Personeel', icon: 'fa fa-book', catagory: 'link', url: 'http://kb-accountantapp.testapptomorrow.nl/home/1' },
	    mobilelistitem_kr: { name: 'Kennisbank Rechtspersonen', icon: 'fa fa-book', catagory: 'link', url: 'http://kb-accountant.testapptomorrow.nl/home/1' },
	    mobilelistitem_190: { name: 'Kennisbank Auto & Fiscus', icon: 'fa fa-book', catagory: 'page', url: 'pages/kennisbank.html' },
	    mobilelistitem_bf: { name: 'Belastingfeeds', icon: 'fa fa-rss', catagory: 'page', url: 'pages/belasting_feeds.html' },
	    mobilelistitem_220: { name: 'Nieuwsflitsen RSS', icon: 'fa fa-rss', catagory: 'page', url: 'pages/nieuwsflitsen_rss.html' },
	    mobilelistitem_13: { name: 'Brochures', icon: 'fa fa-file-pdf-o', catagory: 'page', url: 'pages/brochures.html' },
	    mobilelistitem_186: { name: 'Whitepapers', icon: 'fa fa-file-pdf-o', catagory: 'page', url: 'pages/white_papers.html' },
	    mobilelistitem_184: { name: 'Nieuwsbrieven', icon: 'fa fa-file-pdf-o', catagory: 'page', url: 'pages/nieuwsbrieven.html' },
	    mobilelistitem_189: { name: 'Formulieren', icon: 'fa fa-file-o', catagory: 'page', url: 'pages/formulieren.html' },
	    mobilelistitem_15: { name: 'Videos', icon: 'fa fa-youtube', catagory: 'page', url: 'pages/video.html' },
	    mobilelistitem_17: { name: 'Logins', icon: 'fa fa-cloud', catagory: 'page', url: 'pages/logins.html' },
	    mobilelistitem_260: { name: 'Exact Online App', icon: 'fa fa-cloud', catagory: 'link', url: 'https://play.google.com/store/apps/details?id=com.exact' },
	    mobilelistitem_2: { name: 'Client Online App', icon: 'fa fa-comments-o', catagory: 'link', url: 'https://play.google.com/store/apps/details?id=nl.pinkweb.clientonlineandroid' },
	    mobilelistitem_240: { name: 'Unit 4 App', icon: 'fa fa-comments-o', catagory: 'link', url: 'https://play.google.com/store/apps/details?id=com.unit4.multivers.CRM' },
	    mobilelistitem_27: { name: 'Stel een vraag', icon: 'fa fa-question', catagory: 'page', url: 'pages/carefree/stel_een_vraag.html' },
	    mobilelistitem_23: { name: 'Offerteaanvraag', icon: 'fa fa-file-text', catagory: 'page', url: 'pages/carefree/offerteaanvraag.html' },
	    mobilelistitem_25: { name: 'Enquête', icon: 'fa fa-pencil-square-o', catagory: 'page', url: 'pages/enquete.html' },
	    mobilelistitem_29: { name: 'Deel deze App', icon: 'fa fa-share-alt', catagory: 'function', url: 'javascript:share_app_2()' },
	    mobilelistitem_136: { name: 'Social media', icon: 'fa fa-comments-o', catagory: 'page', url: 'pages/social_media.html' },
	    mobilelistitem_162: { name: 'Zend foto van document', icon: 'fa fa-photo', catagory: 'page', url: 'pages/zend_photo.html' },
	    mobilelistitem_164: { name: 'Mijn berichtenarchief', icon: 'fa fa-file-o', catagory: 'page', url: 'pages/mijn_berichtenarchief.html' },
	    mobilelistitem_230: { name: 'Document Manager', icon: 'fa fa-file-o', catagory: 'page', url: 'pages/dm_login.html' },
	    mobilelistitem_231: { name: 'Stuur voice berichten', icon: 'fa fa-play-circle', catagory: 'page', url: 'pages/recordvoice.html' },
        mobilelistitem_232: { name: 'Maak Notities', icon: 'fa fa-pencil-square', catagory: 'page', url: 'pages/createnotes.html' },
        mobilelistitem_233: { name: 'QR scanner', icon: 'fa fa-camera', catagory: 'function', url: 'javascript:scanqr()' },
        mobilelistitem_500: { name: 'Ik ontvang geen berichten', icon: 'fa fa-cog', catagory: 'page', url: 'pages/ik_ontvang_geen_berichten.html' },
	},
	Notaris: {
	    mobilelistitem_3: { name: 'Mijn berichtenprofiel', icon: 'fa fa-cogs', catagory: 'page', url: 'pages/notaris/berichten_profiel.html' },
	    mobilelistitem_5: { name: 'Mijn alerts', icon: 'fa fa-exclamation-triangle', catagory: 'page', url: 'pages/notaris/alerts.html' },
	    mobilelistitem_190: { name: 'Kennisbank Particulier', icon: 'fa fa-book', catagory: 'link', url: 'http://kennisbanknotaris.testapptomorrow.nl/home/1' },
	    mobilelistitem_15: { name: 'Video\'s Particulier', icon: 'fa fa-youtube', catagory: 'page', url: 'pages/video.html?type=featured' },
	    mobilelistitem_200: { name: 'Kennisbank Zakelijk', icon: 'fa fa-book', catagory: 'link', url: 'http://kb-notaris.testapptomorrow.nl/home/1' },
	    mobilelistitem_250: { name: 'Video\'s Zakelijk', icon: 'fa fa-youtube', catagory: 'page', url: 'pages/video.html?type=business' },
	    mobilelistitem_11: { name: 'Adviezen', icon: 'fa fa-file-text', catagory: 'page', url: 'pages/adviezen.html' },
	    mobilelistitem_13: { name: 'Brochures', icon: 'fa fa-file-pdf-o', catagory: 'page', url: 'pages/brochures.html' },
	    mobilelistitem_186: { name: 'Whitepapers', icon: 'fa fa-file-pdf-o', catagory: 'page', url: 'pages/white_papers.html' },
	    mobilelistitem_184: { name: 'Nieuwsbrieven', icon: 'fa fa-file-pdf-o', catagory: 'page', url: 'pages/nieuwsbrieven.html' },
	    mobilelistitem_188: { name: 'Documenten', icon: 'fa fa-file', catagory: 'page', url: 'pages/notaris/documenten.html' },
	    mobilelistitem_17: { name: 'Logins', icon: 'fa fa-cloud', catagory: 'page', url: 'pages/logins.html' },
	    mobilelistitem_27: { name: 'Stel een vraag', icon: 'fa fa-question', catagory: 'page', url: 'pages/notaris/stel_een_vraag.html' },
	    mobilelistitem_23: { name: 'Offerteaanvraag', icon: 'fa fa-file-text', catagory: 'page', url: 'pages/notaris/offerteaanvraag.html' },
	    mobilelistitem_25: { name: 'Enquête', icon: 'fa fa-pencil-square-o', catagory: 'page', url: 'pages/enquete.html' },
	    mobilelistitem_29: { name: 'Deel deze App', icon: 'fa fa-share-alt', catagory: 'function', url: 'javascript:share_app()' },
	    mobilelistitem_123: { name: 'Promoot deze App', icon: 'fa fa-share-alt', catagory: 'link', url: 'http://archief.notarisapp.nl/share.php?id=82' },
	    mobilelistitem_136: { name: 'Social media', icon: 'fa fa-comments-o', catagory: 'page', url: 'pages/social_media.html' },
	    mobilelistitem_162: { name: 'Zend foto van document', icon: 'fa fa-photo', catagory: 'page', url: 'pages/zend_photo.html' },
	    mobilelistitem_164: { name: 'Mijn berichtenarchief', icon: 'fa fa-file-o', catagory: 'page', url: 'pages/mijn_berichtenarchief.html' },
	    mobilelistitem_230: { name: 'Document Manager', icon: 'fa fa-file-o', catagory: 'page', url: 'pages/dm_login.html' },
        mobilelistitem_231: { name: 'Stuur voice berichten', icon: 'fa fa-play-circle', catagory: 'page', url: 'pages/recordvoice.html' },
        mobilelistitem_232: { name: 'Maak Notities', icon: 'fa fa-pencil-square', catagory: 'page', url: 'pages/createnotes.html' },
        mobilelistitem_233: { name: 'QR scanner', icon: 'fa fa-camera', catagory: 'function', url: 'javascript:scanqr()' },
        mobilelistitem_500: { name: 'Ik ontvang geen berichten', icon: 'fa fa-cog', catagory: 'page', url: 'pages/ik_ontvang_geen_berichten.html' },
	    mobilelistitem_ex1: { name: 'extra-1', icon: 'fa fa-file-o', catagory: 'link', url: '' },
	    mobilelistitem_ex2: { name: 'extra-2', icon: 'fa fa-file-o', catagory: 'link', url: '' },
	    mobilelistitem_ex3: { name: 'extra-3', icon: 'fa fa-file-o', catagory: 'link', url: '' },
	    mobilelistitem_ex4: { name: 'extra-4', icon: 'fa fa-file-o', catagory: 'link', url: '' },
	},
    };

var recommendations_data = {
    CareFree: {
	mobilelistitem_401: { name: 'BV en DGA', icon: 'flaticon-list-1', catagory: 'link', url: 'http://archief.accountantapp.nl/' + newsarchiveName + '/?target=bv' },
	mobilelistitem_402: { name: 'IB-ondernemen', icon: 'flaticon-list-1', catagory: 'link', url: 'http://archief.accountantapp.nl/' + newsarchiveName + '/?target=ibondernemers' },
	mobilelistitem_403: { name: 'Particulier', icon: 'flaticon-list-1', catagory: 'link', url: 'http://archief.accountantapp.nl/' + newsarchiveName + '/?target=particulier' },
	mobilelistitem_404: { name: 'Stichting/vereniging', icon: 'flaticon-list-1', catagory: 'link', url: 'http://archief.accountantapp.nl/' + newsarchiveName + '/?target=versti' },
	mobilelistitem_405: { name: 'Kwartaalnieuws auto', icon: 'flaticon-folder-15', catagory: 'page', url: 'pages/kwartaal_updates.html' },
	mobilelistitem_406: { name: 'Nieuwsbrieven', icon: 'flaticon-folder-1', catagory: 'page', url: 'pages/nieuwsbrieven.html' }
    },
    Notaris: {
	mobilelistitem_401: { name: 'Particulier', icon: 'fa fa-file-o', catagory: 'link', url: 'http://archief.notarisapp.nl/' + newsarchiveName + '/?target=private' },
	mobilelistitem_402: { name: 'Zakelijk', icon: 'fa fa-file-o', catagory: 'link', url: 'http://archief.notarisapp.nl/' + newsarchiveName + '/?target=business' },
    },
    AssuFree: {
	mobilelistitem_401: { name: 'Particulier', icon: 'fa fa-file-o', catagory: 'link', url: 'http://archief.verzekeringsadviseurapp.nl/adviseur/' + newsarchiveName + '/?target=particulier' },
	mobilelistitem_402: { name: 'Zakelijk', icon: 'fa fa-file-o', catagory: 'link', url: 'http://archief.verzekeringsadviseurapp.nl/adviseur/' + newsarchiveName + '/?target=zakelijk' },
    }
};

var jsdoSettings = {
    serviceURI: "https://cloudapps.services/rest/jsdo/", // https://demo.brixxs.com/rest/jsdo/
    catalogURIs: "https://cloudapps.services/rest/jsdo/catalog/onlydocuments.json", // "https://demo.brixxs.com/rest/jsdo/catalog/onlydocuments.json",
    authenticationModel: "form",
    displayFields: "id,name,description,file", //"name,documentsoort,versienummer_document,description,file",
    resourceName: "Document_input",
    useSubmit: false,
    // customerId: 11197262, //tijdelijk uitgezet met freddy 29-11-2016
    tenantId: 14916103 //13235764
};


function initIconslider(){
			var icon_slider = main_app.swiper( '#home-icons-container', {
                slidesPerView: IconSliderSlidesPerView,
                slidesPerColumn: IconSliderSlidesPerColumn,
                slidesPerColumnFill: 'row',
                slidesPerGroup: 3,
                pagination: '.swiper-pagination',
                spaceBetween: IconSliderSpaceBetween,
                paginationClickable: true
			} );
        console.log("initIconslider");
}

function initImageslider(){
    var woningRecords = JSON.parse( get_global_var("WONING_RECORDS") ),
        woningId = get_global_var("CURRENT_WONING_ID");
    //populate gallery here
    /*
	var icon_slider = main_app.swiper( '#image-slider-container', {
        slidesPerView: 1,
        pagination: '.swiper-pagination',
        spaceBetween: IconSliderSpaceBetween,
        paginationHide: false,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        paginationClickable: true
	} );
    */
    var woningRecords = getWoning(),
        encodedMedia = woningRecords.encodedMedia,
        decodedMedia = decodeURIComponent(encodedMedia).replace(/'/g,'"'),
        parsedMedia, images=[];
    if(decodedMedia!=""&&decodedMedia!=null){
        parsedMedia = JSON.parse(decodedMedia);
        for(var i = 0; i < parsedMedia.media.length; i++){
            var imgUrl=containerUrl+parsedMedia.media[i][i];
            images.push(imgUrl);
        }
        var myPhotoBrowserPopup = main_app.photoBrowser({
            photos : images,
            backLinkText: 'Terug',
            type: 'standalone',
            ofText: 'van',
            theme: 'dark'
        });
        $$('.pb-popup').on('click', function () {
            if($(this).attr('data-hasImage')=='1'){
                myPhotoBrowserPopup.open();
            }
        });
        $$('.pb-indicator').on('click', function () {
            if($$('.pb-popup').attr('data-hasImage')=='1'){
                myPhotoBrowserPopup.open();
            }
        });
    }
}
