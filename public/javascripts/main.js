$(document).ready(function () {
    $('#loading').fadeOut('400', function() {
        $("#loadingcss").remove();
        $('#loading').remove();
    });
    $('#fullpage').fullpage({
        sectionsColor: ['red', 'green', 'orange', '#1fa67a', '#ccddff'],
        anchors: ['home', 'music', 'mailbox', 'dailyTask', 'zp'],
        menu: '#menu',
        scrollingSpeed: 1000,
        onLeave: function () {
            var urls = [null, 'music', 'leaveword'];
            var flags = [false, true, true];
            var navbgcolors = [false, false, 'orange'];
            var $menu = $('#menu');
            return function (index, nextIndex) {
                var flagstemp = flags;
                var navbgcolorst = navbgcolors;
                nextIndex = nextIndex - 1;
                index = index - 1;
                if (flagstemp[nextIndex]) {
                    $('.section:eq(' + nextIndex + ')>div')
                        .html('<iframe src="' + urls[nextIndex] +
                            '" frameborder="0" height="100%" width="100%"></iframe>');
                    flagstemp[nextIndex] = false;
                }
                if (navbgcolorst[index]) {
                    $menu.removeClass(navbgcolorst[index]);
                }
                if (navbgcolorst[nextIndex]) {
                    $menu.addClass(navbgcolorst[nextIndex]);
                }
            }
        }()
    });
});