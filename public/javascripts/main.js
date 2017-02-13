$(document).ready(function () {
    $('#fullpage').fullpage({
        sectionsColor: ['red', 'green', 'orange', '#1fa67a', '#ccddff'],
        anchors: ['home', 'music', 'mailbox', 'dailyTask', 'zp'],
        menu: '#menu',
        scrollingSpeed: 1000,
        onLeave: function () {
            var urls = [null, 'music', 'leaveword'];
            var flags = [false, true, true];
            return function (index, nextIndex) {
                var flagstemp = flags;
                nextIndex = nextIndex - 1;
                if (flagstemp[nextIndex]) {
                    $('.section:eq(' + nextIndex + ')>div')
                        .html('<iframe src="' + urls[nextIndex] +
                            '" frameborder="0" height="100%" width="100%"></iframe>');
                    flagstemp[nextIndex] = false;
                }
            }
        }()
    });
});